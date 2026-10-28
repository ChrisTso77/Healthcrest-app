import { test, expect, type Page } from '@playwright/test';

const KEY = 'healthcrest.habit-draft.v1';
const action = (page: Page) => page.getByLabel('One manageable action', { exact: true });
const prepare = (page: Page) => page.getByRole('button', { name: 'Prepare another week', exact: true });
const newAction = (page: Page) => page.getByLabel('Action for the new week', { exact: true });
const confirmation = (page: Page) => page.getByRole('group', { name: 'Replace this week’s page record?', exact: true });
async function start(page: Page, date = '2026-10-28') {
  await page.getByLabel('Start date', { exact: false }).fill(date);
  await page.getByRole('button', { name: 'Start seven-day plan', exact: true }).click();
}
async function backup(page: Page, name: string) {
  const waiting = page.waitForEvent('download');
  await page.getByRole('button', { name, exact: true }).click();
  const file = await waiting;
  expect(file.suggestedFilename()).toBe('healthcrest-plan-backup.json');
  const stream = await file.createReadStream();
  if (!stream) throw new Error('No backup stream');
  const parts: Buffer[] = [];
  for await (const part of stream) parts.push(Buffer.from(part));
  return Buffer.concat(parts);
}
async function review(page: Page, text = 'Try one paragraph.', date = '2026-11-04') {
  await newAction(page).fill(text);
  await page.getByLabel('New week start date', { exact: false }).fill(date);
  await page.getByRole('button', { name: 'Review new week', exact: true }).click();
}

test('a backed-up week can be recovered after explicit replacement and saving a new week', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await action(page).fill('Read one page.');
  await page.getByLabel('When will I try it?', { exact: false }).fill('After brushing my teeth.');
  await page.getByLabel('What could make it easier?', { exact: false }).fill('Keep a book nearby.');
  await page.getByLabel('What did I learn?', { exact: false }).fill('Keep this general reflection.');
  await start(page);
  await page.locator('#seven-day-plan summary').first().click();
  await page.getByLabel('Day 1: what happened?', { exact: true }).selectOption('adapted');
  await page.getByLabel('Day 1: a note', { exact: false }).fill('One paragraph fitted — ゆっくり');
  await page.getByLabel('What did this week teach me?', { exact: false }).fill('A shorter action fitted.');
  await page.getByLabel('An action I might try next', { exact: false }).fill('Try one paragraph.');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const oldSaved = await page.evaluate(key => localStorage.getItem(key), KEY);
  await prepare(page).click();
  await expect(newAction(page)).toBeFocused();
  await expect(newAction(page)).toHaveValue('Try one paragraph.');
  await page.getByLabel('When will I try the new action?', { exact: false }).fill('After my evening meal.');
  await page.getByLabel('What could help with the new action?', { exact: false }).fill('A quiet corner.');
  await page.getByLabel('New week start date', { exact: false }).fill('2026-11-04');
  const bytes = await backup(page, 'Download backup of current plans');
  const oldRecord = JSON.parse(bytes.toString('utf8'));
  expect(oldRecord).toEqual(JSON.parse(oldSaved!));
  await page.getByRole('button', { name: 'Review new week', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Replace this week’s page record?', exact: true })).toBeFocused();
  await expect(page.getByLabel('Action for this week', { exact: true })).toContainText('Read one page.');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(oldSaved);
  await confirmation(page).getByRole('button', { name: 'Replace with this new week', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your seven-day habit plan', exact: true })).toBeFocused();
  await expect(action(page)).toHaveValue('Try one paragraph.');
  await expect(page.getByLabel('When will I try it?', { exact: false })).toHaveValue('After my evening meal.');
  await expect(page.getByLabel('What could make it easier?', { exact: false })).toHaveValue('A quiet corner.');
  await expect(page.getByLabel('What did I learn?', { exact: false })).toHaveValue('Keep this general reflection.');
  await expect(page.getByLabel('Day 1: a note', { exact: false })).toHaveValue('');
  await expect(page.getByLabel('Day 1: what happened?', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('What did this week teach me?', { exact: false })).toHaveValue('');
  await expect(page.getByLabel('An action I might try next', { exact: false })).toHaveValue('');
  const changed = JSON.parse((await backup(page, 'Download all-pillar backup')).toString('utf8'));
  expect(changed.drafts.Nutrition).toEqual(oldRecord.drafts.Nutrition);
  expect(changed.drafts.Fitness).toEqual(oldRecord.drafts.Fitness);
  expect(changed.drafts.Stress).toEqual(oldRecord.drafts.Stress);
  expect(changed.drafts.Sleep.week.startDate).toBe('2026-11-04');
  expect(changed.drafts.Sleep.week.days).toEqual(Array.from({ length: 7 }, () => ({ choice: '', note: '' })));
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(oldSaved);
  await page.getByRole('button', { name: 'Save week and all drafts', exact: true }).click();
  const newSaved = await page.evaluate(key => localStorage.getItem(key), KEY);
  await page.reload();
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await expect(action(page)).toHaveValue('Try one paragraph.');
  await page.getByLabel('Choose a Healthcrest backup', { exact: true }).setInputFiles({ name: 'old-week.json', mimeType: 'application/json', buffer: bytes });
  await page.getByRole('button', { name: 'Replace page drafts with backup', exact: true }).click();
  await expect(action(page)).toHaveValue('Read one page.');
  await page.locator('#seven-day-plan summary').first().click();
  await expect(page.getByLabel('Day 1: a note', { exact: false })).toHaveValue('One paragraph fitted — ゆっくり');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(newSaved);
});

test('cancelling either stage and returning to editing preserves current plans and saved data', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await action(page).fill('Keep the original action.');
  await start(page);
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), KEY);
  await prepare(page).click();
  await newAction(page).fill('A pending change.');
  await page.getByRole('button', { name: 'Cancel new week preparation', exact: true }).click();
  await expect(prepare(page)).toBeFocused();
  await expect(action(page)).toHaveValue('Keep the original action.');
  await prepare(page).click();
  await expect(newAction(page)).toHaveValue('Keep the original action.');
  await review(page);
  await confirmation(page).getByRole('button', { name: 'Keep editing new week', exact: true }).click();
  await expect(newAction(page)).toBeFocused();
  await review(page, 'A revised pending action.');
  await page.getByRole('button', { name: 'Cancel new week preparation', exact: true }).click();
  await expect(prepare(page)).toBeFocused();
  await expect(action(page)).toHaveValue('Keep the original action.');
  await expect(page.getByLabel('Action for this week', { exact: true })).toContainText('Keep the original action.');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(saved);
});

test('invalid action cannot replace the current week and leap-day dates remain seven calendar days', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await action(page).fill('Keep this week.');
  await start(page, '2024-02-21');
  await prepare(page).click();
  await review(page, '   ', '2024-02-29');
  await expect(page.getByRole('alert')).toContainText('valid start date and a manageable action');
  await expect(confirmation(page)).toHaveCount(0);
  await expect(action(page)).toHaveValue('Keep this week.');
  await review(page, 'A new action.', '2024-02-29');
  expect(await confirmation(page).locator('time').evaluateAll(nodes => nodes.map(node => node.getAttribute('datetime')))).toEqual(['2024-02-29', '2024-03-06']);
  await confirmation(page).getByRole('button', { name: 'Replace with this new week', exact: true }).click();
  expect(await page.locator('#seven-day-plan summary time').evaluateAll(nodes => nodes.map(node => node.getAttribute('datetime')))).toEqual([
    '2024-02-29', '2024-03-01', '2024-03-02', '2024-03-03', '2024-03-04', '2024-03-05', '2024-03-06',
  ]);
});

test('blank new-week date uses the device calendar across a year boundary', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, timezoneId: 'Pacific/Auckland' });
  const page = await context.newPage();
  await page.clock.setFixedTime(new Date('2026-12-31T12:30:00Z'));
  await page.goto('/next-step?pillar=sleep');
  await start(page, '2026-12-24');
  await prepare(page).click();
  await page.getByRole('button', { name: 'Review new week', exact: true }).click();
  await expect(confirmation(page).locator('time').first()).toHaveAttribute('datetime', '2027-01-01');
  await confirmation(page).getByRole('button', { name: 'Replace with this new week', exact: true }).click();
  await expect(page.locator('#seven-day-plan summary time').first()).toHaveAttribute('datetime', '2027-01-01');
  await expect(page.locator('#seven-day-plan summary time').last()).toHaveAttribute('datetime', '2027-01-07');
  await context.close();
});

test('failed backup and blocked storage keep the old week editable and send no planner data', async ({ page }) => {
  const outbound: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' || /\/_vercel\//.test(request.url())) outbound.push(request.url());
  });
  await page.addInitScript(() => localStorage.setItem('healthcrest.measurement-choice.v1', JSON.stringify({
    version: 1, analytics: true, performance: true, savedAt: Date.now(),
  })));
  await page.goto('/next-step?pillar=stress');
  await action(page).fill('Keep the current chosen action.');
  await start(page);
  await page.locator('#seven-day-plan summary').first().click();
  await page.getByLabel('Day 1: a note', { exact: false }).fill('PRIVATE-OLD-WEEK-NOTE');
  await page.evaluate(() => {
    URL.createObjectURL = () => { throw new Error('Download unavailable'); };
    Object.defineProperty(Storage.prototype, 'setItem', { value: () => { throw new DOMException('Blocked', 'SecurityError'); } });
  });
  await prepare(page).click();
  await page.getByRole('button', { name: 'Download backup of current plans', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Backup download is unavailable');
  await expect(page.getByLabel('Day 1: a note', { exact: false })).toHaveValue('PRIVATE-OLD-WEEK-NOTE');
  await review(page);
  await page.getByRole('button', { name: 'Cancel new week preparation', exact: true }).click();
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Saving is unavailable');
  await expect(action(page)).toHaveValue('Keep the current chosen action.');
  expect(outbound).toEqual([]);
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
});

test('restoring, importing or changing pillars removes stale replacement preparations', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await start(page);
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const bytes = await backup(page, 'Download all-pillar backup');
  await prepare(page).click();
  await review(page, 'Stale restore proposal.');
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await expect(newAction(page)).toHaveCount(0);
  await expect(confirmation(page)).toHaveCount(0);
  await expect(prepare(page)).toBeVisible();
  await prepare(page).click();
  await review(page, 'Stale import proposal.');
  await page.getByLabel('Choose a Healthcrest backup', { exact: true }).setInputFiles({ name: 'saved-week.json', mimeType: 'application/json', buffer: bytes });
  await page.getByRole('button', { name: 'Replace page drafts with backup', exact: true }).click();
  await expect(confirmation(page)).toHaveCount(0);
  await prepare(page).click();
  await newAction(page).fill('Stale pillar proposal.');
  const pillars = page.getByRole('group', { name: 'Choose a habit pillar', exact: true });
  await pillars.getByRole('button', { name: 'Food', exact: true }).click();
  await pillars.getByRole('button', { name: 'Sleep', exact: true }).click();
  await expect(newAction(page)).toHaveCount(0);
  await expect(prepare(page)).toBeVisible();
});

for (const width of [320, 1440]) {
  test('new-week review supports keyboard focus at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/next-step?pillar=sleep');
    await start(page);
    await page.getByRole('button', { name: 'Clear this week to start another', exact: true }).click();
    await prepare(page).focus();
    await page.keyboard.press('Enter');
    await expect(newAction(page)).toBeFocused();
    await newAction(page).fill('A'.repeat(300));
    await page.getByLabel('New week start date', { exact: false }).fill('2026-11-04');
    await page.getByRole('button', { name: 'Review new week', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Replace this week’s page record?', exact: true })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await confirmation(page).getByRole('button', { name: 'Replace with this new week', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Your seven-day habit plan', exact: true })).toBeFocused();
    await expect(page.getByRole('button', { name: 'Clear current week', exact: true })).toHaveCount(0);
    await expect(page.locator('.hc-plan-unsaved')).toContainText('You have page changes to save.');
  });
}
