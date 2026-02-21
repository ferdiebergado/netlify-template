import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { API_BASE_URL } from './shared/constants';
import type { Failure } from './shared/types/api';

const baseUrl = API_BASE_URL;

const restHandlers = [
  http.get(`${baseUrl}/me`, () => {
    return HttpResponse.json<Failure>(
      {
        status: 'failed',
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }),
];

const worker = setupWorker(...restHandlers);
beforeAll(async () => await worker.start({ onUnhandledRequest: 'bypass' }));
afterAll(() => worker.stop());
afterEach(() => worker.resetHandlers());
