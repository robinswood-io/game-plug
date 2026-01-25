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

    // Fill character name
    const nameInput = page.locator('input[name="name"], input[name="firstName"]');
    await nameInput.first().fill(characterName);

    // Roll characteristics
    const rollButton = page.getByRole('button', { name: /lancer.*dés|roll|générer/i });
    if (await rollButton.isVisible()) {
        await rollButton.click();
    }

    // Submit
    const submitButton = page.getByRole('button', { name: /sauvegarder|créer|submit/i });
    await submitButton.last().click();

    // SUCCESS REDIRECT: to /characters/[id]
    await page.waitForURL(/.*characters\/[0-9a-fA-F-]{36}.*/, { timeout: 20000 });
    
    // Go to dashboard to verify presence
    await page.goto('/dashboard');
    
    // Check for the character card
    await expect(page.getByText(characterName)).toBeVisible({ timeout: 15000 });
  });
});
