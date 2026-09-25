"use client";

import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import type { CameraState } from "@/lib/presets/types";
import {
  InteractiveBodyEngineMesh,
  type State,
} from "@/state/PillarsStateMachine";

type WebGLCanvasWrapperProps = {
  state: State;
  cameraState: CameraState;
  dispatch?: unknown;
};

function CameraDirector({
  cameraState,
  controlsRef,
}: {
  cameraState: CameraState;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();

  useEffect(() => {
    const azimuth = (cameraState.orbitAzimuth * Math.PI) / 180;
    const elevation = (cameraState.orbitElevation * Math.PI) / 180;

    // Higher HUD zoom means a closer camera.
    const radius = Math.max(
      2.5,
      Math.min(10, 5 / cameraState.zoomDistance)
    );

    const horizontal = radius * Math.cos(elevation);

    const x = horizontal * Math.sin(azimuth);
    const y = radius * Math.sin(elevation);
    const z = horizontal * Math.cos(azimuth);

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
    cameraState.orbitAzimuth,
    cameraState.orbitElevation,
    cameraState.zoomDistance,
    cameraState.activeShotId,
    cameraState.requestRevision,
    controlsRef,
  ]);

  return null;
}

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
