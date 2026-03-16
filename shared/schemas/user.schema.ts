import * as z from 'zod';

export const sessionSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  userAgent: z.string(),
  ip: z.string(),
  expiresAt: z.date(),
  lastActiveAt: z.date(),
});

export type Session = z.infer<typeof sessionSchema>;

export const userSchema = z.object({
  googleId: z.string(),
  name: z.string().optional(),
  email: z.email().optional(),
  picture: z.url().optional(),
});

export type User = z.infer<typeof userSchema>;
export type Profile = Omit<User, 'googleId'>;
