import type { Config, Context } from '@netlify/functions';
import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import * as z from 'zod';
import type { Success } from '../../shared/types/api';
import { env } from '../_shared/config';
import { SESSION_COOKIE_NAME } from '../_shared/constants';
import { respondWithError, UnauthorizedError } from '../_shared/errors';
import { newSession } from '../_shared/session';
import { validateBody } from '../_shared/validate';

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

    const payload: TokenPayload | undefined = ticket.getPayload();

    if (!payload) throw new UnauthorizedError('Invalid token payload');

    console.debug('payload:', payload);
    const { sub, name, email, picture, iss } = payload;

    if (!name || !email || !picture) throw new UnauthorizedError('Insufficient scope');

    if (iss !== 'https://accounts.google.com') throw new UnauthorizedError('Invalid issuer');

    const user = { googleId: sub, name, email, picture };
    const { sessionId, maxAge } = await newSession(user, req);

    ctx.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionId,
      path: '/',
      maxAge,
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    });

    const data = { message: 'Logged in.' };

    const res: Success<typeof data> = {
      status: 'success',
      data,
    };

    return Response.json(res);
  } catch (error) {
    respondWithError(error);
  }
};
