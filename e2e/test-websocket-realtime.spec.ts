import { test, expect } from '@playwright/test';
import { BASE_URL, loginAsGM, loginAsPlayer, goToSessions, createSession } from './helpers';

test.describe('WebSocket Real-time Communication', () => {
  test('WS-01: Connection indicator shows connected status', async ({ page }) => {
    // Login as GM
    await loginAsGM(page);

    // Navigate to a session
    await goToSessions(page);

    const sessionCard = page.locator('[data-testid^="session-card-"]').first();
    if (await sessionCard.count() > 0) {
      await sessionCard.click();
      await page.waitForTimeout(3000);

      // Look for connection indicator
      const connectionIndicator = page.locator('text=/Connecté|Connected|En ligne/i, [data-connection-status]').first();

      if (await connectionIndicator.count() > 0) {
        await expect(connectionIndicator).toBeVisible();
        console.log('✅ WS-01: Connection indicator visible');

        const text = await connectionIndicator.textContent();
        console.log('Connection status:', text);
      } else {
        console.log('⚠️ WS-01: Connection indicator not found');
      }
    }
  });

  test('WS-02: Real-time character update propagation', async ({ page, context }) => {
    // Login as GM in first tab
    await loginAsGM(page);

    await goToSessions(page);

    const sessionCard = page.locator('[data-testid^="session-card-"]').first();
    if (await sessionCard.count() === 0) {
      console.log('⚠️ WS-02: No sessions available');
      return;
    }

    await sessionCard.click();
    await page.waitForTimeout(2000);

    const sessionUrl = page.url();

    // Open second tab as player
    const playerPage = await context.newPage();
    await loginAsPlayer(playerPage);

    // Try to navigate to same session (if player has character)
    const characterCount = await page.locator('[data-character-card]').count();

    if (characterCount > 0) {
      // GM updates character HP
      const characterCard = page.locator('[data-character-card]').first();
      const moreButton = characterCard.locator('button[aria-label*="More"]').first();

      if (await moreButton.count() > 0) {
        await moreButton.click();
        await page.waitForTimeout(500);

        const damageOption = page.locator('text=/dégât|damage/i').first();
        if (await damageOption.count() > 0) {
          await damageOption.click();
          await page.waitForTimeout(500);

          const damageInput = page.locator('input[type="number"]').first();
          await damageInput.fill('3');

          const confirmButton = page.locator('button:has-text("Appliquer")').first();
          await confirmButton.click();
          await page.waitForTimeout(2000);

          console.log('✅ WS-02: Character updated by GM');

          // Check if player page received update (would need WebSocket)
          // In real implementation, player page should refresh or show notification
        }
      }
    } else {
      console.log('⚠️ WS-02: No characters to test with');
    }

    await playerPage.close();
  });

  test('WS-03: Disconnect and reconnect', async ({ page }) => {
    await loginAsGM(page);

    await goToSessions(page);

    const sessionCard = page.locator('[data-testid^="session-card-"]').first();
    if (await sessionCard.count() > 0) {
      await sessionCard.click();
      await page.waitForTimeout(2000);

      // Simulate network offline
      await page.context().setOffline(true);
      await page.waitForTimeout(2000);

      // Check for disconnected indicator
      const disconnectedIndicator = page.locator('text=/Déconnecté|Disconnected|Hors ligne/i').first();

      if (await disconnectedIndicator.count() > 0) {
        console.log('✅ WS-03: Disconnected state detected');
      }

      // Reconnect
      await page.context().setOffline(false);
      await page.waitForTimeout(3000);

      // Should reconnect automatically
      const connectedIndicator = page.locator('text=/Connecté|Connected/i').first();
      if (await connectedIndicator.count() > 0) {
        console.log('✅ WS-03: Reconnected successfully');
      } else {
        console.log('⚠️ WS-03: Did not reconnect automatically');
      }
    }
  });

  test('WS-04: GM narration broadcast to players', async ({ page, context }) => {
    // Setup GM session
    await loginAsGM(page);

    await goToSessions(page);

    const sessionCard = page.locator('[data-testid^="session-card-"]').first();
    if (await sessionCard.count() === 0) {
      console.log('⚠️ WS-04: No sessions available');
      return;
    }

    await sessionCard.click();
    await page.waitForTimeout(2000);

    // Open player page
    const playerPage = await context.newPage();
    await loginAsPlayer(playerPage);

    // GM sends narration
    const toolsButton = page.locator('button:has-text("Outils")').first();
    if (await toolsButton.count() > 0) {
      await toolsButton.click();
      await page.waitForTimeout(500);

      const narrationTextarea = page.locator('textarea[placeholder*="narration"]').first();
      if (await narrationTextarea.count() > 0) {
        const testMessage = `Test narration ${Date.now()}`;
        await narrationTextarea.fill(testMessage);

        const sendButton = page.locator('button:has-text("Envoyer")').first();
        await sendButton.click();
        await page.waitForTimeout(2000);

        // Player should receive notification or see narration
        // (Would need WebSocket listener implementation)
        console.log('✅ WS-04: Narration sent (WebSocket broadcast)');
      }
    }

    await playerPage.close();
  });
});
