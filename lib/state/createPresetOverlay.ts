import type { CanonicalScenarioPreset } from '@/lib/presets/types';
import type { ClinicalOverlayData } from '@/state/PillarsStateTypes';
import { canonicalStatusToOverlayStatus } from '@/lib/state/pillarsMappings';

export function createPresetOverlay(
  preset: CanonicalScenarioPreset
): ClinicalOverlayData {
  return {
    title: preset.headline,
    status: canonicalStatusToOverlayStatus(preset.status),
    keyOutcomes: preset.outcomes,
    evidenceLevel: preset.evidenceLevel,
  };
}
