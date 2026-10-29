import { test, expect, type Page } from '@playwright/test';
import { createHabitWeek } from './lib/education/habitWeek';

const KEY = 'healthcrest.habit-draft.v1';
const summary = (page: Page) => page.getByRole('region', { name: 'Your week at a glance', exact: true });
async function start(page: Page) {
  await page.getByLabel('Start date', { exact: false }).fill('2026-10-28');
  await page.getByRole('button', { name: 'Start seven-day plan', exact: true }).click();
}
async function open(page: Page, index: number) {
  await summary(page).getByLabel('Day to open', { exact: true }).selectOption(String(index));
  await summary(page).getByRole('button', { name: 'Open selected day', exact: true }).click();
}
async function facts(page: Page) {
  return summary(page).locator('.hc-week-summary-facts > div').evaluateAll(rows => Object.fromEntries(rows.map(row => [
    row.querySelector('dt')!.textContent!.trim(), Number(row.querySelector('dd')!.textContent),
  ])));
}
async function textDownload(page: Page) {
  const waiting = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download my next step', exact: true }).click();
  const stream = await (await waiting).createReadStream();
  if (!stream) throw new Error('Text download unavailable');
  const parts: Buffer[] = [];
  for await (const part of stream) parts.push(Buffer.from(part));
  return Buffer.concat(parts).toString('utf8');
}

test('mixed records have matching live, downloaded and printed counts without automatic saving or requests', async ({ page }) => {
  const outbound: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' || /\/_vercel\//.test(request.url())) outbound.push(request.url());
  });
  await page.addInitScript(() => localStorage.setItem('healthcrest.measurement-choice.v1', JSON.stringify({
    version: 1, analytics: true, performance: true, savedAt: Date.now(),
  })));
  await page.goto('/next-step?pillar=sleep');
  await start(page);
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), KEY);
  for (const [index, choice] of ['tried', 'adapted', 'rest', 'not-tried'].entries()) {
    await open(page, index);
    await expect(page.getByLabel('Day ' + (index + 1) + ': what happened?', { exact: true })).toBeFocused();
    await page.getByLabel('Day ' + (index + 1) + ': what happened?', { exact: true }).selectOption(choice);
  }
  await open(page, 4);
  await page.getByLabel('Day 5: a note', { exact: false }).fill('PRIVATE-NOTES-ONLY — ゆっくり');
  await open(page, 5);
  await page.getByLabel('Day 6: a note', { exact: false }).fill('   ');
  expect(await facts(page)).toEqual({ 'Days with a choice': 4, 'Days with notes only': 1, 'Blank days': 2 });
  await expect(page.locator('#seven-day-plan')).toContainText('5 of 7 days have a check-in.');
  await summary(page).getByRole('button', { name: 'See counts for each choice', exact: true }).click();
  const choiceCounts = await summary(page).locator('.hc-week-choice-counts > div').evaluateAll(rows => Object.fromEntries(rows.map(row => [
    row.querySelector('dt')!.textContent!.trim(), row.querySelector('dd')!.textContent!.trim(),
  ])));
  expect(choiceCounts).toEqual({
    'Tried my action': '1 day', 'Tried a smaller or different version': '1 day',
    'Chose rest or support': '1 day', 'Did not try it': '1 day', 'No choice selected': '3 days',
  });
  await expect(summary(page)).toContainText('not measured health outcomes or a health score');
  const expected = ['Days with a choice: 4', 'Days with notes only: 1', 'Blank days: 2', 'No choice selected: 3'];
  const text = await textDownload(page);
  for (const line of expected) expect(text).toContain(line);
  expect(text).toContain('Day 5 (2026-11-01): Not recorded');
  expect(text).toContain('PRIVATE-NOTES-ONLY — ゆっくり');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.hc-print-week-summary')).toBeVisible();
  for (const line of expected) await expect(page.locator('.hc-print-week-summary')).toContainText(line);
  expect((await page.pdf({ format: 'A4' })).subarray(0, 5).toString()).toBe('%PDF-');
  await page.emulateMedia({ media: 'screen' });
  await open(page, 4);
  await page.getByLabel('Day 5: a note', { exact: false }).fill('');
  expect(await facts(page)).toEqual({ 'Days with a choice': 4, 'Days with notes only': 0, 'Blank days': 3 });
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(saved);
  expect(outbound).toEqual([]);
});

test('summary stays current across pillar changes, week replacement, restore and file import', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await start(page);
  await open(page, 0);
  await page.getByLabel('Day 1: what happened?', { exact: true }).selectOption('tried');
  await open(page, 1);
  await page.getByLabel('Day 2: a note', { exact: false }).fill('Keep this note.');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), KEY);
  const pillars = page.getByRole('group', { name: 'Choose a habit pillar', exact: true });
  await pillars.getByRole('button', { name: 'Food', exact: true }).click();
  await start(page);
  expect(await facts(page)).toEqual({ 'Days with a choice': 0, 'Days with notes only': 0, 'Blank days': 7 });
  await pillars.getByRole('button', { name: 'Sleep', exact: true }).click();
  expect(await facts(page)).toEqual({ 'Days with a choice': 1, 'Days with notes only': 1, 'Blank days': 5 });
  await page.getByRole('button', { name: 'Prepare another week', exact: true }).click();
  await page.getByLabel('New week start date', { exact: false }).fill('2026-11-04');
  await page.getByRole('button', { name: 'Review new week', exact: true }).click();
  await page.getByRole('button', { name: 'Replace with this new week', exact: true }).click();
  expect(await facts(page)).toEqual({ 'Days with a choice': 0, 'Days with notes only': 0, 'Blank days': 7 });
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await page.getByRole('button', { name: 'Replace edits and restore', exact: true }).click();
  expect(await facts(page)).toEqual({ 'Days with a choice': 1, 'Days with notes only': 1, 'Blank days': 5 });

  const data = JSON.parse(saved!);
  data.selected = 'Nutrition';
  data.drafts.Nutrition.week = createHabitWeek('2026-11-04', data.drafts.Nutrition);
  data.drafts.Nutrition.week.days.forEach((day: { choice: string }) => { day.choice = 'rest'; });
  await page.getByLabel('Choose a Healthcrest backup', { exact: true }).setInputFiles({
    name: 'all-rest.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)),
  });
  await page.getByRole('button', { name: 'Replace page drafts with backup', exact: true }).click();
  expect(await facts(page)).toEqual({ 'Days with a choice': 7, 'Days with notes only': 0, 'Blank days': 0 });
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(saved);
});

for (const width of [320, 1440]) {
  test('summary controls and day navigation work by keyboard at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/next-step?pillar=sleep');
    await start(page);
    const toggle = summary(page).getByRole('button', { name: 'See counts for each choice', exact: true });
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(summary(page).getByRole('button', { name: 'Hide choice counts', exact: true })).toHaveAttribute('aria-expanded', 'true');
    await summary(page).getByLabel('Day to open', { exact: true }).selectOption('6');
    await summary(page).getByRole('button', { name: 'Open selected day', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Day 7: what happened?', { exact: true })).toBeFocused();
    await expect(page.locator('#seven-day-plan details').nth(6)).toHaveAttribute('open', '');
    await page.getByLabel('Day 7: what happened?', { exact: true }).selectOption('rest');
    await open(page, 0);
    await expect(page.getByLabel('Day 1: what happened?', { exact: true })).toBeFocused();
    await expect(page.locator('#seven-day-plan details').nth(6)).toHaveAttribute('open', '');
    expect(await facts(page)).toEqual({ 'Days with a choice': 1, 'Days with notes only': 0, 'Blank days': 6 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
