/* eslint-disable unicorn/no-null */
import type { Profile, User } from '@shared/schemas/user.schema';
import type { Database } from './db';
import { NotFoundError } from './errors';

export async function upsertUser(db: Database, user: User): Promise<void> {
  console.log('[DB]: Upserting user...');

  const sql = `
INSERT INTO
  users
    (
      user_id,
      name,
      email,
      picture
    )
VALUES
  (?, ?, ?, ?)
ON CONFLICT
    (user_id)
  DO
  UPDATE
  SET
    last_login_at = CURRENT_TIMESTAMP`;

  await db.execute(sql, [
    user.googleId,
    user.name ?? null,
    user.email ?? null,
    user.picture ?? null,
  ]);
}

type UserRow = {
  name?: string;
  email?: string;
  picture?: string;
};

export default async function findUser(db: Database, id: string): Promise<Profile> {
  console.log('[DB]: Finding user...');

  const sql = `
SELECT 
    name,
    email,
    picture
FROM
    users
WHERE
    user_id = ?
`;

  const { rows } = await db.execute<UserRow>(sql, [id]);

  if (rows.length === 0) throw new NotFoundError(`user with id: ${id} does not exist.`);

  return rows[0];
}
