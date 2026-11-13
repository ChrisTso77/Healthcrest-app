import { HABIT_DRAFT_KEY, parseSavedHabitDraft, type SavedHabitDraft } from './habitDraft';

// Preparation only: deliberately not wired to UI. Call only after explicit user
// restore consent. No persistent-storage writer or migration capability accepted.
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
