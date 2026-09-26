import type {
  CanonicalScenarioPreset,
  PillarType,
} from '@/lib/presets/types';

import type {
  ClinicalOverlayData,
  SceneId,
} from '@/state/PillarsStateTypes';

export function pillarToScene(
  pillar: CanonicalScenarioPreset['pillar']
): SceneId {
  switch (pillar) {
    case 'Fitness':
      return 'fitness';
    case 'Nutrition':
      return 'nutrition';
    case 'Sleep':
      return 'sleep';
    case 'Stress':
      return 'stress';
    case 'Systems':
    default:
      return 'system';
  }
}

export function canonicalStatusToOverlayStatus(
  status: CanonicalScenarioPreset['status']
): ClinicalOverlayData['status'] {
  switch (status) {
    case 'warning':
      return 'Warning';
    case 'critical':
      return 'Critical';
    case 'optimal':
    default:
      return 'Optimal';
  }
}

export function sceneToPillar(scene: SceneId): PillarType {
  switch (scene) {
    case 'fitness':
      return 'Fitness';
    case 'nutrition':
      return 'Nutrition';
    case 'sleep':
      return 'Sleep';
    case 'stress':
      return 'Stress';
    case 'system':
    default:
      return 'Systems';
  }
}
