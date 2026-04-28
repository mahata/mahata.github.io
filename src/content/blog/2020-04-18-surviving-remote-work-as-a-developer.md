---
title: Surviving Remote Work as a Developer
date: 2020-04-18
---

When the world shifted to remote work overnight, I had to rethink how I collaborate with teammates, review code, and stay productive. After a few weeks of trial and error, here are the habits that actually stuck.

## Async-first communication

The biggest mindset change was accepting that not everything needs an immediate answer. I switched from Slack messages expecting a quick reply to writing self-contained issue comments and pull request descriptions that include all the context someone needs to respond without a back-and-forth.

A good PR description now includes:

- **What** changed and **why**
- A quick test plan or screenshot
- Links to related issues or discussions

This sounds obvious, but it dramatically reduced the number of "quick syncs" I was asking for.

## Short video walkthroughs over long documents

For complex features, I record a 3–5 minute screen capture walking through the change instead of writing a wall of text. Tools like Loom make this trivial. Viewers can pause, rewind, and comment at specific timestamps, which is far more useful than a document that may be misread.

## Keeping the terminal close

Working from home means fewer interruptions, which is great for deep work. I started keeping a second terminal window open specifically for the project I'm currently focused on, with a tmux session that persists across reconnects:

```bash
# Start a named session
tmux new -s myproject

# Later, reattach from anywhere
tmux attach -t myproject
```

Having the build output, test runner, and REPL always one keystroke away removed the friction of context-switching.

## Protect your non-work hours

This one is harder than it sounds. When your laptop is two metres from your bed, it's tempting to "just check one more thing" at 10 pm. I added a rule to my router that blocks work Slack on the home network after 8 pm. It felt drastic at first, but after a week I stopped thinking about it.

Remote work is sustainable when the boundaries are deliberate. The code will still be there in the morning.
