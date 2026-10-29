import { test, expect } from '@playwright/test';
import { LEARNING_GUIDES } from './lib/education/learningGuides';
import { createHabitWeek } from './lib/education/habitWeek';
import { journeyAction } from './lib/education/startJourney';

const KEY = 'healthcrest.habit-draft.v1';
const choices = [
  { pillar: 'Fitness', slug: 'fitness', id: 'movement-read-strength' },
  { pillar: 'Nutrition', slug: 'nutrition', id: 'food-beans-lentils' },
  { pillar: 'Sleep', slug: 'sleep', id: 'sleep-room-change' },
  { pillar: 'Stress', slug: 'stress', id: 'stress-practical-priority' },
] as const;
for (const item of choices) {
  test(item.pillar + ' guide carries the chosen idea into an editable planner action', async ({ page }) => {
    const guide = LEARNING_GUIDES.find(guide => guide.pillar === item.pillar)!;
    const idea = guide.ideas.find(idea => idea.id === item.id)!;
    await page.goto('/learn/' + guide.slug + '?idea=routine');
    await page.evaluate(key => localStorage.setItem(key, 'PRIVATE-EXISTING-SAVED-COPY'), KEY);
    const link = page.locator('#idea-' + idea.id).getByRole('link', { name: /^Use this idea in my plan:/ });
    await expect(link).toHaveAttribute('href', '/next-step?pillar=' + item.slug + '&idea=routine&starter=' + idea.id);
    await link.click();
    await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue(idea.text);
    const origin = page.locator('.hc-plan-guide-origin');
    await expect(origin.getByRole('link')).toHaveAttribute('href', '/learn/' + guide.slug + '?idea=routine#try-this-week');
    await expect(origin).toContainText('Using this idea does not restore or save a plan');
    await expect(page.locator('#seven-day-plan .hc-week-days')).toHaveCount(0);
    expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe('PRIVATE-EXISTING-SAVED-COPY');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.healthcrest.uk/next-step');
    await page.getByLabel('One manageable action', { exact: true }).fill('My adapted action.');
    await expect(origin).toHaveCount(0);
    await page.getByRole('button', { name: 'Start seven-day plan', exact: true }).click();
    await expect(page.getByLabel('Action for this week', { exact: true })).toContainText('My adapted action.');
    expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe('PRIVATE-EXISTING-SAVED-COPY');
  });
}
test('unknown, repeated, wrong-pillar and raw-text starters use the existing safe fallback', async ({ page }) => {
  const cases = [
    '/next-step?pillar=sleep&idea=routine&starter=food-beans-lentils',
    '/next-step?pillar=sleep&idea=routine&starter=unknown',
    '/next-step?pillar=sleep&idea=routine&starter=sleep-quiet-activity&starter=sleep-room-change',
    '/next-step?pillar=sleep&idea=routine&starter=' + encodeURIComponent('<script id="starter-injection">PRIVATE-TEXT</script>'),
  ];
  for (const url of cases) {
    await page.goto(url);
    await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue(journeyAction('Sleep', 'routine'));
    await expect(page.locator('.hc-plan-guide-origin')).toHaveCount(0);
    await expect(page.locator('#starter-injection')).toHaveCount(0);
    await expect(page.getByRole('main')).not.toContainText('PRIVATE-TEXT');
  }
  for (const url of [
    '/next-step?pillar=unknown&starter=movement-read-strength',
    '/next-step?starter=movement-read-strength',
    '/next-step?pillar=fitness&pillar=nutrition&starter=movement-read-strength',
  ]) {
    await page.goto(url);
    await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue(journeyAction('Fitness', 'none'));
    await expect(page.locator('.hc-plan-guide-origin')).toHaveCount(0);
  }
});
test('a chosen starter preserves saved records until explicit restore and save and sends no private text', async ({ page }) => {
  const outbound: string[] = [];
  const urls: string[] = [];
  page.on('request', request => {
    urls.push(request.url());
    if (request.method() === 'POST' || new URL(request.url()).pathname.startsWith('/_vercel/')) outbound.push(request.url());
  });
  const drafts = Object.fromEntries(['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(pillar => [pillar, {
    action: 'PRIVATE-SAVED-' + pillar, cue: '', support: '', reflection: '', week: null as ReturnType<typeof createHabitWeek> | null,
  }]));
  drafts.Sleep.week = createHabitWeek('2026-10-28', drafts.Sleep);
  drafts.Sleep.week.days[0].note = 'PRIVATE-SAVED-NOTE';
  const raw = JSON.stringify({ version: 3, selected: 'Sleep', drafts });
  await page.addInitScript(({ key, raw }) => {
    localStorage.setItem(key, raw);
    localStorage.setItem('healthcrest.measurement-choice.v1', JSON.stringify({ version: 1, analytics: true, performance: true, savedAt: Date.now() }));
  }, { key: KEY, raw });
  await page.goto('/next-step?pillar=nutrition&starter=food-vegetable-option');
  await expect(page.locator('.hc-plan-guide-origin')).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBe(raw);
  await page.getByRole('button', { name: 'Restore my plan', exact: true }).click();
  await expect(page.locator('.hc-plan-guide-origin')).toHaveCount(0);
  await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue('PRIVATE-SAVED-Sleep');
  await expect(page.locator('#seven-day-plan')).toBeFocused();
  await page.locator('#seven-day-plan summary').first().click();
  await expect(page.getByLabel('Day 1: a note', { exact: false })).toHaveValue('PRIVATE-SAVED-NOTE');
  await page.getByLabel('One manageable action', { exact: true }).fill('PRIVATE-ADAPTED-ACTION');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), KEY);
  expect(saved.drafts.Sleep.action).toBe('PRIVATE-ADAPTED-ACTION');
  expect(saved.drafts.Sleep.week.days[0].note).toBe('PRIVATE-SAVED-NOTE');
  expect(Object.keys(saved).sort()).toEqual(['drafts', 'selected', 'version']);
  expect(urls.join('\n')).not.toContain('PRIVATE-');
  expect(outbound).toEqual([]);
});
for (const width of [320, 1440]) {
  test('guide idea links work by keyboard without horizontal overflow at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const guide = LEARNING_GUIDES.find(guide => guide.pillar === 'Nutrition')!;
    for (const idea of [guide.ideas[0], guide.ideas[2]]) {
      await page.goto('/learn/' + guide.slug);
      const link = page.locator('#idea-' + idea.id).getByRole('link', { name: /^Use this idea in my plan:/ });
      await link.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue(idea.text);
      await expect(page.locator('.hc-plan-guide-origin')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
    }
  });
}
test('idea-to-planner links remain server rendered without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    const guide = LEARNING_GUIDES.find(guide => guide.pillar === 'Fitness')!;
    const idea = guide.ideas[0];
    await page.goto('/learn/' + guide.slug);
    await page.locator('#idea-' + idea.id).getByRole('link', { name: /^Use this idea in my plan:/ }).click();
    await expect(page.getByLabel('One manageable action', { exact: true })).toHaveValue(idea.text);
    await expect(page.locator('.hc-plan-guide-origin')).toBeVisible();
    await expect(page.getByText(/Enable JavaScript to switch pillars/)).toBeVisible();
    expect(await page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
  } finally { await context.close(); }
});
