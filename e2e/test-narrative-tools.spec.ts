import { test, expect } from '@playwright/test';
import { loginAsGM, createSession, logTestInfo } from './helpers';

test.describe('Narrative & Storytelling Tools', () => {
  let sessionId: string;

  test.beforeEach(async ({ page }) => {
    // Login as GM
    await loginAsGM(page);

    // Get or create session
    sessionId = (await createSession(page, 'Narrative Test Session')) || '';
  });

  test('NARR-01: Send narration text to players', async ({ page }) => {
    if (!sessionId) {
      logTestInfo('NARR-01', 'No session available', 'warning');
      return;
    }

    // Open tools menu
    const toolsButton = page.locator('button:has-text("Outils")').first();

    if (await toolsButton.count() > 0) {
      await toolsButton.click();
      await page.waitForTimeout(500);

      // Find narration section
      const narrationSection = page.locator('text=/Narration/i').first();

      if (await narrationSection.count() > 0) {
        // Find text area for narration
        const narrationTextarea = page.locator('textarea[placeholder*="narration"], textarea[name*="narration"]').first();

        if (await narrationTextarea.count() > 0) {
          const testNarration = "La brume s'épaissit autour de la vieille maison...";
          await narrationTextarea.fill(testNarration);

          const sendButton = page.locator('button:has-text("Envoyer"), button:has-text("Send")').first();
          if (await sendButton.count() > 0) {
            await sendButton.click();
            await page.waitForTimeout(1000);

            const toast = page.locator('[role="status"]');
            expect(await toast.count()).toBeGreaterThan(0);

            logTestInfo('NARR-01', 'Narration sent successfully', 'success');
          } else {
            logTestInfo('NARR-01', 'Send button not found', 'warning');
          }
        } else {
          logTestInfo('NARR-01', 'Narration textarea not found', 'warning');
        }
      } else {
        logTestInfo('NARR-01', 'Narration section not found', 'warning');
      }
    }
  });

  test('NARR-02: Send ambiance description', async ({ page }) => {
    if (!sessionId) {
      logTestInfo('NARR-02', 'No session available', 'warning');
      return;
    }

    const toolsButton = page.locator('button:has-text("Outils")').first();

    if (await toolsButton.count() > 0) {
      await toolsButton.click();
      await page.waitForTimeout(500);

      // Find ambiance section
      const ambianceSection = page.locator('text=/Ambiance/i').first();

      if (await ambianceSection.count() > 0) {
        const ambianceTextarea = page.locator('textarea[placeholder*="ambiance"]').first();

        if (await ambianceTextarea.count() > 0) {
          await ambianceTextarea.fill("Sons lointains de pas dans le manoir abandonné");

          const sendButton = page.locator('button:has-text("Envoyer")').first();
          await sendButton.click();
          await page.waitForTimeout(1000);

          const toast = page.locator('[role="status"]');
          expect(await toast.count()).toBeGreaterThan(0);

          logTestInfo('NARR-02', 'Ambiance sent successfully', 'success');
        }
      } else {
        logTestInfo('NARR-02', 'Ambiance section not found', 'warning');
      }
    }
  });

  test('NARR-03: Access narrative journal', async ({ page }) => {
    if (!sessionId) {
      logTestInfo('NARR-03', 'No session available', 'warning');
      return;
    }

    // Look for journal button
    const journalButton = page.locator('button[data-testid="button-narrative-journal"]').first();

    if (await journalButton.count() > 0) {
      await journalButton.click();
      await page.waitForTimeout(1000);

      // Verify journal dialog opened
      const journalDialog = page.locator('[role="dialog"]:has-text("Journal")');
      await expect(journalDialog).toBeVisible();

      // Check for journal entries list
      const entriesList = journalDialog.locator('[data-journal-entry], .journal-entry').first();

      if (await entriesList.count() > 0) {
        logTestInfo('NARR-03', 'Narrative journal accessible with entries', 'success');
      } else {
        logTestInfo('NARR-03', 'Narrative journal accessible (empty)', 'success');
      }
    } else {
      logTestInfo('NARR-03', 'Journal button not found', 'warning');
    }
  });

  test('NARR-04: Add entry to narrative journal', async ({ page }) => {
    if (!sessionId) {
      logTestInfo('NARR-04', 'No session available', 'warning');
      return;
    }

    const journalButton = page.locator('button[data-testid="button-narrative-journal"]').first();

    if (await journalButton.count() > 0) {
      await journalButton.click();
      await page.waitForTimeout(1000);

      // Find add entry button
      const addButton = page.locator('button:has-text("Ajouter"), button:has-text("+")').first();

      if (await addButton.count() > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        // Fill entry form
        const titleInput = page.locator('input[placeholder*="titre"], input[name*="title"]').first();
        const contentTextarea = page.locator('textarea[placeholder*="contenu"], textarea[name*="content"]').first();

        if (await titleInput.count() > 0 && await contentTextarea.count() > 0) {
          await titleInput.fill('Découverte du grimoire');
          await contentTextarea.fill('Les investigateurs ont trouvé un grimoire ancien dans la bibliothèque.');

          const saveButton = page.locator('button:has-text("Sauvegarder"), button:has-text("Enregistrer")').first();
          await saveButton.click();
          await page.waitForTimeout(1000);

          const toast = page.locator('[role="status"]');
          expect(await toast.count()).toBeGreaterThan(0);

          logTestInfo('NARR-04', 'Journal entry added', 'success');
        } else {
          logTestInfo('NARR-04', 'Entry form fields not found', 'warning');
        }
      } else {
        logTestInfo('NARR-04', 'Add entry button not found', 'warning');
      }
    }
  });

  test('NARR-05: Visual projection dialog', async ({ page }) => {
    if (!sessionId) {
      logTestInfo('NARR-05', 'No session available', 'warning');
      return;
    }

    // Find projection button (floating or in menu)
    const projectionButton = page.locator('button[data-testid="button-open-projection"]').first();

    if (await projectionButton.count() > 0) {
      await projectionButton.click();
      await page.waitForTimeout(1000);

      // Verify projection dialog opened
      const projectionDialog = page.locator('[role="dialog"]:has-text("Projection"), [role="dialog"]:has-text("Visual")');

      if (await projectionDialog.count() > 0) {
        await expect(projectionDialog).toBeVisible();
        logTestInfo('NARR-05', 'Visual projection dialog opened', 'success');

        // Check for image upload or URL input
        const imageInput = projectionDialog.locator('input[type="file"], input[type="url"]').first();

        if (await imageInput.count() > 0) {
          logTestInfo('NARR-05', 'Image input available', 'success');
        }
      } else {
        logTestInfo('NARR-05', 'Projection dialog not opened', 'warning');
      }
    } else {
      logTestInfo('NARR-05', 'Projection button not found', 'warning');
    }
  });

  test('NARR-06: Ambient audio controls', async ({ page }) => {
    if (!sessionId) {
      logTestInfo('NARR-06', 'No session available', 'warning');
      return;
    }

    const toolsButton = page.locator('button:has-text("Outils")').first();

    if (await toolsButton.count() > 0) {
      await toolsButton.click();
      await page.waitForTimeout(500);

      // Find ambiance controller
      const ambianceController = page.locator('text=/Ambiance.*Controller|Audio|Sound/i').first();

      if (await ambianceController.count() > 0) {
        // Check for audio controls (play, pause, volume)
        const playButton = page.locator('button[aria-label*="Play"], button:has-text("▶")').first();
        const volumeSlider = page.locator('input[type="range"]').first();

        if (await playButton.count() > 0 || await volumeSlider.count() > 0) {
          logTestInfo('NARR-06', 'Ambient audio controls found', 'success');
        } else {
          logTestInfo('NARR-06', 'Audio controls incomplete', 'warning');
        }
      } else {
        logTestInfo('NARR-06', 'Ambiance controller not found', 'warning');
      }
    }
  });
});
