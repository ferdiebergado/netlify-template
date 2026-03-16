import * as z from 'zod';

const envSchema = z.object({
  VITE_APP_TITLE: z.string().min(1),
  VITE_GOOGLE_CLIENT_ID: z.string({ error: 'VITE_GOOGLE_CLIENT_ID is not set.' }).min(1),
  VITE_APP_HOST: z.url({ error: 'VITE_APP_HOST is not set.' }),
});

const { success, error, data } = envSchema.safeParse(import.meta.env);
if (!success) throw new Error(z.prettifyError(error));

export const env = data;
