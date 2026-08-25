import { expect, test } from '@playwright/test';

const baseURL = process.env.GAMEPLUG_E2E_BASE_URL ?? 'https://game-plug.rbw.ovh';

const actions = [
  { name: 'Invoquer le Gardien', path: '/gm-login' },
  { name: 'Rejoindre la Session', path: '/join' },
] as const;

for (const [index, action] of actions.entries()) {
  test(`${action.name} navigates with a mouse`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('requestfailed', (request) => failedRequests.push(request.url()));

    await page.goto(`${baseURL}/`);
    const link = page.getByRole('link', { name: action.name, exact: true });

    await expect(link).toHaveAttribute('href', action.path);
    await link.click();

    await expect(page).toHaveURL(`${baseURL}${action.path}`);
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });

  test(`${action.name} navigates with the keyboard`, async ({ page }) => {
    await page.goto(`${baseURL}/`);
    const link = page.getByRole('link', { name: action.name, exact: true });

    for (let press = 0; press <= index; press += 1) {
      await page.keyboard.press('Tab');
    }
    await expect(link).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(`${baseURL}${action.path}`);
  });
}

test('landing actions keep native navigation without hydration', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  for (const action of actions) {
    await page.goto(`${baseURL}/`);
    const link = page.getByRole('link', { name: action.name, exact: true });

    await expect(link).toHaveAttribute('href', action.path);
    await link.click();
    await expect(page).toHaveURL(`${baseURL}${action.path}`);
  }

  await context.close();
});
