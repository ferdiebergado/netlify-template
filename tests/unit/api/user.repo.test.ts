import type { Client } from '@libsql/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import findUser, { upsertUser, type UserRow } from '@api/user.repo';
import { type CreateUser } from '@shared/schemas/user.schema';
import { createTestDB } from '@testing/node/db';

vi.mock('@api/logger', async () => {
  const { mockLogger } = await import('@testing/node/logger');
  return {
    default: mockLogger,
  };
});

describe('user.repo', () => {
  const mockUser: CreateUser = {
    googleId: 'user123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    picture: 'http://example.com/avatar.jpg',
  };

  let db: Client;

  beforeEach(async () => {
    db = await createTestDB();
  });

  afterEach(() => {
    db.close();
  });

  describe('upsertUser', () => {
    it('should create a new user if googleId does not exist', async () => {
      const userId = await upsertUser(db, mockUser);
      const now = new Date();

      const sql = `SELECT * FROM users WHERE id = ? LIMIT 1`;
      const { rows } = await db.execute(sql, [userId]);
      const user = rows[0] as unknown as UserRow;

      expect(user).toMatchObject({
        google_id: mockUser.googleId,
        name: mockUser.name,
        email: mockUser.email,
        picture: mockUser.picture,
        role: 'user',
        is_active: 1,
        id: userId,
      });

      expect(new Date(user.last_login_at).getTime()).toBeCloseTo(now.getTime(), -2);
      expect(new Date(user.created_at).getTime()).toBeCloseTo(now.getTime(), -2);
      expect(new Date(user.updated_at).getTime()).toBeCloseTo(now.getTime(), -2);
    });

    it('should update the last login timestamp when a user logs in', async () => {
      await upsertUser(db, mockUser);

      vi.useFakeTimers();
      vi.advanceTimersByTime(1000 * 60 * 60);

      const userId = await upsertUser(db, mockUser);

      const sql = `SELECT last_login_at FROM users WHERE id = ? LIMIT 1`;
      const { rows } = await db.execute(sql, [userId]);
      const user = rows[0] as unknown as { last_login_at: string };
      const lastLoginAt = new Date(user.last_login_at);

      expect(lastLoginAt.getTime()).toBeCloseTo(Date.now(), -2);

      vi.useRealTimers();
    });
  });

  it('should find a user by ID', async () => {
    const userId = await upsertUser(db, mockUser);

    const now = new Date();
    const user = await findUser(db, userId);

    expect(user).toBeDefined();
    if (!user) return;

    expect(user).toMatchObject({
      googleId: mockUser.googleId,
      name: mockUser.name,
      email: mockUser.email,
      picture: mockUser.picture,
      id: userId,
      role: 'user',
      isActive: true,
    });

    expect(new Date(user.lastLoginAt).getTime()).toBeCloseTo(now.getTime(), -2);
    expect(new Date(user.createdAt).getTime()).toBeCloseTo(now.getTime(), -2);
    expect(new Date(user.updatedAt).getTime()).toBeCloseTo(now.getTime(), -2);
  });

  it('should return undefined for non-existent user', async () => {
    const user = await findUser(db, 1);
    expect(user).toBeUndefined();
  });
});
