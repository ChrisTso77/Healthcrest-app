import type { PillarType } from '@/lib/presets/types';

// Public labels only: stored keys, scene identities and URL slugs stay stable.
export const HABIT_TOPIC_LABELS: Readonly<Record<PillarType, string>> = {
  Fitness: 'Movement',
  Nutrition: 'Food',
  Sleep: 'Sleep',
  Stress: 'Stress & support',
  Systems: 'Connected habits',
};
