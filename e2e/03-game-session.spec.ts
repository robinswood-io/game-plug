import { test, expect } from '@playwright/test';

test.describe('Game Session Management', () => {
  const testPassword = 'SecurePassword123!';
  const sessionName = `Test Campaign ${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    // Generate unique email for each test
    const testEmail = `gm-session-test-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`;

    // Create account and login
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte|inscription|sign.*up/i }).click();
    await page.waitForURL(/\/(home|session-manager|sessions|dashboard)/, { timeout: 15000 });
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

    // Should redirect to GM dashboard after creation
    await page.waitForURL(/\/gm\//, { timeout: 10000 });

    // Navigate back to session manager to verify session exists
    await page.goto('/session-manager');
    await page.waitForTimeout(1000);

    // Verify session name is visible using the actual testid pattern
    await expect(page.locator('[data-testid^="text-session-name-"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('should generate session join code', async ({ page }) => {
    // Create session
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(`${sessionName}-code`);
    await page.getByTestId('button-confirm-create').click();

    // Should redirect to GM dashboard
    await page.waitForURL(/\/gm\//, { timeout: 10000 });

    // Navigate back to session manager
    await page.goto('/session-manager');
    await page.waitForTimeout(1000);

    // Verify copy invite link button exists for the session
    const copyLinkButton = page.locator('[data-testid^="button-copy-link-"]').first();
    await expect(copyLinkButton).toBeVisible({ timeout: 5000 });

    // Click to copy the invite link (tests clipboard functionality)
    await copyLinkButton.click();

    // Verify toast notification appears
    await expect(page.getByText(/lien copié/i)).toBeVisible({ timeout: 3000 });
  });

  test('should activate game session', async ({ page }) => {
    // Create session
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(`${sessionName}-active`);
    await page.getByTestId('button-confirm-create').click();

    // Should redirect to GM dashboard
    await page.waitForURL(/\/gm\//, { timeout: 10000 });

    // Navigate back to session manager to toggle active status
    await page.goto('/session-manager');
    await page.waitForTimeout(1000);

    // Find and click the toggle button for the created session (defaults to inactive)
    const toggleButton = page.locator('[data-testid^="button-toggle-active-"]').first();
    await expect(toggleButton).toBeVisible({ timeout: 5000 });
    await toggleButton.click();

    // Wait for mutation to complete
    await page.waitForTimeout(1000);

    // Verify session is active (check for Active badge)
    await expect(page.getByText('Active').first()).toBeVisible({ timeout: 5000 });
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

    // Wait for redirect to GM dashboard and extract session ID from URL
    await page.waitForURL(/\/gm\//, { timeout: 10000 });
    const currentUrl = page.url();
    const sessionId = currentUrl.match(/\/gm\/(.+)/)?.[1];

    if (sessionId) {
      // Open new page as player (simulating invite link click)
      const playerPage = await context.newPage();

      // Navigate directly to join-session route (what invite link would do)
      await playerPage.goto(`/join-session/${sessionId}`);

      // Should be redirected to session or show join interface
      await playerPage.waitForTimeout(2000);

      // Verify we're on some session-related page (not an error page)
      const currentPlayerUrl = playerPage.url();
      const isValidJoinRoute = /\/(join-session|session|character|select-character|home)/.test(currentPlayerUrl);
      expect(isValidJoinRoute).toBeTruthy();

      await playerPage.close();
    }
  });

  test('should end game session', async ({ page }) => {
    const uniqueSessionName = `${sessionName}-end`;

    // Create session
    await page.goto('/session-manager');
    await page.getByTestId('button-create-session').click();
    await page.getByTestId('input-session-name').fill(uniqueSessionName);
    await page.getByTestId('button-confirm-create').click();

    // Should redirect to GM dashboard
    await page.waitForURL(/\/gm\//, { timeout: 10000 });

    // Navigate back to session manager
    await page.goto('/session-manager');
    await page.waitForTimeout(1000);

    // Find and click delete button for the session
    const deleteButton = page.locator('[data-testid^="button-delete-"]').first();
    await expect(deleteButton).toBeVisible({ timeout: 5000 });
    await deleteButton.click();

    // Confirm deletion in dialog
    await page.waitForTimeout(500);
    await page.getByTestId('button-confirm-delete').click();

    // Wait for deletion to complete
    await page.waitForTimeout(1000);

    // Verify session name is no longer visible
    await expect(page.getByText(uniqueSessionName)).not.toBeVisible({ timeout: 5000 });
  });
});
