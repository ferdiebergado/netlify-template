import * as z from 'zod';

const EnvSchema = z.object({
  VITE_APP_TITLE: z.string(),
});

export const env = EnvSchema.parse(import.meta.env);
