import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Perform login and save the storage state
  await page.goto(`${baseURL}`);
  await page.getByRole("button", { name: "Sign In" }).click();

  await page.locator("[name='email']").fill("email1@auto.test");
  await page.locator("[name='password']").fill("strongPassword123");

  await page.getByTestId("signIn").click();
  // Ensure login was successful
  await page.getByTestId("user-menu");

  // Save the storage state
  await page.context().storageState({ path: "tests/storage/auth.json" });
  await browser.close();
}

export default globalSetup;
