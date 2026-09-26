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
    name: 'Shot 1: Equilibrium Orbit',
    azimuth: 45,
    elevation: 20,
    zoom: 1.0,
    desc: 'Wide panoramic orbit around balanced tetrapod core',
  },
  {
    id: 'shot-2-failure',
    name: 'Shot 2: Single-Pillar Strain',
    azimuth: 135,
    elevation: 35,
    zoom: 1.4,
    desc: 'Dolly-in focus on buckling sleep & stress legs',
  },
  {
    id: 'shot-3-macro',
    name: 'Shot 3: Core Deformation',
    azimuth: 0,
    elevation: 10,
    zoom: 2.2,
    desc: 'Macro view of geodesic core vertex displacement',
  },
  {
    id: 'shot-4-resonance',
    name: 'Shot 4: Systemic Resonance',
    azimuth: 220,
    elevation: 50,
    zoom: 0.8,
    desc: 'High isometric overview of social resonance dome',
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
