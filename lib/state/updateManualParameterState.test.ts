import { describe, expect, test } from 'vitest';

import { FALLBACK_PRESETS } from '@/lib/presets/fallback';
import { createPillarsState } from './createPillarsState';
import { updateManualParameterState } from './updateManualParameterState';

describe('updateManualParameterState', () => {
  test('updates the requested parameter', () => {
    const initial = createPillarsState(FALLBACK_PRESETS[0]);

    const result = updateManualParameterState(
      initial,
      'sleepDuration',
      6.5
    );

    expect(result.parameters.sleepDuration).toBe(6.5);
  });

  test('clears preset identity and creates manual overlay', () => {
    const initial = createPillarsState(FALLBACK_PRESETS[0]);

    const result = updateManualParameterState(
      initial,
      'perceivedStress',
      8
    );

    expect(result.activePreset).toBeNull();
    expect(result.overlay).toEqual({
      title: 'Manual configuration',
      status: 'Manual',
      keyOutcomes: [],
      evidenceLevel: null,
    });
  });

  test('does not mutate the source state or parameters', () => {
    const initial = createPillarsState(FALLBACK_PRESETS[0]);
    const snapshot = structuredClone(initial);

    const result = updateManualParameterState(
      initial,
      'alcoholUnits',
      10
    );

    expect(result).not.toBe(initial);
    expect(result.parameters).not.toBe(initial.parameters);
    expect(initial).toEqual(snapshot);
  });
});
