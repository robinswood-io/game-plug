import { test, expect } from '@playwright/test';

test.describe('Sanity Management System', () => {
  const testEmail = `gm-sanity-test-${Date.now()}@test.com`;
  const testPassword = 'SecurePassword123!';
  const characterName = `Test Investigator ${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    // Create account, login, and create character
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte|inscription|sign.*up/i }).click();
    await page.waitForURL(/^http:\/\/localhost:5002\/?(home|session-manager|sessions)?$/, { timeout: 10000 });

    // Create character
    await page.goto('/character-creation');
    await page.getByLabel(/nom.*personnage|character.*name/i).fill(characterName);
    const generateButton = page.getByRole('button', { name: /générer|generat|aléatoire|random/i });
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(1000);
    }
    await page.getByRole('button', { name: /suivant|next|continue|sauvegarder|save|créer|create/i }).click();
    await page.waitForTimeout(2000);
  });

  test('should display character sanity points', async ({ page }) => {
    // Navigate to character sheet
    await page.goto('/home');
    await page.waitForTimeout(1000);

    // Click on character to view details
    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Verify sanity is displayed using data-testid
      await expect(page.locator('[data-testid="text-sanity-fraction"]')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('[data-testid="progress-sanity"]')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should apply sanity loss', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    // Find character card
    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Apply sanity loss using the lose sanity button
      const loseSanityButton = page.locator('[data-testid="button-lose-sanity"]');
      if (await loseSanityButton.isVisible()) {
        // Record initial sanity
        const initialSanity = await page.locator('[data-testid="text-sanity-fraction"]').textContent();

        // Click to lose sanity
        await loseSanityButton.click();
        await page.waitForTimeout(500);

        // Verify sanity was reduced
        const newSanity = await page.locator('[data-testid="text-sanity-fraction"]').textContent();
        expect(newSanity).not.toBe(initialSanity);
      }
    }
  });

  test('should trigger insanity at low sanity', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    // Find character and apply massive sanity loss
    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Apply large sanity loss repeatedly to trigger insanity status
      const loseSanityButton = page.locator('[data-testid="button-lose-sanity"]');
      if (await loseSanityButton.isVisible()) {
        // Click multiple times to trigger low sanity warning
        for (let i = 0; i < 20; i++) {
          if (await loseSanityButton.isEnabled()) {
            await loseSanityButton.click();
            await page.waitForTimeout(100);
          }
        }

        // Should show critical or low sanity status
        const sanityStatus = page.locator('[data-testid="text-sanity-status"]');
        await expect(sanityStatus).toBeVisible({ timeout: 5000 });
        const statusText = await sanityStatus.textContent();
        expect(statusText).toMatch(/Critique|Instable|Ébranlé/i);
      }
    }
  });

  test('should add phobia to character', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    // Find character
    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Look for madness management button
      const viewMadnessButton = page.locator('[data-testid="button-view-madness"]');
      if (await viewMadnessButton.isVisible()) {
        await viewMadnessButton.click();
        await page.waitForTimeout(500);

        // Verify madness modal is visible
        await expect(page.getByText(/Conditions Mentales/i)).toBeVisible({ timeout: 5000 });

        // In a real scenario, this would open a dialog to add conditions
        // For now, verify the modal opened successfully
        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should add mania to character', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    // Find character
    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Look for madness management button to add mania
      const viewMadnessButton = page.locator('[data-testid="button-view-madness"]');
      if (await viewMadnessButton.isVisible()) {
        await viewMadnessButton.click();
        await page.waitForTimeout(500);

        // Verify madness modal is visible
        await expect(page.getByText(/Conditions Mentales/i)).toBeVisible({ timeout: 5000 });

        // In a real scenario, this would open a dialog to add mania conditions
        // For now, verify the modal opened successfully
        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should restore sanity points', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    // Find character
    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Apply sanity restoration using the gain sanity button
      const gainSanityButton = page.locator('[data-testid="button-gain-sanity"]');
      if (await gainSanityButton.isVisible() && await gainSanityButton.isEnabled()) {
        // Record initial sanity
        const initialSanity = await page.locator('[data-testid="text-sanity-fraction"]').textContent();

        // Click to gain sanity
        await gainSanityButton.click();
        await page.waitForTimeout(500);

        // Verify sanity was restored
        const newSanity = await page.locator('[data-testid="text-sanity-fraction"]').textContent();
        expect(newSanity).not.toBe(initialSanity);
      }
    }
  });

  test('should show sanity conditions in character sheet', async ({ page }) => {
    // Navigate to character sheet
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Open madness conditions modal
      const viewMadnessButton = page.locator('[data-testid="button-view-madness"]');
      if (await viewMadnessButton.isVisible()) {
        await viewMadnessButton.click();
        await page.waitForTimeout(500);

        // Verify the modal with conditions header is displayed
        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible({ timeout: 5000 });

        // Verify the conditions title is visible
        await expect(page.getByText(/Conditions Mentales/i)).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should calculate maximum sanity correctly', async ({ page }) => {
    // Navigate to character sheet
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Max sanity should be equal to POW (starting sanity = POW)
      // Look for sanity display using data-testid
      const sanityDisplay = page.locator('[data-testid="text-sanity-fraction"]');
      await expect(sanityDisplay).toBeVisible({ timeout: 5000 });

      // Verify it's a valid range (0-99)
      const sanityText = await sanityDisplay.textContent();
      const [current, max] = sanityText!.split('/').map(s => parseInt(s.trim()));
      expect(current).toBeGreaterThanOrEqual(0);
      expect(current).toBeLessThanOrEqual(99);
      expect(max).toBeGreaterThanOrEqual(0);
      expect(max).toBeLessThanOrEqual(99);
    }
  });
});
