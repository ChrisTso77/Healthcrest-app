"use client";

import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";

import type { CameraState } from "@/lib/presets/types";
import type { State } from "@/state/PillarsStateTypes";
import { HealthEngineScene } from "@/components/HealthEngineScene";

type WebGLCanvasWrapperProps = {
  state: State;
  cameraState: CameraState;
  motionPaused?: boolean;
};

export default function WebGLCanvasWrapper({
  state,
  cameraState,
  motionPaused = false,
}: WebGLCanvasWrapperProps) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion || motionPaused;

  return (
    <div
      className="absolute inset-0 bg-slate-950"
      data-reduced-motion={reducedMotion}
      data-motion-paused={motionPaused}
      data-camera-shot={cameraState.activeShotId}
      data-camera-request-revision={cameraState.requestRevision}
    >
      <Canvas
        frameloop={reducedMotion ? "demand" : "always"}
        camera={{
          position: [0, 0, 5],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        dpr={state.renderMode === 'lite-3d' ? 1 : [1, 2]}
      >
        <HealthEngineScene
          state={state}
          cameraState={cameraState}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}
