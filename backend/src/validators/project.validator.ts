import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1).max(100),
  shortDescription: z.string().min(1).max(250),
  description: z.string().min(1).max(5000),
  problem: z.string().max(2000).optional(),
  solution: z.string().max(2000).optional(),
  features: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  category: z.enum(['web','mobile','ai-ml','backend','open-source','academic','hackathon','other']).optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  documentationUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional(),
  status: z.enum(['completed','in-progress','archived']).optional(),
  published: z.boolean().optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  displayOrder: z.number().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
