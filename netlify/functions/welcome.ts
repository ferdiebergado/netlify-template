import { respondWithError } from '@api/errors';
import { checkMethod } from '@api/http';
import { getSession } from '@api/session';
import type { Context } from '@netlify/functions';
import type { Success } from '@shared/types/api';

export default async (req: Request, ctx: Context) => {
  try {
    checkMethod(req, ['GET']);
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
