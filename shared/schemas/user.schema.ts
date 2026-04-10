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

export const UserSchema = z.object({
  id: z.number().int().positive(),

  // Basic Profile
  userId: z.string().min(1, 'User ID is required'),
  email: z.email('Invalid email address').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  picture: z.url('Invalid URL format').optional(),

  // Permissions
  role: z.enum(['user', 'admin']).default('user'),

  isActive: z.preprocess(Boolean, z.boolean()).default(true),

  // Timestamps (ISO 8601 Strings)
  lastLoginAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  lastLoginAt: true,
  updatedAt: true,
  createdAt: true,
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const ProfileSchema = UserSchema.pick({
  userId: true,
  name: true,
  email: true,
  picture: true,
});

export type Profile = z.infer<typeof ProfileSchema>;
