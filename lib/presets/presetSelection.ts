import { FALLBACK_PRESETS } from '@/lib/presets/fallback';
import type {
  CanonicalScenarioPreset,
} from '@/lib/presets/types';

export function resolveAvailablePresets(
  presets: CanonicalScenarioPreset[]
): CanonicalScenarioPreset[] {
  return presets.length > 0
    ? presets
    : FALLBACK_PRESETS;
}

export function resolveActivePreset(
  availablePresets: CanonicalScenarioPreset[],
  activePresetId: string | null
): CanonicalScenarioPreset | null {
  if (!activePresetId) {
    return null;
  }

  return (
    availablePresets.find(
      (preset) =>
        preset.slug === activePresetId ||
        preset.id === activePresetId
    ) ??
    FALLBACK_PRESETS.find(
      (preset) =>
        preset.slug === activePresetId ||
        preset.id === activePresetId
    ) ??
    null
  );
}
