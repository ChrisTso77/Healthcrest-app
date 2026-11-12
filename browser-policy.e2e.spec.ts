import { test, expect, type Page } from '@playwright/test';
import { createServer } from 'node:http';

const policy = "base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'";
type PolicyWindow = Window & { policyViolations?: string[] };

async function observePolicy(page: Page) {
  await page.evaluate(() => {
    (window as PolicyWindow).policyViolations = [];
    document.addEventListener('securitypolicyviolation', event => {
      (window as PolicyWindow).policyViolations?.push(event.effectiveDirective);
    });
  });
}
async function expectViolation(page: Page, directive: string) {
  await expect.poll(() => page.evaluate(() => (window as PolicyWindow).policyViolations ?? [])).toContain(directive);
}

test('containment headers cover pages, API and icon without replacing existing headers', async ({ request }) => {
  for (const path of ['/', '/privacy', '/next-step', '/api/presets?narrative=1', '/favicon.ico']) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-security-policy']).toBe(policy);
    expect(response.headers()['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers()['referrer-policy']).toBe('no-referrer');
    expect(response.headers()['x-content-type-options']).toBe('nosniff');
    if (path === '/favicon.ico') expect(response.headers()['content-type']).toContain('image/png');
  }
});

test('a different-origin page cannot frame the planner', async ({ page, baseURL }) => {
  if (!baseURL) throw new Error('Missing test origin');
  const app = new URL(baseURL);
  const target = app.origin + '/next-step?pillar=sleep';
  const blocked: string[] = [];
  page.on('console', message => {
    if (/frame-ancestors|X-Frame-Options/i.test(message.text())) blocked.push(message.text());
  });
  // Use a real loopback origin on a different port. A route-fulfilled parent can
  // be classified as public address space and hit Local Network Access first.
  const attacker = createServer((_request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(`<iframe title="Planner" src="${target}"></iframe>`);
  });
  await new Promise<void>((resolve, reject) => {
    attacker.once('error', reject);
    attacker.listen(0, '127.0.0.1', resolve);
  });
  try {
    const address = attacker.address();
    if (!address || typeof address === 'string') throw new Error('Missing fixture port');
    expect((await page.request.get(target)).status()).toBe(200);
    await page.goto(`http://127.0.0.1:${address.port}/`);
    await expect.poll(() => blocked.length).toBeGreaterThan(0);
    await expect(page.frameLocator('iframe').locator('main')).toHaveCount(0);
  } finally {
    await new Promise<void>((resolve, reject) => {
      attacker.close(error => error ? reject(error) : resolve());
      attacker.closeAllConnections();
    });
  }
});

test('same-origin framing keeps the planner interactive without saving automatically', async ({ page, baseURL }) => {
  if (!baseURL) throw new Error('Missing test origin');
  await page.route(baseURL + '/framing-fixture', route => route.fulfill({
    contentType: 'text/html', body: '<iframe title="Planner" src="/next-step?pillar=sleep"></iframe>',
  }));
  await page.goto(baseURL + '/framing-fixture');
  const planner = page.frameLocator('iframe');
  await expect(planner.getByRole('heading', { level: 1, name: /^One habit\./ })).toBeVisible();
  await planner.getByLabel('One manageable action', { exact: true }).fill('SYNTHETIC-FRAME-ACTION');
  await expect(planner.getByLabel('One manageable action', { exact: true })).toHaveValue('SYNTHETIC-FRAME-ACTION');
  expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBeNull();
});

test('a foreign base URL cannot redirect relative links', async ({ page, baseURL }) => {
  await page.goto('/start');
  await observePolicy(page);
  const before = await page.evaluate(() => document.baseURI);
  await page.evaluate(() => {
    const base = document.createElement('base');
    base.href = 'https://example.invalid/';
    document.head.prepend(base);
  });
  await expectViolation(page, 'base-uri');
  expect(await page.evaluate(() => document.baseURI)).toBe(before);
  expect(new URL(before).origin).toBe(new URL(baseURL!).origin);
});

test('embedded objects are blocked while ordinary images and page content work', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.locator('.hc-brand img').first().evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await observePolicy(page);
  await page.evaluate(() => {
    const object = document.createElement('object');
    object.type = 'image/png';
    object.data = '/icon';
    document.body.append(object);
  });
  await expectViolation(page, 'object-src');
});

test('cross-origin form submission is blocked without leaving the current page', async ({ page, baseURL }) => {
  await page.goto('/start');
  await observePolicy(page);
  const before = page.url();
  const other = new URL(baseURL!);
  other.hostname = other.hostname === 'localhost' ? '127.0.0.1' : 'localhost';
  const attempted: string[] = [];
  page.on('request', request => { if (request.url().includes('/should-not-submit')) attempted.push(request.url()); });
  await page.evaluate(action => {
    const form = document.createElement('form');
    form.action = action;
    form.method = 'get';
    document.body.append(form);
    form.requestSubmit();
  }, other.origin + '/should-not-submit');
  await expectViolation(page, 'form-action');
  expect(page.url()).toBe(before);
  expect(attempted).toEqual([]);
});
