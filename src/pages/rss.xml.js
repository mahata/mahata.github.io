import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { filterPublishedPosts, sortPostsByDate, getSlugFromId } from '../utils/posts';

export async function GET(context) {
  const posts = await getCollection('blog');
  const sortedPosts = sortPostsByDate(filterPublishedPosts(posts));

  return rss({
    title: 'Relentlessly prune bullshit!',
    description: 'Memoranda of computer topics.',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${getSlugFromId(post.id)}/`,
    })),
  });
}
