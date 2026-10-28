import { describe, expect, test } from 'vitest';
import { habitBackupDifferences } from './habitBackupComparison';
import { createHabitWeek } from './habitWeek';
import { parseSavedHabitDraft, type HabitDraft } from './habitDraft';

function draft(): HabitDraft {
  return { action: 'Read one page.', cue: 'After brushing my teeth.', support: 'A quiet room.', reflection: '',
    week: createHabitWeek('2026-10-28', { action: 'Read a paragraph.', cue: '', support: '' }) };
}
const copy = (value: HabitDraft): HabitDraft => JSON.parse(JSON.stringify(value));

describe('backup comparison before replacement', () => {
  test('compares values independently of object identity and property ordering', () => {
    const before = draft();
    const after = { ...copy(before), week: { ...copy(before).week! } };
    after.week = { days: after.week.days, nextAction: '', review: '', support: '', cue: '', action: after.week.action, startDate: after.week.startDate };
    expect(habitBackupDifferences(before, after)).toEqual([]);
  });
  test('identifies changes to the draft while keeping its week snapshot independent', () => {
    const before = draft();
    const after = copy(before);
    after.action = 'Read two pages.';
    after.cue = 'After lunch.';
    after.support = 'A lamp.';
    after.reflection = 'A shorter routine helped.';
    expect(habitBackupDifferences(before, after)).toEqual([
      'Next step action', 'When to try it', 'What could help', 'Extra reflection notes',
    ]);
  });
  test('distinguishes addition, removal and absence of a current week', () => {
    const before = draft();
    const without = { ...copy(before), week: null };
    expect(habitBackupDifferences(before, without)).toEqual(['Current week will be removed']);
    expect(habitBackupDifferences(without, before)).toEqual(['A current week will be added']);
    expect(habitBackupDifferences(without, copy(without))).toEqual([]);
  });
  test('detects different notes and choices even with identical dates and check-in counts', () => {
    const before = draft();
    before.week!.days[6] = { choice: 'tried', note: 'First note.' };
    const after = copy(before);
    after.week!.days[6].note = 'Another note.';
    expect(habitBackupDifferences(before, after)).toEqual(['Daily check-ins or notes']);
    after.week!.days[6] = { choice: 'rest', note: 'First note.' };
    expect(habitBackupDifferences(before, after)).toEqual(['Daily check-ins or notes']);
  });
  test('detects changes to week action, cue and support when the future draft is unchanged', () => {
    const before = draft();
    const after = copy(before);
    after.week!.action = 'A different weekly action.';
    after.week!.cue = 'Before bed.';
    after.week!.support = 'A quieter space.';
    expect(habitBackupDifferences(before, after)).toEqual(['Week action', 'Week cue', 'Week support']);
  });
  test('includes date, review and next-action changes even with no daily records', () => {
    const before = draft();
    const after = copy(before);
    after.week!.startDate = '2026-11-04';
    after.week!.review = 'Make it shorter.';
    after.week!.nextAction = 'Try one sentence.';
    expect(habitBackupDifferences(before, after)).toEqual(['Week dates', 'Weekly review', 'Possible next action']);
  });
  test('preserves exact spacing differences rather than declaring unequal files identical', () => {
    const before = draft();
    const after = copy(before);
    after.action += ' ';
    after.week!.days[0].note = ' ';
    expect(habitBackupDifferences(before, after)).toEqual(['Next step action', 'Daily check-ins or notes']);
  });
  test('does not mutate frozen page or backup records while deriving labels', () => {
    const before = draft();
    const after = copy(before);
    after.week!.days[0].note = 'A note.';
    for (const value of [before, after]) {
      value.week!.days.forEach(Object.freeze);
      Object.freeze(value.week!.days);
      Object.freeze(value.week);
      Object.freeze(value);
    }
    expect(habitBackupDifferences(before, after)).toEqual(['Daily check-ins or notes']);
    expect(before.week!.days[0].note).toBe('');
    expect(after.week!.days[0].note).toBe('A note.');
  });
  test('compares a migrated legacy backup without losing the warning about week removal', () => {
    const before = draft();
    const legacy = { version: 1, selected: 'Sleep', drafts: Object.fromEntries(
      ['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(pillar => [pillar, { action: before.action, cue: before.cue, support: before.support }])
    ) };
    const saved = parseSavedHabitDraft(JSON.stringify(legacy))!;
    expect(habitBackupDifferences(before, saved.drafts.Sleep)).toEqual(['Current week will be removed']);
    expect(legacy.version).toBe(1);
  });
});
