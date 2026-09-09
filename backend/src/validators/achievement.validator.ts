import { z } from 'zod';

export const createAchievementSchema = z.object({
  title: z.string().min(1).max(100),
  organization: z.string().min(1).max(100),
  event: z.string().max(100).optional(),
  date: z.string().or(z.date()),
  category: z.enum(['hackathon','competition','award','leadership','academic','technical','event','other']).optional(),
  description: z.string().max(1000).optional(),
  rank: z.string().max(50).optional(),
  position: z.string().max(50).optional(),
  verificationUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

export const updateAchievementSchema = createAchievementSchema.partial();
