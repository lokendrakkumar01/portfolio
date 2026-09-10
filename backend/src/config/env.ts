import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const trimString = z.string().transform((val) => val.trim());

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
});

export type Env = z.infer<typeof envSchema>;

const parseEnv = (): Env => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(result.error.format(), null, 2));
    return envSchema.parse({
      ...process.env,
      JWT_SECRET: (process.env.JWT_SECRET || 'default_jwt_secret_fallback_key_2024').trim(),
      CLIENT_URL: (process.env.CLIENT_URL || 'http://localhost:5173').trim(),
      SERVER_URL: (process.env.SERVER_URL || 'http://localhost:5000').trim(),
    });
  }
  return result.data;
};

export const config: Env = parseEnv();
