import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', testMatch: /education-library\.spec\.ts/,
  workers: 1, retries: 0, timeout: 45_000, outputDir: 'test-results-education',
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'retain-on-failure', screenshot: 'only-on-failure',
  },
  projects: process.env.HEALTHCREST_EDUCATION_COMPATIBILITY === '1'
    ? [{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }, { name: 'webkit', use: { ...devices['Desktop Safari'] } }]
    : [{ name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: process.env.HEALTHCREST_CHROMIUM_PATH ? { executablePath: process.env.HEALTHCREST_CHROMIUM_PATH } : {} } }],
  webServer: [
    {
      command: 'node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100',
      url: 'http://127.0.0.1:3100', reuseExistingServer: false,
      // Local synthetic review server only; never a hosted preview or deploy.
      env: { HEALTHCREST_EDITORIAL_PREVIEW: '1', VERCEL_ENV: '', VERCEL: '', CI: '' },
    },
    {
      command: 'node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3101',
      url: 'http://127.0.0.1:3101', reuseExistingServer: false,
      env: { HEALTHCREST_EDITORIAL_PREVIEW: '1', VERCEL_ENV: 'production' },
    },
  ],
});
