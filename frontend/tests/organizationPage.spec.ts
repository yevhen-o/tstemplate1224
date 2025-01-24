import { test, expect } from "@playwright/test";

test.use({ storageState: "tests/storage/auth.json" });

test.describe("Organization page tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/organizations");
  });

  test.describe("has visible required elements", () => {
    test("has title", async ({ page }) => {
      await expect(page).toHaveTitle("Vite + React + TS");
    });

    test("has right menu items", async ({ page }) => {
      await expect(page.getByRole("link", { name: "Todos" })).toBeVisible();

      await expect(page.getByRole("link", { name: "Dropdowns" })).toBeVisible();

      await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();

      await expect(
        page.getByRole("link", { name: "Organization" })
      ).toHaveCount(0);
    });
  });
});
