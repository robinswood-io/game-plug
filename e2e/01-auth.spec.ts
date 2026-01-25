import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testEmail = `gm-test-${Date.now()}@test.com`;
  const testPassword = 'SecurePassword123!';

  test('should show landing page with login options', async ({ page }) => {
    await page.goto('/');

    // Check if landing page loads
    await expect(page).toHaveTitle(/Game Plug/i);

    // Check for "Invoquer le Gardien" button
    const gmButton = page.getByRole('button', { name: /Invoquer le Gardien/i });
    await expect(gmButton).toBeVisible();
  });

  test('should successfully signup as GM', async ({ page }) => {
    await page.goto('/gm-signup');

    // Fill signup form using input names for precision
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);

    // Submit form
    await page.getByRole('button', { name: /S'inscrire|Sign up|Créer/i }).click();

    // After signup, should be redirected to dashboard
    await page.waitForURL(/.*dashboard.*/, { timeout: 20000 });

    // Verify user is authenticated - should see dashboard elements
    await expect(page.getByText(/dashboard|investigateur|session/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('should successfully login as GM', async ({ page }) => {
    await page.goto('/gm-login');

    // Fill login form using input names
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);

    // Submit form
    await page.locator('button[data-testid="button-login"]').click();

    // After login, should be redirected to dashboard
    await page.waitForURL(/.*dashboard.*/, { timeout: 20000 });

    // Verify user is authenticated
    await expect(page.getByText(/dashboard|investigateur|session/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('should successfully use Dev Login MJ', async ({ page }) => {
    await page.goto('/');
    
    // Click Dev MJ (Test) button
    await page.getByRole('button', { name: /Dev MJ \(Test\)/i }).click();
    
    // Should be redirected to dashboard
    await page.waitForURL(/.*dashboard.*/, { timeout: 20000 });
    
    // Verify MJ context
    await expect(page.getByText(/dashboard/i).first()).toBeVisible();
  });

  test('should successfully use Dev Login Joueur', async ({ page }) => {
    await page.goto('/');
    
    // Click Dev Joueur (TEST01) button
    await page.getByRole('button', { name: /Dev Joueur \(TEST01\)/i }).click();
    
    // Should be redirected to play session or select character
    await page.waitForURL(/.*play\/TEST01|join|select-character.*/, { timeout: 20000 });
  });
});
