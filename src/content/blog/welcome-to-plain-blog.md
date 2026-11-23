---
title: Welcome to plain-blog
description: A tour of what this template gives you and where to start.
pubDate: 2026-11-20
categories: [Updates]
tags: [template, getting-started]
---

If you're reading this, the template works. This demo site shows what you get when you clone `plain-blog` and run it for the first time.

The idea is simple: **a blog should be a folder of text files**. You write Markdown, the build step turns it into static HTML, and a web server hands those files out. Nothing else runs when somebody reads your post.

## What's included

- A home page, a blog index, and pages for About, Expertise, Experience and Contact
- Categories, tags, reading time, previous and next links, and an RSS feed
- Syntax highlighting for code blocks, in both light and dark themes
- Callouts, footnotes, tables, task lists and optional tables of contents
- A sitemap, canonical URLs and Open Graph tags
- A print stylesheet, because people still print things

The posts that follow walk through each of these. Start with [the Markdown cheat sheet](/blog/markdown-cheat-sheet/) if you want to see what a post can contain, or jump to [deployment](/blog/deploy-to-your-own-server/) if you just want it online.

## Getting started

```bash
git clone https://github.com/DamianMog/plain-blog.git my-blog
cd my-blog
npm install
npm run dev
```

Then open `http://localhost:4321`. Edit `site.config.ts` to set your name, navigation and social links, and add files to `src/content/blog` to write posts.

> [!TIP]
> Posts are picked up automatically. Drop a new `.md` file into `src/content/blog` and it appears in the list, the RSS feed and the sitemap on the next build.

## Why not a CMS?

A CMS gives you an editor in the browser and a database to look after. Markdown files in a Git repository give you history, review, offline writing and backups for free. For a personal blog, the second option wins every time I try it.

That's the whole pitch. Have a look around.
