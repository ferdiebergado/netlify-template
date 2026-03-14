import type { Config, Context } from '@netlify/functions';

import { verifyToken } from '@api/auth';
import { respondWithError } from '@api/errors';
import { buildSessionCookie, initializeSession } from '@api/session';
import { validateBody } from '@api/validate';
import { signinSchema } from '@shared/schemas/auth.schema';
import type { Success } from '@shared/types/api';

export const config: Config = {
  method: 'POST',
};

export default async (req: Request, ctx: Context) => {
  try {
    const body = await req.json();
    const { token } = validateBody(body, signinSchema);

    const user = await verifyToken(token);

    const { sessionId, expiresAt } = await initializeSession(user, req);
    const sessionCookie = buildSessionCookie(sessionId, expiresAt);
    ctx.cookies.set(sessionCookie);

    const data = {
      message: 'Logged in.',
      user,
    };
    const payload: Success<typeof data> = {
      status: 'success',
      data,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
