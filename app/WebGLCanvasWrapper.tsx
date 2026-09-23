"use client";

type WebGLCanvasWrapperProps = {
  [key: string]: unknown;
};

export default function WebGLCanvasWrapper(
  _props: WebGLCanvasWrapperProps
) {
  return (
    <div
      aria-label="Health engine visualisation"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
      }}
    />
  );
}
