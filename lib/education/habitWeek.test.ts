import { describe, expect, test } from 'vitest';
import { createHabitWeek, formatDay, isWeekStart, localDate, parseHabitWeek, weekDayDate, weekDownloadLines } from './habitWeek';

const action = { action: 'Read quietly — ゆっくり', cue: 'After brushing my teeth.', support: 'Choose a shorter book.' };
const valid = () => createHabitWeek('2026-10-28', action);

describe('calendar days and the chosen action', () => {
  test.each([
    ['2026-10-28', 6, '2026-11-03'], ['2026-12-29', 6, '2027-01-04'],
    ['2028-02-27', 2, '2028-02-29'], ['2026-03-27', 3, '2026-03-30'],
  ])('keeps calendar labels across boundaries: %s + %s', (start, index, end) => {
    expect(weekDayDate(start, index)).toBe(end);
  });
  test.each(['', '2026-02-29', '2026-02-30', '2026-13-01', '2026-1-01', '2026-01-01T12:00:00Z', '1899-12-31', '9999-12-26'])('rejects invalid or out-of-range starts: %s', start => {
    expect(isWeekStart(start)).toBe(false);
    expect(() => createHabitWeek(start, action)).toThrow();
  });
  test('formats day labels without reading the current timezone', () => {
    expect(formatDay('2026-10-28')).toBe('Wed, 28 Oct 2026');
    expect(localDate(new Date(2026, 9, 28, 23, 59))).toBe('2026-10-28');
  });
  test('copies the action and creates independent empty day records', () => {
    const draft = { ...action };
    const week = createHabitWeek('2026-10-28', draft);
    draft.action = 'A later draft change';
    expect(week.action).toBe(action.action);
    week.days[0].note = 'A first note';
    expect(week.days[1].note).toBe('');
    expect(week.days).toHaveLength(7);
  });
  test('does not start a blank or oversized action', () => {
    for (const text of ['', '   ', 'x'.repeat(301)]) expect(() => createHabitWeek('2026-10-28', { ...action, action: text })).toThrow();
  });
  test('rejects day indices outside this week', () => {
    for (const index of [-1, 7, 0.5, NaN]) expect(() => weekDayDate('2026-10-28', index)).toThrow();
  });
});

describe('stored week trust boundary', () => {
  test('retains Unicode notes, neutral choices and supported fields only', () => {
    const week = valid();
    week.days[0] = { choice: 'rest', note: 'I asked for support — 安心' };
    const parsed = parseHabitWeek({ ...week, unexpected: '<script>secret</script>',
      days: week.days.map(day => ({ ...day, extra: 'discard' })) });
    expect(parsed).toEqual(week);
    expect(parsed!.days).not.toBe(week.days);
  });
  test.each([null, [], {}, { ...valid(), days: [] }, { ...valid(), days: Array(8).fill({ choice: '', note: '' }) },
    { ...valid(), review: 42 }, { ...valid(), nextAction: 'x'.repeat(301) }, { ...valid(), review: 'x'.repeat(501) },
    { ...valid(), action: ' ' }, { ...valid(), cue: 'x'.repeat(181) }])('rejects malformed structures', value => {
    expect(parseHabitWeek(value)).toBeNull();
  });
  test('rejects unsupported daily outcomes, note types and lengths', () => {
    for (const day of [{ choice: 'perfect', note: '' }, { choice: 'tried', note: 42 }, { choice: 'rest', note: 'x'.repeat(181) }, {}]) {
      const week = valid();
      expect(parseHabitWeek({ ...week, days: [day, ...week.days.slice(1)] })).toBeNull();
    }
  });
  test('exports all seven dated check-ins, the original action and weekly review', () => {
    const week = valid();
    week.days[0] = { choice: 'adapted', note: 'A smaller version helped.' };
    week.review = 'A quiet corner made it easier.';
    week.nextAction = 'Read one page after brushing my teeth.';
    const text = weekDownloadLines(week).join('\n');
    expect(text).toContain('Dates: 2026-10-28 to 2026-11-03');
    expect(text).toContain('Action for this week: ' + action.action);
    expect(text).toContain('Day 1 (2026-10-28): Tried a smaller or different version');
    expect(text).toContain('Day 7 (2026-11-03): Not recorded');
    expect(text).toContain('A quiet corner made it easier.');
    expect(text).toContain('Read one page after brushing my teeth.');
  });
});
