import { getDb } from '@api/db';
import { checkMethod } from '@api/http';
import { NotFoundError, respondWithError } from '@api/http/errors';
import { getSession } from '@api/session';
import { emptySessionCookie } from '@api/session/cookie';
import { softDeleteSession } from '@api/session/repo';
import type { Context } from '@netlify/functions';
import type { Success } from '@shared/types/api';

export default async (req: Request, ctx: Context) => {
  try {
    checkMethod(req, ['POST']);

    const db = await getDb();
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
