import { test, expect } from '@playwright/test';

// A visible server-rendered input must not accept edits until React can retain
// its change events. Delaying scripts reproduces the calendar's lost-date race.
test('planner protects edits until hydration and keeps the chosen calendar dates', async ({ page }) => {
  let releaseScripts!: () => void;
  const scripts = new Promise<void>(resolve => { releaseScripts = resolve; });
  await page.route(/\/_next\/static\/.*\.js(?:\?|$)/, async route => {
    await scripts;
    await route.continue();
  });
  try {
    await page.goto('/next-step?pillar=stress', { waitUntil: 'commit' });
    const date = page.getByLabel('Start date', { exact: false });
    await expect(page.getByRole('heading', { name: 'My stress & support next step', exact: true })).toBeVisible();
    await expect(date).toBeDisabled();
    await expect(page.getByLabel('One manageable action', { exact: true })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Restore my plan', exact: true })).toBeDisabled();
    await expect(page.getByRole('link', { name: /Explore stress & support in the Habit Explorer/ })).toBeEnabled();
    releaseScripts();
    await expect(date).toBeEnabled();
    await page.getByLabel('One manageable action', { exact: true }).fill('SYNTHETIC-HYDRATION-ACTION');
    await date.fill('2027-03-26');
    await page.getByRole('button', { name: 'Start seven-day plan', exact: true }).click();
    await expect(page.locator('.hc-week-chosen')).toHaveText('SYNTHETIC-HYDRATION-ACTION');
    await page.locator('.hc-week-calendar').getByLabel('Check-in time', { exact: true }).fill('01:30');
    const waiting = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download calendar reminders', exact: true }).click();
    const stream = await (await waiting).createReadStream();
    if (!stream) throw new Error('Calendar file unavailable');
    const parts: Buffer[] = [];
    for await (const part of stream) parts.push(Buffer.from(part));
    const text = Buffer.concat(parts).toString('utf8');
    expect(text).toContain('DTSTART:20270326T013000');
    expect(text).toContain('DTSTART:20270401T013000');
    expect(text).not.toContain('SYNTHETIC-HYDRATION-ACTION');
    expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBeNull();
  } finally { releaseScripts(); }
});
