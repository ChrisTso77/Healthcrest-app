import type { CameraState } from '@/lib/presets/types';

export interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

export function calculateCameraPosition(
  cameraState: Pick<
    CameraState,
    'orbitAzimuth' | 'orbitElevation' | 'zoomDistance'
  >
): CameraPosition {
  const azimuth = (cameraState.orbitAzimuth * Math.PI) / 180;
  const elevation = (cameraState.orbitElevation * Math.PI) / 180;

  const radius = Math.max(
    2.5,
    Math.min(10, 5 / cameraState.zoomDistance)
  );

  const horizontal = radius * Math.cos(elevation);

  return {
    x: horizontal * Math.sin(azimuth),
    y: radius * Math.sin(elevation),
    z: horizontal * Math.cos(azimuth),
  };
}
