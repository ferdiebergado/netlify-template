import * as z from 'zod';

const EnvSchema = z.object({
  VITE_GOOGLE_CLIENT_ID: z.string(),
});

export const env = EnvSchema.parse(import.meta.env);
