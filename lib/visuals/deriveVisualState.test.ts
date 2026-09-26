import { describe, expect, test } from 'vitest';

import type { PillarParameters } from '../../state/PillarsStateTypes';
import { deriveVisualState } from './deriveVisualState';

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

describe('deriveVisualState', () => {
  test('renders low aerobic volume as red with reduced pulse', () => {
    const result = deriveVisualState(
      { ...baseline, aerobicVolume: 59 },
      'fitness'
    );

    expect(result.coreColor).toBe('#EF4444');
    expect(result.pulseSpeed).toBe(0.4);
    expect(result.meshDistortion).toBe(0.5);
  });

  test('renders very high aerobic volume as amber with increased pulse', () => {
    const result = deriveVisualState(
      { ...baseline, aerobicVolume: 351 },
      'fitness'
    );

    expect(result.coreColor).toBe('#F59E0B');
    expect(result.pulseSpeed).toBe(2.5);
    expect(result.meshDistortion).toBe(0.8);
  });

  test('renders poor nutrition state as red', () => {
    const result = deriveVisualState(
      { ...baseline, wholeFoodRatio: 39 },
      'nutrition'
    );

    expect(result.coreColor).toBe('#EF4444');
    expect(result.meshDistortion).toBe(0.7);
  });

  test('renders favourable nutrition state as cyan', () => {
    const result = deriveVisualState(
      baseline,
      'nutrition'
    );

    expect(result.coreColor).toBe('#06B6D4');
  });

  test('renders short sleep with reduced pulse and glow', () => {
    const result = deriveVisualState(
      { ...baseline, sleepDuration: 5.9 },
      'sleep'
    );

    expect(result.coreColor).toBe('#8B5CF6');
    expect(result.pulseSpeed).toBe(0.3);
    expect(result.glowIntensity).toBe(0.3);
  });

  test('renders sleep of six hours or more as indigo', () => {
    const result = deriveVisualState(
      { ...baseline, sleepDuration: 6 },
      'sleep'
    );

    expect(result.coreColor).toBe('#6366F1');
    expect(result.glowIntensity).toBe(2);
  });

  test('renders high perceived stress as red with negative tilt', () => {
    const result = deriveVisualState(
      { ...baseline, perceivedStress: 7 },
      'stress'
    );

    expect(result.coreColor).toBe('#EF4444');
    expect(result.seesawTilt).toBe(-0.8);
  });

  test('renders lower perceived stress as green with positive tilt', () => {
    const result = deriveVisualState(
      { ...baseline, perceivedStress: 6 },
      'stress'
    );

    expect(result.coreColor).toBe('#10B981');
    expect(result.seesawTilt).toBe(0.8);
  });

  test('renders optimal system score as green with maximum glow', () => {
    const result = deriveVisualState(
      baseline,
      'system'
    );

    expect(result.coreColor).toBe('#10B981');
    expect(result.glowIntensity).toBe(2.5);
  });

  test('renders two-point system score as amber', () => {
    const result = deriveVisualState(
      {
        ...baseline,
        perceivedStress: 7,
        downRegPracticeMins: 0,
      },
      'system'
    );

    expect(result.coreColor).toBe('#F59E0B');
    expect(result.meshDistortion).toBe(0.3);
  });

  test('renders low system score as red with high distortion', () => {
    const result = deriveVisualState(
      {
        ...baseline,
        aerobicVolume: 50,
        sleepDuration: 5,
        perceivedStress: 8,
        downRegPracticeMins: 0,
      },
      'system'
    );

    expect(result.coreColor).toBe('#EF4444');
    expect(result.meshDistortion).toBe(0.9);
  });

  test('preserves constant particle density', () => {
    const result = deriveVisualState(
      baseline,
      'system'
    );

    expect(result.particleDensity).toBe(40);
  });
});
