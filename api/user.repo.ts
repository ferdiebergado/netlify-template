/* eslint-disable unicorn/no-null */
import type { Client } from '@libsql/client';

import type { Profile, User } from '@shared/schemas/user.schema';
import logger from './logger';

export async function upsertUser(db: Client, user: User): Promise<void> {
  logger.info('[DB]: Upserting user...');

  const now = new Date().toISOString();

  const sql = `
INSERT INTO users (user_id, name, email, picture)
VALUES (?, ?, ?, ?)
ON CONFLICT (user_id)
DO UPDATE SET last_login_at = ?
`;

  await db.execute(sql, [
    user.googleId,
    user.name ?? null,
    user.email ?? null,
    user.picture ?? null,
    now,
  ]);
}

type UserRow = {
  name?: string;
  email?: string;
  picture?: string;
};

export default async function findUser(db: Client, id: string): Promise<Profile | undefined> {
  logger.info('[DB]: Finding user...');

  const sql = `
SELECT name, email, picture
FROM users
WHERE user_id = ? AND deleted_at IS NULL
LIMIT 1
`;

  const { rows } = await db.execute(sql, [id]);

  if (rows.length === 0) {
    logger.warn('user not found', { userId: id });
    return;
  }

  return rows[0] as unknown as UserRow;
}
