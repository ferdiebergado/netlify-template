import { UAParser } from 'ua-parser-js';

import { generateRandomBytes } from '@shared/lib/crypto';
import type { Session, User } from '@shared/schemas/user.schema';
import {
  SESSIONID_LENGTH,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MINUTES,
  SESSION_HEADER_NAME,
} from './constants';
import { db } from './db';
import { UnauthorizedError } from './errors';
import { createSession, touchSession } from './session.repo';
import { upsertUser } from './user.repo';

type SessionData = {
  userAgent: string;
  ip: string;
  city?: string;
  country?: string;
};

export async function initializeSession(user: User, data: SessionData): Promise<Session> {
  await upsertUser(db, user);

  const sessionId = generateRandomBytes(SESSIONID_LENGTH);
  const expiresAt = setSessionTimeout(SESSION_DURATION_MINUTES);
  const lastActiveAt = new Date();

  const { userAgent, ip, city, country } = data;

  const { device, browser, os } = UAParser(userAgent);
  console.log({ device, browser, os });

  const session: Session = {
    sessionId,
    userId: user.googleId,
    userAgent,
    device: device.model,
    deviceType: device.type,
    deviceVendor: device.vendor,
    browser: browser.name,
    os: os.name,
    ip,
    city,
    country,
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

export const initCookie = (): Cookie => ({
  name: SESSION_COOKIE_NAME,
  value: '',
  maxAge: 0,
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'Lax',
});

export function buildSessionCookie(sessionId: string, expiresAt: Date): Cookie {
  const deltaMs = expiresAt.getTime() - Date.now();
  const maxAge = Math.floor(deltaMs / 1000);

  return {
    ...initCookie(),
    value: sessionId,
    maxAge,
    expires: expiresAt,
  };
}

export async function getSession(req: Request): Promise<Session> {
  const sessionId = req.headers.get(SESSION_HEADER_NAME);
  if (!sessionId) throw new UnauthorizedError('no session ID provided');

  return await touchSession(db, sessionId);
}

function setSessionTimeout(minutes: number) {
  return new Date(Date.now() + minutes * 60_000);
}
