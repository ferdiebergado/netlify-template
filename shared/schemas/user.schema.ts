import * as z from 'zod';

export const userSchema = z.object({
  userId: z.string(),
  name: z.string().optional(),
  email: z.email().optional(),
});

export type User = z.infer<typeof userSchema>;
