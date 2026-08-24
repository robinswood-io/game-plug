import { test, expect } from '@playwright/test';

/**
 * HTTP Health Check - Post-Deployment Verification
 *
 * Verifies the deployed application is accessible and functioning
 * at https://game-plug.rbw.ovh after deployment.
 *
 * Execution: npx playwright test e2e/health-check.spec.ts
 */

test.describe('HTTP Health Check - Post-Deployment', () => {

  test('should return 200 for the root URL', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
  });

  test('should load the landing page with expected UI elements', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Title should be set
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // The page should render visible content (not a blank page)
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.trim().length).toBeGreaterThan(0);
  });

  test('should display a login or landing page indicator', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Expect at least one of: a login form, a CTA button, or an auth-related heading
    const loginForm = page.locator('form');
    const ctaButton = page.getByRole('button').first();
    const heading = page.getByRole('heading').first();

    const loginFormVisible = await loginForm.isVisible().catch(() => false);
    const ctaButtonVisible = await ctaButton.isVisible().catch(() => false);
    const headingVisible = await heading.isVisible().catch(() => false);

    expect(loginFormVisible || ctaButtonVisible || headingVisible).toBe(true);
  });

  test('should load without JavaScript errors on the landing page', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (err) => {
      errors.push(err.message);
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Allow minor hydration warnings but fail on hard JS errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('hydrat') && !e.includes('Warning')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should load critical assets without failed network requests', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('requestfailed', (request) => {
      const url = request.url();
      // Only track JS/CSS assets, ignore optional external resources
      if (url.includes('/_next/') || url.endsWith('.js') || url.endsWith('.css')) {
        failedRequests.push(`${request.failure()?.errorText ?? 'unknown'}: ${url}`);
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    expect(failedRequests).toHaveLength(0);
  });

});
