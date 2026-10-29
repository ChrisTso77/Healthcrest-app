import { guideForPillar } from './learningGuides';
import { journeyPlannerHref, type JourneyConstraint } from './startJourney';
import type { HabitPillar } from './habitDraft';

export function findGuideStarter(pillar: HabitPillar, value: unknown) {
  if (typeof value !== 'string') return undefined;
  const guide = guideForPillar(pillar);
  const idea = guide?.ideas.find(item => item.id === value);
  return guide && idea ? { guide, idea } : undefined;
}

export function guideStarterHref(pillar: HabitPillar, value: unknown, constraint?: JourneyConstraint): string | undefined {
  const starter = findGuideStarter(pillar, value);
  return starter ? journeyPlannerHref(pillar, constraint) + '&starter=' + encodeURIComponent(starter.idea.id) : undefined;
}
