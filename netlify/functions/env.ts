import { respondWithError } from '@api/errors';
import { checkMethod } from '@api/http';
import { getSession } from '@api/session';
import { formatBytes, formatDuration } from '@api/utils';
import type { Context } from '@netlify/functions';
import type { AppEnv, Success } from '@shared/types/api';
import { release } from 'node:os';

export default async (req: Request, ctx: Context) => {
  try {
    checkMethod(req, ['GET']);
    await getSession(ctx);

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
