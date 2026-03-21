import { db } from '@api/db';
import { respondWithError } from '@api/errors';
import { checkMethod } from '@api/http';
import { getSession, initCookie } from '@api/session';
import { softDeleteSession } from '@api/session.repo';
import type { Context } from '@netlify/functions';
import type { Success } from '@shared/types/api';

export default async (req: Request, ctx: Context) => {
  try {
    checkMethod(req, ['POST']);
    const { sessionId } = await getSession(ctx);
    await softDeleteSession(db, sessionId);

    const payload: Success = {
      status: 'success',
      data: {
        message: 'Signed out.',
      },
    };

    const sessionCookie = initCookie();
    ctx.cookies.set(sessionCookie);
    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
