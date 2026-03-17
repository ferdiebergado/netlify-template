import { db } from '@api/db';
import { BadRequestError, respondWithError } from '@api/errors';
import { getSession } from '@api/session';
import { revokeSession } from '@api/session.repo';
import type { Config, Context } from '@netlify/functions';
import type { Success } from '@shared/types/api';
import { z } from 'zod';

const revokeSessionSchema = z.object({
  sessionId: z.string().min(1),
});

export const config: Config = {
  method: 'POST',
};

export default async (req: Request, ctx: Context) => {
  try {
    const { userId } = await getSession(ctx);

    const body = await req.json();
    const { sessionId } = revokeSessionSchema.parse(body);

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
