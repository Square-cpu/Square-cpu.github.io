import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string().min(1),
    shortTitle: z.string().optional(),
    summary: z.string().min(1),
    // Unknown dates remain absent instead of inventing a project year.
    year: z.number().int().min(1900).max(2200).optional(),
    role: z.string().optional(),
    categories: z.array(z.string()).default([]),
    technologies: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    featuredOrder: z.number().int().nonnegative().optional(),
    status: z.enum(['in-progress', 'completed', 'archived']).optional(),
    cover: z.object({ src: image(), alt: z.string().trim().min(1) }).optional(),
    links: z.array(z.object({ label: z.string().min(1), href: z.url().refine((url) => /^https?:\/\//.test(url), 'Use an HTTP(S) URL') })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
