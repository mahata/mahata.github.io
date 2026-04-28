---
title: Using LLMs as a Coding Pair Partner
date: 2025-01-20
---

I've been using AI assistants for coding for over a year now and my workflow has shifted significantly. Rather than reaching for a search engine every time I hit a snag, my first instinct is to describe the problem in plain language and iterate from there.

## What works well

**Generating boilerplate.** Writing a test suite for a new module, scaffolding a CLI flag parser, or setting up middleware chains — these tasks have predictable shapes that LLMs handle reliably. I spend less time on setup and more time on the interesting parts.

**Explaining unfamiliar code.** When I open a legacy codebase or a library I've never touched, pasting a function and asking "what does this do, and are there any subtle edge cases?" gives me a starting point much faster than reading documentation I may not even find.

**Rubber duck debugging.** Describing a bug out loud — even to an LLM — forces me to articulate the problem, which often reveals the solution before I even read the response.

## What doesn't work well

**Anything requiring access to current state.** LLMs have a training cutoff. APIs change, package versions advance, deprecations happen. Always verify generated code against official documentation, especially for infrastructure or security-sensitive code.

**Long context with subtle dependencies.** If a bug spans five files and depends on a non-obvious invariant, the model often misses the connection. Breaking the problem into smaller, self-contained questions works better.

**Trusting output blindly.** The confident tone of generated code is exactly why it's dangerous. I treat every snippet as a draft — useful for structure, but requiring review before committing.

## A practical prompt pattern

When asking for code, I've found this structure gets better results:

```
Context: [brief description of the system or module]
Goal: [what I want to achieve]
Constraints: [language version, library, performance requirement]
Current attempt: [what I've tried, and what went wrong]
```

For example:

```
Context: Go HTTP handler using the standard library
Goal: parse a Bearer token from the Authorization header and return 401 if missing
Constraints: Go 1.22, no external auth libraries
Current attempt: using strings.Split — it panics when the header is empty
```

A specific, constrained question produces a specific, useful answer.

## The part that hasn't changed

Code review, design decisions, and understanding the trade-offs of a system still require human judgment. LLMs are excellent at tactics; strategy is still yours.

The best thing about having a tireless pair partner that never gets bored is that you can ask the "stupid" question you'd be embarrassed to ask a colleague. That alone has accelerated how quickly I pick up new languages and frameworks.
