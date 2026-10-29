import { test, expect, type Page } from '@playwright/test';
const KEY = 'healthcrest.habit-draft.v1';

async function startWeek(page: Page, date = '2026-10-28') {
  await page.getByLabel('Start date', { exact: false }).fill(date);
  await page.getByRole('button', { name: 'Start seven-day plan', exact: true }).click();
  await expect(page.locator('#seven-day-plan details')).toHaveCount(7);
}
async function openDay(page: Page, day: number) {
  const row = page.locator('#seven-day-plan details').nth(day - 1);
  if (!(await row.getAttribute('open') !== null)) await row.locator('summary').click();
  return row;
}
async function textDownload(page: Page) {
  const waiting = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download my next step', exact: true }).click();
  const download = await waiting;
  const stream = await download.createReadStream();
  if (!stream) throw new Error('Download stream unavailable');
  const chunks: Buffer[] = [];
  for await (const part of stream) chunks.push(Buffer.from(part));
  return Buffer.concat(chunks).toString('utf8');
}

test('a dated week keeps its original action and all seven calendar labels', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await page.getByLabel('One manageable action', { exact: true }).fill('Read one page before bed.');
  await page.getByLabel('When will I try it?', { exact: false }).fill('After brushing my teeth.');
  await startWeek(page);
  const snapshot = page.getByLabel('Action for this week', { exact: true });
  await expect(snapshot).toContainText('Read one page before bed.');
  await expect(snapshot).toContainText('After brushing my teeth.');
  const dates = await page.locator('#seven-day-plan summary time').evaluateAll(nodes => nodes.map(node => node.getAttribute('datetime')));
  expect(dates).toEqual(['2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02', '2026-11-03']);
  await page.getByLabel('One manageable action', { exact: true }).fill('An idea for a later week.');
  await expect(snapshot).toContainText('Read one page before bed.');
  await expect(snapshot).not.toContainText('An idea for a later week.');
  const row = await openDay(page, 1);
  await row.getByLabel('Day 1: what happened?', { exact: true }).selectOption('adapted');
  await row.getByLabel('Day 1: a note', { exact: false }).fill('One paragraph fitted better.');
  await expect(page.locator('#seven-day-plan')).toContainText('1 of 7 days have a check-in.');
  await expect(page.locator('#seven-day-plan summary').nth(1)).toContainText('Not recorded');
  const pillars = page.getByRole('group', { name: 'Choose a habit pillar', exact: true });
  await pillars.getByRole('button', { name: 'Food', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start seven-day plan', exact: true })).toBeVisible();
  await pillars.getByRole('button', { name: 'Sleep', exact: true }).click();
  await expect(snapshot).toContainText('Read one page before bed.');
  await openDay(page, 1);
  await expect(page.getByLabel('Day 1: a note', { exact: false })).toHaveValue('One paragraph fitted better.');
});

test('starting, checking in and reviewing never saves or sends planner data automatically', async ({ page }) => {
  const outbound: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' || new URL(request.url()).pathname.startsWith('/_vercel/')) outbound.push(request.url());
  });
  await page.addInitScript(() => localStorage.setItem('healthcrest.measurement-choice.v1', JSON.stringify({
    version: 1, analytics: true, performance: true, savedAt: Date.now(),
  })));
  await page.goto('/next-step?pillar=stress');
  await startWeek(page);
  await openDay(page, 2);
  await page.getByLabel('Day 2: what happened?', { exact: true }).selectOption('rest');
  await page.getByLabel('Day 2: a note', { exact: false }).fill('PRIVATE-CHECK-IN');
  await page.getByLabel('What did this week teach me?', { exact: false }).fill('PRIVATE-WEEK-REVIEW');
  await page.getByLabel('An action I might try next', { exact: false }).fill('Talk with a friend.');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
  expect(outbound).toEqual([]);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Start seven-day plan', exact: true })).toBeVisible();
});

test('explicit saving restores check-ins and review across pillars and removes only the saved copy', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await page.evaluate(() => localStorage.setItem('unrelated-preference', 'keep'));
  await startWeek(page);
  await openDay(page, 1);
  await page.getByLabel('Day 1: what happened?', { exact: true }).selectOption('tried');
  await page.getByLabel('Day 1: a note', { exact: false }).fill('Reading helped — ゆっくり');
  await page.getByLabel('What did this week teach me?', { exact: false }).fill('A quieter room helped.');
  await page.getByLabel('An action I might try next', { exact: false }).fill('Read one page in a quiet room.');
  const pillars = page.getByRole('group', { name: 'Choose a habit pillar', exact: true });
  await pillars.getByRole('button', { name: 'Food', exact: true }).click();
  await startWeek(page, '2026-11-04');
  await openDay(page, 7);
  await page.getByLabel('Day 7: what happened?', { exact: true }).selectOption('not-tried');
  await page.getByLabel('Day 7: a note', { exact: false }).fill('A different day suited me.');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Start seven-day plan', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await expect(pillars.getByRole('button', { name: 'Food', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await openDay(page, 7);
  await expect(page.getByLabel('Day 7: a note', { exact: false })).toHaveValue('A different day suited me.');
  await pillars.getByRole('button', { name: 'Sleep', exact: true }).click();
  await openDay(page, 1);
  await expect(page.getByLabel('Day 1: a note', { exact: false })).toHaveValue('Reading helped — ゆっくり');
  await expect(page.getByLabel('What did this week teach me?', { exact: false })).toHaveValue('A quieter room helped.');
  await page.getByRole('button', { name: 'Remove saved plan', exact: true }).click();
  await page.getByRole('button', { name: 'Remove saved copy', exact: true }).click();
  await expect(page.getByLabel('Day 1: a note', { exact: false })).toHaveValue('Reading helped — ゆっくり');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('unrelated-preference'))).toBe('keep');
});

test('version 2 drafts keep their reflection notes and upgrade only on explicit save', async ({ page }) => {
  await page.goto('/next-step');
  const legacy = { version: 2, selected: 'Sleep', drafts: Object.fromEntries(['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(pillar =>
    [pillar, { action: 'Earlier ' + pillar + ' action.', cue: 'After lunch.', support: 'Keep it small.', reflection: 'Earlier ' + pillar + ' reflection.' }])) };
  const raw = JSON.stringify(legacy);
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: KEY, raw });
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('Earlier Sleep action.');
  await expect(page.getByLabel('What did I learn?', { exact: false })).toHaveValue('Earlier Sleep reflection.');
  await startWeek(page);
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(raw);
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).version, KEY)).toBe(3);
  await page.reload();
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await expect(page.locator('#seven-day-plan details')).toHaveCount(7);
  await expect(page.getByLabel('What did I learn?', { exact: false })).toHaveValue('Earlier Sleep reflection.');
});

test('review adjustments are explicit and clearing a week requires confirmation', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await page.getByLabel('One manageable action', { exact: true }).fill('My original action.');
  await page.getByLabel('What did I learn?', { exact: false }).fill('Keep these extra notes.');
  await startWeek(page);
  await page.getByLabel('An action I might try next', { exact: false }).fill('A smaller action for next week.');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), KEY);
  await page.getByRole('button', { name: 'Use this action in my draft', exact: true }).click();
  await expect(page.getByLabel('One manageable action', { exact: true })).toBeFocused();
  await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('A smaller action for next week.');
  await expect(page.getByLabel('Action for this week', { exact: true })).toContainText('My original action.');
  const clear = page.getByRole('button', { name: 'Clear this week to start another', exact: true });
  await clear.click();
  await page.getByRole('button', { name: 'Keep this week', exact: true }).click();
  await expect(clear).toBeFocused();
  await expect(page.locator('#seven-day-plan details')).toHaveCount(7);
  await clear.click();
  await page.getByRole('button', { name: 'Clear current week', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start seven-day plan', exact: true })).toBeFocused();
  await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('A smaller action for next week.');
  await expect(page.getByLabel('What did I learn?', { exact: false })).toHaveValue('Keep these extra notes.');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(saved);
  await startWeek(page, '2026-11-04');
  await expect(page.getByLabel('Action for this week', { exact: true })).toContainText('A smaller action for next week.');
  await expect(page.locator('#seven-day-plan')).toContainText('0 of 7 days have a check-in.');
});

test('download keeps the weekly snapshot and selected pillar even with an empty current draft', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await page.getByLabel('One manageable action', { exact: true }).fill('SLEEP-WEEK-ACTION');
  await startWeek(page);
  await openDay(page, 1);
  await page.getByLabel('Day 1: what happened?', { exact: true }).selectOption('adapted');
  await page.getByLabel('Day 1: a note', { exact: false }).fill('SLEEP-NOTE');
  await page.getByLabel('What did this week teach me?', { exact: false }).fill('SLEEP-REVIEW');
  await page.getByLabel('An action I might try next', { exact: false }).fill('SLEEP-NEXT');
  const pillars = page.getByRole('group', { name: 'Choose a habit pillar', exact: true });
  await pillars.getByRole('button', { name: 'Food', exact: true }).click();
  await page.getByLabel('One manageable action', { exact: true }).fill('FOOD-PRIVATE-ACTION');
  await startWeek(page);
  await pillars.getByRole('button', { name: 'Sleep', exact: true }).click();
  await page.getByLabel('One manageable action', { exact: true }).fill('');
  const text = await textDownload(page);
  expect(text).toContain('MY SEVEN-DAY PLAN');
  expect(text).toContain('Action for this week: SLEEP-WEEK-ACTION');
  expect(text).toContain('Dates: 2026-10-28 to 2026-11-03');
  expect(text).toContain('Day 7 (2026-11-03): Not recorded');
  for (const marker of ['SLEEP-NOTE', 'SLEEP-REVIEW', 'SLEEP-NEXT']) expect(text).toContain(marker);
  expect(text).not.toContain('FOOD-PRIVATE-ACTION');
});

test('a damaged stored week never replaces current edits', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await page.getByLabel('One manageable action', { exact: true }).fill('Keep this current action.');
  await startWeek(page);
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const raw = await page.evaluate(key => localStorage.getItem(key)!, KEY);
  for (const corruption of ['date', 'choice', 'days', 'note']) {
    const data = JSON.parse(raw);
    if (corruption === 'date') data.drafts.Sleep.week.startDate = '2026-02-30';
    if (corruption === 'choice') data.drafts.Sleep.week.days[0].choice = 'perfect-score';
    if (corruption === 'days') data.drafts.Sleep.week.days.pop();
    if (corruption === 'note') data.drafts.Sleep.week.days[0].note = 'x'.repeat(181);
    await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: KEY, raw: JSON.stringify(data) });
    await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('No compatible saved draft was found.');
    await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('Keep this current action.');
    await expect(page.locator('#seven-day-plan details')).toHaveCount(7);
  }
});

test('a week can be edited and downloaded when browser saving is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem', 'removeItem']) Object.defineProperty(Storage.prototype, method, {
      value: () => { throw new DOMException('Blocked', 'SecurityError'); },
    });
  });
  await page.goto('/next-step?pillar=sleep');
  await startWeek(page);
  await openDay(page, 1);
  await page.getByLabel('Day 1: a note', { exact: false }).fill('Keep this note in the download.');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Saving is unavailable');
  expect(await textDownload(page)).toContain('Keep this note in the download.');
});

for (const width of [320, 390, 768, 1440]) {
  test('weekly controls support keyboard use at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/next-step?pillar=sleep');
    await startWeek(page);
    const summary = page.locator('#seven-day-plan summary').first();
    await summary.focus();
    await page.keyboard.press('Enter');
    const choice = page.getByLabel('Day 1: what happened?', { exact: true });
    await choice.focus();
    await page.keyboard.press('ArrowDown');
    await expect(choice).toHaveValue('tried');
    await page.keyboard.press('Tab');
    const note = page.getByLabel('Day 1: a note', { exact: false });
    await expect(note).toBeFocused();
    await note.fill('A smaller version suited me.');
    await expect(page.locator('#seven-day-plan')).toContainText('1 of 7 days have a check-in.');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const control of await page.locator('#seven-day-plan input:visible, #seven-day-plan select:visible, #seven-day-plan textarea:visible').all()) {
      const box = await control.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    }
  });
}

test('the planning explanation remains readable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/next-step?pillar=sleep');
    await expect(page.getByRole('heading', { name: 'Your seven-day habit plan', exact: true })).toBeVisible();
    await expect(page.locator('#seven-day-plan').getByText(/Seven days is a planning window/)).toBeVisible();
    await expect(page.locator('.hc-week-start')).toBeHidden();
    await expect(page.getByRole('link', { name: /NHS: sleep needs and insomnia support/ })).toBeVisible();
  } finally { await context.close(); }
});
