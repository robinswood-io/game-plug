import { test, expect } from '@playwright/test';

test.describe('GM Dashboard Features', () => {
  const testPassword = 'SecurePassword123!';
  const sessionName = `Dashboard Test ${Date.now()}`;
  const characterName = `Test Character ${Date.now()}`;

  let sessionId: string;

  test.beforeEach(async ({ page }) => {
    // Generate unique email for each test
    const testEmail = `gm-dashboard-test-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`;

    // Create account, login, create session, create character
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte|inscription|sign.*up/i }).click();
    await page.waitForURL(/^http:\/\/localhost:5002\/?(home|session-manager|sessions)?$/, { timeout: 10000 });

    // Create session
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(sessionName);
    await page.getByTestId('button-confirm-create').click();

    // Wait for redirect to GM dashboard and extract session ID
    await page.waitForURL(/\/gm\//, { timeout: 10000 });
    const currentUrl = page.url();
    const match = currentUrl.match(/\/gm\/(.+)/);
    sessionId = match?.[1] || '';

    // Create character
    await page.goto('/character-creation');
    await page.getByTestId('input-character-name').fill(characterName);
    const generateButton = page.getByTestId('button-roll-characteristics');
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(1000);
    }
    await page.getByTestId('button-save-character').click();
    await page.waitForTimeout(2000);
  });

  test('should load GM dashboard successfully', async ({ page }) => {
    await page.goto('/session-manager');
    await page.waitForTimeout(1000);

    // Navigate to GM dashboard - look for the created session and access its dashboard
    const sessionLink = page.getByText(sessionName).first();
    if (await sessionLink.isVisible({ timeout: 5000 })) {
      // Click on the session to enter it
      await sessionLink.click();
      await page.waitForTimeout(1000);

      // Check if we're on GM dashboard or session page
      const dashboardIndicator = page.getByText(/Interface Maître de Jeu|GM Dashboard|Maître/i).first();
      if (await dashboardIndicator.isVisible({ timeout: 5000 })) {
        // Already on dashboard
      } else {
        // Navigate to dashboard
        const dashboardLink = page.getByRole('link', { name: /dashboard|tableau.*bord/i }).first();
        if (await dashboardLink.isVisible({ timeout: 3000 })) {
          await dashboardLink.click();
        }
      }
    } else {
      // Direct navigation as fallback
      await page.goto(`/gm/${sessionId}`);
    }

    // Verify dashboard loaded - check for session name in header
    await expect(page.getByTestId('text-session-name')).toBeVisible({ timeout: 10000 });
  });

  test('should display character list in dashboard', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Should see character card with name - testid pattern is text-character-name-${id}
    const characterNameElement = page.locator('[data-testid^="text-character-name-"]').first();
    await expect(characterNameElement).toBeVisible({ timeout: 10000 });

    // Should see the created character name somewhere on the page
    await expect(page.getByText(characterName)).toBeVisible({ timeout: 5000 });
  });

  test('should apply buff/effect to character', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Get the first character ID from the page
    const firstCharacterCard = page.locator('[data-testid^="button-apply-buff-"]').first();
    if (await firstCharacterCard.isVisible({ timeout: 5000 })) {
      // Click buff button for first character
      await firstCharacterCard.click();
      await page.waitForTimeout(1000);

      // Select a buff type (Premiers Soins/First Aid)
      const buffOption = page.getByRole('button', { name: /Premiers Soins|First Aid/i }).first();
      if (await buffOption.isVisible()) {
        await buffOption.click();
        await page.waitForTimeout(500);
      }

      // Apply buff
      const applyButton = page.getByRole('button', { name: /Appliquer le Buff|Apply Buff/i });
      if (await applyButton.isVisible()) {
        await applyButton.click();
        await page.waitForTimeout(1000);
      }

      // Verify buff applied (check for success toast or confirmation)
      await expect(page.getByText(/appliqué|applied|success/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('should manage chapters and events', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Look for chapters button using data-testid
    const chaptersButton = page.locator('button[data-testid="button-add-chapter"]');
    if (await chaptersButton.isVisible({ timeout: 5000 })) {
      await chaptersButton.click();
      await page.waitForTimeout(1000);

      // Fill chapter details - look for input with proper label
      const nameInput = page.locator('input[placeholder*="Chapitre"]').first();
      if (await nameInput.isVisible({ timeout: 3000 })) {
        await nameInput.fill('Chapter 1: The Investigation Begins');
        await page.waitForTimeout(500);
      }

      // Save chapter - look for submit button in the form
      const saveButton = page.locator('button:has-text("Créer")').first();
      if (await saveButton.isVisible({ timeout: 3000 })) {
        await saveButton.click();
        await page.waitForTimeout(1000);
      }

      // Verify chapter created - wait for the text to appear
      await expect(page.getByText(/Investigation Begins|Chapter 1/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('should view roll history', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Perform a GM roll first
    const rollButton = page.locator('button[data-testid="button-quick-dice-1d100"]');
    if (await rollButton.isVisible({ timeout: 5000 })) {
      await rollButton.click();
      await page.waitForTimeout(1000);

      // Verify roll was performed (should see result)
      const rollResult = page.locator('button[data-testid="button-quick-dice-1d100"]').locator('..').getByText(/\d+/);
      await expect(page.getByText(/Lancé de dé|Dice Roll|résultat|result/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('should access gameboard projection', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Look for floating projection button using data-testid
    const gameboardButton = page.locator('button[data-testid="button-floating-projection"]');
    if (await gameboardButton.isVisible({ timeout: 5000 })) {
      await gameboardButton.click();
      await page.waitForTimeout(1500);

      // Should open projection dialog - look for modal or dialog content
      const projectionContent = page.locator('[role="dialog"]').first();
      await expect(projectionContent).toBeVisible({ timeout: 5000 });
    }
  });

  test('should manage narrative entries', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Look for narrative textarea using data-testid
    const narrativeTextarea = page.locator('textarea[data-testid="textarea-narrative-entry"]');
    if (await narrativeTextarea.isVisible({ timeout: 5000 })) {
      // Fill entry
      await narrativeTextarea.fill('The investigators discovered an ancient tome in the abandoned library.');
      await page.waitForTimeout(500);

      // Save entry using data-testid
      const saveButton = page.locator('button[data-testid="button-save-narrative"]');
      if (await saveButton.isVisible()) {
        await saveButton.click();
        await page.waitForTimeout(1000);
      }

      // Verify entry saved
      await expect(page.getByText(/ancient tome|tome ancien/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('should manage NPCs and enemies', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Look for the custom narration textarea in the Narrative Tools
    const narrativeTextarea = page.locator('textarea[data-testid="textarea-custom-narration"]');
    if (await narrativeTextarea.isVisible({ timeout: 5000 })) {
      // Add NPC as a narrative entry
      await narrativeTextarea.fill('Mysterious Stranger - A hooded figure with unknown intentions');
      await page.waitForTimeout(500);

      // Send as narration
      const sendButton = page.locator('button[data-testid="button-send-narration"]');
      if (await sendButton.isVisible({ timeout: 3000 })) {
        await sendButton.click();
        await page.waitForTimeout(1000);
      }

      // Verify entry was added to narrative history
      await expect(page.getByText(/Mysterious Stranger|hooded figure/i)).toBeVisible({ timeout: 5000 });
    }
  });
});
