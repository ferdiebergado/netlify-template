import test, { expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.describe('Unauthenticated Access', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should show the login page', async ({ page }) => {
      await page.goto('http://localhost:8888/signin');
      await page.waitForURL('http://localhost:8888/signin');

      const description = page.getByText('Sign in with your Google account');
      await expect(description).toBeVisible();
    });

    test('should redirect to login page when accessing protected route', async ({ page }) => {
      await page.goto('http://localhost:8888');
      await page.waitForURL('http://localhost:8888/signin');
      const url = page.url();
      expect(url).toBe('http://localhost:8888/signin');
    });
  });

  test.describe('Authenticated Access', () => {
    test('should access protected route when authenticated', async ({ page }) => {
      await page.goto('http://localhost:8888');
      await page.waitForURL('http://localhost:8888/');
      const url = page.url();
      expect(url).toBe('http://localhost:8888/');
    });

    test('should display user information in the profile sheet', async ({ page }) => {
      await page.goto('http://localhost:8888');
      await page.locator('#base-ui-_r_n_').click();

      await expect(page.getByText('Test User')).toBeVisible();
      await expect(page.getByText('test@example.com')).toBeVisible();
    });
  });
});
