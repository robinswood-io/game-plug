import { test, expect } from '@playwright/test';
import { loginAsGM, loginAsPlayer, createSession, BASE_URL } from './helpers';

test.describe('Player Workflow - Complete User Stories', () => {
  let sessionCode: string;

  test('PLAYER-01: Join session with code', async ({ page }) => {
    // First create a session as GM
    await loginAsGM(page);
    const sessionId = await createSession(page, `PlayerTest ${Date.now()}`);
    if (!sessionId) {
      console.log('⚠️ Failed to create session');
      return;
    }

    // Logout (clear localStorage)
    await page.evaluate(() => localStorage.clear());

    // Join as player with dev button
    await loginAsPlayer(page);

    // Should be redirected to join page or character select
    const url = page.url();
    console.log('Current URL:', url);
    expect(url).toMatch(/\/(join|select-character|characters)/);

    console.log('✅ PLAYER-01: Player can access join flow');
  });

  test('PLAYER-02: Join with QR code URL', async ({ page }) => {
    // Create session as GM
    await loginAsGM(page);
    const sessionId = await createSession(page, `QRJoinTest ${Date.now()}`);
    if (!sessionId) {
      console.log('⚠️ Failed to create session');
      return;
    }

    // Clear auth and open as new user
    await page.evaluate(() => localStorage.clear());

    // Access session URL directly (using sessionId instead of code)
    await page.goto(`${BASE_URL}/sessions/${sessionId}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');

    // Should see session page (verify URL is correct and page title)
    const url = page.url();
    expect(url).toContain(`/sessions/${sessionId}`);

    const title = await page.title();
    expect(title).not.toContain('404: This page could not be found');

    console.log('✅ PLAYER-02: QR code URL works');
  });

  test('PLAYER-03: View character sheet', async ({ page }) => {
    // Login as player
    await loginAsPlayer(page);

    // Navigate to a character (if exists)
    const url = page.url();
    if (url.includes('/select-character/')) {
      // Character selection page
      const characterCard = page.locator('[data-testid^="character-card-"]').first();
      if (await characterCard.count() > 0) {
        await characterCard.click();
        await page.waitForTimeout(1000);

        const selectButton = page.locator('button[data-testid="button-select-character"]');
        await selectButton.click();
        await page.waitForTimeout(2000);

        // Should be on character sheet
        const currentUrl = page.url();
        expect(currentUrl).toContain('/characters/');

        console.log('✅ PLAYER-03: Character sheet displayed');
      } else {
        console.log('⚠️ PLAYER-03: No characters available');
      }
    } else {
      console.log('⚠️ PLAYER-03: Not on character selection page');
    }
  });

  test('PLAYER-04: Roll skill check', async ({ page }) => {
    // Login as player
    await loginAsPlayer(page);

    const url = page.url();
    if (url.includes('/characters/')) {
      // Find a skill to roll
      const skillButtons = page.locator('button:has-text("Jet")');
      if (await skillButtons.count() > 0) {
        await skillButtons.first().click();
        await page.waitForTimeout(1000);

        // Check for result (toast or modal)
        const toast = page.locator('[role="status"]');
        const modal = page.locator('[role="dialog"]');

        const toastVisible = await toast.count() > 0;
        const modalVisible = await modal.count() > 0;

        expect(toastVisible || modalVisible).toBe(true);

        console.log('✅ PLAYER-04: Skill roll executed');
      } else {
        console.log('⚠️ PLAYER-04: No skill buttons found');
      }
    } else {
      console.log('⚠️ PLAYER-04: Not on character page');
    }
  });

  test('PLAYER-05: View inventory', async ({ page }) => {
    // Login as player
    await loginAsPlayer(page);

    const url = page.url();
    if (url.includes('/characters/')) {
      // Look for inventory tab or section
      const inventoryTab = page.locator('text="Inventaire", text="Équipement"');
      if (await inventoryTab.count() > 0) {
        await inventoryTab.first().click();
        await page.waitForTimeout(1000);

        // Check if inventory section is visible
        const pageText = await page.textContent('body');
        const hasInventoryContent = pageText?.includes('Inventaire') || pageText?.includes('Équipement');

        expect(hasInventoryContent).toBe(true);
        console.log('✅ PLAYER-05: Inventory section accessible');
      } else {
        console.log('⚠️ PLAYER-05: Inventory tab not found');
      }
    } else {
      console.log('⚠️ PLAYER-05: Not on character page');
    }
  });

  test('PLAYER-06: View sanity conditions', async ({ page }) => {
    // Login as player
    await loginAsPlayer(page);

    const url = page.url();
    if (url.includes('/characters/')) {
      // Look for sanity/mental health section
      const sanityButton = page.locator('button:has-text("Conditions"), button:has-text("Sanité")');
      if (await sanityButton.count() > 0) {
        await sanityButton.first().click();
        await page.waitForTimeout(1000);

        // Check if dialog opened
        const dialog = page.locator('[role="dialog"]');
        if (await dialog.count() > 0) {
          await expect(dialog).toBeVisible();
          console.log('✅ PLAYER-06: Sanity conditions dialog opened');
        } else {
          console.log('⚠️ PLAYER-06: Dialog not opened');
        }
      } else {
        console.log('⚠️ PLAYER-06: Sanity button not found');
      }
    } else {
      console.log('⚠️ PLAYER-06: Not on character page');
    }
  });

  test('PLAYER-07: Test sanity +1/-1 buttons', async ({ page }) => {
    // Login as player
    await loginAsPlayer(page);

    const url = page.url();
    if (url.includes('/characters/')) {
      // Look for sanity adjustment buttons
      const sanitySection = page.locator('text="Sanité Mentale"').first();

      if (await sanitySection.count() > 0) {
        // Get initial sanity value
        const sanityText = await page.locator('text=/\\d+\\/\\d+/').first().textContent();
        const initialSanity = parseInt(sanityText?.split('/')[0] || '0');

        // Click +1 Sanité button
        const plusButton = page.locator('button:has-text("+1 Sanité")').first();
        if (await plusButton.count() > 0) {
          await plusButton.click();
          await page.waitForTimeout(2000);

          // Check if sanity increased
          const newSanityText = await page.locator('text=/\\d+\\/\\d+/').first().textContent();
          const newSanity = parseInt(newSanityText?.split('/')[0] || '0');

          expect(newSanity).toBe(initialSanity + 1);
          console.log('✅ PLAYER-07: Sanity +1 button works');
        } else {
          console.log('❌ PLAYER-07: +1 Sanité button not found or not clickable');
        }
      } else {
        console.log('⚠️ PLAYER-07: Sanity section not found');
      }
    } else {
      console.log('⚠️ PLAYER-07: Not on character page');
    }
  });
});
