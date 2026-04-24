import { release } from 'node:os';

import { checkMethod } from '@api/http';
import { respondWithError } from '@api/http/errors';
import { getSession } from '@api/session';
import { formatBytes, formatDuration } from '@api/utils';
import type { AppEnv, Success } from '@shared/types/api';

export default async (req: Request) => {
  try {
    checkMethod(req, ['GET']);
    await getSession(req);

    const data: AppEnv = {
      node: process.version,
      memAvail: formatBytes(process.availableMemory()),
      memUsage: formatBytes(process.memoryUsage.rss()),
      uptime: formatDuration(process.uptime()),
      release: release(),
    };

    const payload: Success<AppEnv> = {
      status: 'success',
      data,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
