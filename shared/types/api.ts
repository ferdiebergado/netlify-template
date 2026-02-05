export type Success<T, M = unknown> = {
  status: 'success';
  data: T;
  meta?: M;
};

export type Failure<E = string, M = unknown> = {
  status: 'failed';
  error: E;
  meta?: M;
};

export type APIResponse<T, E = string, M = unknown> = Success<T, M> | Failure<E, M>;
