import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles', ({ data }) => !data.draft);

  const data = articles.map(a => {
    const idNoExt = a.id.replace(/\.(md|mdx)$/, '');
    const parts = idNoExt.split('/');
    return {
      title: a.data.title,
      description: a.data.description ?? '',
      url: `/${parts[0]}/${parts.slice(1).join('/')}/`,
      pillar: a.data.pillar ?? '',
      tags: a.data.tags ?? [],
    };
  });

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
