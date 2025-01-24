import { test, expect } from "@playwright/test";
import { getUrl, IDENTIFIERS } from "../src/services/urlsHelper";

test.describe("Organization page tests", () => {
  test.describe("Un authorized page tests", () => {
    test("show 404 page", async ({ page }) => {
      await page.goto(getUrl(IDENTIFIERS.ORGANIZATION_LIST));
      await expect(
        page.getByRole("link", { name: "Go Home Page" })
      ).toBeVisible();
    });
  });

  test.describe("Authorized page tests", () => {
    test.describe.configure({ mode: "serial" });
    test.beforeEach(async ({ page }) => {
      await page.goto(getUrl(IDENTIFIERS.ORGANIZATION_LIST));
      await page.route("**/init", (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          path: "tests/storage/auth.json",
        });
      });
    });

    test("has visible required elements", async ({ page }) => {
      await expect(
        page.getByRole("link", { name: "Organization" })
      ).toBeVisible();
    });

    test("can create new organization", async ({ page }) => {
      await page
        .getByRole("button", { name: "Create new organization" })
        .click();

      await page.locator("[name='name']").fill("Test Uniq org name");
      await page.locator("[name='domain']").fill("autoTestDomain");

      await page.getByRole("button", { name: "Submit" }).click();

      await expect(
        page.getByRole("link", { name: "autoTestDomain" })
      ).toBeVisible();
    });

    test("new domain exist in next test", async ({ page }) => {
      await expect(
        page.getByRole("link", { name: "autoTestDomain" })
      ).toBeVisible();
    });

    test("can navigate and delete existing organization", async ({ page }) => {
      await page.getByRole("link", { name: "autoTestDomain" }).click();
      await page.getByRole("button", { name: "Delete organization" }).click();
      await page.waitForURL(getUrl(IDENTIFIERS.ORGANIZATION_LIST));
      await expect(
        page.getByRole("link", { name: "autoTestDomain" })
      ).toHaveCount(0);
    });
  });
});
