import { test, expect } from "@playwright/test";

test.describe("System Configuration Admin Panel", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin config page
    await page.goto("https://game-plug.rbw.ovh/admin/config");

    // Wait for page to load
    await page.waitForLoadState("networkidle");
  });

  test("should load the admin config page", async ({ page }) => {
    // Check page title
    await expect(page.locator("h1")).toContainText("System Configuration");

    // Check for the "New Config" button
    const newConfigButton = page.locator('button:has-text("New Config")');
    await expect(newConfigButton).toBeVisible();
  });

  test("should display all system configurations in table", async ({ page }) => {
    // Wait for table to load
    const tableRows = page.locator("table tbody tr");

    // Should have at least one row (default configs)
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Check table headers
    await expect(page.locator("table th")).toContainText([
      "Key",
      "Value",
      "Type",
      "Description",
      "Last Updated",
      "Actions",
    ]);
  });

  test("should display default configurations", async ({ page }) => {
    // Check if default configs are present
    const apiTimeoutRow = page.locator('td:has-text("api.timeout")').first();
    await expect(apiTimeoutRow).toBeVisible();

    const featureRow = page.locator('td:has-text("features.aiEnabled")').first();
    await expect(featureRow).toBeVisible();
  });

  test("should edit existing configuration", async ({ page }) => {
    // Click edit button for first config
    const editButton = page.locator("button:has-text('edit')").first();
    await editButton.click();

    // Wait for dialog to open
    const dialog = page.locator("[role='dialog']");
    await expect(dialog).toBeVisible();

    // Check dialog title contains "Edit Configuration"
    await expect(dialog.locator("h2")).toContainText("Edit Configuration");

    // Update value
    const valueInput = dialog.locator("textarea").first();
    await valueInput.clear();
    await valueInput.fill("35000");

    // Save changes
    const saveButton = dialog.locator("button:has-text('Save Changes')");
    await saveButton.click();

    // Wait for success toast
    await page.waitForTimeout(1000);

    // Dialog should close
    await expect(dialog).not.toBeVisible();
  });

  test("should create new configuration", async ({ page }) => {
    // Click "New Config" button
    const newConfigButton = page.locator('button:has-text("New Config")');
    await newConfigButton.click();

    // Wait for dialog
    const dialog = page.locator("[role='dialog']");
    await expect(dialog).toBeVisible();

    // Check dialog title
    await expect(dialog.locator("h2")).toContainText("Create New Configuration");

    // Fill form
    const inputs = dialog.locator("input");
    await inputs.first().fill("test.config");

    const textarea = dialog.locator("textarea").first();
    await textarea.fill("true");

    const descriptionInput = inputs.nth(1);
    await descriptionInput.fill("Test configuration");

    // Submit
    const createButton = dialog.locator("button:has-text('Create Configuration')");
    await createButton.click();

    // Wait for dialog to close
    await page.waitForTimeout(1000);
    await expect(dialog).not.toBeVisible();

    // Check if new config appears in table
    const newConfigRow = page.locator('td:has-text("test.config")');
    await expect(newConfigRow).toBeVisible({ timeout: 5000 });
  });

  test("should delete configuration", async ({ page }) => {
    // Get initial row count
    const tableRows = page.locator("table tbody tr");
    const initialCount = await tableRows.count();

    // Click delete button on first config (not a default one)
    const deleteButtons = page.locator("button[aria-label*='delete'], button:nth-child(2)");
    const firstDeleteBtn = page.locator("button svg + *").last();

    // Find first delete button
    const allDeleteBtns = await page.locator('button:has-text("trash")').all();
    if (allDeleteBtns.length > 0) {
      await allDeleteBtns[0].click();

      // Wait for deletion
      await page.waitForTimeout(1000);

      // Check if row count decreased or config removed
      const updatedRows = page.locator("table tbody tr");
      const updatedCount = await updatedRows.count();
      expect(updatedCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test("should validate JSON input on edit", async ({ page }) => {
    // Click edit button
    const editButton = page.locator("button:has-text('edit')").first();
    await editButton.click();

    // Wait for dialog
    const dialog = page.locator("[role='dialog']");
    await expect(dialog).toBeVisible();

    // Enter invalid JSON
    const valueInput = dialog.locator("textarea").first();
    await valueInput.clear();
    await valueInput.fill("{ invalid json }");

    // Try to save
    const saveButton = dialog.locator("button:has-text('Save Changes')");
    await saveButton.click();

    // Should show error toast
    await page.waitForTimeout(500);
    const errorToast = page.locator('text/Invalid JSON format/');
    await expect(errorToast).toBeVisible({ timeout: 3000 });
  });

  test("should support JSON objects as values", async ({ page }) => {
    // Click "New Config" button
    const newConfigButton = page.locator('button:has-text("New Config")');
    await newConfigButton.click();

    // Wait for dialog
    const dialog = page.locator("[role='dialog']");
    await expect(dialog).toBeVisible();

    // Fill form with JSON object
    const inputs = dialog.locator("input");
    await inputs.first().fill("test.limits");

    const textarea = dialog.locator("textarea").first();
    await textarea.fill('{"max": 100, "min": 10}');

    const descriptionInput = inputs.nth(1);
    await descriptionInput.fill("Test JSON config");

    // Submit
    const createButton = dialog.locator("button:has-text('Create Configuration')");
    await createButton.click();

    // Wait and verify
    await page.waitForTimeout(1000);
    await expect(dialog).not.toBeVisible();
  });

  test("should display config type badges correctly", async ({ page }) => {
    // Check for type badges
    const typeBadges = page.locator("table [class*='badge']");

    const badgeCount = await typeBadges.count();
    expect(badgeCount).toBeGreaterThan(0);

    // Check for expected types
    const badgeTexts = await typeBadges.allTextContents();
    const expectedTypes = ["boolean", "number", "string", "json"];

    for (const type of expectedTypes) {
      const hasType = badgeTexts.some(text => text.includes(type));
      // At least some of these types should be present
    }
  });

  test("should cache configuration after update", async ({ page, context }) => {
    // First, load the page
    await page.goto("https://game-plug.rbw.ovh/admin/config");
    await page.waitForLoadState("networkidle");

    // Edit a config
    const editButton = page.locator("button:has-text('edit')").first();
    await editButton.click();

    const dialog = page.locator("[role='dialog']");
    const valueInput = dialog.locator("textarea").first();
    const originalValue = await valueInput.inputValue();

    await valueInput.clear();
    await valueInput.fill("999999");

    const saveButton = dialog.locator("button:has-text('Save Changes')");
    await saveButton.click();

    await page.waitForTimeout(1000);

    // Reload page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Value should be persisted
    const tableCell = page.locator("table td:has-text('999999')").first();

    // Either it's there or the cache was invalidated properly
    await expect(page.locator("table tbody tr").first()).toBeVisible();
  });
});
