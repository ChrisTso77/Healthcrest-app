import type {
  PillarParameters,
  PillarsAction,
  State,
} from '@/state/PillarsStateTypes';
import { FALLBACK_PRESETS } from '@/lib/presets/fallback';
import {
  canonicalStatusToOverlayStatus,
  pillarToScene,
  sceneToPillar,
} from '@/lib/state/pillarsMappings';

// ============================================================================
// 1. PRESET MAPPINGS & CLINICAL STATE MACHINE REDUCER
// ============================================================================

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

// State Machine Reducer logic
function stateMachineReducer(state: State, action: PillarsAction): State {
  switch (action.type) {
    case 'SET_SCENE':
      return {
        ...state,
        activeScene: action.payload,
        activePillar: sceneToPillar(action.payload),
        activePreset: null,
        overlay: {
          title: 'Manual configuration',
          status: 'Manual',
          keyOutcomes: [],
          evidenceLevel: null,
        },
      };
    case 'APPLY_CANONICAL_PRESET': {
      const preset = action.payload;
      const scene = pillarToScene(preset.pillar);

      return {
        ...state,
        activeScene: scene,
        activePillar: preset.pillar,
        activePreset: preset.slug || preset.id,
        parameters: {
          ...state.parameters,
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

    case 'SET_RENDER_MODE':
      return { ...state, renderMode: action.payload };

    case 'UPDATE_PARAM': {
      const newParams = { ...state.parameters, [action.payload.key]: action.payload.value };
      return {
        ...state,
        parameters: newParams,
        activePreset: null,
        overlay: {
          title: 'Manual configuration',
          status: 'Manual',
          keyOutcomes: [],
          evidenceLevel: null,
        },
      };
    }
    default:
      return state;
  }
}

// ============================================================================
// 2. INITIAL STATE & PUBLIC REDUCER
// ============================================================================

const INITIAL_PRESET = FALLBACK_PRESETS[0];

export const initialPillarsState: State = {
  activeScene: 'system',
  activePreset: INITIAL_PRESET.slug,
  activePillar: INITIAL_PRESET.pillar,
  renderMode: 'high-3d',
  parameters: {
    ...DEFAULT_PARAMS,
    aerobicVolume: INITIAL_PRESET.parameters.aerobicMins,
    resistanceDays: INITIAL_PRESET.parameters.strengthDays,
    sleepDuration: INITIAL_PRESET.parameters.sleepDuration,
    wholeFoodRatio: INITIAL_PRESET.parameters.wholeFoodRatio,
    perceivedStress: INITIAL_PRESET.parameters.stressLevel,
    alcoholUnits: INITIAL_PRESET.parameters.alcoholUnits,
  },
  overlay: {
    title: INITIAL_PRESET.headline,
    status: 'Optimal',
    keyOutcomes: INITIAL_PRESET.outcomes,
    evidenceLevel: INITIAL_PRESET.evidenceLevel,
  },
};

export { stateMachineReducer as pillarsReducer };
