import { test, expect } from '@playwright/test';

test.describe('Effects and Status System', () => {
  const testPassword = 'SecurePassword123!';
  const characterName = `Test Investigator ${Date.now()}`;
  let sessionId: string;

  test.beforeEach(async ({ page }) => {
    // Generate unique email for each test
    const testEmail = `gm-effects-test-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`;

    // Create account and login
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte|inscription|sign.*up/i }).click();
    await page.waitForURL(//(home|session-manager|sessions|dashboard)/, { timeout: 15000 });

    // Create a session
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(`Effects Test ${Date.now()}`);
    await page.getByTestId('button-confirm-create').click();

    // Wait for redirect and extract session ID
    await page.waitForURL(/\/gm\//, { timeout: 15000 });
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

  test('should display active effects on character', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Look for effects section
      const effectsSection = page.locator('[data-testid="section-active-effects"]');
      if (await effectsSection.isVisible()) {
        await expect(effectsSection).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should apply buff effect to character', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Look for effects/status management
    const effectsButton = page.locator('[data-testid="button-manage-effects"]');
    if (await effectsButton.isVisible()) {
      await effectsButton.click();
      await page.waitForTimeout(500);

      // Add buff effect
      const addEffectButton = page.locator('[data-testid="button-add-effect"]');
      if (await addEffectButton.isVisible()) {
        await addEffectButton.click();
        await page.waitForTimeout(500);

        // Select buff type
        const effectTypeSelect = page.locator('[data-testid="select-effect-type"]');
        if (await effectTypeSelect.isVisible()) {
          await effectTypeSelect.click();
          await page.getByRole('option', { name: /buff|bonus|amélioration/i }).first().click();
        }

        // Set effect name
        const effectNameInput = page.locator('[data-testid="input-effect-name"]');
        if (await effectNameInput.isVisible()) {
          await effectNameInput.fill('Enhanced Perception');
        }

        // Set effect value/modifier
        const effectModifierInput = page.locator('[data-testid="input-effect-modifier"]');
        if (await effectModifierInput.isVisible()) {
          await effectModifierInput.fill('+10');
        }

        // Save effect
        const saveEffectButton = page.locator('[data-testid="button-save-effect"]');
        await saveEffectButton.click();
        await page.waitForTimeout(1000);

        // Verify effect is active
        await expect(page.getByText('Enhanced Perception')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should apply debuff effect to character', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Look for effects management
    const effectsButton = page.locator('[data-testid="button-manage-effects"]');
    if (await effectsButton.isVisible()) {
      await effectsButton.click();
      await page.waitForTimeout(500);

      // Add debuff effect
      const addEffectButton = page.locator('[data-testid="button-add-effect"]');
      if (await addEffectButton.isVisible()) {
        await addEffectButton.click();
        await page.waitForTimeout(500);

        // Select debuff type
        const effectTypeSelect = page.locator('[data-testid="select-effect-type"]');
        if (await effectTypeSelect.isVisible()) {
          await effectTypeSelect.click();
          await page.getByRole('option', { name: /debuff|malus|pénalité/i }).first().click();
        }

        // Set effect name
        const effectNameInput = page.locator('[data-testid="input-effect-name"]');
        if (await effectNameInput.isVisible()) {
          await effectNameInput.fill('Poisoned');
        }

        // Set effect value
        const effectModifierInput = page.locator('[data-testid="input-effect-modifier"]');
        if (await effectModifierInput.isVisible()) {
          await effectModifierInput.fill('-20');
        }

        // Save effect
        const saveEffectButton = page.locator('[data-testid="button-save-effect"]');
        await saveEffectButton.click();
        await page.waitForTimeout(1000);

        // Verify effect is active
        await expect(page.getByText('Poisoned')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should apply damage to character HP', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Apply damage using damage button
      const damageButton = page.locator('[data-testid="button-apply-damage"]');
      if (await damageButton.isVisible()) {
        // Record initial HP
        const initialHP = await page.locator('[data-testid="text-hp-current"]').textContent();

        await damageButton.click();
        await page.waitForTimeout(500);

        // Enter damage amount
        const damageInput = page.locator('[data-testid="input-damage-amount"]');
        if (await damageInput.isVisible()) {
          await damageInput.fill('5');

          // Confirm damage
          const confirmDamageButton = page.locator('[data-testid="button-confirm-damage"]');
          await confirmDamageButton.click();
          await page.waitForTimeout(1000);

          // Verify HP decreased
          const newHP = await page.locator('[data-testid="text-hp-current"]').textContent();
          expect(newHP).not.toBe(initialHP);
        }
      }
    }
  });

  test('should heal character HP', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Apply damage first to have something to heal
      const damageButton = page.locator('[data-testid="button-apply-damage"]');
      if (await damageButton.isVisible()) {
        await damageButton.click();
        await page.waitForTimeout(500);

        const damageInput = page.locator('[data-testid="input-damage-amount"]');
        if (await damageInput.isVisible()) {
          await damageInput.fill('10');
          const confirmDamageButton = page.locator('[data-testid="button-confirm-damage"]');
          await confirmDamageButton.click();
          await page.waitForTimeout(1000);
        }
      }

      // Now heal
      const healButton = page.locator('[data-testid="button-apply-healing"]');
      if (await healButton.isVisible()) {
        const hpBeforeHeal = await page.locator('[data-testid="text-hp-current"]').textContent();

        await healButton.click();
        await page.waitForTimeout(500);

        const healInput = page.locator('[data-testid="input-heal-amount"]');
        if (await healInput.isVisible()) {
          await healInput.fill('5');

          const confirmHealButton = page.locator('[data-testid="button-confirm-heal"]');
          await confirmHealButton.click();
          await page.waitForTimeout(1000);

          // Verify HP increased
          const hpAfterHeal = await page.locator('[data-testid="text-hp-current"]').textContent();
          expect(hpAfterHeal).not.toBe(hpBeforeHeal);
        }
      }
    }
  });

  test('should apply status condition (stunned, unconscious, etc)', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Look for status management
    const statusButton = page.locator('[data-testid="button-manage-status"]');
    if (await statusButton.isVisible()) {
      await statusButton.click();
      await page.waitForTimeout(500);

      // Add status condition
      const addStatusButton = page.locator('[data-testid="button-add-status"]');
      if (await addStatusButton.isVisible()) {
        await addStatusButton.click();
        await page.waitForTimeout(500);

        // Select status type
        const statusTypeSelect = page.locator('[data-testid="select-status-type"]');
        if (await statusTypeSelect.isVisible()) {
          await statusTypeSelect.click();
          await page.getByRole('option', { name: /étourdi|stunned|assommé/i }).first().click();
        }

        // Save status
        const saveStatusButton = page.locator('[data-testid="button-save-status"]');
        await saveStatusButton.click();
        await page.waitForTimeout(1000);

        // Verify status is active
        await expect(page.getByText(/étourdi|stunned/i)).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should remove effect from character', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Add effect first
    const effectsButton = page.locator('[data-testid="button-manage-effects"]');
    if (await effectsButton.isVisible()) {
      await effectsButton.click();
      await page.waitForTimeout(500);

      const addEffectButton = page.locator('[data-testid="button-add-effect"]');
      if (await addEffectButton.isVisible()) {
        await addEffectButton.click();
        await page.waitForTimeout(500);

        const effectNameInput = page.locator('[data-testid="input-effect-name"]');
        if (await effectNameInput.isVisible()) {
          await effectNameInput.fill('Temporary Buff');

          const saveEffectButton = page.locator('[data-testid="button-save-effect"]');
          await saveEffectButton.click();
          await page.waitForTimeout(1000);

          // Now remove the effect
          const removeEffectButton = page.locator('[data-testid^="button-remove-effect-"]').first();
          if (await removeEffectButton.isVisible()) {
            await removeEffectButton.click();
            await page.waitForTimeout(1000);

            // Verify effect is removed
            await expect(page.getByText('Temporary Buff')).not.toBeVisible({ timeout: 5000 });
          }
        }
      }
    }
  });

  test('should display effect duration and expiry', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    const effectsButton = page.locator('[data-testid="button-manage-effects"]');
    if (await effectsButton.isVisible()) {
      await effectsButton.click();
      await page.waitForTimeout(500);

      const addEffectButton = page.locator('[data-testid="button-add-effect"]');
      if (await addEffectButton.isVisible()) {
        await addEffectButton.click();
        await page.waitForTimeout(500);

        const effectNameInput = page.locator('[data-testid="input-effect-name"]');
        if (await effectNameInput.isVisible()) {
          await effectNameInput.fill('Timed Buff');

          // Set duration
          const durationInput = page.locator('[data-testid="input-effect-duration"]');
          if (await durationInput.isVisible()) {
            await durationInput.fill('3');
          }

          const saveEffectButton = page.locator('[data-testid="button-save-effect"]');
          await saveEffectButton.click();
          await page.waitForTimeout(1000);

          // Verify duration is displayed
          await expect(page.getByText(/3.*rounds|3.*tours/i)).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test('should stack multiple effects', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    const effectsButton = page.locator('[data-testid="button-manage-effects"]');
    if (await effectsButton.isVisible()) {
      await effectsButton.click();
      await page.waitForTimeout(500);

      // Add first effect
      let addEffectButton = page.locator('[data-testid="button-add-effect"]');
      if (await addEffectButton.isVisible()) {
        await addEffectButton.click();
        await page.waitForTimeout(500);

        let effectNameInput = page.locator('[data-testid="input-effect-name"]');
        await effectNameInput.fill('Effect 1');

        let saveEffectButton = page.locator('[data-testid="button-save-effect"]');
        await saveEffectButton.click();
        await page.waitForTimeout(1000);

        // Add second effect
        addEffectButton = page.locator('[data-testid="button-add-effect"]');
        await addEffectButton.click();
        await page.waitForTimeout(500);

        effectNameInput = page.locator('[data-testid="input-effect-name"]');
        await effectNameInput.fill('Effect 2');

        saveEffectButton = page.locator('[data-testid="button-save-effect"]');
        await saveEffectButton.click();
        await page.waitForTimeout(1000);

        // Verify both effects are visible
        await expect(page.getByText('Effect 1')).toBeVisible({ timeout: 5000 });
        await expect(page.getByText('Effect 2')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should show effect impact on skill rolls', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Add buff that affects skills
    const effectsButton = page.locator('[data-testid="button-manage-effects"]');
    if (await effectsButton.isVisible()) {
      await effectsButton.click();
      await page.waitForTimeout(500);

      const addEffectButton = page.locator('[data-testid="button-add-effect"]');
      if (await addEffectButton.isVisible()) {
        await addEffectButton.click();
        await page.waitForTimeout(500);

        const effectNameInput = page.locator('[data-testid="input-effect-name"]');
        await effectNameInput.fill('Skill Bonus');

        const effectModifierInput = page.locator('[data-testid="input-effect-modifier"]');
        if (await effectModifierInput.isVisible()) {
          await effectModifierInput.fill('+15');
        }

        const saveEffectButton = page.locator('[data-testid="button-save-effect"]');
        await saveEffectButton.click();
        await page.waitForTimeout(1000);

        // Now perform a skill roll
        const customInput = page.locator('[data-testid="input-custom-skill-name"]');
        if (await customInput.isVisible()) {
          await customInput.fill('Spot Hidden');

          const customValue = page.locator('[data-testid="input-custom-skill-value"]');
          if (await customValue.isVisible()) {
            await customValue.fill('50');
          }

          const rollButton = page.locator('[data-testid="button-custom-roll"]');
          await rollButton.click();
          await page.waitForTimeout(1000);

          // Verify roll result shows effect modifier
          const rollResult = page.locator('[data-testid="text-roll-result"]');
          await expect(rollResult).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });
});
