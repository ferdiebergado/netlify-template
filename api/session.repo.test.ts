import { beforeEach, describe, expect, it } from 'vitest';

import type { User } from '@shared/schemas/user.schema';
import { createTestDB } from '@testing/node/db';
import { afterEach } from 'node:test';
import type { Database } from './db';
import type { Session } from './session';
import { createSession, findSession } from './session.repo';
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

      expect(session).toStrictEqual(mockSession);
    });
  });

  describe('findSession', () => {
    it('should find the session', async () => {
      await createSession(db, mockSession);

      const foundSession = await findSession(db, mockSession.sessionId);

      expect(foundSession).toStrictEqual(mockSession);
    });
  });
});
