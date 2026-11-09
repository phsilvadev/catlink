import { defineConfig } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    trace: "retain-on-failure",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {},
  },
  webServer: {
    command: `npm start -- --hostname 127.0.0.1 --port ${new URL(process.env.BETTER_AUTH_URL || "http://localhost:3000").port || "3000"}`,
    url: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
    env: {
      S3_ENDPOINT: "http://127.0.0.1:39010",
      S3_REGION: "us-east-1",
      S3_BUCKET: "catlink-test",
      S3_ACCESS_KEY_ID: "test-only",
      S3_SECRET_ACCESS_KEY: "test-only",
    },
  },
});
