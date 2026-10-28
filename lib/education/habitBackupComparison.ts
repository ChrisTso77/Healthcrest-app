import type { HabitDraft } from './habitDraft';

// Both values are page drafts or validated, migrated backup drafts.
// Compare exact text; counts or dates alone cannot establish identical records.
export function habitBackupDifferences(current: HabitDraft, backup: HabitDraft): string[] {
  const changes: string[] = [];
  const fields = [
    ['action', 'Next step action'], ['cue', 'When to try it'],
    ['support', 'What could help'], ['reflection', 'Extra reflection notes'],
  ] as const;
  for (const [key, label] of fields) if (current[key] !== backup[key]) changes.push(label);
  const before = current.week;
  const after = backup.week;
  if (before && !after) changes.push('Current week will be removed');
  else if (!before && after) changes.push('A current week will be added');
  else if (before && after) {
    const weekFields = [
      ['startDate', 'Week dates'], ['action', 'Week action'], ['cue', 'Week cue'],
      ['support', 'Week support'], ['review', 'Weekly review'], ['nextAction', 'Possible next action'],
    ] as const;
    for (const [key, label] of weekFields) if (before[key] !== after[key]) changes.push(label);
    if (before.days.some((day, index) => day.choice !== after.days[index].choice || day.note !== after.days[index].note)) {
      changes.push('Daily check-ins or notes');
    }
  }
  return changes;
}
