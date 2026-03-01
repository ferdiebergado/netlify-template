import * as z from 'zod';

const EnvSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z.string(),
});

export const env = EnvSchema.parse(import.meta.env);
