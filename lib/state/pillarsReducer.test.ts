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

  test('APPLY_CANONICAL_PRESET preserves parameters not owned by presets', () => {
    const preset = FALLBACK_PRESETS.find(
      ({ slug }) => slug === 'uk-cmo-optimal'
    );

    if (!preset) {
      throw new Error('Expected uk-cmo-optimal fallback preset');
    }

    const customState = {
      ...initialPillarsState,
      parameters: {
        ...initialPillarsState.parameters,
        sedentaryHours: 11,
        fruitVegPortions: 9,
        upfFrequency: 4,
        regularityScore: 33,
        downRegPracticeMins: 7,
      },
    };

    const result = pillarsReducer(customState, {
      type: 'APPLY_CANONICAL_PRESET',
      payload: preset,
    });

    expect(result.parameters.sedentaryHours).toBe(11);
    expect(result.parameters.fruitVegPortions).toBe(9);
    expect(result.parameters.upfFrequency).toBe(4);
    expect(result.parameters.regularityScore).toBe(33);
    expect(result.parameters.downRegPracticeMins).toBe(7);
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

  test('SET_SCENE and UPDATE_PARAM use the same canonical manual overlay', () => {
    const sceneResult = pillarsReducer(initialPillarsState, {
      type: 'SET_SCENE',
      payload: 'sleep',
    });

    const parameterResult = pillarsReducer(initialPillarsState, {
      type: 'UPDATE_PARAM',
      payload: {
        key: 'sleepDuration',
        value: 6.5,
      },
    });

    expect(sceneResult.overlay).toEqual(parameterResult.overlay);
    expect(sceneResult.overlay).toEqual({
      title: 'Manual configuration',
      status: 'Manual',
      keyOutcomes: [],
      evidenceLevel: null,
    });
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
