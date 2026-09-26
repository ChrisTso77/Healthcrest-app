import type {
  CanonicalScenarioPreset,
  RenderMode,
} from '@/lib/presets/types';

import type {
  PillarParameters,
  State,
} from '@/state/PillarsStateTypes';

import {
  canonicalStatusToOverlayStatus,
  pillarToScene,
} from '@/lib/state/pillarsMappings';

const DEFAULT_PARAMS: PillarParameters = {
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

export function createPillarsState(
  preset: CanonicalScenarioPreset,
  renderMode: RenderMode = 'high-3d'
): State {
  return {
    activeScene: pillarToScene(preset.pillar),
    activePreset: preset.slug || preset.id,
    activePillar: preset.pillar,
    renderMode,
    parameters: {
      ...DEFAULT_PARAMS,
      aerobicVolume: preset.parameters.aerobicMins,
      resistanceDays: preset.parameters.strengthDays,
      sleepDuration: preset.parameters.sleepDuration,
      wholeFoodRatio: preset.parameters.wholeFoodRatio,
      perceivedStress: preset.parameters.stressLevel,
      alcoholUnits: preset.parameters.alcoholUnits,
    },
    overlay: {
      title: preset.headline,
      status: canonicalStatusToOverlayStatus(preset.status),
      keyOutcomes: preset.outcomes,
      evidenceLevel: preset.evidenceLevel,
    },
  };
}
