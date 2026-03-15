import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { User } from '@shared/schemas/user.schema';
import { createTestDB } from '@testing/node/db';
import { afterEach } from 'node:test';
import type { Database } from './db';
import type { Session } from './session';
import { createSession, findSession, touchSession } from './session.repo';
import { upsertUser } from './user.repo';

describe('session repo', () => {
  const mockUser: User = {
    googleId: 'abc',
    name: 'antonio',
    email: 'tatayoyo@gmail.com',
  };

  const mockSession: Session = {
    sessionId: '123',
    userId: mockUser.googleId,
    userAgent: 'vitest',
    ip: '127.0.0.1',
    expiresAt: new Date(),
    lastActiveAt: new Date(),
  };

  let db: Database;

  beforeEach(async () => {
    db = await createTestDB();
    await upsertUser(db, mockUser);
  });

  afterEach(() => {
    db.close();
  });

  describe('createSession', () => {
    it('should save the session', async () => {
      await createSession(db, mockSession);

      const session = await findSession(db, mockSession.sessionId);

      expect(session).toEqual(mockSession);
    });
  });

  describe('findSession', () => {
    it('should find the session', async () => {
      await createSession(db, mockSession);

      const foundSession = await findSession(db, mockSession.sessionId);

      expect(foundSession).toEqual(mockSession);
    });
  });

  describe('touchSession', () => {
    it("should update the session's last active time", async () => {
      vi.useFakeTimers();
      await createSession(db, mockSession);
      const mockSessionId = mockSession.sessionId;
      const beforeTouch = await findSession(db, mockSessionId);
      const beforeLastActiveAt = beforeTouch?.lastActiveAt;

      vi.advanceTimersByTime(1000 * 60);
      await touchSession(db, mockSessionId);

      const afterTouch = await findSession(db, mockSessionId);
      const afterLastActiveAt = afterTouch?.lastActiveAt;

      expect(afterLastActiveAt).toBeDefined();
      expect(beforeLastActiveAt).toBeDefined();
      expect(afterLastActiveAt?.getTime()).toBeGreaterThan(beforeLastActiveAt?.getTime() as number);
    });
  });
});
