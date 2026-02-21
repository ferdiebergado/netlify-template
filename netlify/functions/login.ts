import type { Config, Context } from '@netlify/functions';
import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import * as z from 'zod';

import { env } from '../../api/config';
import { respondWithError, UnauthorizedError } from '../../api/errors';
import { newSession, newSessionCookie } from '../../api/session';
import { validateBody } from '../../api/validate';
import type { Success } from '../../shared/types/api';

const clientId = env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);

const loginSchema = z.object({
  token: z.jwt(),
});

export const config: Config = {
  method: 'POST',
};

export default async (req: Request, ctx: Context) => {
  try {
    const body = await req.json();
    const { token } = validateBody(body, loginSchema);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });

    const tokenPayload: TokenPayload | undefined = ticket.getPayload();

    if (!tokenPayload) throw new UnauthorizedError('Invalid token payload');

    console.debug('payload:', tokenPayload);
    const { sub, name, email, picture, iss } = tokenPayload;

    if (!name || !email) throw new UnauthorizedError('Insufficient scope');

    if (iss !== 'https://accounts.google.com') throw new UnauthorizedError('Invalid issuer');

    const user = { googleId: sub, name, email, picture };
    const { sessionId, maxAge } = await newSession(user, req);

    const sessionCookie = newSessionCookie(sessionId, maxAge);
    ctx.cookies.set(sessionCookie);

    const data = {
      message: 'Logged in.',
      user,
    };
    const payload: Success = {
      status: 'success',
      data,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
