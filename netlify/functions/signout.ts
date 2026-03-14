import { respondWithError } from '@api/errors';
import { clearSessionCookie, verifySession } from '@api/session';
import type { Context } from '@netlify/functions';
import type { Success } from '@shared/types/api';

export default async (_req: Request, ctx: Context) => {
  try {
    await verifySession(ctx);

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
