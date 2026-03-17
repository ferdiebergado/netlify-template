import type { Context } from '@netlify/functions';
import { randomBytes } from 'node:crypto';

import type { Session, User } from '@shared/schemas/user.schema';
import { UAParser } from 'ua-parser-js';
import { SESSIONID_LENGTH, SESSION_COOKIE_NAME, SESSION_DURATION_MINUTES } from './constants';
import { db } from './db';
import { UnauthorizedError } from './errors';
import { createSession, findSession, touchSession } from './session.repo';
import { upsertUser } from './user.repo';

type SessionData = {
  userAgent: string;
  ip: string;
  city?: string;
  country?: string;
};

// TODO: unique session per ip and useragent
export async function initializeSession(user: User, data: SessionData): Promise<Session> {
  await upsertUser(db, user);

  const sessionId = generateSessionId(SESSIONID_LENGTH);
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
