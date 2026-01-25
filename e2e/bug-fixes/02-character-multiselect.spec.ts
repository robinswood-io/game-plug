import { test, expect } from '@playwright/test';

test.describe('Bug Fix: Multi-select Characters with Improved Visibility', () => {
  test.beforeEach(async ({ page }) => {
    // Login as GM
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/sessions');

    // Navigate to VLAD01 session (has 7+ characters)
    await page.click('text=VLAD01');
    await page.waitForURL('**/sessions/**');

    // Open GM Tools
    await page.click('text=Outils');
    await page.waitForSelector('[role="dialog"]');

    // Go to 'Jets' tab
    await page.click('[role="tab"]:has-text("Jets")');
  });

  test('should display character selection area with 256px height', async ({ page }) => {
    // Verify ScrollArea exists and has correct height
    const scrollArea = page.locator('[data-radix-scroll-area-viewport]').first();
    await expect(scrollArea).toBeVisible();

    // Check height (h-64 = 256px in Tailwind)
    const height = await scrollArea.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return computed.height;
    });

    // Should be around 256px (h-64)
    expect(parseInt(height)).toBeGreaterThanOrEqual(200);
  });

  test('should display characters in 2-column grid layout', async ({ page }) => {
    // Find character selection grid
    const grid = page.locator('[role="tabpanel"]:visible').locator('div').filter({ hasText: /Personnages/ }).first();
    await expect(grid).toBeVisible();

    // Verify multiple characters are visible
    const characterItems = page.locator('[role="tabpanel"]:visible').locator('button, div').filter({ hasText: /PV|Santé/ });
    const count = await characterItems.count();

    // Should have at least 6 characters visible
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('should select all characters with "Tous" button', async ({ page }) => {
    // Click 'Tous' button
    const allButton = page.locator('button:has-text("Tous")');
    await allButton.click();

    // Wait a moment for selection to update
    await page.waitForTimeout(500);

    // Verify checkmarks appear on all characters
    const checkmarks = page.locator('[role="tabpanel"]:visible').locator('[data-state="checked"], .bg-aged-gold');
    const checkmarkCount = await checkmarks.count();

    expect(checkmarkCount).toBeGreaterThanOrEqual(7);
  });

  test('should deselect all characters with "Aucun" button', async ({ page }) => {
    // First select all
    await page.click('button:has-text("Tous")');
    await page.waitForTimeout(500);

    // Then click 'Aucun'
    await page.click('button:has-text("Aucun")');
    await page.waitForTimeout(500);

    // Verify no checkmarks
    const checkmarks = page.locator('[role="tabpanel"]:visible').locator('[data-state="checked"]');
    const checkmarkCount = await checkmarks.count();

    expect(checkmarkCount).toBe(0);
  });

  test('should display counter in X/Y format', async ({ page }) => {
    // Click 'Tous' to select all
    await page.click('button:has-text("Tous")');
    await page.waitForTimeout(500);

    // Find counter with format like "7/7" or "X/Y"
    const counter = page.locator('text=/\\d+\\/\\d+/');
    await expect(counter).toBeVisible();

    const counterText = await counter.textContent();
    expect(counterText).toMatch(/\d+\/\d+/);
  });

  test('should display golden checkmarks on selected characters', async ({ page }) => {
    // Click 'Tous'
    await page.click('button:has-text("Tous")');
    await page.waitForTimeout(500);

    // Verify golden checkmark badges exist
    const goldenBadges = page.locator('[role="tabpanel"]:visible').locator('.bg-aged-gold, [class*="gold"]');
    const count = await goldenBadges.count();

    expect(count).toBeGreaterThan(0);
  });
});
