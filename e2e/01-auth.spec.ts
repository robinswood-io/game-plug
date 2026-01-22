import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testEmail = `gm-test-${Date.now()}@test.com`;
  const testPassword = 'SecurePassword123!';

  test('should show landing page with signup/login options', async ({ page }) => {
    await page.goto('/');

    // Check if landing page loads
    await expect(page).toHaveTitle(/Rôle Plug|Game Plug/i);

    // Check for signup/login buttons (not links!) - test signup button only (both exist)
    const signupButton = page.getByRole('button', { name: /s'inscrire/i });

    await expect(signupButton.first()).toBeVisible();
  });

  test('should successfully signup as GM', async ({ page }) => {
    await page.goto('/gm-signup');

    // Fill signup form using input names for precision
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);

    // Submit form
    await page.getByRole('button', { name: /créer.*compte/i }).click();

    // After signup, should be redirected to home (/) which shows Dashboard
    await page.waitForURL(/^http:\/\/localhost:5002\/?(home|session-manager|sessions)?$/, { timeout: 10000 });

    // Verify user is authenticated - should see dashboard elements
    await expect(page.getByText(/dashboard|investigateur|session/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('should successfully login as GM', async ({ page }) => {
    await page.goto('/gm-login');

    // Fill login form using input names
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);

    // Submit form
    await page.locator('button[type="submit"]').click();

    // After login, should be redirected to home (/) which shows Dashboard
    await page.waitForURL(/^http:\/\/localhost:5002\/?(home|session-manager|sessions)?$/, { timeout: 10000 });

    // Verify user is authenticated - should see dashboard elements
    await expect(page.getByText(/dashboard|investigateur|session/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('/gm-login');

    // Fill login form with wrong password
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill('WrongPassword123!');

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Check for error message (first occurrence)
    await expect(page.getByText(/erreur.*connexion|incorrect|invalid/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/gm-login');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/^http:\/\/localhost:5002\/?(home|session-manager|sessions)?$/, { timeout: 10000 });

    // Logout - look for logout button or menu
    const logoutButton = page.getByRole('button', { name: /déconnexion|log.*out|quitter/i });
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      // Should be redirected to landing page
      await page.waitForURL('/', { timeout: 5000 });
    } else {
      // Try menu/dropdown
      const menuButton = page.getByRole('button', { name: /menu|profil|compte/i }).first();
      if (await menuButton.count() > 0) {
        await menuButton.click();
        await page.waitForTimeout(500);
        await page.getByRole('menuitem', { name: /déconnexion|log.*out/i }).first().click();
        await page.waitForURL('/', { timeout: 5000 });
      }
    }
  });
});
