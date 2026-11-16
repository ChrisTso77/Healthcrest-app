import { COMPARED_SETTINGS } from "@/lib/education/settingComparison";
import type { SceneId } from "@/state/PillarsStateTypes";

export const HABITS = [
  {
    ...COMPARED_SETTINGS[0],
    name: "Movement",
    icon: "↗",
    scene: "fitness" as SceneId,
    step: 10,
    description: "Find movement that fits everyday life.",
    examples: [180, 300],
  },
  {
    ...COMPARED_SETTINGS[1],
    name: "Food",
    icon: "◒",
    scene: "nutrition" as SceneId,
    step: 5,
    description: "Explore variety and balance over time.",
    examples: [80, 50],
  },
  {
    ...COMPARED_SETTINGS[2],
    name: "Sleep",
    icon: "☾",
    scene: "sleep" as SceneId,
    step: 0.5,
    description: "Make space for rest and routines.",
    examples: [8, 4.5],
  },
  {
    ...COMPARED_SETTINGS[3],
    name: "Stress and social support",
    icon: "◎",
    scene: "stress" as SceneId,
    step: 1,
    description: "Consider coping, connection and support.",
    examples: [2, 8],
  },
] as const;
export const STEPS = [
  "Understand",
  "Explore",
  "Experiment",
  "Apply",
  "Learn more",
] as const;
export function validSetting(index: number, value: number) {
  const h = HABITS[index];
  return (
    !!h &&
    Number.isFinite(value) &&
    value >= h.min &&
    value <= h.max &&
    Math.abs((value - h.min) / h.step - Math.round((value - h.min) / h.step)) <
      1e-8
  );
}
