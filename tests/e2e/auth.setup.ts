import { test as setup } from '@playwright/test';
import path from 'node:path';

import config from '@api/config';
import { API_BASE_URL } from '@shared/constants';

const authFile = path.join(process.cwd(), '/playwright/.auth/user.json');

setup('authenticate', async ({ request }) => {
  const csrfToken = 'test-csrf-token';

  await request.post(`${config.host}${API_BASE_URL}/signin`, {
    form: {
      credential: 'test-token',
      g_csrf_token: csrfToken,
    },
    headers: {
      cookie: `g_csrf_token=${csrfToken}`,
    },
  });

  await request.storageState({ path: authFile });
});
