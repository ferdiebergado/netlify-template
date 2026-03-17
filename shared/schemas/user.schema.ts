import * as z from 'zod';

export const sessionSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  userAgent: z.string(),
  device: z.string().optional(),
  deviceType: z.string().optional(),
  deviceVendor: z.string().optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
  ip: z.string(),
  city: z.string().optional(),
  country: z.string().optional(),
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
