import { describe, expect, test } from 'vitest';
import { parseSavedHabitDraft } from './habitDraft';

const valid = () => ({
  version: 1, selected: 'Sleep',
  drafts: Object.fromEntries(['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(pillar =>
    [pillar, { action: 'Read quietly — ゆっくり', cue: '', support: 'Ask a friend' }])),
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
    for (const change of [{ version: 2 }, { selected: '__proto__' }, { selected: 'Systems' }]) {
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
