import { respondWithError } from '@api/errors';
import { formatBytes, formatDuration } from '@api/utils';
import type { AppEnv, Success } from '@shared/types/api';
import { release } from 'node:os';

export default () => {
  try {
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
