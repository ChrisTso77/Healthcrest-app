'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { UrgentSupport } from '@/components/UrgentSupport';
import { ScenarioEvidence } from '@/components/ScenarioEvidence';
import { ModalDialog } from '@/components/ModalDialog';
import type { CanonicalScenarioPreset } from '@/lib/presets/types';
import type { State } from '@/state/PillarsStateTypes';
import { resolveActivePreset, resolveAvailablePresets } from '@/lib/presets/presetSelection';
import { EVIDENCE_GUIDES, ENGINE_GLOSSARY, PARAMETER_GUIDES, PILLAR_GUIDES } from '@/lib/education/healthGuide';

type HealthEngineGuideProps = {
  state: State;
  presets: CanonicalScenarioPreset[];
  onClose: () => void;
};

export function HealthEngineGuide({ state, presets, onClose }: HealthEngineGuideProps) {
  const pillar = PILLAR_GUIDES[state.activePillar];
  const preset = resolveActivePreset(resolveAvailablePresets(presets), state.activePreset);
  const values = [
    { ...PARAMETER_GUIDES.aerobic, value: `${state.parameters.aerobicVolume} minutes/week` },
    { ...PARAMETER_GUIDES.sleep, value: `${state.parameters.sleepDuration} hours/night` },
    { ...PARAMETER_GUIDES.nutrition, value: `${state.parameters.wholeFoodRatio}%` },
    { ...PARAMETER_GUIDES.stress, value: `${state.parameters.perceivedStress} / 10` },
  ];

  return (
    <ModalDialog labelledBy="health-guide-title" onClose={onClose}>
      <div className="flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-800 bg-slate-950/60 p-4">
          <div>
            <h2 id="health-guide-title" className="text-base font-semibold">Understand this view</h2>
            <p className="mt-1 text-xs text-emerald-300">Health through everyday habits</p>
          </div>
          <button type="button" aria-label="Close health guide" onClick={onClose} className="rounded-lg p-2 text-slate-300 hover:bg-slate-800">
            <X className="size-5" />
          </button>
        </div>

        <div role="region" aria-label="Health guide content" tabIndex={0} className="min-h-0 space-y-6 overflow-y-auto p-4 text-sm leading-relaxed text-slate-300 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-emerald-400 sm:p-6">
          <p>
            Explore everyday movement, food, sleep and ways to manage stress. These are non-pharmacological
            approaches: actions that do not involve a medicine and can complement clinical care.
            Choose a pillar, change one setting, then connect what you see to a practical habit.
            The scenes are illustrations, not measurements of your body.
          </p>

          <Link href="/learn" prefetch={false} className="inline-block rounded-lg border border-emerald-500/40 px-3 py-2 font-medium text-emerald-300 hover:bg-emerald-500/10">
            Browse health topics and terms
          </Link>

          <section aria-label="Current pillar" className="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <h3 className="font-semibold text-emerald-300">{state.activePillar}: {pillar.heading}</h3>
            <p>{pillar.goal}</p>
            <p><strong className="text-slate-100">One possible first step: </strong>{pillar.firstStep}</p>
            <p>{pillar.guidance}</p>
            <Link prefetch={false} href={state.activePillar === 'Systems' ? '/next-step' : '/next-step?pillar=' + state.activePillar.toLowerCase()}
              className="inline-block rounded-lg border border-emerald-500/40 px-3 py-2 font-semibold text-emerald-300 hover:bg-emerald-500/10">
              Make a manageable next step
            </Link>
            <a href={pillar.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-emerald-300 underline underline-offset-4">
              {pillar.sourceLabel} (opens in a new tab)
            </a>
            {state.activePillar === 'Stress' && <UrgentSupport dark />}
            <details className="border-t border-emerald-500/20 pt-3">
              <summary className="cursor-pointer font-medium text-slate-100">How this scene responds</summary>
              <p className="mt-2">{pillar.visual}</p>
            </details>
          </section>

          <section aria-labelledby="health-guide-settings" className="space-y-3">
            <h3 id="health-guide-settings" className="font-semibold text-slate-100">Settings you can change here</h3>
            <dl className="grid gap-3 sm:grid-cols-2">
              {values.map((setting) => (
                <div key={setting.label} className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <dt className="font-semibold text-slate-100">{setting.label}</dt>
                  <dd className="space-y-2">
                    <p className="font-mono text-cyan-300">{setting.value}</p>
                    <p>{setting.meaning}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="health-guide-scenario" className="space-y-3">
            <h3 id="health-guide-scenario" className="font-semibold text-slate-100">Scenario and evidence</h3>
            {preset ? (
              <div role="group" aria-label="Selected scenario" className="space-y-2 rounded-xl border border-slate-800 p-3">
                <h4 className="font-semibold text-slate-100">{preset.title}</h4>
                <p>Scenario type: <strong className="text-slate-100">{preset.education?.category}</strong></p>
                <p>Evidence label: <strong className="text-slate-100">{preset.evidenceLevel}</strong></p>
                <p>{EVIDENCE_GUIDES[preset.evidenceLevel]}</p>
                <ScenarioEvidence preset={preset} expanded />
              </div>
            ) : (
              <p>Manual settings: no evidence preset is currently applied. Editing a slider clears the previous preset label; a manual scenario is not scored.</p>
            )}
            <p>
              Examples are grouped by their educational purpose, not ranked by health benefit.
              Evidence labels describe how content is tagged in the app; they do not validate every visual effect or outcome statement.
              Research examples are separate from everyday guidance. They do not describe a treatment delivered by this app.
            </p>
            <details>
              <summary className="cursor-pointer font-medium text-slate-100">What evidence labels mean</summary>
              <dl className="mt-3 space-y-3">
                {Object.entries(EVIDENCE_GUIDES).map(([label, meaning]) => (
                  <div key={label}>
                    <dt className="font-semibold text-slate-100">{label}</dt>
                    <dd>{meaning}</dd>
                  </div>
                ))}
              </dl>
            </details>
          </section>

          <details className="space-y-3 border-t border-slate-800 pt-4">
            <summary className="cursor-pointer font-semibold text-slate-100">Visual cues and unfamiliar terms</summary>
            <dl className="space-y-3">
              {ENGINE_GLOSSARY.map(([term, meaning]) => (
                <div key={term}>
                  <dt className="font-semibold text-slate-100">{term}</dt>
                  <dd>{meaning}</dd>
                </div>
              ))}
            </dl>
          </details>

          <section aria-labelledby="health-guide-controls" className="space-y-3 border-t border-slate-800 pt-4">
            <h3 id="health-guide-controls" className="font-semibold text-slate-100">Views, quality and a useful next step</h3>
            <p>
              Camera views change the angle and zoom only. High 3D, Lite 3D and 2D show the same chosen settings;
              Lite reduces graphics detail and 2D provides a labelled diagram. Render quality is not a health level.
              The 2D preset badge and 3D colours can differ because they describe different things.
            </p>
            <p>
              Choose one manageable habit to practise in daily life, then review how it fits your routine.
              Social connection, avoiding tobacco and reducing alcohol-related harm also belong in the wider picture;
              the animation does not capture all of these.
            </p>
            <p className="text-xs text-slate-400">
              These are general ideas for adults, to adapt to your health, ability and circumstances.
              Lifestyle habits can complement appropriate clinical care. Seek professional support for persistent symptoms or before changing prescribed treatment.
            </p>
          </section>
        </div>

        <div className="flex shrink-0 justify-end border-t border-slate-800 bg-slate-950/60 p-4">
          <button type="button" onClick={onClose} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
            Close & explore
          </button>
        </div>
      </div>
    </ModalDialog>
  );
}
