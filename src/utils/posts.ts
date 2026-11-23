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

// Letters that Unicode normalisation cannot reduce to a plain Latin letter.
const TRANSLITERATE: Record<string, string> = {
  ł: 'l',
  đ: 'd',
  ø: 'o',
  ð: 'd',
  þ: 'th',
  ß: 'ss',
  æ: 'ae',
  œ: 'oe',
  ı: 'i',
};

// Symbols that carry meaning in names such as "C++" or "C#".
const SYMBOLS: Record<string, string> = {
  '+': ' plus ',
  '#': ' sharp ',
  '&': ' and ',
};

function hash(value: string): string {
  let h = 5381;
  for (const char of value) h = ((h << 5) + h + char.codePointAt(0)!) >>> 0;
  return h.toString(36);
}

/**
 * Turn a category or tag label into a URL segment.
 * "Łódź" -> "lodz", "C++" -> "c-plus-plus", "日本語" -> "日本語".
 * Labels without any letter or digit (such as an emoji) get a stable hash.
 */
export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[łđøðþßæœı]/g, (char) => TRANSLITERATE[char])
    .replace(/[+#&]/g, (char) => SYMBOLS[char])
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `term-${hash(value)}`;
}

export function readingTime(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / site.wordsPerMinute));
}

/** Human readable date, in the site's locale and time zone. */
export function formatDate(date: Date): string {
  return date.toLocaleDateString(site.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: site.timeZone,
  });
}

/** YYYY-MM-DD in the site's time zone, for <time datetime="..."> attributes. */
export function isoDate(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: site.timeZone });
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
      // Labels that share a slug ("Node.js" and "node js") are the same term,
      // and a post carrying both must still be listed only once.
      if (!term.posts.includes(post)) term.posts.push(post);
      terms.set(slug, term);
    }
  }
  return [...terms.values()].sort((a, b) => a.label.localeCompare(b.label));
}
