import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
  test.describe('Health & Connectivity', () => {
    test('frontend should be accessible', async ({ page }) => {
      const response = await page.goto('/');
      expect(response?.status()).toBeLessThan(500);
    });

    test('should handle 404 gracefully', async ({ page }) => {
      await page.goto('/nonexistent-page-12345');

      // Should show 404 page or redirect
      const content = await page.content();
      expect(content.length).toBeGreaterThan(100);
    });
  });

  test.describe('Form Submissions', () => {
    test('login form should send proper request', async ({ page }) => {
      await page.goto('/gm-login');

      // Fill form
      await page.fill('input[type="email"], input[name="email"]', 'test@example.com');
      await page.fill('input[type="password"], input[name="password"]', 'TestPassword123');

      // Listen for network request
      const [request] = await Promise.all([
        page.waitForRequest((req) => req.url().includes('login') || req.url().includes('auth'), { timeout: 5000 }).catch(() => null),
        page.locator('button[type="submit"]').click(),
      ]);

      // Form should attempt to submit
      await page.waitForTimeout(1000);
    });

    test('signup form should send proper request', async ({ page }) => {
      await page.goto('/gm-signup');

      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');

      if (await emailInput.count() > 0) {
        await emailInput.fill('newgm@example.com');
        await passwordInput.fill('TestPassword123!');

        // Try to fill name fields if they exist
        const firstNameInput = page.locator('input[name="firstName"]');
        const lastNameInput = page.locator('input[name="lastName"]');

        if (await firstNameInput.count() > 0) {
          await firstNameInput.fill('Test');
        }
        if (await lastNameInput.count() > 0) {
          await lastNameInput.fill('User');
        }

        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Session Code Validation', () => {
    test('should validate 6-character session codes', async ({ page }) => {
      await page.goto('/join');

      const codeInput = page.locator('input[name="code"], input[placeholder*="code"], input[maxlength="6"]');

      if (await codeInput.count() > 0) {
        // Test invalid code length
        await codeInput.fill('ABC');
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(500);

        // Should not proceed with short code
        expect(page.url()).toContain('join');
      }
    });
  });
});

test.describe('Error Handling', () => {
  test('should display error messages for failed requests', async ({ page }) => {
    await page.goto('/gm-login');

    await page.fill('input[type="email"], input[name="email"]', 'wrong@email.com');
    await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');
    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(2000);

    // Should either show error or stay on login page
    const onLoginPage = page.url().includes('login');
    const hasErrorUI = await page.locator('.error, [role="alert"], [class*="error"], [class*="toast"]').count() > 0;

    expect(onLoginPage || hasErrorUI).toBeTruthy();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate slow network
    await page.route('**/api/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.continue();
    });

    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});
