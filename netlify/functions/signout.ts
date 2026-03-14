import { db } from '@api/db';
import { respondWithError } from '@api/errors';
import { clearSessionCookie, getSession } from '@api/session';
import { softDeleteSession } from '@api/session.repo';
import type { Config, Context } from '@netlify/functions';
import type { Success } from '@shared/types/api';

export const config: Config = {
  method: 'POST',
};

export default async (_req: Request, ctx: Context) => {
  try {
    const { sessionId } = await getSession(ctx);
    await softDeleteSession(db, sessionId);

    const payload: Success = {
      status: 'success',
      data: {
        message: 'Signed out.',
      },
    };

    const sessionCookie = clearSessionCookie();
    ctx.cookies.set(sessionCookie);
    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
