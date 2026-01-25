import { test, expect } from '@playwright/test';

test.describe('Bug Fix: Inventory Add Button', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/sessions');

    // Navigate to session
    await page.click('text=VLAD01');
    await page.waitForURL('**/sessions/**');

    // Click on a character card
    await page.locator('.character-card, [data-character]').first().click();
    await page.waitForTimeout(1000);
  });

  test('should add item to character inventory', async ({ page }) => {
    // Find 'Ajouter des Objets' tab
    const addItemsTab = page.locator('[role="tab"]:has-text("Ajouter"), [role="tab"]:has-text("Objets")');

    if (await addItemsTab.count() > 0) {
      await addItemsTab.first().click();

      // Find 'Ajouter' button on an item
      const addButton = page.locator('button:has-text("Ajouter")').first();

      if (await addButton.count() > 0) {
        await addButton.click();

        // Verify button shows loading state
        await expect(page.locator('button:has-text("Ajout en cours"), button[disabled]:has-text("Ajouter")')).toBeVisible({ timeout: 2000 });

        // Verify toast notification
        await expect(page.locator('text=/Objet ajouté|Item added/i')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should disable button during request', async ({ page }) => {
    const addItemsTab = page.locator('[role="tab"]:has-text("Ajouter"), [role="tab"]:has-text("Objets")');

    if (await addItemsTab.count() > 0) {
      await addItemsTab.first().click();

      const addButton = page.locator('button:has-text("Ajouter")').first();

      if (await addButton.count() > 0) {
        await addButton.click();

        // Button should be disabled during request
        const isDisabled = await addButton.isDisabled();
        expect(isDisabled).toBe(true);
      }
    }
  });

  test('[DEBUG] should log to console', async ({ page }) => {
    const consoleLogs: string[] = [];

    // Capture console logs
    page.on('console', msg => {
      if (msg.text().includes('[DEBUG]')) {
        consoleLogs.push(msg.text());
      }
    });

    const addItemsTab = page.locator('[role="tab"]:has-text("Ajouter"), [role="tab"]:has-text("Objets")');

    if (await addItemsTab.count() > 0) {
      await addItemsTab.first().click();

      const addButton = page.locator('button:has-text("Ajouter")').first();

      if (await addButton.count() > 0) {
        await addButton.click();
        await page.waitForTimeout(2000);

        // Verify debug logs
        expect(consoleLogs.length).toBeGreaterThan(0);
      }
    }
  });
});
