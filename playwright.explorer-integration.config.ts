import { defineConfig, devices } from "@playwright/test";
process.env.HEALTHCREST_EXPLORER_PUBLIC = "1";
export default defineConfig({
  testDir: "./e2e",
  testMatch: /explorer-(v2|integration)\.spec\.ts/,
  workers: 1,
  retries: 0,
  timeout: 45000,
  outputDir: "test-results/explorer-integration",
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3220",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: process.env.HEALTHCREST_CHROMIUM_PATH
          ? { executablePath: process.env.HEALTHCREST_CHROMIUM_PATH }
          : {},
      },
    },
  ],
  webServer: {
    command:
      "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3220",
    url: "http://127.0.0.1:3220",
    env: {
      VERCEL_ENV: "production",
      VERCEL: "1",
      HEALTHCREST_EDITORIAL_PREVIEW: "",
      VERCEL_GIT_COMMIT_REF: "main",
    },
  },
});
