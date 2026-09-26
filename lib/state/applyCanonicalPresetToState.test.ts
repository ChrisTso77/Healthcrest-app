import { describe, expect, test } from 'vitest';

import { FALLBACK_PRESETS } from '@/lib/presets/fallback';
import { createPillarsState } from './createPillarsState';
import { applyCanonicalPresetToState } from './applyCanonicalPresetToState';

describe('applyCanonicalPresetToState', () => {
  test('synchronizes scene, pillar, preset identity, parameters and overlay', () => {
    const initial = createPillarsState(FALLBACK_PRESETS[0]);

    const preset = FALLBACK_PRESETS.find(
      ({ slug }) => slug === 'uk-cmo-optimal'
    );

    if (!preset) {
      throw new Error('Expected uk-cmo-optimal fallback preset');
    }

    const result = applyCanonicalPresetToState(
      initial,
      preset
    );

    expect(result.activeScene).toBe('fitness');
    expect(result.activePillar).toBe('Fitness');
    expect(result.activePreset).toBe('uk-cmo-optimal');

    expect(result.parameters).toMatchObject({
      aerobicVolume: preset.parameters.aerobicMins,
      resistanceDays: preset.parameters.strengthDays,
      sleepDuration: preset.parameters.sleepDuration,
      wholeFoodRatio: preset.parameters.wholeFoodRatio,
      perceivedStress: preset.parameters.stressLevel,
      alcoholUnits: preset.parameters.alcoholUnits,
    });

    expect(result.overlay).toEqual({
      title: preset.headline,
      status: 'Optimal',
      keyOutcomes: preset.outcomes,
      evidenceLevel: preset.evidenceLevel,
    });
  });

  test('preserves parameters not owned by canonical presets', () => {
    const initial = createPillarsState(FALLBACK_PRESETS[0]);

    const custom = {
      ...initial,
      parameters: {
        ...initial.parameters,
        sedentaryHours: 11,
        fruitVegPortions: 9,
        upfFrequency: 4,
        regularityScore: 33,
        downRegPracticeMins: 7,
      },
    };

    const result = applyCanonicalPresetToState(
      custom,
      FALLBACK_PRESETS[2]
    );

    expect(result.parameters.sedentaryHours).toBe(11);
    expect(result.parameters.fruitVegPortions).toBe(9);
    expect(result.parameters.upfFrequency).toBe(4);
    expect(result.parameters.regularityScore).toBe(33);
    expect(result.parameters.downRegPracticeMins).toBe(7);
  });

  test('does not mutate the source state', () => {
    const initial = createPillarsState(FALLBACK_PRESETS[0]);
    const snapshot = structuredClone(initial);

    const result = applyCanonicalPresetToState(
      initial,
      FALLBACK_PRESETS[1]
    );

    expect(result).not.toBe(initial);
    expect(initial).toEqual(snapshot);
  });

  test('translates warning preset status', () => {
    const initial = createPillarsState(FALLBACK_PRESETS[0]);

    const result = applyCanonicalPresetToState(
      initial,
      FALLBACK_PRESETS[1]
    );

    expect(result.overlay.status).toBe('Warning');
  });
});
