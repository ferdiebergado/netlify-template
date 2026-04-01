import { db } from '@api/db';
import { respondWithError, UnauthorizedError } from '@api/errors';
import { checkMethod } from '@api/http';
import { getSession } from '@api/session';
import { findSessionsByUserId } from '@api/session.repo';
import type { SessionsData, Success } from '@shared/types/api';

export default async (req: Request) => {
  try {
    checkMethod(req, ['GET']);

    const { sessionId, userId } = await getSession(req);
    const sessions = await findSessionsByUserId(db, userId);

    if (sessions.length === 0) throw new UnauthorizedError('no active sessions found for user');

    const payload: Success<SessionsData> = {
      status: 'success',
      data: { sessions, currentSessionId: sessionId },
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
