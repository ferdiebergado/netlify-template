import type { Client } from '@libsql/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createSession, findSession, softDeleteSession, touchSession } from '@api/session/repo';
import { upsertUser } from '@api/user/repo';
import type { CreateSession } from '@shared/schemas/session.schema';
import type { CreateUser } from '@shared/schemas/user.schema';
import { createTestDB } from '@testing/node/db';

vi.mock('@api/logger', async () => {
  const { mockLogger } = await import('@testing/node/logger');
  return {
    default: mockLogger,
  };
});

describe('session repo', () => {
  const now = new Date();

  const mockUser: CreateUser = {
    googleId: 'abc123',
    name: 'antonio',
    email: 'tatayoyo@gmail.com',
    picture: 'https://example.com/avatar.jpg',
  };

  const mockSession: CreateSession = {
    sessionId: '123',
    userId: 0,
    expiresAt: new Date(now.getTime() + 1000 * 60 * 60),
  };

  let db: Client;

  beforeEach(async () => {
    db = await createTestDB();
    const userId = await upsertUser(db, mockUser);
    mockSession.userId = userId;
  });

  afterEach(() => {
    db.close();
  });

  describe('createSession', () => {
    it('should save the session', async () => {
      const session = await createSession(db, mockSession);

      expect(session.sessionId).toEqual(mockSession.sessionId);
      expect(session.userId).toEqual(mockSession.userId);
      expect(session.expiresAt).toEqual(mockSession.expiresAt);
      expect(new Date(session.lastActiveAt).getTime()).toBeCloseTo(now.getTime(), -2);
    });
  });

  describe('findSession', () => {
    it('should find the session', async () => {
      await createSession(db, mockSession);
      const now = new Date();

      const foundSession = await findSession(db, mockSession.sessionId);

      expect(foundSession?.userId).toEqual(mockSession.userId);
      expect(foundSession?.expiresAt).toEqual(mockSession.expiresAt);
      expect(new Date(foundSession?.lastActiveAt as string).getTime()).toBeCloseTo(
        now.getTime(),
        -2
      );
    });
  });

  describe('touchSession', () => {
    it("should update the session's last active time", async () => {
      await createSession(db, mockSession);
      const mockSessionId = mockSession.sessionId;
      const beforeTouch = await findSession(db, mockSessionId);
      const beforeLastActiveAt = beforeTouch?.lastActiveAt;
      expect(beforeLastActiveAt).toBeDefined();

      vi.useFakeTimers();
      vi.advanceTimersByTime(1000 * 60);
      await touchSession(db, mockSessionId);

      const afterTouch = await findSession(db, mockSessionId);
      const afterLastActiveAt = afterTouch?.lastActiveAt;
      expect(afterLastActiveAt).toBeDefined();

      const lastActiveDate = new Date(afterLastActiveAt as string);
      const beforeLastActiveDate = new Date(beforeLastActiveAt as string);
      expect(lastActiveDate.getTime()).toBeGreaterThan(beforeLastActiveDate.getTime());
    });
  });

  describe('softDeleteSession', () => {
    it("should set the session's deleted_at field", async () => {
      await createSession(db, mockSession);

      const isSoftDeleted = await softDeleteSession(db, mockSession.sessionId);

      expect(isSoftDeleted).toBe(true);
    });
  });
});
