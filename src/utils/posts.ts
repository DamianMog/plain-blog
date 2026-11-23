import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../../site.config';

export type Post = CollectionEntry<'blog'>;

/** All posts that should be visible, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function readingTime(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / site.wordsPerMinute));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export interface Term {
  slug: string;
  label: string;
  posts: Post[];
}

/** Group posts by a taxonomy field ("categories" or "tags"). */
export function groupBy(posts: Post[], field: 'categories' | 'tags'): Term[] {
  const terms = new Map<string, Term>();
  for (const post of posts) {
    for (const label of post.data[field]) {
      const slug = slugify(label);
      const term = terms.get(slug) ?? { slug, label, posts: [] };
      term.posts.push(post);
      terms.set(slug, term);
    }
  }
  return [...terms.values()].sort((a, b) => a.label.localeCompare(b.label));
}
