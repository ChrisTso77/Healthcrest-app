"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import {
  InteractiveBodyEngineMesh,
  type State,
} from "@/state/PillarsStateMachine";

type WebGLCanvasWrapperProps = {
  state: State;
  dispatch?: unknown;
};

export default function WebGLCanvasWrapper({
  state,
}: WebGLCanvasWrapperProps) {
  return (
    <div className="absolute inset-0 bg-slate-950">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 2]}
      >
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
          makeDefault
          enableRotate
          enableZoom
          enablePan={false}
          minDistance={2.5}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}
