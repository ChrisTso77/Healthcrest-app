import { describe, expect, test } from 'vitest';

import {
  canonicalStatusToOverlayStatus,
  pillarToScene,
  sceneToPillar,
} from './pillarsMappings';

describe('pillarsMappings', () => {
  test.each([
    ['Fitness', 'fitness'],
    ['Nutrition', 'nutrition'],
    ['Sleep', 'sleep'],
    ['Stress', 'stress'],
    ['Systems', 'system'],
  ] as const)('maps pillar %s to scene %s', (pillar, scene) => {
    expect(pillarToScene(pillar)).toBe(scene);
  });

  test.each([
    ['fitness', 'Fitness'],
    ['nutrition', 'Nutrition'],
    ['sleep', 'Sleep'],
    ['stress', 'Stress'],
    ['system', 'Systems'],
  ] as const)('maps scene %s to pillar %s', (scene, pillar) => {
    expect(sceneToPillar(scene)).toBe(pillar);
  });

  test.each([
    ['optimal', 'Optimal'],
    ['warning', 'Warning'],
    ['critical', 'Critical'],
  ] as const)('maps status %s to %s', (status, overlayStatus) => {
    expect(canonicalStatusToOverlayStatus(status)).toBe(overlayStatus);
  });
});
