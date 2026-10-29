import type { CameraState } from '@/lib/presets/types';

export interface CameraShot {
  id: string;
  name: string;
  azimuth: number;
  elevation: number;
  zoom: number;
  desc: string;
}

export const CAMERA_SHOTS: readonly CameraShot[] = [
  {
    id: 'shot-1-orbit',
    name: 'Wide view',
    azimuth: 45,
    elevation: 20,
    zoom: 1.0,
    desc: 'A wide view of the whole model',
  },
  {
    id: 'shot-2-failure',
    name: 'Angled view',
    azimuth: 135,
    elevation: 35,
    zoom: 1.4,
    desc: 'An angled, closer view of the model',
  },
  {
    id: 'shot-3-macro',
    name: 'Close-up view',
    azimuth: 0,
    elevation: 10,
    zoom: 2.2,
    desc: 'A close-up of the central shape',
  },
  {
    id: 'shot-4-resonance',
    name: 'Raised view',
    azimuth: 220,
    elevation: 50,
    zoom: 0.8,
    desc: 'A raised overview from another angle',
  },
];

export function createCameraStateForShot(
  currentCamera: CameraState,
  shotId: string
): CameraState | null {
  const shot = CAMERA_SHOTS.find(
    ({ id }) => id === shotId
  );

  if (!shot) {
    return null;
  }

  return {
    orbitAzimuth: shot.azimuth,
    orbitElevation: shot.elevation,
    zoomDistance: shot.zoom,
    activeShotId: shot.id,
    isGesturing: false,
    requestRevision: currentCamera.requestRevision + 1,
  };
}
