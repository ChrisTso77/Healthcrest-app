import type { PillarType } from '@/lib/presets/types';

export type HabitPillar = Exclude<PillarType, 'Systems'>;
export type HabitDraft = { action: string; cue: string; support: string; reflection: string };
export type HabitDrafts = Record<HabitPillar, HabitDraft>;
export type SavedHabitDraft = { version: 2; selected: HabitPillar; drafts: HabitDrafts };
// Keep the existing key so earlier saved drafts can be restored; the payload carries its version.
export const HABIT_DRAFT_KEY = 'healthcrest.habit-draft.v1';
const pillars = ['Fitness', 'Nutrition', 'Sleep', 'Stress'] as const;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isPillar = (value: unknown): value is HabitPillar => pillars.some(pillar => pillar === value);

// Browser storage is untrusted and may contain older, incomplete or edited data.
export function parseSavedHabitDraft(raw: string | null): SavedHabitDraft | null {
  if (!raw || raw.length > 40000) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || (value.version !== 1 && value.version !== 2) || !isPillar(value.selected) || !isRecord(value.drafts)) return null;
    const drafts = {} as HabitDrafts;
    for (const pillar of pillars) {
      const draft = value.drafts[pillar];
      if (!isRecord(draft) || typeof draft.action !== 'string' || draft.action.length > 300 ||
          typeof draft.cue !== 'string' || draft.cue.length > 180 ||
          typeof draft.support !== 'string' || draft.support.length > 180) return null;
      if (value.version === 2 && (typeof draft.reflection !== 'string' || draft.reflection.length > 500)) return null;
      drafts[pillar] = { action: draft.action, cue: draft.cue, support: draft.support,
        reflection: value.version === 2 ? draft.reflection as string : '' };
    }
    return { version: 2, selected: value.selected, drafts };
  } catch {
    return null;
  }
}
