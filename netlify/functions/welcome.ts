import { respondWithError } from '@api/errors';
import { getSession } from '@api/session';
import type { Context } from '@netlify/functions';
import type { Success } from '@shared/types/api';

export default async (_req: Request, ctx: Context) => {
  try {
    await getSession(ctx);

    const payload: Success = {
      status: 'success',
      data: {
        message: 'Welcome!',
      },
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
