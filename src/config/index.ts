import * as z from 'zod';

const EnvSchema = z.object({
  VITE_GOOGLE_CLIENT_ID: z.string().min(1, 'VITE_GOOGLE_CLIENT_ID is not set.'),
});

export const env = EnvSchema.parse(import.meta.env);
