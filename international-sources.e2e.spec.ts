import { test, expect } from '@playwright/test';
const sources = [
  { slug: 'movement-and-strength', id: 'who-activity', host: 'www.who.int', context: 'Global public-health information' },
  { slug: 'balanced-meals', id: 'harvard-plate', host: 'nutritionsource.hsph.harvard.edu', context: 'Academic nutrition education' },
  { slug: 'sleep-routines', id: 'cdc-sleep', host: 'www.cdc.gov', context: 'US public-health information' },
  { slug: 'stress-and-support', id: 'who-stress', host: 'www.who.int', context: 'Global public-health information' },
];
for (const source of sources) {
  test(source.slug + ' explains and cites its international perspective', async ({ page }) => {
    await page.goto('/learn/' + source.slug);
    const contents = page.getByRole('navigation', { name: 'In this guide', exact: true });
    const link = contents.locator('a[href="#international-perspective"]');
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#international-perspective')).toBeFocused();
    await expect(page.locator('#international-perspective')).toBeInViewport();
    const reference = page.locator('#source-' + source.id);
    await expect(reference).toContainText(source.context);
    const href = await reference.locator('a').getAttribute('href');
    expect(new URL(href!).hostname).toBe(source.host);
    const schema = JSON.parse((await page.locator('main script[type="application/ld+json"]').textContent())!);
    expect(schema['@graph'][0].citation.some((item: { url: string }) => item.url === href)).toBe(true);
  });
}
test('Harvard is discoverable in search with its educational scope visible', async ({ page }) => {
  await page.goto('/learn');
  await page.getByRole('searchbox', { name: 'Search health topics and terms', exact: true }).fill('Harvard');
  const food = page.getByRole('article', { name: 'Food', exact: true });
  await food.getByRole('link', { name: 'Read the practical guide', exact: true }).click();
  await expect(page.locator('#international-perspective')).toContainText('Harvard’s plate and the NHS Eatwell Guide group and present foods differently');
  await expect(page.locator('#source-harvard-plate')).toContainText('not a US government dietary guideline');
});
test('CDC age bands remain distinct from the general NHS adult range', async ({ page }) => {
  await page.goto('/learn/sleep-routines');
  const section = page.locator('#international-perspective');
  await expect(section).toContainText('seven or more hours for adults aged 18–60');
  await expect(section).toContainText('seven to eight hours for ages 65 and over');
  await expect(section).toContainText('population recommendations');
  await expect(page.locator('#sleep-needs')).toContainText('7–9 hours');
});
test('global stress context retains local urgent routes and works without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/learn/stress-and-support');
    await expect(page.locator('#international-perspective')).toContainText('WHO');
    const urgent = page.getByRole('complementary', { name: 'Urgent mental health support', exact: true });
    await expect(urgent).toContainText('In England');
    await expect(urgent.getByRole('link', { name: '111', exact: true })).toHaveAttribute('href', 'tel:111');
    await expect(urgent.getByRole('link', { name: '999', exact: true })).toHaveAttribute('href', 'tel:999');
    await expect(page.locator('#source-who-stress a')).toHaveAttribute('href', 'https://www.who.int/news-room/questions-and-answers/item/stress');
  } finally { await context.close(); }
});
