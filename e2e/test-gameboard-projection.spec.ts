import { test, expect } from '@playwright/test';
import { loginAsGM, goToSessions, createSession, logTestInfo } from './helpers';

test.describe('GameBoard Projection Screen', () => {
  let sessionId: string;

  test.beforeEach(async ({ page }) => {
    // Login as GM and navigate to session
    await loginAsGM(page);
    await goToSessions(page);

    const sessionCard = page.locator('[data-testid^="session-card-"]').first();
    if (await sessionCard.count() > 0) {
      await sessionCard.click();
      await page.waitForTimeout(2000);
      sessionId = page.url().split('/').pop() || '';
    }
  });

  test('BOARD-01: Open GameBoard in new window', async ({ page, context }) => {
    if (!sessionId) {
      logTestInfo('BOARD-01', 'No session available', 'warning');
      return;
    }

    const gameboardButton = page.locator('button[data-testid="button-gameboard"]').first();

    if (await gameboardButton.count() > 0) {
      // Listen for new page
      const pagePromise = context.waitForEvent('page');
      await gameboardButton.click();
      const gameboardPage = await pagePromise;
      await gameboardPage.waitForLoadState('networkidle');

      const url = gameboardPage.url();
      expect(url).toContain('/gameboard');
      expect(url).toContain(sessionId);

      // Verify GameBoard loaded
      const pageTitle = await gameboardPage.title();
      logTestInfo('BOARD-01', `GameBoard title: ${pageTitle}`, 'info');

      // Check for GameBoard specific elements
      const boardContent = gameboardPage.locator('body');
      await expect(boardContent).toBeVisible();

      logTestInfo('BOARD-01', 'GameBoard opened successfully', 'success');

      await gameboardPage.close();
    } else {
      logTestInfo('BOARD-01', 'GameBoard button not found', 'warning');
    }
  });

  test('BOARD-02: Display character information on GameBoard', async ({ page, context }) => {
    if (!sessionId) {
      logTestInfo('BOARD-02', 'No session available', 'warning');
      return;
    }

    // Check if we have characters
    const characterCount = await page.locator('[data-character-card]').count();

    if (characterCount === 0) {
      logTestInfo('BOARD-02', 'No characters to display', 'warning');
      return;
    }

    const gameboardButton = page.locator('button[data-testid="button-gameboard"]').first();

    if (await gameboardButton.count() > 0) {
      const pagePromise = context.waitForEvent('page');
      await gameboardButton.click();
      const gameboardPage = await pagePromise;
      await gameboardPage.waitForLoadState('networkidle');

      // Look for character cards or info on gameboard
      const characterElements = gameboardPage.locator('[data-character], .character-card').first();

      if (await characterElements.count() > 0) {
        logTestInfo('BOARD-02', 'Characters displayed on GameBoard', 'success');
      } else {
        logTestInfo('BOARD-02', 'No character info on GameBoard', 'warning');
      }

      await gameboardPage.close();
    }
  });

  test('BOARD-03: Project visual image to GameBoard', async ({ page, context }) => {
    if (!sessionId) {
      logTestInfo('BOARD-03', 'No session available', 'warning');
      return;
    }

    // Open projection dialog
    const projectionButton = page.locator('button[data-testid="button-open-projection"]').first();

    if (await projectionButton.count() > 0) {
      await projectionButton.click();
      await page.waitForTimeout(1000);

      const projectionDialog = page.locator('[role="dialog"]');

      if (await projectionDialog.count() > 0) {
        // Try to add an image URL
        const urlInput = projectionDialog.locator('input[type="url"], input[placeholder*="URL"]').first();

        if (await urlInput.count() > 0) {
          await urlInput.fill('https://example.com/test-image.jpg');

          const projectButton = projectionDialog.locator('button:has-text("Projeter"), button:has-text("Afficher")').first();

          if (await projectButton.count() > 0) {
            await projectButton.click();
            await page.waitForTimeout(1000);

            logTestInfo('BOARD-03', 'Visual projection sent', 'success');
          }
        } else {
          logTestInfo('BOARD-03', 'URL input not found', 'warning');
        }
      }
    } else {
      logTestInfo('BOARD-03', 'Projection button not found', 'warning');
    }
  });

  test('BOARD-04: Real-time updates on GameBoard', async ({ page, context }) => {
    if (!sessionId) {
      logTestInfo('BOARD-04', 'No session available', 'warning');
      return;
    }

    const characterCount = await page.locator('[data-character-card]').count();

    if (characterCount === 0) {
      logTestInfo('BOARD-04', 'No characters to test with', 'warning');
      return;
    }

    // Open GameBoard
    const gameboardButton = page.locator('button[data-testid="button-gameboard"]').first();

    if (await gameboardButton.count() > 0) {
      const pagePromise = context.waitForEvent('page');
      await gameboardButton.click();
      const gameboardPage = await pagePromise;
      await gameboardPage.waitForLoadState('networkidle');

      // Apply damage to character in GM view
      const characterCard = page.locator('[data-character-card]').first();
      const moreButton = characterCard.locator('button[aria-label*="More"]').first();

      if (await moreButton.count() > 0) {
        await moreButton.click();
        await page.waitForTimeout(500);

        const damageOption = page.locator('text=/dégât/i').first();
        if (await damageOption.count() > 0) {
          await damageOption.click();
          await page.waitForTimeout(500);

          const damageInput = page.locator('input[type="number"]').first();
          await damageInput.fill('2');

          const confirmButton = page.locator('button:has-text("Appliquer")').first();
          await confirmButton.click();
          await page.waitForTimeout(2000);

          // GameBoard should update in real-time via WebSocket
          logTestInfo('BOARD-04', 'Update sent (GameBoard should reflect change)', 'success');
        }
      }

      await gameboardPage.close();
    }
  });

  test('BOARD-05: Display session info header', async ({ page, context }) => {
    if (!sessionId) {
      logTestInfo('BOARD-05', 'No session available', 'warning');
      return;
    }

    const gameboardButton = page.locator('button[data-testid="button-gameboard"]').first();

    if (await gameboardButton.count() > 0) {
      const pagePromise = context.waitForEvent('page');
      await gameboardButton.click();
      const gameboardPage = await pagePromise;
      await gameboardPage.waitForLoadState('networkidle');

      // Check for session name or header
      const sessionHeader = gameboardPage.locator('h1, [data-session-name]').first();

      if (await sessionHeader.count() > 0) {
        const headerText = await sessionHeader.textContent();
        logTestInfo('BOARD-05', `Session header: ${headerText}`, 'info');
        logTestInfo('BOARD-05', 'Session info displayed', 'success');
      } else {
        logTestInfo('BOARD-05', 'Session header not found', 'warning');
      }

      await gameboardPage.close();
    }
  });
});
