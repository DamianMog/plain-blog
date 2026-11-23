---
title: Callouts for notes, tips and warnings
description: GitHub-style alert blocks are supported out of the box, with five levels of urgency.
pubDate: 2026-10-29
categories: [Guides]
tags: [markdown, writing]
---

Sometimes a sentence needs to stand out from the paragraph around it. The template supports the same alert syntax that GitHub uses in its READMEs, so the Markdown you write also reads sensibly in a plain text editor.

You start a blockquote with a marker on its own line:

```markdown
> [!NOTE]
> Useful information that people should know, even when skimming.
```

There are five types. Here is each one.

> [!NOTE]
> Useful information that people should know, even when skimming.

> [!TIP]
> Helpful advice for doing things better or more easily. Tips can contain `code`, **formatting** and [links](/blog/).

> [!IMPORTANT]
> Key information people need to know to achieve their goal.

> [!WARNING]
> Urgent information that needs immediate attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

## Longer callouts

An alert can hold more than one paragraph, and lists too:

> [!WARNING]
> Before you delete a post, check what links to it.
>
> - Other posts in `src/content/blog`
> - Your RSS readers, which keep the old URL
> - Anything on the web that points here
>
> Rename the file instead and add a redirect in your web server.

## How it works

The conversion happens in a small rehype plugin, `src/plugins/rehype-alerts.mjs`. It looks for blockquotes whose first line is `[!TYPE]`, adds a title and a CSS class, and leaves everything else alone. That means a normal blockquote like this one still works:

> Plain blockquotes stay plain.

The colours come from CSS variables, so changing them for your own palette takes a minute. They also adapt to dark mode automatically.
