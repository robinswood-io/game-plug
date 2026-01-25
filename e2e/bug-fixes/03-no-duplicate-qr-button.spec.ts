import { test, expect } from '@playwright/test';

test.describe('Bug Fix: No Duplicate QR Button in Session Header', () => {
  test.beforeEach(async ({ page }) => {
    // Login as GM
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/sessions');

    // Navigate to a session
    await page.click('text=VLAD01');
    await page.waitForURL('**/sessions/**');
  });

  test('should have only ONE QR-related button in header', async ({ page }) => {
    // Count buttons with QR icon or QR text
    const qrButtons = page.locator('button:has-text("QR"), button:has([data-icon="qr"])');
    const count = await qrButtons.count();

    // Should only have 1 QR button
    expect(count).toBeLessThanOrEqual(1);
  });

  test('should NOT have duplicate "Partager (QR)" button with aged-gold border', async ({ page }) => {
    // Check for button with aged-gold styling AND QR icon
    const duplicateButton = page.locator('button.border-aged-gold:has-text("QR"), button.text-aged-gold:has-text("QR")');
    const count = await duplicateButton.count();

    // Should be 0 or 1, not 2+
    expect(count).toBeLessThanOrEqual(1);
  });

  test('should have single "Partager (QR)" button that opens modal', async ({ page }) => {
    // Find the QR button
    const qrButton = page.locator('button:has-text("Partager")').first();
    await expect(qrButton).toBeVisible();

    // Click it
    await qrButton.click();

    // Verify modal opens with QR code
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Verify QR code is displayed
    const qrCode = modal.locator('canvas, img[alt*="QR"], svg');
    await expect(qrCode.first()).toBeVisible();
  });

  test('should have share actions inside QR modal only', async ({ page }) => {
    // Click QR button
    await page.locator('button:has-text("Partager")').first().click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Verify 'Copier le Lien' button inside modal
    await expect(modal.locator('button:has-text("Copier")')).toBeVisible();

    // If share API is available, verify share button
    const shareButton = modal.locator('button:has-text("Partager")');
    if (await shareButton.count() > 0) {
      await expect(shareButton).toBeVisible();
    }
  });

  test('should copy link when "Copier le Lien" is clicked', async ({ page }) => {
    // Click QR button
    await page.locator('button:has-text("Partager")').first().click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Click copy button
    await modal.locator('button:has-text("Copier")').click();

    // Verify toast notification
    await expect(page.locator('text=/Lien copié|Copied/')).toBeVisible({ timeout: 5000 });
  });
});
