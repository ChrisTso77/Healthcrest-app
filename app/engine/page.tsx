import { explorerGuideLinks } from "@/lib/education/explorerGuideLinks";
import { pageMetadata } from "@/lib/siteMetadata";
import { parseJourneyConstraint } from "@/lib/education/startJourney";
import { OriginalExplorer } from "@/components/explorer-v2/OriginalExplorer";
import type { SceneId } from "@/state/PillarsStateTypes";
import { editorialPreviewEnabled } from "@/lib/education/library/visibility";
import { ExplorerPrototype } from "@/components/explorer-v2/ExplorerPrototype";
import "@/app/prototype/explorer-v2/prototype.css";

export const metadata = pageMetadata(
  "Habit Explorer | Healthcrest",
  "Explore the connections between movement, food, sleep and stress through an interactive educational Habit Explorer.",
  "/engine",
);

export default async function EnginePage({
  searchParams,
}: {
  searchParams: Promise<{
    pillar?: string | string[];
    view?: string | string[];
    idea?: string | string[];
    experience?: string | string[];
  }>;
}) {
  const { pillar, view, idea, experience } = await searchParams;
  let initialScene: SceneId | undefined;
  switch (pillar) {
    case "fitness":
      initialScene = "fitness";
      break;
    case "nutrition":
      initialScene = "nutrition";
      break;
    case "sleep":
      initialScene = "sleep";
      break;
    case "stress":
      initialScene = "stress";
      break;
    case "systems":
      initialScene = "system";
      break;
  }

  // Preserve explicit old-view/scan and connected-habits deep links. The default
  // and labelled 2D educational journeys use the approved V2 experience.
  const legacy =
    experience === "original" ||
    view === "original" ||
    view === "scan" ||
    pillar === "systems";
  if (!legacy)
    return (
      <ExplorerPrototype
        guideLinks={explorerGuideLinks(parseJourneyConstraint(idea))}
        reviewMode={false}
        initialScene={initialScene}
        journeyConstraint={parseJourneyConstraint(idea)}
      />
    );

  return (
    <OriginalExplorer
      educationPreview={editorialPreviewEnabled()}
      initialScene={initialScene}
      initialRenderMode={view === "2d" ? "2d-canvas" : undefined}
      initialExplorerView={view === "scan" ? "scan" : "original"}
      journeyConstraint={parseJourneyConstraint(idea)}
    />
  );
}
