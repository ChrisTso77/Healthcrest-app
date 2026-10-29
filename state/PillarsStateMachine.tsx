import type {
  PillarsAction,
  State,
} from '@/state/PillarsStateTypes';
import { FALLBACK_PRESETS } from '@/lib/presets/fallback';
import { createPillarsState } from '@/lib/state/createPillarsState';
import { applyCanonicalPresetToState } from '@/lib/state/applyCanonicalPresetToState';
import { setSceneState } from '@/lib/state/setSceneState';
import { updateManualParameterState } from '@/lib/state/updateManualParameterState';
import { createManualOverlay } from '@/lib/state/createManualOverlay';

// ============================================================================
// 1. PRESET MAPPINGS & CLINICAL STATE MACHINE REDUCER
// ============================================================================

// State Machine Reducer logic
function stateMachineReducer(state: State, action: PillarsAction): State {
  switch (action.type) {
    case 'SET_SCENE':
      return setSceneState(
        state,
        action.payload
      );
    case 'APPLY_CANONICAL_PRESET':
      return applyCanonicalPresetToState(
        state,
        action.payload
      );

    case 'SET_RENDER_MODE':
      return { ...state, renderMode: action.payload };

    case 'RESTORE_PARAMETERS':
      return {
        ...state,
        parameters: { ...action.payload },
        activePreset: null,
        overlay: createManualOverlay(),
      };

    case 'UPDATE_PARAM':
      return updateManualParameterState(
        state,
        action.payload.key,
        action.payload.value
      );
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
