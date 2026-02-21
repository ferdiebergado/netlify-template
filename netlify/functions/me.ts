import type { Context } from '@netlify/functions';

import { db } from '../../api/db';
import { respondWithError } from '../../api/errors';
import { checkSession } from '../../api/session';
import { getUser } from '../../api/user.repo';
import type { Success } from '../../shared/types/api';

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
