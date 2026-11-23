#!/usr/bin/env bash
#
# Upload the built site (dist/) to a server over SSH.
#
# Every run creates a new release directory and then atomically points a
# "current" symlink at it, so visitors never see a half-copied site and the
# previous versions stay around for a quick rollback.
#
#   DEPLOY_HOST=example.com DEPLOY_USER=deploy DEPLOY_PATH=/var/www/my-blog npm run deploy
#
# Variables:
#   DEPLOY_HOST     server name or address (required)
#   DEPLOY_PATH     target directory on the server (required)
#   DEPLOY_USER     SSH user                       (default: root)
#   DEPLOY_PORT     SSH port                       (default: 22)
#   DEPLOY_KEY      path to a private key          (default: ssh-agent / config)
#   KEEP_RELEASES   how many releases to keep      (default: 5)
#   SKIP_BUILD      set to 1 to upload an existing dist/ without rebuilding
#
# Needs only bash, tar and ssh, so it also works where rsync is not installed.

set -euo pipefail

: "${DEPLOY_HOST:?Set DEPLOY_HOST to the server name or address}"
: "${DEPLOY_PATH:?Set DEPLOY_PATH to the target directory on the server}"

DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"

cd "$(dirname "$0")/.."

if [ "${SKIP_BUILD:-0}" != "1" ]; then
  npm run build
fi

if [ ! -f dist/index.html ]; then
  echo "dist/index.html not found. Run 'npm run build' first." >&2
  exit 1
fi

ssh_opts=(-p "$DEPLOY_PORT" -o BatchMode=yes)
if [ -n "${DEPLOY_KEY:-}" ]; then
  ssh_opts+=(-i "$DEPLOY_KEY" -o IdentitiesOnly=yes)
fi

release="$(date -u +%Y%m%d%H%M%S)"
target="$DEPLOY_PATH/releases/$release"

echo "Uploading dist/ to $DEPLOY_USER@$DEPLOY_HOST:$target"

tar -C dist -czf - . | ssh "${ssh_opts[@]}" "$DEPLOY_USER@$DEPLOY_HOST" "
  set -e
  mkdir -p '$target'
  tar -xzf - --no-same-owner -C '$target'
  chmod -R a+rX '$target'
  ln -sfn 'releases/$release' '$DEPLOY_PATH/current.tmp'
  mv -Tf '$DEPLOY_PATH/current.tmp' '$DEPLOY_PATH/current'
  cd '$DEPLOY_PATH/releases'
  ls -1dt */ | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf
"

echo "Done. Live release: $release"
