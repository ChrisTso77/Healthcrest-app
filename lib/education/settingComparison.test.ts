import { describe, expect, test } from 'vitest';
import { initialPillarsState } from '@/state/PillarsStateMachine';
import type { State } from '@/state/PillarsStateTypes';
import { captureComparisonStart, compareSceneAppearance, compareSettings, COMPARED_SETTINGS, drivesScene, markerPosition, OTHER_SETTINGS, otherSettingChanges, settingDelta } from './settingComparison';

const base = () => captureComparisonStart(initialPillarsState.parameters, 'An example');
describe('comparison inputs and display', () => {
  test('copies every starting input so later edits cannot rewrite it', () => {
    const parameters = { ...initialPillarsState.parameters };
    const start = captureComparisonStart(parameters, 'Chosen example');
    parameters.sleepDuration = 5;
    expect(start.parameters.sleepDuration).toBe(8);
    expect(start.label).toBe('Chosen example');
    expect(start.parameters).not.toBe(parameters);
  });
  test('accounts for every model input once, including inputs hidden from the sliders', () => {
    const keys = [...COMPARED_SETTINGS, ...OTHER_SETTINGS].map(item => item.key);
    expect([...keys].sort()).toEqual(Object.keys(initialPillarsState.parameters).sort());
    expect(new Set(keys).size).toBe(keys.length);
  });
  test('shows unchanged inputs without presenting a change as a health benefit', () => {
    const rows = compareSettings(base(), initialPillarsState.parameters);
    expect(rows.every(row => row.difference === 'Unchanged' && !row.changed)).toBe(true);
    const current = { ...initialPillarsState.parameters, sleepDuration: 7.5, wholeFoodRatio: 90, perceivedStress: 8 };
    const result = compareSettings(base(), current);
    expect(result.find(row => row.key === 'sleepDuration')?.difference).toBe('-0.5 hours/night');
    expect(result.find(row => row.key === 'wholeFoodRatio')?.difference).toBe('+10 percentage points');
    expect(result.find(row => row.key === 'perceivedStress')?.difference).toBe('+6 points');
  });
  test('formats numerical differences without floating-point noise or relative percentages', () => {
    expect(settingDelta(0.1, 0.4, 'hours/night')).toBe('+0.3 hours/night');
    expect(settingDelta(75, 80, 'percentage points')).toBe('+5 percentage points');
    expect(settingDelta(1, 1, 'points')).toBe('Unchanged');
  });
  test('keeps control markers on the track and aligned to its endpoints', () => {
    expect(markerPosition(4, 4, 10)).toBe(12);
    expect(markerPosition(10, 4, 10)).toBe(288);
    expect(markerPosition(7, 4, 10)).toBe(150);
    expect(markerPosition(-10, 4, 10)).toBe(12);
    expect(markerPosition(99, 4, 10)).toBe(288);
  });
  test('reports additional changed inputs without losing their original values', () => {
    const changes = otherSettingChanges(base(), { ...initialPillarsState.parameters, resistanceDays: 4, alcoholUnits: 18 });
    expect(changes.map(change => change.key)).toEqual(['resistanceDays', 'alcoholUnits']);
    expect(changes[1]).toMatchObject({ start: 2, current: 18, unit: 'units (time period unspecified)' });
  });
});

describe('actual scene rules', () => {
  test('uses the current scene for both sides after a pillar switch', () => {
    const state: State = { ...initialPillarsState, activeScene: 'sleep', activePillar: 'Sleep' };
    const appearance = compareSceneAppearance(base(), state);
    expect(appearance.changed).toBe(false);
    expect(appearance.start.colourName).toBe('Indigo');
    expect(appearance.current.colourName).toBe('Indigo');
  });
  test('keeps value changes visible even when they stay within the same graphic range', () => {
    const state: State = { ...initialPillarsState, activeScene: 'sleep', activePillar: 'Sleep',
      parameters: { ...initialPillarsState.parameters, sleepDuration: 7.5 } };
    expect(compareSceneAppearance(base(), state).changed).toBe(false);
    expect(compareSettings(base(), state.parameters).find(row => row.key === 'sleepDuration')?.changed).toBe(true);
  });
  test('describes a real short-sleep visual change using the renderer rules', () => {
    const state: State = { ...initialPillarsState, activeScene: 'sleep', activePillar: 'Sleep',
      parameters: { ...initialPillarsState.parameters, sleepDuration: 5 } };
    const appearance = compareSceneAppearance(base(), state);
    expect(appearance.changed).toBe(true);
    expect(appearance.start.colourName).toBe('Indigo');
    expect(appearance.current).toMatchObject({ colourName: 'Violet', glow: 'Dimmer glow' });
  });
  test('does not invent a combined-scene effect for food or strength inputs', () => {
    const state: State = { ...initialPillarsState, activeScene: 'system', activePillar: 'Systems',
      parameters: { ...initialPillarsState.parameters, wholeFoodRatio: 20, resistanceDays: 6 } };
    expect(compareSceneAppearance(base(), state).changed).toBe(false);
    expect(drivesScene('system', 'wholeFoodRatio')).toBe(false);
    expect(drivesScene('system', 'resistanceDays')).toBe(false);
    expect(drivesScene('system', 'downRegPracticeMins')).toBe(true);
  });
  test('includes the additional food-frequency driver in the nutrition comparison', () => {
    const state: State = { ...initialPillarsState, activeScene: 'nutrition', activePillar: 'Nutrition',
      parameters: { ...initialPillarsState.parameters, upfFrequency: 4 } };
    expect(compareSceneAppearance(base(), state).changed).toBe(true);
    expect(drivesScene('nutrition', 'upfFrequency')).toBe(true);
    expect(otherSettingChanges(base(), state.parameters).map(row => row.key)).toEqual(['upfFrequency']);
  });
});
