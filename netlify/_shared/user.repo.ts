import type { NewUser } from '../../shared/schemas/user.schema';
import type { Database } from './db';

type UpsertUserRow = {
  id: number;
};

export async function upsertUser(
  db: Database,
  { googleId, name, email, picture }: NewUser
): Promise<number> {
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

  const { rows } = await db.execute<UpsertUserRow>(sql, [googleId, name, email, picture]);

  if (rows.length === 0) throw new Error('Failed to upsert user: no data returned.');

  return rows[0].id;
}
