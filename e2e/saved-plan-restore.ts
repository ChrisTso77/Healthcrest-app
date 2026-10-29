import { expect, type Page, type TestInfo } from '@playwright/test';
import { createHabitWeek } from '../lib/education/habitWeek';
import type { SavedHabitDraft } from '../lib/education/habitDraft';

const KEY = 'healthcrest.habit-draft.v1';
type Probe = { reads: number; writes: number; removals: number; saved: () => string | null };
type ProbedWindow = Window & { restoreProbe?: Probe };

export async function checkSavedPlanRestore(page: Page, testInfo: TestInfo, unavailable: false | 'invalid' | 'blocked' = false, screenshots = false) {
  const drafts = Object.fromEntries(['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(pillar => [pillar, {
    action: 'Stored ' + pillar + ' action.', cue: '', support: '', reflection: 'Stored ' + pillar + ' notes.', week: null,
  }])) as SavedHabitDraft['drafts'];
  drafts.Sleep.week = createHabitWeek('2026-10-29', drafts.Sleep);
  drafts.Sleep.week.days[0] = { choice: 'adapted', note: 'A stored week note.' };
  const raw = unavailable === 'invalid' ? '{broken' : JSON.stringify({ version: 3, selected: 'Sleep', drafts });
  await page.addInitScript(({ key, raw, blocked }) => {
    localStorage.setItem(key, raw);
    localStorage.setItem('unrelated-preference', 'keep');
    const get = Storage.prototype.getItem, set = Storage.prototype.setItem, remove = Storage.prototype.removeItem;
    const probe = { reads: 0, writes: 0, removals: 0, saved: () => get.call(localStorage, key) };
    (window as ProbedWindow).restoreProbe = probe;
    Storage.prototype.getItem = function (name: string) {
      if (name === key) { probe.reads++; if (blocked) throw new Error('Restore blocked for this test'); }
      return get.call(this, name);
    };
    Storage.prototype.setItem = function (name: string, value: string) {
      if (name === key) probe.writes++;
      return set.call(this, name, value);
    };
    Storage.prototype.removeItem = function (name: string) {
      if (name === key) probe.removals++;
      return remove.call(this, name);
    };
  }, { key: KEY, raw, blocked: unavailable === 'blocked' });
  const posts: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(new URL(request.url()).pathname); });
  await page.goto('/next-step?pillar=nutrition');
  const action = page.getByRole('textbox', { name: 'One manageable action', exact: true });
  const reflection = page.getByLabel('What did I learn?', { exact: false });
  const confirmation = page.getByRole('group', { name: 'Restore confirmation', exact: true });
  const keep = confirmation.getByRole('button', { name: 'Keep my edits', exact: true });
  const replace = confirmation.getByRole('button', { name: 'Replace edits and restore', exact: true });
  const probe = () => page.evaluate(() => {
    const p = (window as ProbedWindow).restoreProbe!;
    return { reads: p.reads, writes: p.writes, removals: p.removals, saved: p.saved() };
  });
  let reads = 0;
  const expectCopy = async () => expect(await probe()).toEqual({ reads, writes: 0, removals: 0, saved: raw });
  const attach = async (name: string, target: ReturnType<Page['locator']>) => {
    if (!screenshots) return;
    await target.scrollIntoViewIfNeeded();
    await testInfo.attach('saved-plan-restore-' + name + '-' + page.viewportSize()!.width,
      { body: await page.screenshot(), contentType: 'image/png' });
  };
  await expectCopy();
  for (const [origin, name] of [['return', 'Restore my plan'], ['saved', 'Restore saved draft']] as const) {
    const opener = page.getByRole('button', { name, exact: true });
    if (!unavailable) {
      // A clean page still restores only after one explicit activation.
      await opener.click();
      reads++;
      await expect(confirmation).toHaveCount(0);
      await expect(action).toHaveValue('Stored Sleep action.');
      await expectCopy();
    }
    await action.fill('Page action to keep: ' + origin);
    await reflection.fill('Page reflection to keep: ' + origin);
    if (!unavailable) {
      const day = page.locator('#seven-day-plan details').first();
      if (await day.getAttribute('open') === null) await day.locator('summary').click();
      await page.getByLabel('Day 1: a note', { exact: false }).fill('Page week note to keep.');
    }
    await opener.focus();
    await page.keyboard.press('Enter');
    await expect(keep).toBeFocused();
    await expect(opener).toHaveAttribute('aria-expanded', 'true');
    await expect(replace).toHaveAccessibleDescription(/all four habits/);
    await expectCopy();
    if (!unavailable) await attach('confirmation-' + origin, confirmation);
    await page.keyboard.press('Enter');
    await expect(confirmation).toHaveCount(0);
    await expect(opener).toBeFocused();
    await expect(action).toHaveValue('Page action to keep: ' + origin);
    await expect(reflection).toHaveValue('Page reflection to keep: ' + origin);
    if (!unavailable) await expect(page.getByLabel('Day 1: a note', { exact: false })).toHaveValue('Page week note to keep.');
    await expectCopy();
    await opener.click();
    await expect(keep).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(replace).toBeFocused();
    await page.keyboard.press('Enter');
    reads++;
    await expect(confirmation).toHaveCount(0);
    await expectCopy();
    if (unavailable) {
      const error = unavailable === 'invalid' ? /No compatible saved draft/ : /Saved drafts are unavailable/;
      await expect(opener).toBeFocused();
      await expect(opener).toHaveAccessibleDescription(error);
      await expect(page.getByRole('status')).toContainText(error);
      await expect(action).toHaveValue('Page action to keep: ' + origin);
      await expect(reflection).toHaveValue('Page reflection to keep: ' + origin);
      await attach(unavailable + '-' + origin, page.locator('.hc-plan-restore-error'));
    } else {
      await expect(action).toHaveValue('Stored Sleep action.');
      await expect(reflection).toHaveValue('Stored Sleep notes.');
      await expect(page.getByLabel('Day 1: a note', { exact: false })).toHaveValue('A stored week note.');
      if (origin === 'return') await expect(page.locator('#seven-day-plan')).toBeFocused();
      else await expect(opener).toBeFocused();
    }
  }
  if (!unavailable) {
    await action.fill('Explicitly saved page action.');
    await page.getByRole('button', { name: 'Restore saved draft', exact: true }).click();
    await expect(keep).toBeFocused();
    await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
    await expect(confirmation).toHaveCount(0);
    const current = await probe();
    expect(current).toMatchObject({ reads, writes: 1, removals: 0 });
    expect(JSON.parse(current.saved!).drafts.Sleep.action).toBe('Explicitly saved page action.');
    await expect(replace).toHaveCount(0);
  }
  expect(await page.evaluate(() => localStorage.getItem('unrelated-preference'))).toBe('keep');
  expect(posts).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
