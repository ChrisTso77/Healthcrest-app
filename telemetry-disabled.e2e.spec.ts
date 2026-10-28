import { test, expect } from '@playwright/test';

test('preview deployments never load measurement even with a saved opt-in and operator flag', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/_vercel/')) scripts.push(request.url()); });
  await page.addInitScript(() => localStorage.setItem('healthcrest.measurement-choice.v1', JSON.stringify({ version: 1, analytics: true, performance: true, savedAt: Date.now() })));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Small habits.');
  await page.goto('/learn?pillar=sleep');
  await expect(page.getByRole('article', { name: 'Sleep', exact: true })).toBeVisible();
  await page.goto('/privacy');
  await expect(page.getByRole('checkbox', { name: /^Allow usage statistics/ })).toBeDisabled();
  await expect(page.getByRole('checkbox', { name: /^Allow performance measurement/ })).toBeDisabled();
  await expect(page.getByText('Optional measurement is not active on this version of the website. You can still save a choice to keep it off.', { exact: true })).toBeVisible();
  expect(scripts).toEqual([]);
});
