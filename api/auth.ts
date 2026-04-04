import { OAuth2Client } from 'google-auth-library';

import { GOOGLE_ACCOUNTS_ORIGIN } from '@shared/constants';
import type { User } from '@shared/schemas/user.schema';
import config from './config';
import { UnauthorizedError } from './errors';

const { googleClientId } = config;

export const oauthClient = new OAuth2Client(googleClientId);

export async function verifyToken(oauthClient: OAuth2Client, token: string): Promise<User> {
  const ticket = await oauthClient.verifyIdToken({
    idToken: token,
    audience: googleClientId,
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
