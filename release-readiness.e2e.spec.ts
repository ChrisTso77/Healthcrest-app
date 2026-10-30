import { test, expect } from '@playwright/test';
import { checkPublicFocus } from './e2e/focus-appearance';
import { checkHabitSelection } from './e2e/habit-selection';
import { checkScenarioSelection } from './e2e/scenario-selection';
import { checkExplorerInformation } from './e2e/explorer-information';
import { checkSavedPlanRemoval } from './e2e/saved-plan-removal';
import { checkSavedPlanRestore } from './e2e/saved-plan-restore';

for (const width of [320, 1350]) {
  test('both restore controls protect unsaved drafts and notes at ' + width + 'px', async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 940 });
    await checkSavedPlanRestore(page, testInfo, false, true);
  });
}
for (const unavailable of ['invalid', 'blocked'] as const) {
  test('both restore controls preserve edits with ' + unavailable + ' saved data', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await checkSavedPlanRestore(page, testInfo, unavailable, true);
  });
}

for (const width of [320, 1350]) {
  test('saved-plan removal requires confirmation and preserves page edits at ' + width + 'px', async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 940 });
    await checkSavedPlanRemoval(page, testInfo, false, true);
  });
}

test('blocked saved-plan removal preserves the copy and explicit save cancels removal', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await checkSavedPlanRemoval(page, testInfo, true, true);
});

for (const width of [320, 1350]) {
  test('plain Explorer information controls preserve the current session at ' + width + 'px', async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 940 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await checkExplorerInformation(page, testInfo, width === 320 ? '2d' : '3d', true);
  });
}

for (const width of [320, 1350]) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test('scenario selection and manual attribution survive forced ' + colorScheme + ' colours at ' + width + 'px', async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 940 });
      await page.emulateMedia({ forcedColors: 'active', colorScheme, reducedMotion: 'reduce' });
      expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true);
      await checkScenarioSelection(page, testInfo, '2d', true);
    });
  }
}

test('3D scenario markers preserve camera, canvas and manual attribution', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1350, height: 940 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await checkScenarioSelection(page, testInfo, '3d', true);
});

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

for (const width of [320, 640, 1350]) {
test('short Explorer viewport separates controls at ' + width + 'px', async ({ page }) => {
  await page.setViewportSize({ width, height: 200 });
  await page.goto('/engine?view=2d');
  const guide = page.getByRole('button', { name: 'Guide: understand this view', exact: true });
  const about = page.getByRole('button', { name: 'About this Explorer', exact: true });
  const guideBox = await guide.boundingBox();
  const aboutBox = await about.boundingBox();
  expect(guideBox).not.toBeNull();
  expect(aboutBox).not.toBeNull();
  expect(guideBox!.y + guideBox!.height).toBeLessThanOrEqual(aboutBox!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await about.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'About this Explorer', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(about).toBeFocused();
});

}
