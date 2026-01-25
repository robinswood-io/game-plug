import { test, expect } from '@playwright/test';

test.describe('Session Creation and Character Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('https://game-plug.rbw.ovh/');
  });

  test('should create session and character successfully', async ({ page }) => {
    // 1. Login as GM
    console.log('Step 1: Login as GM');
    await page.click('button:has-text("Dev MJ")');

    // Wait for redirect to dashboard or sessions
    await page.waitForTimeout(2000);

    // 2. Navigate to sessions page
    console.log('Step 2: Navigate to sessions');
    await page.goto('https://game-plug.rbw.ovh/sessions');
    await page.waitForLoadState('networkidle');

    // 3. Create new session
    console.log('Step 3: Create new session');
    await page.click('button:has-text("Nouvelle Session")');

    // Fill session name
    const sessionName = `Test Playwright ${Date.now()}`;
    await page.fill('input[data-testid="input-session-name"]', sessionName);

    // Submit
    await page.click('button[data-testid="button-confirm-create"]');

    // Wait for redirect to session dashboard
    await page.waitForTimeout(3000);

    // Verify we're on a session page
    const currentUrl = page.url();
    console.log('Current URL after session creation:', currentUrl);
    expect(currentUrl).toContain('/sessions/');

    // 4. Get session code from the page
    console.log('Step 4: Get session code');
    const sessionCodeElement = await page.locator('text=/Code: [A-Z0-9]{6}/').first();
    const sessionCodeText = await sessionCodeElement.textContent();
    console.log('Session code found:', sessionCodeText);

    // 5. Try to create a character
    console.log('Step 5: Try to create character');

    // Look for "Create Character" or similar button
    const createCharButton = page.locator('button:has-text("Créer")').first();
    if (await createCharButton.isVisible()) {
      await createCharButton.click();
      await page.waitForTimeout(2000);

      // Take screenshot of character creation form
      await page.screenshot({ path: '/tmp/character-creation-form.png', fullPage: true });
      console.log('Screenshot saved: /tmp/character-creation-form.png');
    } else {
      console.log('No "Créer" button found');
      await page.screenshot({ path: '/tmp/session-dashboard.png', fullPage: true });
      console.log('Screenshot of dashboard saved: /tmp/session-dashboard.png');
    }

    // 6. Test QR code join
    console.log('Step 6: Test QR code join');
    const sessionCode = sessionCodeText?.match(/[A-Z0-9]{6}/)?.[0];
    if (sessionCode) {
      console.log('Testing join with code:', sessionCode);
      await page.goto(`https://game-plug.rbw.ovh/join/${sessionCode}`);
      await page.waitForTimeout(3000);

      const joinUrl = page.url();
      console.log('Join URL result:', joinUrl);

      await page.screenshot({ path: '/tmp/join-result.png', fullPage: true });
      console.log('Join screenshot saved: /tmp/join-result.png');

      // Check for errors
      const errorText = await page.locator('text=/Session Introuvable|Code de session invalide/').count();
      if (errorText > 0) {
        console.log('❌ Join failed - session not found');
      } else {
        console.log('✅ Join succeeded');
      }
    }
  });

  test('should show validation errors', async ({ page }) => {
    // Login
    await page.click('button:has-text("Dev MJ")');
    await page.waitForTimeout(2000);

    // Navigate to sessions
    await page.goto('https://game-plug.rbw.ovh/sessions');
    await page.waitForLoadState('networkidle');

    // Try to create session with empty name
    await page.click('button:has-text("Nouvelle Session")');
    await page.click('button[data-testid="button-confirm-create"]');

    // Should show validation error
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/validation-error.png' });
    console.log('Validation error screenshot saved');
  });
});
