/* eslint-disable unicorn/no-null */
import type { Session } from '@shared/schemas/user.schema';
import type { Database } from './db';
import logger from './logger';

export async function createSession(db: Database, session: Session): Promise<void> {
  logger.info('[DB]: Creating session...');

  const sql = `
INSERT INTO sessions (session_id, user_id, ip, user_agent, device, device_type, device_vendor, browser, os, city, country, expires_at, last_active_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  await db.execute(sql, [
    session.sessionId,
    session.userId,
    session.ip,
    session.userAgent,
    session.device ?? null,
    session.deviceType ?? null,
    session.deviceVendor ?? null,
    session.browser ?? null,
    session.os ?? null,
    session.city ?? null,
    session.country ?? null,
    session.expiresAt.toISOString(),
    session.lastActiveAt.toISOString(),
  ]);
}

type SessionRow = {
  session_id: string;
  user_id: string;
  expires_at: string;
  user_agent: string;
  ip: string;
  last_active_at: string;
  device: string;
  device_type: string;
  device_vendor: string;
  browser: string;
  os: string;
  city?: string;
  country?: string;
};

export async function findSession(db: Database, id: string): Promise<Session | undefined> {
  logger.info('[DB]: Retrieving session...');

  const sql = `
SELECT session_id, user_id, expires_at, user_agent, ip, device, device_type, device_vendor, browser, os, city, country, last_active_at
FROM sessions
WHERE session_id = ? AND deleted_at IS NULL AND is_revoked = 0
LIMIT 1
`;

  const { rows } = await db.execute<SessionRow>(sql, [id]);

  if (rows.length === 0) {
    reportMissingSession(id);
    return;
  }

  return mapSessionRowToSession(rows[0]);
}

export async function touchSession(db: Database, id: string): Promise<Session | undefined> {
  logger.info('Updating session...', { layer: 'db' });

  const sql = `
UPDATE sessions
SET last_active_at = ?, updated_at = ?
WHERE session_id = ? AND deleted_at IS NULL
RETURNING *
    `;

  const now = new Date().toISOString();

  const { rows } = await db.execute<SessionRow>(sql, [now, now, id]);

  if (rows.length === 0) {
    reportMissingSession(id);
    return;
  }

  return mapSessionRowToSession(rows[0]);
}

export async function softDeleteSession(db: Database, id: string): Promise<boolean> {
  const now = new Date().toISOString();

  const sql = `
UPDATE sessions
SET deleted_at = ?
WHERE session_id = ? AND deleted_at IS NULL
    `;

  const { rowsAffected } = await db.execute(sql, [now, id]);

  return rowsAffected === 1;
}

export async function revokeSession(
  db: Database,
  sessionId: string,
  userId: string
): Promise<boolean> {
  logger.info('[DB]: Revoking session...');

  const now = new Date().toISOString();

  const sql = `
UPDATE sessions
SET is_revoked = 1, deleted_at = ?
WHERE session_id = ? AND user_id = ? AND deleted_at IS NULL
`;

  const { rowsAffected } = await db.execute(sql, [now, sessionId, userId]);

  return rowsAffected === 1;
}

export async function findSessionsByUserId(db: Database, userId: string): Promise<Session[]> {
  logger.info('[DB]: Retrieving sessions for user...');

  const sql = `
SELECT session_id, user_id, expires_at, user_agent, device, device_type, device_vendor, browser, os, ip, city, country, last_active_at
FROM sessions
WHERE user_id = ? AND deleted_at IS NULL AND is_revoked = 0
ORDER BY last_active_at DESC
`;

  const { rows } = await db.execute<SessionRow>(sql, [userId]);

  return rows.map(row => mapSessionRowToSession(row));
}

const mapSessionRowToSession = (row: SessionRow): Session => ({
  sessionId: row.session_id,
  userId: row.user_id,
  userAgent: row.user_agent,
  ip: row.ip,
  expiresAt: new Date(row.expires_at),
  lastActiveAt: new Date(row.last_active_at),
  device: row.device,
  deviceType: row.device_type,
  deviceVendor: row.device_vendor,
  browser: row.browser,
  os: row.os,
  city: row.city,
  country: row.country,
});

const reportMissingSession = (sessionId: string) => logger.warn('Session not found', { sessionId });
