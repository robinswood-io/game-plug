import { test, expect } from '@playwright/test';

test.describe('Character Creation Test', () => {
  test('should create character in new session', async ({ page }) => {
    // 1. Login as GM
    console.log('Step 1: Login as GM');
    await page.goto('https://game-plug.rbw.ovh/');
    await page.click('button:has-text("Dev MJ")');
    await page.waitForTimeout(2000);

    // 2. Go to sessions
    console.log('Step 2: Navigate to sessions');
    await page.goto('https://game-plug.rbw.ovh/sessions');
    await page.waitForLoadState('networkidle');

    // 3. Create session
    console.log('Step 3: Create new session');
    await page.click('button:has-text("Nouvelle Session")');
    const sessionName = `CharTest ${Date.now()}`;
    await page.fill('input[data-testid="input-session-name"]', sessionName);
    await page.click('button[data-testid="button-confirm-create"]');
    await page.waitForTimeout(3000);

    const sessionUrl = page.url();
    console.log('Session created, URL:', sessionUrl);

    // 4. Click "Créer un Personnage"
    console.log('Step 4: Click create character button');
    await page.screenshot({ path: '/tmp/before-click-create-char.png', fullPage: true });

    const createButton = page.locator('button:has-text("Créer un Personnage")');
    await expect(createButton).toBeVisible({ timeout: 10000 });

    await createButton.click();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: '/tmp/after-click-create-char.png', fullPage: true });
    console.log('Screenshots saved');

    // 5. Check what happened
    const currentUrl = page.url();
    console.log('Current URL after click:', currentUrl);

    // Check for any visible dialogs/forms
    const dialogVisible = await page.locator('[role="dialog"]').count();
    console.log('Dialog count:', dialogVisible);

    if (dialogVisible > 0) {
      console.log('✅ Dialog opened');
      const dialogContent = await page.locator('[role="dialog"]').first().textContent();
      console.log('Dialog content preview:', dialogContent?.substring(0, 200));
    } else {
      console.log('❌ No dialog found - checking page content');
      const pageText = await page.textContent('body');
      console.log('Page text preview:', pageText?.substring(0, 300));
    }

    // Take final screenshot
    await page.screenshot({ path: '/tmp/final-state.png', fullPage: true });

    // Check console for errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser console error:', msg.text());
      }
    });
  });
});
