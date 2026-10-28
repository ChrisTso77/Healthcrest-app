import { test, expect } from '@playwright/test';
import { LEARNING_GUIDES } from './lib/education/learningGuides';
import { SITE_URL } from './lib/siteMetadata';

for (const guide of LEARNING_GUIDES) {
  test(guide.slug + ' renders its guidance, working references and article metadata', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => { if (new URL(request.url()).pathname === '/api/presets') requests.push(request.url()); });
    const response = await page.goto('/learn/' + guide.slug + '?idea=time');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(guide.title);
    await expect(page.getByRole('article', { name: guide.title, exact: true })).toBeVisible();
    await expect(page.locator('article time')).toHaveAttribute('datetime', '2026-10-28');
    await expect(page.locator('article')).toContainText('Published by Healthcrest');
    await expect(page.locator('article')).toContainText(guide.audience);
    const canonical = SITE_URL + '/learn/' + guide.slug;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
    const schema = JSON.parse((await page.locator('main script[type="application/ld+json"]').textContent())!);
    expect(schema['@graph'][0]).toMatchObject({ '@type': 'Article', url: canonical, author: { name: 'Healthcrest' }, dateModified: '2026-10-28' });
    const references = page.locator('#guide-sources');
    for (const source of guide.sources) {
      await expect(references.getByRole('link', { name: source.title + ' (opens in a new tab)', exact: true })).toHaveAttribute('href', source.url);
    }
    const sourceId = guide.sections.flatMap(section => section.sourceIds)[0];
    await page.locator('a[href="#source-' + sourceId + '"]').first().click();
    await expect(page.locator('#source-' + sourceId)).toBeInViewport();
    await expect(page.locator('#source-' + sourceId)).toBeFocused();
    await expect(page.getByRole('complementary', { name: 'Put this guide into practice', exact: true }).getByRole('link', { name: 'Explore with labels', exact: true })).toHaveAttribute('href', /view=2d/);
    await expect(page.locator('canvas')).toHaveCount(0);
    expect(requests).toEqual([]);
  });

  test(guide.slug + ' can be read and followed to a planner without JavaScript', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    try {
      const page = await context.newPage();
      await page.goto('/learn/' + guide.slug + '?idea=budget');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(guide.title);
      await expect(page.locator('#guide-sources')).toContainText('editorial source check');
      await page.getByRole('navigation', { name: 'In this guide', exact: true }).getByRole('link', { name: 'Choose a step for this week', exact: true }).click();
      await expect(page.locator('#try-this-week')).toBeInViewport();
      await page.getByRole('link', { name: 'Make my ' + guide.topicLabel.toLowerCase() + ' plan', exact: true }).click();
      await expect(page).toHaveURL(new RegExp('/next-step\\?pillar=' + ({ Fitness: 'fitness', Nutrition: 'nutrition', Sleep: 'sleep', Stress: 'stress' }[guide.pillar]) + '&idea=budget$'));
      await expect(page.getByRole('textbox', { name: 'One manageable action', exact: true })).toBeVisible();
    } finally { await context.close(); }
  });
}

test('library search finds article content and carries the guided preference through to an editable plan', async ({ page }) => {
  await page.goto('/learn?pillar=sleep&idea=routine');
  const search = page.getByRole('searchbox', { name: 'Search health topics and terms', exact: true });
  await search.fill('caffeine');
  const sleep = page.getByRole('article', { name: 'Sleep', exact: true });
  await expect(sleep).toBeVisible();
  const read = sleep.getByRole('link', { name: 'Read the practical guide', exact: true });
  await expect(read).toHaveAttribute('href', '/learn/sleep-routines?idea=routine');
  await read.click();
  await expect(page).toHaveURL(/\/learn\/sleep-routines\?idea=routine$/);
  await page.evaluate(() => localStorage.setItem('healthcrest.habit-draft.v1', 'KEEP-MY-SAVED-PLAN'));
  await page.getByRole('link', { name: 'Open the habit planner', exact: true }).click();
  await expect(page).toHaveURL(/\/next-step\?pillar=sleep&idea=routine$/);
  await expect(page.getByRole('textbox', { name: 'One manageable action', exact: true })).toHaveValue('Choose a wind-down cue around my main sleep period, adapting it to my work or caring routine.');
  expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBe('KEEP-MY-SAVED-PLAN');
});

test('stress guide places geographically qualified urgent help near its introduction', async ({ page }) => {
  await page.goto('/learn/stress-and-support');
  const support = page.getByRole('complementary', { name: 'Urgent mental health support', exact: true });
  await expect(support.getByRole('heading', { level: 2 })).toHaveText('Need support now?');
  await expect(support).toContainText('In England');
  await expect(support).toContainText('UK and Ireland');
  await expect(support.getByRole('link', { name: '111', exact: true })).toHaveAttribute('href', 'tel:111');
  await expect(support.getByRole('link', { name: '116 123', exact: true })).toHaveAttribute('href', 'tel:116123');
  await expect(support.getByRole('link', { name: '999', exact: true })).toHaveAttribute('href', 'tel:999');
  expect(await page.locator('#urgent-support').evaluate(node => Boolean(node.compareDocumentPosition(document.querySelector('.hc-guide-contents')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
});

test('new guide routes stay outside optional measurement even with a stored opt-in', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/_vercel/') || request.method() === 'POST') requests.push(request.url()); });
  await page.addInitScript(() => localStorage.setItem('healthcrest.measurement-choice.v1', JSON.stringify({ version: 1, analytics: true, performance: true, savedAt: Date.now() })));
  await page.goto('/learn/sleep-routines?idea=routine#sleep-needs');
  await page.getByRole('navigation', { name: 'More practical guides', exact: true }).getByRole('link', { name: 'Balanced meals: build on food you already eat', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Balanced meals: build on food you already eat');
  expect(requests).toEqual([]);
});

test('unknown guide slugs return 404 and repeated preferences fall back safely', async ({ page, request }) => {
  for (const slug of ['not-a-guide', '__proto__', 'constructor']) {
    const response = await request.get('/learn/' + slug);
    expect(response.status()).toBe(404);
  }
  await page.goto('/learn/sleep-routines?idea=routine&idea=time');
  await expect(page.getByRole('link', { name: 'Open the habit planner', exact: true })).toHaveAttribute('href', '/next-step?pillar=sleep');
  await page.goto('/learn/sleep-routines?idea=%3Cscript%3E');
  await expect(page.getByRole('link', { name: 'Open the habit planner', exact: true })).toHaveAttribute('href', '/next-step?pillar=sleep');
  await expect(page.locator('article')).not.toContainText('<script>');
});

for (const width of [320, 390, 768, 1440]) {
  test('guide navigation and source links work by keyboard at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/learn/stress-and-support');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
    const contents = page.getByRole('navigation', { name: 'In this guide', exact: true });
    await contents.getByRole('link', { name: 'Choose a step for this week', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#try-this-week')).toBeFocused();
    await expect(page.getByRole('link', { name: 'Make my stress & support plan', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const sources = page.getByRole('link', { name: 'Sources and scope', exact: true });
    await sources.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#guide-sources')).toBeFocused();
    await test.info().attach('learning-guide.png', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  });
}

test('sitemap exposes the four canonical article routes', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  for (const guide of LEARNING_GUIDES) expect(xml).toContain('<loc>' + SITE_URL + '/learn/' + guide.slug + '</loc>');
});
