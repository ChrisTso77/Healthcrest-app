import { test, expect } from '@playwright/test';

const KEY = 'healthcrest.habit-draft.v1';
const cases = [
  { query: 'fitness', label: 'Movement', slug: 'movement-and-strength', source: 'WHO: physical activity', url: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity', kind: 'Global public-health information', limit: 'does not select a personal activity dose' },
  { query: 'nutrition', label: 'Food', slug: 'balanced-meals', source: 'Harvard The Nutrition Source: Healthy Eating Plate', url: 'https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/', kind: 'Academic nutrition education', limit: 'not a US government dietary guideline' },
  { query: 'sleep', label: 'Sleep', slug: 'sleep-routines', source: 'CDC: about sleep', url: 'https://www.cdc.gov/sleep/about/index.html', kind: 'US public-health information', limit: 'adult age bands and wording differ' },
  { query: 'stress', label: 'Stress & support', slug: 'stress-and-support', source: 'WHO: stress questions and answers', url: 'https://www.who.int/news-room/questions-and-answers/item/stress', kind: 'Global public-health information', limit: 'not a diagnosis or a substitute' },
];
for (const item of cases) {
  test(item.label + ' planner connects local guidance to a scoped international reference', async ({ page }) => {
    await page.goto('/next-step?pillar=' + item.query);
    const evidence = page.getByRole('region', { name: 'Evidence for your next step', exact: true });
    const guide = evidence.getByRole('link', { name: /Read the practical/ });
    await expect(guide).toHaveAttribute('href', '/learn/' + item.slug);
    const summary = evidence.locator('summary');
    await expect(evidence.locator('details')).not.toHaveAttribute('open', '');
    await summary.click();
    const reference = evidence.getByRole('link', { name: item.source, exact: false });
    await expect(reference).toHaveAttribute('href', item.url);
    await expect(reference).toHaveAttribute('target', '_blank');
    await expect(reference).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(reference).toContainText('opens in a new tab');
    await expect(evidence).toContainText(item.kind);
    await expect(evidence).toContainText(item.limit);
    await expect(evidence).toContainText('What it supports:');
    await expect(evidence).toContainText('Keep in mind:');
    await expect(evidence.locator('time')).toHaveAttribute('datetime', '2026-10-28');
    await expect(evidence).toContainText('does not imply endorsement');
    // The existing local reference and service routes remain separate.
    await expect(page.getByRole('complementary', { name: 'Why this habit matters', exact: true }).getByRole('link', { name: /^NHS:/ })).toHaveAttribute('href', /^https:\/\/www.nhs.uk\//);
    if (item.query === 'sleep') {
      await expect(evidence).toContainText('seven or more hours for adults aged 18–60');
      await expect(evidence).toContainText('seven to eight hours for ages 65 and over');
      await expect(evidence).toContainText('population recommendations');
    }
    if (item.query === 'nutrition') await expect(evidence).toContainText('rather than combining their diagrams into a score');
    if (item.query === 'stress') {
      const urgent = page.getByRole('complementary', { name: 'Urgent mental health support', exact: true });
      await expect(urgent.getByRole('link', { name: '111', exact: true })).toHaveAttribute('href', 'tel:111');
      await expect(urgent.getByRole('link', { name: '999', exact: true })).toHaveAttribute('href', 'tel:999');
    }
    await guide.click();
    await expect(page).toHaveURL(new RegExp('/learn/' + item.slug + '$'));
    await expect(page.locator('#international-perspective')).toBeVisible();
    await expect(page.locator('#guide-sources')).toContainText(item.limit);
  });
}
for (const width of [320, 1440]) {
  test('evidence jumps and native disclosure work by keyboard at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/next-step?pillar=nutrition');
    const evidence = page.locator('#habit-plan-evidence');
    const jump = page.getByRole('link', { name: 'Read the evidence for this habit', exact: true });
    await jump.focus();
    await page.keyboard.press('Enter');
    await expect(evidence).toBeFocused();
    await expect(evidence).toBeInViewport();
    await evidence.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(evidence.locator('details')).toHaveAttribute('open', '');
    await expect(evidence.getByRole('link', { name: /Harvard The Nutrition Source:/ })).toBeVisible();
    await evidence.getByRole('link', { name: 'Return to my action', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('One manageable action', { exact: true })).toBeFocused();
    const pillars = page.getByRole('group', { name: 'Choose a habit pillar', exact: true });
    await pillars.getByRole('button', { name: 'Sleep', exact: true }).click();
    await expect(evidence.locator('details')).not.toHaveAttribute('open', '');
    await expect(evidence.getByRole('link', { name: /Read the practical sleep guide/ })).toHaveAttribute('href', '/learn/sleep-routines');
    await pillars.getByRole('button', { name: 'Food', exact: true }).click();
    await expect(evidence.locator('details')).not.toHaveAttribute('open', '');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
test('reference browsing preserves saved and page drafts without sending personal text', async ({ page }) => {
  const requests: string[] = [];
  const outbound: string[] = [];
  page.on('request', request => {
    requests.push(request.url());
    if (request.method() === 'POST' || new URL(request.url()).pathname.startsWith('/_vercel/')) outbound.push(request.url());
  });
  await page.addInitScript(() => localStorage.setItem('healthcrest.measurement-choice.v1', JSON.stringify({
    version: 1, analytics: true, performance: true, savedAt: Date.now(),
  })));
  await page.goto('/next-step?pillar=nutrition');
  const action = page.getByLabel('One manageable action', { exact: true });
  await action.fill('PRIVATE-FOOD-ACTION');
  await page.getByLabel('What did I learn?', { exact: false }).fill('PRIVATE-REFLECTION');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), KEY);
  await action.fill('PRIVATE-UNSAVED-EDIT');
  const evidence = page.locator('#habit-plan-evidence');
  await evidence.locator('summary').click();
  await evidence.locator('summary').click();
  await expect(action).toHaveValue('PRIVATE-UNSAVED-EDIT');
  await expect(page.locator('.hc-plan-unsaved')).toContainText('You have page changes to save.');
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(saved);
  for (const href of await evidence.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
    expect(href).not.toMatch(/PRIVATE|\?idea=|\?pillar=/);
  }
  expect(requests.join('\n')).not.toMatch(/PRIVATE-/);
  expect(outbound).toEqual([]);
});
test('initial evidence and the native disclosure remain readable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/next-step?pillar=nutrition');
    const evidence = page.locator('#habit-plan-evidence');
    await expect(evidence.getByRole('link', { name: /Read the practical food guide/ })).toHaveAttribute('href', '/learn/balanced-meals');
    await evidence.locator('summary').click();
    await expect(evidence.getByRole('link', { name: /Harvard The Nutrition Source:/ })).toBeVisible();
    await expect(evidence).toContainText('Academic nutrition education');
    await expect(evidence).toContainText('not a US government dietary guideline');
    expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
  } finally { await context.close(); }
});
