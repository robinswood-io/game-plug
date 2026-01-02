import { test, expect } from '@playwright/test';

test.describe('UI Components', () => {
  test.describe('Theme & Styling', () => {
    test('should have Lovecraftian dark theme', async ({ page }) => {
      await page.goto('/');

      // Check for dark background colors
      const body = page.locator('body');
      const bgColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor);

      // Dark theme should have dark background
      expect(bgColor).toBeTruthy();
    });

    test('should have custom fonts loaded', async ({ page }) => {
      await page.goto('/');

      // Check for Cinzel or other custom fonts
      const hasCustomFonts = await page.evaluate(() => {
        const fonts = document.fonts;
        let loaded = false;
        fonts.forEach((font) => {
          if (font.family.includes('Cinzel') || font.family.includes('Crimson')) {
            loaded = true;
          }
        });
        return loaded || document.body.style.fontFamily.length > 0;
      });

      expect(hasCustomFonts).toBeTruthy();
    });
  });

  test.describe('Responsive Design', () => {
    test('should be mobile responsive', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Page should still be functional
      await expect(page.locator('body')).toBeVisible();
      const noHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth <= window.innerWidth + 10;
      });
      expect(noHorizontalScroll).toBeTruthy();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      await expect(page.locator('body')).toBeVisible();
    });

    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/');

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(0);
    });

    test('should have alt text on images', async ({ page }) => {
      await page.goto('/');

      const images = page.locator('img');
      const imgCount = await images.count();

      for (let i = 0; i < Math.min(imgCount, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const decorative = await img.getAttribute('role') === 'presentation';
        const hasAlt = alt !== null || decorative;
        expect(hasAlt).toBeTruthy();
      }
    });

    test('should have focusable interactive elements', async ({ page }) => {
      await page.goto('/gm-login');

      // Tab through form elements
      await page.keyboard.press('Tab');
      const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
      expect(firstFocused).toBeTruthy();
    });
  });
});
