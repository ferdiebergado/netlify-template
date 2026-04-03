import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { User } from '@shared/schemas/user.schema';
import { createTestDB } from '@testing/node/db';
import type { Database } from './db';
import findUser, { upsertUser } from './user.repo';

vi.mock('@api/logger', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('user.repo', () => {
  const mockUser: User = {
    googleId: 'user123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    picture: 'http://example.com/avatar.jpg',
  };

  let db: Database;

  beforeEach(async () => {
    db = await createTestDB();
    await upsertUser(db, mockUser);
  });

  afterEach(() => {
    db.close();
  });

  it('should upsert a user into the database', async () => {
    vi.useFakeTimers();
    vi.advanceTimersByTime(1000 * 60 * 60);

    await upsertUser(db, mockUser);

    const sql = `SELECT last_login_at FROM users WHERE user_id = ? LIMIT 1`;
    const { rows } = await db.execute<{ last_login_at: string }>(sql, [mockUser.googleId]);
    const lastLoginAt = new Date(rows[0].last_login_at);

    expect(lastLoginAt.getTime()).toBeCloseTo(Date.now(), -2);
  });

  it('should find a user by ID', async () => {
    const user = await findUser(db, mockUser.googleId);

    expect(user).toEqual({
      name: mockUser.name,
      email: mockUser.email,
      picture: mockUser.picture,
    });
  });

  it('should return undefined for non-existent user', async () => {
    const user = await findUser(db, 'nonexistent');
    expect(user).toBeUndefined();

    const logger = await import('@api/logger');
    expect(logger.default.warn).toHaveBeenCalledWith('user not found', { userId: 'nonexistent' });
  });
});
