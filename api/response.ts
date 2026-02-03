import type { UnknownRecord } from 'type-fest';

export type APIResponse<T extends UnknownRecord, M extends UnknownRecord = UnknownRecord> =
  | {
      status: 'success';
      data: T;
      meta?: M;
    }
  | {
      status: 'failed';
      error: T;
      meta?: M;
    };
