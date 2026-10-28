import { describe, expect, test } from 'vitest';
import { JOURNEY_TOPICS, JOURNEY_CONSTRAINTS, parseJourneyTopic, parseJourneyConstraint, journeyAction, journeyPlannerHref } from './startJourney';
import { parseSavedHabitDraft } from './habitDraft';

describe('guided journey boundaries', () => {
  test.each([undefined, ['sleep'], '__proto__', 'constructor', '<script>', 'Sleep', {}])('rejects an unrecognised topic or preference: %j', value => {
    expect(parseJourneyTopic(value)).toBeUndefined();
    expect(parseJourneyConstraint(value)).toBeUndefined();
  });
  test('accepts explicit choices and preserves them in planner links', () => {
    expect(parseJourneyTopic('sleep')?.key).toBe('Sleep');
    expect(parseJourneyConstraint('routine')).toBe('routine');
    expect(journeyPlannerHref('Sleep', 'routine')).toBe('/next-step?pillar=sleep&idea=routine');
    expect(journeyPlannerHref('Nutrition')).toBe('/next-step?pillar=nutrition');
  });
  test('combined view asks guided visitors to choose a topic without silently choosing movement', () => {
    expect(journeyPlannerHref('Systems', 'access')).toBe('/start?idea=access');
    expect(journeyPlannerHref('Systems')).toBe('/next-step');
  });
  test('every starter can pass through the existing saved-draft schema', () => {
    for (const context of JOURNEY_CONSTRAINTS) {
      const drafts = Object.fromEntries(JOURNEY_TOPICS.map(topic => [topic.key, {
        action: journeyAction(topic.key, context.key), cue: '', support: '', reflection: '',
      }]));
      for (const topic of JOURNEY_TOPICS) {
        const saved = parseSavedHabitDraft(JSON.stringify({ version: 2, selected: topic.key, drafts }));
        expect(saved, topic.slug + '/' + context.key).not.toBeNull();
      }
    }
  });
});
