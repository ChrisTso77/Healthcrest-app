import { test, expect } from '@playwright/test';

test('access journey reaches seated guidance and preserves the editable starter without saving', async ({ page }) => {
  await page.goto('/start?pillar=fitness&idea=access');
  const options = page.getByRole('complementary', { name: 'Movement options', exact: true });
  await options.getByRole('link', { name: 'Explore seated movement and suitable support', exact: true }).click();
  await expect(page).toHaveURL(/\/learn\/movement-and-strength\?idea=access#adapt-movement$/);
  const section = page.getByRole('region', { name: 'Explore seated movement and suitable support', exact: true });
  await expect(section).toBeInViewport();
  await expect(section).toContainText('solid chair without wheels');
  await expect(section).toContainText('professional involved in your care');
  await expect(page.locator('#source-sitting a')).toHaveAttribute('href', 'https://www.nhs.uk/live-well/exercise/sitting-exercises/');
  await page.getByRole('link', { name: 'Open the habit planner', exact: true }).click();
  await expect(page).toHaveURL(/\/next-step\?pillar=fitness&idea=access$/);
  await expect(page.getByRole('textbox', { name: 'One manageable action', exact: true })).toHaveValue('Choose an activity that fits my ability, space and access, with support if I need it.');
  expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBeNull();
});

test('older adult guidance keeps the vigorous-activity qualification and links to its source', async ({ page }) => {
  await page.goto('/learn/movement-and-strength');
  await page.getByRole('complementary', { name: 'Movement options', exact: true }).getByRole('link', { name: 'Read movement guidance for ages 65 and over', exact: true }).click();
  const section = page.getByRole('region', { name: 'If you are aged 65 or over', exact: true });
  await expect(section).toContainText('75 minutes of vigorous activity if you are already active');
  await expect(section).toContainText('strength, balance and flexibility');
  await expect(page.locator('#source-older a')).toHaveAttribute('href', 'https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-older-adults/');
});

test('search discovers seated guidance without introducing an age or disability profile', async ({ page }) => {
  await page.goto('/learn');
  await page.getByRole('searchbox', { name: 'Search health topics and terms', exact: true }).fill('seated');
  const topic = page.getByRole('article', { name: 'Movement', exact: true });
  await topic.getByRole('link', { name: 'Read the practical guide', exact: true }).click();
  await expect(page).toHaveURL(/\/learn\/movement-and-strength$/);
  await expect(page.getByRole('complementary', { name: 'Movement options', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBeNull();
});

for (const width of [320, 390, 768, 1440]) {
  test('movement options support keyboard navigation at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/learn/movement-and-strength');
    const link = page.getByRole('complementary', { name: 'Movement options', exact: true }).getByRole('link', { name: 'Explore seated movement and suitable support', exact: true });
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#adapt-movement')).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('access options and section navigation work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/start?pillar=fitness&idea=access');
    await page.getByRole('complementary', { name: 'Movement options', exact: true }).getByRole('link', { name: 'Explore seated movement and suitable support', exact: true }).click();
    await expect(page.locator('#adapt-movement')).toContainText('solid chair without wheels');
    await page.getByRole('link', { name: 'Open the habit planner', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'One manageable action', exact: true })).toHaveValue('Choose an activity that fits my ability, space and access, with support if I need it.');
  } finally { await context.close(); }
});
