import * as z from 'zod';

const envSchema = z.object({
  VITE_GOOGLE_CLIENT_ID: z.string({ error: 'VITE_GOOGLE_CLIENT_ID is not set.' }),
});

const { success, error, data } = envSchema.safeParse(import.meta.env);
if (!success) throw new Error(z.prettifyError(error));

export const env = data;
