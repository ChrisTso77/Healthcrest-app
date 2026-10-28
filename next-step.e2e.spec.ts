import { test, expect } from '@playwright/test';

test('landing preview opens a matching plan and preserves drafts when switching pillars', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('group', { name: 'Preview pillars' }).getByRole('button', { name: 'Sleep', exact: true }).click();
  await page.getByRole('link', { name: 'Make a manageable next step', exact: true }).click();
  await expect(page).toHaveURL(/\/next-step\?pillar=sleep$/);
  await expect(page).toHaveTitle('My next step | Healthcrest');
  const pillars = page.getByRole('group', { name: 'Choose a habit pillar' });
  await expect(pillars.getByRole('button', { name: 'Sleep', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('complementary', { name: 'Why this habit matters' })).toContainText('Sleep duration, routines and how you feel during the day all matter.');
  const action = page.getByLabel('One manageable action', { exact: true });
  const cue = page.getByLabel('When will I try it?', { exact: false });
  await action.fill('Read quietly before bed.');
  await cue.fill('After putting my phone away.');
  await pillars.getByRole('button', { name: 'Food', exact: true }).click();
  await expect(action).toHaveValue(/Add vegetables/);
  await action.fill('Add beans to my usual lunch.');
  await pillars.getByRole('button', { name: 'Sleep', exact: true }).click();
  await expect(action).toHaveValue('Read quietly before bed.');
  await expect(cue).toHaveValue('After putting my phone away.');
  await pillars.getByRole('button', { name: 'Food', exact: true }).click();
  await expect(action).toHaveValue('Add beans to my usual lunch.');
  await expect(page.getByRole('link', { name: /NHS: the Eatwell Guide/ })).toHaveAttribute('href', 'https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/');
});

test('download contains the chosen habit, routine, support and relevant source', async ({ page }) => {
  await page.goto('/next-step?pillar=nutrition');
  const action = page.getByLabel('One manageable action', { exact: true });
  const button = page.getByRole('button', { name: 'Download my next step', exact: true });
  await action.fill('   ');
  await expect(button).toBeDisabled();
  await action.fill('Add beans & vegetables to my lunch — keep it simple.');
  await page.getByLabel('When will I try it?', { exact: false }).fill('When I prepare lunch on Tuesday.');
  await page.getByLabel('What could make it easier?', { exact: false }).fill('Keep a tin of beans in the cupboard.');
  const downloading = page.waitForEvent('download');
  await button.click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe('healthcrest-next-step.txt');
  const stream = await download.createReadStream();
  if (!stream) throw new Error('Download stream unavailable');
  const parts: Buffer[] = [];
  for await (const part of stream) parts.push(Buffer.from(part));
  const text = Buffer.concat(parts).toString('utf-8');
  expect(text).toContain('Pillar: Food');
  expect(text).toContain('Add beans & vegetables to my lunch — keep it simple.');
  expect(text).toContain('When I prepare lunch on Tuesday.');
  expect(text).toContain('Keep a tin of beans in the cupboard.');
  expect(text).toContain('https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/');
  expect(text).toContain('not a prescription generated from engine settings');
  await expect(page.getByRole('status')).toContainText('Plan download started.');
  await action.fill('Try a smaller version.');
  await expect(page.getByRole('status')).toBeEmpty();
});

for (const width of [320, 390, 768, 1440]) {
  test('plan is usable with keyboard at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/next-step?pillar=stress');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
    const action = page.getByLabel('One manageable action', { exact: true });
    await action.focus();
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('When will I try it?', { exact: false })).toBeFocused();
    await expect(page.getByRole('heading', { name: 'My stress & support next step', exact: true })).toBeVisible();
    const button = page.getByRole('button', { name: 'Download my next step', exact: true });
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const field of await page.locator('input, textarea').all()) {
      const box = await field.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    }
  });
}

test('engine guide links to its pillar plan and plan links back to that engine view', async ({ page }) => {
  await page.goto('/engine?pillar=sleep');
  await page.getByRole('button', { name: 'Guide: understand this view', exact: true }).click();
  await page.getByRole('dialog', { name: 'Understand this view' })
    .getByRole('link', { name: 'Make a manageable next step', exact: true }).click();
  await expect(page).toHaveURL(/\/next-step\?pillar=sleep$/);
  await page.getByRole('link', { name: 'Explore sleep in the engine', exact: true }).click();
  await expect(page).toHaveURL(/\/engine\?pillar=sleep$/);
  await expect(page.getByRole('navigation', { name: 'Health pillars' })
    .getByRole('button', { name: 'Sleep', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('unknown plan pillar is safe and server guidance remains available without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/next-step?pillar=__proto__');
  await expect(page.getByRole('heading', { name: 'My movement next step', exact: true })).toBeVisible();
  await expect(page.getByText(/Enable JavaScript to switch pillars and download a plan/)).toBeVisible();
  await expect(page.getByRole('link', { name: /NHS: adult physical activity guidance/ })).toHaveAttribute('href', /www.nhs.uk\/live-well\/exercise/);
  await context.close();
});


test('device saving restores all pillar drafts and the saved selection after reloading', async ({ page }) => {
  await page.goto('/next-step?pillar=nutrition');
  const action = page.getByLabel('One manageable action', { exact: true });
  await action.fill('Add beans to lunch.');
  await page.getByRole('group', { name: 'Choose a habit pillar' }).getByRole('button', { name: 'Sleep', exact: true }).click();
  await action.fill('Read quietly before bed.');
  await page.getByLabel('When will I try it?', { exact: false }).fill('After brushing my teeth.');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Saved draft on this device.');
  await page.reload();
  // Loading the page never silently overwrites its initial pillar with stored data.
  await expect(action).toHaveValue(/Add vegetables/);
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await expect(action).toHaveValue('Read quietly before bed.');
  await expect(page.getByLabel('When will I try it?', { exact: false })).toHaveValue('After brushing my teeth.');
  await expect(page.getByRole('group', { name: 'Choose a habit pillar' }).getByRole('button', { name: 'Sleep', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await action.fill('An unsaved change.');
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await expect(action).toHaveValue('Read quietly before bed.');
  await page.getByRole('group', { name: 'Choose a habit pillar' }).getByRole('button', { name: 'Food', exact: true }).click();
  await expect(action).toHaveValue('Add beans to lunch.');
});

test('editing alone never persists a plan', async ({ page }) => {
  await page.goto('/next-step');
  const action = page.getByLabel('One manageable action', { exact: true });
  await action.fill('This draft was not saved.');
  await page.reload();
  await expect(action).not.toHaveValue('This draft was not saved.');
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('No compatible saved draft was found.');
});

test('removing saved drafts keeps current edits and unrelated browser storage', async ({ page }) => {
  await page.goto('/next-step');
  await page.evaluate(() => localStorage.setItem('unrelated-preference', 'keep'));
  const action = page.getByLabel('One manageable action', { exact: true });
  await action.fill('My current habit.');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await page.getByRole('button', { name: 'Remove saved draft', exact: true }).click();
  await expect(action).toHaveValue('My current habit.');
  expect(await page.evaluate(() => localStorage.getItem('unrelated-preference'))).toBe('keep');
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('No compatible saved draft was found.');
  await expect(action).toHaveValue('My current habit.');
});

test('damaged saved data never replaces current edits', async ({ page }) => {
  await page.goto('/next-step?pillar=sleep');
  const action = page.getByLabel('One manageable action', { exact: true });
  await action.fill('Keep this current draft.');
  for (const raw of ['{broken', JSON.stringify({ version: 999, selected: 'Sleep', drafts: {} })]) {
    await page.evaluate(value => localStorage.setItem('healthcrest.habit-draft.v1', value), raw);
    await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('No compatible saved draft was found.');
    await expect(action).toHaveValue('Keep this current draft.');
  }
});

test('blocked browser storage leaves editing and download available', async ({ page }) => {
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem', 'removeItem']) {
      Object.defineProperty(Storage.prototype, method, {
        configurable: true,
        value: () => { throw new DOMException('Storage blocked', 'SecurityError'); },
      });
    }
  });
  await page.goto('/next-step?pillar=sleep');
  const action = page.getByLabel('One manageable action', { exact: true });
  await action.fill('Read quietly before bed.');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Saving is unavailable');
  await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Saved drafts are unavailable');
  await page.getByRole('button', { name: 'Remove saved draft', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('could not be removed');
  await expect(action).toHaveValue('Read quietly before bed.');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download my next step', exact: true }).click();
  expect((await downloading).suggestedFilename()).toBe('healthcrest-next-step.txt');
});
