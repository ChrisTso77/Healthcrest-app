import { describe, expect, test } from 'vitest';

import { FALLBACK_PRESETS } from '@/lib/presets/fallback';
import {
  initialPillarsState,
  pillarsReducer,
} from '@/state/PillarsStateMachine';

describe('pillarsReducer', () => {
  test('SET_SCENE updates scene and pillar and clears preset state', () => {
    const result = pillarsReducer(initialPillarsState, {
      type: 'SET_SCENE',
      payload: 'sleep',
    });

    expect(result.activeScene).toBe('sleep');
    expect(result.activePillar).toBe('Sleep');
    expect(result.activePreset).toBeNull();
    expect(result.overlay).toEqual({
      title: 'Manual configuration',
      status: 'Manual',
      keyOutcomes: [],
      evidenceLevel: null,
    });
  });

  test('APPLY_CANONICAL_PRESET synchronizes canonical preset state', () => {
    const preset = FALLBACK_PRESETS.find(
      ({ slug }) => slug === 'uk-cmo-optimal'
    );

    if (!preset) {
      throw new Error('Expected uk-cmo-optimal fallback preset');
    }

    const result = pillarsReducer(initialPillarsState, {
      type: 'APPLY_CANONICAL_PRESET',
      payload: preset,
    });

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

  test('APPLY_CANONICAL_PRESET translates warning status', () => {
    const preset = FALLBACK_PRESETS.find(
      ({ slug }) => slug === 'single-pillar-failure'
    );

    if (!preset) {
      throw new Error('Expected single-pillar-failure fallback preset');
    }

    const result = pillarsReducer(initialPillarsState, {
      type: 'APPLY_CANONICAL_PRESET',
      payload: preset,
    });

    expect(result.overlay.status).toBe('Warning');
  });

  test('UPDATE_PARAM changes only the selected parameter and clears active preset', () => {
    const result = pillarsReducer(initialPillarsState, {
      type: 'UPDATE_PARAM',
      payload: {
        key: 'sleepDuration',
        value: 6.5,
      },
    });

    expect(result.parameters.sleepDuration).toBe(6.5);
    expect(result.parameters.aerobicVolume)
      .toBe(initialPillarsState.parameters.aerobicVolume);

    expect(result.activePreset).toBeNull();
    expect(result.overlay.status).toBe('Manual');
    expect(result.overlay.title).toBe('Manual configuration');
  });

  test('SET_RENDER_MODE changes render mode without altering clinical state', () => {
    const result = pillarsReducer(initialPillarsState, {
      type: 'SET_RENDER_MODE',
      payload: '2d-canvas',
    });

    expect(result.renderMode).toBe('2d-canvas');
    expect(result.activeScene).toBe(initialPillarsState.activeScene);
    expect(result.activePreset).toBe(initialPillarsState.activePreset);
    expect(result.parameters).toBe(initialPillarsState.parameters);
    expect(result.overlay).toBe(initialPillarsState.overlay);
  });
});
