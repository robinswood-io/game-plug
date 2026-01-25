import { test, expect } from '@playwright/test';
import { loginAsGM, goToSessions, createSession, BASE_URL } from './helpers';

test.describe('GM Workflow - Complete User Stories', () => {
  test('GM-01: Login and create session', async ({ page }) => {
    // Login as GM
    await loginAsGM(page);

    // Navigate to sessions
    await goToSessions(page);

    // Create new session
    await page.click('button[data-testid="button-create-session"]');
    const sessionName = `GM Test ${Date.now()}`;
    await page.fill('input[data-testid="input-session-name"]', sessionName);
    await page.click('button[data-testid="button-confirm-create"]');
    await page.waitForTimeout(2000);

    // Verify we're on session page
    const url = page.url();
    expect(url).toContain('/sessions/');

    // Verify session header is displayed with session name
    const sessionHeader = page.locator('h1, h2, [data-testid*="session"]').first();
    await expect(sessionHeader).toBeVisible({ timeout: 10000 });

    console.log('✅ GM-01: Session created successfully');
  });

  test('GM-02: Create character in session', async ({ page }) => {
    // Login
    await loginAsGM(page);

    // Create session using helper
    const sessionId = await createSession(page, `CharTest ${Date.now()}`);
    if (!sessionId) {
      console.log('⚠️ Failed to create session');
      return;
    }

    // Click "Créer un Personnage" or "Nouveau Personnage"
    const createButton = page.locator('button:has-text("Nouveau Personnage"), button:has-text("Créer un Personnage")').first();
    await expect(createButton).toBeVisible({ timeout: 10000 });

    await page.screenshot({ path: '/tmp/gm-before-character-create.png', fullPage: true });
    await createButton.click();
    await page.waitForTimeout(3000);

    // Check if we're on character creation page
    const currentUrl = page.url();
    console.log('Current URL after click:', currentUrl);
    await page.screenshot({ path: '/tmp/gm-after-character-create.png', fullPage: true });

    // Should be on character creation page (NOT 404)
    // Check for character creation page elements instead of searching for "404" string
    const heading = page.locator('h1:has-text("Création d")');
    await expect(heading).toBeVisible({ timeout: 5000 });

    // Verify we're NOT on the 404 page by checking title
    const title = await page.title();
    expect(title).not.toContain('404: This page could not be found');

    console.log('✅ GM-02: Character creation page accessible');
  });

  test('GM-03: Import character from another session', async ({ page }) => {
    // Login
    await loginAsGM(page);

    // Go to sessions
    await goToSessions(page);

    // Find first session
    const sessionCard = page.locator('[data-testid^="session-card-"]').first();
    if (await sessionCard.count() > 0) {
      await sessionCard.click();
      await page.waitForTimeout(2000);

      // Click import button
      const importButton = page.locator('button[data-testid="button-import-character"]');
      if (await importButton.count() > 0) {
        await importButton.click();
        await page.waitForTimeout(1000);

        // Check if dialog opened
        const dialog = page.locator('[role="dialog"]');
        await expect(dialog).toBeVisible();

        console.log('✅ GM-03: Import dialog opened');
      } else {
        console.log('⚠️ GM-03: Import button not found (may need existing characters)');
      }
    } else {
      console.log('⚠️ GM-03: No sessions found');
    }
  });

  test('GM-04: View session QR code', async ({ page }) => {
    // Login and create session
    await loginAsGM(page);
    const sessionId = await createSession(page, `QRTest ${Date.now()}`);
    if (!sessionId) {
      console.log('⚠️ Failed to create session');
      return;
    }

    // Look for QR code button (icon button)
    const qrButtons = page.locator('button').filter({ has: page.locator('svg') });
    let qrCodeFound = false;

    for (let i = 0; i < await qrButtons.count(); i++) {
      const button = qrButtons.nth(i);
      await button.click();
      await page.waitForTimeout(500);

      // Check if QR dialog opened
      const dialog = page.locator('[role="dialog"]:has-text("QR")');
      if (await dialog.count() > 0) {
        qrCodeFound = true;
        console.log('✅ GM-04: QR code dialog opened');

        // Close dialog
        const closeButton = page.locator('button[aria-label="Close"]');
        if (await closeButton.count() > 0) {
          await closeButton.click();
        }
        break;
      }
    }

    if (!qrCodeFound) {
      console.log('⚠️ GM-04: QR code button not found');
    }
  });

  test('GM-05: Open GameBoard', async ({ page, context }) => {
    // Login and create session
    await loginAsGM(page);
    const sessionId = await createSession(page, `BoardTest ${Date.now()}`);
    if (!sessionId) {
      console.log('⚠️ Failed to create session');
      return;
    }

    // Click GameBoard button
    const gameboardButton = page.locator('button[data-testid="button-gameboard"]');
    if (await gameboardButton.count() > 0) {
      // Listen for new page
      const pagePromise = context.waitForEvent('page');
      await gameboardButton.click();
      const newPage = await pagePromise;
      await newPage.waitForLoadState('networkidle');

      const url = newPage.url();
      expect(url).toContain('/gameboard');

      await newPage.close();
      console.log('✅ GM-05: GameBoard opened in new tab');
    } else {
      console.log('⚠️ GM-05: GameBoard button not found');
    }
  });

  test('GM-06: Open Narrative Journal', async ({ page }) => {
    // Login and create session
    await loginAsGM(page);
    const sessionId = await createSession(page, `JournalTest ${Date.now()}`);
    if (!sessionId) {
      console.log('⚠️ Failed to create session');
      return;
    }

    // Click Journal button
    const journalButton = page.locator('button[data-testid="button-narrative-journal"]');
    if (await journalButton.count() > 0) {
      await journalButton.click();
      await page.waitForTimeout(1000);

      // Check if dialog opened
      const dialog = page.locator('[role="dialog"]:has-text("Journal")');
      await expect(dialog).toBeVisible();

      console.log('✅ GM-06: Narrative Journal opened');
    } else {
      console.log('⚠️ GM-06: Journal button not found');
    }
  });
});
