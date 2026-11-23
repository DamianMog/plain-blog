import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../../site.config';
import { getPosts } from '../utils/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: [...post.data.categories, ...post.data.tags],
    })),
    customData: `<language>${site.language}</language>`,
  });
}
