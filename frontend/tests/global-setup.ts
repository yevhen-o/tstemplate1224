import { FullConfig } from "@playwright/test";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  const response = await fetch(baseURL + "/api/users/login", {
    method: "POST",
    body: JSON.stringify({
      email: process.env.VITE_APP_TEST_USER_EMAIL,
      password: process.env.VITE_APP_TEST_USER_PASSWORD,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const state = await response.json();
  const storageState = {
    ...state,
  };

  await fs.writeFile("tests/storage/auth.json", JSON.stringify(storageState));
}

export default globalSetup;
