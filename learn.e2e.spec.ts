import { test, expect } from '@playwright/test';

test('learning search finds acronyms and evidence labels, handles empty results and clears with keyboard', async ({ page }) => {
  await page.goto('/learn');
  await expect(page).toHaveTitle('Learn the basics | Healthcrest');
  const search = page.getByRole('searchbox', { name: 'Search health topics and terms', exact: true });
  await search.fill('  hRv  ');
  await expect(page.getByRole('status')).toHaveText('0 topics, 1 term and 0 evidence labels found.');
  await expect(page.getByText('HRV', { exact: true })).toBeVisible();
  await expect(page.getByRole('definition')).toContainText('This app does not measure it.');
  await search.fill('MVPA');
  await expect(page.getByText('MVPA (weekly aerobic activity)', { exact: true })).toBeVisible();
  await expect(page.getByRole('definition')).toContainText('still allowing conversation');
  await search.fill('Experimental');
  await expect(page.getByText('Experimental', { exact: true })).toBeVisible();
  await expect(page.getByRole('definition')).toContainText('does not establish a proven health intervention');
  await search.fill('zzzz-no-matching-guidance');
  await expect(page.getByText(/No matching guidance/)).toBeVisible();
  const clear = page.getByRole('button', { name: 'Clear search', exact: true });
  await clear.focus();
  await page.keyboard.press('Enter');
  await expect(search).toBeFocused();
  await expect(search).toHaveValue('');
  await expect(page.getByRole('article')).toHaveCount(5);
});

test('topic guidance leads to the matching planner and engine view', async ({ page }) => {
  await page.goto('/learn');
  const sleep = page.getByRole('article', { name: 'Sleep', exact: true });
  await expect(sleep.getByRole('link', { name: /^NHS:/ })).toHaveAttribute('href', 'https://www.nhs.uk/conditions/insomnia/');
  await sleep.getByText('How the Habit Explorer illustrates sleep', { exact: true }).click();
  await expect(sleep).toContainText('not sleep stages, brain clearance or measured recovery');
  await sleep.getByRole('link', { name: 'Make a next step', exact: true }).click();
  await expect(page).toHaveURL(/\/next-step\?pillar=sleep$/);
  await expect(page.getByRole('heading', { name: 'My sleep next step', exact: true })).toBeVisible();
  await page.goto('/learn');
  await page.getByRole('article', { name: 'Food', exact: true })
    .getByRole('link', { name: 'Explore in the Habit Explorer', exact: true }).click();
  await expect(page).toHaveURL(/\/engine\?pillar=nutrition$/);
  await expect(page.getByRole('navigation', { name: 'Habit topics' })
    .getByRole('button', { name: 'Food', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('landing navigation and engine guide expose the learning library', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Learn', exact: true }).click();
  await expect(page).toHaveURL(/\/learn$/);
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Habit Explorer', exact: true }).click();
  await page.getByRole('button', { name: 'Guide: understand this view', exact: true }).click();
  await page.getByRole('dialog', { name: 'Understand this view' })
    .getByRole('link', { name: 'Browse health topics and terms', exact: true }).click();
  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Learn the basics.');
});

for (const width of [320, 390, 768, 1440]) {
  test('learning library is usable at ' + width + 'px without loading the Habit Explorer', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    let presetRequests = 0;
    page.on('request', request => {
      if (new URL(request.url()).pathname === '/api/presets') presetRequests += 1;
    });
    await page.goto('/learn');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
    await expect(page.getByRole('article')).toHaveCount(5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const search = page.getByRole('searchbox', { name: 'Search health topics and terms', exact: true });
    await search.fill('sleep');
    const box = await search.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    await expect(page.getByRole('article', { name: 'Sleep', exact: true })).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);
    expect(presetRequests).toBe(0);
  });
}

test('learning topics and definitions are readable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/learn');
  await expect(page.getByRole('article')).toHaveCount(5);
  await expect(page.getByText('HRV', { exact: true })).toBeVisible();
  await expect(page.locator('.hc-learn-no-script')).toBeVisible();
  // Playwright's text matcher skips NOSCRIPT, even when scripting is disabled.
  expect(await page.locator('.hc-learn-no-script').textContent()).toContain('Search needs JavaScript.');
  await expect(page.getByRole('article', { name: 'Sleep', exact: true }).getByRole('link', { name: /^NHS:/ }))
    .toHaveAttribute('href', 'https://www.nhs.uk/conditions/insomnia/');
  await context.close();
});
