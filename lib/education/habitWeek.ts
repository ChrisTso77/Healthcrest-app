export const DAY_CHOICES = [
  { value: '', label: 'Not recorded' },
  { value: 'tried', label: 'Tried my action' },
  { value: 'adapted', label: 'Tried a smaller or different version' },
  { value: 'rest', label: 'Chose rest or support' },
  { value: 'not-tried', label: 'Did not try it' },
] as const;
export type DayChoice = typeof DAY_CHOICES[number]['value'];
export type HabitDay = { choice: DayChoice; note: string };
export type HabitWeek = {
  startDate: string; action: string; cue: string; support: string;
  days: HabitDay[]; review: string; nextAction: string;
};
type WeekAction = Pick<HabitWeek, 'action' | 'cue' | 'support'>;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const within = (value: unknown, max: number): value is string => typeof value === 'string' && value.length <= max;

export function isWeekStart(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '1900-01-01' || value > '9999-12-25') return false;
  const date = new Date(value + 'T00:00:00.000Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// Called on an explicit start action, never during server/client rendering.
export function localDate(date: Date): string {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

export function weekDayDate(startDate: string, index: number): string {
  if (!isWeekStart(startDate) || !Number.isInteger(index) || index < 0 || index > 6) throw new Error('Invalid week date');
  const date = new Date(startDate + 'T00:00:00.000Z');
  date.setUTCDate(date.getUTCDate() + index);
  return date.toISOString().slice(0, 10);
}

export function formatDay(date: string): string {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(date + 'T00:00:00.000Z'));
}

export function createHabitWeek(startDate: string, draft: WeekAction): HabitWeek {
  if (!isWeekStart(startDate) || !within(draft.action, 300) || !draft.action.trim() || !within(draft.cue, 180) || !within(draft.support, 180)) {
    throw new Error('Invalid week');
  }
  return { startDate, action: draft.action, cue: draft.cue, support: draft.support,
    days: Array.from({ length: 7 }, () => ({ choice: '' as DayChoice, note: '' })), review: '', nextAction: '' };
}

export function parseHabitWeek(value: unknown): HabitWeek | null {
  if (!isRecord(value) || typeof value.startDate !== 'string' || !isWeekStart(value.startDate)
    || !within(value.action, 300) || !value.action.trim() || !within(value.cue, 180) || !within(value.support, 180)
    || !within(value.review, 500) || !within(value.nextAction, 300)
    || !Array.isArray(value.days) || value.days.length !== 7) return null;
  const days: HabitDay[] = [];
  for (const day of value.days) {
    if (!isRecord(day) || !DAY_CHOICES.some(item => item.value === day.choice) || !within(day.note, 180)) return null;
    days.push({ choice: day.choice as DayChoice, note: day.note });
  }
  return { startDate: value.startDate, action: value.action, cue: value.cue, support: value.support,
    days, review: value.review, nextAction: value.nextAction };
}

export function weekDownloadLines(week: HabitWeek): string[] {
  return [
    'MY SEVEN-DAY PLAN',
    'Dates: ' + week.startDate + ' to ' + weekDayDate(week.startDate, 6),
    'Action for this week: ' + week.action,
    'When I planned to try it: ' + (week.cue || 'A moment that fits my routine.'),
    'What could help this week: ' + (week.support || 'Keep it manageable.'),
    '',
    ...week.days.flatMap((day, index) => [
      'Day ' + (index + 1) + ' (' + weekDayDate(week.startDate, index) + '): ' + DAY_CHOICES.find(item => item.value === day.choice)!.label,
      ...(day.note.trim() ? ['Note: ' + day.note] : []),
    ]),
    '',
    'Weekly review: ' + (week.review.trim() || 'Leave a note when ready.'),
    'Action I might try next: ' + (week.nextAction.trim() || 'Choose after reflecting.'),
    'Seven days is a planning window. Changes in health or the time needed to form a habit vary.',
    '',
  ];
}
