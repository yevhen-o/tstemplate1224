import { test, expect } from "@playwright/test";

test.describe("Home page tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("has visible required elements", () => {
    test("has title", async ({ page }) => {
      await expect(page).toHaveTitle("Vite + React + TS");
    });

    test("has right menu items", async ({ page }) => {
      await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Todos" })).toBeVisible();

      await expect(page.getByRole("link", { name: "Dropdowns" })).toBeVisible();

      await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();

      await expect(
        page.getByRole("link", { name: "Organization" })
      ).toHaveCount(0);
    });

    test("display Sign In form", async ({ page }) => {
      await page.getByRole("button", { name: "Sign In" }).click();

      await expect(
        page.getByRole("heading", { name: "Sign in" })
      ).toBeVisible();
    });

    test("display Sign Up form", async ({ page }) => {
      await page.getByRole("button", { name: "Sign Up" }).click();

      await expect(
        page.getByRole("heading", { name: "Sign Up" })
      ).toBeVisible();
    });
  });
  test.describe("can perform Sign Up, Sign In operations", () => {
    test.describe.configure({ mode: "serial" });
    test("perform Sign Up", async ({ page }) => {
      await page.getByRole("button", { name: "Sign Up" }).click();

      await page.locator("[name='firstName']").fill("FirstNameFromAutoTest");
      await page.locator("[name='lastName']").fill("LastNameFromAutoTest");
      await page.locator("[name='email']").fill("email11@auto.test");
      await page.locator("[name='password']").fill("strongPassword123");
      await page.locator("[name='confirmPassword']").fill("strongPassword123");
      await page.locator("[name='age']").fill("22");

      await page.getByTestId("signUp").click();

      await expect(page.getByRole("heading", { name: "Sign Up" })).toHaveCount(
        0
      );
      await expect(page.getByRole("button", { name: "Sign In" })).toHaveCount(
        0
      );
      await expect(page.getByRole("button", { name: "Sign Up" })).toHaveCount(
        0
      );
      await expect(page.getByTestId("user-menu")).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Organization" })
      ).toBeVisible();
    });

    test("perform Sign In", async ({ page }) => {
      await page.getByRole("button", { name: "Sign In" }).click();

      await page.locator("[name='email']").fill("email11@auto.test");
      await page.locator("[name='password']").fill("strongPassword123");

      await page.getByTestId("signIn").click();

      await expect(page.getByRole("heading", { name: "Sign In" })).toHaveCount(
        0
      );
      await expect(page.getByRole("button", { name: "Sign In" })).toHaveCount(
        0
      );
      await expect(page.getByRole("button", { name: "Sign Up" })).toHaveCount(
        0
      );
      await expect(page.getByTestId("user-menu")).toBeVisible();
    });

    test("perform Sign Out", async ({ page }) => {
      await page.getByRole("button", { name: "Sign In" }).click();

      await page.locator("[name='email']").fill("email11@auto.test");
      await page.locator("[name='password']").fill("strongPassword123");

      await page.getByTestId("signIn").click();
      await page.getByTestId("user-menu").click();
      await page.getByTestId("user-menu").click();
      await page.getByRole("button", { name: "Log out" }).click();

      await expect(page.getByTestId("user-menu")).toHaveCount(0);
    });

    test("perform Delete account", async ({ page }) => {
      await page.getByRole("button", { name: "Sign In" }).click();

      await page.locator("[name='email']").fill("email11@auto.test");
      await page.locator("[name='password']").fill("strongPassword123");

      await page.getByTestId("signIn").click();

      await page.getByTestId("user-menu").click();
      await page.getByTestId("user-menu").click();
      await page.getByRole("link", { name: "Settings" }).click();
      await page.getByRole("button", { name: "Delete account" }).click();
      await expect(page.getByTestId("user-menu")).toHaveCount(0);
    });
  });
});
