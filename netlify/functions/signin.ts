import type { Config, Context } from '@netlify/functions';
import * as z from 'zod';

import { oauthClient, verifyToken } from '@api/auth';
import apiConfig from '@api/config';
import { BadRequestError, HttpError } from '@api/errors';
import { checkMethod } from '@api/http';
import logger from '@api/logger';
import { buildSessionCookie, initializeSession } from '@api/session';

const host = apiConfig.host;

export const config: Config = {
  rateLimit: {
    windowLimit: 10,
    windowSize: 120,
    aggregateBy: ['ip'],
  },
};

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

    const authSchema = z.object({
      credential: z.string().min(1, 'Google credential is required'),
      g_csrf_token: z.string().min(1, 'CSRF token is required'),
    });

    const { success, error, data } = authSchema.safeParse(payload);
    if (!success) {
      const errMsg = 'Invalid credentials';
      logger.error(errMsg, { errors: z.flattenError(error).fieldErrors });
      throw new BadRequestError(errMsg);
    }

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
      `${host}/?success=${encodeURIComponent('Signed in successfully.')}`,
      302
    );
  } catch (error) {
    logger.error('Signin failed', { error });

    let message = 'Something went wrong during sign-in.';

    if (error instanceof HttpError) message = error.message;

    return Response.redirect(`${host}/signin?error=${encodeURIComponent(message)}`, 302);
  }
};
