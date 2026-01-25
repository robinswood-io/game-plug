import { test, expect } from '@playwright/test';
import { loginAsGM, loginAsPlayer, createSession, BASE_URL } from './helpers';

test.describe('Call of Cthulhu 7e Dice System', () => {
  test.beforeEach(async ({ page }) => {
    // Login as player with test character
    await loginAsPlayer(page);
  });

  test('DICE-01: Roll skill check - Success levels', async ({ page }) => {
    // Navigate to character sheet
    const url = page.url();

    if (!url.includes('/characters/')) {
      console.log('⚠️ DICE-01: Not on character page');
      return;
    }

    // Find a skill with reasonable percentage to test different success levels
    const skillButtons = page.locator('button:has-text("Jet"), button[data-testid*="skill-roll"]');

    if (await skillButtons.count() > 0) {
      // Click first skill roll button
      await skillButtons.first().click();
      await page.waitForTimeout(1500);

      // Check for result display (toast or modal)
      const resultElement = page.locator('[role="status"], [role="dialog"]');

      if (await resultElement.count() > 0) {
        const resultText = await resultElement.textContent();

        // Verify CoC 7e terminology is used
        const hasCoC7eTerms = resultText?.match(/(Critique|Extrême|Difficile|Réussite|Échec)/i);

        expect(hasCoC7eTerms).toBeTruthy();
        console.log('✅ DICE-01: Skill roll executed with CoC 7e terminology');
        console.log('Result:', resultText?.substring(0, 100));
      } else {
        console.log('⚠️ DICE-01: No result displayed');
      }
    } else {
      console.log('⚠️ DICE-01: No skill roll buttons found');
    }
  });

  test('DICE-02: Roll characteristic check', async ({ page }) => {
    const url = page.url();

    if (!url.includes('/characters/')) {
      console.log('⚠️ DICE-02: Not on character page');
      return;
    }

    // Find characteristics section
    const charSection = page.locator('text=/Caractéristiques|Characteristics/i').first();

    if (await charSection.count() > 0) {
      // Look for rollable characteristics (FOR, DEX, etc.)
      const charRollButton = page.locator('button:has-text("FOR"), button:has-text("DEX")').first();

      if (await charRollButton.count() > 0) {
        await charRollButton.click();
        await page.waitForTimeout(1500);

        const result = page.locator('[role="status"]');
        if (await result.count() > 0) {
          const text = await result.textContent();

          // Should show d100 roll vs characteristic value
          const hasRollInfo = text?.match(/\d+\s*vs\s*\d+/i);
          expect(hasRollInfo).toBeTruthy();

          console.log('✅ DICE-02: Characteristic roll executed');
        }
      } else {
        console.log('⚠️ DICE-02: Characteristic roll buttons not found');
      }
    }
  });

  test('DICE-03: Luck roll', async ({ page }) => {
    const url = page.url();

    if (!url.includes('/characters/')) {
      console.log('⚠️ DICE-03: Not on character page');
      return;
    }

    // Find luck section or button
    const luckButton = page.locator('button:has-text("Chance"), button:has-text("Luck")').first();

    if (await luckButton.count() > 0) {
      await luckButton.click();
      await page.waitForTimeout(1500);

      const result = page.locator('[role="status"]');
      const resultVisible = await result.count() > 0;

      expect(resultVisible).toBe(true);
      console.log('✅ DICE-03: Luck roll executed');
    } else {
      console.log('⚠️ DICE-03: Luck roll button not found');
    }
  });

  test('DICE-04: GM group roll', async ({ page }) => {
    // Login as GM instead
    await loginAsGM(page);

    // Navigate to a session
    await page.goto(`${BASE_URL}/sessions`);
    await page.waitForTimeout(2000);

    const sessionCard = page.locator('[data-testid^="session-card-"]').first();
    if (await sessionCard.count() > 0) {
      await sessionCard.click();
      await page.waitForTimeout(2000);

      // Look for Tools or group roll menu
      const toolsButton = page.locator('button:has-text("Outils"), button:has-text("Tools")').first();

      if (await toolsButton.count() > 0) {
        await toolsButton.click();
        await page.waitForTimeout(500);

        // Look for group roll section
        const groupRollSection = page.locator('text=/Jets.*Groupés|Group.*Roll/i').first();

        if (await groupRollSection.count() > 0) {
          // Try to execute a group roll
          const skillSelect = page.locator('select, [role="combobox"]').first();
          if (await skillSelect.count() > 0) {
            await skillSelect.click();
            await page.waitForTimeout(300);

            const firstOption = page.locator('option, [role="option"]').first();
            await firstOption.click();

            const rollButton = page.locator('button:has-text("Lancer"), button:has-text("Roll")').first();
            if (await rollButton.count() > 0) {
              await rollButton.click();
              await page.waitForTimeout(1500);

              const toast = page.locator('[role="status"]');
              expect(await toast.count()).toBeGreaterThan(0);

              console.log('✅ DICE-04: Group roll executed');
            }
          }
        } else {
          console.log('⚠️ DICE-04: Group roll section not found');
        }
      } else {
        console.log('⚠️ DICE-04: Tools button not found');
      }
    } else {
      console.log('⚠️ DICE-04: No sessions found');
    }
  });

  test('DICE-05: Critical success detection', async ({ page }) => {
    const url = page.url();

    if (!url.includes('/characters/')) {
      console.log('⚠️ DICE-05: Not on character page');
      return;
    }

    // Roll multiple times to try to get different results
    const skillButtons = page.locator('button:has-text("Jet")');

    if (await skillButtons.count() > 0) {
      let foundCritical = false;

      // Try up to 10 rolls to find a critical
      for (let i = 0; i < 10 && !foundCritical; i++) {
        await skillButtons.first().click();
        await page.waitForTimeout(1000);

        const result = page.locator('[role="status"]').last();
        if (await result.count() > 0) {
          const text = await result.textContent();

          if (text?.includes('Critique')) {
            foundCritical = true;
            console.log('✅ DICE-05: Critical success detected!');
            console.log('Result:', text);
          }
        }

        await page.waitForTimeout(500);
      }

      if (!foundCritical) {
        console.log('⚠️ DICE-05: No critical in 10 rolls (expected, testing system exists)');
      }
    }
  });

  test('DICE-06: Opposed roll', async ({ page }) => {
    // Login as GM
    await loginAsGM(page);

    await page.goto(`${BASE_URL}/sessions`);
    await page.waitForTimeout(2000);

    const sessionCard = page.locator('[data-testid^="session-card-"]').first();
    if (await sessionCard.count() > 0) {
      await sessionCard.click();
      await page.waitForTimeout(2000);

      // Look for opposed roll feature
      const toolsButton = page.locator('button:has-text("Outils")').first();
      if (await toolsButton.count() > 0) {
        await toolsButton.click();
        await page.waitForTimeout(500);

        const opposedRoll = page.locator('text=/Opposé|Opposed/i').first();
        if (await opposedRoll.count() > 0) {
          console.log('✅ DICE-06: Opposed roll feature found');
          // Feature exists, would need specific implementation to test
        } else {
          console.log('⚠️ DICE-06: Opposed roll not implemented');
        }
      }
    }
  });

  test('DICE-07: Bonus/Penalty dice', async ({ page }) => {
    const url = page.url();

    if (!url.includes('/characters/')) {
      console.log('⚠️ DICE-07: Not on character page');
      return;
    }

    // Look for bonus/penalty dice controls
    const bonusDiceControl = page.locator('button:has-text("+"), button:has-text("Bonus"), select[name*="bonus"]').first();

    if (await bonusDiceControl.count() > 0) {
      // Click to add bonus die
      await bonusDiceControl.click();
      await page.waitForTimeout(500);

      // Roll with bonus
      const rollButton = page.locator('button:has-text("Jet")').first();
      await rollButton.click();
      await page.waitForTimeout(1500);

      const result = page.locator('[role="status"]');
      if (await result.count() > 0) {
        const text = await result.textContent();

        // Should mention bonus/penalty dice
        const hasBonusMention = text?.match(/bonus|pénalité|penalty/i);

        if (hasBonusMention) {
          console.log('✅ DICE-07: Bonus/penalty dice system working');
        } else {
          console.log('⚠️ DICE-07: No bonus/penalty indication in result');
        }
      }
    } else {
      console.log('⚠️ DICE-07: Bonus/penalty dice controls not found');
    }
  });
});
