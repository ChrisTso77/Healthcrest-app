import { expect, type Page, type TestInfo } from '@playwright/test';
import { createHabitWeek } from '../lib/education/habitWeek';
import type { SavedHabitDraft } from '../lib/education/habitDraft';

const KEY = 'healthcrest.habit-draft.v1';
type StorageProbe = { reads: number; removals: number; saved: () => string | null };
type ProbedWindow = Window & { removalProbe?: StorageProbe };

export async function checkSavedPlanRemoval(page: Page, testInfo: TestInfo, blocked = false, screenshots = false) {
  const drafts = Object.fromEntries(['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(pillar => [pillar, {
    action: 'Stored ' + pillar + ' action.', cue: '', support: '', reflection: 'Stored ' + pillar + ' notes.', week: null,
  }])) as SavedHabitDraft['drafts'];
  drafts.Sleep.week = createHabitWeek('2026-10-29', drafts.Sleep);
  drafts.Sleep.week.days[0] = { choice: 'adapted', note: 'A stored check-in.' };
  const raw = JSON.stringify({ version: 3, selected: 'Fitness', drafts });
  await page.addInitScript(({ key, raw, blocked }) => {
    localStorage.setItem(key, raw);
    localStorage.setItem('unrelated-preference', 'keep');
    const get = Storage.prototype.getItem, remove = Storage.prototype.removeItem;
    const probe = { reads: 0, removals: 0, saved: () => get.call(localStorage, key) };
    (window as ProbedWindow).removalProbe = probe;
    Storage.prototype.getItem = function (name: string) {
      if (name === key) probe.reads++;
      return get.call(this, name);
    };
    Storage.prototype.removeItem = function (name: string) {
      if (name === key) { probe.removals++; if (blocked) throw new Error('Removal blocked for this test'); }
      return remove.call(this, name);
    };
  }, { key: KEY, raw, blocked });
  const posts: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(new URL(request.url()).pathname); });
  await page.goto('/next-step?pillar=sleep');
  const action = page.getByRole('textbox', { name: 'One manageable action', exact: true });
  await action.fill('Current page edits to keep.');
  const opener = page.getByRole('button', { name: 'Remove saved plan', exact: true });
  const group = page.getByRole('group', { name: 'Remove the saved plan on this browser?', exact: true });
  const keep = group.getByRole('button', { name: 'Keep saved plan', exact: true });
  const remove = group.getByRole('button', { name: 'Remove saved copy', exact: true });
  const probe = () => page.evaluate(() => {
    const p = (window as ProbedWindow).removalProbe!;
    return { reads: p.reads, removals: p.removals, saved: p.saved() };
  });
  await expect(opener).toHaveAttribute('aria-expanded', 'false');
  expect(await probe()).toEqual({ reads: 0, removals: 0, saved: raw });
  await opener.focus();
  await page.keyboard.press('Enter');
  await expect(keep).toBeFocused();
  await expect(opener).toHaveAttribute('aria-expanded', 'true');
  await expect(group).toContainText('all four habits, including saved notes and seven-day check-ins');
  await expect(remove).toHaveAccessibleDescription(/all four habits, including saved notes and seven-day check-ins/);
  expect(await probe()).toEqual({ reads: 0, removals: 0, saved: raw });
  for (const button of [keep, remove]) {
    const box = (await button.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(box.height).toBeGreaterThanOrEqual(44 - 0.01);
  }
  if (screenshots) {
    await group.scrollIntoViewIfNeeded();
    await testInfo.attach('saved-plan-removal-confirmation-' + page.viewportSize()!.width, { body: await page.screenshot(), contentType: 'image/png' });
  }
  // Enter acts on the safe default and must not remove the stored copy.
  await page.keyboard.press('Enter');
  await expect(group).toHaveCount(0);
  await expect(opener).toBeFocused();
  await expect(action).toHaveValue('Current page edits to keep.');
  expect(await probe()).toEqual({ reads: 0, removals: 0, saved: raw });
  await opener.click();
  await expect(keep).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(remove).toBeFocused();
  await page.keyboard.press('Enter');
  if (blocked) {
    await expect(page.getByRole('status')).toContainText('could not be removed');
    await expect(group).toContainText('could not be removed');
    await expect(group).toBeVisible();
    await expect(remove).toBeFocused();
    expect(await probe()).toEqual({ reads: 0, removals: 1, saved: raw });
    if (screenshots) {
      await group.scrollIntoViewIfNeeded();
      await testInfo.attach('saved-plan-removal-blocked-' + page.viewportSize()!.width, { body: await page.screenshot(), contentType: 'image/png' });
    }
    // An explicit save invalidates a pending removal before replacing the copy.
    await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
    await expect(group).toHaveCount(0);
    const result = await probe();
    expect(result.reads).toBe(0);
    expect(result.removals).toBe(1);
    expect(JSON.parse(result.saved!).drafts.Sleep.action).toBe('Current page edits to keep.');
    await expect(page.getByRole('status')).toContainText('Saved draft on this device');
  } else {
    await expect(group).toHaveCount(0);
    await expect(opener).toBeFocused();
    await expect(page.getByRole('status')).toContainText('Saved plan removed');
    expect(await probe()).toEqual({ reads: 0, removals: 1, saved: null });
  }
  await expect(action).toHaveValue('Current page edits to keep.');
  expect(await page.evaluate(() => localStorage.getItem('unrelated-preference'))).toBe('keep');
  expect(posts).toEqual([]);
}
