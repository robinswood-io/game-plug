import { test, expect } from '@playwright/test';

test.describe('Bug Fix: GM Tools Modal with 4 Tabs', () => {
  test.beforeEach(async ({ page }) => {
    // Login as GM
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for redirect to sessions
    await page.waitForURL('**/sessions');

    // Navigate to VLAD01 session
    await page.click('text=VLAD01');
    await page.waitForURL('**/sessions/**');
  });

  test('should open GM tools in modal (not popover) with 4 tabs', async ({ page }) => {
    // Click 'Outils' button
    await page.click('text=Outils');

    // Verify modal opens (not popover)
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Verify modal title
    await expect(modal.locator('text=Outils du Maître de Jeu')).toBeVisible();

    // Verify 4 tabs are visible
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(4);

    // Verify tab names
    await expect(page.locator('[role="tab"]:has-text("Jets")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Ambiance")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Narration")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Utilitaires")')).toBeVisible();
  });

  test('should switch between tabs correctly', async ({ page }) => {
    await page.click('text=Outils');
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Click 'Ambiance' tab
    await page.click('[role="tab"]:has-text("Ambiance")');
    await expect(page.locator('[role="tabpanel"]:visible')).toContainText('Ambiance');

    // Click 'Narration' tab
    await page.click('[role="tab"]:has-text("Narration")');
    await expect(page.locator('[role="tabpanel"]:visible')).toContainText('Narration');

    // Click 'Utilitaires' tab
    await page.click('[role="tab"]:has-text("Utilitaires")');
    await expect(page.locator('[role="tabpanel"]:visible')).toContainText('Utilitaires');

    // Click 'Jets' tab
    await page.click('[role="tab"]:has-text("Jets")');
    await expect(page.locator('[role="tabpanel"]:visible')).toContainText('Jets');
  });

  test('should have scrollable content within modal', async ({ page }) => {
    await page.click('text=Outils');
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Verify ScrollArea exists
    const scrollArea = modal.locator('[data-radix-scroll-area-viewport]');
    await expect(scrollArea).toBeVisible();
  });

  test('should close modal with X button', async ({ page }) => {
    await page.click('text=Outils');
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Click close button
    await page.click('[role="dialog"] button[aria-label*="lose"], [role="dialog"] button:has-text("✕")');

    // Verify modal closes
    await expect(modal).not.toBeVisible();
  });
});
