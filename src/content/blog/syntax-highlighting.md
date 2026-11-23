---
title: Syntax highlighting without a single script
description: Code blocks are highlighted at build time, in two themes, in more than 200 languages.
pubDate: 2026-11-07
categories: [Tools]
tags: [code, css, markdown]
toc: true
---

Code blocks are highlighted while the site is built, so the browser receives plain HTML with colours already applied. No highlighter library is downloaded and nothing runs on the page.

The colours switch with your system's light or dark setting. Try toggling it and watch the blocks below.

## Shell

```bash
#!/usr/bin/env bash
set -euo pipefail

for file in src/content/blog/*.md; do
  words=$(wc -w < "$file")
  echo "$(basename "$file"): $words words"
done
```

## Go

```go
package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "ok")
	})

	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
```

## TypeScript

```ts
interface Post {
  title: string;
  pubDate: Date;
  tags: string[];
}

export function newest(posts: Post[], count = 3): Post[] {
  return [...posts]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, count);
}
```

## Python

```python
from collections import Counter
from pathlib import Path


def word_frequencies(folder: str, top: int = 5) -> list[tuple[str, int]]:
    words = []
    for path in Path(folder).glob("*.md"):
        words += path.read_text(encoding="utf-8").lower().split()
    return Counter(words).most_common(top)
```

## SQL

```sql
SELECT category, COUNT(*) AS posts
FROM posts
WHERE published_at >= date('now', '-1 year')
GROUP BY category
ORDER BY posts DESC;
```

## Makefile

```makefile
.PHONY: help build

help: ## Show all commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "%-12s %s\n", $$1, $$2}'

build: ## Build the site
	npm run build
```

## Diffs and config files

```diff
- tagline: 'Software, Notebooks, Coffee, Long Walks'
+ tagline: 'Your own tagline goes here'
```

```json
{
  "name": "plain-blog",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build"
  }
}
```

## Customising the themes

The two themes are set in `astro.config.mjs`:

```js
markdown: {
  shikiConfig: {
    themes: { light: 'solarized-light', dark: 'github-dark-dimmed' },
    defaultColor: false,
    wrap: true,
  },
},
```

Any theme bundled with Shiki will work. Long lines wrap instead of scrolling sideways, which is friendlier on phones.

> [!NOTE]
> Inline code such as `npm run build` gets a subtle background but isn't syntax highlighted. Only fenced blocks are.
