import { test, expect, type Page } from '@playwright/test';
import { createHabitWeek } from './lib/education/habitWeek';

const KEY = 'healthcrest.habit-draft.v1';
const calendar = (page: Page) => page.locator('.hc-week-calendar');
async function start(page: Page, date = '2026-10-28') {
  await page.getByLabel('Start date', { exact: false }).fill(date);
  await page.getByRole('button', { name: 'Start seven-day plan', exact: true }).click();
}
async function download(page: Page) {
  const waiting = page.waitForEvent('download');
  await calendar(page).getByRole('button', { name: 'Download calendar reminders', exact: true }).click();
  const file = await waiting;
  expect(file.suggestedFilename()).toBe('healthcrest-check-ins.ics');
  const stream = await file.createReadStream();
  if (!stream) throw new Error('Calendar download unavailable');
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8').replace(/\r\n /g, '');
}
test('calendar download is explicit, finite and generic without saving or sending plan text', async ({ page }) => {
  let downloads = 0;
  const outbound: string[] = [];
  page.on('download', () => { downloads += 1; });
  page.on('request', request => {
    if (request.method() === 'POST' || new URL(request.url()).pathname.startsWith('/_vercel/')) outbound.push(request.url());
  });
  await page.addInitScript(() => localStorage.setItem('healthcrest.measurement-choice.v1', JSON.stringify({
    version: 1, analytics: true, performance: true, savedAt: Date.now(),
  })));
  await page.goto('/next-step?pillar=sleep');
  await expect(calendar(page)).toHaveCount(0);
  await page.getByLabel('One manageable action', { exact: true }).fill('PRIVATE-WEEK-ACTION');
  await start(page);
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), KEY);
  await page.getByLabel('One manageable action', { exact: true }).fill('PRIVATE-FUTURE-DRAFT');
  await page.locator('#seven-day-plan summary').first().click();
  await page.getByLabel('Day 1: a note', { exact: false }).fill('PRIVATE-DAILY-NOTE');
  await page.getByLabel('What did this week teach me?', { exact: false }).fill('PRIVATE-REVIEW');
  await page.getByLabel('What did I learn?', { exact: false }).fill('PRIVATE-REFLECTION');
  await expect(calendar(page).getByRole('button', { name: 'Download calendar reminders', exact: true })).toBeDisabled();
  await calendar(page).getByLabel('Check-in time', { exact: true }).fill('18:30');
  expect(downloads).toBe(0);
  const text = await download(page);
  expect(downloads).toBe(1);
  expect(text.match(/^BEGIN:VEVENT$/gm)).toHaveLength(7);
  expect(text).toContain('DTSTART:20261028T183000');
  expect(text).toContain('DTSTART:20261103T183000');
  expect(text).toContain('URL:https://www.healthcrest.uk/next-step#return-to-plan');
  expect(text).not.toMatch(/PRIVATE-|Sleep|RRULE|ATTENDEE|ORGANIZER/);
  await expect(calendar(page).locator('[aria-live="polite"]')).toContainText('Calendar download started');
  await expect(calendar(page)).toContainText('downloading it does not activate reminders');
  await expect(calendar(page)).toContainText('your calendar provider may store or sync');
  await expect(calendar(page)).toContainText('importing again may create duplicates');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(saved);
  await expect(page.locator('.hc-plan-unsaved')).toContainText('You have page changes to save.');
  expect(outbound).toEqual([]);
  await page.emulateMedia({ media: 'print' });
  await expect(calendar(page)).toBeHidden();
  await expect(page.locator('.hc-plan-print')).toBeVisible();
});
test('time and feedback reset across pillars, restore, import, date replacement and clearing', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await start(page);
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), KEY);
  await calendar(page).getByLabel('Check-in time', { exact: true }).fill('18:30');
  await download(page);
  const pillars = page.getByRole('group', { name: 'Choose a habit pillar', exact: true });
  await pillars.getByRole('button', { name: 'Food', exact: true }).click();
  await expect(calendar(page)).toHaveCount(0);
  await start(page, '2026-11-04');
  await expect(calendar(page).getByLabel('Check-in time', { exact: true })).toHaveValue('');
  await calendar(page).getByLabel('Check-in time', { exact: true }).fill('09:00');
  await pillars.getByRole('button', { name: 'Sleep', exact: true }).click();
  await expect(calendar(page).getByLabel('Check-in time', { exact: true })).toHaveValue('');
  await calendar(page).getByLabel('Check-in time', { exact: true }).fill('20:00');
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await expect(calendar(page).getByLabel('Check-in time', { exact: true })).toHaveValue('');
  const incoming = JSON.parse(saved!);
  incoming.selected = 'Nutrition';
  incoming.drafts.Nutrition.week = createHabitWeek('2026-12-31', incoming.drafts.Nutrition);
  await page.getByLabel('Choose a Healthcrest backup', { exact: true }).setInputFiles({
    name: 'calendar-dates.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(incoming)),
  });
  await page.getByRole('button', { name: 'Replace page drafts with backup', exact: true }).click();
  await expect(calendar(page).getByLabel('Check-in time', { exact: true })).toHaveValue('');
  await calendar(page).getByLabel('Check-in time', { exact: true }).fill('00:00');
  const text = await download(page);
  expect(text).toContain('DTSTART:20261231T000000');
  expect(text).toContain('DTSTART:20270106T000000');
  await page.getByRole('button', { name: 'Prepare another week', exact: true }).click();
  await page.getByLabel('New week start date', { exact: false }).fill('2027-01-07');
  await page.getByRole('button', { name: 'Review new week', exact: true }).click();
  await page.getByRole('button', { name: 'Replace with this new week', exact: true }).click();
  await expect(calendar(page).getByLabel('Check-in time', { exact: true })).toHaveValue('');
  await expect(calendar(page).locator('[aria-live="polite"]')).toBeEmpty();
  await page.getByRole('button', { name: 'Clear this week to start another', exact: true }).click();
  await page.getByRole('button', { name: 'Clear current week', exact: true }).click();
  await expect(calendar(page)).toHaveCount(0);
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(saved);
});
test('download failure keeps the week and chosen time while calendars work with blocked storage', async ({ page }) => {
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem', 'removeItem']) {
      Object.defineProperty(Storage.prototype, method, { configurable: true, value: () => { throw new DOMException('Blocked', 'SecurityError'); } });
    }
  });
  await page.goto('/next-step?pillar=sleep');
  await start(page);
  await calendar(page).getByLabel('Check-in time', { exact: true }).fill('10:15');
  await page.evaluate(() => {
    const original = URL.createObjectURL;
    (window as Window & { restoreCalendarDownload?: () => void }).restoreCalendarDownload = () => { URL.createObjectURL = original; };
    URL.createObjectURL = () => { throw new Error('Download blocked'); };
  });
  await calendar(page).getByRole('button', { name: 'Download calendar reminders', exact: true }).click();
  await expect(calendar(page).locator('[aria-live="polite"]')).toContainText('Calendar download is unavailable');
  await expect(calendar(page).getByLabel('Check-in time', { exact: true })).toHaveValue('10:15');
  await expect(page.getByLabel('Action for this week', { exact: true })).toContainText('wind-down routine');
  await page.evaluate(() => (window as Window & { restoreCalendarDownload?: () => void }).restoreCalendarDownload?.());
  expect(await download(page)).toContain('DTSTART:20261028T101500');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Saving is unavailable');
});
for (const width of [320, 1440]) {
  test('keyboard calendar export preserves local dates at ' + width + 'px in a different time zone', async ({ browser, baseURL }) => {
    const context = await browser.newContext({
      baseURL, viewport: { width, height: 900 },
      timezoneId: width === 320 ? 'Pacific/Auckland' : 'America/Los_Angeles',
    });
    try {
      const page = await context.newPage();
      await page.goto('/next-step?pillar=stress');
      await start(page, '2027-03-26');
      await calendar(page).getByLabel('Check-in time', { exact: true }).fill('01:30');
      const downloading = page.waitForEvent('download');
      await calendar(page).getByRole('button', { name: 'Download calendar reminders', exact: true }).focus();
      await page.keyboard.press('Enter');
      const stream = await (await downloading).createReadStream();
      if (!stream) throw new Error('Calendar file unavailable');
      const parts: Buffer[] = [];
      for await (const part of stream) parts.push(Buffer.from(part));
      const text = Buffer.concat(parts).toString('utf8');
      expect(text).toContain('DTSTART:20270326T013000');
      expect(text).toContain('DTSTART:20270328T013000');
      expect(text).toContain('DTSTART:20270401T013000');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
    } finally { await context.close(); }
  });
}
test('public privacy and storage guidance explain the optional calendar transfer', async ({ page }) => {
  await page.goto('/storage');
  await expect(page.getByRole('heading', { name: 'Calendar check-in files', exact: true })).toBeVisible();
  await expect(page.getByText(/A current seven-day plan can download seven generic calendar reminders/)).toContainText('leaves out your pillar, action and notes');
  await page.goto('/privacy');
  await expect(page.getByText(/Optional calendar downloads contain seven generic check-in entries/)).toContainText('does not connect Healthcrest to your calendar');
});
