import type { Session } from '@shared/schemas/user.schema';
import type { Database } from './db';

export async function createSession(db: Database, session: Session): Promise<void> {
  console.log('[DB]: Creating session...');

  const { userId, sessionId, expiresAt, userAgent, ip, lastActiveAt } = session;

  const sql = `
INSERT INTO sessions (session_id, user_id, ip, user_agent, expires_at, last_active_at)
VALUES (?, ?, ?, ?, ?, ?)
`;

  await db.execute(sql, [
    sessionId,
    userId,
    ip,
    userAgent,
    expiresAt.toISOString(),
    lastActiveAt.toISOString(),
  ]);
}

type SessionRow = {
  session_id: string;
  user_id: string;
  expires_at: string;
  user_agent: string;
  ip: string;
  last_active_at: string;
};

export async function findSession(db: Database, id: string): Promise<Session | undefined> {
  console.log('[DB]: Retrieving session...');

  const sql = `
SELECT session_id, user_id, expires_at, user_agent, ip, last_active_at
FROM sessions
WHERE session_id = ? AND deleted_at IS NULL AND is_revoked = 0
LIMIT 1
`;

  const { rows } = await db.execute<SessionRow>(sql, [id]);

  if (rows.length === 0) {
    console.warn(`Session not found for ID: ${id}`);
    return;
  }

  const row = rows[0];
  const session: Session = {
    sessionId: row.session_id,
    userId: row.user_id,
    userAgent: row.user_agent,
    ip: row.ip,
    expiresAt: new Date(row.expires_at),
    lastActiveAt: new Date(row.last_active_at),
  };

  return session;
}

export async function touchSession(db: Database, id: string): Promise<boolean> {
  console.log('[DB]: Updating session...');

  const sql = `
UPDATE sessions
SET last_active_at = ?, updated_at = ?
WHERE session_id = ? AND deleted_at IS NULL
    `;

  const now = new Date().toISOString();

  const { rowsAffected } = await db.execute(sql, [now, now, id]);

  return rowsAffected === 1;
}

export async function softDeleteSession(db: Database, id: string): Promise<boolean> {
  const sql = `
UPDATE sessions
SET deleted_at = CURRENT_TIMESTAMP
WHERE session_id = ? AND deleted_at IS NULL
    `;

  const { rowsAffected } = await db.execute(sql, [id]);

  return rowsAffected === 1;
}
