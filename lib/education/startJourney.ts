import type { HabitPillar } from './habitDraft';
import type { PillarType } from '@/lib/presets/types';

export const JOURNEY_TOPICS = [
  { key: 'Fitness', slug: 'fitness', label: 'Movement', question: 'Make everyday movement more manageable' },
  { key: 'Nutrition', slug: 'nutrition', label: 'Food', question: 'Understand balanced eating' },
  { key: 'Sleep', slug: 'sleep', label: 'Sleep', question: 'Make room for sleep and recovery' },
  { key: 'Stress', slug: 'stress', label: 'Stress & support', question: 'Find ways to pause, cope and connect' },
] as const;

export const JOURNEY_CONSTRAINTS = [
  { key: 'none', label: 'A general starting point', note: 'Choose a small idea you can adapt to your circumstances.' },
  { key: 'time', label: 'I am short on time', note: 'Start with one manageable action. A smaller first step can fit into a busy day; it does not replace the wider guidance.' },
  { key: 'budget', label: 'I want to keep costs down', note: 'Look for an option using what you already have or can access. A starter habit does not need a new gadget, paid app or gym membership.' },
  { key: 'routine', label: 'My routine or shifts change', note: 'Use a cue that can move with your day, such as a meal or the start of your main rest period. A fixed clock time may not fit every routine.' },
  { key: 'access', label: 'I need options that fit my space or access', note: 'Choose an option that fits your ability, surroundings and available support. You can make the action smaller or ask for help adapting it.' },
] as const;
export type JourneyConstraint = typeof JOURNEY_CONSTRAINTS[number]['key'];
export type JourneyTopic = typeof JOURNEY_TOPICS[number];

export function parseJourneyTopic(value: unknown): JourneyTopic | undefined {
  return JOURNEY_TOPICS.find(topic => topic.slug === value);
}
export function parseJourneyConstraint(value: unknown): JourneyConstraint | undefined {
  return JOURNEY_CONSTRAINTS.find(item => item.key === value)?.key;
}

const actions: Record<HabitPillar, Record<JourneyConstraint, string>> = {
  Fitness: {
    none: 'Try a manageable walk or another activity I enjoy.',
    time: 'Choose a short movement break that feels manageable for me.',
    budget: 'Choose a free activity I enjoy, such as walking or moving at home.',
    routine: 'Choose one cue for a manageable activity, even when my timetable changes.',
    access: 'Choose an activity that fits my ability, space and access, with support if I need it.',
  },
  Nutrition: {
    none: 'Add vegetables, beans or a higher-fibre food to one familiar meal.',
    time: 'Choose one familiar meal where I can add vegetables, beans or a higher-fibre food.',
    budget: 'Plan one familiar meal using an affordable option that fits my diet, such as beans or frozen vegetables.',
    routine: 'Choose one meal or snack I can plan around my changing day.',
    access: 'Choose one small food change that fits what I can obtain and prepare.',
  },
  Sleep: {
    none: 'Make time for a regular wind-down routine.',
    time: 'Choose one part of my wind-down routine to make room for before my main sleep.',
    budget: 'Choose one wind-down habit that does not require a purchase.',
    routine: 'Choose a wind-down cue around my main sleep period, adapting it to my work or caring routine.',
    access: 'Choose a small change to my sleep space or routine that is within my control.',
  },
  Stress: {
    none: 'Make time for comfortable breathing or a conversation with someone I trust.',
    time: 'Choose a brief pause or a conversation with someone I trust.',
    budget: 'Choose a free way to pause, relax or connect with someone I trust.',
    routine: 'Choose a cue for a comfortable pause that can move with my day.',
    access: 'Choose a comfortable way to rest or connect that is accessible to me.',
  },
};

export function journeyAction(pillar: HabitPillar, constraint: JourneyConstraint): string {
  return actions[pillar][constraint];
}

export function journeyPlannerHref(pillar: PillarType, constraint?: JourneyConstraint): string {
  if (pillar === 'Systems') return constraint ? '/start?idea=' + constraint : '/next-step';
  const topic = JOURNEY_TOPICS.find(item => item.key === pillar)!;
  return '/next-step?pillar=' + topic.slug + (constraint ? '&idea=' + constraint : '');
}

export function journeyLearnHref(pillar: PillarType, constraint?: JourneyConstraint): string {
  if (!constraint) return '/learn';
  const topic = JOURNEY_TOPICS.find(item => item.key === pillar);
  return '/learn?' + (topic ? 'pillar=' + topic.slug + '&' : '') + 'idea=' + constraint + (topic ? '#topic-' + topic.slug : '');
}
export function journeyExplorerHref(pillar: PillarType, constraint?: JourneyConstraint): string {
  const slug = JOURNEY_TOPICS.find(item => item.key === pillar)?.slug ?? 'systems';
  return '/engine?pillar=' + slug + (constraint ? '&view=2d&idea=' + constraint : '');
}
