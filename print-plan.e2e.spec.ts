import { test, expect, type Page } from '@playwright/test';

const KEY = 'healthcrest.habit-draft.v1';
const printCopy = (page: Page) => page.locator('.hc-plan-print');
async function startWeek(page: Page) {
  await page.getByLabel('Start date', { exact: false }).fill('2026-10-28');
  await page.getByRole('button', { name: 'Start seven-day plan', exact: true }).click();
}
async function stubPrint(page: Page) {
  await page.evaluate(() => {
    document.documentElement.dataset.printCalls = '0';
    window.print = () => { document.documentElement.dataset.printCalls = String(Number(document.documentElement.dataset.printCalls) + 1); };
  });
}

test('keyboard printing uses current selected page edits without saving or sending them', async ({ page }) => {
  const outbound: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' || new URL(request.url()).pathname.startsWith('/_vercel/')) outbound.push(request.url());
  });
  await page.addInitScript(() => localStorage.setItem('healthcrest.measurement-choice.v1', JSON.stringify({
    version: 1, analytics: true, performance: true, savedAt: Date.now(),
  })));
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/next-step');
  await page.getByLabel('One manageable action', { exact: true }).fill('MOVEMENT-ONLY-PRIVATE');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), KEY);
  await page.getByRole('group', { name: 'Choose a habit pillar', exact: true }).getByRole('button', { name: 'Sleep', exact: true }).click();
  await page.getByLabel('One manageable action', { exact: true }).fill('SLEEP-PAGE-EDIT');
  await stubPrint(page);
  await expect(page.locator('html')).toHaveAttribute('data-print-calls', '0');
  await page.getByRole('button', { name: 'Print my plan', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-print-calls', '1');
  await expect(printCopy(page)).toContainText('SLEEP-PAGE-EDIT');
  await expect(printCopy(page)).not.toContainText('MOVEMENT-ONLY-PRIVATE');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(saved);
  expect(outbound).toEqual([]);
  await expect(page.locator('.hc-plan-unsaved')).toContainText('You have page changes to save.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('print media provides seven paper check-ins and hides screen controls', async ({ page }) => {
  await page.goto('/next-step?pillar=nutrition');
  await expect(printCopy(page)).toBeHidden();
  await expect(page.getByRole('button', { name: 'Print my plan', exact: true })).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await expect(printCopy(page)).toBeVisible();
  await expect(printCopy(page)).toContainText('Pillar: Food');
  await expect(printCopy(page)).toContainText('No dated week has been started');
  await expect(printCopy(page).locator('.hc-print-days li')).toHaveCount(7);
  await expect(page.locator('.hc-header')).toBeHidden();
  await expect(page.locator('.hc-footer')).toBeHidden();
  await expect(page.locator('.hc-plan-grid')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Print my plan', exact: true })).toHaveCount(0);
  await expect(printCopy(page).getByRole('link')).toHaveAttribute('href', 'https://www.healthcrest.uk/learn');
  const pdf = await page.pdf({ format: 'A4' });
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
  await page.emulateMedia({ media: 'screen' });
  await expect(printCopy(page)).toBeHidden();
  await expect(page.getByRole('button', { name: 'Print my plan', exact: true })).toBeVisible();
});

test('print copy includes closed check-ins, weekly review and the original week action', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await page.getByLabel('One manageable action', { exact: true }).fill('Original action for this week.');
  await startWeek(page);
  const day = page.locator('#seven-day-plan details').first();
  await day.locator('summary').click();
  await day.getByLabel('Day 1: what happened?', { exact: true }).selectOption('adapted');
  await day.getByLabel('Day 1: a note', { exact: false }).fill('ゆっくり — <script>plain text only</script>');
  await day.locator('summary').click();
  await page.getByLabel('What did this week teach me?', { exact: false }).fill('A shorter action fitted.');
  await page.getByLabel('An action I might try next', { exact: false }).fill('Try one paragraph.');
  await page.getByLabel('One manageable action', { exact: true }).fill('A different draft for later.');
  await page.emulateMedia({ media: 'print' });
  const copy = printCopy(page);
  await expect(copy).toContainText('Original action for this week.');
  await expect(copy).toContainText('A different draft for later.');
  await expect(copy).toContainText(/28 Oct 2026/);
  await expect(copy).toContainText(/3 Nov 2026/);
  await expect(copy).toContainText('Tried a smaller or different version');
  await expect(copy).toContainText('ゆっくり — <script>plain text only</script>');
  await expect(copy.locator('script')).toHaveCount(0);
  await expect(copy).toContainText('A shorter action fitted.');
  await expect(copy).toContainText('Try one paragraph.');
  await expect(copy.locator('.hc-print-days li').first()).toBeVisible();
});

test('maximum-length notes wrap and generate a multipage PDF', async ({ page }) => {
  await page.goto('/next-step?pillar=stress');
  await page.getByLabel('One manageable action', { exact: true }).fill('A'.repeat(300));
  await page.getByLabel('When will I try it?', { exact: false }).fill('C'.repeat(180));
  await page.getByLabel('What could make it easier?', { exact: false }).fill('S'.repeat(180));
  await page.getByLabel('What did I learn?', { exact: false }).fill('R'.repeat(500));
  await startWeek(page);
  for (let i = 0; i < 7; i++) {
    const day = page.locator('#seven-day-plan details').nth(i);
    await day.locator('summary').click();
    await day.getByLabel('Day ' + (i + 1) + ': a note', { exact: false }).fill(String(i + 1).repeat(180));
    await day.locator('summary').click();
  }
  await page.getByLabel('What did this week teach me?', { exact: false }).fill('W'.repeat(500));
  await page.getByLabel('An action I might try next', { exact: false }).fill('N'.repeat(300));
  await page.setViewportSize({ width: 670, height: 900 });
  await page.emulateMedia({ media: 'print' });
  await expect(printCopy(page)).toContainText('7'.repeat(180));
  expect(await printCopy(page).evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
  const pdf = await page.pdf({ format: 'A4' });
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  expect((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length).toBeGreaterThan(1);
});

test('print failure offers the download fallback without losing edits', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  await page.getByLabel('One manageable action', { exact: true }).fill('Keep this chosen action.');
  await page.evaluate(() => {
    Object.defineProperty(Storage.prototype, 'setItem', { value: () => { throw new DOMException('Blocked', 'SecurityError'); } });
    window.print = () => { throw new Error('Printing blocked'); };
  });
  await page.getByRole('button', { name: 'Print my plan', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Printing is unavailable');
  await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('Keep this chosen action.');
  const waiting = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download my next step', exact: true }).click();
  expect((await waiting).suggestedFilename()).toBe('healthcrest-next-step.txt');
});

test('empty actions disable printing unless there is a current week to keep', async ({ page }) => {
  await page.goto('/next-step');
  const action = page.getByLabel('One manageable action', { exact: true });
  await action.fill('   ');
  await expect(page.getByRole('button', { name: 'Print my plan', exact: true })).toBeDisabled();
  await action.fill('A week worth keeping.');
  await startWeek(page);
  await action.fill('');
  await expect(page.getByRole('button', { name: 'Print my plan', exact: true })).toBeEnabled();
  await page.emulateMedia({ media: 'print' });
  await expect(printCopy(page)).toContainText('A week worth keeping.');
});

test('browser printing without JavaScript retains a readable starter worksheet', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/next-step?pillar=nutrition');
  await expect(page.locator('.hc-plan-print-button')).toBeHidden();
  await page.emulateMedia({ media: 'print' });
  await expect(printCopy(page)).toBeVisible();
  await expect(printCopy(page)).toContainText('Pillar: Food');
  await expect(printCopy(page)).toContainText('Add vegetables, beans or a higher-fibre food');
  await expect(printCopy(page).locator('.hc-print-days li')).toHaveCount(7);
  await context.close();
});
