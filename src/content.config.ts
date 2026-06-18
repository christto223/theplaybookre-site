import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const PILLARS = [
  'lead-generation',
  'marketing-and-branding',
  'sales-skills-and-scripts',
  'business-systems',
  'ai-and-technology',
  'mindset-and-performance',
  'growth-and-scaling',
  'the-fundamentals',
] as const;

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string().default('chris-linsell'),
    pillar: z.enum(PILLARS),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    accentWord: z.string().optional(),
    readTime: z.number(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const toolkit = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/toolkit' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    resourceType: z.enum(['template', 'script', 'checklist', 'calculator', 'guide']),
    pillar: z.string(),
    format: z.string(),
    featured: z.boolean().default(false),
    includes: z.array(z.string()).optional(),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, toolkit };
