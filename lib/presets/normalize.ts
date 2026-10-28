import type {
  CanonicalScenarioPreset,
  EvidenceLevel,
  HealthStatus,
  PillarType,
} from './types';

import { applyContentReview } from './reviewedContent';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isEvidenceLevel(value: unknown): value is EvidenceLevel {
  return value === 'Guideline-level' ||
    value === 'High-quality review' ||
    value === 'Emerging' ||
    value === 'Emerging / Review' ||
    value === 'Experimental' || value === 'Unreviewed';
}

export function normalizePillar(value: unknown): PillarType | null {
  const key = typeof value === 'string' ? value.trim().toLowerCase() : undefined;

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

function normalizeStatus(value: unknown): HealthStatus | null {
  const key = typeof value === 'string' ? value.trim().toLowerCase() : undefined;

  if (key === 'optimal') return 'optimal';
  if (key === 'warning') return 'warning';
  if (key === 'critical') return 'critical';

  return null;
}

function finiteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function normalizeSanityPreset(
  raw: unknown
): CanonicalScenarioPreset | null {
  if (!isRecord(raw) || !isRecord(raw.pillar)) return null;

  const pillar = normalizePillar(
    raw.pillar?.title ?? raw.pillar?.slug
  );

  const status = normalizeStatus(raw.healthStatus);
  const p = raw.parameters;
  const narrative = raw.narrativeOverlay;

  if (
    !nonEmptyString(raw._id) ||
    !nonEmptyString(raw.slug) ||
    !nonEmptyString(raw.title) ||
    !pillar ||
    !status ||
    !isEvidenceLevel(raw.evidenceLevel) ||
    !isRecord(narrative) ||
    !nonEmptyString(narrative.headline) ||
    !Array.isArray(narrative.outcomes) ||
    !narrative.outcomes.every((outcome): outcome is string => typeof outcome === 'string') ||
    (raw.cameraShot != null && typeof raw.cameraShot !== 'string') ||
    !isRecord(p) ||
    !finiteNumber(p.aerobicMins) ||
    !finiteNumber(p.strengthDays) ||
    !finiteNumber(p.sleepDuration) ||
    !finiteNumber(p.wholeFoodRatio) ||
    !finiteNumber(p.stressLevel) ||
    !finiteNumber(p.alcoholUnits)
  ) {
    return null;
  }

  return applyContentReview({
    id: raw._id,
    slug: raw.slug,
    title: raw.title,
    pillar,
    status,
    evidenceLevel: raw.evidenceLevel,
    parameters: {
      aerobicMins: p.aerobicMins,
      strengthDays: p.strengthDays,
      sleepDuration: p.sleepDuration,
      wholeFoodRatio: p.wholeFoodRatio,
      stressLevel: p.stressLevel,
      alcoholUnits: p.alcoholUnits,
    },
    headline: narrative.headline,
    outcomes: narrative.outcomes,
    cameraShot: typeof raw.cameraShot === 'string' ? raw.cameraShot : undefined,
  });
}

export function normalizeSanityPresets(
  input: unknown
): CanonicalScenarioPreset[] {
  if (!Array.isArray(input)) return [];

  return input
    .map(normalizeSanityPreset)
    .filter(
      (preset): preset is CanonicalScenarioPreset =>
        preset !== null
    );
}
