import { describe, expect, it } from 'vitest';

import config from '@api/config';
import { API_BASE_URL } from '@shared/constants';

describe('Authentication', () => {
  it('should sign in successfully with valid credentials', async () => {
    const csrfToken = 'test-csrf-token';
    const response = await fetch(`${config.host}${API_BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: `g_csrf_token=${csrfToken}`,
      },
      body: new URLSearchParams({
        credential: 'test-token',
        g_csrf_token: csrfToken,
      }),
      redirect: 'manual',
    });

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toContain('/?success=Signed%20in%20successfully.');
  });
});
