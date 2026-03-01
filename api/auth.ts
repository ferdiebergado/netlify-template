import { createClerkClient } from '@clerk/backend';

import { env } from './config';
import { ALLOWED_ORIGINS } from './constants';
import { UnauthorizedError } from './errors';

const clerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
});

export async function authenticate(req: Request): Promise<string> {
  const { isAuthenticated, status, reason, message, toAuth } =
    await clerkClient.authenticateRequest(req, {
      authorizedParties: ALLOWED_ORIGINS,
    });

  console.debug({ status, message, reason });

  if (!isAuthenticated) throw new UnauthorizedError();

  const { userId } = toAuth();

  return userId;
}
