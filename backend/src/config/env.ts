import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const trimString = z.string().transform((val) => val.trim()).refine((val) => val.length > 0, 'Required');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGODB_URI: trimString,
  JWT_SECRET: trimString,
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: trimString,
  SERVER_URL: trimString,
  STORAGE_PROVIDER: z.enum(['cloudinary', 'local']).default('local'),
  CLOUDINARY_CLOUD_NAME: z.string().optional().transform((val) => val?.trim()),
  CLOUDINARY_API_KEY: z.string().optional().transform((val) => val?.trim()),
  CLOUDINARY_API_SECRET: z.string().optional().transform((val) => val?.trim()),
  GEMINI_API_KEY: z.string().optional().transform((val) => val?.trim()),
});

export type Env = z.infer<typeof envSchema>;

const parseEnv = (): Env => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(result.error.format(), null, 2));
    throw new Error('Invalid environment configuration. Set all required variables before starting the server.');
  }
  return result.data;
};

export const config: Env = parseEnv();
