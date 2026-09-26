"use client";

import { Canvas } from "@react-three/fiber";

import type { CameraState } from "@/lib/presets/types";
import type { State } from "@/state/PillarsStateTypes";
import { HealthEngineScene } from "@/components/HealthEngineScene";

type WebGLCanvasWrapperProps = {
  state: State;
  cameraState: CameraState;
};

export default function WebGLCanvasWrapper({
  state,
  cameraState,
}: WebGLCanvasWrapperProps) {
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
        <HealthEngineScene
          state={state}
          cameraState={cameraState}
        />
      </Canvas>
    </div>
  );
}
