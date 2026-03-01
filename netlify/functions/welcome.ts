import { authenticate } from '@api/auth';
import { respondWithError } from '@api/errors';
import type { Success } from '@shared/types/api';

export default async (req: Request) => {
  try {
    await authenticate(req);

    const payload: Success = {
      status: 'success',
      data: {
        message: 'Welcome!',
      },
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
