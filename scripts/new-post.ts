import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = path.join(import.meta.dirname, '..', 'src', 'content', 'blog');

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function buildFilename(date: Date, title: string): string {
  return `${formatDate(date)}-${slugify(title)}.md`;
}

export function buildFrontmatter(title: string, date: Date, draft: boolean): string {
  const lines = ['---', `title: ${title}`, `date: ${formatDate(date)}`];
  if (draft) {
    lines.push('draft: true');
  }
  lines.push('---', '', '');
  return lines.join('\n');
}

function parseArgs(args: string[]): { title: string; draft: boolean } {
  const rest = args.slice(2);
  const draft = rest.includes('--draft');
  const titleParts = rest.filter((arg) => arg !== '--draft');

  if (titleParts.length === 0) {
    console.error('Usage: npm run new-post -- "My Post Title" [--draft]');
    process.exit(1);
  }

  return { title: titleParts.join(' '), draft };
}

function main(): void {
  const { title, draft } = parseArgs(process.argv);
  const filename = buildFilename(new Date(), title);
  const filepath = path.join(BLOG_DIR, filename);

  if (fs.existsSync(filepath)) {
    console.error(`Error: File already exists: ${filepath}`);
    process.exit(1);
  }

  const content = buildFrontmatter(title, new Date(), draft);
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`Created: ${path.relative(process.cwd(), filepath)}`);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1])) {
  main();
}
