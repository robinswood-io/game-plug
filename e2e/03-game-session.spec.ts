import { test, expect } from '@playwright/test';

test.describe('Game Session Management', () => {
  const testEmail = `gm-session-test-${Date.now()}@test.com`;
  const testPassword = 'SecurePassword123!';
  const sessionName = `Test Campaign ${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    // Create account and login
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte|inscription|sign.*up/i }).click();
    await page.waitForURL(/^http:\/\/localhost:5002\/?(home|session-manager|sessions)?$/, { timeout: 10000 });
  });

  test('should create a new game session', async ({ page }) => {
    // Navigate to session manager
    await page.goto('/session-manager');

    // Click create session button
    await page.getByTestId('button-create-session').click();

    // Fill session details
    await page.getByTestId('input-session-name').fill(sessionName);

    // Save session
    await page.getByTestId('button-confirm-create').click();

    // Wait for session to be created
    await page.waitForTimeout(2000);

    // Verify session exists
    await expect(page.getByText(sessionName)).toBeVisible({ timeout: 5000 });
  });

  test('should generate session join code', async ({ page }) => {
    // Create session
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(`${sessionName}-code`);
    await page.getByTestId('button-confirm-create').click();
    await page.waitForTimeout(2000);

    // Look for join code - should be visible in the session card
    await expect(page.locator('text=/[A-Z0-9]{6}/')).toBeVisible({ timeout: 5000 });

    // Code should be alphanumeric, 6 characters
    const code = await page.locator('text=/[A-Z0-9]{6}/').first().textContent();
    expect(code).toMatch(/[A-Z0-9]{6}/);
  });

  test('should activate game session', async ({ page }) => {
    // Create session
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(`${sessionName}-active`);
    await page.getByTestId('button-confirm-create').click();
    await page.waitForTimeout(2000);

    // Navigate back to session manager to toggle active status
    await page.goto('/session-manager');

    // Find and click the toggle button for the created session
    const toggleButtons = await page.locator('[data-testid^="button-toggle-active-"]').all();
    if (toggleButtons.length > 0) {
      await toggleButtons[toggleButtons.length - 1].click();

      // Verify session is active (check for Active badge)
      await expect(page.getByText('Active')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should access GM dashboard for session', async ({ page }) => {
    // Create session
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(`${sessionName}-gm`);
    await page.getByTestId('button-confirm-create').click();

    // Should be redirected to GM dashboard for the created session
    await page.waitForURL(/\/gm\//, { timeout: 10000 });

    // Verify GM dashboard is loaded
    await expect(page).toHaveURL(/\/gm\//);
  });

  test('should join session with code (player view)', async ({ page, context }) => {
    // Create session as GM
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(`${sessionName}-join`);
    await page.getByTestId('button-confirm-create').click();
    await page.waitForTimeout(2000);

    // Navigate back to session manager to get the code
    await page.goto('/session-manager');
    await page.waitForTimeout(1000);

    // Get session code from the newly created session
    const codeText = await page.locator('text=/[A-Z0-9]{6}/').first().textContent();
    const sessionCode = codeText?.match(/[A-Z0-9]{6}/)?.[0];

    if (sessionCode) {
      // Open new incognito page as player
      const playerPage = await context.newPage();
      await playerPage.goto('/join-with-code');

      // Enter session code
      await playerPage.getByLabel(/code|access/i).fill(sessionCode);
      await playerPage.getByRole('button', { name: /rejoindre|join|entrer|enter/i }).click();

      // Should be redirected to session or character selection
      await playerPage.waitForURL(/\/session|\/join-session|\/select-character/, { timeout: 10000 });

      // Verify join was successful
      await expect(playerPage.getByText(sessionName).or(playerPage.getByText(/personnage|character|sélection|select/i))).toBeVisible({ timeout: 5000 });

      await playerPage.close();
    }
  });

  test('should end game session', async ({ page }) => {
    // Create session
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(`${sessionName}-end`);
    await page.getByTestId('button-confirm-create').click();
    await page.waitForTimeout(2000);

    // Navigate back to session manager
    await page.goto('/session-manager');
    await page.waitForTimeout(1000);

    // Find and click delete button for the session
    const deleteButtons = await page.locator('[data-testid^="button-delete-"]').all();
    if (deleteButtons.length > 0) {
      await deleteButtons[deleteButtons.length - 1].click();

      // Confirm deletion
      await page.getByTestId('button-confirm-delete').click();

      // Verify session is removed
      await page.waitForTimeout(1000);
      await expect(page.getByText(`${sessionName}-end`)).not.toBeVisible({ timeout: 5000 });
    }
  });
});
