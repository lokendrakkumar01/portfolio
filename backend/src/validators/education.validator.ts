import { z } from 'zod';

export const educationSchema = z.object({
  institution: z.string().min(1).max(100),
  degree: z.string().min(1).max(100),
  field: z.string().min(1).max(100),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  current: z.boolean().optional(),
  grade: z.string().max(20).optional(),
  description: z.string().max(1000).optional(),
  location: z.string().max(100).optional(),
  displayOrder: z.number().optional(),
  published: z.boolean().optional(),
});
