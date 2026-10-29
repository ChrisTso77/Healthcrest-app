import { defineConfig, devices } from '@playwright/test';

// A focused engine-compatibility suite; the main Chromium regression suite is unchanged.
export default defineConfig({
  testDir: '.',
  testMatch: /browser-compatibility\.e2e\.spec\.ts/,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [['html', { open: 'never', outputFolder: 'playwright-compatibility-report' }], ['list']]
    : 'list',
  outputDir: 'test-results/compatibility',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
