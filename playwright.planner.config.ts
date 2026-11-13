import { defineConfig } from '@playwright/test';
import { readFileSync } from 'node:fs';
import base from './playwright.config';
export default defineConfig({
  ...base, retries: 0, workers: 2, timeout: 30000, maxFailures: 0,
  grep: process.env.PLANNER_PENDING_FILE ? new RegExp(JSON.parse(readFileSync(process.env.PLANNER_PENDING_FILE,'utf8')).map((s: string) => Array.from(s).map(c => /[a-zA-Z0-9 ]/.test(c) ? c : '\\' + c).join('')).join('|')) : undefined,
  reporter: [['list'], ['json', { outputFile: process.env.PLANNER_REPORT || '/tmp/phase142-playwright-results.json' }]],
  webServer: undefined,
  use: { ...base.use, baseURL: process.env.PLANNER_TEST_BASE_URL || 'http://localhost:3023', video: 'off', launchOptions: { executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] } },
});
