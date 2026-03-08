import * as z from 'zod';

const EnvSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'VITE_CLERK_PUBLISHABLE_KEY is not set.'),
});

export const env = EnvSchema.parse(import.meta.env);
