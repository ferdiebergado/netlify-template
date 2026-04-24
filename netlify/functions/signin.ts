import type { Config, Context } from '@netlify/functions';
import * as z from 'zod';

import { oauthClient, verifyToken } from '@api/auth';
import apiConfig from '@api/config';
import { checkMethod } from '@api/http';
import { BadRequestError, HttpError } from '@api/http/errors';
import logger from '@api/logger';
import { initializeSession } from '@api/session';
import { bakeSessionCookie } from '@api/session/cookie';
import type { CreateUser } from '@shared/schemas/user.schema';

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
      throw new BadRequestError(
        error instanceof Error ? error.message : 'Failed to read request body'
      );
    }

    const params = new URLSearchParams(bodyText);
    const payload = Object.fromEntries(params);

    const authSchema = z.object({
      credential: z.string().min(1, 'Google credential is required'),
      g_csrf_token: z.string().min(1, 'CSRF token is required'),
    });

    const { success, error, data } = authSchema.safeParse(payload);
    if (!success)
      throw new BadRequestError('Invalid credentials', z.flattenError(error).fieldErrors);

    const csrfTokenInCookie = ctx.cookies.get('g_csrf_token');
    const { g_csrf_token, credential } = data;
    if (!csrfTokenInCookie || g_csrf_token !== csrfTokenInCookie)
      throw new BadRequestError('invalid csrf token');

    const user: CreateUser =
      apiConfig.env === 'development' && credential === 'test-token'
        ? {
            googleId: 'test-user-id',
            name: 'Test User',
            email: 'test@example.com',
            picture: 'https://example.com/test-user.jpg',
          }
        : await verifyToken(oauthClient, credential);

    const { sessionId, expiresAt } = await initializeSession(user);
    const sessionCookie = bakeSessionCookie(sessionId, expiresAt);
    ctx.cookies.set(sessionCookie);

    return Response.redirect(
      `${apiConfig.host}/?success=${encodeURIComponent('Signed in successfully.')}`,
      302
    );
  } catch (error) {
    const meta = {
      requestId: ctx.requestId,
      ip: ctx.ip,
      geo: ctx.geo,
    };

    logger.notice({ meta, error }, 'Signin failed');

    let message = 'Something went wrong during sign-in.';

    if (error instanceof HttpError) message = error.message;

    return Response.redirect(`${apiConfig.host}/signin?error=${encodeURIComponent(message)}`, 302);
  }
};
