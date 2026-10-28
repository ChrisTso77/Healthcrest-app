import type { PillarParameters, SceneId, State } from '@/state/PillarsStateTypes';
import { deriveVisualState } from '@/lib/visuals/deriveVisualState';
import { explainVisualState } from '@/lib/visuals/explainVisualState';

export type ComparisonStart = { label: string; parameters: Readonly<PillarParameters> };
export function captureComparisonStart(parameters: PillarParameters, label: string): ComparisonStart {
  return { label, parameters: { ...parameters } };
}

export const COMPARED_SETTINGS = [
  { key: 'aerobicVolume', pillar: 'Fitness', label: 'Weekly aerobic activity', unit: 'minutes/week', changeUnit: 'minutes/week', min: 0, max: 400 },
  { key: 'wholeFoodRatio', pillar: 'Nutrition', label: 'Whole-food setting', unit: '%', changeUnit: 'percentage points', min: 0, max: 100 },
  { key: 'sleepDuration', pillar: 'Sleep', label: 'Sleep duration', unit: 'hours/night', changeUnit: 'hours/night', min: 4, max: 10 },
  { key: 'perceivedStress', pillar: 'Stress', label: 'Perceived stress', unit: 'out of 10', changeUnit: 'points', min: 1, max: 10 },
] as const;
export const OTHER_SETTINGS = [
  { key: 'resistanceDays', label: 'Strength activity setting', unit: 'days/week' },
  { key: 'sedentaryHours', label: 'Sedentary-time setting', unit: 'hours' },
  { key: 'fruitVegPortions', label: 'Fruit and vegetable setting', unit: 'portions' },
  { key: 'upfFrequency', label: 'Processed-food frequency input', unit: 'model input' },
  { key: 'regularityScore', label: 'Sleep-regularity input', unit: 'model input' },
  { key: 'downRegPracticeMins', label: 'Relaxation-practice input', unit: 'minutes' },
  { key: 'alcoholUnits', label: 'Alcohol input', unit: 'units (time period unspecified)' },
] as const;

const number = new Intl.NumberFormat('en-GB', { maximumSignificantDigits: 12 });
const signed = new Intl.NumberFormat('en-GB', { maximumSignificantDigits: 12, signDisplay: 'exceptZero' });
export const formatSettingNumber = (value: number) => number.format(value);
export function settingDelta(start: number, current: number, unit: string): string {
  return start === current ? 'Unchanged' : signed.format(current - start) + ' ' + unit;
}
export function markerPosition(value: number, min: number, max: number): number {
  return 12 + Math.min(1, Math.max(0, (value - min) / (max - min))) * 276;
}
export function compareSettings(start: ComparisonStart, current: PillarParameters) {
  return COMPARED_SETTINGS.map(setting => ({
    ...setting, start: start.parameters[setting.key], current: current[setting.key],
    changed: start.parameters[setting.key] !== current[setting.key],
    difference: settingDelta(start.parameters[setting.key], current[setting.key], setting.changeUnit),
  }));
}
export function otherSettingChanges(start: ComparisonStart, current: PillarParameters) {
  return OTHER_SETTINGS.filter(setting => start.parameters[setting.key] !== current[setting.key])
    .map(setting => ({ ...setting, start: start.parameters[setting.key], current: current[setting.key] }));
}

const sceneInputs: Record<SceneId, readonly (keyof PillarParameters)[]> = {
  fitness: ['aerobicVolume'], nutrition: ['wholeFoodRatio', 'upfFrequency'], sleep: ['sleepDuration'],
  stress: ['perceivedStress'], system: ['aerobicVolume', 'sleepDuration', 'perceivedStress', 'downRegPracticeMins'],
};
export const drivesScene = (scene: SceneId, key: keyof PillarParameters) => sceneInputs[scene].includes(key);
export function compareSceneAppearance(start: ComparisonStart, current: State) {
  // Apply the SAME current scene to both parameter sets so a pillar switch
  // cannot masquerade as a parameter-driven visual change.
  const startingState = { ...current, parameters: { ...start.parameters } };
  const before = deriveVisualState(startingState.parameters, current.activeScene);
  const after = deriveVisualState(current.parameters, current.activeScene);
  const changed = (Object.keys(before) as (keyof typeof before)[]).some(key => before[key] !== after[key]);
  return { start: explainVisualState(startingState), current: explainVisualState(current), changed };
}
