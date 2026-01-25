import { test, expect } from '@playwright/test';

/**
 * SUITE DE TESTS CRITIQUE - CRITICAL FLOWS
 *
 * Objectif: Valider que TOUTES les user stories critiques fonctionnent
 * après correction du bug auth 401.
 *
 * Scope:
 * - Authentication (P0)
 * - Session Creation (P0)
 * - Character Creation (P0)
 * - Complete Workflows (P0)
 * - WebSocket connections (P1)
 *
 * Tous les tests DOIVENT passer avant déploiement production.
 */

test.describe('Critical User Flows - Production Validation', () => {

  // ============================================================================
  // TEST 1: AUTHENTICATION - Dev Login MJ
  // ============================================================================

  test('[P0] Dev Login MJ should not return 401 error', async ({ page }) => {
    // ARRANGE
    await page.goto('/');

    // ACT
    const devMjButton = page.getByRole('button', { name: /Dev MJ \(Test\)/i });
    await expect(devMjButton).toBeVisible({ timeout: 5000 });

    // Monitor network for 401 errors
    const unauthorized401Errors: string[] = [];
    page.on('response', response => {
      if (response.status() === 401) {
        unauthorized401Errors.push(response.url());
      }
    });

    await devMjButton.click();

    // ASSERT
    // Should be redirected to dashboard
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Token should be in localStorage
    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(token).toBeTruthy();
    expect(token).toMatch(/^ey/); // JWT starts with 'ey'

    // No 401 errors during login flow
    expect(unauthorized401Errors).toHaveLength(0);

    // Dashboard elements should be visible
    await expect(page.getByText(/dashboard|session|personnage/i).first()).toBeVisible({ timeout: 5000 });
  });

  // ============================================================================
  // TEST 2: AUTHENTICATION - Login Standard MJ
  // ============================================================================

  test('[P0] Standard GM Login with credentials should not return 401', async ({ page }) => {
    // ARRANGE
    const testEmail = `gm-critical-${Date.now()}@test.com`;
    const testPassword = 'SecurePassword123!';

    // First signup
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('Critical');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);

    // Monitor for 401 during signup
    const unauthorized: string[] = [];
    page.on('response', response => {
      if (response.status() === 401) {
        unauthorized.push(response.url());
      }
    });

    await page.getByRole('button', { name: /créer.*compte|s'inscrire|sign.*up/i }).click();
    await page.waitForURL(/.*dashboard.*/, { timeout: 15000 });

    // Clear token for login test
    await page.evaluate(() => localStorage.removeItem('access_token'));

    // ACT: Login
    await page.goto('/gm-login');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);

    unauthorized.length = 0; // Reset counter
    await page.getByRole('button', { name: /se connecter|login|sign.*in/i }).click();

    // ASSERT
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(token).toBeTruthy();

    // No 401 errors
    expect(unauthorized).toHaveLength(0);
  });

  // ============================================================================
  // TEST 3: SESSION CREATION - Create New Session Without 401
  // ============================================================================

  test('[P0] Create session should not return 401 error', async ({ page }) => {
    // ARRANGE
    const sessionName = `Test Critical Session ${Date.now()}`;
    const unauthorized401: string[] = [];

    page.on('response', response => {
      if (response.status() === 401) {
        unauthorized401.push(response.url());
      }
    });

    // Login
    await page.goto('/');
    await page.getByRole('button', { name: /Dev MJ \(Test\)/i }).click();
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // ACT
    await page.goto('/sessions');

    // Click create session button - handle different selectors
    const createButton = page.locator('[data-testid="button-create-session"]').or(
      page.getByRole('button', { name: /nouvelle.*session|create.*session|new.*session/i })
    );

    await createButton.first().click();

    // Fill session name - handle different input selectors
    const nameInput = page.locator('[data-testid="input-session-name"]').or(
      page.locator('input[name="name"]').or(
        page.locator('input[placeholder*="session"]')
      )
    );

    await nameInput.first().fill(sessionName);

    // Confirm creation
    const confirmButton = page.locator('[data-testid="button-confirm-create"]').or(
      page.getByRole('button', { name: /créer|create|confirmer/i })
    );

    await confirmButton.first().click();

    // ASSERT
    // Session should be created within timeout
    await page.waitForTimeout(2000);

    // Should NOT have 401 errors
    expect(unauthorized401).toHaveLength(0);

    // Session should appear in list
    await expect(page.locator(`text=${sessionName}`).or(
      page.locator(`text=Test Critical Session`)
    )).toBeVisible({ timeout: 5000 });
  });

  // ============================================================================
  // TEST 4: SESSION MANAGEMENT - Verify Session Code Generated
  // ============================================================================

  test('[P0] Session join code should be generated and copyable', async ({ page }) => {
    // ARRANGE
    const sessionName = `Code Test Session ${Date.now()}`;

    await page.goto('/');
    await page.getByRole('button', { name: /Dev MJ/i }).click();
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Create session
    await page.goto('/sessions');
    const createBtn = page.locator('[data-testid="button-create-session"]').or(
      page.getByRole('button', { name: /nouvelle.*session/i })
    );
    await createBtn.first().click();

    const nameInput = page.locator('[data-testid="input-session-name"]').or(
      page.locator('input[name="name"]')
    );
    await nameInput.first().fill(sessionName);

    const confirmBtn = page.locator('[data-testid="button-confirm-create"]').or(
      page.getByRole('button', { name: /créer/i })
    );
    await confirmBtn.first().click();

    // Wait for session to be created
    await page.waitForTimeout(1500);

    // ACT: Find and copy session link
    // Look for copy button near the created session
    const copyButtons = page.locator('[data-testid*="button-copy"]').or(
      page.getByRole('button', { name: /copier|copy/i })
    );

    // Get first copy button (should be the one for the newly created session)
    if (await copyButtons.first().isVisible({ timeout: 2000 })) {
      // Set up clipboard listener
      await page.evaluate(() => {
        window.__clipboardData = null;
      });

      // Intercept clipboard API
      await page.evaluate(() => {
        const originalWriteText = navigator.clipboard.writeText;
        navigator.clipboard.writeText = async (text) => {
          (window as any).__clipboardData = text;
          return originalWriteText.call(navigator.clipboard, text);
        };
      });

      await copyButtons.first().click();
      await page.waitForTimeout(500);

      // ASSERT
      const clipboardData = await page.evaluate(() => (window as any).__clipboardData);
      expect(clipboardData).toMatch(/join\/[A-Z0-9]{6}/);
    }
  });

  // ============================================================================
  // TEST 5: CHARACTER CREATION - Create Character Without 401
  // ============================================================================

  test('[P0] Create character should not return 401 error', async ({ page }) => {
    // ARRANGE
    const charName = `Test Critical Character ${Date.now()}`;
    const unauthorized401: string[] = [];

    page.on('response', response => {
      if (response.status() === 401) {
        unauthorized401.push(response.url());
      }
    });

    // Login
    await page.goto('/');
    await page.getByRole('button', { name: /Dev MJ/i }).click();
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // ACT
    // Navigate to character creation
    const newCharButton = page.getByRole('button', { name: /nouveau.*personnage|new.*character|créer.*personnage/i });

    if (await newCharButton.isVisible({ timeout: 2000 })) {
      await newCharButton.click();
    } else {
      // Fallback: navigate directly
      await page.goto('/characters/new');
    }

    // Fill character form
    const nameInput = page.locator('input[name="name"]').or(
      page.locator('input[placeholder*="name"]')
    );
    await nameInput.first().fill(charName);

    // Fill occupation if exists
    const occupationSelect = page.locator('select[name="occupation"]').or(
      page.locator('select[name="job"]')
    );

    if (await occupationSelect.first().isVisible({ timeout: 1000 })) {
      await occupationSelect.first().selectOption('Private Investigator').catch(() => {
        // If exact value not found, select first available
        return occupationSelect.first().selectOption({ index: 1 });
      });
    }

    // Fill age if exists
    const ageInput = page.locator('input[name="age"]');
    if (await ageInput.isVisible({ timeout: 1000 })) {
      await ageInput.fill('35');
    }

    // Submit form
    const submitButton = page.getByRole('button', { name: /sauvegarder|créer|create|save/i });
    await submitButton.first().click();

    // ASSERT
    // Should be redirected to character detail page with /characters/[id] (PLURAL)
    await page.waitForURL(/.*\/characters\/[^/]+$/, { timeout: 10000 });

    // Should NOT have 401 errors
    expect(unauthorized401).toHaveLength(0);

    // Character name should be displayed
    await expect(page.locator(`text=${charName}`).or(
      page.getByRole('heading', { name: new RegExp(charName) })
    )).toBeVisible({ timeout: 5000 });
  });

  // ============================================================================
  // TEST 6: CHARACTER DETAIL - Verify Character Information Loads
  // ============================================================================

  test('[P0] Character detail page should load with all information', async ({ page }) => {
    // ARRANGE
    const charName = `Detail Test Character ${Date.now()}`;

    await page.goto('/');
    await page.getByRole('button', { name: /Dev MJ/i }).click();
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Create a character
    const newCharBtn = page.getByRole('button', { name: /nouveau.*personnage/i });
    if (await newCharBtn.isVisible({ timeout: 2000 })) {
      await newCharBtn.click();
    } else {
      await page.goto('/characters/new');
    }

    const nameInput = page.locator('input[name="name"]');
    await nameInput.first().fill(charName);

    const submitBtn = page.getByRole('button', { name: /sauvegarder|créer/i });
    await submitBtn.first().click();

    await page.waitForURL(/.*\/characters\/[^/]+$/, { timeout: 10000 });

    // ACT: Reload page to verify persistence
    await page.reload();

    // ASSERT
    // Character name should still be visible
    await expect(page.locator(`text=${charName}`)).toBeVisible({ timeout: 5000 });

    // Characteristic values should be present (if displayed)
    const charPage = await page.content();

    // Check for common characteristic names
    const hasCharacteristics = /STR|CON|SIZ|DEX|APP|INT|POW|EDU|caractéristiques/i.test(charPage);
    if (hasCharacteristics) {
      await expect(page.locator('text=/STR|CON|SIZ|DEX|APP|INT|POW|EDU/i').first()).toBeVisible({ timeout: 2000 });
    }
  });

  // ============================================================================
  // TEST 7: TOKEN PERSISTENCE - Token Should Survive Page Reload
  // ============================================================================

  test('[P0] Access token should persist after page reload', async ({ page }) => {
    // ARRANGE
    await page.goto('/');
    await page.getByRole('button', { name: /Dev MJ/i }).click();
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // ACT: Get token before reload
    const tokenBefore = await page.evaluate(() => localStorage.getItem('access_token'));

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle', { timeout: 5000 });

    // Get token after reload
    const tokenAfter = await page.evaluate(() => localStorage.getItem('access_token'));

    // ASSERT
    expect(tokenBefore).toBeTruthy();
    expect(tokenAfter).toBeTruthy();
    expect(tokenBefore).toBe(tokenAfter);

    // Should still be on dashboard (not redirected to login)
    expect(page.url()).toMatch(/.*dashboard.*/);
  });

  // ============================================================================
  // TEST 8: AUTHORIZATION HEADER - Token Should Be Sent in API Requests
  // ============================================================================

  test('[P0] Authorization header should be present in API requests', async ({ page }) => {
    // ARRANGE
    const authorizedRequests: string[] = [];
    const unauthorizedRequests: string[] = [];

    page.on('response', response => {
      // Check request headers
      const request = response.request();
      const authHeader = request.headers()['authorization'];

      if (request.url().includes('/api/')) {
        if (authHeader && authHeader.startsWith('Bearer ')) {
          authorizedRequests.push(request.url());
        } else if (!request.url().includes('/auth/dev-login')) {
          // Exclude public endpoints
          unauthorizedRequests.push(request.url());
        }
      }
    });

    // ACT
    await page.goto('/');
    await page.getByRole('button', { name: /Dev MJ/i }).click();
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Navigate to sessions to trigger API calls
    await page.goto('/sessions');
    await page.waitForTimeout(1500);

    // ASSERT
    // Should have authorized requests
    expect(authorizedRequests.length).toBeGreaterThan(0);

    // Should have NO unauthorized API calls (except public endpoints)
    const privateApiUnauthorized = unauthorizedRequests.filter(url =>
      !url.includes('/auth/') && !url.includes('/health')
    );
    expect(privateApiUnauthorized).toHaveLength(0);
  });

  // ============================================================================
  // TEST 9: COMPLETE WORKFLOW - Login → Create Session → Create Character
  // ============================================================================

  test('[P0] Complete MJ workflow: Login → Session → Character', async ({ page }) => {
    // ARRANGE
    const sessionName = `Workflow Session ${Date.now()}`;
    const charName = `Workflow Character ${Date.now()}`;
    const failedRequests: { url: string; code: number }[] = [];

    page.on('response', response => {
      if (response.status() === 401 || response.status() === 500) {
        failedRequests.push({ url: response.url(), code: response.status() });
      }
    });

    // STEP 1: Login
    await page.goto('/');
    await page.getByRole('button', { name: /Dev MJ/i }).click();
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Verify token
    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(token).toBeTruthy();

    // STEP 2: Create Session
    await page.goto('/sessions');
    const createSessionBtn = page.locator('[data-testid="button-create-session"]').or(
      page.getByRole('button', { name: /nouvelle.*session/i })
    );
    await createSessionBtn.first().click();

    const sessionNameInput = page.locator('[data-testid="input-session-name"]').or(
      page.locator('input[name="name"]')
    );
    await sessionNameInput.first().fill(sessionName);

    const confirmSessionBtn = page.locator('[data-testid="button-confirm-create"]').or(
      page.getByRole('button', { name: /créer/i })
    );
    await confirmSessionBtn.first().click();
    await page.waitForTimeout(1500);

    // STEP 3: Create Character
    const newCharBtn = page.getByRole('button', { name: /nouveau.*personnage/i });
    if (await newCharBtn.isVisible({ timeout: 2000 })) {
      await newCharBtn.click();
    } else {
      await page.goto('/characters/new');
    }

    const charNameInput = page.locator('input[name="name"]');
    await charNameInput.first().fill(charName);

    const submitCharBtn = page.getByRole('button', { name: /sauvegarder|créer/i });
    await submitCharBtn.first().click();

    // Wait for redirect to character detail
    await page.waitForURL(/.*\/characters\/[^/]+$/, { timeout: 10000 });

    // ASSERT
    // No 401 or 500 errors during entire workflow
    expect(failedRequests).toHaveLength(0);

    // Final page should show character name
    await expect(page.locator(`text=${charName}`)).toBeVisible({ timeout: 5000 });
  });

  // ============================================================================
  // TEST 10: WEBSOCKET - GameBoard Connection Should Establish
  // ============================================================================

  test('[P1] GameBoard WebSocket should connect without 401', async ({ page }) => {
    // ARRANGE
    const wsErrors: string[] = [];
    let wsConnected = false;

    // Listen for console messages
    page.on('console', msg => {
      if (msg.type() === 'error') {
        if (msg.text().includes('401') || msg.text().includes('Unauthorized')) {
          wsErrors.push(msg.text());
        }
      }
      if (msg.text().includes('WebSocket connected') || msg.text().includes('socket connected')) {
        wsConnected = true;
      }
    });

    // ACT
    await page.goto('/');
    await page.getByRole('button', { name: /Dev MJ/i }).click();
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Try to access GameBoard
    const gameboardButton = page.getByRole('button', { name: /gameboard|projection/i });

    if (await gameboardButton.isVisible({ timeout: 2000 })) {
      // Listen for new page/popup
      const popupPromise = page.context().waitForEvent('page');
      await gameboardButton.click();

      const popup = await popupPromise;
      await popup.waitForLoadState('networkidle', { timeout: 5000 });

      // Check for WebSocket in Network panel by waiting for stable state
      await popup.waitForTimeout(1500);

      // ASSERT
      expect(wsErrors).toHaveLength(0);

      // Popup should load without redirect to login
      expect(popup.url()).not.toMatch(/login/i);

      await popup.close();
    }
  });

  // ============================================================================
  // TEST 11: ERROR HANDLING - 401 Errors Should Be Minimal
  // ============================================================================

  test('[P0] System should not trigger unnecessary 401 errors', async ({ page }) => {
    // ARRANGE
    const unauthorized401: { url: string; timestamp: number }[] = [];

    page.on('response', response => {
      if (response.status() === 401) {
        unauthorized401.push({
          url: response.url(),
          timestamp: Date.now()
        });
      }
    });

    // ACT: Perform multiple operations
    await page.goto('/');
    await page.getByRole('button', { name: /Dev MJ/i }).click();
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Navigate multiple pages
    await page.goto('/sessions');
    await page.waitForTimeout(500);

    await page.goto('/dashboard');
    await page.waitForTimeout(500);

    // ASSERT
    expect(unauthorized401).toHaveLength(0);
  });

  // ============================================================================
  // TEST 12: RESPONSIVE BEHAVIOR - UI Should React to Auth State
  // ============================================================================

  test('[P0] UI should correctly reflect authentication state', async ({ page }) => {
    // ARRANGE
    // Not authenticated initially
    await page.goto('/');

    // Should show login buttons
    const devMjButton = page.getByRole('button', { name: /Dev MJ/i });
    await expect(devMjButton).toBeVisible({ timeout: 5000 });

    // ACT: Login
    await devMjButton.click();
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // ASSERT: Should show authenticated UI
    // Should NOT show login button anymore
    const loginButton = page.getByRole('button', { name: /login|se connecter/i });
    const isLoginVisible = await loginButton.isVisible({ timeout: 1000 }).catch(() => false);

    if (isLoginVisible) {
      // Filter out "Se déconnecter" (logout) button
      const loginOnlyButtons = await page.locator('button:has-text(/^(?!.*déconnecter).*login|se connecter/)').all();
      expect(loginOnlyButtons).toHaveLength(0);
    }

    // Should show dashboard content
    await expect(page.getByText(/dashboard|session|personnage/i)).toBeVisible({ timeout: 5000 });
  });

});
