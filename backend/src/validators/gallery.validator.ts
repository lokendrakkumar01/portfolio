import { z } from 'zod';

const boolFlexible = z.boolean()
  .or(z.literal('true').transform(() => true))
  .or(z.literal('false').transform(() => false))
  .optional();

export const updateGallerySchema = z.object({
  title: z.string().min(1).max(250).optional(),
  description: z.string().max(2000).optional(),
  category: z.enum(['events', 'hackathons', 'college', 'projects', 'achievements', 'certificates', 'personal', 'other']).optional(),
  gridSpan: z.number().min(1).max(4).optional(),
  aspectRatio: z.enum(['square', 'video', 'portrait', 'wide']).optional(),
  mediaType: z.enum(['image', 'video']).optional(),
  date: z.string().or(z.date()).optional(),
  location: z.string().max(100).optional(),
  featured: boolFlexible,
  published: boolFlexible,
  displayOrder: z.number().optional(),
});
