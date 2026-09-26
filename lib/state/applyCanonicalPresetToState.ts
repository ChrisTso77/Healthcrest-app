import type { CanonicalScenarioPreset } from '@/lib/presets/types';
import type { State } from '@/state/PillarsStateTypes';

import { applyPresetParameters } from './applyPresetParameters';
import { createPresetOverlay } from './createPresetOverlay';
import { pillarToScene } from './pillarsMappings';

export function applyCanonicalPresetToState(
  state: State,
  preset: CanonicalScenarioPreset
): State {
  return {
    ...state,
    activeScene: pillarToScene(preset.pillar),
    activePillar: preset.pillar,
    activePreset: preset.slug || preset.id,
    parameters: applyPresetParameters(
      state.parameters,
      preset
    ),
    overlay: createPresetOverlay(preset),
  };
}
