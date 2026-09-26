import { describe, expect, test } from 'vitest';

import { FALLBACK_PRESETS } from '@/lib/presets/fallback';
import type { CameraState } from '@/lib/presets/types';
import { createPresetLoadPlan } from './createPresetLoadPlan';

const camera: CameraState = {
  orbitAzimuth: 12,
  orbitElevation: 8,
  zoomDistance: 1.5,
  activeShotId: 'custom',
  isGesturing: true,
  requestRevision: 6,
};

describe('createPresetLoadPlan', () => {
  test('preserves the preset being loaded', () => {
    const preset = FALLBACK_PRESETS[0];

    const result = createPresetLoadPlan(
      preset,
      camera
    );

    expect(result.preset).toBe(preset);
  });

  test('creates camera transition when preset has canonical camera shot', () => {
    const base = FALLBACK_PRESETS[0];

    const preset = {
      ...base,
      cameraShot: 'shot-3-macro',
    };

    const result = createPresetLoadPlan(
      preset,
      camera
    );

    expect(result.cameraState).toEqual({
      orbitAzimuth: 0,
      orbitElevation: 10,
      zoomDistance: 2.2,
      activeShotId: 'shot-3-macro',
      isGesturing: false,
      requestRevision: 7,
    });
  });

  test('returns null camera transition when preset has no camera shot', () => {
    const base = FALLBACK_PRESETS[0];

    const preset = {
      ...base,
      cameraShot: undefined,
    };

    const result = createPresetLoadPlan(
      preset,
      camera
    );

    expect(result.cameraState).toBeNull();
  });

  test('does not mutate preset or current camera', () => {
    const base = FALLBACK_PRESETS[0];

    const preset = {
      ...base,
      cameraShot: 'shot-2-failure',
    };

    const cameraSnapshot = structuredClone(camera);
    const presetSnapshot = structuredClone(preset);

    createPresetLoadPlan(preset, camera);

    expect(camera).toEqual(cameraSnapshot);
    expect(preset).toEqual(presetSnapshot);
  });
});
