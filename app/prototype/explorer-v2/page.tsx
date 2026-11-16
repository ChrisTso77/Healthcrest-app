import { explorerGuideLinks } from "@/lib/education/explorerGuideLinks";
import { notFound } from "next/navigation";
import { explorerPreviewEnabled } from "@/lib/education/explorerPreview";
import { ExplorerPrototype } from "@/components/explorer-v2/ExplorerPrototype";
import "./prototype.css";

export const metadata = {
  title: "Habit Explorer V2 · design preview",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function PrototypePage() {
  if (!explorerPreviewEnabled()) notFound();
  return <ExplorerPrototype guideLinks={explorerGuideLinks()} />;
}
