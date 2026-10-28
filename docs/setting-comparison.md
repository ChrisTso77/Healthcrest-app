# Starting and current Explorer settings

The 2D diagram now uses a hollow circle for the starting value and a diamond for the current value. Visible numbers, changes and the accessible description convey the same distinction. Both markers use the existing control bounds; their ends are not guideline targets.

A Compare control beside Guide opens a native modal in any render mode. The 2D card also provides a labelled entry point. The panel shows starting/current values and numerical changes for all four editable sliders, with optional habit guidance, NHS sources and contextual planner links. Whole-food changes use percentage points, not relative percentages or a diet-quality score.

## Starting-point lifecycle

- Opening the Explorer copies the initial parameter values.
- Explicitly choosing a preset copies the actual resulting reducer parameters and its reviewed title.
- Slider edits, pillar changes, render modes, camera movement and CMS fetch/retry do not reset this copy.
- Use current settings as starting point makes a fresh copy without changing sliders, active scene/preset, camera or paused motion.
- Reloading starts a new comparison. No comparison storage, background request, custom analytics event or planner write is added.

The starting label describes the origin of those values, not a current evidence endorsement after editing. The current manual-state semantics still clear stale preset labels.

## Interpretation

The same currently selected scene is applied to both sides before deriving 3D appearance. A pillar change alone therefore cannot be reported as a parameter-driven appearance change. The visual description uses the existing renderer function and named colours/glow/texture. A small input change or an unused input can leave the appearance unchanged.

All eleven model parameters are accounted for: four primary controls and seven additional example inputs, displayed when changed. Additional quantities are not personal targets; the alcohol input explicitly has no specified time window. The dependency map mirrors the current renderer, including processed-food frequency and relaxation-practice inputs, without adding biological assumptions.

General guidance reuses the source-backed pillar catalogue. No disease probability, predicted health improvement or composite score is calculated. Guidance links preserve the existing practical preference, and planner starter actions remain independent of the numerical slider values.

## Verification

Unit tests cover independent copies, complete input coverage, numerical units/precision, marker limits, actual renderer comparisons and unused/hidden inputs.

Browser tests cover 2D shapes/values without WebGL, baseline persistence and replacement, fresh preset comparisons, unchanged/changed 3D appearance, contextual guidance/planner links, reload/privacy boundaries, keyboard/modal focus at 320–1440px, and graphics failure with reduced motion. The full existing regression suite, disabled-preview measurement test, audit/build/lint/types and mobile lab audits remain required.
