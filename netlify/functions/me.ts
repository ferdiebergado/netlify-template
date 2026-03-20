import { db } from '@api/db';
import { respondWithError, UnauthorizedError } from '@api/errors';
import { checkMethod } from '@api/http';
import { getSession } from '@api/session';
import findUser from '@api/user.repo';
import type { Context } from '@netlify/functions';
import type { Success } from '@shared/types/api';

export default async (req: Request, ctx: Context) => {
  try {
    checkMethod(req, ['GET']);
    const { userId } = await getSession(ctx);
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
