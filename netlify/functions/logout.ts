import type { Config, Context } from '@netlify/functions';

import type { Success } from '../../shared/types/api';
import { SESSION_COOKIE_NAME } from '../_shared/constants';
import { db } from '../_shared/db';
import { respondWithError, UnauthorizedError } from '../_shared/errors';
import { newSessionCookie } from '../_shared/session';
import { softDeleteSession } from '../_shared/session.repo';

export const config: Config = {
  method: 'POST',
};

export default async (_req: Request, ctx: Context) => {
  console.log('Logging out...');

  try {
    const sessionCookie = SESSION_COOKIE_NAME;
    const sessionId = ctx.cookies.get(sessionCookie);
    if (!sessionId) throw new UnauthorizedError('no session cookie');

    await softDeleteSession(db, sessionId);

    const logoutCookie = newSessionCookie('', 0);
    ctx.cookies.set(logoutCookie);

    const payload: Success = {
      status: 'success',
      data: {
        message: 'Logged out.',
      },
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
