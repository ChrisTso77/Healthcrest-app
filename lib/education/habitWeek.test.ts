import { describe, expect, test } from 'vitest';
import { createHabitWeek, formatDay, isWeekStart, localDate, parseHabitWeek, weekDayDate, weekDownloadLines, summarizeHabitWeek, weekSummaryLines } from './habitWeek';

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

describe('weekly records summary', () => {
  test('a fresh week has seven blank days and no recorded check-ins', () => {
    const result = summarizeHabitWeek(valid());
    expect(result).toMatchObject({ chosenDays: 0, notesOnlyDays: 0, blankDays: 7, recordedDays: 0 });
    expect(result.choices.find(choice => choice.value === '')!.count).toBe(7);
    expect(result.choices.reduce((total, choice) => total + choice.count, 0)).toBe(7);
  });

  test('notes-only days are recorded once and whitespace alone remains blank', () => {
    const week = valid();
    week.days[0] = { choice: 'tried', note: '' };
    week.days[1] = { choice: 'adapted', note: 'A smaller action fitted.' };
    week.days[2] = { choice: 'rest', note: '' };
    week.days[3] = { choice: 'not-tried', note: '' };
    week.days[4] = { choice: '', note: 'A note — ゆっくり' };
    week.days[5] = { choice: '', note: ' \n\t ' };
    const result = summarizeHabitWeek(week);
    expect(result).toMatchObject({ chosenDays: 4, notesOnlyDays: 1, blankDays: 2, recordedDays: 5 });
    expect(Object.fromEntries(result.choices.map(choice => [choice.value, choice.count]))).toEqual({
      tried: 1, adapted: 1, rest: 1, 'not-tried': 1, '': 3,
    });
    expect(result.chosenDays + result.notesOnlyDays + result.blankDays).toBe(7);
    expect(weekSummaryLines(week)).toContain('Days with notes only: 1');
    expect(weekDownloadLines(week)).toContain('No choice selected: 3');
  });

  test('changing a note-only day to a choice or blank does not double-count it', () => {
    const week = valid();
    week.days[0].note = 'One note.';
    expect(summarizeHabitWeek(week)).toMatchObject({ chosenDays: 0, notesOnlyDays: 1, recordedDays: 1, blankDays: 6 });
    week.days[0].choice = 'rest';
    expect(summarizeHabitWeek(week)).toMatchObject({ chosenDays: 1, notesOnlyDays: 0, recordedDays: 1, blankDays: 6 });
    week.days[0] = { choice: '', note: '' };
    expect(summarizeHabitWeek(week)).toMatchObject({ chosenDays: 0, notesOnlyDays: 0, recordedDays: 0, blankDays: 7 });
  });

  test('summarizing and exporting frozen records leaves the source notes and choices unchanged', () => {
    const week = valid();
    week.days[6] = { choice: 'adapted', note: 'Keep this exact note.' };
    const raw = JSON.stringify(week);
    week.days.forEach(day => Object.freeze(day));
    Object.freeze(week.days);
    Object.freeze(week);
    summarizeHabitWeek(week);
    weekSummaryLines(week);
    weekDownloadLines(week);
    expect(JSON.stringify(week)).toBe(raw);
  });
});
