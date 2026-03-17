import type { APIData, APIResponse } from '@shared/types/api';
import type { UnknownRecord } from 'type-fest';

const BASE_URL = '/.netlify/functions';
const headers = { 'Content-Type': 'application/json' };

async function request<T extends UnknownRecord>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
  });

  // eslint-disable-next-line unicorn/no-null
  if (!res.ok && res.status === 401) return null;

  const json = (await res.json()) as APIResponse<T>;

  if (json.status === 'failed') throw new Error(json.error);

  return json.data;
}

export const api = {
  get: <T extends UnknownRecord = APIData>(path: string, options?: RequestInit) =>
    request<T>(path, options),
  post: <T extends UnknownRecord = APIData>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }),
  put: <T extends UnknownRecord = APIData>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    }),
  delete: <T extends UnknownRecord = APIData>(path: string, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: 'DELETE',
    }),
};
