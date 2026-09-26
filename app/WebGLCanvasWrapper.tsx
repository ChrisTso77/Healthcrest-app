"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import type { CameraState } from "@/lib/presets/types";
import type { State } from "@/state/PillarsStateTypes";
import { InteractiveBodyEngineMesh } from "@/components/InteractiveBodyEngineMesh";
import { CameraDirector } from "@/components/CameraDirector";

type WebGLCanvasWrapperProps = {
  state: State;
  cameraState: CameraState;
};

export default function WebGLCanvasWrapper({
  state,
  cameraState,
}: WebGLCanvasWrapperProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div
      className="absolute inset-0 bg-slate-950"
      data-camera-shot={cameraState.activeShotId}
      data-camera-request-revision={cameraState.requestRevision}
    >
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 2]}
      >
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
        />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableRotate
          enableZoom
          enablePan={false}
          minDistance={2.5}
          maxDistance={10}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
