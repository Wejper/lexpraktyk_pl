import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://lexpraktyk.pl';

const staticPages = [
  { url: '/' },
  { url: '/kancelarie/' },
];

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles', a => a.data.published);

  const urls = [
    ...staticPages.map(({ url }) => `<url><loc>${SITE}${url}</loc></url>`),
    ...articles.map(a => {
      const lastmod = a.data.publishDate.toISOString().slice(0, 10);
      return `<url><loc>${SITE}/artykuly/${a.slug}/</loc><lastmod>${lastmod}</lastmod></url>`;
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
