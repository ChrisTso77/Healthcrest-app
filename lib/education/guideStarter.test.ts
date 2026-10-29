import { describe, expect, test } from 'vitest';
import { findGuideStarter, guideStarterHref } from './guideStarter';
import { LEARNING_GUIDES, learningGuideSearchText } from './learningGuides';

describe('guide ideas as explicit planner starters', () => {
  test('gives every idea a globally unique, safe stable ID and a bounded action', () => {
    const ideas = LEARNING_GUIDES.flatMap(guide => guide.ideas);
    expect(ideas).toHaveLength(10);
    expect(new Set(ideas.map(idea => idea.id)).size).toBe(ideas.length);
    for (const idea of ideas) {
      expect(idea.id).toMatch(/^[a-z][a-z0-9-]+$/);
      expect(idea.text.trim().length).toBeGreaterThan(0);
      expect(idea.text.length).toBeLessThanOrEqual(300);
    }
  });
  test('resolves every idea to its original catalogue object without copying clinical text', () => {
    for (const guide of LEARNING_GUIDES) for (const idea of guide.ideas) {
      const chosen = findGuideStarter(guide.pillar, idea.id)!;
      expect(chosen.guide).toBe(guide);
      expect(chosen.idea).toBe(idea);
      const url = new URL(guideStarterHref(guide.pillar, idea.id)!, 'https://www.healthcrest.uk');
      expect(url.pathname).toBe('/next-step');
      expect([...url.searchParams.keys()].sort()).toEqual(['pillar', 'starter']);
      expect(url.searchParams.get('starter')).toBe(idea.id);
      expect(url.href).not.toContain(encodeURIComponent(idea.text));
    }
  });
  test('rejects a valid idea when it belongs to another pillar', () => {
    for (const guide of LEARNING_GUIDES) for (const other of LEARNING_GUIDES.filter(item => item !== guide)) {
      for (const idea of other.ideas) {
        expect(findGuideStarter(guide.pillar, idea.id)).toBeUndefined();
        expect(guideStarterHref(guide.pillar, idea.id)).toBeUndefined();
      }
    }
  });
  test('does not accept raw action text, repeated values, inherited keys or malformed IDs', () => {
    for (const value of [undefined, null, '', ['sleep-quiet-activity'], '__proto__', 'constructor', 'SLEEP-QUIET-ACTIVITY', 'sleep-quiet-activity/other', '<script>alert(1)</script>', 'Choose my own private action.']) {
      expect(findGuideStarter('Sleep', value)).toBeUndefined();
      expect(guideStarterHref('Sleep', value)).toBeUndefined();
    }
  });
  test('preserves the existing practical preference without putting the action in the URL', () => {
    expect(guideStarterHref('Sleep', 'sleep-quiet-activity', 'routine')).toBe('/next-step?pillar=sleep&idea=routine&starter=sleep-quiet-activity');
  });
  test('keeps idea wording searchable after adding structured IDs', () => {
    for (const guide of LEARNING_GUIDES) {
      const text = learningGuideSearchText(guide);
      for (const idea of guide.ideas) expect(text).toContain(idea.text);
      expect(text).not.toContain('[object Object]');
    }
  });
});
