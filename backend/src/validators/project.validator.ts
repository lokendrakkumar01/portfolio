import { z } from 'zod';

// Accept a URL string that starts with http:// or https://, or an empty string, or undefined
const optionalUrl = z.string()
  .transform(v => v?.trim() ?? '')
  .refine(v => v === '' || /^https?:\/\/.+/.test(v), { message: 'Must be a valid URL starting with http:// or https://' })
  .optional()
  .or(z.literal(''))
  .or(z.undefined());

export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  shortDescription: z.string().min(1).max(500),
  description: z.string().min(1).max(10000),
  problem: z.string().max(5000).optional(),
  solution: z.string().max(5000).optional(),
  features: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  category: z.enum(['web','mobile','ai-ml','backend','open-source','academic','hackathon','other']).optional().default('web'),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  videoUrl: optionalUrl,
  documentationUrl: optionalUrl,
  featured: z.boolean().optional().default(false),
  status: z.enum(['completed','in-progress','archived']).optional().default('in-progress'),
  published: z.boolean().optional().default(false),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  displayOrder: z.number().optional().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();
