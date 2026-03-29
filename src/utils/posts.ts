/**
 * Shared utility functions for blog post operations.
 *
 * These were extracted from duplicated logic across rss.xml.js,
 * index.astro, [...slug].astro, and Post.astro.
 */

/** Strip the `.md` extension from a content collection ID to produce a URL slug. */
export function getSlugFromId(id: string): string {
  return id.replace(/\.md$/, '');
}

interface Dated {
  data: { date: Date };
}

/** Sort posts by date in descending order (newest first). */
export function sortPostsByDate<T extends Dated>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

interface Draftable {
  data: { draft?: boolean };
}

/** Filter out draft posts, keeping only published ones. */
export function filterPublishedPosts<T extends Draftable>(posts: T[]): T[] {
  return posts.filter((post) => !post.data.draft);
}

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

/** Format a date as a human-readable string (e.g. "Jan 15, 2024"). */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
}
