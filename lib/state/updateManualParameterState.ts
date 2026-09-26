import type {
  PillarParameters,
  State,
} from '@/state/PillarsStateTypes';

import { createManualOverlay } from './createManualOverlay';
import { updatePillarParameter } from './updatePillarParameter';

export function updateManualParameterState(
  state: State,
  key: keyof PillarParameters,
  value: number
): State {
  return {
    ...state,
    parameters: updatePillarParameter(
      state.parameters,
      key,
      value
    ),
    activePreset: null,
    overlay: createManualOverlay(),
  };
}
