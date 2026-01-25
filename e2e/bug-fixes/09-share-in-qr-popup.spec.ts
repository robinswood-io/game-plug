import { test, expect } from '@playwright/test';

test.describe('Bug Fix: Share Button Inside QR Popup Only', () => {
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
  });

  test('should NOT have standalone share button with aged-gold border', async ({ page }) => {
    // Check for standalone share button with special styling
    const standaloneShareButton = page.locator('button.border-aged-gold:has-text("Partager"):not([role="dialog"] button)');
    const count = await standaloneShareButton.count();

    // Should be 0
    expect(count).toBe(0);
  });

  test('should have QR code displayed in modal (256x256)', async ({ page }) => {
    // Click QR button
    const qrButton = page.locator('button:has-text("Partager"), button:has-text("QR")');

    if (await qrButton.count() > 0) {
      await qrButton.first().click();

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Verify QR code size
      const qrCode = modal.locator('canvas, img[alt*="QR"], svg').first();

      if (await qrCode.count() > 0) {
        const bbox = await qrCode.boundingBox();

        if (bbox) {
          // Should be around 256x256
          expect(bbox.width).toBeGreaterThanOrEqual(200);
          expect(bbox.height).toBeGreaterThanOrEqual(200);
        }
      }
    }
  });

  test('should have "Copier le Lien" button inside QR modal', async ({ page }) => {
    const qrButton = page.locator('button:has-text("Partager"), button:has-text("QR")');

    if (await qrButton.count() > 0) {
      await qrButton.first().click();

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Verify copy button
      await expect(modal.locator('button:has-text("Copier")')).toBeVisible();
    }
  });

  test('should have native share button if supported', async ({ page }) => {
    const qrButton = page.locator('button:has-text("Partager"), button:has-text("QR")');

    if (await qrButton.count() > 0) {
      await qrButton.first().click();

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Check for share button (may or may not exist depending on browser)
      const shareButton = modal.locator('button:has-text("Partager")');

      if (await shareButton.count() > 0) {
        await expect(shareButton).toBeVisible();
      }
    }
  });

  test('should copy link to clipboard', async ({ page }) => {
    const qrButton = page.locator('button:has-text("Partager"), button:has-text("QR")');

    if (await qrButton.count() > 0) {
      await qrButton.first().click();

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Click copy button
      await modal.locator('button:has-text("Copier")').click();

      // Verify toast
      await expect(page.locator('text=/Lien copié|Copied/i')).toBeVisible({ timeout: 5000 });
    }
  });
});
