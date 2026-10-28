import { test, expect } from '@playwright/test';
import { createHabitWeek } from './lib/education/habitWeek';

const KEY = 'healthcrest.habit-draft.v1';
function savedPlan() {
  const drafts = Object.fromEntries(['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(pillar => [pillar, {
    action: 'Saved ' + pillar + ' action.', cue: 'After lunch.', support: '', reflection: '', week: null as ReturnType<typeof createHabitWeek> | null,
  }]));
  drafts.Sleep.week = createHabitWeek('2026-10-28', drafts.Sleep);
  return { version: 3, selected: 'Sleep', drafts };
}
test('homepage return link requires an explicit restore and opens the saved week', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: KEY, raw: JSON.stringify(savedPlan()) });
  await page.getByRole('link', { name: 'Return to my plan', exact: true }).click();
  await expect(page).toHaveURL(/\/next-step#return-to-plan$/);
  await expect(page.locator('#return-to-plan')).toBeInViewport();
  await expect(page.getByRole('textbox', { name: 'One manageable action', exact: true })).not.toHaveValue('Saved Sleep action.');
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await expect(page.locator('#seven-day-plan')).toBeFocused();
  await expect(page.getByLabel('Action for this week', { exact: true })).toContainText('Saved Sleep action.');
  await expect(page.getByRole('textbox', { name: 'One manageable action', exact: true })).toHaveValue('Saved Sleep action.');
});
test('new return action protects unsaved edits and cancellation returns focus', async ({ page }) => {
  await page.goto('/next-step');
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: KEY, raw: JSON.stringify(savedPlan()) });
  const action = page.getByRole('textbox', { name: 'One manageable action', exact: true });
  await action.fill('Keep my current edit.');
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Restore confirmation', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Keep my edits', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Keep my edits', exact: true }).click();
  await expect(action).toHaveValue('Keep my current edit.');
  await expect(page.getByRole('button', { name: 'Restore my plan', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await page.getByRole('button', { name: 'Replace edits and restore', exact: true }).click();
  await expect(action).toHaveValue('Saved Sleep action.');
});
test('weekly save persists the check-in only on explicit action and updates the unsaved reminder', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: KEY, raw: JSON.stringify(savedPlan()) });
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  const before = await page.evaluate(key => localStorage.getItem(key), KEY);
  await page.locator('#seven-day-plan summary').first().click();
  await page.getByLabel('Day 1: a note', { exact: false }).fill('A quiet break helped.');
  await expect(page.locator('.hc-plan-unsaved')).toContainText('You have page changes to save.');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(before);
  await page.getByRole('button', { name: 'Save week and all drafts', exact: true }).click();
  await expect(page.locator('.hc-plan-unsaved')).toContainText('Saving is manual.');
  await page.reload();
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await page.locator('#seven-day-plan summary').first().click();
  await expect(page.getByLabel('Day 1: a note', { exact: false })).toHaveValue('A quiet break helped.');
});
test('unavailable or damaged storage leaves current edits intact', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await page.getByRole('textbox', { name: 'One manageable action', exact: true }).fill('Keep this edit.');
  await page.evaluate(key => localStorage.setItem(key, '{broken'), KEY);
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await page.getByRole('button', { name: 'Replace edits and restore', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('No compatible saved draft');
  await expect(page.getByRole('textbox', { name: 'One manageable action', exact: true })).toHaveValue('Keep this edit.');
  await page.evaluate(() => Object.defineProperty(Storage.prototype, 'getItem', { value: () => { throw new DOMException('Blocked', 'SecurityError'); } }));
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await page.getByRole('button', { name: 'Replace edits and restore', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Saved drafts are unavailable');
});
for (const width of [320, 390, 768, 1440]) {
  test('return navigation works by keyboard at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/next-step');
    await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: KEY, raw: JSON.stringify(savedPlan()) });
    await page.getByRole('button', { name: 'Restore my plan', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#seven-day-plan')).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('an older saved draft opens its action without rewriting storage', async ({ page }) => {
  await page.goto('/next-step');
  const saved = savedPlan();
  const legacy = JSON.stringify({ version: 2, selected: saved.selected, drafts: Object.fromEntries(
    Object.entries(saved.drafts).map(([pillar, draft]) => [pillar, { action: draft.action, cue: draft.cue, support: draft.support, reflection: draft.reflection }])
  ) });
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: KEY, raw: legacy });
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'One manageable action', exact: true })).toBeFocused();
  await expect(page.getByRole('textbox', { name: 'One manageable action', exact: true })).toHaveValue('Saved Sleep action.');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(legacy);
});
