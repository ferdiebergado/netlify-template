import type { Context } from '@netlify/functions';
import { randomBytes } from 'node:crypto';

import type { User } from '@shared/schemas/user.schema';
import { SESSIONID_LENGTH, SESSION_COOKIE_NAME, SESSION_DURATION_MINUTES } from './constants';
import { db } from './db';
import { UnauthorizedError } from './errors';
import { createSession, findSession, touchSession } from './session.repo';
import { upsertUser } from './user.repo';
import { getClientIP } from './utils';

export type Session = {
  sessionId: string;
  userId: string;
  userAgent: string;
  ip: string;
  expiresAt: Date;
  lastActiveAt: Date;
};

// TODO: unique session per ip and useragent
export async function initializeSession(user: User, req: Request): Promise<Session> {
  await upsertUser(db, user);

  const sessionId = generateSessionId(SESSIONID_LENGTH);
  const userAgent = req.headers.get('User-Agent') ?? 'unknown';
  const ip = getClientIP(req);
  const expiresAt = setSessionTimeout(SESSION_DURATION_MINUTES);
  const lastActiveAt = new Date();

  const session: Session = {
    sessionId,
    userId: user.googleId,
    userAgent,
    ip,
    expiresAt,
    lastActiveAt,
  };
  await createSession(db, session);

  return session;
}

type Cookie = {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  partitioned?: boolean;
};

export function buildSessionCookie(
  sessionId: string,
  expiresAt: Date,
  name = SESSION_COOKIE_NAME
): Cookie {
  const deltaMs = expiresAt.getTime() - Date.now();
  const maxAge = Math.floor(deltaMs / 1000);

  return {
    name,
    value: sessionId,
    path: '/',
    maxAge,
    httpOnly: true,
    secure: true,
  };
}

export function clearSessionCookie(name = SESSION_COOKIE_NAME): Cookie {
  return {
    name,
    value: '',
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: true,
  };
}

export async function getSession(context: Context): Promise<Session> {
  const sessionId = context.cookies.get(SESSION_COOKIE_NAME);
  if (!sessionId) throw new UnauthorizedError('no session cookie');

  const session = await findSession(db, sessionId);
  if (!session) throw new UnauthorizedError('no saved session');

  await touchSession(db, sessionId);

  return session;
}

function generateSessionId(length: number): string {
  return randomBytes(length).toString('base64');
}

function setSessionTimeout(minutes: number) {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
}
