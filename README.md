# mahata.github.io

Blog powered by [Astro](https://astro.build).

## Commands

```bash
pnpm run dev      # Start dev server
pnpm run build    # Build for production
pnpm run preview  # Preview production build
pnpm test         # Run unit tests
pnpm run check    # Run type checking
```

## Writing Posts

Scaffold a new post with:

```bash
pnpm run new-post -- "My Post Title"
pnpm run new-post -- "My Draft Post" --draft
```

This creates a file like `src/content/blog/2024-01-15-my-post-title.md` with the frontmatter pre-filled.

You can also create posts manually in `src/content/blog/`:

```markdown
---
title: My Post Title
date: 2024-01-15
---

Your content here...
```

Add `draft: true` to hide from listing.

## Testing

Unit tests live in `src/utils/posts.test.ts` and cover the shared utility functions used for slug generation, post filtering, sorting, and date formatting. Tests are run with [Vitest](https://vitest.dev/).

CI (`.github/workflows/deploy.yml`) runs tests and type checking before every deploy.

## License

The content of this project is licensed under the
[Creative Commons Attribution-ShareAlike 3.0 license](http://creativecommons.org/licenses/by-sa/3.0/).
