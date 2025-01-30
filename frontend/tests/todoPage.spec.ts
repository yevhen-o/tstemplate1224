import { test, expect } from "@playwright/test";
import { getUrl, IDENTIFIERS } from "../src/services/urlsHelper";

const defaultTodoTitle = "TodoAutoTest TodoAutoTest TodoAutoTest";
const modifiedTodoTitle = defaultTodoTitle + " modified";

test.describe("Todo page tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getUrl(IDENTIFIERS.TODOS), { waitUntil: "networkidle" });
  });

  test.describe("can perform add todo, edit todo, delete todo", () => {
    test.describe.configure({ mode: "serial" });

    test("perform add todo", async ({ page }) => {
      await page.getByRole("button", { name: "Add Todo" }).click();

      await page.locator("[name='title']").fill(defaultTodoTitle);
      await page.locator("[name='deadline']").fill("01/24/2025");

      await page.getByRole("button", { name: "Submit" }).click();
      await page.locator("[name='search']").fill(defaultTodoTitle);

      await expect(
        page.getByRole("link", { name: defaultTodoTitle }).first()
      ).toBeVisible();
    });

    test("perform edit todo", async ({ page }) => {
      await page.locator("[name='search']").fill(defaultTodoTitle);

      await expect(async () => {
        page
          .getByRole("link", {
            name: defaultTodoTitle,
          })
          .first()
          .click();
        await page.getByRole("button", { name: "Edit" }).click();
        await page.locator("[name='deadline']").fill("Sat Feb 01 2025");
        await page.locator("[name='title']").fill(modifiedTodoTitle);
        await page.locator("[name='priority']").selectOption("low");

        await page.getByRole("button", { name: "Update" }).click();
        await page.getByRole("button", { name: "Go to list" }).click();
        await page.locator("[name='search']").fill(modifiedTodoTitle);
        await expect(
          page
            .getByRole("link", {
              name: modifiedTodoTitle,
            })
            .first()
        ).toBeVisible();
      }).toPass();
    });

    test("perform delete todo", async ({ page }) => {
      await expect(async () => {
        await page.locator("[name='search']").fill(defaultTodoTitle);
        const todoItem = page.getByRole("link", { name: defaultTodoTitle });
        await todoItem.first().click();

        await page.getByRole("button", { name: "Delete todo" }).click();
        await page.locator("[name='search']").fill(defaultTodoTitle);
        await expect(
          page.getByRole("link", {
            name: defaultTodoTitle,
          })
        ).toHaveCount(0);
      }).toPass();
    });
  });
  test.describe("check filtering todos and pagination working", () => {
    const todoItemSelector = "a.todoItem";
    const nextPageButtonSelector = "span.sr-only:has-text('Next')";
    const itemsPerPageSelector = "select[name='itemsPerPage']";
    const priorityFilterSelector = "select[name='priority']";
    const scopeFilterSelector = "select[name='scope']";
    const isImportantFilterSelector = "select[name='isImportant']";
    const totalItemsSelector = "[data-testid='total-items']";

    test("perform check pagination", async ({ page }) => {
      await expect(page.locator(todoItemSelector)).toHaveCount(3);

      const firstPageItems = await page
        .locator(todoItemSelector)
        .evaluateAll((items) => items.map((item) => item.getAttribute("id")));

      await expect(async () => {
        expect(firstPageItems).toHaveLength(3);

        await page.locator(nextPageButtonSelector).click();

        const secondPageItems = await page
          .locator(todoItemSelector)
          .evaluateAll((items) => items.map((item) => item.getAttribute("id")));

        expect(secondPageItems).toHaveLength(3);

        expect(firstPageItems).not.toEqual(secondPageItems);
      }).toPass();
    });

    test("perform check changing itemsPerPage", async ({ page }) => {
      const firstPageItems = await page
        .locator(todoItemSelector)
        .evaluateAll((items) => items.map((item) => item.getAttribute("id")));

      await page.locator(nextPageButtonSelector).click();
      await expect(async () => {
        await page.locator(itemsPerPageSelector).selectOption("5");
        const currentUrl = new URL(page.url());
        expect(currentUrl.searchParams.has("page")).toBe(false);
        expect(currentUrl.searchParams.get("perPage") === "5").toBe(true);
        await expect(page.locator(todoItemSelector)).toHaveCount(5);
      }).toPass();

      const itemsAfterChange = await page
        .locator(todoItemSelector)
        .evaluateAll((items) => items.map((item) => item.getAttribute("id")));

      expect(itemsAfterChange).toHaveLength(5);

      expect(itemsAfterChange).toEqual(expect.arrayContaining(firstPageItems));
    });

    test("perform check changing filters", async ({ page }) => {
      await expect(page.locator(todoItemSelector)).toHaveCount(3);
      const initialTotalItems = await page
        .locator(totalItemsSelector)
        .innerText();

      expect(+initialTotalItems).toBeGreaterThan(0);

      // Step 1: Change the priority filter
      await page.locator(priorityFilterSelector).selectOption("medium");
      let totalItemsAfterPriority = "0";
      await expect(async () => {
        totalItemsAfterPriority = await page
          .locator(totalItemsSelector)
          .innerText();

        expect(+totalItemsAfterPriority).not.toBe(+initialTotalItems);
      }).toPass();

      // Step 2: Change the scope filter
      await page.locator(scopeFilterSelector).selectOption("forWork");
      let totalItemsAfterScope = "0";
      await expect(async () => {
        totalItemsAfterScope = await page
          .locator(totalItemsSelector)
          .innerText();

        expect(+totalItemsAfterScope).not.toBe(+totalItemsAfterPriority);
      }).toPass();

      // Step 3: Change the isImportant filter
      await page.locator(isImportantFilterSelector).selectOption("true");

      await expect(async () => {
        const totalItemsAfterIsImportant = await page
          .locator(totalItemsSelector)
          .innerText();

        expect(+totalItemsAfterIsImportant).not.toBe(+totalItemsAfterScope);
      }).toPass();
    });

    test("perform check persistence url with filters", async ({ page }) => {
      const goToListButtonSelector = "button:has-text('Go to list')";
      const initialTotalItems = await page
        .locator(totalItemsSelector)
        .innerText();

      expect(+initialTotalItems).toBeGreaterThan(0);

      // Step 1: Apply filters and check URL
      await page.goto(
        getUrl(IDENTIFIERS.TODOS, {
          priority: "medium",
          isImportant: true,
          scope: "forWork",
        })
      );

      await expect(async () => {
        const totalItemsAfterFilter = await page
          .locator(totalItemsSelector)
          .innerText();

        expect(+totalItemsAfterFilter).not.toBe(+initialTotalItems);
      }).toPass();
      await page.waitForTimeout(500);
      // Step 2: Store the ID of the first item on the list
      const firstItemId = await page
        .locator(todoItemSelector)
        .first()
        .getAttribute("id");
      expect(firstItemId).not.toBeNull();

      // Step 3: Navigate to Home and check URL
      await page.getByRole("link", { name: "Home" }).click();
      expect(page.url()).not.toContain("priority");
      expect(page.url()).not.toContain("scope");
      expect(page.url()).not.toContain("isImportant");

      // Step 4: Navigate back to Todos and check URL and items
      await page.getByRole("link", { name: "Todos" }).click();
      await page.waitForURL(
        (url) => url.searchParams.get("priority") === "medium"
      );
      expect(page.url()).toContain("priority=medium");
      expect(page.url()).toContain("scope=forWork");
      expect(page.url()).toContain("isImportant=true");
      await expect(async () => {
        const itemIdsAfterNavigateBack = await page
          .locator(todoItemSelector)
          .evaluateAll((items) => items.map((item) => item.getAttribute("id")));
        expect(itemIdsAfterNavigateBack).toContain(firstItemId);
      }).toPass();

      // Step 5: Click on the first item and check URL
      await expect(async () => {
        await page.locator(`${todoItemSelector}[id="${firstItemId}"]`).click();
        expect(page.url()).not.toContain("priority");
        expect(page.url()).not.toContain("scope");
        expect(page.url()).not.toContain("isImportant");
      }).toPass();

      // Step 6: Go back to the list and check URL and items
      await page.locator(goToListButtonSelector).click();
      await page.waitForURL(
        (url) => url.searchParams.get("priority") === "medium"
      );
      expect(page.url()).toContain("priority=medium");
      expect(page.url()).toContain("scope=forWork");
      expect(page.url()).toContain("isImportant=true");

      await expect(async () => {
        const itemIdsAfterGoBack = await page
          .locator(todoItemSelector)
          .evaluateAll((items) => items.map((item) => item.getAttribute("id")));
        expect(itemIdsAfterGoBack).toContain(firstItemId);
      }).toPass();
    });
  });
});
