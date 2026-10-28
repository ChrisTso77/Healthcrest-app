import { describe, expect, test } from 'vitest';
import type { State } from '@/state/PillarsStateTypes';
import { initialPillarsState } from '@/state/PillarsStateMachine';
import { explainVisualState } from './explainVisualState';

describe('reader-facing visual key', () => {
  test('names the actual short-sleep colour, glow and selected input', () => {
    const state: State = { ...initialPillarsState, activeScene: 'sleep', activePillar: 'Sleep', parameters: { ...initialPillarsState.parameters, sleepDuration: 5 } };
    expect(explainVisualState(state)).toMatchObject({ colour: '#8B5CF6', colourName: 'Violet', glow: 'Dimmer glow', shortInput: '5h sleep' });
  });
  test('keeps the chosen input readable when a change stays within the same colour range', () => {
    const state: State = { ...initialPillarsState, activeScene: 'sleep', activePillar: 'Sleep', parameters: { ...initialPillarsState.parameters, sleepDuration: 7 } };
    const next: State = { ...state, parameters: { ...state.parameters, sleepDuration: 8 } };
    expect(explainVisualState(next).colour).toBe(explainVisualState(state).colour);
    expect(explainVisualState(next).shortInput).toBe('8h sleep');
    expect(explainVisualState(state).shortInput).toBe('7h sleep');
  });
  test('reveals the relaxation input that can keep a combined scene green despite a higher stress setting', () => {
    const state: State = { ...initialPillarsState, activeScene: 'system', activePillar: 'Systems', parameters: { ...initialPillarsState.parameters, aerobicVolume: 180, sleepDuration: 8, perceivedStress: 8, downRegPracticeMins: 15 } };
    const result = explainVisualState(state);
    expect(result.colourName).toBe('Emerald');
    expect(result.inputs).toContain('Perceived stress: 8 out of 10; relaxation-practice input: 15 minutes.');
    expect(result.inputs).toContain('Food and strength settings do not change this combined 3D colour.');
  });
});
