import { describe, expect, test } from 'vitest';

import { FALLBACK_PRESETS } from '@/lib/presets/fallback';
import { createPillarsState } from './createPillarsState';
import { setSceneState } from './setSceneState';

describe('setSceneState', () => {
  test('updates scene and synchronized pillar', () => {
    const initial = createPillarsState(FALLBACK_PRESETS[0]);

    const result = setSceneState(initial, 'sleep');

    expect(result.activeScene).toBe('sleep');
    expect(result.activePillar).toBe('Sleep');
  });

  test('clears preset identity and creates manual overlay', () => {
    const initial = createPillarsState(FALLBACK_PRESETS[0]);

    const result = setSceneState(initial, 'stress');

    expect(result.activePreset).toBeNull();
    expect(result.overlay).toEqual({
      title: 'Manual configuration',
      status: 'Manual',
      keyOutcomes: [],
      evidenceLevel: null,
    });
  });

  test('does not mutate the source state', () => {
    const initial = createPillarsState(FALLBACK_PRESETS[0]);
    const snapshot = structuredClone(initial);

    const result = setSceneState(initial, 'fitness');

    expect(result).not.toBe(initial);
    expect(initial).toEqual(snapshot);
  });
});
