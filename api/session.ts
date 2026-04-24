import { genRandStr } from '@shared/lib/crypto';
import type { CreateSession, Session } from '@shared/schemas/session.schema';
import type { CreateUser } from '@shared/schemas/user.schema';
import { SESSION } from './constants';
import { db } from './db';
import { UnauthorizedError } from './errors';
import { createSession, touchSession } from './session.repo';
import { upsertUser } from './user.repo';

export async function initializeSession(user: CreateUser): Promise<Session> {
  const id = await upsertUser(db, user);
  const session = newSession(id);

  return await createSession(db, session);
}

export function newSession(userId: number): CreateSession {
  const sessionId = genRandStr(SESSION.ID_LENGTH);
  const expiresAt = setExpiryDate();

  return {
    sessionId,
    userId,
    expiresAt,
  };
}

type Cookie = {
  name: string;
  value: string;
  url?: string;
  domain?: string;
  path?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  partitioned?: boolean;
};

const BASE_COOKIE: Readonly<Omit<Cookie, 'name' | 'value'>> = {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'Strict',
};

export function bakeSessionCookie(sessionId: string, expiresAt: Date): Cookie {
  const deltaMs = expiresAt.getTime() - Date.now();
  const maxAge = Math.max(0, Math.floor(deltaMs / 1000));

  return {
    ...BASE_COOKIE,
    name: SESSION.COOKIE_NAME,
    value: sessionId,
    maxAge,
  };
}

export function emptySessionCookie(): Cookie {
  return {
    ...BASE_COOKIE,
    name: SESSION.COOKIE_NAME,
    value: '',
    maxAge: 0,
  };
}

export async function getSession(req: Request): Promise<Session> {
  const sessionId = req.headers.get(SESSION.HEADER_NAME);
  if (!sessionId) throw new UnauthorizedError('no session ID provided');

  const session = await touchSession(db, sessionId);
  if (!session) throw new UnauthorizedError('session not found');

  return session;
}

export const setExpiryDate = (minutes = SESSION.DURATION_MINUTES): Date =>
  new Date(Date.now() + minutes * 60_000);
