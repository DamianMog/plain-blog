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
DEPLOY_HOST=example.com \
DEPLOY_USER=deploy \
DEPLOY_PATH=/var/www/my-blog \
npm run deploy
```

Each run uploads into a fresh release folder and then switches a `current` symlink, so visitors never see a half-copied site, and the previous version is kept for a quick rollback.

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

The repository contains a GitHub Actions workflow that builds the site on every push, which catches broken front matter before it reaches the server. If you'd like pushes to deploy as well, add a step that calls `scripts/deploy.sh` and store the SSH key as a repository secret.
