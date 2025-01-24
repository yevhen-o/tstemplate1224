import { test, expect } from "@playwright/test";
import { getUrl, IDENTIFIERS } from "../src/services/urlsHelper";

test.describe("Todo page tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getUrl(IDENTIFIERS.TODOS));
  });

  test.describe("can perform add todo, edit todo, delete todo", () => {
    test.describe.configure({ mode: "serial" });

    const defaultTodoTitle = "TodoAutoTest TodoAutoTest TodoAutoTest";
    const modifiedTodoTitle = defaultTodoTitle + " modified";
    test("perform add todo", async ({ page }) => {
      await page.getByRole("button", { name: "Add Todo" }).click();

      await page.locator("[name='title']").fill(defaultTodoTitle);
      await page.locator("[name='deadline']").fill("01/24/2025");

      await page.getByRole("button", { name: "Submit" }).click();
      await page.locator("[name='search']").fill(defaultTodoTitle);

      await expect(
        page.getByRole("link", {
          name: defaultTodoTitle,
        })
      ).toBeVisible();
    });

    test("perform edit todo", async ({ page }) => {
      await page.locator("[name='search']").fill(defaultTodoTitle);

      page
        .getByRole("link", {
          name: defaultTodoTitle,
        })
        .click();
      await page.getByRole("button", { name: "Edit" }).click();
      await page.locator("[name='title']").fill(modifiedTodoTitle);
      await page.locator("[name='deadline']").fill("02/24/2025");

      await page.getByRole("button", { name: "Update" }).click();
      await page.getByRole("button", { name: "Go to list" }).click();
      await page.locator("[name='search']").fill(modifiedTodoTitle);
      await expect(
        page.getByRole("link", {
          name: modifiedTodoTitle,
        })
      ).toBeVisible();
    });

    test("perform delete todo", async ({ page }) => {
      await page.locator("[name='search']").fill(modifiedTodoTitle);
      page
        .getByRole("link", {
          name: modifiedTodoTitle,
        })
        .click();
      await page.getByRole("button", { name: "Delete todo" }).click();
      await page.locator("[name='search']").fill(modifiedTodoTitle);
      await expect(
        page.getByRole("link", {
          name: modifiedTodoTitle,
        })
      ).toHaveCount(0);
    });
  });
});
