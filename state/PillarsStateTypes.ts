import type {
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
