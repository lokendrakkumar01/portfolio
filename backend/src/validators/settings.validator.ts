import { z } from 'zod';

export const updateSettingsSchema = z.object({
  siteName: z.string().min(1).max(100).optional(),
  siteTitle: z.string().min(1).max(100).optional(),
  siteDescription: z.string().max(500).optional(),
  primaryEmail: z.string().email().optional(),
  contactEnabled: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
});
