import type { User } from '@shared/schemas/user.schema';
import type { Database } from './db';

type UpsertUserRow = {
  id: number;
};

export async function upsertUser(db: Database, user: User): Promise<number> {
  console.log('Creating user...');

  const sql = `
INSERT INTO
  users
    (
      user_id,
      email,
    )
VALUES
  (?, ?)
ON CONFLICT
DO NOTHING
RETURNING
  id`;

  const { rows } = await db.execute<UpsertUserRow>(sql, [user.userId, user.email ?? '']);

  if (rows.length === 0) throw new Error('Failed to upsert user: no data returned.');

  return rows[0].id;
}

type UserRow = {
  email: string;
};

export async function getUser(db: Database, id: number): Promise<Omit<User, 'id' | 'userId'>> {
  const sql = `
SELECT
  email
FROM
  users
WHERE
  id = ?
AND
    deleted_at IS NULL`;

  const { rows } = await db.execute<UserRow>(sql, [id]);

  if (rows.length === 0) throw new Error(`User with id: ${id.toString()} does not exist.`);

  return rows[0];
}
