import { describe, expect, test } from 'vitest';

import type { CameraState } from '@/lib/presets/types';
import {
  CAMERA_SHOTS,
  createCameraStateForShot,
} from './cameraShots';

const currentCamera: CameraState = {
  orbitAzimuth: 12,
  orbitElevation: 8,
  zoomDistance: 1.5,
  activeShotId: 'custom',
  isGesturing: true,
  requestRevision: 4,
};

describe('cameraShots', () => {
  test('defines four canonical camera shots', () => {
    expect(CAMERA_SHOTS).toHaveLength(4);

    expect(CAMERA_SHOTS.map(({ id }) => id)).toEqual([
      'shot-1-orbit',
      'shot-2-failure',
      'shot-3-macro',
      'shot-4-resonance',
    ]);
  });

  test('creates camera state from canonical shot', () => {
    const result = createCameraStateForShot(
      currentCamera,
      'shot-2-failure'
    );

    expect(result).toEqual({
      orbitAzimuth: 135,
      orbitElevation: 35,
      zoomDistance: 1.4,
      activeShotId: 'shot-2-failure',
      isGesturing: false,
      requestRevision: 5,
    });
  });

  test('increments revision when reapplying active shot', () => {
    const activeCamera: CameraState = {
      ...currentCamera,
      activeShotId: 'shot-1-orbit',
      requestRevision: 9,
    };

    const result = createCameraStateForShot(
      activeCamera,
      'shot-1-orbit'
    );

    expect(result?.requestRevision).toBe(10);
    expect(result?.activeShotId).toBe('shot-1-orbit');
  });

  test('returns null for unknown shot', () => {
    expect(
      createCameraStateForShot(
        currentCamera,
        'unknown-shot'
      )
    ).toBeNull();
  });

  test('does not mutate current camera state', () => {
    const snapshot = structuredClone(currentCamera);

    createCameraStateForShot(
      currentCamera,
      'shot-3-macro'
    );

    expect(currentCamera).toEqual(snapshot);
  });
});
