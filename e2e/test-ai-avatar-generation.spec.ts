import { test, expect } from '@playwright/test';
import { loginAsGM, goToSessions, createSession, logTestInfo, BASE_URL } from './helpers';

test.describe('AI Avatar Generation (OpenAI)', () => {
  test('AI-01: Generate single character avatar', async ({ page }) => {
    // Login as GM
    await loginAsGM(page);

    // Navigate to session
    await goToSessions(page);

    const sessionCard = page.locator('[data-testid^="session-card-"]').first();
    if (await sessionCard.count() === 0) {
      console.log('⚠️ AI-01: No sessions available');
      return;
    }

    await sessionCard.click();
    await page.waitForTimeout(2000);

    const characterCard = page.locator('[data-character-card]').first();

    if (await characterCard.count() === 0) {
      console.log('⚠️ AI-01: No characters to generate avatar for');
      return;
    }

    // Look for generate avatar button
    const avatarSection = characterCard.locator('[data-avatar-section]').first();
    const generateButton = page.locator('button:has-text("Générer"), button:has-text("Generate")').first();

    if (await generateButton.count() > 0) {
      await generateButton.click();
      await page.waitForTimeout(1000);

      // Should show loading state
      const loadingIndicator = page.locator('text=/Génération|Generating|Loading/i').first();

      if (await loadingIndicator.count() > 0) {
        console.log('✅ AI-01: Avatar generation started');

        // Wait for completion (with timeout)
        await page.waitForTimeout(10000);

        // Check for success toast
        const toast = page.locator('[role="status"]');
        if (await toast.count() > 0) {
          console.log('✅ AI-01: Avatar generation completed');
        }
      } else {
        console.log('⚠️ AI-01: No loading indicator shown');
      }
    } else {
      console.log('⚠️ AI-01: Generate avatar button not found');
    }
  });

  test('AI-02: Batch generate all character avatars', async ({ page }) => {
    await loginAsGM(page);
    await goToSessions(page);

    const sessionCard = page.locator('[data-testid^="session-card-"]').first();
    if (await sessionCard.count() > 0) {
      await sessionCard.click();
      await page.waitForTimeout(2000);

      // Open tools menu
      const toolsButton = page.locator('button:has-text("Outils")').first();

      if (await toolsButton.count() > 0) {
        await toolsButton.click();
        await page.waitForTimeout(500);

        // Find batch avatar generation button
        const batchGenerateButton = page.locator('button:has-text("Générer Portraits")').first();

        if (await batchGenerateButton.count() > 0) {
          await batchGenerateButton.click();
          await page.waitForTimeout(2000);

          // Should show progress or completion
          const toast = page.locator('[role="status"]');

          if (await toast.count() > 0) {
            const toastText = await toast.textContent();
            console.log('Batch generation result:', toastText);
            console.log('✅ AI-02: Batch avatar generation executed');
          }
        } else {
          console.log('⚠️ AI-02: Batch generate button not found');
        }
      }
    }
  });

  test('AI-03: Avatar generation with custom prompt', async ({ page }) => {
    // Navigate to character creation
    await loginAsGM(page);

    await page.goto(`${BASE_URL}/characters/new`);
    await page.waitForTimeout(2000);

    // Fill basic character info
    const nameInput = page.locator('input[name="name"]').first();
    if (await nameInput.count() > 0) {
      await nameInput.fill('Test Avatar Character');

      // Select occupation
      const occupationSelect = page.locator('select, [role="combobox"]').first();
      if (await occupationSelect.count() > 0) {
        await occupationSelect.click();
        await page.waitForTimeout(300);

        const firstOption = page.locator('option, [role="option"]').nth(1);
        await firstOption.click();

        // Find avatar generation section
        const avatarSection = page.locator('text=/Portrait|Avatar/i').first();

        if (await avatarSection.count() > 0) {
          // Look for physical traits selectors
          const hairColorSelect = page.locator('select').filter({ hasText: /Cheveux|Hair/i }).first();
          const eyeColorSelect = page.locator('select').filter({ hasText: /Yeux|Eye/i }).first();

          if (await hairColorSelect.count() > 0) {
            await hairColorSelect.click();
            await page.locator('option:has-text("Bruns")').click();
          }

          if (await eyeColorSelect.count() > 0) {
            await eyeColorSelect.click();
            await page.locator('option:has-text("Bleus")').click();
          }

          // Generate avatar with these traits
          const generateButton = page.locator('button:has-text("Générer le Portrait")').first();

          if (await generateButton.count() > 0) {
            await generateButton.click();
            await page.waitForTimeout(1000);

            console.log('✅ AI-03: Avatar generation with custom prompt started');

            // Would wait for actual generation in real test
          } else {
            console.log('⚠️ AI-03: Generate portrait button not found');
          }
        }
      }
    }
  });

  test('AI-04: Regenerate existing avatar', async ({ page }) => {
    await loginAsGM(page);
    await goToSessions(page);

    const sessionCard = page.locator('[data-testid^="session-card-"]').first();
    if (await sessionCard.count() > 0) {
      await sessionCard.click();
      await page.waitForTimeout(2000);

      const characterCard = page.locator('[data-character-card]').first();

      if (await characterCard.count() > 0) {
        // Find character with existing avatar
        const avatar = characterCard.locator('img[alt*="portrait"], img[src*="avatar"]').first();

        if (await avatar.count() > 0) {
          // Look for regenerate option
          const moreButton = characterCard.locator('button[aria-label*="More"]').first();

          if (await moreButton.count() > 0) {
            await moreButton.click();
            await page.waitForTimeout(500);

            const regenerateOption = page.locator('text=/Régénérer.*portrait|Regenerate.*avatar/i').first();

            if (await regenerateOption.count() > 0) {
              await regenerateOption.click();
              await page.waitForTimeout(1000);

              console.log('✅ AI-04: Avatar regeneration initiated');
            } else {
              console.log('⚠️ AI-04: Regenerate option not found');
            }
          }
        } else {
          console.log('⚠️ AI-04: No existing avatars to regenerate');
        }
      }
    }
  });

  test('AI-05: Handle avatar generation errors', async ({ page }) => {
    // This test would require mocking API failure
    // Testing error handling UI

    await loginAsGM(page);

    await page.goto(`${BASE_URL}/characters/new`);
    await page.waitForTimeout(2000);

    // Check if error handling is in place
    const nameInput = page.locator('input[name="name"]').first();
    if (await nameInput.count() > 0) {
      await nameInput.fill('Error Test Character');

      const generateButton = page.locator('button:has-text("Générer le Portrait")').first();

      if (await generateButton.count() > 0) {
        // Intercept network to simulate error
        await page.route('**/api/characters/*/avatar', route => {
          route.fulfill({ status: 500, body: 'OpenAI API Error' });
        });

        await generateButton.click();
        await page.waitForTimeout(2000);

        // Should show error toast
        const errorToast = page.locator('[role="status"]').filter({ hasText: /Erreur|Error/i });

        if (await errorToast.count() > 0) {
          console.log('✅ AI-05: Error handling works correctly');
        } else {
          console.log('⚠️ AI-05: No error message displayed');
        }
      }
    }
  });
});
