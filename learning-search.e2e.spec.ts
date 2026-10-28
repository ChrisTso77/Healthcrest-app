import { test, expect } from '@playwright/test';

const KEY = 'healthcrest.habit-draft.v1';
const journeys = [
  { query: 'plate Harvard', label: 'Food', slug: 'balanced-meals', context: 'rather than combining their diagrams into a score' },
  { query: 'WHO wheeling', label: 'Movement', slug: 'movement-and-strength', context: 'walking, cycling and wheeling' },
  { query: 'CDC quality', label: 'Sleep', slug: 'sleep-routines', context: 'population recommendations' },
  { query: 'WHO exposure', label: 'Stress & support', slug: 'stress-and-support', context: 'news and social-media exposure' },
];
for (const item of journeys) {
  test(item.label + ' multiword search opens the matching international context', async ({ page }) => {
    await page.goto('/learn?pillar=nutrition&idea=routine');
    const search = page.getByRole('searchbox', { name: 'Search health topics and terms', exact: true });
    await search.fill(item.query);
    await expect(search).toBeFocused();
    const topic = page.getByRole('article', { name: item.label, exact: true });
    const pointer = topic.locator('.hc-learn-match');
    await expect(pointer).toContainText('Matching section:');
    const link = pointer.getByRole('link');
    await expect(link).toHaveAttribute('href', '/learn/' + item.slug + '?idea=routine#international-perspective');
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp('/learn/' + item.slug + '\\?idea=routine#international-perspective$'));
    await expect(page.locator('#international-perspective')).toBeFocused();
    await expect(page.locator('#international-perspective')).toBeInViewport();
    await expect(page.locator('#international-perspective')).toContainText(item.context);
  });
}
test('searching source type opens its scoped reference rather than an unrelated paragraph', async ({ page }) => {
  await page.goto('/learn');
  await page.getByRole('searchbox', { name: 'Search health topics and terms', exact: true }).fill('Harvard academic');
  const pointer = page.getByRole('article', { name: 'Food', exact: true }).locator('.hc-learn-match');
  await expect(pointer).toContainText('Matching source:');
  await expect(pointer.getByRole('link')).toHaveAttribute('href', '/learn/balanced-meals#source-harvard-plate');
  await pointer.getByRole('link').click();
  const source = page.locator('#source-harvard-plate');
  await expect(source).toBeFocused();
  await expect(source).toBeInViewport();
  await expect(source).toContainText('Academic nutrition education');
  await expect(source).toContainText('not a US government dietary guideline');
});
for (const width of [320, 1440]) {
  test('search normalisation and empty-result recovery work by keyboard at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/learn');
    const search = page.getByRole('searchbox', { name: 'Search health topics and terms', exact: true });
    await search.fill('  PLÁTE  Harvard’s ');
    await expect(page.getByRole('article', { name: 'Food', exact: true }).locator('.hc-learn-match')).toBeVisible();
    await search.fill('MVPA weekly');
    await expect(page.getByText('MVPA (weekly aerobic activity)', { exact: true })).toBeVisible();
    await search.fill('review high-quality');
    await expect(page.getByText('High-quality review', { exact: true })).toBeVisible();
    await search.fill('?!.*');
    await expect(page.getByRole('status')).toHaveText('0 topics, 0 terms and 0 evidence labels found.');
    await expect(page.getByText(/No matching guidance/)).toContainText('Try fewer words');
    await page.getByRole('button', { name: 'Clear search', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(search).toBeFocused();
    await expect(search).toHaveValue('');
    await expect(page.getByRole('article')).toHaveCount(5);
    await expect(page.locator('.hc-learn-match')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
test('search queries stay out of URLs, saved plans and requests and literal markup is harmless', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/learn');
  await page.evaluate(key => localStorage.setItem(key, 'PRIVATE-SAVED-COPY'), KEY);
  const storageKeys = await page.evaluate(() => Object.keys(localStorage).sort());
  const search = page.getByRole('searchbox', { name: 'Search health topics and terms', exact: true });
  await expect(search).toHaveAttribute('maxlength', '120');
  await search.fill('<img id="search-probe" src="/search-tracker"> PRIVATE-QUERY');
  await expect(page.locator('#search-probe')).toHaveCount(0);
  await expect(page.getByText(/No matching guidance/)).toBeVisible();
  await expect(page).toHaveURL(/\/learn$/);
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe('PRIVATE-SAVED-COPY');
  expect(requests.join('\n')).not.toMatch(/PRIVATE-QUERY|search-tracker/);
  await search.fill('facilities Harvard');
  const topic = page.getByRole('article', { name: 'Food', exact: true });
  await expect(topic).toBeVisible();
  await expect(topic.locator('.hc-learn-match')).toHaveCount(0);
  await expect(topic.getByRole('link', { name: 'Read the practical guide', exact: true })).toHaveAttribute('href', '/learn/balanced-meals');
  expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(storageKeys);
});
