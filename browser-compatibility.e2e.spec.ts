import { test, expect, type Download, type Page } from '@playwright/test';
import { FALLBACK_PRESETS } from './lib/presets/fallback';
import { LEARNING_GUIDES } from './lib/education/learningGuides';
import { createHabitWeek } from './lib/education/habitWeek';
import type { SavedHabitDraft } from './lib/education/habitDraft';
import { checkPublicFocus } from './e2e/focus-appearance';
import { checkHabitSelection } from './e2e/habit-selection';
import { checkScenarioSelection } from './e2e/scenario-selection';
import { checkExplorerInformation } from './e2e/explorer-information';
import { checkSavedPlanRemoval } from './e2e/saved-plan-removal';
import { checkSavedPlanRestore } from './e2e/saved-plan-restore';

for (const unavailable of [false, 'invalid', 'blocked'] as const) {
  test('both restore controls protect edits with saved data: ' + unavailable, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await checkSavedPlanRestore(page, testInfo, unavailable);
  });
}

for (const blocked of [false, true]) {
  test('saved-plan removal preserves edits and handles blocked storage: ' + blocked, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await checkSavedPlanRemoval(page, testInfo, blocked);
  });
}

test('plain information dialogs preserve compact Explorer settings', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await checkExplorerInformation(page, testInfo);
});

test('example scenario markers clear for manual edits and restored values', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await checkScenarioSelection(page, testInfo);
});

test('selected public habits remain distinguishable without changing labels or drafts', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await checkHabitSelection(page, testInfo);
});

test('public keyboard focus works on light and dark surfaces', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await checkPublicFocus(page, testInfo);
});

test('the browser-tab icon and conventional fallback decode locally', async ({ page, request }, testInfo) => {
  await page.goto('/learn');
  const href = await page.locator('link[rel="icon"]').getAttribute('href');
  expect(href).toBeTruthy();
  const icon = new URL(href!, page.url());
  expect(icon.origin).toBe(new URL(page.url()).origin);
  expect(icon.pathname).toBe('/icon');
  const response = await request.get('/favicon.ico', { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/png');
  const bytes = await response.body();
  expect(bytes.byteLength).toBeLessThanOrEqual(16384);
  const dimensions = await page.evaluate(async () => {
    const image = new Image(); image.src = '/favicon.ico'; await image.decode();
    return [image.naturalWidth, image.naturalHeight];
  });
  expect(dimensions).toEqual([64, 64]);
  await testInfo.attach('healthcrest-browser-icon', { body: bytes, contentType: 'image/png' });
});

const KEY = 'healthcrest.habit-draft.v1';
async function downloadText(file: Download): Promise<string> {
  const stream = await file.createReadStream();
  if (!stream) throw new Error('Download stream unavailable');
  const parts: Buffer[] = [];
  for await (const part of stream) parts.push(Buffer.from(part));
  return Buffer.concat(parts).toString('utf8');
}
async function startWeek(page: Page) {
  await page.getByLabel('Start date', { exact: false }).fill('2026-10-29');
  await page.getByRole('button', { name: 'Start seven-day plan', exact: true }).click();
}
function backup(): SavedHabitDraft {
  const drafts = Object.fromEntries(['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(pillar => [pillar, {
    action: 'Imported ' + pillar + ' action.', cue: '', support: '', reflection: '', week: null,
  }])) as SavedHabitDraft['drafts'];
  drafts.Sleep.week = createHabitWeek('2026-10-29', drafts.Sleep);
  drafts.Sleep.week.days[0] = { choice: 'adapted', note: 'A shorter version — ゆっくり' };
  return { version: 3, selected: 'Sleep', drafts };
}

test('homepage assets and reduced-motion fallback work with fresh-visitor measurement off', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const measurement: string[] = [];
  page.on('request', request => {
    const path = new URL(request.url()).pathname;
    if (path.startsWith('/_vercel/') || path.startsWith('/.well-known/vercel/')) measurement.push(request.url());
  });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  const still = page.locator('.hc-bird-media img');
  await expect(still).toBeVisible();
  await expect.poll(() => still.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const logo = page.locator('.hc-header .hc-brand img');
  await expect.poll(() => logo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: /hummingbird animation/ })).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Learn', exact: true }).click();
  await expect(page).toHaveURL(/\/learn$/);
  expect(measurement).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('multiword learning search opens source context and a chosen editable idea', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/learn');
  await page.getByRole('searchbox', { name: 'Search health topics and terms', exact: true }).fill('plate Harvard');
  const topic = page.getByRole('article', { name: 'Food', exact: true });
  await topic.locator('.hc-learn-match a').click();
  await expect(page).toHaveURL(/\/learn\/balanced-meals#international-perspective$/);
  await expect(page.locator('#international-perspective')).toBeFocused();
  await expect(page.locator('#source-harvard-plate')).toContainText('not a US government dietary guideline');
  const guide = LEARNING_GUIDES.find(guide => guide.pillar === 'Nutrition')!;
  const idea = guide.ideas.find(idea => idea.id === 'food-beans-lentils')!;
  await page.locator('#idea-' + idea.id).getByRole('link').click();
  await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue(idea.text);
  await expect(page.locator('.hc-plan-guide-origin')).toBeVisible();
  await page.getByLabel('One manageable action', { exact: true }).fill('My own smaller meal idea.');
  await expect(page.locator('.hc-plan-guide-origin')).toHaveCount(0);
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('weekly notes survive only explicit saving and restoring on a narrow layout', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/next-step?pillar=sleep');
  await page.getByLabel('One manageable action', { exact: true }).fill('Read a paragraph.');
  await startWeek(page);
  await page.locator('#seven-day-plan summary').first().click();
  await page.getByLabel('Day 1: what happened?', { exact: true }).selectOption('adapted');
  await page.getByLabel('Day 1: a note', { exact: false }).fill('A shorter version — ゆっくり');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
  await page.getByRole('button', { name: 'Save week and all drafts', exact: true }).click();
  await page.reload();
  await expect(page.locator('.hc-week-days')).toHaveCount(0);
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await expect(page.locator('#seven-day-plan')).toBeFocused();
  await page.locator('#seven-day-plan summary').first().click();
  await expect(page.getByLabel('Day 1: what happened?', { exact: true })).toHaveValue('adapted');
  await expect(page.getByLabel('Day 1: a note', { exact: false })).toHaveValue('A shorter version — ゆっくり');
  await page.getByLabel('Day 1: a note', { exact: false }).fill('A page-only edit.');
  await expect(page.locator('.hc-plan-unsaved')).toContainText('You have page changes to save.');
  const raw = await page.evaluate(key => localStorage.getItem(key), KEY);
  expect(JSON.parse(raw!).drafts.Sleep.week.days[0].note).toBe('A shorter version — ゆっくり');
  const layout = await page.evaluate(() => ({ viewport: innerWidth, documentWidth: document.documentElement.scrollWidth }));
  expect(layout.documentWidth, JSON.stringify(layout)).toBeLessThanOrEqual(layout.viewport);
  const summary = page.getByRole('region', { name: 'Your week at a glance', exact: true });
  await summary.getByLabel('Day to open', { exact: true }).selectOption('6');
  await summary.getByRole('button', { name: 'Open selected day', exact: true }).click();
  await expect(page.getByLabel('Day 7: what happened?', { exact: true })).toBeFocused();
  await page.getByLabel('Day 7: what happened?', { exact: true }).selectOption('rest');
  await expect(page.getByLabel('Day 7: what happened?', { exact: true })).toHaveValue('rest');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('backup review, import and blob download preserve the manual save boundary', async ({ page }) => {
  await page.goto('/next-step');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), KEY);
  const incoming = backup();
  await page.getByLabel('Choose a Healthcrest backup', { exact: true }).setInputFiles({
    name: 'compatibility.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(incoming)),
  });
  await expect(page.getByRole('heading', { name: 'Review this backup', exact: true })).toBeFocused();
  await page.locator('.hc-backup-compare summary').click();
  await expect(page.locator('.hc-backup-compare').getByRole('article', { name: 'Sleep', exact: true })).toContainText('A current week will be added');
  await page.getByRole('button', { name: 'Replace page drafts with backup', exact: true }).click();
  await expect(page.locator('#seven-day-plan')).toBeFocused();
  await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('Imported Sleep action.');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download all-pillar backup', exact: true }).click();
  const file = await downloading;
  expect(file.suggestedFilename()).toBe('healthcrest-plan-backup.json');
  expect(JSON.parse(await downloadText(file))).toEqual(incoming);
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(saved);
});
test('generic calendar files download with storage blocked and no planner measurement', async ({ page }) => {
  const outbound: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' || new URL(request.url()).pathname.startsWith('/_vercel/')) outbound.push(request.url());
  });
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem', 'removeItem']) {
      Object.defineProperty(Storage.prototype, method, { configurable: true, value: () => { throw new DOMException('Blocked', 'SecurityError'); } });
    }
  });
  await page.goto('/next-step?pillar=stress');
  await page.getByLabel('One manageable action', { exact: true }).fill('PRIVATE-CALENDAR-ACTION');
  await startWeek(page);
  await page.locator('#seven-day-plan summary').first().click();
  await page.getByLabel('Day 1: a note', { exact: false }).fill('PRIVATE-CALENDAR-NOTE');
  const calendar = page.locator('.hc-week-calendar');
  await calendar.getByLabel('Check-in time', { exact: true }).fill('09:15');
  const downloading = page.waitForEvent('download');
  await calendar.getByRole('button', { name: 'Download calendar reminders', exact: true }).click();
  const file = await downloading;
  expect(file.suggestedFilename()).toBe('healthcrest-check-ins.ics');
  const text = (await downloadText(file)).replace(/\r\n /g, '');
  expect(text.match(/^BEGIN:VEVENT$/gm)).toHaveLength(7);
  expect(text).toContain('DTSTART:20261029T091500');
  expect(text).toContain('DTSTART:20261104T091500');
  expect(text).not.toContain('PRIVATE-');
  expect(outbound).toEqual([]);
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Saving is unavailable');
});
test('labelled 2D settings and guide keyboard focus work without WebGL', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.route('**/api/presets', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: FALLBACK_PRESETS }),
  }));
  await page.goto('/engine?pillar=sleep&view=2d');
  const overview = page.getByRole('region', { name: '2D health overview', exact: true });
  await expect(overview).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  const sleep = page.getByRole('slider', { name: 'Sleep Duration', exact: true });
  await sleep.focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await expect(sleep).toHaveValue('4.5');
  await expect(overview.getByRole('img', { name: 'Current parameter illustration', exact: true })).toHaveAccessibleDescription(/Sleep duration: 4\.5 hours per night/);
  const button = page.getByRole('button', { name: 'Guide: understand this view', exact: true });
  await button.click();
  const dialog = page.getByRole('dialog', { name: 'Understand this view', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: /^NHS:/ })).toHaveAttribute('href', 'https://www.nhs.uk/conditions/insomnia/');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(button).toBeFocused();
  await expect(sleep).toHaveValue('4.5');
  await page.setViewportSize({ width: 1350, height: 940 });
  const summary = page.getByRole('region', { name: 'Scenario summary', exact: true });
  await expect(summary.getByRole('heading', { level: 2, name: 'SCENARIO SUMMARY', exact: true })).toBeVisible();
  await expect(summary.getByRole('heading', { level: 3, name: 'Support sleep and recovery', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Camera controls', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Camera controls', exact: true })).toHaveCount(0);
  const bounds = await overview.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x + bounds!.width).toBeCloseTo(1350 - 24, 0);
  await overview.focus();
  await expect(overview).toBeFocused();
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(sleep).toHaveValue('4.5');
  const topics = page.getByRole('navigation', { name: 'Habit topics', exact: true });
  for (const label of ['Movement', 'Food', 'Sleep', 'Stress & support', 'Connected habits']) {
    const topic = topics.getByRole('button', { name: label, exact: true });
    await topic.focus();
    await page.keyboard.press('Enter');
    await expect(topic).toHaveAttribute('aria-pressed', 'true');
    await expect(overview.getByText('Selected topic: ' + label, { exact: true })).toBeVisible();
    await expect(sleep).toHaveValue('4.5');
  }
  const compare = page.getByRole('button', { name: 'Compare starting and current settings', exact: true });
  await compare.click();
  const comparison = page.getByRole('dialog', { name: 'Starting and current settings', exact: true });
  const summarySleep = comparison.getByRole('table', { name: 'Settings at a glance', exact: true }).getByRole('row').filter({ hasText: 'Sleep duration' });
  await expect(summarySleep.getByRole('cell').first()).toHaveText('8');
  await expect(summarySleep.getByRole('cell').nth(1)).toHaveText(/^4\.5\s*Changed$/);
  const restore = comparison.getByRole('button', { name: 'Restore starting settings', exact: true });
  await restore.focus();
  await page.keyboard.press('Enter');
  await expect(comparison.getByRole('status')).toContainText('No settings have changed');
  await expect(summarySleep.getByRole('cell').nth(1)).toHaveText(/^8\s*Unchanged$/);
  await expect(restore).toBeDisabled();
  await expect(restore).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(compare).toBeFocused();
  await expect(sleep).toHaveValue('8');
  await expect(topics.getByRole('button', { name: 'Connected habits', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('canvas')).toHaveCount(0);
});
test('guide-to-plan navigation and missing-page recovery are server rendered without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto('/learn/movement-and-strength');
    const guide = LEARNING_GUIDES.find(guide => guide.pillar === 'Fitness')!;
    const idea = guide.ideas[0];
    await page.locator('#idea-' + idea.id).getByRole('link').click();
    await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue(idea.text);
    await expect(page.getByText(/Enable JavaScript to switch pillars/)).toBeVisible();
    const response = await page.goto('/learn/not-a-guide');
    expect(response?.status()).toBe(404);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  } finally { await context.close(); }
});
