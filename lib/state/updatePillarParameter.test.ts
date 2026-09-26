import { describe, expect, test } from 'vitest';

import type { PillarParameters } from '@/state/PillarsStateTypes';
import { updatePillarParameter } from './updatePillarParameter';

const baseline: PillarParameters = {
  aerobicVolume: 150,
  resistanceDays: 2,
  sedentaryHours: 6,
  wholeFoodRatio: 80,
  fruitVegPortions: 5,
  upfFrequency: 1,
  sleepDuration: 8,
  regularityScore: 85,
  downRegPracticeMins: 15,
  perceivedStress: 4,
  alcoholUnits: 0,
};

describe('updatePillarParameter', () => {
  test('updates only the requested parameter', () => {
    const result = updatePillarParameter(
      baseline,
      'sleepDuration',
      6.5
    );

    expect(result.sleepDuration).toBe(6.5);
    expect(result.aerobicVolume).toBe(baseline.aerobicVolume);
    expect(result.perceivedStress).toBe(baseline.perceivedStress);
  });

  test('supports another valid parameter key', () => {
    const result = updatePillarParameter(
      baseline,
      'alcoholUnits',
      12
    );

    expect(result.alcoholUnits).toBe(12);
  });

  test('does not mutate the source object', () => {
    const snapshot = { ...baseline };

    const result = updatePillarParameter(
      baseline,
      'wholeFoodRatio',
      50
    );

    expect(result).not.toBe(baseline);
    expect(baseline).toEqual(snapshot);
  });
});
