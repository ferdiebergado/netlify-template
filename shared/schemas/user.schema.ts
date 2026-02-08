import * as z from 'zod';

export const userSchema = z.object({
  id: z.number(),
  googleId: z.string(),
  name: z.string().min(1, 'Name is required.'),
  email: z.email(),
  picture: z.string().min(1, 'Picture is required.'),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema.omit({ id: true });

export type NewUser = z.infer<typeof createUserSchema>;
