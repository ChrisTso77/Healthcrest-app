import type {
  SceneId,
  State,
} from '@/state/PillarsStateTypes';

import { createManualOverlay } from './createManualOverlay';
import { sceneToPillar } from './pillarsMappings';

export function setSceneState(
  state: State,
  scene: SceneId
): State {
  return {
    ...state,
    activeScene: scene,
    activePillar: sceneToPillar(scene),
    activePreset: null,
    overlay: createManualOverlay(),
  };
}
