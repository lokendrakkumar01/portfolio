import { z } from 'zod';

export const socialLinkSchema = z.object({
  platform: z.string().min(1).max(50),
  url: z.string().url(),
  username: z.string().max(50).optional(),
  icon: z.string().max(50).optional(),
  active: z.boolean().optional(),
  displayOrder: z.number().optional(),
});
