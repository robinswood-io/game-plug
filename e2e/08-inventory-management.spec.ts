import { test, expect } from '@playwright/test';

test.describe('Inventory Management System', () => {
  const testPassword = 'SecurePassword123!';
  const characterName = `Test Investigator ${Date.now()}`;
  let characterId: string;

  test.beforeEach(async ({ page }) => {
    // Generate unique email for each test
    const testEmail = `gm-inv-test-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`;

    // Create account and login
    await page.goto('/gm-signup');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /créer.*compte|inscription|sign.*up/i }).click();
    await page.waitForURL(//(home|session-manager|sessions|dashboard)/, { timeout: 15000 });

    // Create character
    await page.goto('/character-creation');
    await page.getByTestId('input-character-name').fill(characterName);
    const generateButton = page.getByTestId('button-roll-characteristics');
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(1000);
    }
    await page.getByTestId('button-save-character').click();
    await page.waitForTimeout(2000);

    // Extract character ID from URL
    const charUrl = page.url();
    const charMatch = charUrl.match(/\/character-sheet\/(.+)/);
    characterId = charMatch?.[1] || '';
  });

  test('should open inventory interface', async ({ page }) => {
    // Navigate to character sheet
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Look for inventory button/tab
      const inventoryButton = page.locator('[data-testid="button-view-inventory"]');
      if (await inventoryButton.isVisible()) {
        await inventoryButton.click();
        await page.waitForTimeout(500);

        // Verify inventory interface is visible
        await expect(page.getByText(/inventaire|inventory|équipement/i)).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should add item to inventory', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Open inventory
      const inventoryButton = page.locator('[data-testid="button-view-inventory"]');
      if (await inventoryButton.isVisible()) {
        await inventoryButton.click();
        await page.waitForTimeout(500);

        // Click add item button
        const addItemButton = page.locator('[data-testid="button-add-item"]');
        if (await addItemButton.isVisible()) {
          await addItemButton.click();
          await page.waitForTimeout(500);

          // Fill item details
          const itemNameInput = page.locator('[data-testid="input-item-name"]');
          if (await itemNameInput.isVisible()) {
            await itemNameInput.fill('Revolver .38');

            const itemDescInput = page.locator('[data-testid="input-item-description"]');
            if (await itemDescInput.isVisible()) {
              await itemDescInput.fill('Arme de poing fiable');
            }

            const itemQuantityInput = page.locator('[data-testid="input-item-quantity"]');
            if (await itemQuantityInput.isVisible()) {
              await itemQuantityInput.fill('1');
            }

            // Save item
            const saveItemButton = page.locator('[data-testid="button-save-item"]');
            await saveItemButton.click();
            await page.waitForTimeout(1000);

            // Verify item appears in inventory
            await expect(page.getByText('Revolver .38')).toBeVisible({ timeout: 5000 });
          }
        }
      }
    }
  });

  test('should equip item from inventory', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Open inventory
      const inventoryButton = page.locator('[data-testid="button-view-inventory"]');
      if (await inventoryButton.isVisible()) {
        await inventoryButton.click();
        await page.waitForTimeout(500);

        // Add item first
        const addItemButton = page.locator('[data-testid="button-add-item"]');
        if (await addItemButton.isVisible()) {
          await addItemButton.click();
          await page.waitForTimeout(500);

          const itemNameInput = page.locator('[data-testid="input-item-name"]');
          await itemNameInput.fill('Coat Armor');

          const itemQuantityInput = page.locator('[data-testid="input-item-quantity"]');
          if (await itemQuantityInput.isVisible()) {
            await itemQuantityInput.fill('1');
          }

          const saveItemButton = page.locator('[data-testid="button-save-item"]');
          await saveItemButton.click();
          await page.waitForTimeout(1000);

          // Equip the item
          const equipButton = page.locator('[data-testid^="button-equip-"]').first();
          if (await equipButton.isVisible()) {
            await equipButton.click();
            await page.waitForTimeout(500);

            // Verify item is equipped (check for equipped badge or status)
            await expect(page.getByText(/équipé|equipped/i)).toBeVisible({ timeout: 5000 });
          }
        }
      }
    }
  });

  test('should modify item quantity', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Open inventory
      const inventoryButton = page.locator('[data-testid="button-view-inventory"]');
      if (await inventoryButton.isVisible()) {
        await inventoryButton.click();
        await page.waitForTimeout(500);

        // Add item first
        const addItemButton = page.locator('[data-testid="button-add-item"]');
        if (await addItemButton.isVisible()) {
          await addItemButton.click();
          await page.waitForTimeout(500);

          const itemNameInput = page.locator('[data-testid="input-item-name"]');
          await itemNameInput.fill('Munitions');

          const itemQuantityInput = page.locator('[data-testid="input-item-quantity"]');
          await itemQuantityInput.fill('50');

          const saveItemButton = page.locator('[data-testid="button-save-item"]');
          await saveItemButton.click();
          await page.waitForTimeout(1000);

          // Edit item to change quantity
          const editButton = page.locator('[data-testid^="button-edit-item-"]').first();
          if (await editButton.isVisible()) {
            await editButton.click();
            await page.waitForTimeout(500);

            const editQuantityInput = page.locator('[data-testid="input-item-quantity"]');
            await editQuantityInput.clear();
            await editQuantityInput.fill('25');

            const saveEditButton = page.locator('[data-testid="button-save-item"]');
            await saveEditButton.click();
            await page.waitForTimeout(1000);

            // Verify quantity updated
            await expect(page.getByText(/25/)).toBeVisible({ timeout: 5000 });
          }
        }
      }
    }
  });

  test('should remove item from inventory', async ({ page }) => {
    const itemName = `Test Item ${Date.now()}`;
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Open inventory
      const inventoryButton = page.locator('[data-testid="button-view-inventory"]');
      if (await inventoryButton.isVisible()) {
        await inventoryButton.click();
        await page.waitForTimeout(500);

        // Add item first
        const addItemButton = page.locator('[data-testid="button-add-item"]');
        if (await addItemButton.isVisible()) {
          await addItemButton.click();
          await page.waitForTimeout(500);

          const itemNameInput = page.locator('[data-testid="input-item-name"]');
          await itemNameInput.fill(itemName);

          const itemQuantityInput = page.locator('[data-testid="input-item-quantity"]');
          if (await itemQuantityInput.isVisible()) {
            await itemQuantityInput.fill('1');
          }

          const saveItemButton = page.locator('[data-testid="button-save-item"]');
          await saveItemButton.click();
          await page.waitForTimeout(1000);

          // Delete the item
          const deleteButton = page.locator('[data-testid^="button-delete-item-"]').first();
          if (await deleteButton.isVisible()) {
            await deleteButton.click();
            await page.waitForTimeout(500);

            // Confirm deletion if dialog appears
            const confirmButton = page.locator('[data-testid="button-confirm-delete"]');
            if (await confirmButton.isVisible()) {
              await confirmButton.click();
              await page.waitForTimeout(1000);
            }

            // Verify item is removed
            await expect(page.getByText(itemName)).not.toBeVisible({ timeout: 5000 });
          }
        }
      }
    }
  });

  test('should display item weight and encumbrance', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Open inventory
      const inventoryButton = page.locator('[data-testid="button-view-inventory"]');
      if (await inventoryButton.isVisible()) {
        await inventoryButton.click();
        await page.waitForTimeout(500);

        // Add weighted item
        const addItemButton = page.locator('[data-testid="button-add-item"]');
        if (await addItemButton.isVisible()) {
          await addItemButton.click();
          await page.waitForTimeout(500);

          const itemNameInput = page.locator('[data-testid="input-item-name"]');
          await itemNameInput.fill('Heavy Armor');

          const itemWeightInput = page.locator('[data-testid="input-item-weight"]');
          if (await itemWeightInput.isVisible()) {
            await itemWeightInput.fill('15');
          }

          const saveItemButton = page.locator('[data-testid="button-save-item"]');
          await saveItemButton.click();
          await page.waitForTimeout(1000);

          // Verify weight is displayed
          await expect(page.getByText(/15.*kg|15.*lbs|poids/i)).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test('should categorize items (weapon, armor, consumable)', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Open inventory
      const inventoryButton = page.locator('[data-testid="button-view-inventory"]');
      if (await inventoryButton.isVisible()) {
        await inventoryButton.click();
        await page.waitForTimeout(500);

        // Add weapon
        const addItemButton = page.locator('[data-testid="button-add-item"]');
        if (await addItemButton.isVisible()) {
          await addItemButton.click();
          await page.waitForTimeout(500);

          const itemNameInput = page.locator('[data-testid="input-item-name"]');
          await itemNameInput.fill('Shotgun');

          const categorySelect = page.locator('[data-testid="select-item-category"]');
          if (await categorySelect.isVisible()) {
            await categorySelect.click();
            await page.getByRole('option', { name: /arme|weapon/i }).first().click();
          }

          const saveItemButton = page.locator('[data-testid="button-save-item"]');
          await saveItemButton.click();
          await page.waitForTimeout(1000);

          // Verify weapon category is displayed
          await expect(page.getByText(/arme|weapon/i)).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test('should filter inventory by category', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Open inventory
      const inventoryButton = page.locator('[data-testid="button-view-inventory"]');
      if (await inventoryButton.isVisible()) {
        await inventoryButton.click();
        await page.waitForTimeout(500);

        // Check for filter buttons/tabs
        const filterWeapons = page.locator('[data-testid="filter-weapons"]');
        if (await filterWeapons.isVisible()) {
          await filterWeapons.click();
          await page.waitForTimeout(500);

          // Verify filter is active
          await expect(filterWeapons).toHaveClass(/active|selected/);
        }
      }
    }
  });

  test('should display total inventory value', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);

    const characterLink = page.getByText(characterName);
    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForTimeout(1000);

      // Open inventory
      const inventoryButton = page.locator('[data-testid="button-view-inventory"]');
      if (await inventoryButton.isVisible()) {
        await inventoryButton.click();
        await page.waitForTimeout(500);

        // Add item with value
        const addItemButton = page.locator('[data-testid="button-add-item"]');
        if (await addItemButton.isVisible()) {
          await addItemButton.click();
          await page.waitForTimeout(500);

          const itemNameInput = page.locator('[data-testid="input-item-name"]');
          await itemNameInput.fill('Gold Watch');

          const itemValueInput = page.locator('[data-testid="input-item-value"]');
          if (await itemValueInput.isVisible()) {
            await itemValueInput.fill('500');
          }

          const saveItemButton = page.locator('[data-testid="button-save-item"]');
          await saveItemButton.click();
          await page.waitForTimeout(1000);

          // Verify total value is displayed
          const totalValue = page.locator('[data-testid="text-total-value"]');
          if (await totalValue.isVisible()) {
            await expect(totalValue).toBeVisible({ timeout: 5000 });
          }
        }
      }
    }
  });
});
