#!/usr/bin/env bash
#
# Upload the built site (dist/) to a Linux server over SSH.
#
# Every run creates a new release directory and then atomically points a
# "current" symlink at it, so visitors never see a half-copied site and the
# previous releases stay around for a quick rollback.
#
#   SITE_URL=https://example.com \
#   DEPLOY_HOST=example.com DEPLOY_USER=deploy DEPLOY_PATH=/var/www/my-blog \
#   npm run deploy
#
# Variables:
#   SITE_URL        public URL of the site, used for the build (required unless SKIP_BUILD=1)
#   DEPLOY_HOST     server name or address (required)
#   DEPLOY_PATH     absolute target directory on the server (required)
#   DEPLOY_USER     SSH user                       (default: root)
#   DEPLOY_PORT     SSH port                       (default: 22)
#   DEPLOY_KEY      path to a private key          (default: ssh-agent / ssh config)
#   KEEP_RELEASES   how many releases to keep, >= 1 (default: 5)
#   SKIP_BUILD      set to 1 to upload an existing dist/ without rebuilding
#
# Needs bash, tar and ssh locally, and GNU tar, mv and coreutils on the server.
# On Windows, run it from Git Bash and prefix the command with MSYS_NO_PATHCONV=1
# so that Git Bash does not rewrite DEPLOY_PATH into a Windows path.

set -euo pipefail

fail() {
  echo "deploy: $*" >&2
  exit 1
}

: "${DEPLOY_HOST:?Set DEPLOY_HOST to the server name or address}"
: "${DEPLOY_PATH:?Set DEPLOY_PATH to the target directory on the server}"

DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"

# Values end up in a remote shell command, so only accept plain characters.
[[ "$DEPLOY_PATH" =~ ^/[A-Za-z0-9._/-]+$ ]] ||
  fail "DEPLOY_PATH must be an absolute path made of letters, digits and . _ - / (got '$DEPLOY_PATH')." \
    "On Windows, set MSYS_NO_PATHCONV=1 so Git Bash leaves the path alone."
[[ "$DEPLOY_PATH" != */ && "$DEPLOY_PATH" != "/" ]] || fail "DEPLOY_PATH must not end with a slash or be /."
[[ "$DEPLOY_HOST" =~ ^[A-Za-z0-9._:-]+$ ]] || fail "DEPLOY_HOST contains unexpected characters."
[[ "$DEPLOY_USER" =~ ^[A-Za-z0-9._-]+$ ]] || fail "DEPLOY_USER contains unexpected characters."
[[ "$DEPLOY_PORT" =~ ^[0-9]+$ ]] || fail "DEPLOY_PORT must be a number."
[[ "$KEEP_RELEASES" =~ ^[0-9]+$ && "$KEEP_RELEASES" -ge 1 ]] || fail "KEEP_RELEASES must be an integer >= 1."

cd "$(dirname "$0")/.."

if [ "${SKIP_BUILD:-0}" != "1" ]; then
  : "${SITE_URL:?Set SITE_URL to the public URL of the site, for example https://example.com}"
  npm run build
fi

[ -f dist/index.html ] || fail "dist/index.html not found. Run 'npm run build' first."

ssh_opts=(-p "$DEPLOY_PORT" -o BatchMode=yes)
if [ -n "${DEPLOY_KEY:-}" ]; then
  ssh_opts+=(-i "$DEPLOY_KEY" -o IdentitiesOnly=yes)
fi

release="$(date -u +%Y%m%d%H%M%S)"
target="$DEPLOY_PATH/releases/$release"

echo "Uploading dist/ to $DEPLOY_USER@$DEPLOY_HOST:$target"

# Release directories are named by timestamp, so sorting by name sorts by age.
# Only directories with that exact name shape are ever considered for removal,
# and the release that "current" points at is never removed.
# The remote command is built on purpose on this side (SC2029); every value in it
# was validated above.
# shellcheck disable=SC2029
tar -C dist -czf - . | ssh "${ssh_opts[@]}" "$DEPLOY_USER@$DEPLOY_HOST" "
  set -e
  mkdir -p '$target'
  tar -xzf - --no-same-owner -C '$target'
  chmod -R a+rX '$target'
  ln -sfn 'releases/$release' '$DEPLOY_PATH/current.tmp'
  mv -Tf '$DEPLOY_PATH/current.tmp' '$DEPLOY_PATH/current'
  cd '$DEPLOY_PATH/releases'
  live=\$(basename \"\$(readlink '$DEPLOY_PATH/current')\")
  ls -1 | grep -E '^[0-9]{14}\$' | sort -r | tail -n +$((KEEP_RELEASES + 1)) | while IFS= read -r old; do
    if [ \"\$old\" != \"\$live\" ]; then rm -rf -- \"\$old\"; fi
  done
"

echo "Done. Live release: $release"
