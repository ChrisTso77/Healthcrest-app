import { test, expect, type Page } from '@playwright/test';
import { createHabitWeek } from './lib/education/habitWeek';
import type { SavedHabitDraft } from './lib/education/habitDraft';

const KEY = 'healthcrest.habit-draft.v1';
function fixture(): SavedHabitDraft {
  const drafts = Object.fromEntries(['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(pillar => [pillar, {
    action: 'Saved ' + pillar + ' action.', cue: '', support: '', reflection: 'PRIVATE-REFLECTION', week: null,
  }])) as SavedHabitDraft['drafts'];
  drafts.Sleep.week = createHabitWeek('2026-10-28', { action: 'Original sleep week action.', cue: '', support: '' });
  drafts.Sleep.week.days[0] = { choice: 'tried', note: 'PRIVATE-DAILY-NOTE' };
  drafts.Sleep.week.days[1] = { choice: '', note: 'Notes alone count.' };
  drafts.Sleep.week.days[2] = { choice: '', note: '   ' };
  drafts.Nutrition.week = createHabitWeek('2026-11-04', drafts.Nutrition);
  drafts.Stress.action = '';
  return { version: 3, selected: 'Sleep', drafts };
}
const overview = (page: Page) => page.getByRole('region', { name: 'Pillar draft overview', exact: true });
const card = (page: Page, name: string) => overview(page).getByRole('article', { name, exact: true });
async function expand(page: Page) {
  await overview(page).getByRole('button', { name: 'See all four pillar drafts', exact: true }).click();
}
async function importPlan(page: Page, data: SavedHabitDraft) {
  await page.getByLabel('Choose a Healthcrest backup', { exact: true }).setInputFiles({
    name: 'overview.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)),
  });
  await page.getByRole('button', { name: 'Replace page drafts with backup', exact: true }).click();
}

test('opening the overview shows page starters without automatically reading saved plans', async ({ page }) => {
  await page.addInitScript(({ key, raw }) => {
    localStorage.setItem(key, raw);
    const original = Storage.prototype.getItem;
    const reads: string[] = [];
    (window as Window & { draftReads?: string[] }).draftReads = reads;
    Storage.prototype.getItem = function(key: string) {
      if (key === 'healthcrest.habit-draft.v1') reads.push(key);
      return original.call(this, key);
    };
  }, { key: KEY, raw: JSON.stringify(fixture()) });
  await page.goto('/next-step');
  await expect(overview(page).getByRole('article')).toHaveCount(0);
  await expand(page);
  await expect(overview(page).getByRole('article')).toHaveCount(4);
  await expect(card(page, 'Movement')).toContainText('Try a manageable walk');
  await expect(overview(page)).not.toContainText('Saved Sleep action.');
  await expect(overview(page)).toContainText('including any starter ideas');
  await expect(overview(page).getByText('No dated week on this page.', { exact: true })).toHaveCount(4);
  expect(await page.evaluate(() => (window as Window & { draftReads?: string[] }).draftReads)).toEqual([]);
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await expect(card(page, 'Sleep')).toContainText('Saved Sleep action.');
  await expect(card(page, 'Sleep')).toContainText('Original sleep week action.');
  await expect(card(page, 'Sleep')).toContainText('Days with a check-in: 2 of 7');
  await expect(card(page, 'Sleep').locator('time')).toHaveCount(2);
  await expect(card(page, 'Stress & support')).toContainText('No action written yet.');
  await expect(card(page, 'Food')).toContainText('Days with a check-in: 0 of 7');
  await expect(overview(page)).not.toContainText('PRIVATE-REFLECTION');
  await expect(overview(page)).not.toContainText('PRIVATE-DAILY-NOTE');
});

test('overview follows page edits and notes-only counts without saving or sending personal text', async ({ page }) => {
  const outbound: string[] = [];
  const urls: string[] = [];
  page.on('request', request => {
    urls.push(request.url());
    if (request.method() === 'POST' || new URL(request.url()).pathname.startsWith('/_vercel/') || request.url().includes('/overview-tracker')) outbound.push(request.url());
  });
  await page.addInitScript(() => localStorage.setItem('healthcrest.measurement-choice.v1', JSON.stringify({
    version: 1, analytics: true, performance: true, savedAt: Date.now(),
  })));
  await page.goto('/next-step');
  const action = page.getByLabel('One manageable action', { exact: true });
  const literal = '<img id="overview-note" src="/overview-tracker"> PRIVATE-ACTION — ゆっくり';
  await action.fill(literal);
  await page.getByLabel('Start date', { exact: false }).fill('2026-10-28');
  await page.getByRole('button', { name: 'Start seven-day plan', exact: true }).click();
  await page.locator('#seven-day-plan summary').nth(0).click();
  await page.getByLabel('Day 1: what happened?', { exact: true }).selectOption('rest');
  await page.locator('#seven-day-plan summary').nth(1).click();
  await page.getByLabel('Day 2: a note', { exact: false }).fill('PRIVATE-NOTE');
  await page.locator('#seven-day-plan summary').nth(2).click();
  await page.getByLabel('Day 3: a note', { exact: false }).fill('   ');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), KEY);
  await action.fill('PRIVATE-DRAFT-FOR-LATER');
  await expand(page);
  await expect(card(page, 'Movement')).toContainText('PRIVATE-DRAFT-FOR-LATER');
  await expect(card(page, 'Movement')).toContainText(literal);
  await expect(card(page, 'Movement')).toContainText('Days with a check-in: 2 of 7');
  await expect(overview(page)).not.toContainText('PRIVATE-NOTE');
  await expect(page.locator('#overview-note')).toHaveCount(0);
  await page.getByLabel('Day 2: a note', { exact: false }).fill('');
  await expect(card(page, 'Movement')).toContainText('Days with a check-in: 1 of 7');
  await overview(page).getByRole('button', { name: 'Hide pillar drafts', exact: true }).click();
  await expect(overview(page).getByRole('article')).toHaveCount(0);
  await expand(page);
  await expect(card(page, 'Movement')).toContainText('PRIVATE-DRAFT-FOR-LATER');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(saved);
  await expect(page.locator('.hc-plan-unsaved')).toContainText('You have page changes to save.');
  expect(urls.join('\n')).not.toContain('PRIVATE-');
  expect(outbound).toEqual([]);
});

test('overview refreshes after import, another week, clearing and restore without stale records', async ({ page }) => {
  await page.goto('/next-step');
  const raw = JSON.stringify(fixture());
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: KEY, raw });
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await expand(page);
  const imported = fixture();
  imported.selected = 'Nutrition';
  imported.drafts.Nutrition.action = 'Imported food idea.';
  imported.drafts.Nutrition.week!.days.forEach(day => { day.choice = 'adapted'; });
  await importPlan(page, imported);
  await expect(card(page, 'Food')).toContainText('Imported food idea.');
  await expect(card(page, 'Food')).toContainText('Days with a check-in: 7 of 7');
  await expect(card(page, 'Food').getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Prepare another week', exact: true }).click();
  await page.getByLabel('New week start date', { exact: false }).fill('2026-11-11');
  await page.getByRole('button', { name: 'Review new week', exact: true }).click();
  await page.getByRole('button', { name: 'Replace with this new week', exact: true }).click();
  await expect(card(page, 'Food')).toContainText('Days with a check-in: 0 of 7');
  await expect(card(page, 'Food').locator('time').first()).toHaveAttribute('datetime', '2026-11-11');
  await page.getByRole('button', { name: 'Clear this week to start another', exact: true }).click();
  await page.getByRole('button', { name: 'Clear current week', exact: true }).click();
  await expect(card(page, 'Food')).toContainText('No dated week on this page.');
  await expect(card(page, 'Food').locator('time')).toHaveCount(0);
  await expect(card(page, 'Sleep')).toContainText('Days with a check-in: 2 of 7');
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await expect(card(page, 'Food')).toContainText('Saved Nutrition action.');
  await expect(card(page, 'Food')).toContainText('Days with a check-in: 0 of 7');
  await expect(card(page, 'Sleep').getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(raw);
});

for (const width of [320, 1440]) {
  test('overview selection works by keyboard without overflow at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/next-step');
    const data = fixture();
    data.drafts.Sleep.action = '長'.repeat(300);
    await importPlan(page, data);
    const toggle = overview(page).getByRole('button', { name: 'See all four pillar drafts', exact: true });
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(overview(page).getByRole('button', { name: 'Hide pillar drafts', exact: true })).toHaveAttribute('aria-expanded', 'true');
    for (const [label, action] of [['Movement', data.drafts.Fitness.action], ['Food', data.drafts.Nutrition.action], ['Stress & support', ''], ['Sleep', data.drafts.Sleep.action]]) {
      const button = card(page, label).getByRole('button');
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('One manageable action', { exact: true })).toBeFocused();
      await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue(action);
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByRole('group', { name: 'Choose a habit pillar', exact: true }).getByRole('button', { name: label, exact: true })).toHaveAttribute('aria-pressed', 'true');
    }
    await expect(card(page, 'Sleep')).toContainText('Original sleep week action.');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
  });
}
test('overview editing shortcuts work when browser storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem']) {
      Object.defineProperty(Storage.prototype, method, { configurable: true, value: () => { throw new DOMException('Blocked', 'SecurityError'); } });
    }
  });
  await page.goto('/next-step');
  await expand(page);
  await card(page, 'Sleep').getByRole('button').click();
  await page.getByLabel('One manageable action', { exact: true }).fill('A shorter page-only routine.');
  await expect(card(page, 'Sleep')).toContainText('A shorter page-only routine.');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Saving is unavailable');
  await expect(card(page, 'Sleep')).toContainText('A shorter page-only routine.');
});
test('without JavaScript the overview is hidden and the starter guidance remains readable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/next-step?pillar=sleep');
    await expect(page.locator('.hc-draft-overview')).toBeHidden();
    await expect(page.getByRole('heading', { name: 'My sleep next step', exact: true })).toBeVisible();
    await expect(page.getByText(/Enable JavaScript to switch pillars/)).toBeVisible();
    await expect(page.getByRole('link', { name: /NHS: sleep needs/ })).toBeVisible();
  } finally { await context.close(); }
});
