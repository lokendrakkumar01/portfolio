import { z } from 'zod';

export const experienceSchema = z.object({
  company: z.string().min(1).max(100),
  position: z.string().min(1).max(100),
  employmentType: z.enum(['full-time','part-time','internship','freelance','volunteer','leadership']).optional(),
  location: z.string().max(100).optional(),
  remote: z.boolean().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  current: z.boolean().optional(),
  description: z.string().max(2000).optional(),
  responsibilities: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  companyUrl: z.string().url().optional().or(z.literal('')),
  displayOrder: z.number().optional(),
  published: z.boolean().optional(),
});
