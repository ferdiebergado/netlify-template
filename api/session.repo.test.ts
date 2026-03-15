import { beforeEach, describe, expect, it } from 'vitest';

import type { User } from '@shared/schemas/user.schema';
import { createTestDB } from '@testing/node/db';
import type { Database } from './db';
import type { Session } from './session';
import { createSession, findSession } from './session.repo';
import { upsertUser } from './user.repo';

describe('session repo', () => {
  let db: Database;

  beforeEach(async () => {
    db = await createTestDB();
  });

  describe('createSession', () => {
    it('should save the session', async () => {
      const user: User = {
        googleId: 'abc',
        name: 'antonio',
        email: 'tatayoyo@gmail.com',
      };
      await upsertUser(db, user);

      const mockSession: Session = {
        sessionId: 'abc',
        userId: user.googleId,
        userAgent: 'vitest',
        ip: '127.0.0.1',
        expiresAt: new Date(),
      };

      await createSession(db, mockSession);

      const session = await findSession(db, mockSession.sessionId);

      expect(session).toStrictEqual(mockSession);
    });
  });
});
