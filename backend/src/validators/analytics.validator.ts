import { z } from 'zod';

const dimension = z.number().int().min(0).max(20000).optional();

export const visitorPageViewSchema = z.object({
  visitorId: z.string().uuid(),
  sessionId: z.string().uuid(),
  path: z.string().min(1).max(512).refine((value) => value.startsWith('/') && !value.startsWith('//')),
  referrer: z.string().max(2048).optional().default(''),
  language: z.string().min(2).max(32),
  screenWidth: dimension,
  screenHeight: dimension,
  viewportWidth: dimension,
  viewportHeight: dimension,
  clientHints: z.object({
    platform: z.string().max(80).optional().default(''),
    platformVersion: z.string().max(80).optional().default(''),
    model: z.string().max(120).optional().default(''),
    mobile: z.boolean().optional(),
    brands: z.array(z.object({ brand: z.string().max(80), version: z.string().max(40) })).max(12).optional().default([]),
  }).optional().default({}),
});
