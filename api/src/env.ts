import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV:       z.enum(['development', 'staging', 'production']).default('development'),
  PORT:           z.coerce.number().default(3001),
  DATABASE_URL:   z.string().min(1),
  JWT_SECRET:     z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN:    z.string().default('http://localhost:3000'),
  // Sentry — optional in development, required in staging/production
  SENTRY_DSN:     z.string().optional(),
  SENTRY_ENV:     z.string().optional(),
  SENTRY_ORG:     z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
});

export const env = envSchema.parse(process.env);
