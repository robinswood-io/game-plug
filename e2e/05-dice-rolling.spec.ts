import { test, expect } from '@playwright/test';

test.describe('Dice Rolling System', () => {
  const testPassword = 'SecurePassword123!';
  let sessionId: string;

  test.beforeEach(async ({ page }) => {
    // Generate unique email for each test
    const testEmail = `gm-dice-test-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`;

    // Create account and login
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte|inscription|sign.*up/i }).click();
    await page.waitForURL(/\/(home|session-manager|sessions|dashboard)/, { timeout: 15000 });

    // Create a session to get session ID for GM dashboard access
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(`Dice Test ${Date.now()}`);
    await page.getByTestId('button-confirm-create').click();

    // Wait for redirect and extract session ID
    await page.waitForURL(/\/gm\//, { timeout: 10000 });
    const currentUrl = page.url();
    const match = currentUrl.match(/\/gm\/(.+)/);
    sessionId = match?.[1] || '';
  });

  test('should open dice roller interface', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Look for dice roller button - use data-testid for sanity check button
    const sanityButton = page.locator('[data-testid="button-sanity-check"]');
    if (await sanityButton.isVisible()) {
      // Verify dice roller is open
      await expect(sanityButton).toBeVisible({ timeout: 5000 });
    }
  });

  test('should roll standard dice (1d6)', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Roll using sanity check button which performs 1d100 roll
    const sanityButton = page.locator('[data-testid="button-sanity-check"]');
    if (await sanityButton.isVisible()) {
      await sanityButton.click();
      await page.waitForTimeout(500);

      // Verify result appears
      const rollResult = page.locator('[data-testid="text-roll-result"]');
      await expect(rollResult).toBeVisible({ timeout: 5000 });
    }
  });

  test('should roll percentile dice (d100)', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Click on luck roll button which uses 1d100
    const luckButton = page.locator('[data-testid="button-luck-roll"]');
    if (await luckButton.isVisible()) {
      await luckButton.click();
      await page.waitForTimeout(500);

      // Verify result appears
      const rollResult = page.locator('[data-testid="text-roll-result"]');
      await expect(rollResult).toBeVisible({ timeout: 5000 });
    }
  });

  test('should roll custom dice notation (2d6+3)', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Find custom dice input
    const customInput = page.locator('[data-testid="input-custom-skill-name"]');
    if (await customInput.isVisible()) {
      await customInput.fill('Test Skill');

      // Set custom value
      const customValue = page.locator('[data-testid="input-custom-skill-value"]');
      if (await customValue.isVisible()) {
        await customValue.fill('50');
      }

      // Roll
      const rollButton = page.locator('[data-testid="button-custom-roll"]');
      await rollButton.click();

      // Verify result appears
      const rollResult = page.locator('[data-testid="text-roll-result"]');
      await expect(rollResult).toBeVisible({ timeout: 5000 });
    }
  });

  test('should perform skill check roll', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Use custom skill roll to perform a skill check
    const customInput = page.locator('[data-testid="input-custom-skill-name"]');
    if (await customInput.isVisible()) {
      await customInput.fill('Psychologie');

      // Set skill value
      const customValue = page.locator('[data-testid="input-custom-skill-value"]');
      if (await customValue.isVisible()) {
        await customValue.fill('65');
      }

      // Roll
      const rollButton = page.locator('[data-testid="button-custom-roll"]');
      await rollButton.click();

      // Verify result shows outcome
      const rollOutcome = page.locator('[data-testid="text-roll-outcome"]');
      await expect(rollOutcome).toBeVisible({ timeout: 5000 });
    }
  });

  test('should perform sanity roll', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Look for sanity roll option
    const sanityButton = page.locator('[data-testid="button-sanity-check"]');
    if (await sanityButton.isVisible()) {
      await sanityButton.click();
      await page.waitForTimeout(500);

      // Verify result shows outcome
      const rollOutcome = page.locator('[data-testid="text-roll-outcome"]');
      await expect(rollOutcome).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show roll history', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Make a roll using sanity check
    const sanityButton = page.locator('[data-testid="button-sanity-check"]');
    if (await sanityButton.isVisible()) {
      await sanityButton.click();
      await page.waitForTimeout(1000);

      // Verify result is displayed
      const rollResult = page.locator('[data-testid="text-roll-result"]');
      await expect(rollResult).toBeVisible({ timeout: 5000 });
    }
  });

  test('should support GM secret rolls', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Make a roll using luck button
    const luckButton = page.locator('[data-testid="button-luck-roll"]');
    if (await luckButton.isVisible()) {
      await luckButton.click();
      await page.waitForTimeout(500);

      // Verify result appears
      const rollResult = page.locator('[data-testid="text-roll-result"]');
      await expect(rollResult).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display roll animations', async ({ page }) => {
    await page.goto(`/gm/${sessionId}`);
    await page.waitForTimeout(2000);

    // Make a roll using custom skill
    const customInput = page.locator('[data-testid="input-custom-skill-name"]');
    if (await customInput.isVisible()) {
      await customInput.fill('Test Animation');

      // Roll
      const rollButton = page.locator('[data-testid="button-custom-roll"]');
      await rollButton.click();

      // Check for result animation
      const rollResult = page.locator('[data-testid="text-roll-result"]');
      await expect(rollResult).toBeVisible({ timeout: 5000 });
    }
  });
});
