import { createClient } from '@libsql/client';
import type { User } from '@shared/schemas/user.schema';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Session } from './session';
import { createSession, findSession } from './session.repo';
import { upsertUser } from './user.repo';

describe('session repo', async () => {
  const db = createClient({
    url: ':memory:',
  });

  const migration = readFileSync('init.sql', { encoding: 'utf8' });

  await db.executeMultiple(migration);

  const user: User = {
    googleId: 'abc',
    name: 'antonio',
    email: 'tatayoyo@gmail.com',
  };

  await upsertUser(db, user);

  describe('createSession', () => {
    it('saves the session', async () => {
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
