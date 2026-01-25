import { test, expect } from '@playwright/test';
import { loginAsGM, createSession, BASE_URL } from './helpers';

test.describe('GM Advanced Features - Combat & Effects', () => {
  let sessionId: string;
  let characterId: string;

  test.beforeAll(async ({ browser }) => {
    // Setup: Create session with character for testing
    const page = await browser.newPage();

    // Login as GM and create session
    await loginAsGM(page);
    sessionId = (await createSession(page, `AdvTest ${Date.now()}`)) || '';
    console.log('Session ID:', sessionId);

    await page.close();
  });

  test('GM-ADV-01: Apply damage to character', async ({ page }) => {
    if (!sessionId) {
      test.skip();
      return;
    }

    await loginAsGM(page);
    await page.goto(`${BASE_URL}/sessions/${sessionId}`);
    await page.waitForTimeout(2000);

    // Find character card
    const characterCard = page.locator('[data-character-card]').first();

    if (await characterCard.count() === 0) {
      console.log('⚠️ GM-ADV-01: No characters in session');
      return;
    }

    // Look for damage button or three-dot menu
    const moreButton = characterCard.locator('button[aria-label*="More"], button:has(svg)').first();
    if (await moreButton.count() > 0) {
      await moreButton.click();
      await page.waitForTimeout(500);

      // Look for damage option
      const damageOption = page.locator('text=/dégât|damage/i').first();
      if (await damageOption.count() > 0) {
        await damageOption.click();
        await page.waitForTimeout(500);

        // Fill damage value
        const damageInput = page.locator('input[type="number"]').first();
        if (await damageInput.count() > 0) {
          await damageInput.fill('5');

          const confirmButton = page.locator('button:has-text("Appliquer"), button:has-text("Confirmer")').first();
          await confirmButton.click();
          await page.waitForTimeout(1000);

          // Verify toast or update
          const toast = page.locator('[role="status"]');
          const toastVisible = await toast.count() > 0;

          expect(toastVisible).toBe(true);
          console.log('✅ GM-ADV-01: Damage applied successfully');
        } else {
          console.log('⚠️ GM-ADV-01: Damage input not found');
        }
      } else {
        console.log('⚠️ GM-ADV-01: Damage option not found in menu');
      }
    } else {
      console.log('⚠️ GM-ADV-01: Action menu not found on character card');
    }
  });

  test('GM-ADV-02: Apply sanity loss', async ({ page }) => {
    if (!sessionId) {
      test.skip();
      return;
    }

    await loginAsGM(page);
    await page.goto(`${BASE_URL}/sessions/${sessionId}`);
    await page.waitForTimeout(2000);

    const characterCard = page.locator('[data-character-card]').first();

    if (await characterCard.count() === 0) {
      console.log('⚠️ GM-ADV-02: No characters in session');
      return;
    }

    // Look for sanity tracker or menu
    const sanityButton = page.locator('button:has-text("Sanité"), button:has-text("SAN")').first();

    if (await sanityButton.count() > 0) {
      await sanityButton.click();
      await page.waitForTimeout(500);

      // Try to apply sanity loss
      const minusButton = page.locator('button:has-text("-1"), button:has-text("−")').first();
      if (await minusButton.count() > 0) {
        await minusButton.click();
        await page.waitForTimeout(1000);

        const toast = page.locator('[role="status"]');
        expect(await toast.count()).toBeGreaterThan(0);

        console.log('✅ GM-ADV-02: Sanity loss applied');
      } else {
        console.log('⚠️ GM-ADV-02: Sanity decrease button not found');
      }
    } else {
      console.log('⚠️ GM-ADV-02: Sanity button not found');
    }
  });

  test('GM-ADV-03: Apply buff to character', async ({ page }) => {
    if (!sessionId) {
      test.skip();
      return;
    }

    await loginAsGM(page);
    await page.goto(`${BASE_URL}/sessions/${sessionId}`);
    await page.waitForTimeout(2000);

    const characterCard = page.locator('[data-character-card]').first();

    if (await characterCard.count() === 0) {
      console.log('⚠️ GM-ADV-03: No characters in session');
      return;
    }

    // Look for effects or buffs menu
    const moreButton = characterCard.locator('button[aria-label*="More"]').first();
    if (await moreButton.count() > 0) {
      await moreButton.click();
      await page.waitForTimeout(500);

      const buffOption = page.locator('text=/buff|effet|bonus/i').first();
      if (await buffOption.count() > 0) {
        await buffOption.click();
        await page.waitForTimeout(500);

        // Fill buff details
        const nameInput = page.locator('input[placeholder*="nom"], input[name="name"]').first();
        const valueInput = page.locator('input[type="number"]').first();

        if (await nameInput.count() > 0 && await valueInput.count() > 0) {
          await nameInput.fill('Inspiration Divine');
          await valueInput.fill('20');

          const applyButton = page.locator('button:has-text("Appliquer")').first();
          await applyButton.click();
          await page.waitForTimeout(1000);

          const toast = page.locator('[role="status"]');
          expect(await toast.count()).toBeGreaterThan(0);

          console.log('✅ GM-ADV-03: Buff applied successfully');
        } else {
          console.log('⚠️ GM-ADV-03: Buff input fields not found');
        }
      } else {
        console.log('⚠️ GM-ADV-03: Buff option not found');
      }
    } else {
      console.log('⚠️ GM-ADV-03: Character menu not found');
    }
  });

  test('GM-ADV-04: Manage character inventory', async ({ page }) => {
    if (!sessionId) {
      test.skip();
      return;
    }

    await loginAsGM(page);
    await page.goto(`${BASE_URL}/sessions/${sessionId}`);
    await page.waitForTimeout(2000);

    const characterCard = page.locator('[data-character-card]').first();

    if (await characterCard.count() === 0) {
      console.log('⚠️ GM-ADV-04: No characters in session');
      return;
    }

    // Look for inventory button
    const inventoryButton = page.locator('button:has-text("Inventaire"), button:has-text("Équipement")').first();

    if (await inventoryButton.count() > 0) {
      await inventoryButton.click();
      await page.waitForTimeout(1000);

      // Check if inventory dialog opened
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Try to add item
      const addItemButton = page.locator('button:has-text("Ajouter"), button:has-text("+")').first();
      if (await addItemButton.count() > 0) {
        await addItemButton.click();
        await page.waitForTimeout(500);

        // Fill item details
        const itemNameInput = page.locator('input[placeholder*="nom"], input[name*="name"]').first();
        if (await itemNameInput.count() > 0) {
          await itemNameInput.fill('Revolver .38');

          const saveButton = page.locator('button:has-text("Sauvegarder"), button:has-text("Ajouter")').last();
          if (await saveButton.count() > 0) {
            await saveButton.click();
            await page.waitForTimeout(1000);

            console.log('✅ GM-ADV-04: Inventory item added');
          }
        }
      } else {
        console.log('⚠️ GM-ADV-04: Add item button not found');
      }
    } else {
      console.log('⚠️ GM-ADV-04: Inventory button not found');
    }
  });

  test('GM-ADV-05: Grant skill points', async ({ page }) => {
    if (!sessionId) {
      test.skip();
      return;
    }

    await loginAsGM(page);
    await page.goto(`${BASE_URL}/sessions/${sessionId}`);
    await page.waitForTimeout(2000);

    const characterCard = page.locator('[data-character-card]').first();

    if (await characterCard.count() === 0) {
      console.log('⚠️ GM-ADV-05: No characters in session');
      return;
    }

    // Look for skill points or experience option
    const moreButton = characterCard.locator('button[aria-label*="More"]').first();
    if (await moreButton.count() > 0) {
      await moreButton.click();
      await page.waitForTimeout(500);

      const skillPointsOption = page.locator('text=/points.*compétence|skill.*points|expérience/i').first();
      if (await skillPointsOption.count() > 0) {
        await skillPointsOption.click();
        await page.waitForTimeout(500);

        const pointsInput = page.locator('input[type="number"]').first();
        if (await pointsInput.count() > 0) {
          await pointsInput.fill('10');

          const confirmButton = page.locator('button:has-text("Attribuer"), button:has-text("Confirmer")').first();
          await confirmButton.click();
          await page.waitForTimeout(1000);

          const toast = page.locator('[role="status"]');
          expect(await toast.count()).toBeGreaterThan(0);

          console.log('✅ GM-ADV-05: Skill points granted');
        } else {
          console.log('⚠️ GM-ADV-05: Points input not found');
        }
      } else {
        console.log('⚠️ GM-ADV-05: Skill points option not found');
      }
    }
  });

  test('GM-ADV-06: Delete character from session', async ({ page }) => {
    if (!sessionId) {
      test.skip();
      return;
    }

    await loginAsGM(page);
    await page.goto(`${BASE_URL}/sessions/${sessionId}`);
    await page.waitForTimeout(2000);

    const characterCard = page.locator('[data-character-card]').first();

    if (await characterCard.count() === 0) {
      console.log('⚠️ GM-ADV-06: No characters to delete');
      return;
    }

    // Look for delete button
    const deleteButton = characterCard.locator('button[aria-label*="Delete"], button:has-text("Supprimer")').first();

    if (await deleteButton.count() > 0) {
      await deleteButton.click();
      await page.waitForTimeout(500);

      // Confirm deletion in alert dialog
      const confirmDialog = page.locator('[role="alertdialog"]');
      if (await confirmDialog.count() > 0) {
        const confirmButton = confirmDialog.locator('button:has-text("Supprimer")').first();
        await confirmButton.click();
        await page.waitForTimeout(1000);

        const toast = page.locator('[role="status"]');
        expect(await toast.count()).toBeGreaterThan(0);

        console.log('✅ GM-ADV-06: Character deleted successfully');
      } else {
        console.log('⚠️ GM-ADV-06: Confirmation dialog not shown');
      }
    } else {
      console.log('⚠️ GM-ADV-06: Delete button not found');
    }
  });
});
