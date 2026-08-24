import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'https://game-plug.rbw.ovh';
const DEMO_KEY = process.env.GAMEPLUG_DEMO_AUTH_KEY;
const DEMO_EMAIL = process.env.GAMEPLUG_DEMO_AUTH_EMAIL;
const AUTH_TEST_BASE_URL = process.env.GAMEPLUG_AUTH_TEST_BASE_URL;
const IDOR_CHARACTER_ID = process.env.GAMEPLUG_IDOR_CHARACTER_ID;
const IDOR_EFFECT_ID = process.env.GAMEPLUG_IDOR_EFFECT_ID;

async function authenticateDemo(page: Page) {
  expect(DEMO_KEY, 'GAMEPLUG_DEMO_AUTH_KEY is required for governed demo E2E').toBeTruthy();
  expect(DEMO_EMAIL, 'GAMEPLUG_DEMO_AUTH_EMAIL is required for governed demo E2E').toBeTruthy();
  expect(AUTH_TEST_BASE_URL, 'GAMEPLUG_AUTH_TEST_BASE_URL must target the isolated backend').toBeTruthy();

  const response = await page.request.post(`${AUTH_TEST_BASE_URL}/api/auth/dev-login`, {
    headers: { 'x-gameplug-demo-key': DEMO_KEY! },
    data: { email: 'gm@example.com', userId: '00000000-0000-4000-a000-000000000001' },
  });
  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.user.email).toBe(DEMO_EMAIL);
  expect(body.user.isGM).toBe(false);
  const token = body.access_token as string;
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));
  expect(payload.isGM).toBe(false);
  expect(payload.isDemo).toBe(true);

  await page.context().addCookies([{
    name: 'auth-token',
    value: token,
    domain: 'game-plug.rbw.ovh',
    path: '/',
  }]);
  await page.addInitScript((value) => localStorage.setItem('access_token', value), token);
  return { token, user: body.user, payload };
}

// The governed demo key must never be persisted in a Playwright trace.
test.use({ trace: 'off' });

test.describe('Authentication security and stability', () => {

  test('keeps public dev-login and dev controls fail-closed without the demo key', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByRole('button', { name: /Dev MJ|Dev Joueur|GM Login/i })).toHaveCount(0);

    for (const path of ['/api/auth/dev-login', '/api/v1/auth/dev-login']) {
      const response = await page.request.post(`${BASE_URL}${path}`, {
        data: { email: DEMO_EMAIL || 'demo-e2e@game-plug.invalid' },
      });
      expect(response.status()).toBe(404);
    }
  });

  test('issues only a route-limited, read-only, non-GM demo token', async ({ page }) => {
    const { token } = await authenticateDemo(page);
    expect(IDOR_CHARACTER_ID).toBeTruthy();
    expect(IDOR_EFFECT_ID).toBeTruthy();
    const headers = { Authorization: `Bearer ${token}` };

    const sessions = await page.request.get(`${BASE_URL}/api/sessions`, { headers });
    expect(sessions.status()).toBe(200);
    expect(await sessions.json()).toEqual([]);

    const characters = await page.request.get(`${BASE_URL}/api/characters`, { headers });
    expect(characters.status()).toBe(200);
    expect(await characters.json()).toEqual([]);

    const mutation = await page.request.post(`${BASE_URL}/api/sessions`, {
      headers,
      data: { name: 'forbidden-demo-mutation' },
    });
    expect(mutation.status()).toBe(403);

    const idorCharacterRead = await page.request.get(
      `${BASE_URL}/api/characters/${IDOR_CHARACTER_ID}`,
      { headers },
    );
    expect(idorCharacterRead.status()).toBe(403);

    const characterEffectMutation = await page.request.post(
      `${BASE_URL}/api/characters/${IDOR_CHARACTER_ID}/effects`,
      { headers, data: { type: 'damage', name: 'IDOR', value: '1' } },
    );
    expect(characterEffectMutation.status()).toBe(403);

    const effectCreate = await page.request.post(`${BASE_URL}/api/effects`, {
      headers,
      data: { characterId: IDOR_CHARACTER_ID, type: 'damage', name: 'IDOR' },
    });
    expect(effectCreate.status()).toBe(403);

    const effectUpdate = await page.request.patch(`${BASE_URL}/api/effects/${IDOR_EFFECT_ID}`, {
      headers,
      data: { name: 'IDOR' },
    });
    expect(effectUpdate.status()).toBe(403);

    const adminRead = await page.request.get(`${BASE_URL}/api/admin/config`, { headers });
    expect(adminRead.status()).toBe(403);

    const bearerRefresh = await page.request.post(`${BASE_URL}/api/auth/refresh`, {
      headers,
      data: { refreshToken: token },
    });
    expect(bearerRefresh.status()).toBe(403);

    const refresh = await page.request.post(`${BASE_URL}/api/auth/refresh`, {
      data: { refreshToken: token },
    });
    expect(refresh.status()).toBe(201);
    const refreshedToken = (await refresh.json()).access_token as string;
    const refreshedPayload = JSON.parse(Buffer.from(refreshedToken.split('.')[1], 'base64url').toString('utf8'));
    expect(refreshedPayload.isDemo).toBe(true);
    const refreshedMutation = await page.request.post(`${BASE_URL}/api/sessions`, {
      headers: { Authorization: `Bearer ${refreshedToken}` },
      data: { name: 'still-forbidden-after-refresh' },
    });
    expect(refreshedMutation.status()).toBe(403);
  });

  test('logs in and fetches the demo user without an infinite loop', async ({ page }) => {
    await authenticateDemo(page);
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    expect(page.url()).toContain('/dashboard');

    const logs: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('useAuth:')) logs.push(text);
    });

    await page.reload();
    await page.waitForTimeout(2000);
    expect(logs.length).toBeLessThanOrEqual(3);
  });

  test('handles 401 and clears an invalid token', async ({ page, context }) => {
    await context.addCookies([{
      name: 'auth-token',
      value: 'invalid-token',
      domain: 'game-plug.rbw.ovh',
      path: '/',
    }]);
    await page.addInitScript(() => localStorage.setItem('access_token', 'invalid-token'));

    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForTimeout(2000);
    expect(await page.evaluate(() => localStorage.getItem('access_token'))).toBeNull();
  });

  test('preserves a governed demo token after page reload', async ({ page }) => {
    await authenticateDemo(page);
    await page.goto(`${BASE_URL}/dashboard`);
    const tokenBefore = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(tokenBefore).toBeTruthy();

    await page.reload();
    await page.waitForTimeout(2000);
    expect(await page.evaluate(() => localStorage.getItem('access_token'))).toBe(tokenBefore);
  });

  test('does not refetch demo user data excessively', async ({ page }) => {
    let userFetchCount = 0;
    await page.route('**/api/auth/user', (route) => {
      userFetchCount++;
      route.continue();
    });

    await authenticateDemo(page);
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForTimeout(3000);
    expect(userFetchCount).toBeLessThanOrEqual(2);
  });
});
