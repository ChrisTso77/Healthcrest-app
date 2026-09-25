export type PillarType =
  | 'Fitness'
  | 'Nutrition'
  | 'Sleep'
  | 'Stress'
  | 'Systems';

export type HealthStatus =
  | 'optimal'
  | 'warning'
  | 'critical';

export type RenderMode =
  | 'high-3d'
  | 'lite-3d'
  | '2d-canvas';

export type EvidenceLevel =
  | 'Guideline-level'
  | 'High-quality review'
  | 'Emerging'
  | 'Emerging / Review'
  | 'Experimental';

export interface CanonicalPresetParameters {
  aerobicMins: number;
  strengthDays: number;
  sleepDuration: number;
  wholeFoodRatio: number;
  stressLevel: number;
  alcoholUnits: number;
}

export interface CanonicalScenarioPreset {
  id: string;
  slug: string;
  title: string;
  pillar: PillarType;
  status: HealthStatus;
  evidenceLevel: EvidenceLevel;
  parameters: CanonicalPresetParameters;
  headline: string;
  outcomes: string[];
  cameraShot?: string;
}
