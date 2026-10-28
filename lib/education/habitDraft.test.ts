import { describe, expect, test } from 'vitest';
import { createHabitWeek } from './habitWeek';
import { parseSavedHabitDraft } from './habitDraft';

const valid = () => ({
  version: 3, selected: 'Sleep',
  drafts: Object.fromEntries(['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(pillar =>
    [pillar, { action: 'Read quietly — ゆっくり', cue: '', support: 'Ask a friend', reflection: '', week: null }])),
});

describe('saved habit draft validation', () => {
  test('preserves Unicode and incomplete drafts without trimming user text', () => {
    const data = valid();
    data.drafts.Sleep.action = '  ';
    expect(parseSavedHabitDraft(JSON.stringify(data))).toEqual(data);
  });
  test('rejects missing, malformed and oversized storage', () => {
    for (const raw of [null, '', '{bad', 'x'.repeat(20001), 'null', '[]']) {
      expect(parseSavedHabitDraft(raw)).toBeNull();
    }
  });
  test('rejects unknown versions and unexpected pillar names', () => {
    for (const change of [{ version: 999 }, { selected: '__proto__' }, { selected: 'Systems' }]) {
      expect(parseSavedHabitDraft(JSON.stringify({ ...valid(), ...change }))).toBeNull();
    }
  });
  test('rejects incomplete collections', () => {
    const data = valid();
    delete data.drafts.Nutrition;
    expect(parseSavedHabitDraft(JSON.stringify(data))).toBeNull();
  });
  test('rejects wrong types and fields exceeding the editor limits', () => {
    for (const change of [{ action: 42 }, { action: 'a'.repeat(301) }, { cue: null },
      { cue: 'b'.repeat(181) }, { support: [] }, { support: 'c'.repeat(181) }]) {
      const data = valid();
      data.drafts.Sleep = { ...data.drafts.Sleep, ...change } as typeof data.drafts.Sleep;
      expect(parseSavedHabitDraft(JSON.stringify(data))).toBeNull();
    }
  });
  test('copies only supported fields from stored objects', () => {
    const data = valid();
    const parsed = parseSavedHabitDraft(JSON.stringify({ ...data, unexpected: true }));
    expect(parsed).toEqual(data);
    expect(parsed!.drafts).not.toBe(data.drafts);
  });
});


describe('reflection storage compatibility', () => {
  test('migrates earlier drafts without losing their original fields', () => {
    const data = valid();
    const legacy = { ...data, version: 1,
      drafts: Object.fromEntries(Object.entries(data.drafts).map(([pillar, draft]) =>
        [pillar, { action: draft.action, cue: draft.cue, support: draft.support }])) };
    expect(parseSavedHabitDraft(JSON.stringify(legacy))).toEqual(data);
  });
  test('rejects missing, wrongly typed or oversized reflection notes in the new format', () => {
    for (const reflection of [undefined, null, 42, 'x'.repeat(501)]) {
      const data = valid();
      const raw = JSON.stringify({ ...data, drafts: { ...data.drafts, Sleep: { ...data.drafts.Sleep, reflection } } });
      expect(parseSavedHabitDraft(raw)).toBeNull();
    }
  });
  test('accepts maximum editor lengths with escaped text but caps oversized payloads', () => {
    const data = valid();
    for (const draft of Object.values(data.drafts)) {
      draft.action = '\u0001'.repeat(300);
      draft.cue = '\u0001'.repeat(180);
      draft.support = '\u0001'.repeat(180);
      draft.reflection = '\u0001'.repeat(500);
    }
    expect(parseSavedHabitDraft(JSON.stringify(data))).toEqual(data);
    expect(parseSavedHabitDraft(JSON.stringify({ ...valid(), extra: 'x'.repeat(120000) }))).toBeNull();
  });
});

describe('seven-day storage compatibility', () => {
  test('migrates version 2 reflection notes without inventing a week', () => {
    const data = valid();
    data.drafts.Sleep.reflection = 'This earlier note matters.';
    const legacy = { ...data, version: 2, drafts: Object.fromEntries(Object.entries(data.drafts).map(([pillar, draft]) =>
      [pillar, { action: draft.action, cue: draft.cue, support: draft.support, reflection: draft.reflection }])) };
    expect(parseSavedHabitDraft(JSON.stringify(legacy))).toEqual(data);
  });
  test('requires a null or valid week in version 3', () => {
    for (const week of [undefined, {}, [], 'bad', { startDate: '2026-02-30' }]) {
      const data = valid();
      data.drafts.Sleep.week = week;
      expect(parseSavedHabitDraft(JSON.stringify(data))).toBeNull();
    }
  });
  test('accepts maximum escaped text across all four weeks and returns independent copies', () => {
    const data = valid();
    for (const draft of Object.values(data.drafts)) {
      draft.action = '\u0001'.repeat(300);
      draft.cue = '\u0001'.repeat(180);
      draft.support = '\u0001'.repeat(180);
      draft.reflection = '\u0001'.repeat(500);
      const week = createHabitWeek('2026-10-28', draft);
      week.days.forEach(day => { day.choice = 'adapted'; day.note = '\u0001'.repeat(180); });
      week.review = '\u0001'.repeat(500);
      week.nextAction = '\u0001'.repeat(300);
      draft.week = week;
    }
    const raw = JSON.stringify(data);
    expect(raw.length).toBeLessThan(120000);
    const parsed = parseSavedHabitDraft(raw);
    expect(parsed).toEqual(data);
    parsed!.drafts.Sleep.week!.days[0].note = 'Changed copy';
    expect(data.drafts.Sleep.week.days[0].note).not.toBe('Changed copy');
  });
});
