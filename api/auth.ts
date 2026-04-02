import { OAuth2Client } from 'google-auth-library';

import { GOOGLE_ACCOUNTS_ORIGIN } from '@shared/constants';
import type { User } from '@shared/schemas/user.schema';
import { env } from './config';
import { UnauthorizedError } from './errors';

const { GOOGLE_CLIENT_ID } = env;

export const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function verifyToken(oauthClient: OAuth2Client, token: string): Promise<User> {
  const ticket = await oauthClient.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });

  const tokenPayload = ticket.getPayload();

  if (tokenPayload === undefined) throw new UnauthorizedError('Invalid token payload');

  if (tokenPayload.iss !== GOOGLE_ACCOUNTS_ORIGIN) throw new UnauthorizedError('Invalid issuer');

  return {
    googleId: tokenPayload.sub,
    name: tokenPayload.name,
    email: tokenPayload.email,
    picture: tokenPayload.picture,
  };
}
