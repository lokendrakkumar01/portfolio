import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().min(1),
  SERVER_URL: z.string().min(1),
  STORAGE_PROVIDER: z.enum(['cloudinary', 'local']).default('local'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

const parseEnv = (): Env => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(result.error.format(), null, 2));
    // In production, fallback to defaults or parse throwing error
    return envSchema.parse({
      ...process.env,
      JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret_fallback_key_2024',
      CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
      SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000',
    });
  }
  return result.data;
};

export const config: Env = parseEnv();
