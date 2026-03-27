import * as z from 'zod';

import { db } from '@api/db';
import { BadRequestError, respondWithError } from '@api/errors';
import { checkMethod, parseJson } from '@api/http';
import { getSession } from '@api/session';
import { revokeSession } from '@api/session.repo';
import type { Success } from '@shared/types/api';

const revokeSessionSchema = z.object({
  sessionId: z.string().min(1),
});

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const { userId } = await getSession(req);
    const { sessionId } = await parseJson(req, revokeSessionSchema);
    const success = await revokeSession(db, sessionId, userId);
    if (!success) throw new BadRequestError('Failed to revoke session');

    const payload: Success = {
      status: 'success',
      data: { message: 'Session revoked.' },
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
