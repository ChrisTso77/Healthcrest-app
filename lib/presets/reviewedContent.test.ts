import { describe, expect, test } from 'vitest';
import seed from '../../pillars-seed-data-v3.json';
import { FALLBACK_PRESETS } from './fallback';
import { applyContentReview, REVIEWED_SCENARIOS } from './reviewedContent';
import { normalizeSanityPreset } from './normalize';
import { resolveAvailablePresets, resolveActivePreset } from './presetSelection';

describe('scenario content review', () => {
  test('fallbacks and CMS seed use the same reviewed presentations and sources', () => {
    expect(FALLBACK_PRESETS).toHaveLength(8);
    for (const preset of FALLBACK_PRESETS) {
      const content = REVIEWED_SCENARIOS[preset.slug];
      expect(preset).toMatchObject(content);
      const document = seed.scenarioPresets.find(item => item.slug.current === preset.slug)!;
      expect(document.title).toBe(preset.title);
      expect(document.narrativeOverlay.headline).toBe(preset.headline);
      expect(document.narrativeOverlay.outcomes).toEqual(preset.outcomes);
      expect(document.education).toEqual(content.education);
      expect(content.education.sources.length).toBeGreaterThan(0);
      for (const source of content.education.sources) {
        expect(source.url).toMatch(/^https:\/\//);
        expect(source.population).not.toBe('');
        expect(source.supports).not.toBe('');
        expect(source.limitations).not.toBe('');
      }
    }
  });
  test('replaces old known CMS claims at normalization without changing parameters or camera', () => {
    const preset = FALLBACK_PRESETS[2];
    const parsed = normalizeSanityPreset({
      _id: 'cms-fitness', slug: preset.slug, pillar: { title: preset.pillar },
      title: 'Guaranteed prevention', healthStatus: preset.status, evidenceLevel: 'High-quality review',
      parameters: { ...preset.parameters, aerobicMins: 220 }, cameraShot: preset.cameraShot,
      narrativeOverlay: { headline: 'Oxytocin Shield Active', outcomes: ['-35% CVD Mortality Risk'] },
    })!;
    expect(parsed.title).toBe(preset.title);
    expect(parsed.headline).toBe(preset.headline);
    expect(parsed.outcomes).toEqual(preset.outcomes);
    expect(parsed.evidenceLevel).toBe('Guideline-level');
    expect(parsed.parameters.aerobicMins).toBe(220);
    expect(parsed.cameraShot).toBe(preset.cameraShot);
  });
  test('unreviewed content cannot self-certify sources or evidence tags', () => {
    const raw = { ...FALLBACK_PRESETS[0], slug: 'new-unknown-example', title: 'Cures illness',
      headline: 'Guaranteed recovery', outcomes: ['No need for care'], evidenceLevel: 'Guideline-level' as const };
    const reviewed = applyContentReview(raw);
    expect(reviewed.evidenceLevel).toBe('Unreviewed');
    expect(reviewed.education?.sources).toEqual([]);
    expect(reviewed.title).not.toContain('Cures');
    expect(reviewed.parameters).toEqual(raw.parameters);
    expect(resolveAvailablePresets([raw])[0]).toEqual(reviewed);
    expect(resolveActivePreset([raw], raw.slug)).toEqual(reviewed);
  });
  test('unknown prototype-like slugs and pillar mismatches are not reviewed scenarios', () => {
    for (const slug of ['__proto__', 'constructor', 'toString']) {
      expect(applyContentReview({ ...FALLBACK_PRESETS[0], slug }).evidenceLevel).toBe('Unreviewed');
    }
    expect(applyContentReview({ ...FALLBACK_PRESETS[0], pillar: 'Sleep' }).evidenceLevel).toBe('Unreviewed');
  });
  test('research is separated from guidance and includes differing primary findings', () => {
    const research = FALLBACK_PRESETS.filter(p => p.education?.category === 'Research example');
    expect(research).toHaveLength(1);
    expect(research[0].evidenceLevel).toBe('Experimental');
    expect(research[0].education?.sources).toHaveLength(2);
    expect(research[0].education?.sources[0].population).toContain('13');
    expect(research[0].education?.sources[1].supports).toContain('without better performance');
    expect(research[0].education?.limitations).toContain('not routine advice');
  });
  test('reviewed display copy contains no original unsupported outcomes or ladder ranking', () => {
    const copy = JSON.stringify(FALLBACK_PRESETS.map(p => [p.title, p.headline, p.outcomes]));
    expect(copy).not.toMatch(/Oxytocin Shield|Glymphatic Flush|Bioluminescent|\-35%|\-40%|Zero Nocturnal|Rung [1-4]|Normalised Blood Pressure|Suppressed Pro-inflammatory/i);
  });
});
