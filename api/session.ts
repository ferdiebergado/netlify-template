import type { Context } from '@netlify/functions';
import { randomBytes } from 'node:crypto';
import type { NewUser } from '../shared/schema';
import { RANDOM_BYTES_SIZE, SESSION_COOKIE_NAME, SESSION_DURATION_HOURS } from './constants';
import { db } from './db';
import { UnauthorizedError } from './errors';
import { createSession, touchSession } from './repositories/session';
import { upsertUser } from './repositories/user';
import { getClientIP } from './utils';

export type Session = {
  sessionId: string;
  userId: number;
  userAgent: string;
  ip: string;
  expiresAt: Date;
  maxAge: number;
};

export async function newSession(user: NewUser, req: Request): Promise<Session> {
  const userId = await upsertUser(db, user);

  const sessionId = generateSessionId();
  const { expiresAt, maxAge } = setSessionDuration();
  const userAgent = req.headers.get('User-Agent') ?? 'unknown';
  const ip = getClientIP(req);

  await createSession(db, { sessionId, userId, expiresAt, maxAge, userAgent, ip });

  return {
    userId,
    sessionId,
    expiresAt,
    maxAge,
    userAgent,
    ip,
  };
}

export function setSessionDuration() {
  const now = new Date();
  const expiresAt = new Date(now.setHours(now.getHours() + SESSION_DURATION_HOURS));
  const maxAge = Math.floor(expiresAt.getTime() / 1000);
  return { expiresAt, maxAge };
}

export async function checkSession(_req: Request, ctx: Context): Promise<number> {
  const sessionId = ctx.cookies.get(SESSION_COOKIE_NAME);
  if (!sessionId) throw new UnauthorizedError('no session cookie');

  return await touchSession(db, sessionId);
}

function generateSessionId(): string {
  return randomBytes(RANDOM_BYTES_SIZE).toString('base64');
}
