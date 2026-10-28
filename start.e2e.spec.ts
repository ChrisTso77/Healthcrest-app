import { test, expect } from '@playwright/test';

test('guided choice links learning, a labelled view and an editable plan without saving', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Find my starting point', exact: true }).click();
  await expect(page).toHaveURL(/\/start$/);
  await expect(page).toHaveTitle('Find a starting point | Healthcrest');
  await page.getByRole('radio', { name: /^Sleep/ }).check();
  await page.getByLabel('My routine or shifts change', { exact: true }).check();
  await page.getByRole('button', { name: 'Show my starting point', exact: true }).click();
  const result = page.getByRole('region', { name: 'Your sleep starting point', exact: true });
  await expect(result).toBeVisible();
  await expect(result.getByRole('link', { name: 'Read the sleep topic', exact: true })).toHaveAttribute('href', '/learn?pillar=sleep&idea=routine#topic-sleep');
  await expect(result.getByRole('link', { name: 'HSE guidance for shift workers', exact: true })).toHaveAttribute('href', 'https://www.hse.gov.uk/humanfactors/topics/shift-workers.htm');
  await expect(result.getByRole('link', { name: 'Explore sleep with labels', exact: true })).toHaveAttribute('href', '/engine?pillar=sleep&view=2d&idea=routine');
  await result.getByRole('link', { name: 'Read the sleep topic', exact: true }).click();
  await expect(page.getByRole('complementary', { name: 'Your guided starting point', exact: true })).toBeVisible();
  await page.getByRole('article', { name: 'Sleep', exact: true }).getByRole('link', { name: 'Explore in the Habit Explorer', exact: true }).click();
  await expect(page.getByRole('button', { name: /2d diagram/i })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button', { name: 'Guide: understand this view', exact: true }).click();
  const guide = page.getByRole('dialog', { name: 'Understand this view', exact: true });
  await expect(guide.getByRole('region', { name: 'Read the illustration', exact: true })).toContainText('Scale ends are the controls’ limits');
  await guide.getByRole('link', { name: 'Make a manageable next step', exact: true }).click();
  await expect(page).toHaveURL(/\/next-step\?pillar=sleep&idea=routine$/);
  const action = page.getByRole('textbox', { name: 'One manageable action', exact: true });
  await expect(action).toHaveValue('Choose a wind-down cue around my main sleep period, adapting it to my work or caring routine.');
  await action.fill('My own manageable sleep routine');
  await page.getByRole('button', { name: 'Movement', exact: true }).click();
  await page.getByRole('button', { name: 'Sleep', exact: true }).click();
  await expect(action).toHaveValue('My own manageable sleep routine');
  expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBeNull();
});

test('a guided starter never automatically overwrites or restores a saved plan', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  const action = page.getByRole('textbox', { name: 'One manageable action', exact: true });
  await action.fill('My existing saved sleep idea');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  const saved = await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'));
  await page.goto('/next-step?pillar=sleep&idea=time');
  await expect(action).toHaveValue('Choose one part of my wind-down routine to make room for before my main sleep.');
  expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBe(saved);
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await expect(action).toHaveValue('My existing saved sleep idea');
});

for (const width of [320, 390, 768, 1440]) {
  test('guided start stays usable at ' + width + 'px without loading the Explorer', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    let presets = 0;
    page.on('request', request => { if (new URL(request.url()).pathname === '/api/presets') presets += 1; });
    await page.goto('/start?pillar=nutrition&idea=budget');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
    await expect(page.getByRole('region', { name: 'Your food starting point', exact: true })).toContainText('beans or frozen vegetables');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('canvas')).toHaveCount(0);
    expect(presets).toBe(0);
    await test.info().attach('guided-start.png', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  });
}

test('guided start and result work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/start');
    await page.getByRole('radio', { name: /^Movement/ }).check();
    await page.getByLabel('I am short on time', { exact: true }).check();
    await page.getByRole('button', { name: 'Show my starting point', exact: true }).click();
    const result = page.getByRole('region', { name: 'Your movement starting point', exact: true });
    await expect(result).toContainText('short movement break');
    await expect(result.getByRole('link', { name: 'Adapt my movement idea', exact: true })).toHaveAttribute('href', '/next-step?pillar=fitness&idea=time');
  } finally { await context.close(); }
});

test('unknown or repeated journey choices fall back without reflecting raw input', async ({ page }) => {
  await page.goto('/start?pillar=__proto__&idea=%3Cscript%3E');
  await expect(page.locator('#your-starting-point')).toHaveCount(0);
  await expect(page.getByLabel('A general starting point', { exact: true })).toBeChecked();
  await page.goto('/start?pillar=sleep&pillar=stress&idea=time');
  await expect(page.locator('#your-starting-point')).toHaveCount(0);
  await page.goto('/engine?pillar=sleep&view=2d&view=wrong&idea=constructor');
  await expect(page.locator('canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Guide: understand this view', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('link', { name: 'Make a manageable next step', exact: true })).toHaveAttribute('href', '/next-step?pillar=sleep');
});
