import { HABIT_DRAFT_KEY, parseSavedHabitDraft, type SavedHabitDraft } from './habitDraft';

// Read-only boundary used by the explicit legacy restore controls.
// No persistent-storage writer or migration capability accepted.
export type LegacyRecovery =
  | { status: 'available'; saved: SavedHabitDraft }
  | { status: 'missing' | 'invalid' | 'unavailable' };
export function recoverLegacyHabit(storage: Pick<Storage, 'getItem'>): LegacyRecovery {
  try {
    const raw = storage.getItem(HABIT_DRAFT_KEY);
    if (raw === null) return { status: 'missing' };
    const saved = parseSavedHabitDraft(raw);
    return saved ? { status: 'available', saved } : { status: 'invalid' };
  } catch {
    return { status: 'unavailable' };
  }
}
