import { z } from 'zod';

export const createCertificateSchema = z.object({
  title: z.string().min(1).max(100),
  issuer: z.string().min(1).max(100),
  issueDate: z.string().or(z.date()),
  expiryDate: z.string().or(z.date()).optional(),
  credentialId: z.string().max(100).optional(),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  verificationUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
  skills: z.array(z.string()).optional(),
  category: z.enum(['programming','web-development','cloud','database','ai-ml','cybersecurity','other']).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

export const updateCertificateSchema = createCertificateSchema.partial();
