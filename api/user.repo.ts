/* eslint-disable unicorn/no-null */
import type { Profile, User } from '@shared/schemas/user.schema';
import type { Database } from './db';

export async function upsertUser(db: Database, user: User): Promise<void> {
  console.log('[DB]: Upserting user...');

  const now = new Date().toISOString();

  const sql = `
INSERT INTO users (user_id, name, email, picture)
VALUES (?, ?, ?, ?)
ON CONFLICT (user_id)
DO UPDATE SET last_login_at = ?, updated_at = ?
`;

  await db.execute(sql, [
    user.googleId,
    user.name ?? null,
    user.email ?? null,
    user.picture ?? null,
    now,
    now,
  ]);
}

type UserRow = {
  name?: string;
  email?: string;
  picture?: string;
};

export default async function findUser(db: Database, id: string): Promise<Profile | undefined> {
  console.log('[DB]: Finding user...');

  const sql = `
SELECT name, email, picture
FROM users
WHERE user_id = ? AND deleted_at IS NULL
LIMIT 1
`;

  const { rows } = await db.execute<UserRow>(sql, [id]);

  if (rows.length === 0) {
    console.warn(`user with id: ${id} does not exist.`);
    return;
  }

  return rows[0];
}
