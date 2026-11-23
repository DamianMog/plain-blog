---
title: Notes on slow software
description: A longer essay, to show what a text-heavy post looks like with comfortable line lengths.
pubDate: 2026-07-15
categories: [Essays]
tags: [software, craft]
---

I have been thinking about how long software is allowed to take.

Not how long it takes to run. That's a solved problem, or at least a well-understood one, and every year the hardware makes the answer look better. I mean how long it takes to *make*, and how long we expect it to last once it exists.

## The pace of a pot

A potter doesn't open a pot after a week to see whether the glaze is any good. The kiln takes the time it takes. The result is judged afterwards, usually by whoever has to drink from it.

Software teams rarely get that grace. A feature is promised on Monday, demonstrated on Friday and quietly rewritten the month after. The speed isn't the problem. The problem is that nobody is ever allowed to finish, so nobody ever finds out what finished would have looked like.

> Slow is not the opposite of fast. Slow is the opposite of careless.

## Three small rules

I keep a short list taped above my desk. It doesn't solve anything. It just reminds me of the pace I'd like to work at.

1. **Write it down before you build it.** A page of prose reveals more bad ideas than a day of prototyping.
2. **Delete before you add.** Every feature is a promise to maintain it. Make fewer promises.
3. **Ship something boring on purpose.** Boring technology has known failure modes. That is a feature.

## What it looks like in practice

Take this blog. It could have been a single-page application with a database, a login and a rich text editor. Instead it's a folder of text files and a build step that runs in a few seconds. There's very little to maintain, so there's very little that can break.

That's not a statement about taste. It's arithmetic. A system with ten moving parts fails in more ways than a system with two, and I'd rather spend my evenings writing than debugging.

## An imperfect conclusion

I don't think the industry will slow down because I wrote an essay. But individuals can choose their own pace, and small projects are the best place to practise. Pick one thing, make it well, leave it alone.

Then see what happens when you let it sit in the kiln.
