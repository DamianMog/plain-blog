---
title: Deploying to your own server
description: Build the site, copy the files, point Nginx at them. A complete walkthrough for a small VPS.
pubDate: 2026-09-08
categories: [Tools]
tags: [nginx, deployment, linux]
toc: true
---

The build output is a folder of static files, so deployment is a copy operation. This post covers the manual route, which is the one that runs this demo.

## 1. Build the site

```bash
SITE_URL=https://example.com npm run build
```

The finished site is in `dist/`. You can check it locally first with `npm run preview`.

## 2. Create the web root

On the server:

```bash
sudo mkdir -p /var/www/my-blog
sudo chown "$USER": /var/www/my-blog
```

## 3. Copy the files

The repository includes `scripts/deploy.sh`, which packs `dist/` into a tarball and unpacks it on the server over SSH. It needs nothing but `tar` and `ssh`, so it also works on machines without `rsync`.

```bash
SITE_URL=https://example.com \
DEPLOY_HOST=example.com \
DEPLOY_USER=deploy \
DEPLOY_PATH=/var/www/my-blog \
npm run deploy
```

Each run builds the site, uploads it into a fresh release folder and then switches a `current` symlink, so visitors never see a half-copied site. The last five releases are kept for a quick rollback, and the live one is never removed.

> [!NOTE]
> On Windows, run the command from Git Bash and put `MSYS_NO_PATHCONV=1` in front of it. Otherwise Git Bash turns `/var/www/my-blog` into a Windows path. The script notices and stops instead of uploading to the wrong place.

> [!TIP]
> To roll back, point the symlink at the previous release: `ln -sfn releases/<old-release> current`.

## 4. Configure Nginx

A complete server block is in `deploy/nginx.conf.example`. The essential parts look like this:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com;

    root /var/www/my-blog/current;
    index index.html;

    # Keep redirects such as /about -> /about/ relative.
    absolute_redirect off;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;

    # Fingerprinted assets can be cached for a long time.
    location /_astro/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

The server block sets `absolute_redirect off`, so a redirect from `/about` to `/about/` stays on whatever scheme and host the visitor used. Without it, a site behind a CDN that terminates HTTPS gets redirected to plain `http://`.

Enable it and reload:

```bash
sudo ln -s /etc/nginx/sites-available/my-blog /etc/nginx/sites-enabled/my-blog
sudo nginx -t && sudo systemctl reload nginx
```

## 5. HTTPS

If you're behind a CDN or a hosting provider that terminates TLS for you, you're done. Otherwise, [Certbot](https://certbot.eff.org/) will add a certificate and the redirect to your server block with one command.

> [!WARNING]
> Always run `nginx -t` before reloading. A typo in one server block can take down every site on the machine.

## Automating it

The repository contains a GitHub Actions workflow that type-checks, tests and builds the site on every push, then runs a verifier over the output. It fails on broken front matter, broken internal links, leaked drafts and any stray `<script>`, before anything reaches the server. If you'd like pushes to deploy as well, add a step that calls `scripts/deploy.sh` and store the SSH key as a repository secret.
