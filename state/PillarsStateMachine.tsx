import type {
  PillarsAction,
  State,
} from '@/state/PillarsStateTypes';
import { FALLBACK_PRESETS } from '@/lib/presets/fallback';
import {
  pillarToScene,
  sceneToPillar,
} from '@/lib/state/pillarsMappings';
import { createPillarsState } from '@/lib/state/createPillarsState';
import { createManualOverlay } from '@/lib/state/createManualOverlay';
import { applyPresetParameters } from '@/lib/state/applyPresetParameters';
import { createPresetOverlay } from '@/lib/state/createPresetOverlay';
import { updatePillarParameter } from '@/lib/state/updatePillarParameter';

// ============================================================================
// 1. PRESET MAPPINGS & CLINICAL STATE MACHINE REDUCER
// ============================================================================

// State Machine Reducer logic
function stateMachineReducer(state: State, action: PillarsAction): State {
  switch (action.type) {
    case 'SET_SCENE':
      return {
        ...state,
        activeScene: action.payload,
        activePillar: sceneToPillar(action.payload),
        activePreset: null,
        overlay: createManualOverlay(),
      };
    case 'APPLY_CANONICAL_PRESET': {
      const preset = action.payload;
      const scene = pillarToScene(preset.pillar);

      return {
        ...state,
        activeScene: scene,
        activePillar: preset.pillar,
        activePreset: preset.slug || preset.id,
        parameters: applyPresetParameters(
          state.parameters,
          preset
        ),
        overlay: createPresetOverlay(preset),
      };
    }

    case 'SET_RENDER_MODE':
      return { ...state, renderMode: action.payload };

    case 'UPDATE_PARAM':
      return {
        ...state,
        parameters: updatePillarParameter(
          state.parameters,
          action.payload.key,
          action.payload.value
        ),
        activePreset: null,
        overlay: createManualOverlay(),
      };
    default:
      return state;
  }
}

// ============================================================================
// 2. INITIAL STATE & PUBLIC REDUCER
// ============================================================================

const INITIAL_PRESET = FALLBACK_PRESETS[0];

export const initialPillarsState: State =
  createPillarsState(INITIAL_PRESET);

export { stateMachineReducer as pillarsReducer };
