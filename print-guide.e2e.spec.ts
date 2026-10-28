import { test, expect } from '@playwright/test';
import { LEARNING_GUIDES, GUIDE_SOURCE_CHECKED_ON } from './lib/education/learningGuides';
import { SITE_URL } from './lib/siteMetadata';

const KEY = 'healthcrest.habit-draft.v1';
for (const guide of LEARNING_GUIDES) {
  test(guide.slug + ' prints complete guidance and readable scoped sources in a real PDF', async ({ page }) => {
    await page.setViewportSize({ width: 670, height: 900 });
    await page.goto('/learn/' + guide.slug + '?idea=routine&extra=PRIVATE-QUERY');
    await expect(page.locator('.hc-guide-print-only').first()).toBeHidden();
    await expect(page.getByRole('button', { name: 'Print this guide', exact: true })).toBeVisible();
    await page.emulateMedia({ media: 'print' });
    const article = page.getByRole('article');
    await expect(article).toBeVisible();
    await expect(article.getByRole('heading', { level: 1 })).toHaveText(guide.title);
    await expect(article).toContainText(guide.audience);
    await expect(article.locator('time')).toHaveAttribute('datetime', GUIDE_SOURCE_CHECKED_ON);
    const canonical = SITE_URL + '/learn/' + guide.slug;
    await expect(article.locator('.hc-guide-print-only').first()).toContainText(canonical);
    await expect(article).not.toContainText('PRIVATE-QUERY');
    await expect(article).toContainText('alongside appropriate clinical care');
    await expect(page.locator('.hc-header')).toBeHidden();
    await expect(page.locator('.hc-footer')).toBeHidden();
    await expect(page.getByRole('navigation', { name: 'In this guide', exact: true })).toHaveCount(0);
    await expect(page.locator('.hc-guide-tools')).toBeHidden();
    await expect(page.locator('.hc-guide-related')).toBeHidden();
    await expect(page.locator('.hc-guide-print-controls')).toBeHidden();
    await expect(page.locator('.hc-guide-practice .hc-button')).toBeHidden();
    for (const section of guide.sections) {
      const block = page.locator('#' + section.id);
      await expect(block).toBeVisible();
      for (const paragraph of section.paragraphs) await expect(block).toContainText(paragraph);
    }
    for (const source of guide.sources) {
      const reference = page.locator('#source-' + source.id);
      await expect(reference).toBeVisible();
      await expect(reference).toContainText(source.publisher);
      await expect(reference).toContainText(source.kind);
      await expect(reference).toContainText(source.supports);
      await expect(reference).toContainText(source.scope);
      await expect(reference.locator('.hc-guide-print-source-url')).toHaveText(source.url);
      await expect(reference.locator('.hc-guide-print-source-url')).toBeVisible();
      expect(await reference.locator('.hc-guide-print-source-url').evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    }
    if (guide.pillar === 'Fitness') {
      await expect(page.locator('#age-appropriate-guidance')).toBeVisible();
      await expect(page.locator('#adapt-movement')).toBeVisible();
      await expect(page.locator('.hc-movement-options')).toBeHidden();
    }
    if (guide.pillar === 'Stress') {
      const urgent = page.getByRole('complementary', { name: 'Urgent mental health support', exact: true });
      await expect(urgent).toBeVisible();
      await expect(urgent).toContainText('In England');
      await expect(urgent).toContainText('UK and Ireland');
      for (const number of ['111', '116 123', '999']) await expect(urgent.getByRole('link', { name: number, exact: true })).toBeVisible();
    }
    expect(await page.locator('.hc-guide-grid').evaluate(node => getComputedStyle(node).display)).toBe('block');
    const pdf = await page.pdf({ format: 'A4' });
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    expect((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length).toBeGreaterThan(1);
    expect(pdf.toString('latin1')).toContain(canonical);
    for (const source of guide.sources) expect(pdf.toString('latin1')).toContain(source.url);
    await page.emulateMedia({ media: 'screen' });
    await expect(page.getByRole('button', { name: 'Print this guide', exact: true })).toBeVisible();
    await expect(page.locator('.hc-guide-print-source-url').first()).toBeHidden();
    await expect(page.locator('.hc-header')).toBeVisible();
  });
}
for (const width of [320, 1440]) {
  test('printing is explicit and keyboard accessible at ' + width + 'px without sending or saving notes', async ({ page }) => {
    const outbound: string[] = [];
    page.on('request', request => {
      if (request.method() === 'POST' || new URL(request.url()).pathname.startsWith('/_vercel/')) outbound.push(request.url());
    });
    await page.addInitScript(({ key }) => {
      localStorage.setItem(key, 'PRIVATE-PLAN-COPY');
      localStorage.setItem('healthcrest.measurement-choice.v1', JSON.stringify({
        version: 1, analytics: true, performance: true, savedAt: Date.now(),
      }));
    }, { key: KEY });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/learn/balanced-meals');
    await page.evaluate(() => {
      document.documentElement.dataset.printCalls = '0';
      window.print = () => { document.documentElement.dataset.printCalls = String(Number(document.documentElement.dataset.printCalls) + 1); };
    });
    await expect(page.locator('html')).toHaveAttribute('data-print-calls', '0');
    const button = page.getByRole('button', { name: 'Print this guide', exact: true });
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('data-print-calls', '1');
    await expect(button).toBeFocused();
    expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe('PRIVATE-PLAN-COPY');
    await expect(page.getByRole('article')).not.toContainText('PRIVATE-PLAN-COPY');
    expect(outbound).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
test('a print failure leaves the guide and source navigation available', async ({ page }) => {
  await page.goto('/learn/sleep-routines');
  await page.evaluate(() => { window.print = () => { throw new Error('Printing blocked'); }; });
  await page.getByRole('button', { name: 'Print this guide', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('The print dialog could not be opened');
  await expect(page.locator('#sleep-support')).toBeVisible();
  const reference = page.locator('#source-cdc-sleep');
  await expect(reference.getByRole('link')).toHaveAttribute('href', 'https://www.cdc.gov/sleep/about/index.html');
  await page.getByRole('navigation', { name: 'In this guide', exact: true }).getByRole('link', { name: 'Sources and scope', exact: true }).click();
  await expect(page.locator('#guide-sources')).toBeFocused();
});
test('browser printing without JavaScript retains the full article and urgent-help details', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/learn/stress-and-support');
    await expect(page.locator('.hc-guide-print-controls')).toBeHidden();
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('#international-perspective')).toBeVisible();
    await expect(page.locator('#source-who-stress .hc-guide-print-source-url')).toBeVisible();
    await expect(page.locator('#source-who-stress')).toContainText('not a diagnosis or a substitute');
    const urgent = page.getByRole('complementary', { name: 'Urgent mental health support', exact: true });
    await expect(urgent.getByRole('link', { name: '111', exact: true })).toBeVisible();
    await expect(urgent.getByRole('link', { name: '116 123', exact: true })).toBeVisible();
    expect((await page.pdf({ format: 'A4' })).subarray(0, 5).toString()).toBe('%PDF-');
    expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
  } finally { await context.close(); }
});
test('guide print styles do not change the planner worksheet after client navigation', async ({ page }) => {
  await page.goto('/learn/balanced-meals');
  await page.getByRole('link', { name: 'Make my food plan', exact: true }).click();
  await expect(page).toHaveURL(/\/next-step\?pillar=nutrition$/);
  await page.getByLabel('One manageable action', { exact: true }).fill('A page-only meal idea.');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.hc-plan-print')).toBeVisible();
  await expect(page.locator('.hc-plan-print')).toContainText('A page-only meal idea.');
  await expect(page.locator('.hc-plan-print .hc-print-days li')).toHaveCount(7);
  await expect(page.locator('.hc-plan-grid')).toBeHidden();
  await expect(page.locator('.hc-header')).toBeHidden();
  expect((await page.pdf({ format: 'A4' })).subarray(0, 5).toString()).toBe('%PDF-');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
});
