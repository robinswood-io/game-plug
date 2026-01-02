import { test, expect } from '@playwright/test';

test.describe('Navigation & Landing Page', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Call of Cthulhu|Game Plug|Rôle/i);
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');

    // Check for GM login/signup links
    const gmLoginLink = page.locator('a[href*="gm-login"], button:has-text("Connexion"), a:has-text("Login")');
    const joinLink = page.locator('a[href*="join"], button:has-text("Rejoindre"), a:has-text("Join")');

    // At least one navigation option should exist
    const hasNavigation = await gmLoginLink.count() > 0 || await joinLink.count() > 0;
    expect(hasNavigation).toBeTruthy();
  });

  test('should navigate to join session page', async ({ page }) => {
    await page.goto('/join');
    await expect(page.locator('input, form')).toBeVisible();
  });

  test('should navigate to GM login page', async ({ page }) => {
    await page.goto('/gm-login');
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
  });

  test('should navigate to GM signup page', async ({ page }) => {
    await page.goto('/gm-signup');
    await expect(page.locator('form')).toBeVisible();
  });
});
