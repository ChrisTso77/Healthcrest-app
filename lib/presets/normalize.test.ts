import { describe, expect, test } from 'vitest';

import { FALLBACK_PRESETS } from './fallback';
import { normalizeSanityPreset, normalizeSanityPresets } from './normalize';

const preset = FALLBACK_PRESETS[0];
const rawPreset = {
  _id: preset.id,
  slug: preset.slug,
  title: preset.title,
  healthStatus: preset.status,
  evidenceLevel: preset.evidenceLevel,
  parameters: preset.parameters,
  narrativeOverlay: {
    headline: preset.headline,
    outcomes: preset.outcomes,
  },
  pillar: { title: preset.pillar },
  cameraShot: preset.cameraShot,
};

describe('Sanity preset normalization', () => {
  test('preserves a valid preset and its clinical parameters', () => {
    expect(normalizeSanityPreset(rawPreset)).toEqual(preset);
  });

  test('normalizes status and pillar aliases from a reference slug', () => {
    expect(normalizeSanityPreset({
      ...rawPreset,
      healthStatus: ' WARNING ',
      pillar: { slug: ' system ' },
    })).toMatchObject({ status: 'warning', pillar: 'Systems' });
  });

  test.each([undefined, null])('allows an absent optional camera shot: %s', (cameraShot) => {
    expect(normalizeSanityPreset({ ...rawPreset, cameraShot }))
      .toEqual({ ...preset, cameraShot: undefined });
  });

  test.each([
    null,
    undefined,
    false,
    42,
    'preset',
    [],
    {},
    { ...rawPreset, _id: 42 },
    { ...rawPreset, slug: ' ' },
    { ...rawPreset, title: {} },
    { ...rawPreset, healthStatus: 42 },
    { ...rawPreset, healthStatus: 'unknown' },
    { ...rawPreset, pillar: null },
    { ...rawPreset, pillar: { title: 42 } },
    { ...rawPreset, pillar: { title: 'unknown' } },
    { ...rawPreset, evidenceLevel: 'unsupported' },
    { ...rawPreset, parameters: null },
    { ...rawPreset, parameters: { ...preset.parameters, sleepDuration: '8' } },
    { ...rawPreset, parameters: { ...preset.parameters, aerobicMins: NaN } },
    { ...rawPreset, parameters: { ...preset.parameters, alcoholUnits: Infinity } },
    { ...rawPreset, narrativeOverlay: null },
    { ...rawPreset, narrativeOverlay: { headline: {}, outcomes: [] } },
    { ...rawPreset, narrativeOverlay: { headline: 'Headline', outcomes: [{}] } },
    { ...rawPreset, cameraShot: {} },
  ])('rejects malformed input without throwing (%#)', (input) => {
    expect(normalizeSanityPresets([input])).toEqual([]);
  });

  test('keeps valid entries when other documents are malformed', () => {
    const snapshot = structuredClone(rawPreset);
    expect(normalizeSanityPresets([
      null,
      rawPreset,
      { ...rawPreset, pillar: { title: 42 } },
    ])).toEqual([preset]);
    expect(rawPreset).toEqual(snapshot);
  });

  test.each([null, undefined, {}, 'presets'])('ignores a non-array response: %s', (input) => {
    expect(normalizeSanityPresets(input)).toEqual([]);
  });
});
