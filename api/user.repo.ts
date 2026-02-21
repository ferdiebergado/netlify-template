import type { NewUser, User } from '../shared/schemas/user.schema';
import type { Database } from './db';

type UpsertUserRow = {
  id: number;
};

export async function upsertUser(db: Database, user: NewUser): Promise<number> {
  console.log('Creating user...');

  const sql = `
INSERT INTO
  users
    (
      google_id,
      name,
      email,
      picture
    )
VALUES
  (?, ?, ?, ?)
ON CONFLICT
    (google_id)
  DO
  UPDATE
  SET
    last_login_at = CURRENT_TIMESTAMP
RETURNING
  id`;

  const { rows } = await db.execute<UpsertUserRow>(sql, [
    user.googleId,
    user.name,
    user.email,
    user.picture ?? '',
  ]);

  if (rows.length === 0) throw new Error('Failed to upsert user: no data returned.');

  return rows[0].id;
}

type UserRow = {
  name: string;
  email: string;
  picture: string;
};

export async function getUser(db: Database, id: number): Promise<Omit<User, 'id' | 'googleId'>> {
  const sql = `
SELECT
  name,
  email,
  picture
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
