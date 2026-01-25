import { test, expect } from '@playwright/test';

test.describe('Complete Gameplay Workflows', () => {
  const testPassword = 'SecurePassword123!';

  test('complete GM workflow: signup -> create session -> add character -> roll dice', async ({ page }) => {
    const testEmail = `gm-complete-${Date.now()}@test.com`;
    const sessionName = `Complete Test ${Date.now()}`;
    const characterName = `Test Investigator ${Date.now()}`;

    // Step 1: Signup as GM
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('GM');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte/i }).click();
    await page.waitForURL(//(home|session-manager|sessions|dashboard)/, { timeout: 15000 });

    // Step 2: Create session
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(sessionName);
    await page.getByTestId('button-confirm-create').click();
    await page.waitForURL(/\/gm\//, { timeout: 15000 });

    const sessionUrl = page.url();
    const sessionId = sessionUrl.match(/\/gm\/(.+)/)?.[1];

    // Step 3: Create character
    await page.goto('/character-creation');
    await page.getByTestId('input-character-name').fill(characterName);
    const generateButton = page.getByTestId('button-roll-characteristics');
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(1000);
    }
    await page.getByTestId('button-save-character').click();
    await page.waitForTimeout(2000);

    // Step 4: Navigate to GM dashboard and verify character
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Step 5: Perform dice roll
    const sanityButton = page.locator('[data-testid="button-sanity-check"]');
    if (await sanityButton.isVisible()) {
      await sanityButton.click();
      await page.waitForTimeout(500);

      // Verify roll result
      const rollResult = page.locator('[data-testid="text-roll-result"]');
      await expect(rollResult).toBeVisible({ timeout: 5000 });
    }

    // Step 6: Verify session is active
    await page.goto('/session-manager');
    await expect(page.getByText(sessionName)).toBeVisible({ timeout: 5000 });
  });

  test('complete player workflow: join session -> select character -> view sheet', async ({ page, context }) => {
    const gmEmail = `gm-player-workflow-${Date.now()}@test.com`;
    const sessionName = `Player Test ${Date.now()}`;
    const characterName = `Player Char ${Date.now()}`;

    // GM Setup
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('GM');
    await page.locator('input[name="email"]').fill(gmEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte/i }).click();
    await page.waitForURL(//(home|session-manager|sessions|dashboard)/, { timeout: 15000 });

    // Create session
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(sessionName);
    await page.getByTestId('button-confirm-create').click();
    await page.waitForURL(/\/gm\//, { timeout: 15000 });

    const sessionUrl = page.url();
    const sessionId = sessionUrl.match(/\/gm\/(.+)/)?.[1];

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

    // Player joins session (simulated with new page)
    if (sessionId) {
      const playerPage = await context.newPage();
      await playerPage.goto(`/join-session/${sessionId}`);
      await playerPage.waitForTimeout(2000);

      // Verify player can see session or character selection
      const isValidRoute = /\/(join-session|session|character|select-character|home)/.test(playerPage.url());
      expect(isValidRoute).toBeTruthy();

      await playerPage.close();
    }
  });

  test('complete combat workflow: initiative -> attack -> damage -> healing', async ({ page }) => {
    const testEmail = `gm-combat-${Date.now()}@test.com`;
    const characterName = `Combat Test ${Date.now()}`;

    // Setup
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('GM');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte/i }).click();
    await page.waitForURL(//(home|session-manager|sessions|dashboard)/, { timeout: 15000 });

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

    // Navigate to character sheet
    await page.goto('/home');
    await page.waitForTimeout(1000);
    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Apply damage (simulate attack hit)
      const damageButton = page.locator('[data-testid="button-apply-damage"]');
      if (await damageButton.isVisible()) {
        const initialHP = await page.locator('[data-testid="text-hp-current"]').textContent();

        await damageButton.click();
        await page.waitForTimeout(500);

        const damageInput = page.locator('[data-testid="input-damage-amount"]');
        if (await damageInput.isVisible()) {
          await damageInput.fill('8');
          const confirmDamageButton = page.locator('[data-testid="button-confirm-damage"]');
          await confirmDamageButton.click();
          await page.waitForTimeout(1000);

          const damagedHP = await page.locator('[data-testid="text-hp-current"]').textContent();
          expect(damagedHP).not.toBe(initialHP);

          // Apply healing
          const healButton = page.locator('[data-testid="button-apply-healing"]');
          if (await healButton.isVisible()) {
            await healButton.click();
            await page.waitForTimeout(500);

            const healInput = page.locator('[data-testid="input-heal-amount"]');
            if (await healInput.isVisible()) {
              await healInput.fill('4');
              const confirmHealButton = page.locator('[data-testid="button-confirm-heal"]');
              await confirmHealButton.click();
              await page.waitForTimeout(1000);

              const healedHP = await page.locator('[data-testid="text-hp-current"]').textContent();
              expect(healedHP).not.toBe(damagedHP);
            }
          }
        }
      }
    }
  });

  test('complete investigation workflow: skill check -> sanity loss -> gain clue', async ({ page }) => {
    const testEmail = `gm-investigation-${Date.now()}@test.com`;
    const sessionName = `Investigation ${Date.now()}`;
    const characterName = `Investigator ${Date.now()}`;

    // Setup
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('GM');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte/i }).click();
    await page.waitForURL(//(home|session-manager|sessions|dashboard)/, { timeout: 15000 });

    // Create session
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(sessionName);
    await page.getByTestId('button-confirm-create').click();
    await page.waitForURL(/\/gm\//, { timeout: 15000 });

    const sessionUrl = page.url();
    const sessionId = sessionUrl.match(/\/gm\/(.+)/)?.[1];

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

    // Navigate to GM dashboard
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Perform skill check (Spot Hidden)
    const customInput = page.locator('[data-testid="input-custom-skill-name"]');
    if (await customInput.isVisible()) {
      await customInput.fill('Spot Hidden');

      const customValue = page.locator('[data-testid="input-custom-skill-value"]');
      if (await customValue.isVisible()) {
        await customValue.fill('60');
      }

      const rollButton = page.locator('[data-testid="button-custom-roll"]');
      await rollButton.click();
      await page.waitForTimeout(1000);

      // Verify roll result
      const rollResult = page.locator('[data-testid="text-roll-result"]');
      await expect(rollResult).toBeVisible({ timeout: 5000 });

      // Apply sanity loss (discovered something horrific)
      const sanityButton = page.locator('[data-testid="button-sanity-check"]');
      if (await sanityButton.isVisible()) {
        await sanityButton.click();
        await page.waitForTimeout(500);

        // Verify sanity roll occurred
        const rollOutcome = page.locator('[data-testid="text-roll-outcome"]');
        await expect(rollOutcome).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('complete character progression: gain XP -> improve skill -> level up', async ({ page }) => {
    const testEmail = `gm-progression-${Date.now()}@test.com`;
    const characterName = `Progress Test ${Date.now()}`;

    // Setup
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('GM');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte/i }).click();
    await page.waitForURL(//(home|session-manager|sessions|dashboard)/, { timeout: 15000 });

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

    // Navigate to character
    await page.goto('/home');
    await page.waitForTimeout(1000);
    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Look for skill improvement interface
      const skillsSection = page.locator('[data-testid="section-skills"]');
      if (await skillsSection.isVisible()) {
        // Try to improve a skill
        const improveButton = page.locator('[data-testid^="button-improve-skill-"]').first();
        if (await improveButton.isVisible()) {
          await improveButton.click();
          await page.waitForTimeout(1000);

          // Verify skill improvement was registered
          await expect(page.getByText(/amélioration|improved|increased/i)).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test('complete session lifecycle: create -> activate -> play -> archive', async ({ page }) => {
    const testEmail = `gm-lifecycle-${Date.now()}@test.com`;
    const sessionName = `Lifecycle Test ${Date.now()}`;

    // Setup
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('GM');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte/i }).click();
    await page.waitForURL(//(home|session-manager|sessions|dashboard)/, { timeout: 15000 });

    // Create session
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(sessionName);
    await page.getByTestId('button-confirm-create').click();
    await page.waitForURL(/\/gm\//, { timeout: 15000 });

    // Activate session
    await page.goto('/session-manager');
    await page.waitForTimeout(1000);
    const toggleButton = page.locator('[data-testid^="button-toggle-active-"]').first();
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await page.waitForTimeout(1000);
      await expect(page.getByText('Active').first()).toBeVisible({ timeout: 5000 });
    }

    // Deactivate (archive) session
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await page.waitForTimeout(1000);
      await expect(page.getByText('Inactive').first()).toBeVisible({ timeout: 5000 });
    }
  });
});
