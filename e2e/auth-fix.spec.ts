import { test, expect } from '@playwright/test';

test.describe('Authentication Fix Tests', () => {
  const BASE_URL = 'https://game-plug.rbw.ovh';

  test('should login and fetch user without infinite loop', async ({ page }) => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/`);

    // Use the production landing page's explicit development access.
    await page.getByRole('button', { name: /GM Login|Dev MJ \(Test\)/i }).click();

    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Check that we're on the dashboard
    expect(page.url()).toContain('/dashboard');

    // Wait a bit to ensure no infinite loop
    await page.waitForTimeout(3000);

    // Check browser console for useAuth logs
    const logs: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('useAuth:')) {
        logs.push(text);
      }
    });

    // Reload page to trigger useAuth
    await page.reload();
    await page.waitForTimeout(2000);

    // Should not have excessive useAuth calls (indicates no loop)
    // Allow up to 3 calls (initial + possible remount), but not more
    expect(logs.length).toBeLessThanOrEqual(3);

    console.log(`useAuth called ${logs.length} times (should be ≤ 3)`);
  });

  test('should handle 401 and clear token', async ({ page, context }) => {
    // Set invalid token in localStorage
    await context.addCookies([{
      name: 'auth-token',
      value: 'invalid-token',
      domain: 'game-plug.rbw.ovh',
      path: '/'
    }]);

    await page.addInitScript(() => {
      localStorage.setItem('access_token', 'invalid-token');
    });

    // Navigate to dashboard (protected route)
    await page.goto(`${BASE_URL}/dashboard`);

    // Should redirect to login or show not authenticated
    await page.waitForTimeout(2000);

    // Check that token was cleared
    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(token).toBeNull();
  });

  test('should preserve token after page reload', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/`);
    await page.getByRole('button', { name: /GM Login|Dev MJ \(Test\)/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Get token
    const tokenBefore = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(tokenBefore).toBeTruthy();

    // Reload page
    await page.reload();
    await page.waitForTimeout(2000);

    // Token should still be there
    const tokenAfter = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(tokenAfter).toBe(tokenBefore);
  });

  test('should not refetch user data excessively', async ({ page }) => {
    let userFetchCount = 0;

    // Intercept /api/auth/user requests
    await page.route('**/api/auth/user', (route) => {
      userFetchCount++;
      route.continue();
    });

    // Login
    await page.goto(`${BASE_URL}/`);
    await page.getByRole('button', { name: /GM Login|Dev MJ \(Test\)/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Wait to ensure no excessive fetching
    await page.waitForTimeout(3000);

    // Should fetch user data only once or twice (initial + possible cache validation)
    expect(userFetchCount).toBeLessThanOrEqual(2);

    console.log(`/api/auth/user called ${userFetchCount} times (should be ≤ 2)`);
  });
});
