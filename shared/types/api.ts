import type { UnknownRecord } from 'type-fest';
import type { User } from '../schemas/user.schema';

export type APIData = UnknownRecord & {
  message?: string;
};

export type Success<T extends UnknownRecord = APIData, M = unknown> = {
  status: 'success';
  data: T;
  meta?: M;
};

export type Failure<E = string, M = unknown> = {
  status: 'failed';
  error: E;
  meta?: M;
};

export type APIResponse<T extends UnknownRecord, E = string, M = unknown> =
  | Success<T, M>
  | Failure<E, M>;

export type LoginData = APIData & { user: User };
