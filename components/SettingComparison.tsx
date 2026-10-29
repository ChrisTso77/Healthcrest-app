'use client';

import { useId } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { ModalDialog } from '@/components/ModalDialog';
import { UrgentSupport } from '@/components/UrgentSupport';
import { PILLAR_GUIDES } from '@/lib/education/healthGuide';
import { HABIT_TOPIC_LABELS } from '@/lib/education/habitTopics';
import { journeyPlannerHref, type JourneyConstraint } from '@/lib/education/startJourney';
import { compareSettings, compareSceneAppearance, drivesScene, formatSettingNumber, markerPosition, otherSettingChanges, type ComparisonStart } from '@/lib/education/settingComparison';
import type { State } from '@/state/PillarsStateTypes';

export function ComparisonMarkers({ start, current, min, max }: { start: number; current: number; min: number; max: number }) {
  const before = markerPosition(start, min, max);
  const after = markerPosition(current, min, max);
  return (
    <svg viewBox="0 0 300 32" aria-hidden="true" className="mt-3 w-full">
      <line x1="12" x2="288" y1="16" y2="16" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
      <circle cx={before} cy="16" r="9" fill="#0F172A" stroke="#CBD5E1" strokeWidth="2" />
      <path d={'M ' + after + ' 5 L ' + (after - 7) + ' 16 L ' + after + ' 27 L ' + (after + 7) + ' 16 Z'} fill="#7DD3FC" stroke="#0F172A" strokeWidth="2" />
    </svg>
  );
}

export function ComparisonLegend() {
  return <p className="text-xs leading-relaxed text-slate-300"><span aria-hidden="true">○</span> Starting settings · <span aria-hidden="true">◆</span> Current settings. Markers and numbers show inputs. Scale ends are control limits; a higher value is not automatically better.</p>;
}

export function SettingComparison({ state, start, journeyConstraint, onUseCurrent, onRestoreStart, onClose }: {
  state: State; start: ComparisonStart; journeyConstraint?: JourneyConstraint;
  onUseCurrent: () => void; onRestoreStart: () => void; onClose: () => void;
}) {
  const id = useId();
  const rows = compareSettings(start, state.parameters);
  const other = otherSettingChanges(start, state.parameters);
  const appearance = compareSceneAppearance(start, state);
  const count = rows.filter(row => row.changed).length + other.length;
  return (
    <ModalDialog labelledBy={id + '-title'} onClose={onClose}>
      <div className="flex max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-700 bg-slate-950/60 p-4">
          <div className="min-w-0">
            <h2 id={id + '-title'} className="text-base font-semibold">Starting and current settings</h2>
            <p className="mt-1 text-xs text-cyan-200">Connect the settings to everyday habits</p>
          </div>
          <button type="button" aria-label="Close settings comparison" onClick={onClose} className="min-h-10 min-w-10 shrink-0 rounded-lg p-2 text-slate-200 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-cyan-300"><X aria-hidden="true" className="size-5" /></button>
        </div>
        <div role="region" aria-label="Settings comparison content" tabIndex={0} className="min-h-0 select-text space-y-4 overflow-y-auto overscroll-contain p-4 text-sm leading-relaxed text-slate-300 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-cyan-300 sm:space-y-5 sm:p-6">
          <div className="space-y-1 text-xs leading-snug">
            <p><strong className="text-slate-100">Starting point: </strong>{start.label}</p>
            <p role="status">{count === 0 ? 'No settings have changed from this starting point.' : count + (count === 1 ? ' setting differs' : ' settings differ') + ' from this starting point.'}</p>
            <p>Changes in settings do not measure changes in health.</p>
          </div>
          <table className="w-full table-fixed border-collapse text-left text-xs leading-4">
            <caption className="pb-2 text-left text-sm font-semibold leading-5 text-slate-100">Settings at a glance</caption>
            <colgroup><col className="w-[44%]" /><col className="w-[28%]" /><col className="w-[28%]" /></colgroup>
            <thead className="border-b border-slate-600 text-slate-200">
              <tr><th scope="col" className="px-2 py-2">Input</th><th scope="col" className="px-2 py-2">Starting</th><th scope="col" className="px-1 py-2">Current</th></tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.key} className="border-b border-slate-700 align-top">
                  <th scope="row" className="break-words px-2 py-1.5 font-medium text-slate-100">{row.label}<span className="mt-0.5 block text-[11px] font-normal text-slate-300">{row.unit}</span></th>
                  <td className="break-words px-2 py-1.5 font-mono text-sm text-slate-200">{formatSettingNumber(row.start)}</td>
                  <td className="break-words px-1 py-1.5"><span className="font-mono text-sm text-cyan-200">{formatSettingNumber(row.current)}</span><span className="mt-0.5 block whitespace-nowrap text-[11px] leading-4 text-slate-300">{row.changed ? 'Changed' : 'Unchanged'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <details className="rounded-xl border border-slate-700 p-3">
            <summary className="cursor-pointer rounded text-sm font-medium text-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-300">How to read this comparison</summary>
            <div className="mt-3 space-y-3">
              <p>Moving a slider changes an educational example. Use the habit guidance to choose an action that fits your circumstances.</p>
              <ComparisonLegend />
              <p className="text-xs">The summary uses the same units for starting and current values. The detailed cards below show exact numerical changes, visual markers and source-linked guidance. The summary covers the four main controls; any other changed example inputs are listed separately below.</p>
            </div>
          </details>
          <div className="grid gap-4 sm:grid-cols-2">
            {rows.map(row => {
              const guide = PILLAR_GUIDES[row.pillar];
              return (
                <section key={row.key} aria-label={row.label + ' comparison'} className="min-w-0 space-y-3 rounded-xl border border-slate-700 bg-slate-950/40 p-4">
                  <h3 className="font-semibold text-slate-100">{row.label}</h3>
                  <dl className="grid grid-cols-2 gap-3">
                    <div className="min-w-0"><dt className="text-xs text-slate-300">Starting</dt><dd className="mt-1 break-words"><strong className="block font-mono text-lg text-slate-100">{formatSettingNumber(row.start)}</strong><span className="text-xs">{row.unit}</span></dd></div>
                    <div className="min-w-0"><dt className="text-xs text-cyan-200">Current</dt><dd className="mt-1 break-words"><strong className="block font-mono text-lg text-cyan-200">{formatSettingNumber(row.current)}</strong><span className="text-xs">{row.unit}</span></dd></div>
                  </dl>
                  <ComparisonMarkers start={row.start} current={row.current} min={row.min} max={row.max} />
                  <div className="flex justify-between gap-2 text-[11px]"><span>{row.min}</span><span>{row.max}</span></div>
                  <p><strong className="text-slate-100">Change: </strong>{row.difference}</p>
                  <p className="text-xs">{state.renderMode === '2d-canvas' ? 'The diamond marker follows this setting in the 2D view.' : drivesScene(state.activeScene, row.key) ? 'This setting is used by the current 3D scene. Small changes can stay within the same visual range.' : 'This setting is not used by the current 3D scene. Its numerical value still changes.'}</p>
                  <details className="border-t border-slate-700 pt-3">
                    <summary className="cursor-pointer rounded font-medium text-emerald-200 focus-visible:outline-2 focus-visible:outline-emerald-300">Why this habit matters</summary>
                    <div className="mt-3 space-y-3">
                      <p>{guide.goal}</p>
                      <p>{guide.guidance}</p>
                      {row.pillar === 'Stress' && <UrgentSupport dark />}
                      <a href={guide.sourceUrl} target="_blank" rel="noopener noreferrer" className="block rounded text-emerald-200 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-emerald-300">{guide.sourceLabel} (opens in a new tab)</a>
                      <Link prefetch={false} href={journeyPlannerHref(row.pillar, journeyConstraint)} className="inline-block rounded-lg border border-emerald-500/40 px-3 py-2 font-medium text-emerald-200 focus-visible:outline-2 focus-visible:outline-emerald-300">Plan a manageable next step</Link>
                    </div>
                  </details>
                </section>
              );
            })}
          </div>
          {state.renderMode !== '2d-canvas' && (
            <section aria-label="3D appearance comparison" className="space-y-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
              <h3 className="font-semibold text-cyan-200">How the 3D illustration responds</h3>
              <p>Both descriptions use the current topic: {HABIT_TOPIC_LABELS[state.activePillar]}.</p>
              <dl className="grid gap-3 sm:grid-cols-2">
                {[{ label: 'Starting', visual: appearance.start }, { label: 'Current', visual: appearance.current }].map(({ label, visual }) => (
                  <div key={label} className="min-w-0"><dt className="font-semibold text-slate-100">{label}</dt><dd className="mt-1"><span aria-hidden="true" style={{ backgroundColor: visual.colour }} className="mr-2 inline-block size-3 rounded-full" />{visual.colourName} core · {visual.glow} · {visual.texture}</dd></div>
                ))}
              </dl>
              <p>{appearance.changed ? 'The graphic appearance differs between these settings.' : 'The 3D appearance is unchanged between these settings.'} Colour, glow and wobble describe the illustration; they do not measure your body or predict an outcome.</p>
              <p>Inputs used by this scene:</p>
              <ul className="list-disc space-y-1 pl-5">{appearance.current.inputs.map(input => <li key={input}>{input}</li>)}</ul>
              <p>{PILLAR_GUIDES[state.activePillar].visual}</p>
            </section>
          )}
          {other.length > 0 && (
            <section aria-label="Other changed example inputs" className="space-y-3 rounded-xl border border-slate-700 p-4">
              <h3 className="font-semibold text-slate-100">Other example inputs that changed</h3>
              <p>These are additional inputs carried by the example. Their values are not personal targets.</p>
              <dl className="space-y-3">
                {other.map(row => <div key={row.key}><dt className="font-medium text-slate-100">{row.label}</dt><dd className="break-words">{formatSettingNumber(row.start)} → {formatSettingNumber(row.current)} {row.unit}</dd></div>)}
              </dl>
            </section>
          )}
          <section aria-label="Choose a starting point" className="space-y-3 border-t border-slate-700 pt-4">
            <h3 className="font-semibold text-slate-100">Choose your starting point</h3>
            <p>Opening the Explorer starts a comparison. Choosing an example starts a fresh comparison with that example’s settings. Changing a topic, view or camera keeps the same starting values.</p>
            <p id={id + '-restore-help'}>Restore starting settings puts those values back into the controls as a manual scenario. Your topic, view and camera stay as selected. To keep your current values as the reference instead, use the button below.</p>
            <button type="button" onClick={onUseCurrent} className="min-h-10 rounded-lg border border-cyan-500/50 px-3 py-2 font-medium text-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-300">Use current settings as starting point</button>
            <p className="text-xs text-slate-400">This comparison lasts while this Explorer is open. Reloading starts again. NHS sources support the general guidance, not the example values or visual rules.</p>
          </section>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-700 bg-slate-950/60 p-4">
          <button type="button" aria-disabled={count === 0} aria-describedby={id + '-restore-help'}
            onClick={() => { if (count > 0) onRestoreStart(); }}
            className="min-h-10 rounded-xl border border-cyan-500/50 px-4 py-2 text-sm font-semibold text-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-300 aria-disabled:border-slate-700 aria-disabled:text-slate-400">
            Restore starting settings
          </button>
          <button type="button" onClick={onClose} className="min-h-10 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 focus-visible:outline-2 focus-visible:outline-emerald-200">Close and keep exploring</button>
        </div>
      </div>
    </ModalDialog>
  );
}
