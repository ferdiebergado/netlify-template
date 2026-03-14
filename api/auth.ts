import { OAuth2Client } from 'google-auth-library';

import type { User } from '@shared/schemas/user.schema';
import { env } from './config';
import { UnauthorizedError } from './errors';

const ISSUER = 'https://accounts.google.com';
const { GOOGLE_CLIENT_ID } = env;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function verifyToken(token: string): Promise<User> {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });

  const tokenPayload = ticket.getPayload();

  if (tokenPayload === undefined) throw new UnauthorizedError('Invalid token payload');

  if (tokenPayload.iss !== ISSUER) throw new UnauthorizedError('Invalid issuer');

  return {
    googleId: tokenPayload.sub,
    name: tokenPayload.name,
    email: tokenPayload.email,
    picture: tokenPayload.picture,
  };
}
