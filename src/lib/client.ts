import type { UnknownRecord } from 'type-fest';
import type { APIData, APIResponse } from '../../shared/types/api';

const BASE_URL = '/.netlify/functions';
const headers = { 'Content-Type': 'application/json' };

async function request<T extends UnknownRecord>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);

  const json = (await res.json()) as APIResponse<T>;

  if (json.status === 'failed') throw new Error(json.error);

  return json.data;
}

export const api = {
  get: <T extends UnknownRecord = APIData>(path: string) => request<T>(path),
  post: <T extends UnknownRecord = APIData>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }),
  put: <T extends UnknownRecord = APIData>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    }),
  delete: <T extends UnknownRecord = APIData>(path: string) =>
    request<T>(path, {
      method: 'DELETE',
    }),
};
