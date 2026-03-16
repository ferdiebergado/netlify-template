import type { Config, Context } from '@netlify/functions';
import * as z from 'zod';

import { verifyToken } from '@api/auth';
import { BadRequestError, respondWithError } from '@api/errors';
import { buildSessionCookie, initializeSession } from '@api/session';

export const config: Config = {
  method: 'POST',
};

export default async (req: Request, ctx: Context) => {
  try {
    const bodyText = await req.text();

    const params = new URLSearchParams(bodyText);
    const payload = Object.fromEntries(params);

    const { success, error, data } = GoogleAuthSchema.safeParse(payload);
    if (!success) throw new BadRequestError(z.prettifyError(error));

    const csrfTokenInCookie = ctx.cookies.get('g_csrf_token');
    const { g_csrf_token, credential } = data;
    if (!csrfTokenInCookie || g_csrf_token !== csrfTokenInCookie)
      throw new BadRequestError('invalid csrf token');

    const user = await verifyToken(credential);

    const { sessionId, expiresAt } = await initializeSession(user, req);
    const sessionCookie = buildSessionCookie(sessionId, expiresAt);
    ctx.cookies.set(sessionCookie);

    return new Response(undefined, {
      headers: {
        Location: '/',
      },
      status: 302,
    });
  } catch (error) {
    return respondWithError(error);
  }
};

const GoogleAuthSchema = z.object({
  credential: z.string().min(1, 'Google credential is required'),
  g_csrf_token: z.string().min(1, 'CSRF token is required'),
});
