import type { CanonicalScenarioPreset } from '@/lib/presets/types';
import type { PillarParameters } from '@/state/PillarsStateTypes';

export function applyPresetParameters(
  current: PillarParameters,
  preset: CanonicalScenarioPreset
): PillarParameters {
  return {
    ...current,
    aerobicVolume: preset.parameters.aerobicMins,
    resistanceDays: preset.parameters.strengthDays,
    sleepDuration: preset.parameters.sleepDuration,
    wholeFoodRatio: preset.parameters.wholeFoodRatio,
    perceivedStress: preset.parameters.stressLevel,
    alcoholUnits: preset.parameters.alcoholUnits,
  };
}
