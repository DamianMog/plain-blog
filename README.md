# plain-blog: a minimal Astro blog template with zero JavaScript

[![CI](https://github.com/DamianMog/plain-blog/actions/workflows/ci.yml/badge.svg)](https://github.com/DamianMog/plain-blog/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with Astro](https://img.shields.io/badge/built%20with-Astro-ff5d01.svg?logo=astro&logoColor=white)](https://astro.build)
![Node.js 22.23.4+](https://img.shields.io/badge/node-%E2%89%A5%2022.23.4-339933.svg?logo=nodedotjs&logoColor=white)
![Client-side JavaScript: 0 KB](https://img.shields.io/badge/client--side%20JS-0%20KB-brightgreen.svg)
[![Live demo](https://img.shields.io/badge/demo-demo.mikrus.dev-8b4513.svg)](https://demo.mikrus.dev)

**plain-blog** is a free, open-source blog and personal website template for [Astro](https://astro.build). You write Markdown, the build produces plain static HTML and CSS, and any web server can host the result. No trackers, no ads, no cookies and no client-side JavaScript.

[**Live demo**](https://demo.mikrus.dev) · [Quick start](#quick-start) · [Features](#features) · [Writing posts](#writing) · [Deploying](#deploying) · [Inspiration](#inspiration)

| Light mode | Dark mode |
| --- | --- |
| ![plain-blog post page in light mode, showing callouts, tags and reading time](docs/preview-light.png) | ![plain-blog post page in dark mode, showing callouts, tags and reading time](docs/preview-dark.png) |

The design is inspired by the personal site and blog of [Luciano Nooijen](https://lucianonooijen.com/): a warm, monospaced, text-first layout. See [Inspiration](#inspiration).

## Why plain-blog?

- **Fast.** A typical post, including its code highlighting and self-hosted font, weighs under 50 KB transferred.
- **Private.** No analytics, no third-party requests, no consent banner needed.
- **Durable.** The output is HTML and CSS, so it keeps working long after today's frameworks have moved on.
- **Easy to own.** Posts are Markdown files in Git. There is no database and no admin panel to maintain.
- **Complete enough.** Categories, tags, RSS, sitemap, dark mode, syntax highlighting and SEO metadata are included, so you can start writing on day one.

Good for personal blogs, developer portfolios, project documentation notes and digital gardens.

## Features

- **Pages and posts as Markdown.** About, Expertise, Experience and Contact are plain Markdown files, the blog is a folder of posts, and the home page takes its texts from `site.config.ts`.
- **Categories and tags**, with overview pages and a page per term.
- **Reading time**, previous/next post links and an optional table of contents per post.
- **Syntax highlighting** at build time with separate light and dark themes ([Shiki](https://shiki.style)).
- **Callouts** using GitHub's alert syntax (`> [!NOTE]`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`).
- **GitHub-flavoured Markdown**: tables (with column alignment, scrollable on small screens), task lists, footnotes, strikethrough.
- **Dark mode** that follows the visitor's system setting, with no toggle script.
- **Drafts and updated dates** in the front matter.
- **RSS feed**, **sitemap**, canonical URLs and Open Graph tags.
- **Print stylesheet** that strips navigation and switches code to black on white.
- **Mobile navigation without JavaScript** (CSS only).
- **Self-hosted font.** No requests to third parties, no trackers, no cookies.
- **Deploy script** (`tar` + `ssh`, atomic release switch, rollback) and an example Nginx config.
- **Checked on every push**: type check, unit tests for the Markdown plugins, and a build verifier that fails on any `<script>`, third-party URL, broken internal link or leaked draft.

## Quick start

Requires Node.js 22.23.4 or newer.

```bash
git clone https://github.com/DamianMog/plain-blog.git my-blog
cd my-blog
npm install
npm run dev
```

Open http://localhost:4321. Production build:

```bash
SITE_URL=https://example.com npm run build   # output goes to dist/
npm run preview                              # serve dist/ locally
```

## Make it yours

Everything personal lives in one file, [`site.config.ts`](site.config.ts): site title, tagline, description, navigation, social links, footer text and the number of posts on the home page.

Set the public URL at build time. The canonical links, Open Graph URLs, RSS feed, sitemap and `robots.txt` are all generated from it:

```bash
SITE_URL=https://example.com npm run build
```

Without `SITE_URL` the build falls back to `http://localhost:4321` and prints a warning.

Dates use the `locale` and `timeZone` settings in `site.config.ts`. The interface text (for example "Reading time") is English; to translate it, edit the components in `src/components` and `src/pages`.

The colour palette and typography are CSS variables at the top of [`src/styles/global.css`](src/styles/global.css).

## Writing

```
src/content/
  blog/     one Markdown file per post
  pages/    About, Expertise, Experience, Contact (one Markdown file each)
```

A post starts with front matter:

```yaml
---
title: My first post
description: One sentence for search results and link previews.
pubDate: 2026-01-31
updatedDate: 2026-02-10   # optional
categories: [Guides]
tags: [writing, tips]
toc: true                 # optional table of contents
draft: true               # optional, hidden from production builds
---
```

The file name becomes the URL: `src/content/blog/my-first-post.md` is served at `/blog/my-first-post/`.

To add a page to the navigation, create a file in `src/content/pages` (subfolders work too, so `pages/docs/setup.md` is served at `/docs/setup/`) and add a matching entry to `nav` in `site.config.ts`.

Category and tag names can contain any characters. Their URLs are derived automatically: `Łódź` becomes `/categories/lodz/`, `C++` becomes `/tags/c-plus-plus/`, and names in non-Latin scripts are kept as they are.

Static files such as images go in `public/` and are referenced from the site root, for example `![Alt text](/images/photo.jpg)`.

## Project layout

```
site.config.ts            site-wide settings
astro.config.mjs          Astro, Markdown and syntax highlighting setup
src/
  content.config.ts       front matter schema for posts and pages
  content/                your Markdown
  components/             header, footer, post list
  layouts/BaseLayout.astro
  pages/                  routes: home, blog, categories, tags, RSS, 404
  plugins/                callout blocks, scrollable tables
  styles/global.css       all styling
  utils/posts.ts          sorting, grouping, slugs, dates, reading time
public/                   favicon and images
scripts/deploy.sh         upload dist/ to a server over SSH
scripts/verify-build.mjs  checks a finished build (no scripts, no broken links, no drafts)
tests/                    unit tests for the Markdown plugins
deploy/nginx.conf.example example Nginx server block
```

## Deploying

The build output is a folder of static files, so any static host that serves the site from the root of a domain works (Nginx, Caddy, Netlify, Cloudflare Pages, S3 behind a CDN, ...). Serving it from a sub-path, such as a GitHub Pages project site at `user.github.io/repo/`, is not supported, because all internal links are root-relative.

To deploy to your own Linux server over SSH:

```bash
SITE_URL=https://example.com \
DEPLOY_HOST=example.com \
DEPLOY_USER=deploy \
DEPLOY_PATH=/var/www/my-blog \
npm run deploy
```

[`scripts/deploy.sh`](scripts/deploy.sh) builds the site, uploads `dist/` as a new release directory and atomically switches a `current` symlink to it. It keeps the last five releases (`KEEP_RELEASES`) and never removes the live one. It needs `bash`, `tar` and `ssh` locally, and GNU tar and coreutils on the server.

On Windows, run it from Git Bash and add `MSYS_NO_PATHCONV=1` in front of the command. Otherwise Git Bash rewrites `/var/www/my-blog` into a Windows path (the script detects this and stops).

To roll back, point the symlink at an older release on the server: `ln -sfn releases/<old-release> current`.

Point your web server's document root at `<DEPLOY_PATH>/current`. A ready-to-adapt Nginx server block is in [`deploy/nginx.conf.example`](deploy/nginx.conf.example). The demo walkthrough is also available as a post on the [demo site](https://demo.mikrus.dev/blog/deploy-to-your-own-server/).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with live reload (drafts visible) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Type-check the Astro and TypeScript code |
| `npm test` | Unit tests for the Markdown plugins |
| `npm run verify` | Check a finished build for scripts, third-party URLs, broken links and leaked drafts |
| `npm run deploy` | Build and upload with `scripts/deploy.sh` |

## Notes on the demo content

The demo site's author, employers and links are fictional placeholder content, released under the same MIT license as the code. Replace the files in `src/content` and the values in `site.config.ts` with your own.

The template itself ships no JavaScript, and `npm run verify` enforces it. The live demo, however, is served through the hosting provider's CDN, which injects its own email-obfuscation script into pages that contain an email address. If you host the site yourself without such a CDN, your pages contain no scripts at all.

## Inspiration

This template is inspired by [lucianonooijen.com](https://lucianonooijen.com/), the personal site and blog of Luciano Nooijen, a freelance software engineer. Several ideas come from there: the monospaced typeface on a warm paper background, the minimal navigation (About, Expertise, Experience, Blog, Contact), the blog index with categories, reading time and tags, and the principle that a website should be simple, content-first and free of trackers and ads.

It is not a copy or a fork. The original site is built with Hugo and its source is published under AGPL-3.0, while everything in this repository (code, styles and demo content) was written from scratch for Astro and is released under the MIT license. If you like this style, go and read the original blog.

## License

[MIT](LICENSE)
