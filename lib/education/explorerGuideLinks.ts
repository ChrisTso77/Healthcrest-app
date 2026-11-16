import { learningGuideHref } from "./learningGuides";
import type { JourneyConstraint } from "./startJourney";

export type ExplorerGuideLinks = Readonly<
  Record<"Fitness" | "Nutrition" | "Sleep" | "Stress", string>
>;

// Resolve existing reviewed destinations on the server. The client needs these
// four URLs, not the complete guide catalogue and its clinical/source text.
export function explorerGuideLinks(
  constraint?: JourneyConstraint,
): ExplorerGuideLinks {
  const link = (pillar: keyof ExplorerGuideLinks) => {
    const href = learningGuideHref(pillar, constraint);
    if (!href) throw new Error("Missing reviewed Explorer guide destination.");
    return href;
  };
  return {
    Fitness: link("Fitness"),
    Nutrition: link("Nutrition"),
    Sleep: link("Sleep"),
    Stress: link("Stress"),
  };
}
