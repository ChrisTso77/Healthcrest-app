import { test, expect, type Page } from '@playwright/test';
import { createHabitWeek } from './lib/education/habitWeek';
import type { SavedHabitDraft } from './lib/education/habitDraft';

const KEY = 'healthcrest.habit-draft.v1';
function fixture(): SavedHabitDraft {
  const drafts = Object.fromEntries(['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(pillar => [pillar, {
    action: 'Backup ' + pillar + ' action.', cue: 'After lunch.', support: 'Keep it manageable.', reflection: 'A note — ゆっくり', week: null,
  }])) as SavedHabitDraft['drafts'];
  drafts.Sleep.week = createHabitWeek('2026-10-28', drafts.Sleep);
  drafts.Sleep.week.days[1] = { choice: 'adapted', note: 'A shorter version fitted.' };
  drafts.Sleep.week.review = 'A quiet moment helped.';
  drafts.Sleep.week.nextAction = 'Try one paragraph.';
  return { version: 3, selected: 'Sleep', drafts };
}
async function choose(page: Page, value: unknown, name = 'healthcrest-plan-backup.json') {
  await page.getByLabel('Choose a Healthcrest backup', { exact: true }).setInputFiles({
    name, mimeType: 'application/json', buffer: Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)),
  });
}
async function download(page: Page) {
  const waiting = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download all-pillar backup', exact: true }).click();
  const file = await waiting;
  expect(file.suggestedFilename()).toBe('healthcrest-plan-backup.json');
  const stream = await file.createReadStream();
  if (!stream) throw new Error('Backup download unavailable');
  const parts: Buffer[] = [];
  for await (const part of stream) parts.push(Buffer.from(part));
  return Buffer.concat(parts);
}
const picker = (page: Page) => page.getByRole('group', { name: 'Choose a habit pillar', exact: true });

test('backup round-trips unsaved drafts and weeks into a separate browser profile with explicit saving', async ({ page, browser, baseURL }) => {
  await page.goto('/next-step?pillar=sleep');
  await page.getByLabel('One manageable action', { exact: true }).fill('Read one page.');
  await page.getByLabel('What did I learn?', { exact: false }).fill('Reading helped — ゆっくり');
  await page.getByLabel('Start date', { exact: false }).fill('2026-10-28');
  await page.getByRole('button', { name: 'Start seven-day plan', exact: true }).click();
  await page.locator('#seven-day-plan summary').nth(1).click();
  await page.getByLabel('Day 2: what happened?', { exact: true }).selectOption('adapted');
  await page.getByLabel('Day 2: a note', { exact: false }).fill('One paragraph fitted.');
  await page.getByLabel('What did this week teach me?', { exact: false }).fill('Make room for a quiet moment.');
  await page.getByLabel('An action I might try next', { exact: false }).fill('Read in a quiet room.');
  await picker(page).getByRole('button', { name: 'Food', exact: true }).click();
  await page.getByLabel('One manageable action', { exact: true }).fill('Add beans to one meal.');
  await page.getByLabel('Start date', { exact: false }).fill('2026-11-04');
  await page.getByRole('button', { name: 'Start seven-day plan', exact: true }).click();
  await picker(page).getByRole('button', { name: 'Sleep', exact: true }).click();
  const bytes = await download(page);
  const original = JSON.parse(bytes.toString('utf8'));
  expect(original.selected).toBe('Sleep');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
  await expect(page.locator('.hc-plan-unsaved')).toContainText('You have page changes to save.');

  const context = await browser.newContext({ baseURL });
  const other = await context.newPage();
  await other.goto('/next-step');
  await choose(other, bytes.toString('utf8'));
  await expect(other.getByRole('heading', { name: 'Review this backup', exact: true })).toBeFocused();
  await expect(other.locator('.hc-backup-preview')).toContainText('2 current seven-day plans');
  await expect(other.getByLabel('One manageable action', { exact: true })).not.toHaveValue('Read one page.');
  await other.getByRole('button', { name: 'Replace page drafts with backup', exact: true }).click();
  await expect(other.locator('#seven-day-plan')).toBeFocused();
  await expect(other.getByLabel('One manageable action', { exact: true })).toHaveValue('Read one page.');
  expect(JSON.parse((await download(other)).toString('utf8'))).toEqual(original);
  expect(await other.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
  await other.locator('#seven-day-plan summary').nth(1).click();
  await expect(other.getByLabel('Day 2: a note', { exact: false })).toHaveValue('One paragraph fitted.');
  await picker(other).getByRole('button', { name: 'Food', exact: true }).click();
  await expect(other.getByLabel('One manageable action', { exact: true })).toHaveValue('Add beans to one meal.');
  await other.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await other.reload();
  await other.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await expect(other.getByLabel('One manageable action', { exact: true })).toHaveValue('Add beans to one meal.');
  await context.close();
});

test('checking then cancelling a backup preserves current edits and the saved browser copy', async ({ page }) => {
  await page.goto('/next-step');
  const action = page.getByLabel('One manageable action', { exact: true });
  await action.fill('My saved original.');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), KEY);
  await action.fill('My unsaved edit.');
  await choose(page, fixture());
  await expect(action).toHaveValue('My unsaved edit.');
  await page.getByRole('button', { name: 'Cancel backup import', exact: true }).click();
  await expect(page.getByLabel('Choose a Healthcrest backup', { exact: true })).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Review this backup', exact: true })).toHaveCount(0);
  await expect(action).toHaveValue('My unsaved edit.');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(saved);
  expect(JSON.parse((await download(page)).toString('utf8')).drafts.Fitness.action).toBe('My unsaved edit.');
});

test('damaged, oversized, future and invalid-week files never replace page edits or saved drafts', async ({ page }) => {
  await page.goto('/next-step');
  await page.getByLabel('One manageable action', { exact: true }).fill('Keep my current edit.');
  const saved = JSON.stringify(fixture());
  await page.evaluate(({ key, saved }) => localStorage.setItem(key, saved), { key: KEY, saved });
  const badWeek = fixture();
  badWeek.drafts.Sleep.week!.days.pop();
  const tooLong = fixture();
  tooLong.drafts.Sleep.reflection = 'x'.repeat(501);
  const invalid = ['', ' '.repeat(120001), '{broken', { ...fixture(), version: 99 }, badWeek, tooLong];
  for (let i = 0; i < invalid.length; i++) {
    await choose(page, invalid[i], 'invalid-' + i + '.json');
    await expect(page.getByRole('status')).toContainText(/not a compatible|non-empty/);
    await expect(page.getByRole('button', { name: 'Replace page drafts with backup', exact: true })).toHaveCount(0);
    await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('Keep my current edit.');
    expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(saved);
  }
});

test('older draft backups migrate in page memory and export in the current format', async ({ page }) => {
  await page.goto('/next-step');
  const source = fixture();
  const legacy = { version: 1, selected: 'Stress', drafts: Object.fromEntries(Object.entries(source.drafts).map(([pillar, draft]) =>
    [pillar, { action: draft.action, cue: draft.cue, support: draft.support }]
  )) };
  await choose(page, legacy);
  await expect(page.locator('.hc-backup-preview')).toContainText('0 current seven-day plans');
  await page.getByRole('button', { name: 'Replace page drafts with backup', exact: true }).click();
  await expect(page.getByLabel('One manageable action', { exact: true })).toBeFocused();
  await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('Backup Stress action.');
  const exported = JSON.parse((await download(page)).toString('utf8'));
  expect(exported.version).toBe(3);
  expect(exported.selected).toBe('Stress');
  expect(exported.drafts.Stress).toMatchObject({ reflection: '', week: null });
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
});

test('unreadable files leave edits intact and transfer still works when browser storage is blocked', async ({ page }) => {
  await page.goto('/next-step');
  await page.getByLabel('One manageable action', { exact: true }).fill('Keep this edit.');
  await page.evaluate(() => {
    const original = File.prototype.text;
    File.prototype.text = function(this: File) {
      if (this.name === 'unreadable.json') return Promise.reject(new Error('Read blocked'));
      return original.call(this);
    };
    Object.defineProperty(Storage.prototype, 'getItem', { value: () => { throw new DOMException('Blocked', 'SecurityError'); } });
    Object.defineProperty(Storage.prototype, 'setItem', { value: () => { throw new DOMException('Blocked', 'SecurityError'); } });
  });
  await choose(page, fixture(), 'unreadable.json');
  await expect(page.getByRole('status')).toContainText('could not be read');
  await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('Keep this edit.');
  await choose(page, fixture());
  await page.getByRole('button', { name: 'Replace page drafts with backup', exact: true }).click();
  await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('Backup Sleep action.');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Saving is unavailable');
  expect(JSON.parse((await download(page)).toString('utf8')).drafts.Sleep.action).toBe('Backup Sleep action.');
});

test('cancelled and superseded file reads cannot reopen or replace the chosen backup', async ({ page }) => {
  await page.goto('/next-step');
  const slow = { ...fixture(), selected: 'Stress' };
  await page.evaluate(raw => {
    const original = File.prototype.text;
    const pending: Array<() => void> = [];
    (window as Window & { finishBackupRead?: () => void }).finishBackupRead = () => pending.shift()?.();
    File.prototype.text = function(this: File) {
      if (this.name.startsWith('slow-')) return new Promise<string>(resolve => pending.push(() => resolve(raw)));
      return original.call(this);
    };
  }, JSON.stringify(slow));
  await choose(page, slow, 'slow-cancel.json');
  await page.getByRole('button', { name: 'Cancel backup import', exact: true }).click();
  await page.evaluate(() => (window as Window & { finishBackupRead?: () => void }).finishBackupRead?.());
  await expect(page.getByRole('heading', { name: 'Review this backup', exact: true })).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('cancelled');
  await choose(page, slow, 'slow-replace.json');
  await choose(page, fixture(), 'latest.json');
  await expect(page.locator('.hc-backup-preview')).toContainText('Opens with Sleep selected.');
  await page.evaluate(() => (window as Window & { finishBackupRead?: () => void }).finishBackupRead?.());
  await expect(page.locator('.hc-backup-preview')).toContainText('File: latest.json');
  await expect(page.locator('.hc-backup-preview')).toContainText('Opens with Sleep selected.');
});

test('backup notes remain literal text and transfer sends no planner or measurement requests', async ({ page }) => {
  const outbound: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' || /\/_vercel\//.test(request.url()) || new URL(request.url()).pathname === '/backup-tracker') outbound.push(request.url());
  });
  await page.addInitScript(() => localStorage.setItem('healthcrest.measurement-choice.v1', JSON.stringify({
    version: 1, analytics: true, performance: true, savedAt: Date.now(),
  })));
  await page.goto('/next-step');
  const data = fixture();
  data.drafts.Sleep.action = '<img id="imported-note" src="/backup-tracker"> — ゆっくり';
  await choose(page, { ...data, ignored: 'not exported' });
  await page.getByRole('button', { name: 'Replace page drafts with backup', exact: true }).click();
  await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue(data.drafts.Sleep.action);
  await expect(page.locator('#imported-note')).toHaveCount(0);
  const exported = JSON.parse((await download(page)).toString('utf8'));
  expect(exported).toEqual(data);
  expect(outbound).toEqual([]);
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
});

for (const width of [320, 1440]) {
  test('backup preview and replacement work by keyboard at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/next-step?pillar=sleep');
    await page.getByRole('button', { name: 'Start seven-day plan', exact: true }).click();
    await page.getByRole('button', { name: 'Clear this week to start another', exact: true }).click();
    await choose(page, fixture(), 'a'.repeat(180) + '.json');
    await expect(page.getByRole('heading', { name: 'Review this backup', exact: true })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Replace page drafts with backup', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#seven-day-plan')).toBeFocused();
    await expect(page.getByRole('button', { name: 'Clear current week', exact: true })).toHaveCount(0);
    await expect(page.locator('.hc-plan-unsaved')).toContainText('You have page changes to save.');
  });
}
