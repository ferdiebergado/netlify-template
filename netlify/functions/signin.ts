import type { Context } from '@netlify/functions';
import * as z from 'zod';

import { oauthClient, verifyToken } from '@api/auth';
import { env } from '@api/config';
import { BadRequestError, HttpError } from '@api/errors';
import { checkMethod } from '@api/http';
import logger from '@api/logger';
import { buildSessionCookie, initializeSession } from '@api/session';

export default async (req: Request, ctx: Context) => {
  try {
    checkMethod(req, ['POST']);

    let bodyText: string;

    try {
      bodyText = await req.text();
    } catch (error) {
      logger.error('Error reading request body:', { error });
      throw new BadRequestError('Invalid request body');
    }

    const params = new URLSearchParams(bodyText);
    const payload = Object.fromEntries(params);

    const { success, error, data } = GoogleAuthSchema.safeParse(payload);
    if (!success) throw new BadRequestError(z.prettifyError(error));

    const csrfTokenInCookie = ctx.cookies.get('g_csrf_token');
    const { g_csrf_token, credential } = data;
    if (!csrfTokenInCookie || g_csrf_token !== csrfTokenInCookie)
      throw new BadRequestError('invalid csrf token');

    const user = await verifyToken(oauthClient, credential);

    const sessionData = {
      userAgent: req.headers.get('User-Agent') ?? 'unknown',
      ip: ctx.ip,
      city: ctx.geo.city,
      country: ctx.geo.country?.name,
    };

    const { sessionId, expiresAt } = await initializeSession(user, sessionData);
    const sessionCookie = buildSessionCookie(sessionId, expiresAt);
    ctx.cookies.set(sessionCookie);

    return Response.redirect(
      `${env.HOST}/?success=${encodeURIComponent('Signed in successfully.')}`,
      302
    );
  } catch (error) {
    logger.error('Signin failed', { error });

    let message = 'Something went wrong during sign-in.';

    if (error instanceof HttpError) message = error.message;

    return Response.redirect(`${env.HOST}/signin?error=${encodeURIComponent(message)}`, 302);
  }
};

const GoogleAuthSchema = z.object({
  credential: z.string().min(1, 'Google credential is required'),
  g_csrf_token: z.string().min(1, 'CSRF token is required'),
});
