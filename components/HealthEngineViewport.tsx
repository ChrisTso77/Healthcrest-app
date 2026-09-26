"use client";

import dynamic from "next/dynamic";
import { Layers } from "lucide-react";

import type { CameraState } from "@/lib/presets/types";
import type { State } from "@/state/PillarsStateTypes";
import { HealthEngine2DFallback } from "@/components/HealthEngine2DFallback";

type HealthEngineViewportProps = {
  state: State;
  cameraState: CameraState;
};

function CanvasPlaceholder() {
  return (
    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-400 select-none">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-20 h-20 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <Layers className="w-8 h-8 text-cyan-400 absolute animate-pulse" />
      </div>

      <p className="text-xs font-mono tracking-widest uppercase text-slate-300">
        INITIALISING 3D HEALTH ENGINE...
      </p>

      <p className="text-[10px] font-mono text-slate-500 mt-1">
        Compiling WebGL Shaders & Neural Meshes
      </p>
    </div>
  );
}

function WebGLLoadErrorFallback() {
  return <CanvasPlaceholder />;
}

const WebGLCanvasWrapper = dynamic(
  () =>
    import("@/app/WebGLCanvasWrapper").catch(
      () => WebGLLoadErrorFallback
    ),
  {
    ssr: false,
    loading: () => <CanvasPlaceholder />,
  }
);

function toFallbackHealthStatus(
  status: State["overlay"]["status"]
): "optimal" | "warning" | "critical" | "manual" {
  switch (status) {
    case "Optimal":
      return "optimal";
    case "Warning":
      return "warning";
    case "Critical":
      return "critical";
    default:
      return "manual";
  }
}

export function HealthEngineViewport({
  state,
  cameraState,
}: HealthEngineViewportProps) {
  if (state.renderMode === "2d-canvas") {
    return (
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-auto bg-slate-950 p-6">
        <HealthEngine2DFallback
          activePillar={state.activePillar}
          aerobicMins={state.parameters.aerobicVolume}
          sleepDuration={state.parameters.sleepDuration}
          wholeFoodRatio={state.parameters.wholeFoodRatio}
          stressLevel={state.parameters.perceivedStress}
          healthStatus={toFallbackHealthStatus(
            state.overlay.status
          )}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      <WebGLCanvasWrapper
        state={state}
        cameraState={cameraState}
      />
    </div>
  );
}
