import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  username: z.string().min(1).max(50).optional(),
  title: z.string().min(1).max(100).optional(),
  tagline: z.string().max(200).optional(),
  shortBio: z.string().max(500).optional(),
  longBio: z.string().max(5000).optional(),
  location: z.string().max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  availability: z.enum(['available','busy','not-looking']).optional(),
});
