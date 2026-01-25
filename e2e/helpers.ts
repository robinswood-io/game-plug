import { Page, expect } from '@playwright/test';

export const BASE_URL = 'https://game-plug.rbw.ovh';

/**
 * Wait for page to load completely with increased timeout
 */
export async function waitForPageLoad(page: Page, url?: string) {
  if (url) {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  }
  await page.waitForLoadState('domcontentloaded', { timeout: 90000 });
  await page.waitForTimeout(1000); // Extra buffer
}

/**
 * Login as GM with robust waiting
 */
export async function loginAsGM(page: Page) {
  await waitForPageLoad(page, BASE_URL);

  // Wait for either login button with generous timeout
  const gmButton = page.locator('button:has-text("Dev MJ")').first();
  await gmButton.waitFor({ state: 'visible', timeout: 90000 });
  await gmButton.click();
  await page.waitForTimeout(3000); // Wait for redirect and token storage

  // Verify we're logged in
  await page.waitForURL(/\/(sessions|dashboard|characters)/, { timeout: 30000 });
}

/**
 * Login as Player with robust waiting
 */
export async function loginAsPlayer(page: Page) {
  await waitForPageLoad(page, BASE_URL);

  const playerButton = page.locator('button:has-text("Dev Joueur")').first();
  await playerButton.waitFor({ state: 'visible', timeout: 90000 });
  await playerButton.click();
  await page.waitForTimeout(3000); // Wait for redirect and token storage

  // Player may end up on join page or character selection
  await page.waitForURL(/\/(join|select-character|characters)/, { timeout: 30000 });
}

/**
 * Navigate to sessions page (GM only)
 */
export async function goToSessions(page: Page) {
  await page.goto(`${BASE_URL}/sessions`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
}

/**
 * Create a new session and return session ID
 */
export async function createSession(page: Page, sessionName?: string): Promise<string | null> {
  await goToSessions(page);

  const createButton = page.locator('button[data-testid="button-create-session"]');

  if (await createButton.count() === 0) {
    console.log('⚠️ Create session button not found');
    return null;
  }

  await createButton.click({ timeout: 30000 });
  await page.waitForTimeout(1000);

  const nameInput = page.locator('input[data-testid="input-session-name"]');
  await nameInput.fill(sessionName || `Test Session ${Date.now()}`);

  const confirmButton = page.locator('button[data-testid="button-confirm-create"]');
  await confirmButton.click();
  await page.waitForTimeout(3000);

  // Extract session ID from URL
  const url = page.url();
  const match = url.match(/\/sessions\/([a-f0-9-]+)/);
  return match ? match[1] : null;
}

/**
 * Check if element exists with timeout
 */
export async function elementExists(page: Page, selector: string, timeout: number = 5000): Promise<boolean> {
  try {
    await page.locator(selector).first().waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Safe click - wait for element and click
 */
export async function safeClick(page: Page, selector: string, timeout: number = 30000) {
  const element = page.locator(selector).first();
  await element.waitFor({ state: 'visible', timeout });
  await element.click();
}

/**
 * Log test info
 */
export function logTestInfo(testName: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  const prefix = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }[type];

  console.log(`${prefix} ${testName}: ${message}`);
}
