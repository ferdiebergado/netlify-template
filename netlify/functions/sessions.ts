import { db } from '@api/db';
import { respondWithError } from '@api/errors';
import { getSession } from '@api/session';
import { findSessionsByUserId } from '@api/session.repo';
import type { Config, Context } from '@netlify/functions';
import type { SessionsData, Success } from '@shared/types/api';

export const config: Config = {
  method: 'GET',
};

export default async (_req: Request, ctx: Context) => {
  try {
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
