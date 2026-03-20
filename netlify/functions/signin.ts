import type { Context } from '@netlify/functions';
import * as z from 'zod';

import { verifyToken } from '@api/auth';
import { BadRequestError, HttpError } from '@api/errors';
import { checkMethod } from '@api/http';
import { buildSessionCookie, initializeSession } from '@api/session';

export default async (req: Request, ctx: Context) => {
  try {
    checkMethod(req, ['POST']);

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

    const sessionData = {
      userAgent: req.headers.get('User-Agent') ?? 'unknown',
      ip: ctx.ip,
      city: ctx.geo.city,
      country: ctx.geo.country?.name,
    };

    console.log('session data:', sessionData);

    const { sessionId, expiresAt } = await initializeSession(user, sessionData);
    const sessionCookie = buildSessionCookie(sessionId, expiresAt);
    ctx.cookies.set(sessionCookie);
    return new Response(undefined, {
      headers: {
        Location: '/?success=' + encodeURIComponent('Signed in successfully!'),
      },
      status: 302,
    });
  } catch (error) {
    console.error('Signin Error:', error);

    let message = 'Something went wrong during sign-in.';

    if (error instanceof HttpError) message = error.message;

    return new Response(undefined, {
      headers: {
        Location: '/signin?error=' + encodeURIComponent(message),
      },
      status: 302,
    });
  }
};

const GoogleAuthSchema = z.object({
  credential: z.string().min(1, 'Google credential is required'),
  g_csrf_token: z.string().min(1, 'CSRF token is required'),
});
