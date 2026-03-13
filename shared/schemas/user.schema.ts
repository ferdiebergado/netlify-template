import * as z from 'zod';

export const userSchema = z.object({
  googleId: z.string(),
  name: z.string().optional(),
  email: z.email().optional(),
  picture: z.url().optional(),
});

export type User = z.infer<typeof userSchema>;

export type Profile = Omit<User, 'id' | 'googleId'>;
