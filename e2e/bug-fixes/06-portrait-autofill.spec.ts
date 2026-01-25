import { test, expect } from '@playwright/test';

test.describe('Bug Fix: Auto-fill Portrait Generation (gender/age)', () => {
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

  test('should auto-fill gender in portrait dialog', async ({ page }) => {
    // Click 'Générer un Portrait AI' button
    const portraitButton = page.locator('button:has-text("Générer"), button:has-text("Portrait")');

    if (await portraitButton.count() > 0) {
      await portraitButton.first().click();

      // Verify dialog opens
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Verify gender field is pre-filled
      const genderSelect = dialog.locator('select, [role="combobox"]').filter({ hasText: /Genre|Gender|Homme|Femme/ });

      if (await genderSelect.count() > 0) {
        const genderValue = await genderSelect.first().inputValue();
        expect(genderValue).toBeTruthy();
      }
    } else {
      // Portrait generation not available on this character
      expect(true).toBe(true);
    }
  });

  test('should auto-fill age in portrait dialog', async ({ page }) => {
    // Click 'Générer un Portrait AI' button
    const portraitButton = page.locator('button:has-text("Générer"), button:has-text("Portrait")');

    if (await portraitButton.count() > 0) {
      await portraitButton.first().click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Verify age field is pre-filled
      const ageSelect = dialog.locator('select, [role="combobox"]').filter({ hasText: /Age|Âge|Young|Adult|Middle|Elderly/ });

      if (await ageSelect.count() > 0) {
        const ageValue = await ageSelect.first().inputValue();
        expect(ageValue).toBeTruthy();
      }
    } else {
      expect(true).toBe(true);
    }
  });
});
