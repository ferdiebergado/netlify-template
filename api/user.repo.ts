/* eslint-disable unicorn/no-null */
import type { Client } from '@libsql/client';

import { ProfileSchema, type Profile } from '@shared/schemas/user.schema';
import logger from './logger';

export async function upsertUser(db: Client, user: Profile): Promise<void> {
  logger.info('[DB]: Upserting user...');

  const now = new Date().toISOString();

  const sql = `
INSERT INTO users (user_id, name, email, picture)
VALUES (?, ?, ?, ?)
ON CONFLICT (user_id)
DO UPDATE SET last_login_at = ?
`;

  await db.execute(sql, [
    user.userId,
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
WHERE user_id = ? AND is_active = 1
LIMIT 1
`;

  const { rows } = await db.execute(sql, [id]);

  if (rows.length === 0) {
    logger.warn('user not found', { userId: id });
    return;
  }

  const user = rows[0] as unknown as UserRow;

  return ProfileSchema.parse({
    userId: id,
    name: user.name,
    email: user.email,
    picture: user.picture,
  });
}
