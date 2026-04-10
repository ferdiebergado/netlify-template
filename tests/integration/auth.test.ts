import { describe, expect, it } from 'vitest';

import config from '@api/config';
import { SESSION } from '@api/constants';
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
    const sessionCookie = response.headers.get('Set-Cookie');
    expect(sessionCookie).toBeTruthy();
    expect(sessionCookie).toContain(`${SESSION.COOKIE_NAME}=`);
    expect(sessionCookie).toContain('Max-Age=7775999');
    expect(sessionCookie).toContain('Secure');
    expect(sessionCookie).toContain('HttpOnly');
    expect(sessionCookie).toContain('SameSite=Strict');
    expect(sessionCookie).toContain('Path=/');
  });

  it('should signout successfully and clear the session cookie', async () => {
    // First, sign in to get a session cookie
    const csrfToken = 'test-csrf-token';
    const signInResponse = await fetch(`${config.host}${API_BASE_URL}/signin`, {
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

    // Extract the session cookie from the sign in response
    const sessionCookieHeader = signInResponse.headers.get('Set-Cookie');
    expect(sessionCookieHeader).toBeTruthy();
    expect(sessionCookieHeader).toContain(SESSION.COOKIE_NAME + '=');

    // Extract just the session cookie part (name=value) for use in signout
    const sessionCookieMatch = sessionCookieHeader?.match(/(__Host-session=[^;]+)/);
    const sessionCookie = sessionCookieMatch ? sessionCookieMatch[1] : '';

    // Now test the signout functionality
    const signOutResponse = await fetch(`${config.host}${API_BASE_URL}/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        'Sec-Fetch-Site': 'same-origin', // Required by CSRF protection
      },
    });

    // Verify the signout response
    expect(signOutResponse.status).toBe(200);

    // Parse the response body to check the success message
    const responseBody = (await signOutResponse.json()) as {
      status: string;
      data: { message: string };
    };
    expect(responseBody.status).toBe('success');
    expect(responseBody.data.message).toBe('Signed out.');

    // Verify the session cookie is cleared (maxAge=0)
    const setCookieHeader = signOutResponse.headers.get('Set-Cookie');
    expect(setCookieHeader).toBeTruthy();
    expect(setCookieHeader).toContain(`${SESSION.COOKIE_NAME}=`);
    expect(setCookieHeader).toContain('Max-Age=0');
    expect(setCookieHeader).toContain('Secure');
    expect(setCookieHeader).toContain('HttpOnly');
    expect(setCookieHeader).toContain('SameSite=Strict');
    expect(setCookieHeader).toContain('Path=/');
  });
});
