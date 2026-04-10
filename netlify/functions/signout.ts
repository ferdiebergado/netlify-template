import { db } from '@api/db';
import { NotFoundError, respondWithError } from '@api/errors';
import { checkMethod } from '@api/http';
import { emptySessionCookie, getSession } from '@api/session';
import { softDeleteSession } from '@api/session.repo';
import type { Context } from '@netlify/functions';
import type { Success } from '@shared/types/api';

export default async (req: Request, ctx: Context) => {
  try {
    checkMethod(req, ['POST']);
    const { sessionId } = await getSession(req);
    const isDeleted = await softDeleteSession(db, sessionId);

    if (!isDeleted) throw new NotFoundError('Session not found or already deleted');

    const payload: Success = {
      status: 'success',
      data: {
        message: 'Signed out.',
      },
    };

    const sessionCookie = emptySessionCookie();
    ctx.cookies.set(sessionCookie);
    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
