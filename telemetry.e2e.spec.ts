import { readFile } from 'node:fs/promises';
import { test, expect, type Page } from '@playwright/test';
import { MEASUREMENT_CHOICE_KEY, CHOICE_LIFETIME_MS } from './lib/privacy/measurement';

type TransportWindow = Window & {
  __hcMeasurementTransport: {
    emitPage: (event?: { type: string; url: string }) => Promise<unknown>;
    emitVital: (event?: { type: string; url: string }) => Promise<unknown>;
  };
};

async function transport(page: Page) {
  const fixture = await readFile(new URL('./e2e/fixtures/measurement-transport.js', import.meta.url), 'utf8');
  const scripts: string[] = [];
  const sent: Array<{ path: string; body: Record<string, unknown> }> = [];
  await page.route('**/_vercel/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/script.js')) {
      scripts.push(path);
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: fixture.replace('__KIND__', path.includes('speed-insights') ? 'performance' : 'analytics') });
    }
    if (route.request().method() === 'POST') {
      sent.push({ path, body: route.request().postDataJSON() as Record<string, unknown> });
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
    return route.fulfill({ status: 404, body: '' });
  });
  return { scripts, sent };
}

async function seedChoice(page: Page, analytics: boolean, performance: boolean, savedAt = Date.now()) {
  await page.addInitScript(({ key, analytics, performance, savedAt }) => {
    localStorage.setItem(key, JSON.stringify({ version: 1, analytics, performance, savedAt }));
  }, { key: MEASUREMENT_CHOICE_KEY, analytics, performance, savedAt });
}

test('no optional script or beacon is sent before permission, after decline or on private pages', async ({ page }) => {
  const network = await transport(page);
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Choose your privacy settings', exact: true })).toBeVisible();
  await page.goto('/privacy');
  await expect(page.getByRole('checkbox', { name: /^Allow usage statistics/ })).not.toBeChecked();
  await expect(page.getByRole('checkbox', { name: /^Allow performance measurement/ })).not.toBeChecked();
  await page.getByRole('button', { name: 'Keep optional measurement off', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('usage statistics off; performance measurement off');
  await page.goto('/learn');
  expect(network.scripts).toEqual([]);
  expect(network.sent).toEqual([]);
  await seedChoice(page, true, true);
  await page.goto('/next-step?pillar=stress');
  await expect(page.getByRole('textbox', { name: 'One manageable action', exact: true })).toBeVisible();
  await page.goto('/privacy');
  expect(network.scripts).toEqual([]);
  expect(network.sent).toEqual([]);
});

test('independent opt-in runs the installed SDKs and sends only filtered URL metadata', async ({ page }) => {
  const network = await transport(page);
  await page.goto('/privacy');
  await page.getByRole('checkbox', { name: /^Allow performance measurement/ }).check();
  await page.getByRole('button', { name: 'Save my choices', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('usage statistics off; performance measurement allowed');
  await page.goto('/learn?pillar=stress&idea=access#PRIVATE-NOTE');
  await expect.poll(() => network.sent.length).toBeGreaterThan(0);
  expect(network.scripts).toEqual(['/_vercel/speed-insights/script.js']);
  expect(network.sent[0].body).toMatchObject({ type: 'vital', route: '/learn' });
  expect(network.sent[0].body.url).toBe(new URL('/learn', page.url()).toString());
  expect(JSON.stringify(network.sent)).not.toMatch(/pillar|idea|PRIVATE|DO-NOT-SEND/);

  await page.goto('/privacy');
  await page.getByRole('checkbox', { name: /^Allow usage statistics/ }).check();
  await page.getByRole('button', { name: 'Save my choices', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('usage statistics allowed; performance measurement allowed');
  network.sent.length = 0;
  await page.goto('/start?pillar=sleep&idea=routine#PRIVATE-NOTE');
  await expect.poll(() => network.sent.filter(item => item.body.type === 'pageview').length).toBeGreaterThan(0);
  await expect.poll(() => network.sent.filter(item => item.body.type === 'vital').length).toBeGreaterThan(0);
  expect(JSON.stringify(network.sent)).not.toMatch(/pillar|idea|PRIVATE|DO-NOT-SEND/);
  for (const item of network.sent) expect(item.body.url).toBe(new URL('/start', page.url()).toString());
  await page.evaluate(async () => {
    const w = window as unknown as TransportWindow;
    await w.__hcMeasurementTransport.emitPage({ type: 'event', url: location.href });
  });
  expect(network.sent.filter(item => item.body.type === 'event')).toHaveLength(0);
});

test('a later withdrawal blocks queued SDK calls and does not touch a saved habit draft', async ({ page }) => {
  const network = await transport(page);
  await seedChoice(page, true, true);
  await page.goto('/learn?pillar=sleep');
  await expect.poll(() => network.sent.length).toBeGreaterThan(1);
  const kept = 'MY-PRIVATE-SAVED-PLAN';
  await page.evaluate(value => localStorage.setItem('healthcrest.habit-draft.v1', value), kept);
  network.sent.length = 0;
  await page.evaluate(async key => {
    localStorage.setItem(key, JSON.stringify({ version: 1, analytics: false, performance: false, savedAt: Date.now() }));
    dispatchEvent(new StorageEvent('storage', { key }));
    const w = window as unknown as TransportWindow;
    await w.__hcMeasurementTransport.emitPage();
    await w.__hcMeasurementTransport.emitVital();
  }, MEASUREMENT_CHOICE_KEY);
  expect(network.sent).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBe(kept);
});

test('entering the planner blocks already-loaded SDK callbacks on client navigation', async ({ page }) => {
  const network = await transport(page);
  await seedChoice(page, true, true);
  await page.goto('/learn?pillar=sleep&idea=time');
  await expect.poll(() => network.sent.length).toBeGreaterThan(1);
  await page.getByRole('article', { name: 'Sleep', exact: true }).getByRole('link', { name: 'Make a next step', exact: true }).click();
  await expect(page).toHaveURL(/\/next-step\?pillar=sleep&idea=time$/);
  network.sent.length = 0;
  await page.evaluate(async () => {
    const w = window as unknown as TransportWindow;
    await w.__hcMeasurementTransport.emitPage();
    await w.__hcMeasurementTransport.emitVital();
  });
  expect(network.sent).toEqual([]);
});

for (const protection of ['expired', 'malformed', 'privacy-signal', 'blocked-storage'] as const) {
  test('measurement fails closed for ' + protection, async ({ page }) => {
    const network = await transport(page);
    await seedChoice(page, true, true, protection === 'expired' ? Date.now() - CHOICE_LIFETIME_MS : Date.now());
    if (protection === 'malformed') await page.addInitScript(key => localStorage.setItem(key, '{broken'), MEASUREMENT_CHOICE_KEY);
    if (protection === 'privacy-signal') await page.addInitScript(() => Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true }));
    if (protection === 'blocked-storage') await page.addInitScript(() => {
      Object.defineProperty(Storage.prototype, 'getItem', { value: () => { throw new DOMException('Blocked', 'SecurityError'); } });
      Object.defineProperty(Storage.prototype, 'setItem', { value: () => { throw new DOMException('Blocked', 'SecurityError'); } });
    });
    await page.goto('/learn');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Learn the basics');
    expect(network.scripts).toEqual([]);
    expect(network.sent).toEqual([]);
  });
}

for (const width of [320, 390, 768, 1440]) {
  test('privacy controls are readable and keyboard accessible at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/privacy');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
    const checkbox = page.getByRole('checkbox', { name: /^Allow usage statistics/ });
    await checkbox.focus();
    await page.keyboard.press('Space');
    await expect(checkbox).toBeChecked();
    await page.keyboard.press('Space');
    await expect(checkbox).not.toBeChecked();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('JavaScript-disabled privacy page explains that optional measurement is off', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Privacy and');
    await expect(page.locator('.hc-privacy-choices form')).toBeHidden();
    await expect(page.locator('script[src*="/_vercel/"]')).toHaveCount(0);
  } finally { await context.close(); }
});
