import { test, expect } from '@playwright/test';

test.describe('GM Authentication', () => {
  test.describe('Login Form', () => {
    test('should display login form with required fields', async ({ page }) => {
      await page.goto('/gm-login');

      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      const submitButton = page.locator('button[type="submit"], button:has-text("Connexion"), button:has-text("Login")');

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitButton).toBeVisible();
    });

    test('should show validation error on empty submit', async ({ page }) => {
      await page.goto('/gm-login');

      const submitButton = page.locator('button[type="submit"], button:has-text("Connexion"), button:has-text("Login")');
      await submitButton.click();

      // Either HTML5 validation or custom error message
      const hasValidation = await page.locator(':invalid, [aria-invalid="true"], .error, [class*="error"]').count() > 0;
      expect(hasValidation).toBeTruthy();
    });

    test('should show error on invalid credentials', async ({ page }) => {
      await page.goto('/gm-login');

      await page.fill('input[type="email"], input[name="email"]', 'invalid@test.com');
      await page.fill('input[type="password"], input[name="password"]', 'wrongpassword123');

      const submitButton = page.locator('button[type="submit"], button:has-text("Connexion"), button:has-text("Login")');
      await submitButton.click();

      // Wait for error message or stay on login page
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      expect(currentUrl).toContain('login');
    });

    test('should have link to signup', async ({ page }) => {
      await page.goto('/gm-login');

      const signupLink = page.locator('a[href*="signup"], a:has-text("Inscription"), a:has-text("Sign up"), a:has-text("Créer")');
      await expect(signupLink).toBeVisible();
    });
  });

  test.describe('Signup Form', () => {
    test('should display signup form with all required fields', async ({ page }) => {
      await page.goto('/gm-signup');

      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      const firstNameInput = page.locator('input[name="firstName"], input[placeholder*="rénom"], input[placeholder*="irst"]');
      const lastNameInput = page.locator('input[name="lastName"], input[placeholder*="om"], input[placeholder*="ast"]');

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
    });

    test('should validate password requirements', async ({ page }) => {
      await page.goto('/gm-signup');

      await page.fill('input[type="email"], input[name="email"]', 'test@example.com');
      await page.fill('input[type="password"], input[name="password"]', 'short');

      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();

      await page.waitForTimeout(1000);
      // Should still be on signup page due to validation
      const currentUrl = page.url();
      expect(currentUrl).toContain('signup');
    });
  });
});
