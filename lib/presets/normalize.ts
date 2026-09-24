import type {
  CanonicalScenarioPreset,
  HealthStatus,
  PillarType,
} from './types';

type SanityPreset = {
  _id?: string;
  slug?: string;
  title?: string;
  healthStatus?: string;
  evidenceLevel?: string;
  parameters?: {
    aerobicMins?: number;
    strengthDays?: number;
    sleepDuration?: number;
    wholeFoodRatio?: number;
    stressLevel?: number;
    alcoholUnits?: number;
  };
  narrativeOverlay?: {
    headline?: string;
    outcomes?: string[];
  };
  pillar?: {
    title?: string;
    slug?: string;
  };
  cameraShot?: string;
};

function normalizePillar(value?: string): PillarType | null {
  const key = value?.trim().toLowerCase();

  switch (key) {
    case 'fitness':
      return 'Fitness';
    case 'nutrition':
      return 'Nutrition';
    case 'sleep':
      return 'Sleep';
    case 'stress':
      return 'Stress';
    case 'systems':
    case 'system':
      return 'Systems';
    default:
      return null;
  }
}

function normalizeStatus(value?: string): HealthStatus | null {
  const key = value?.trim().toLowerCase();

  if (key === 'optimal') return 'optimal';
  if (key === 'warning') return 'warning';
  if (key === 'critical') return 'critical';

  return null;
}

function finiteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function normalizeSanityPreset(
  raw: SanityPreset
): CanonicalScenarioPreset | null {
  const pillar = normalizePillar(
    raw.pillar?.title ?? raw.pillar?.slug
  );

  const status = normalizeStatus(raw.healthStatus);
  const p = raw.parameters;

  if (
    !raw._id ||
    !raw.slug ||
    !raw.title ||
    !pillar ||
    !status ||
    !raw.evidenceLevel ||
    !raw.narrativeOverlay?.headline ||
    !Array.isArray(raw.narrativeOverlay.outcomes) ||
    !p ||
    !finiteNumber(p.aerobicMins) ||
    !finiteNumber(p.strengthDays) ||
    !finiteNumber(p.sleepDuration) ||
    !finiteNumber(p.wholeFoodRatio) ||
    !finiteNumber(p.stressLevel) ||
    !finiteNumber(p.alcoholUnits)
  ) {
    return null;
  }

  return {
    id: raw._id,
    slug: raw.slug,
    title: raw.title,
    pillar,
    status,
    evidenceLevel:
      raw.evidenceLevel as CanonicalScenarioPreset['evidenceLevel'],
    parameters: {
      aerobicMins: p.aerobicMins,
      strengthDays: p.strengthDays,
      sleepDuration: p.sleepDuration,
      wholeFoodRatio: p.wholeFoodRatio,
      stressLevel: p.stressLevel,
      alcoholUnits: p.alcoholUnits,
    },
    headline: raw.narrativeOverlay.headline,
    outcomes: raw.narrativeOverlay.outcomes,
    cameraShot: raw.cameraShot,
  };
}

export function normalizeSanityPresets(
  input: unknown
): CanonicalScenarioPreset[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item) => normalizeSanityPreset(item as SanityPreset))
    .filter(
      (preset): preset is CanonicalScenarioPreset =>
        preset !== null
    );
}
