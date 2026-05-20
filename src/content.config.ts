import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    published: z.boolean().default(false),
    cover: z.string().optional(),
    coverQuery: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    affiliateUrl: z.string().optional(),
    affiliateLabel: z.string().optional(),
  }),
});

export const collections = { articles };
