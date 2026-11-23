---
title: Categories, tags and the RSS feed
description: How posts are organised, how readers can follow them, and what the build generates for you.
pubDate: 2026-10-18
categories: [Guides]
tags: [rss, seo, template]
---

Every post can belong to categories and carry tags. Both are set in the front matter:

```yaml
---
title: My first post
description: One sentence that shows up in search results and link previews.
pubDate: 2026-01-31
categories: [Guides]
tags: [writing, tips]
---
```

## Categories versus tags

I use them differently, and you can too:

- **Categories** are the few broad shelves of the blog. There are usually four to eight of them: *Guides*, *Tools*, *Essays*, *Updates*.
- **Tags** are specific topics. A post can have as many as it needs: `nginx`, `markdown`, `css`.

You don't have to declare either list anywhere. The first time you use a new category or tag, its page is generated at `/categories/<name>/` or `/tags/<name>/`. There are overview pages at [/categories/](/categories/) and [/tags/](/tags/).

## Following along

The build writes an RSS feed to [/rss.xml](/rss.xml). Every page links to it in the `<head>`, so feed readers can discover it from any URL on the site. Each item carries the title, description, date, and the categories and tags of the post.

A sitemap is generated too, at `/sitemap-index.xml`, which search engines pick up through `robots.txt`.

## What the build produces

| Output | Path |
| --- | --- |
| Post pages | `/blog/<slug>/` |
| Category pages | `/categories/<slug>/` |
| Tag pages | `/tags/<slug>/` |
| RSS feed | `/rss.xml` |
| Sitemap | `/sitemap-index.xml` |

Slugs are made from the file name for posts and from the label for categories and tags, so `Open Source` becomes `open-source`.

> [!TIP]
> Set the `SITE_URL` environment variable when you build, and the feed, sitemap and canonical links all use your real domain: `SITE_URL=https://example.com npm run build`.
