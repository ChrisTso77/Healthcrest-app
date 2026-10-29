"use client";

import dynamic from "next/dynamic";
import type { ComparisonStart } from "@/lib/education/settingComparison";
import { Layers } from "lucide-react";
import { Component, type ReactNode } from "react";

import type { CameraState } from "@/lib/presets/types";
import type { State } from "@/state/PillarsStateTypes";
import { SceneVisualKey } from "@/components/SceneVisualKey";
import { HealthEngine2DFallback } from "@/components/HealthEngine2DFallback";

type HealthEngineViewportProps = {
  state: State;
  startingPoint: ComparisonStart;
  onCompare: () => void;
  cameraState: CameraState;
  onWebGLError: () => void;
  motionPaused: boolean;
  onToggleMotion: () => void;
  onExplain: () => void;
};

type WebGLErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  onError: () => void;
};

class WebGLErrorBoundary extends Component<WebGLErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.warn("3D health engine unavailable; switching to 2D:", error);
    this.props.onError();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function CanvasPlaceholder() {
  return (
    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-400 select-none">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-20 h-20 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <Layers className="w-8 h-8 text-cyan-400 absolute animate-pulse" />
      </div>

      <p className="text-xs font-mono tracking-widest uppercase text-slate-300">
        LOADING HABIT EXPLORER...
      </p>

      <p className="text-[10px] font-mono text-slate-500 mt-1">
        Preparing the interactive illustration
      </p>
    </div>
  );
}

const WebGLCanvasWrapper = dynamic(
  () => import("@/app/WebGLCanvasWrapper"),
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

function FallbackViewport({ state, startingPoint, onCompare }: Pick<HealthEngineViewportProps, "state" | "startingPoint" | "onCompare">) {
  return (
    <div
      role="region"
      aria-label="2D health overview"
      tabIndex={0}
      className="absolute inset-x-3 top-44 bottom-[calc(var(--engine-footer-space,4rem)_+_var(--engine-dock-space,16rem)_+_0.75rem)] z-0 overflow-y-auto transition-[bottom] duration-300 overscroll-contain rounded-2xl bg-slate-950 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-emerald-400 xl:top-20 xl:left-[22rem] xl:right-6 xl:bottom-[calc(var(--engine-footer-space,4rem)_+_var(--engine-desktop-dock-space,16rem)_+_0.75rem)]"
    >
      <HealthEngine2DFallback
        startingPoint={startingPoint}
        onCompare={onCompare}
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

export function HealthEngineViewport({
  state,
  startingPoint,
  onCompare,
  cameraState,
  onWebGLError,
  motionPaused,
  onToggleMotion,
  onExplain,
}: HealthEngineViewportProps) {
  const fallback = <FallbackViewport state={state} startingPoint={startingPoint} onCompare={onCompare} />;

  if (state.renderMode === "2d-canvas") {
    return fallback;
  }

  return (
    <WebGLErrorBoundary fallback={fallback} onError={onWebGLError}>
      <div className="absolute inset-0 z-0">
        <WebGLCanvasWrapper
          state={state}
          cameraState={cameraState}
          motionPaused={motionPaused}
        />
        <SceneVisualKey state={state} motionPaused={motionPaused} onToggleMotion={onToggleMotion} onExplain={onExplain} />
      </div>
    </WebGLErrorBoundary>
  );
}
