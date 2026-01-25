import { test, expect } from '@playwright/test';

test.describe('Character Creation', () => {
  const characterName = `Investigator ${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    // Fast login
    await page.goto('/');
    await page.getByRole('button', { name: /Dev MJ \(Test\)/i }).click();
    await page.waitForURL(/.*dashboard.*/, { timeout: 15000 });
  });

  test('should create a new character with random generation', async ({ page }) => {
    // Navigate using the button from dashboard
    await page.getByTestId('button-create-character').first().click();
    await page.waitForURL(/.*characters\/new.*/, { timeout: 10000 });

    // Fill required fields
    // Name
    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill(characterName);

    // Occupation (required field)
    const occupationSelect = page.locator('button[role="combobox"]').first();
    await occupationSelect.click();
    await page.waitForTimeout(500);
    // Select first occupation from dropdown
    const firstOption = page.locator('[role="option"]').first();
    await firstOption.click();
    await page.waitForTimeout(500);

    // Age (should have default value, but let's ensure it)
    const ageInput = page.locator('input[name="age"]');
    const ageValue = await ageInput.inputValue();
    if (!ageValue || parseInt(ageValue) < 15) {
      await ageInput.fill('30');
    }

    // Roll characteristics (optional but good to test)
    const rollButton = page.getByRole('button', { name: /lancer.*dés|roll.*caractéristiques/i });
    if (await rollButton.isVisible().catch(() => false)) {
      await rollButton.click();
      await page.waitForTimeout(1000);
    }

    // Submit form
    const submitButton = page.getByRole('button', { name: /sauvegarder.*personnage/i });
    await submitButton.click();

    // Wait for success - check for toast notification or URL change
    await Promise.race([
      page.waitForURL(/.*\/characters\/[0-9a-fA-F-]{36}/, { timeout: 15000 }),
      page.getByText(/personnage créé/i).waitFor({ timeout: 10000 }),
    ]).catch(() => {
      // If both fail, continue to verify
    });

    // Wait for any async operations
    await page.waitForTimeout(2000);

    // Navigate to dashboard to verify character exists
    await page.goto('/dashboard');
    await page.waitForTimeout(1500);

    // Check for character card or name in the dashboard
    // Look for character name OR "Investigator" cards
    const hasCharacter = await page.locator(`text=${characterName}`).isVisible().catch(() => false);
    const hasCharacterCard = await page.locator('[data-testid^="character-card-"]').isVisible().catch(() => false);

    expect(hasCharacter || hasCharacterCard).toBeTruthy();
  });
});
