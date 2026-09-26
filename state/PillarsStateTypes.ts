import type {
  CanonicalScenarioPreset,
  EvidenceLevel,
  OverlayStatus,
  PillarType,
  RenderMode,
} from '@/lib/presets/types';

export type SceneId =
  | 'fitness'
  | 'nutrition'
  | 'sleep'
  | 'stress'
  | 'system';

export interface PillarParameters {
  aerobicVolume: number;
  resistanceDays: number;
  sedentaryHours: number;
  wholeFoodRatio: number;
  fruitVegPortions: number;
  upfFrequency: number;
  sleepDuration: number;
  regularityScore: number;
  downRegPracticeMins: number;
  perceivedStress: number;
  alcoholUnits: number;
}

export interface ClinicalOverlayData {
  title: string;
  status: OverlayStatus;
  keyOutcomes: string[];
  evidenceLevel: EvidenceLevel | null;
}

export interface State {
  activeScene: SceneId;
  activePreset: string | null;
  activePillar: PillarType;
  renderMode: RenderMode;
  parameters: PillarParameters;
  overlay: ClinicalOverlayData;
}

export type PillarsAction =
  | { type: 'SET_SCENE'; payload: SceneId }
  | { type: 'APPLY_CANONICAL_PRESET'; payload: CanonicalScenarioPreset }
  | {
      type: 'UPDATE_PARAM';
      payload: {
        key: keyof PillarParameters;
        value: number;
      };
    }
  | { type: 'SET_RENDER_MODE'; payload: RenderMode };
