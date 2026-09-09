import { z } from 'zod';

export const skillSchema = z.object({
  name: z.string().min(1).max(50),
  category: z.enum(['programming','frontend','backend','database','devops','tools','other']),
  icon: z.string().optional(),
  proficiency: z.number().min(1).max(5).optional(),
  displayOrder: z.number().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});
