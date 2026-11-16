import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';

const projectRequire = createRequire(process.cwd() + '/package.json');
const axePath = projectRequire.resolve('axe-core/axe.min.js');
const habits = ['movement', 'food', 'sleep', 'stress'];

test('hosted production context rejects pages and media even with the preview flag', async ({ request }) => {
  for (const path of ['/learn/library', ...habits.flatMap(habit => ['/learn/library/' + habit, '/learn/library/' + habit + '/video'])]) {
    const response = await request.get('http://127.0.0.1:3101' + path);
    expect(response.status(), path).toBe(404);
    expect(await response.text()).not.toContain('Small trials suggest breathwork');
  }
});

test('drafts stay out of the sitemap and carry noindex', async ({ page, request }) => {
  await page.goto('/learn/library');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain('/learn/library');
  expect(await (await request.get('/learn/library/unknown/video')).text()).toBe('Not found');
  expect((await request.get('/learn/library/unknown/video')).status()).toBe(404);
});

for (const habit of habits) test(habit + ': four levels, semantic diagram, quiz, evidence and video source work at 320px', async ({ page, request }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/learn/library/' + habit);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  for (const level of [1, 2, 3, 4]) await expect(page.getByRole('heading', { level: 2, name: new RegExp('Level ' + level) })).toBeVisible();
  await expect(page.getByRole('main').getByRole('img')).toHaveCount(1);
  await expect(page.getByRole('main').getByRole('img')).toHaveAccessibleName(/.+/);
  await page.getByRole('radio').nth(0).check();
  await page.getByRole('button', { name: 'Check my understanding' }).click();
  await expect(page.locator('.hc-education-quiz [role="status"]')).not.toHaveText(/^Choose an answer/);
  await page.getByText('Open mechanisms, research and uncertainty', { exact: true }).click();
  await expect(page.locator('#science details')).toHaveAttribute('open', '');
  const media = await request.get('/learn/library/' + habit + '/video');
  expect(media.status()).toBe(200);
  expect(media.headers()['cache-control']).toBe('private, no-store');
  const json = await media.json();
  expect(json.status).toContain('no produced video');
  expect(json.scenes).toHaveLength(4);
  expect(json.captions).toContain('WEBVTT');
  expect(json.references.every((source: { url: string }) => source.url.startsWith('https://'))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: test.info().outputPath(habit + '-mobile.png'), fullPage: true });
});

test('teen pathway hides adult actions and adult region targets without persisting or transmitting choices', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:3100')) external.push(request.url()); });
  await page.addInitScript(() => {
    const mutations: string[] = [];
    Object.defineProperty(window, '__educationMutations', { value: mutations });
    for (const name of ['setItem', 'removeItem', 'clear'] as const) {
      const original = Storage.prototype[name];
      Storage.prototype[name] = function (...args: string[]) { mutations.push(name); return Reflect.apply(original, this, args); };
    }
  });
  await page.goto('/learn/library/sleep');
  const pathway = page.getByRole('region', { name: 'Choose a reading pathway' });
  await page.getByLabel('Reading context').selectOption('older');
  await page.getByLabel('Guidance context').selectOption('uk');
  await expect(pathway).toContainText('For UK readers aged 65+');
  await expect(pathway).not.toContainText('150 moderate');
  await page.getByLabel('Reading context').selectOption('teens');
  await page.getByLabel('Guidance context').selectOption('uk');
  await expect(pathway).toContainText('8–10 hours');
  await expect(pathway).not.toContainText('150 moderate');
  await expect(pathway.getByRole('link', { name: 'Adapt an adult next step' })).toHaveCount(0);
  await expect(pathway.getByRole('link', { name: /Explore the labelled adult/ })).toHaveCount(0);
  expect(await page.evaluate(() => (window as unknown as { __educationMutations: string[] }).__educationMutations)).toEqual([]);
  expect(external).toEqual([]);
  await page.reload();
  await expect(page.getByLabel('Reading context')).toHaveValue('beginner');
});

test('keyboard can use disclosures and quiz with visible focus', async ({ page }) => {
  await page.goto('/learn/library/movement');
  const summary = page.getByText('Open mechanisms, research and uncertainty', { exact: true });
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#science details')).toHaveAttribute('open', '');
  await page.getByRole('radio').first().focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Check my understanding' })).toBeFocused();
  expect(await page.locator(':focus').evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter');
  await expect(page.locator('.hc-education-quiz [role="status"]')).toContainText('That is right');
});

test('reading the preview from Planner leaves unsaved edits in the original tab', async ({ page }) => {
  await page.goto('/next-step?pillar=nutrition');
  const action = page.getByLabel('One manageable action', { exact: true });
  await action.fill('Synthetic review action kept in this tab');
  const link = page.getByRole('link', { name: 'Explore the four-level learning library (opens in a new tab)' });
  await expect(link).toHaveAttribute('target', '_blank');
  const popup = page.waitForEvent('popup');
  await link.click();
  const reader = await popup;
  await expect(reader.getByRole('heading', { level: 1 })).toHaveText('Four habits. Four levels of learning.');
  await expect(action).toHaveValue('Synthetic review action kept in this tab');
  await expect(page).toHaveURL(/\/next-step\?pillar=nutrition/);
  await reader.close();
});

test('learning text, evidence, diagrams and media transcript remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3100/learn/library/sleep');
  await page.getByText('Open mechanisms, research and uncertainty', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Two processes help organise sleep' })).toBeVisible();
  await page.getByText('Read the storyboard and voiceover transcript', { exact: true }).click();
  await expect(page.getByText('Sleep pressure builds with time awake.', { exact: false }).last()).toBeVisible();
  await expect(page.getByRole('main').getByRole('img')).toHaveCount(1);
  await expect(page.getByText('Interactive checking needs JavaScript.', { exact: false })).toBeVisible();
  await context.close();
});

test('all claim links resolve and each lesson has no duplicate fragment identifiers', async ({ page, request }) => {
  await page.goto('/learn/library');
  const hubIds = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
  expect(new Set(hubIds).size).toBe(hubIds.length);
  const titles = new Set<string>();
  for (const habit of habits) {
    await page.goto('/learn/library/' + habit);
    titles.add(await page.title());
    const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
    expect(new Set(ids).size, habit).toBe(ids.length);
    const links = await page.locator('.hc-education-citations a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')!));
    for (const link of links) expect(hubIds).toContain(link.split('#')[1]);
  }
  expect(titles.size).toBe(4);
  expect((await request.get('/learn/library/not-a-habit')).status()).toBe(404);
});

test('automated WCAG 2.2 AA checks cover hub and all lessons, including expanded content', async ({ page }) => {
  for (const path of ['/learn/library', ...habits.map(habit => '/learn/library/' + habit)]) {
    await page.goto(path);
    await page.locator('details').evaluateAll(nodes => nodes.forEach(node => node.setAttribute('open', '')));
    await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async () => {
      const axe = (window as unknown as { axe: { run: (context: Document, options: object) => Promise<{ violations: { id: string; impact: string; nodes: unknown[] }[] }> } }).axe;
      return (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } })).violations;
    });
    expect(violations, path + ': ' + JSON.stringify(violations)).toEqual([]);
  }
});
