import { describe, it, expect } from 'vitest';
import { slugify, formatDate, buildFilename, buildFrontmatter } from './new-post';

describe('slugify', () => {
  it('converts a simple title to a slug', () => {
    expect(slugify('My Post Title')).toBe('my-post-title');
  });

  it('strips special characters', () => {
    expect(slugify("What's New in TypeScript?")).toBe('whats-new-in-typescript');
  });

  it('collapses multiple spaces into a single hyphen', () => {
    expect(slugify('Too   many   spaces')).toBe('too-many-spaces');
  });

  it('collapses multiple hyphens into one', () => {
    expect(slugify('one---two---three')).toBe('one-two-three');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  leading and trailing  ')).toBe('leading-and-trailing');
  });

  it('handles mixed special characters and spaces', () => {
    expect(slugify('Hello, World! (2024)')).toBe('hello-world-2024');
  });

  it('preserves numbers', () => {
    expect(slugify('Top 10 Tips')).toBe('top-10-tips');
  });

  it('handles a single word', () => {
    expect(slugify('Hello')).toBe('hello');
  });

  it('handles an empty string', () => {
    expect(slugify('')).toBe('');
  });
});

describe('formatDate', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(formatDate(new Date(2024, 0, 15))).toBe('2024-01-15');
  });

  it('zero-pads single-digit months and days', () => {
    expect(formatDate(new Date(2024, 2, 5))).toBe('2024-03-05');
  });

  it('handles end of year', () => {
    expect(formatDate(new Date(2023, 11, 31))).toBe('2023-12-31');
  });
});

describe('buildFilename', () => {
  it('combines date and slugified title', () => {
    expect(buildFilename(new Date(2024, 5, 15), 'My New Post')).toBe(
      '2024-06-15-my-new-post.md',
    );
  });

  it('handles titles with special characters', () => {
    expect(buildFilename(new Date(2024, 0, 1), "What's New?")).toBe(
      '2024-01-01-whats-new.md',
    );
  });
});

describe('buildFrontmatter', () => {
  it('generates frontmatter without draft', () => {
    const result = buildFrontmatter('My Post', new Date(2024, 0, 15), false);
    expect(result).toBe('---\ntitle: My Post\ndate: 2024-01-15\n---\n\n');
  });

  it('generates frontmatter with draft: true', () => {
    const result = buildFrontmatter('Draft Post', new Date(2024, 0, 15), true);
    expect(result).toBe(
      '---\ntitle: Draft Post\ndate: 2024-01-15\ndraft: true\n---\n\n',
    );
  });

  it('preserves the exact title string', () => {
    const result = buildFrontmatter(
      "What's New in TypeScript?",
      new Date(2024, 5, 1),
      false,
    );
    expect(result).toContain("title: What's New in TypeScript?");
  });
});
