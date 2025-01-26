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
  test.describe("check filtering todos and pagination working", () => {
    const todoItemSelector = "a.todoItem";
    const nextPageButtonSelector = "span.sr-only:has-text('Next')";
    const itemsPerPageSelector = "select[name='itemsPerPage']";
    const priorityFilterSelector = "select[name='priority']";
    const scopeFilterSelector = "select[name='scope']";
    const isImportantFilterSelector = "select[name='isImportant']";

    test("perform check pagination", async ({ page }) => {
      await expect(page.locator(todoItemSelector)).toHaveCount(3);

      const firstPageItems = await page
        .locator(todoItemSelector)
        .evaluateAll((items) => items.map((item) => item.getAttribute("id")));

      expect(firstPageItems).toHaveLength(3);

      await page.locator(nextPageButtonSelector).click();

      await expect(page.locator(todoItemSelector)).toHaveCount(3);

      const secondPageItems = await page
        .locator(todoItemSelector)
        .evaluateAll((items) => items.map((item) => item.getAttribute("id")));

      expect(secondPageItems).toHaveLength(3);

      expect(firstPageItems).not.toEqual(secondPageItems);
    });

    test("perform check changing itemsPerPage", async ({ page }) => {
      await expect(page.locator(todoItemSelector)).toHaveCount(3);

      const firstPageItems = await page
        .locator(todoItemSelector)
        .evaluateAll((items) => items.map((item) => item.getAttribute("id")));

      await page.locator(nextPageButtonSelector).click();

      await page.locator(itemsPerPageSelector).selectOption("5");

      const currentUrl = new URL(page.url());
      expect(currentUrl.searchParams.has("page")).toBe(false);

      await expect(page.locator(todoItemSelector)).toHaveCount(5);

      const itemsAfterChange = await page
        .locator(todoItemSelector)
        .evaluateAll((items) => items.map((item) => item.getAttribute("id")));

      expect(itemsAfterChange).toHaveLength(5);

      expect(itemsAfterChange).toEqual(expect.arrayContaining(firstPageItems));
    });

    test("perform check changing filters", async ({ page }) => {
      const totalPagesSelector = "[data-test-id='total-pages']";

      const initialTotalPages = await page
        .locator(totalPagesSelector)
        .innerText();
      const initialPages = parseInt(initialTotalPages, 10);

      expect(initialPages).toBeGreaterThan(0);

      // Step 1: Change the priority filter
      await page.locator(priorityFilterSelector).selectOption("medium");
      await page.waitForTimeout(1000); // Wait for the UI to update
      const totalPagesAfterPriority = await page
        .locator(totalPagesSelector)
        .innerText();
      const pagesAfterPriority = parseInt(totalPagesAfterPriority, 10);

      expect(pagesAfterPriority).not.toBe(initialPages);

      // Step 2: Change the scope filter
      await page.locator(scopeFilterSelector).selectOption("forWork");
      await page.waitForTimeout(1000); // Wait for the UI to update
      const totalPagesAfterScope = await page
        .locator(totalPagesSelector)
        .innerText();
      const pagesAfterScope = parseInt(totalPagesAfterScope, 10);

      expect(pagesAfterScope).not.toBe(pagesAfterPriority);

      // Step 3: Change the isImportant filter
      await page.locator(isImportantFilterSelector).selectOption("true");
      await page.waitForTimeout(1000); // Wait for the UI to update
      const totalPagesAfterIsImportant = await page
        .locator(totalPagesSelector)
        .innerText();
      const pagesAfterIsImportant = parseInt(totalPagesAfterIsImportant, 10);

      expect(pagesAfterIsImportant).not.toBe(pagesAfterScope);
    });

    test.only("perform check persistence url with filters", async ({
      page,
    }) => {
      const goToListButtonSelector = "button:has-text('Go to list')";

      // Step 1: Apply filters and check URL
      await page.locator(priorityFilterSelector).selectOption("medium");
      await page.locator(scopeFilterSelector).selectOption("forWork");
      await page.locator(isImportantFilterSelector).selectOption("true");

      const urlWithFilters = page.url();
      expect(urlWithFilters).toContain("priority=medium");
      expect(urlWithFilters).toContain("scope=forWork");
      expect(urlWithFilters).toContain("isImportant=true");

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
      await page.waitForSelector(todoItemSelector);
      expect(page.url()).toContain("priority=medium");
      expect(page.url()).toContain("scope=forWork");
      expect(page.url()).toContain("isImportant=true");

      const itemIdsAfterNavigateBack = await page
        .locator(todoItemSelector)
        .evaluateAll((items) => items.map((item) => item.getAttribute("id")));

      expect(itemIdsAfterNavigateBack).toContain(firstItemId);

      // Step 5: Click on the first item and check URL
      await page.locator(`${todoItemSelector}[id="${firstItemId}"]`).click();
      expect(page.url()).not.toContain("priority");
      expect(page.url()).not.toContain("scope");
      expect(page.url()).not.toContain("isImportant");

      // Step 6: Go back to the list and check URL and items
      await page.locator(goToListButtonSelector).click();
      await page.waitForSelector(todoItemSelector);
      expect(page.url()).toContain("priority=medium");
      expect(page.url()).toContain("scope=forWork");
      expect(page.url()).toContain("isImportant=true");

      const itemIdsAfterGoBack = await page
        .locator(todoItemSelector)
        .evaluateAll((items) => items.map((item) => item.getAttribute("id")));
      expect(itemIdsAfterGoBack).toContain(firstItemId);
    });
  });
});
