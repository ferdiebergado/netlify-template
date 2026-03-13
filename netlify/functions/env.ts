import { respondWithError } from '@api/errors';
import { verifySession } from '@api/session';
import { formatBytes, formatDuration } from '@api/utils';
import type { Context } from '@netlify/functions';
import type { AppEnv, Success } from '@shared/types/api';
import { release } from 'node:os';

export default async (_req: Request, ctx: Context) => {
  try {
    await verifySession(ctx);

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
