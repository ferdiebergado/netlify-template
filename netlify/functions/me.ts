import { db } from '@api/db';
import { respondWithError } from '@api/errors';
import { verifySession } from '@api/session';
import findUser from '@api/user.repo';
import type { Config, Context } from '@netlify/functions';
import type { Success } from '@shared/types/api';

export const config: Config = {
  method: 'GET',
};

export default async (_req: Request, ctx: Context) => {
  try {
    const userId = await verifySession(ctx);
    const data = await findUser(db, userId);

    const payload: Success<typeof data> = {
      status: 'success',
      data,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
