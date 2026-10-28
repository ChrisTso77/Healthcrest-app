import type { CanonicalScenarioPreset } from './types';
import { reviewedFallback } from './reviewedContent';

export const FALLBACK_PRESETS: CanonicalScenarioPreset[] = ([
  {
    "id": "integrated-harmony",
    "slug": "integrated-harmony",
    "pillar": "Systems",
    "status": "optimal",
    "parameters": {
      "aerobicMins": 180,
      "strengthDays": 2,
      "sleepDuration": 8,
      "wholeFoodRatio": 80,
      "stressLevel": 2,
      "alcoholUnits": 2
    },
    "cameraShot": "shot-1-orbit"
  },
  {
    "id": "single-pillar-failure",
    "slug": "single-pillar-failure",
    "pillar": "Systems",
    "status": "warning",
    "parameters": {
      "aerobicMins": 300,
      "strengthDays": 4,
      "sleepDuration": 4.5,
      "wholeFoodRatio": 50,
      "stressLevel": 8,
      "alcoholUnits": 18
    },
    "cameraShot": "shot-2-failure"
  },
  {
    "id": "uk-cmo-optimal",
    "slug": "uk-cmo-optimal",
    "pillar": "Fitness",
    "status": "optimal",
    "parameters": {
      "aerobicMins": 180,
      "strengthDays": 2,
      "sleepDuration": 8,
      "wholeFoodRatio": 80,
      "stressLevel": 3,
      "alcoholUnits": 4
    },
    "cameraShot": "shot-1-orbit"
  },
  {
    "id": "sleep-rung1-foundations",
    "slug": "sleep-rung1-foundations",
    "pillar": "Sleep",
    "status": "optimal",
    "parameters": {
      "aerobicMins": 150,
      "strengthDays": 2,
      "sleepDuration": 8,
      "wholeFoodRatio": 75,
      "stressLevel": 3,
      "alcoholUnits": 0
    },
    "cameraShot": "shot-3-macro"
  },
  {
    "id": "sleep-rung2-behavioral",
    "slug": "sleep-rung2-behavioral",
    "pillar": "Sleep",
    "status": "optimal",
    "parameters": {
      "aerobicMins": 150,
      "strengthDays": 2,
      "sleepDuration": 8,
      "wholeFoodRatio": 80,
      "stressLevel": 2,
      "alcoholUnits": 0
    },
    "cameraShot": "shot-3-macro"
  },
  {
    "id": "sleep-rung3-circadian",
    "slug": "sleep-rung3-circadian",
    "pillar": "Sleep",
    "status": "optimal",
    "parameters": {
      "aerobicMins": 180,
      "strengthDays": 3,
      "sleepDuration": 8.5,
      "wholeFoodRatio": 85,
      "stressLevel": 2,
      "alcoholUnits": 0
    },
    "cameraShot": "shot-3-macro"
  },
  {
    "id": "sleep-rung4-experimental",
    "slug": "sleep-rung4-experimental",
    "pillar": "Sleep",
    "status": "optimal",
    "parameters": {
      "aerobicMins": 200,
      "strengthDays": 3,
      "sleepDuration": 8.5,
      "wholeFoodRatio": 90,
      "stressLevel": 1,
      "alcoholUnits": 0
    },
    "cameraShot": "shot-3-macro"
  },
  {
    "id": "active-vagal-reset",
    "slug": "active-vagal-reset",
    "pillar": "Stress",
    "status": "optimal",
    "parameters": {
      "aerobicMins": 150,
      "strengthDays": 2,
      "sleepDuration": 7.5,
      "wholeFoodRatio": 70,
      "stressLevel": 2,
      "alcoholUnits": 0
    },
    "cameraShot": "shot-4-resonance"
  }
] satisfies Array<Parameters<typeof reviewedFallback>[0]>).map(reviewedFallback);
