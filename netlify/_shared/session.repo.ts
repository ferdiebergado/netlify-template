import type { Database } from './db';
import { setSessionDuration, type Session } from './session';

export async function createSession(db: Database, session: Session): Promise<void> {
  console.log('Creating session...');

  const { userId, sessionId, expiresAt, userAgent, ip } = session;

  const sql = `
INSERT INTO
  sessions
    (
      session_id,
      user_id,
      ip_address,
      user_agent,
      expires_at
    )
VALUES
  (?, ?, ?, ?, ?)`;

  await db.execute(sql, [sessionId, userId, ip, userAgent, expiresAt.toISOString()]);
}

type TouchSessionRow = {
  user_id: number;
};

export async function touchSession(db: Database, sessionId: string): Promise<number> {
  const sql = `
UPDATE
  sessions
SET 
  last_active_at = CURRENT_TIMESTAMP,
  expires_at = ?
WHERE 
    session_id = ?
AND
    deleted_at IS NULL
RETURNING
  user_id`;

  const { expiresAt } = setSessionDuration();
  const { rows } = await db.execute<TouchSessionRow>(sql, [expiresAt.toISOString(), sessionId]);

  if (rows.length === 0) throw new Error(`session with id: ${sessionId} does not exists.`);

  return rows[0].user_id;
}
