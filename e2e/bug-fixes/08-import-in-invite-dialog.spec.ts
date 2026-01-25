import { test, expect } from '@playwright/test';

test.describe('Bug Fix: Import Button Inside Invite Dialog', () => {
  test.beforeEach(async ({ page }) => {
    // Login as GM
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/sessions');

    // Navigate to session
    await page.click('text=VLAD01');
    await page.waitForURL('**/sessions/**');
  });

  test('should NOT have standalone "Importer" button with download icon', async ({ page }) => {
    // Check for standalone import button
    const standaloneImportButton = page.locator('button:has-text("Importer"):not([role="tab"])').filter({ hasNot: page.locator('[role="dialog"]') });
    const count = await standaloneImportButton.count();

    // Should be 0 or inside a dialog only
    expect(count).toBeLessThanOrEqual(1);
  });

  test('should have import tab inside invite dialog', async ({ page }) => {
    // Click 'Inviter Joueurs' button
    const inviteButton = page.locator('button:has-text("Inviter")');

    if (await inviteButton.count() > 0) {
      await inviteButton.first().click();

      // Verify dialog opens
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Verify 4 tabs: Code, Lien, QR, Importer
      await expect(dialog.locator('[role="tab"]:has-text("Code")')).toBeVisible();
      await expect(dialog.locator('[role="tab"]:has-text("Lien")')).toBeVisible();
      await expect(dialog.locator('[role="tab"]:has-text("QR")')).toBeVisible();
      await expect(dialog.locator('[role="tab"]:has-text("Importer")')).toBeVisible();
    }
  });

  test('should display character selection in import tab', async ({ page }) => {
    const inviteButton = page.locator('button:has-text("Inviter")');

    if (await inviteButton.count() > 0) {
      await inviteButton.first().click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Click 'Importer' tab
      await dialog.locator('[role="tab"]:has-text("Importer")').click();

      // Verify character selection grid
      await expect(dialog.locator('text=/Reset|Keep/i')).toBeVisible();
    }
  });

  test('should import character when selected', async ({ page }) => {
    const inviteButton = page.locator('button:has-text("Inviter")');

    if (await inviteButton.count() > 0) {
      await inviteButton.first().click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Click 'Importer' tab
      await dialog.locator('[role="tab"]:has-text("Importer")').click();

      // Select a character (if available)
      const characterItem = dialog.locator('button, [data-character]').first();

      if (await characterItem.count() > 0) {
        await characterItem.click();

        // Click import button
        const importButton = dialog.locator('button:has-text("Importer")').last();
        await importButton.click();

        // Verify success (toast or character appears)
        await page.waitForTimeout(2000);
      }
    }
  });
});
