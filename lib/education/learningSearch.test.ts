import { describe, expect, test } from 'vitest';
import { getLearningGuide, guideForPillar, learningGuideSearchText, LEARNING_GUIDES } from './learningGuides';
import { findGuideSearchMatch, LEARNING_SEARCH_LIMIT, matchesLearningQuery } from './learningSearch';

describe('learning library search', () => {
  test('matches several words in either order across an item, requiring every word', () => {
    expect(matchesLearningQuery('plate Harvard', 'Harvard’s Healthy Eating Plate')).toBe(true);
    expect(matchesLearningQuery('Harvard plate', 'Harvard', 'Healthy Eating Plate')).toBe(true);
    expect(matchesLearningQuery('Harvard missing', 'Harvard’s Healthy Eating Plate')).toBe(false);
    expect(matchesLearningQuery('plate plate Harvard', 'Harvard’s Healthy Eating Plate')).toBe(true);
  });
  test('normalises case, accents, apostrophes, hyphens and repeated whitespace', () => {
    expect(matchesLearningQuery("  CAFE'S   whole-food  ", 'Café’s whole food choices')).toBe(true);
    expect(matchesLearningQuery('food whole', 'Whole–food ratio')).toBe(true);
    expect(matchesLearningQuery('CAFÉ', 'Cafe\u0301')).toBe(true);
  });
  test('keeps partial acronym searches available without inventing similar terms', () => {
    expect(matchesLearningQuery('hrv', 'Heart-rate variability (HRV)')).toBe(true);
    expect(matchesLearningQuery('circa', 'Circadian rhythms')).toBe(true);
    expect(matchesLearningQuery('slepe', 'Sleep routine')).toBe(false);
  });
  test('browses everything for blank input but not punctuation-only or unmatched scripts', () => {
    expect(matchesLearningQuery('', 'anything')).toBe(true);
    expect(matchesLearningQuery(' \t\n ', 'anything')).toBe(true);
    expect(matchesLearningQuery('?!.*', 'anything')).toBe(false);
    expect(matchesLearningQuery('睡眠', 'Sleep routine')).toBe(false);
  });
  test('treats regex-like input as search words rather than executable matching syntax', () => {
    expect(matchesLearningQuery('sleep|stress', 'Sleep routine')).toBe(false);
    expect(matchesLearningQuery('sleep|stress', 'Sleep and stress')).toBe(true);
    expect(matchesLearningQuery('[HRV]', 'HRV')).toBe(true);
    expect(matchesLearningQuery('(a+)+$', 'bbbb')).toBe(false);
  });
  test('enforces the same query limit as the input without changing the catalogue', () => {
    const query = 'x'.repeat(LEARNING_SEARCH_LIMIT);
    expect(matchesLearningQuery(query + ' ignored', query)).toBe(true);
    expect(LEARNING_SEARCH_LIMIT).toBe(120);
    const before = JSON.stringify(LEARNING_GUIDES);
    findGuideSearchMatch(guideForPillar('Nutrition'), 'Harvard plate');
    expect(JSON.stringify(LEARNING_GUIDES)).toBe(before);
  });
  test.each([
    ['movement-and-strength', 'WHO wheeling'],
    ['balanced-meals', 'plate Harvard'],
    ['sleep-routines', 'CDC quality'],
    ['stress-and-support', 'WHO exposure'],
  ])('links %s to its matching international section for %s', (slug, query) => {
    const guide = getLearningGuide(slug)!;
    expect(matchesLearningQuery(query, learningGuideSearchText(guide))).toBe(true);
    expect(findGuideSearchMatch(guide, query)).toEqual({
      title: guide.sections.find(section => section.id === 'international-perspective')!.title,
      fragment: 'international-perspective', kind: 'section',
    });
  });
  test('finds source context and links to the real source card when no section matches', () => {
    const guide = guideForPillar('Nutrition')!;
    expect(matchesLearningQuery('Harvard academic', learningGuideSearchText(guide))).toBe(true);
    expect(findGuideSearchMatch(guide, 'Harvard academic')).toEqual({
      title: 'Harvard The Nutrition Source: Healthy Eating Plate', fragment: 'source-harvard-plate', kind: 'source',
    });
  });
  test('does not label an arbitrary section as matching a wider topic query', () => {
    const guide = guideForPillar('Nutrition')!;
    // The first word is in a practical planning section; the second in a different perspective.
    expect(matchesLearningQuery('facilities Harvard', learningGuideSearchText(guide))).toBe(true);
    expect(findGuideSearchMatch(guide, 'facilities Harvard')).toBeUndefined();
    expect(findGuideSearchMatch(guide, '<script>alert(1)</script>')).toBeUndefined();
  });
  test('omits pointers for empty input, missing guides and unknown searches', () => {
    expect(findGuideSearchMatch(undefined, 'WHO')).toBeUndefined();
    expect(findGuideSearchMatch(guideForPillar('Systems'), 'habit')).toBeUndefined();
    expect(findGuideSearchMatch(guideForPillar('Sleep'), ' ')).toBeUndefined();
    expect(findGuideSearchMatch(guideForPillar('Sleep'), 'zzzzunknown')).toBeUndefined();
  });
});
