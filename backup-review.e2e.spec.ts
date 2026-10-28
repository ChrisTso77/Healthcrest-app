import { test, expect, type Page } from '@playwright/test';
import { createHabitWeek } from './lib/education/habitWeek';
import type { SavedHabitDraft } from './lib/education/habitDraft';

const KEY = 'healthcrest.habit-draft.v1';
function fixture(): SavedHabitDraft {
  const drafts = Object.fromEntries(['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(pillar => [pillar, {
    action: 'Current ' + pillar + ' action.', cue: '', support: '', reflection: '', week: null,
  }])) as SavedHabitDraft['drafts'];
  drafts.Sleep.week = createHabitWeek('2026-10-28', drafts.Sleep);
  drafts.Sleep.week.days[0] = { choice: 'tried', note: 'PRIVATE-PAGE-NOTE' };
  drafts.Sleep.week.review = 'PRIVATE-WEEK-REVIEW';
  return { version: 3, selected: 'Sleep', drafts };
}
async function restore(page: Page, data = fixture()) {
  const raw = JSON.stringify(data);
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: KEY, raw });
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  return raw;
}
async function choose(page: Page, data: unknown, name = 'review.json') {
  await page.getByLabel('Choose a Healthcrest backup', { exact: true }).setInputFiles({
    name, mimeType: 'application/json', buffer: Buffer.from(typeof data === 'string' ? data : JSON.stringify(data)),
  });
}
const comparison = (page: Page) => page.locator('.hc-backup-compare');
const card = (page: Page, name: string) => comparison(page).getByRole('article', { name, exact: true });

test('comparison follows page edits and restore while a candidate stays open without stealing focus', async ({ page }) => {
  await page.goto('/next-step');
  const raw = await restore(page);
  await choose(page, fixture());
  await expect(page.getByRole('heading', { name: 'Review this backup', exact: true })).toBeFocused();
  await expect(page.locator('.hc-backup-change-count')).toHaveText('0 of 4 pillar drafts differ from this page.');
  await comparison(page).locator('summary').click();
  await expect(card(page, 'Sleep')).toContainText('Matches the current page draft and week.');
  const reflection = page.getByLabel('What did I learn?', { exact: false });
  await reflection.fill('PRIVATE-UNSAVED-REFLECTION');
  await expect(reflection).toBeFocused();
  await expect(page.locator('.hc-backup-change-count')).toHaveText('1 of 4 pillar drafts differ from this page.');
  await expect(card(page, 'Sleep')).toContainText('Extra reflection notes');
  await expect(comparison(page)).not.toContainText('PRIVATE-UNSAVED-REFLECTION');
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await expect(page.locator('.hc-backup-change-count')).toHaveText('0 of 4 pillar drafts differ from this page.');
  await expect(card(page, 'Sleep')).toContainText('Matches the current page draft and week.');
  await page.getByLabel('One manageable action', { exact: true }).fill('Keep this page edit.');
  await expect(card(page, 'Sleep')).toContainText('Next step action');
  await page.getByRole('button', { name: 'Cancel backup import', exact: true }).click();
  await expect(page.getByLabel('Choose a Healthcrest backup', { exact: true })).toBeFocused();
  await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('Keep this page edit.');
  await expect(comparison(page)).toHaveCount(0);
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(raw);
});

test('equal-count note changes are identified and applied only on explicit replacement and save', async ({ page }) => {
  await page.goto('/next-step');
  const raw = await restore(page);
  const incoming = fixture();
  incoming.drafts.Sleep.week!.days[0].note = 'PRIVATE-BACKUP-NOTE';
  await choose(page, incoming);
  await comparison(page).locator('summary').click();
  await expect(card(page, 'Sleep').locator('ul')).toHaveText('Daily check-ins or notes');
  await expect(card(page, 'Sleep').locator('time')).toHaveCount(4);
  await expect(comparison(page)).not.toContainText('PRIVATE-PAGE-NOTE');
  await expect(comparison(page)).not.toContainText('PRIVATE-BACKUP-NOTE');
  await expect(comparison(page)).not.toContainText('PRIVATE-WEEK-REVIEW');
  await page.locator('#seven-day-plan summary').first().click();
  await expect(page.getByLabel('Day 1: a note', { exact: false })).toHaveValue('PRIVATE-PAGE-NOTE');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(raw);
  await page.getByRole('button', { name: 'Replace page drafts with backup', exact: true }).click();
  await expect(comparison(page)).toHaveCount(0);
  await page.locator('#seven-day-plan summary').first().click();
  await expect(page.getByLabel('Day 1: a note', { exact: false })).toHaveValue('PRIVATE-BACKUP-NOTE');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(raw);
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), KEY);
  expect(saved.version).toBe(3);
  expect(saved.drafts.Sleep.week.days[0].note).toBe('PRIVATE-BACKUP-NOTE');
});

test('comparison distinguishes added and removed weeks and refreshes for legacy or invalid files', async ({ page }) => {
  await page.goto('/next-step');
  const raw = await restore(page);
  const incoming = fixture();
  incoming.drafts.Sleep.week = null;
  incoming.drafts.Nutrition.week = createHabitWeek('2026-11-04', incoming.drafts.Nutrition);
  await choose(page, incoming);
  await comparison(page).locator('summary').click();
  await expect(page.locator('.hc-backup-change-count')).toHaveText('2 of 4 pillar drafts differ from this page.');
  await expect(card(page, 'Sleep')).toContainText('Current week will be removed');
  await expect(card(page, 'Food')).toContainText('A current week will be added');
  await expect(card(page, 'Food').locator('time').first()).toHaveAttribute('datetime', '2026-11-04');
  const legacy = { version: 1, selected: 'Sleep', drafts: Object.fromEntries(Object.entries(fixture().drafts).map(([pillar, draft]) =>
    [pillar, { action: draft.action, cue: draft.cue, support: draft.support }]
  )) };
  await choose(page, legacy);
  await expect(comparison(page)).not.toHaveAttribute('open', '');
  await comparison(page).locator('summary').click();
  await expect(page.locator('.hc-backup-change-count')).toHaveText('1 of 4 pillar drafts differ from this page.');
  await expect(card(page, 'Sleep')).toContainText('Current week will be removed');
  await choose(page, '{broken', 'invalid.json');
  await expect(comparison(page)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Replace page drafts with backup', exact: true })).toHaveCount(0);
  await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('Current Sleep action.');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(raw);
});

test('backup comparison renders actions literally and sends no private data while reviewing', async ({ page }) => {
  const outbound: string[] = [];
  const urls: string[] = [];
  page.on('request', request => {
    urls.push(request.url());
    if (request.method() === 'POST' || new URL(request.url()).pathname.startsWith('/_vercel/') || request.url().includes('/review-tracker')) outbound.push(request.url());
  });
  await page.addInitScript(() => localStorage.setItem('healthcrest.measurement-choice.v1', JSON.stringify({
    version: 1, analytics: true, performance: true, savedAt: Date.now(),
  })));
  await page.goto('/next-step');
  const raw = await restore(page);
  const incoming = fixture();
  incoming.drafts.Stress.action = '<img id="backup-action" src="/review-tracker"> PRIVATE-ACTION — ゆっくり';
  await choose(page, incoming);
  await comparison(page).locator('summary').click();
  await expect(card(page, 'Stress & support')).toContainText(incoming.drafts.Stress.action);
  await expect(page.locator('#backup-action')).toHaveCount(0);
  await expect(comparison(page)).toContainText('does not check the separately saved browser copy');
  await expect(comparison(page)).toContainText('or tell which copy is newer');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(raw);
  expect(urls.join('\n')).not.toContain('PRIVATE-');
  expect(outbound).toEqual([]);
});
for (const width of [320, 1440]) {
  test('comparison can be reviewed and applied by keyboard at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/next-step');
    const raw = await restore(page);
    const incoming = fixture();
    incoming.drafts.Sleep.action = 'A'.repeat(300);
    incoming.drafts.Sleep.week!.action = 'B'.repeat(300);
    await choose(page, incoming);
    const summary = comparison(page).locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(card(page, 'Sleep')).toContainText('A'.repeat(300));
    await expect(card(page, 'Sleep')).toContainText('B'.repeat(300));
    await expect(comparison(page).getByRole('article')).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Replace page drafts with backup', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#seven-day-plan')).toBeFocused();
    await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('A'.repeat(300));
    expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(raw);
  });
}
