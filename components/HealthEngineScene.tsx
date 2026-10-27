"use client";

import { useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import type { CameraState } from "@/lib/presets/types";
import type { State } from "@/state/PillarsStateTypes";
import { CameraDirector } from "@/components/CameraDirector";
import { InteractiveBodyEngineMesh } from "@/components/InteractiveBodyEngineMesh";

type HealthEngineSceneProps = {
  state: State;
  cameraState: CameraState;
  reducedMotion: boolean;
};

export function HealthEngineScene({
  state,
  cameraState,
  reducedMotion,
}: HealthEngineSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <>
      <CameraDirector
        cameraState={cameraState}
        controlsRef={controlsRef}
      />

      <ambientLight intensity={0.5} />

      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
      />

      <InteractiveBodyEngineMesh
        params={state.parameters}
        scene={state.activeScene}
        lite={state.renderMode === 'lite-3d'}
        reducedMotion={reducedMotion}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping={!reducedMotion}
        enableRotate
        enableZoom
        enablePan={false}
        minDistance={2.5}
        maxDistance={10}
        target={[0, 0, 0]}
      />
    </>
  );
}
