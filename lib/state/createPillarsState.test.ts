import { describe, expect, test } from 'vitest';

import { FALLBACK_PRESETS } from '@/lib/presets/fallback';
import { createPillarsState } from './createPillarsState';

describe('createPillarsState', () => {
  test('creates the canonical initial state from the first fallback preset', () => {
    const preset = FALLBACK_PRESETS[0];
    const state = createPillarsState(preset);

    expect(state.activeScene).toBe('system');
    expect(state.activePreset).toBe(preset.slug);
    expect(state.activePillar).toBe('Systems');
    expect(state.renderMode).toBe('high-3d');

    expect(state.parameters).toMatchObject({
      aerobicVolume: preset.parameters.aerobicMins,
      resistanceDays: preset.parameters.strengthDays,
      sleepDuration: preset.parameters.sleepDuration,
      wholeFoodRatio: preset.parameters.wholeFoodRatio,
      perceivedStress: preset.parameters.stressLevel,
      alcoholUnits: preset.parameters.alcoholUnits,
    });

    expect(state.overlay).toEqual({
      title: preset.headline,
      status: 'Optimal',
      keyOutcomes: preset.outcomes,
      evidenceLevel: preset.evidenceLevel,
    });
  });

  test('preserves defaults for parameters not represented by presets', () => {
    const state = createPillarsState(FALLBACK_PRESETS[0]);

    expect(state.parameters.sedentaryHours).toBe(6);
    expect(state.parameters.fruitVegPortions).toBe(5);
    expect(state.parameters.upfFrequency).toBe(1);
    expect(state.parameters.regularityScore).toBe(85);
    expect(state.parameters.downRegPracticeMins).toBe(15);
  });

  test('maps a fitness preset to the fitness scene', () => {
    const preset = FALLBACK_PRESETS.find(
      ({ slug }) => slug === 'uk-cmo-optimal'
    );

    if (!preset) {
      throw new Error('Expected uk-cmo-optimal fallback preset');
    }

    const state = createPillarsState(preset);

    expect(state.activeScene).toBe('fitness');
    expect(state.activePillar).toBe('Fitness');
  });

  test('translates warning preset status', () => {
    const preset = FALLBACK_PRESETS.find(
      ({ slug }) => slug === 'single-pillar-failure'
    );

    if (!preset) {
      throw new Error('Expected single-pillar-failure fallback preset');
    }

    const state = createPillarsState(preset);

    expect(state.overlay.status).toBe('Warning');
  });

  test('accepts an explicit render mode', () => {
    const state = createPillarsState(
      FALLBACK_PRESETS[0],
      '2d-canvas'
    );

    expect(state.renderMode).toBe('2d-canvas');
  });

  test('creates independent parameter objects', () => {
    const first = createPillarsState(FALLBACK_PRESETS[0]);
    const second = createPillarsState(FALLBACK_PRESETS[0]);

    expect(first.parameters).not.toBe(second.parameters);
  });
});
