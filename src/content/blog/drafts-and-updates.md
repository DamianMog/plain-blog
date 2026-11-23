---
title: Drafts, updates and publication dates
description: How to hide unfinished posts, mark a post as updated, and keep the archive in order.
pubDate: 2026-08-30
updatedDate: 2026-11-01
categories: [Guides]
tags: [writing, workflow]
---

Not every post is ready on the day you start it. Three front matter fields cover the whole life of a post.

## Drafts

```yaml
draft: true
```

A draft appears in `npm run dev`, marked with a small *draft* badge, so you can see how it looks while you write. It is left out of production builds completely: no page, no entry in the list, no RSS item, no sitemap entry.

This site contains a draft that you can't see. It's called `work-in-progress.md`, and you'll only find it in the repository.

## Publication date

```yaml
pubDate: 2026-08-30
```

The date decides the order of the list and the position in the RSS feed. It's the only date you need for most posts.

## Updated date

```yaml
updatedDate: 2026-11-01
```

When you make a meaningful change to a published post, add `updatedDate`. The page then shows both dates, as it does at the top of this post. Don't touch `pubDate`, because changing it re-sorts the archive and makes readers wonder what they've missed.

## A habit that works

- Start a post as `draft: true` and commit often
- Remove the line when it's ready and push
- Use `updatedDate` for corrections, not for typo fixes
- If the change is large enough that the old version would mislead, say so at the top of the post

> [!NOTE]
> Feed readers show a post once. An update to an old post will not notify anybody, so if it matters, write a short new post that links to it.
