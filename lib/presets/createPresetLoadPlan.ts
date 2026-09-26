import type {
  CameraState,
  CanonicalScenarioPreset,
} from '@/lib/presets/types';
import { createCameraStateForShot } from '@/lib/camera/cameraShots';

export interface PresetLoadPlan {
  preset: CanonicalScenarioPreset;
  cameraState: CameraState | null;
}

export function createPresetLoadPlan(
  preset: CanonicalScenarioPreset,
  currentCamera: CameraState
): PresetLoadPlan {
  return {
    preset,
    cameraState: preset.cameraShot
      ? createCameraStateForShot(
          currentCamera,
          preset.cameraShot
        )
      : null,
  };
}
