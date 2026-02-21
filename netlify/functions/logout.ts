import type { Config, Context } from '@netlify/functions';

import { SESSION_COOKIE_NAME } from '../../api/constants';
import { db } from '../../api/db';
import { respondWithError, UnauthorizedError } from '../../api/errors';
import { newSessionCookie } from '../../api/session';
import { softDeleteSession } from '../../api/session.repo';
import type { Success } from '../../shared/types/api';

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
