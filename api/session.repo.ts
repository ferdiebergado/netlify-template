import type { Database } from './db';
import { NotFoundError } from './errors';
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

export async function findSession(db: Database, id: string): Promise<Session> {
  console.log('[DB]: Retrieving session...');

  const sql = `
SELECT 
    session_id,
    user_id,
    expires_at,
    user_agent,
    ip
FROM
    sessions
WHERE
    session_id = ?
    `;

  const { rows } = await db.execute<SessionRow>(sql, [id]);

  if (rows.length === 0) throw new NotFoundError(`session with id: ${id} does not exist.`);

  const { session_id, user_agent, user_id, ip, expires_at } = rows[0];
  const session: Session = {
    sessionId: session_id,
    userId: user_id,
    userAgent: user_agent,
    ip,
    expiresAt: new Date(expires_at),
  };

  return session;
}
