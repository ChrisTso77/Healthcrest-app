import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  testMatch: /explorer-v2\.spec\.ts/,
  workers: 1,
  retries: 0,
  timeout: 45000,
  outputDir: "test-results/explorer-v2",
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3210",
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
  webServer: [
    {
      command:
        "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3213",
      url: "http://127.0.0.1:3213",
      env: {
        HEALTHCREST_EDITORIAL_PREVIEW: "",
        VERCEL: "1",
        VERCEL_ENV: "preview",
        VERCEL_GIT_COMMIT_REF: "codex/healthcrest-explorer-v2-prototype",
      },
    },
    {
      command:
        "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3210",
      url: "http://127.0.0.1:3210",
      env: {
        HEALTHCREST_EDITORIAL_PREVIEW: "1",
        VERCEL_ENV: "",
        VERCEL: "",
        CI: "",
      },
    },
    {
      command:
        "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3211",
      url: "http://127.0.0.1:3211",
      env: {
        HEALTHCREST_EDITORIAL_PREVIEW: "1",
        VERCEL: "1",
        VERCEL_ENV: "production",
        VERCEL_GIT_COMMIT_REF: "codex/healthcrest-explorer-v2-prototype",
      },
    },
    {
      command:
        "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3212",
      url: "http://127.0.0.1:3212",
      env: {
        HEALTHCREST_EDITORIAL_PREVIEW: "",
        VERCEL_ENV: "",
        VERCEL: "",
        CI: "",
      },
    },
  ],
});
