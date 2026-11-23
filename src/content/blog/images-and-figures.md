---
title: Images, diagrams and figures
description: Add pictures to a post with plain Markdown, and keep them readable in both colour schemes.
pubDate: 2026-10-05
categories: [Guides]
tags: [images, markdown]
---

Images work the way you'd expect. Put a file in `public/images` and reference it from the post.

```markdown
![How the build works](/images/build-flow.svg)
```

Here's the result:

![A diagram with four boxes: Markdown files, Astro build, static HTML, Nginx](/images/build-flow.svg)

## Dark mode and SVG

The diagram above is an SVG with its own `prefers-color-scheme` rule, so it follows your system theme just like the rest of the page. That's one of the nicest things about SVG: a few kilobytes, sharp at every size, and themeable.

A raster image works too, of course. For photos, use JPEG or WebP and keep the width at or below 1600 pixels. Images never exceed the width of the text column, and they scale down on small screens.

## Captions

Markdown has no caption syntax, but HTML is allowed, so a `<figure>` does the job:

<figure>
  <img src="/images/notebook.svg" alt="A simple drawing of an open notebook with a pencil" width="480" />
  <figcaption>A notebook, drawn with eleven lines of SVG.</figcaption>
</figure>

```html
<figure>
  <img src="/images/notebook.svg" alt="An open notebook with a pencil" />
  <figcaption>A notebook, drawn with eleven lines of SVG.</figcaption>
</figure>
```

## Alt text

Always write alt text. Describe what the image shows and why it matters in a sentence. If the image is purely decorative, leave the alt text empty (`alt=""`) so screen readers skip it.

> [!NOTE]
> The template doesn't process images at build time. Images are served exactly as you put them in `public/`, so optimise them before you commit them.
