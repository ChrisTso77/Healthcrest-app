import type { ClinicalOverlayData } from '@/state/PillarsStateTypes';

export function createManualOverlay(): ClinicalOverlayData {
  return {
    title: 'Manual configuration',
    status: 'Manual',
    keyOutcomes: [],
    evidenceLevel: null,
  };
}
