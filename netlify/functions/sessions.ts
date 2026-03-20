import { db } from '@api/db';
import { respondWithError } from '@api/errors';
import { checkMethod } from '@api/http';
import { getSession } from '@api/session';
import { findSessionsByUserId } from '@api/session.repo';
import type { Context } from '@netlify/functions';
import type { SessionsData, Success } from '@shared/types/api';

export default async (req: Request, ctx: Context) => {
  try {
    checkMethod(req, ['GET']);
    const { sessionId, userId } = await getSession(ctx);
    const sessions = await findSessionsByUserId(db, userId);

    const payload: Success<SessionsData> = {
      status: 'success',
      data: { sessions, currentSessionId: sessionId },
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
