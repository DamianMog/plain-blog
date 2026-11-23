---
title: No JavaScript, no trackers, no problem
description: Why this template ships zero client-side scripts, and what you still get without them.
pubDate: 2026-09-21
categories: [Essays]
tags: [performance, privacy, accessibility]
---

Open the developer tools on this page and look at the network tab. You'll find one HTML document, one stylesheet and a few font files. That's it. There are no analytics beacons, no consent banners and no scripts.

This wasn't an accident, and it isn't a limitation. It's the point of the template.

> [!NOTE]
> This demo is served through its hosting provider's CDN, which adds an email-obfuscation script to pages that show an email address. That script is not part of the template. Host the site yourself, without such a CDN, and the network tab shows exactly what is described here. `npm run verify` checks every build for scripts.

## What you get for free

When a page is just HTML and CSS:

- **It's fast.** There's nothing to download, parse or execute before the text appears.
- **It works everywhere.** Old phones, text browsers, reader modes and flaky connections all handle it fine.
- **It's private.** Nobody is told you read this post, because nothing reports it.
- **It's durable.** A page like this will still render in twenty years. A page that depends on a build of a framework might not.

## Features that normally need JavaScript

Some things usually come with a script. Here is how they're done without one:

| Feature | How |
| --- | --- |
| Mobile menu | A hidden checkbox and the `:checked` selector |
| Dark mode | `prefers-color-scheme` follows the system setting |
| Syntax highlighting | Done at build time, shipped as coloured HTML |
| Table of contents | Generated from the headings during the build |
| Footnotes | Plain anchor links in both directions |
| Fonts | Self-hosted, so no third-party font requests |

## What you give up

Honesty matters, so here is the list. There's no client-side search, no comment box and no like button. If you need those, you can add them. A static search index such as Pagefind works well alongside this template, and a comment system is one embed away.

But try living without them first. Most blogs don't need them, and the ones that do usually have readers who'd happily send an email instead.

> [!IMPORTANT]
> Adding a script later is easy. Removing one after your readers got used to it is hard. Start without.

## Print it

One more thing that costs nothing: use your browser's print dialog on any post. The navigation and footer disappear, links stay underlined, code blocks switch to black on white, and you get a clean page. Try it on [the cheat sheet](/blog/markdown-cheat-sheet/).
