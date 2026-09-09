import { z } from 'zod';

export const updateGallerySchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.enum(['events','hackathons','college','projects','achievements','certificates','personal','other']).optional(),
  date: z.string().or(z.date()).optional(),
  location: z.string().max(100).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  displayOrder: z.number().optional(),
});
