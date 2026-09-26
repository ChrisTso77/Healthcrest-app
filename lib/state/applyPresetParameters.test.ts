import { describe, expect, test } from 'vitest';

import { FALLBACK_PRESETS } from '@/lib/presets/fallback';
import type { PillarParameters } from '@/state/PillarsStateTypes';
import { applyPresetParameters } from './applyPresetParameters';

const current: PillarParameters = {
  aerobicVolume: 10,
  resistanceDays: 1,
  sedentaryHours: 9,
  wholeFoodRatio: 25,
  fruitVegPortions: 2,
  upfFrequency: 4,
  sleepDuration: 5,
  regularityScore: 40,
  downRegPracticeMins: 3,
  perceivedStress: 9,
  alcoholUnits: 20,
};

describe('applyPresetParameters', () => {
  test('updates every preset-owned parameter', () => {
    const preset = FALLBACK_PRESETS[0];

    const result = applyPresetParameters(current, preset);

    expect(result).toMatchObject({
      aerobicVolume: preset.parameters.aerobicMins,
      resistanceDays: preset.parameters.strengthDays,
      sleepDuration: preset.parameters.sleepDuration,
      wholeFoodRatio: preset.parameters.wholeFoodRatio,
      perceivedStress: preset.parameters.stressLevel,
      alcoholUnits: preset.parameters.alcoholUnits,
    });
  });

  test('preserves parameters not represented by canonical presets', () => {
    const result = applyPresetParameters(
      current,
      FALLBACK_PRESETS[0]
    );

    expect(result.sedentaryHours).toBe(current.sedentaryHours);
    expect(result.fruitVegPortions).toBe(current.fruitVegPortions);
    expect(result.upfFrequency).toBe(current.upfFrequency);
    expect(result.regularityScore).toBe(current.regularityScore);
    expect(result.downRegPracticeMins)
      .toBe(current.downRegPracticeMins);
  });

  test('does not mutate the existing parameter object', () => {
    const snapshot = { ...current };

    const result = applyPresetParameters(
      current,
      FALLBACK_PRESETS[0]
    );

    expect(result).not.toBe(current);
    expect(current).toEqual(snapshot);
  });
});
