"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import type { CameraState } from "@/lib/presets/types";
import { calculateCameraPosition } from "@/lib/camera/calculateCameraPosition";

type CameraDirectorProps = {
  cameraState: CameraState;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
};

export function CameraDirector({
  cameraState,
  controlsRef,
}: CameraDirectorProps) {
  const { camera } = useThree();

  const {
    orbitAzimuth,
    orbitElevation,
    zoomDistance,
    activeShotId,
    requestRevision,
  } = cameraState;

  useEffect(() => {
    const { x, y, z } = calculateCameraPosition({
      orbitAzimuth,
      orbitElevation,
      zoomDistance,
    });

    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [
    camera,
    orbitAzimuth,
    orbitElevation,
    zoomDistance,
    activeShotId,
    requestRevision,
    controlsRef,
  ]);

  return null;
}
