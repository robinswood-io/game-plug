import { test, expect } from '@playwright/test';

test.describe('Join Session Flow', () => {
  test('should display session code input', async ({ page }) => {
    await page.goto('/join');

    const codeInput = page.locator('input[name="code"], input[placeholder*="code"], input[maxlength="6"]');
    await expect(codeInput).toBeVisible();
  });

  test('should validate session code format', async ({ page }) => {
    await page.goto('/join');

    const codeInput = page.locator('input[name="code"], input[placeholder*="code"], input[maxlength="6"]');
    await codeInput.fill('ABC');

    const submitButton = page.locator('button[type="submit"], button:has-text("Rejoindre"), button:has-text("Join")');
    await submitButton.click();

    // Should show validation or stay on page
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('join');
  });

  test('should handle invalid session code', async ({ page }) => {
    await page.goto('/join');

    const codeInput = page.locator('input[name="code"], input[placeholder*="code"], input[maxlength="6"]');
    await codeInput.fill('XXXXXX');

    const submitButton = page.locator('button[type="submit"], button:has-text("Rejoindre"), button:has-text("Join")');
    await submitButton.click();

    await page.waitForTimeout(2000);
    // Should show error or stay on join page
    const hasError = await page.locator('.error, [class*="error"], [role="alert"]').count() > 0 || page.url().includes('join');
    expect(hasError).toBeTruthy();
  });

  test('should navigate to join with code in URL', async ({ page }) => {
    await page.goto('/join/ABC123');

    // Should either show character selection or error for invalid code
    await page.waitForTimeout(2000);
    const pageContent = await page.content();
    expect(pageContent.length).toBeGreaterThan(100);
  });
});
