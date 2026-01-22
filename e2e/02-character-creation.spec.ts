import { test, expect } from '@playwright/test';

test.describe('Character Creation', () => {
  const testEmail = `gm-char-test-${Date.now()}@test.com`;
  const testPassword = 'SecurePassword123!';
  const characterName = `Test Investigator ${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    // Create account and login
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte/i }).click();
    await page.waitForURL(/localhost:5002\/(home|session-manager|sessions)?/, { timeout: 10000 });
  });

  test('should create a new character with random generation', async ({ page }) => {
    // Navigate to character creation
    await page.goto('/character-creation');

    // Fill character name
    await page.getByTestId('input-character-name').fill(characterName);

    // Select occupation (if present)
    const occupationSelect = page.getByTestId('select-occupation');
    if (await occupationSelect.isVisible()) {
      await occupationSelect.click();
      await page.getByRole('option', { name: /détective|investigat|auteur|author/i }).first().click();
    }

    // Generate random characteristics
    const generateButton = page.getByTestId('button-roll-characteristics');
    if (await generateButton.isVisible()) {
      await generateButton.click();
    }

    // Wait for characteristics to be generated - check specific stat testids
    await expect(page.getByTestId('stat-strength')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('stat-constitution')).toBeVisible();
    await expect(page.getByTestId('stat-dexterity')).toBeVisible();

    // Continue to next step or save
    const saveButton = page.getByTestId('button-save-character');
    await saveButton.click();

    // Wait for character to be created
    await page.waitForURL(/\/character|\/home|\/session/, { timeout: 10000 });

    // Verify character exists by checking the page heading/title (more specific selector)
    await expect(page.locator('h1, h2').filter({ hasText: characterName })).toBeVisible({ timeout: 5000 });
  });

  test('should show character statistics after creation', async ({ page }) => {
    // Create character first
    await page.goto('/character-creation');
    await page.getByTestId('input-character-name').fill(`${characterName}-2`);

    const generateButton = page.getByTestId('button-roll-characteristics');
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(1000);
    }

    const saveButton = page.getByTestId('button-save-character');
    await saveButton.click();

    // Navigate to character sheet
    await page.waitForURL(/\/character|\/home|\/session/, { timeout: 10000 });

    // Check for character stats using testid selectors
    const statsTestIds = ['strength', 'constitution', 'dexterity', 'intelligence', 'power', 'size', 'appearance', 'education'];
    let foundStats = 0;

    for (const stat of statsTestIds) {
      const statElement = page.getByTestId(`stat-${stat}`);
      if (await statElement.count() > 0) {
        foundStats++;
      }
    }

    // Should find at least 5 stats
    expect(foundStats).toBeGreaterThanOrEqual(5);
  });

  test('should allow editing character details', async ({ page }) => {
    // Create character first
    await page.goto('/character-creation');
    await page.getByTestId('input-character-name').fill(`${characterName}-3`);

    const generateButton = page.getByTestId('button-roll-characteristics');
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(1000);
    }

    const saveButton = page.getByTestId('button-save-character');
    await saveButton.click();
    await page.waitForURL(/\/character|\/home|\/session/, { timeout: 10000 });

    // Find and click edit button
    const editButton = page.getByRole('button', { name: /modifier|edit|éditer/i }).first();
    if (await editButton.isVisible()) {
      await editButton.click();

      // Wait for edit form or mode
      await page.waitForTimeout(1000);

      // Try to edit age or background
      const ageInput = page.getByTestId('input-age');
      if (await ageInput.isVisible()) {
        await ageInput.fill('35');
      }

      // Save changes
      const saveBtnEdit = page.getByRole('button', { name: /sauvegarder|save|enregistrer/i });
      if (await saveBtnEdit.isVisible()) {
        await saveBtnEdit.click();
      }

      // Verify save was successful
      await expect(page.getByText(/sauvegardé|saved|enregistré|success/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('should generate character avatar', async ({ page }) => {
    // Create character
    await page.goto('/character-creation');
    await page.getByTestId('input-character-name').fill(`${characterName}-avatar`);

    // Fill in physical traits for avatar description
    const heightSelect = page.getByTestId('select-height');
    if (await heightSelect.isVisible()) {
      await heightSelect.click();
      await page.getByRole('option').first().click();
    }

    const generateButton = page.getByTestId('button-roll-characteristics');
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(1000);
    }

    // Look for avatar generation button using testid
    const avatarButton = page.getByTestId('button-generate-avatar');
    if (await avatarButton.isVisible()) {
      await avatarButton.click();

      // Wait for avatar image to appear in the preview div (can take time with OpenAI)
      // The img element with data-testid="img-avatar-preview" will appear when avatarUrl is set
      const avatarImg = page.locator('img[data-testid="img-avatar-preview"]');
      await expect(avatarImg).toBeVisible({ timeout: 30000 });
    }

    const saveButton = page.getByTestId('button-save-character');
    await saveButton.click();
    await page.waitForURL(/\/character|\/home|\/session/, { timeout: 10000 });
  });
});
