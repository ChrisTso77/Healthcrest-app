import { describe, expect, test } from 'vitest';

import { FALLBACK_PRESETS } from '@/lib/presets/fallback';
import { createPresetOverlay } from './createPresetOverlay';

describe('createPresetOverlay', () => {
  test('creates overlay from an optimal preset', () => {
    const preset = FALLBACK_PRESETS.find(
      ({ slug }) => slug === 'uk-cmo-optimal'
    );

    if (!preset) {
      throw new Error('Expected uk-cmo-optimal fallback preset');
    }

    expect(createPresetOverlay(preset)).toEqual({
      title: preset.headline,
      status: 'Optimal',
      keyOutcomes: preset.outcomes,
      evidenceLevel: preset.evidenceLevel,
    });
  });

  test('translates warning status', () => {
    const preset = FALLBACK_PRESETS.find(
      ({ slug }) => slug === 'single-pillar-failure'
    );

    if (!preset) {
      throw new Error('Expected single-pillar-failure fallback preset');
    }

    expect(createPresetOverlay(preset).status).toBe('Warning');
  });

  test('preserves preset outcomes and evidence level', () => {
    const preset = FALLBACK_PRESETS[0];
    const overlay = createPresetOverlay(preset);

    expect(overlay.keyOutcomes).toBe(preset.outcomes);
    expect(overlay.evidenceLevel).toBe(preset.evidenceLevel);
  });
});
