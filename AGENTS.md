# AGENTS.md

Guidance for Copilot and coding agents working in this repository.

## Repository overview

- Astro-based static blog.
- Blog posts live in `/src/content/blog`.
- Content collection schema is defined in `/src/content.config.ts`.
- Shared post utilities and tests live in `/src/utils`.

## Environment and setup

- Node.js: use version 22 (matches CI).
- Package manager: `pnpm` (`pnpm-lock.yaml` is authoritative).

Install dependencies:

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
pnpm install --frozen-lockfile
```

## Common commands

```bash
pnpm run dev      # Start Astro dev server
pnpm test         # Run Vitest tests
pnpm run check    # Run Astro/type checks
pnpm run build    # Build static site to /dist
pnpm run preview  # Preview production build
pnpm run new-post -- "Post Title" [--draft]
```

## Change guidelines

- Keep changes minimal and scoped to the requested task.
- Do not modify generated output (`/dist`) unless explicitly asked.
- Preserve existing post frontmatter schema (`title`, `date`, optional `description`, optional `draft`).
- Add or update tests only when code behavior changes.

## Validation before finishing

Run these commands before submitting changes:

```bash
pnpm test
pnpm run check
pnpm run build
```

CI runs the same checks in `.github/workflows/ci.yml` and deployment workflow in `.github/workflows/deploy.yml`.
