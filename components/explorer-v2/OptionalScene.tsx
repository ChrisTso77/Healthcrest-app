"use client";
import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import type { State } from "@/state/PillarsStateTypes";
import { explainVisualState } from "@/lib/visuals/explainVisualState";
const Canvas = dynamic(() => import("@/app/WebGLCanvasWrapper"), {
  ssr: false,
  loading: () => <p role="status">Loading optional illustration…</p>,
});
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p role="status">
        3D is unavailable. The labelled 2D comparison below remains available.
      </p>
    ) : (
      this.props.children
    );
  }
}
export default function OptionalScene({
  state,
  paused,
}: {
  state: State;
  paused: boolean;
}) {
  const explanation = explainVisualState(state);
  return (
    <>
      <SceneBoundary>
        <div
          className="ev2-canvas"
          aria-label="Optional abstract 3D illustration"
        >
          <Canvas
            state={{ ...state, renderMode: "lite-3d" }}
            motionPaused={paused}
            cameraState={{
              orbitAzimuth: 45,
              orbitElevation: 20,
              zoomDistance: 1,
              activeShotId: "shot-1-orbit",
              isGesturing: false,
              requestRevision: 0,
            }}
          />
        </div>
      </SceneBoundary>
      <p>
        {explanation.shortInput}. {explanation.colourName}; {explanation.glow};{" "}
        {explanation.texture}.
      </p>
      <p>
        Optional pointer orbit and zoom. All settings and comparisons work
        without using the canvas.
      </p>
    </>
  );
}
