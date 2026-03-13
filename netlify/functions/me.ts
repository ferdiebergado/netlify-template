import { db } from '@api/db';
import { respondWithError, UnauthorizedError } from '@api/errors';
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
    const user = await findUser(db, userId);

    if (!user) throw new UnauthorizedError('user not found');

    const payload: Success<typeof user> = {
      status: 'success',
      data: user,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
