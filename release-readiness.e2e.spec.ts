import { test, expect } from '@playwright/test';
import { checkPublicFocus } from './e2e/focus-appearance';
import { checkHabitSelection } from './e2e/habit-selection';

for (const width of [320, 1350]) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test('habit selection stays visible in forced ' + colorScheme + ' colours at ' + width + 'px', async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ forcedColors: 'active', colorScheme });
      expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true);
      await checkHabitSelection(page, testInfo, true);
    });
  }
}

test('habit selection and labels fit the narrow public journey in normal colours', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await checkHabitSelection(page, testInfo, true);
});

for (const width of [390, 1350]) {
  test('public keyboard focus remains clear on light and dark surfaces at ' + width + 'px', async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await checkPublicFocus(page, testInfo, true);
  });
}

for (const path of ['/a-missing-healthcrest-page', '/learn/a-missing-healthcrest-guide']) {
  for (const width of [320, 1440]) {
    test('missing page recovery at ' + path + ' and ' + width + 'px', async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await page.getByRole('link', { name: 'Skip to content', exact: true }).focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#main-content')).toBeFocused();
      const recovery = page.getByRole('navigation', { name: 'Find a Healthcrest page', exact: true });
      await expect(recovery.getByRole('link', { name: 'Explore everyday habits', exact: true })).toHaveAttribute('href', '/engine?view=2d');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await recovery.getByRole('link', { name: 'Read the practical guides', exact: true }).focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/\/learn$/);
    });
  }
}

test('recovery to the planner keeps saved drafts manual and intact', async ({ page }) => {
  const key = 'healthcrest.habit-draft.v1';
  const raw = JSON.stringify({ version: 3, selected: 'Fitness', drafts: Object.fromEntries(
    ['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(pillar => [pillar, {
      action: 'Saved ' + pillar + ' action.', cue: '', support: '', reflection: '', week: null,
    }])
  ) });
  await page.goto('/');
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key, raw });
  await page.goto('/a-missing-healthcrest-page');
  await page.getByRole('navigation', { name: 'Find a Healthcrest page', exact: true }).getByRole('link', { name: 'Return to my habit plan', exact: true }).click();
  await expect(page).toHaveURL(/\/next-step#return-to-plan$/);
  const action = page.getByRole('textbox', { name: 'One manageable action', exact: true });
  await expect(action).not.toHaveValue('Saved Fitness action.');
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(raw);
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await expect(action).toHaveValue('Saved Fitness action.');
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(raw);
});

test('missing page recovery remains readable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  const response = await page.goto('/a-missing-healthcrest-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await page.getByRole('navigation', { name: 'Find a Healthcrest page', exact: true }).getByRole('link', { name: 'Go to the homepage', exact: true }).click();
  await expect(page).toHaveURL(baseURL! + '/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await context.close();
});
