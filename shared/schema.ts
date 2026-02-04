import * as z from 'zod';

export const createUserSchema = z.object({
  googleId: z.string(),
  name: z.string().min(1, 'Name is required.'),
  email: z.email(),
  picture: z.string().min(1, 'Picture is required.'),
});

export type NewUser = z.infer<typeof createUserSchema>;
