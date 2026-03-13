import type { Database } from './db';
import type { Session } from './session';

export async function createSession(db: Database, session: Session): Promise<void> {
  console.log('[DB]: Creating session...');

  const { userId, sessionId, expiresAt, userAgent, ip } = session;

  const sql = `
INSERT INTO
  sessions
    (
      session_id,
      user_id,
      ip,
      user_agent,
      expires_at
    )
VALUES
  (?, ?, ?, ?, ?)`;

  await db.execute(sql, [sessionId, userId, ip, userAgent, expiresAt.toISOString()]);
}

type SessionRow = {
  session_id: string;
  user_id: string;
  expires_at: string;
  user_agent: string;
  ip: string;
};

export async function findSession(db: Database, id: string): Promise<Session | undefined> {
  console.log('[DB]: Retrieving session...');

  const sql = `
SELECT session_id, user_id, expires_at, user_agent, ip
FROM sessions
WHERE session_id = ?
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
  };

  return session;
}
