---
title: Everything you can write in a post
description: A tour of the Markdown features that render nicely in this template, from headings to footnotes.
pubDate: 2026-11-14
categories: [Guides]
tags: [markdown, writing]
toc: true
---

This post is a living style guide. Every element below is plain Markdown, and the page you're reading is the rendered result. Set `toc: true` in the front matter, as this post does, to get the table of contents above.

## Headings

Use `##` for sections and `###` for subsections. The `#` level is reserved for the post title, which comes from the front matter.

### A third-level heading

Headings get an `id` automatically, so you can link straight to them, like [this one](#tables).

## Emphasis and inline formatting

You can write *italic text*, **bold text**, ~~strikethrough~~ and `inline code`. Raw HTML is allowed too, so <kbd>Ctrl</kbd> + <kbd>S</kbd> works, and so does <mark>a highlighted phrase</mark>.

## Lists

An unordered list:

- Write the first draft quickly
- Cut it by a third
  - Then cut the adjectives
  - Then read it aloud
- Publish

An ordered list:

1. Open the file
2. Type something true
3. Save it

And a task list:

- [x] Pick a name
- [x] Write a first post
- [ ] Buy a domain
- [ ] Tell somebody

## Quotes

> The first draft of anything is rubbish.
>
> That's fine. It's supposed to be.

## Tables

Tables follow the GitHub Flavored Markdown syntax:

| Feature | Supported | Notes |
| --- | :---: | --- |
| Tables | yes | Alignment with colons |
| Footnotes | yes | See below |
| Task lists | yes | Rendered as checkboxes |
| Math | no | Add a plugin if you need it |

## Links

Link to [other posts](/blog/), to [external sites](https://astro.build) or to a section on the same page. Plain URLs like https://example.com are linked automatically.

## Footnotes

Footnotes keep the main text clean.[^1] They are collected at the bottom of the page and link back to where you were reading.[^note]

## Horizontal rules

Three dashes make a rule:

---

That's all of it. Copy this file as a starting point for your own posts.

[^1]: Like this one. They render as numbered references in square brackets.
[^note]: Footnotes can have any label, and they are numbered in the order they appear.
