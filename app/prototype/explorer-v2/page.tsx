import { notFound } from "next/navigation";
import { editorialPreviewEnabled } from "@/lib/education/library/visibility";
import { ExplorerPrototype } from "@/components/explorer-v2/ExplorerPrototype";
import "./prototype.css";

export const metadata = {
  title: "Habit Explorer V2 · local prototype",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function PrototypePage() {
  if (!editorialPreviewEnabled()) notFound();
  return <ExplorerPrototype />;
}
