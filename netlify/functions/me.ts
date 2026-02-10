import type { Context } from '@netlify/functions';
import type { Success } from '../../shared/types/api';
import { db } from '../_shared/db';
import { respondWithError } from '../_shared/errors';
import { checkSession } from '../_shared/session';
import { getUser } from '../_shared/user.repo';

export default async (req: Request, ctx: Context) => {
  try {
    const userId = await checkSession(req, ctx);

    const data = await getUser(db, userId);
    const payload: Success<typeof data> = {
      status: 'success',
      data,
    };
    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
