import * as z from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string(),
  TURSO_AUTH_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
