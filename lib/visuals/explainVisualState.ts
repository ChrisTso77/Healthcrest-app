import type { State } from '@/state/PillarsStateTypes';
import { deriveVisualState } from './deriveVisualState';

const colourNames: Record<string, string> = {
  '#10B981': 'Emerald', '#EF4444': 'Red', '#F59E0B': 'Amber',
  '#06B6D4': 'Cyan', '#8B5CF6': 'Violet', '#6366F1': 'Indigo',
};

export function explainVisualState(state: State) {
  const p = state.parameters;
  const visual = deriveVisualState(p, state.activeScene);
  const inputs = {
    fitness: ['Weekly aerobic activity: ' + p.aerobicVolume + ' minutes/week.'],
    nutrition: ['Whole-food setting: ' + p.wholeFoodRatio + '%.', 'Other food-pattern input: processed-food frequency setting ' + p.upfFrequency + '.'],
    sleep: ['Sleep duration: ' + p.sleepDuration + ' hours/night.'],
    stress: ['Perceived stress: ' + p.perceivedStress + ' out of 10.'],
    system: [
      'Weekly aerobic activity: ' + p.aerobicVolume + ' minutes/week.',
      'Sleep duration: ' + p.sleepDuration + ' hours/night.',
      'Perceived stress: ' + p.perceivedStress + ' out of 10; relaxation-practice input: ' + p.downRegPracticeMins + ' minutes.',
      'Food and strength settings do not change this combined 3D colour.',
    ],
  };
  return {
    colour: visual.coreColor,
    colourName: colourNames[visual.coreColor] ?? 'Scene colour',
    glow: visual.glowIntensity < 1 ? 'Dimmer glow' : visual.glowIntensity >= 2 ? 'Brighter glow' : 'Standard glow',
    texture: visual.meshDistortion >= 0.5 ? 'More lattice wobble' : visual.meshDistortion >= 0.3 ? 'Some lattice wobble' : 'Gentle lattice wobble',
    inputs: inputs[state.activeScene],
    shortInput: state.activeScene === 'sleep' ? p.sleepDuration + 'h sleep'
      : state.activeScene === 'fitness' ? p.aerobicVolume + ' min/week'
        : state.activeScene === 'nutrition' ? p.wholeFoodRatio + '% food setting'
          : state.activeScene === 'stress' ? 'Stress ' + p.perceivedStress + '/10'
            : 'Activity · sleep · stress',
  };
}
