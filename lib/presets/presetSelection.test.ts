import { describe, expect, test } from 'vitest';

import { FALLBACK_PRESETS } from './fallback';
import {
  resolveActivePreset,
  resolveAvailablePresets,
} from './presetSelection';

describe('presetSelection', () => {
  test('uses fallback presets when supplied list is empty', () => {
    expect(resolveAvailablePresets([]))
      .toBe(FALLBACK_PRESETS);
  });

  test('uses supplied presets when available', () => {
    const supplied = [FALLBACK_PRESETS[0]];

    expect(resolveAvailablePresets(supplied))
      .toBe(supplied);
  });

  test('resolves active preset by slug', () => {
    const preset = FALLBACK_PRESETS[0];

    expect(
      resolveActivePreset(
        FALLBACK_PRESETS,
        preset.slug
      )
    ).toBe(preset);
  });

  test('resolves active preset by id', () => {
    const preset = FALLBACK_PRESETS[1];

    expect(
      resolveActivePreset(
        FALLBACK_PRESETS,
        preset.id
      )
    ).toBe(preset);
  });

  test('falls back to canonical presets when supplied list lacks active preset', () => {
    const activePreset = FALLBACK_PRESETS[1];
    const supplied = [FALLBACK_PRESETS[0]];

    expect(
      resolveActivePreset(
        supplied,
        activePreset.slug
      )
    ).toBe(activePreset);
  });

  test('returns null when no active preset is selected', () => {
    expect(
      resolveActivePreset(
        FALLBACK_PRESETS,
        null
      )
    ).toBeNull();
  });
});
