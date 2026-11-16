"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type HealthEngineApp from "@/components/HealthEngineApp";

// Next does not split a client import made directly in a server component.
// Keep the existing renderer behind a client lazy boundary, with SSR retained.
const Original = dynamic(() => import("@/components/HealthEngineApp"));
export function OriginalExplorer(
  props: ComponentProps<typeof HealthEngineApp>,
) {
  return <Original {...props} />;
}
