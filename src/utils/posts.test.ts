import { describe, it, expect } from 'vitest';
import {
  getSlugFromId,
  sortPostsByDate,
  filterPublishedPosts,
  formatDate,
} from './posts';

describe('getSlugFromId', () => {
  it('strips the .md extension from a filename', () => {
    expect(getSlugFromId('2024-01-15-my-post.md')).toBe('2024-01-15-my-post');
  });

  it('returns the string unchanged if there is no .md extension', () => {
    expect(getSlugFromId('my-post')).toBe('my-post');
  });

  it('only strips a trailing .md (not .md in the middle)', () => {
    expect(getSlugFromId('my.md.post.md')).toBe('my.md.post');
  });

  it('handles an empty string', () => {
    expect(getSlugFromId('')).toBe('');
  });

  it('handles a bare .md', () => {
    expect(getSlugFromId('.md')).toBe('');
  });
});

describe('sortPostsByDate', () => {
  const makePost = (dateStr: string) => ({ data: { date: new Date(dateStr) } });

  it('sorts posts by date in descending order (newest first)', () => {
    const posts = [
      makePost('2020-01-01'),
      makePost('2024-06-15'),
      makePost('2022-03-10'),
    ];

    const sorted = sortPostsByDate(posts);

    expect(sorted[0].data.date.getFullYear()).toBe(2024);
    expect(sorted[1].data.date.getFullYear()).toBe(2022);
    expect(sorted[2].data.date.getFullYear()).toBe(2020);
  });

  it('does not mutate the original array', () => {
    const posts = [
      makePost('2020-01-01'),
      makePost('2024-06-15'),
    ];
    const original = [...posts];

    sortPostsByDate(posts);

    expect(posts).toEqual(original);
  });

  it('returns an empty array when given an empty array', () => {
    expect(sortPostsByDate([])).toEqual([]);
  });

  it('handles a single post', () => {
    const posts = [makePost('2023-05-01')];
    const sorted = sortPostsByDate(posts);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].data.date.getFullYear()).toBe(2023);
  });
});

describe('filterPublishedPosts', () => {
  const published = { data: { title: 'Published', draft: false } };
  const draft = { data: { title: 'Draft', draft: true } };
  const noDraftField = { data: { title: 'No draft field' } as { draft?: boolean } };

  it('filters out posts with draft: true', () => {
    const result = filterPublishedPosts([published, draft]);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(published);
  });

  it('keeps posts where draft is undefined (treated as not a draft)', () => {
    const result = filterPublishedPosts([noDraftField]);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(noDraftField);
  });

  it('keeps posts with draft: false', () => {
    const result = filterPublishedPosts([published]);
    expect(result).toHaveLength(1);
  });

  it('returns an empty array when all posts are drafts', () => {
    expect(filterPublishedPosts([draft, draft])).toHaveLength(0);
  });

  it('returns an empty array for empty input', () => {
    expect(filterPublishedPosts([])).toEqual([]);
  });
});

describe('formatDate', () => {
  it('formats a date as "Mon DD, YYYY"', () => {
    const date = new Date('2024-01-15T00:00:00');
    const formatted = formatDate(date);

    // Should contain the year, a short month name, and the day
    expect(formatted).toContain('2024');
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('15');
  });

  it('formats a date at the end of the year', () => {
    const date = new Date('2023-12-31T00:00:00');
    const formatted = formatDate(date);

    expect(formatted).toContain('2023');
    expect(formatted).toContain('Dec');
    expect(formatted).toContain('31');
  });

  it('formats a date at the start of the year', () => {
    const date = new Date('2020-01-01T00:00:00');
    const formatted = formatDate(date);

    expect(formatted).toContain('2020');
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('1');
  });
});
