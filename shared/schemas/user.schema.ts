import * as z from 'zod';

export const userSchema = z.object({
  id: z.number(),
  userId: z.string(),
  email: z.email(),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema.omit({ id: true });

export type NewUser = z.infer<typeof createUserSchema>;
