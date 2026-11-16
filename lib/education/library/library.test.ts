import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { EVIDENCE, claimById, lessonClaimIds, sourceById } from './catalogue';
import { LESSONS } from './lessons';
import { AUDIENCES, REGIONS } from './pathways';
import { editorialPreviewEnabled } from './visibility';
import { videoPackage } from './video';
import { safeMeasurementUrl } from '@/lib/privacy/measurement';

describe('clinical publication boundary', () => {
  it('fails closed by default and in every hosted context even with the flag', () => {
    expect(editorialPreviewEnabled({})).toBe(false);
    expect(editorialPreviewEnabled({ HEALTHCREST_EDITORIAL_PREVIEW: 'true' })).toBe(false);
    expect(editorialPreviewEnabled({ HEALTHCREST_EDITORIAL_PREVIEW: '1' })).toBe(true);
    for (const context of [{ VERCEL_ENV: 'production' }, { VERCEL_ENV: 'preview' }, { VERCEL_ENV: 'development' }, { VERCEL: '1' }, { CI: 'true' }]) {
      expect(editorialPreviewEnabled({ HEALTHCREST_EDITORIAL_PREVIEW: '1', ...context })).toBe(false);
    }
  });
  it('does not grant approval from a source check or an evidence grade', () => {
    expect(EVIDENCE.clinicalReviewer).toBeNull();
    for (const claim of EVIDENCE.claims) {
      expect(claim.publicationStatus).toBe('draft');
      expect(claim.clinicalReviewer).toBeNull();
      expect(claim.editorialReviewer).toBeNull();
    }
  });
  it('keeps lesson and audience routes out of the measurement allowlist', () => {
    expect(safeMeasurementUrl('/learn/library', 'https://www.healthcrest.uk')).toBeNull();
    for (const lesson of LESSONS) expect(safeMeasurementUrl('/learn/library/' + lesson.id, 'https://www.healthcrest.uk')).toBeNull();
  });
});

describe('scientific traceability', () => {
  it('uses unique stable identifiers and citations', () => {
    for (const entries of [EVIDENCE.claims, EVIDENCE.sources]) expect(new Set(entries.map(item => item.id)).size).toBe(entries.length);
    expect(new Set(EVIDENCE.sources.map(source => source.url)).size).toBe(EVIDENCE.sources.length);
  });
  it('never uses a blocked or unverified source to support a verified claim', () => {
    for (const claim of EVIDENCE.claims) {
      expect(claim.supportingReferences.length).toBeGreaterThan(0);
      expect(claim.websiteContentLocations.length).toBeGreaterThan(0);
      for (const id of claim.supportingReferences) {
        const source = sourceById(id);
        expect(source, id).toBeDefined();
        expect(source?.verificationStatus).toBe('VERIFIED');
        expect(source?.verifiedOn).toBeTruthy();
        expect(new URL(source!.url).protocol).toBe('https:');
      }
    }
  });
  it('covers every habit, level, diagram, quiz, pathway and video with resolvable claims', () => {
    expect(LESSONS.map(lesson => lesson.id)).toEqual(['movement', 'food', 'sleep', 'stress']);
    for (const lesson of LESSONS) {
      for (const blocks of [lesson.takeaways, lesson.practical, lesson.science, lesson.faqs]) {
        expect(blocks.length).toBeGreaterThanOrEqual(3);
        for (const block of blocks) expect(block.claimIds.length).toBeGreaterThan(0);
      }
      for (const id of lessonClaimIds(lesson.id)) expect(claimById(id), id).toBeDefined();
      expect(lesson.diagram.description.length).toBeGreaterThan(80);
      expect(lesson.quiz.answer).toBeLessThan(lesson.quiz.options.length);
    }
    for (const context of [...AUDIENCES, ...REGIONS]) for (const id of context.claimIds) expect(claimById(id), id).toBeDefined();
  });
  it('retains conflicting evidence and distinguishes inference', () => {
    expect(claimById('STRESS-003')?.supportingReferences).toContain('fincham-trial');
    expect(claimById('STRESS-003')?.contradictoryEvidence).toContain('no detectable superiority');
    expect(claimById('MOV-004')?.inference).toBe('association');
    expect(claimById('MODEL-001')?.certainty).toBe('very low');
    expect(EVIDENCE.sources.find(source => source.id === 'nice-ph49')?.verificationStatus).toBe('NOT VERIFIED');
  });
  it('preserves source review dates independently from editorial verification', () => {
    expect(sourceById('efsa-drv')?.updatedOn).toBe('2024-08-05');
    expect(sourceById('efsa-drv')?.verifiedOn).toBe('2026-11-16');
    expect(sourceById('garcia-2023')?.accessLevel).toBe('original-abstract');
  });
});

describe('video source integrity', () => {
  for (const lesson of LESSONS) it(lesson.id + ': captions, transcript, storyboard and citations stay aligned', () => {
    const generated = videoPackage(lesson);
    const stored = JSON.parse(readFileSync('docs/education/media/' + lesson.id + '.json', 'utf8'));
    expect(stored).toEqual(generated);
    expect(generated.captions).toBe(readFileSync('docs/education/media/' + lesson.id + '.vtt', 'utf8'));
    expect(stored.transcript).toBe(generated.transcript);
    expect(stored.scenes).toEqual(generated.scenes);
    expect(stored.references).toEqual(generated.references);
    expect(generated.durationSeconds).toBe(48);
    expect(generated.captions).toContain('00:00:48.000');
    const cues = generated.captions.split('\n\n').slice(1).filter(Boolean);
    for (const cue of cues) {
      const text = cue.trimEnd().split('\n').slice(2);
      expect(text.length).toBeLessThanOrEqual(2);
      expect(text.every(line => line.length <= 42)).toBe(true);
    }
    expect(generated.references.every(Boolean)).toBe(true);
    expect(generated.status).toContain('no produced video');
  });
});
