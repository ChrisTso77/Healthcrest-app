import { Pause, Play } from 'lucide-react';
import { useId } from 'react';
import type { State } from '@/state/PillarsStateTypes';
import { useReducedMotion } from '@/lib/accessibility/useReducedMotion';
import { explainVisualState } from '@/lib/visuals/explainVisualState';

type MotionProps = { motionPaused: boolean; onToggleMotion: () => void };

export function SceneMotionControl({ motionPaused, onToggleMotion, compact = false }: MotionProps & { compact?: boolean }) {
  const reducedMotion = useReducedMotion();
  const label = reducedMotion ? 'Scene motion is reduced by your device setting' : motionPaused ? 'Resume scene motion' : 'Pause scene motion';
  return (
    <button type="button" disabled={reducedMotion} aria-pressed={motionPaused || reducedMotion} aria-label={label} title={label}
      onClick={onToggleMotion}
      className="min-h-10 min-w-10 shrink-0 rounded-lg border border-slate-600 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-emerald-300 disabled:opacity-70">
      {compact ? (motionPaused && !reducedMotion ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />) : reducedMotion ? 'Motion reduced' : label}
    </button>
  );
}

export function SceneVisualKey({ state, onExplain, ...motion }: { state: State; onExplain: () => void } & MotionProps) {
  const visual = explainVisualState(state);
  const descriptionId = useId();
  return (
    <aside aria-label="Live visual key"
      className="pointer-events-auto absolute inset-x-3 bottom-[calc(var(--engine-footer-space,4rem)_+_var(--engine-dock-space,16rem)_+_0.75rem)] z-[5] flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/95 p-2 xl:left-[22rem] xl:right-[17rem] xl:bottom-[calc(var(--engine-footer-space,4rem)_+_var(--engine-desktop-dock-space,16rem)_+_0.75rem)]">
      <button type="button" aria-label="Explain current illustration" aria-describedby={descriptionId} onClick={onExplain}
        className="min-w-0 flex-1 rounded-lg p-1 text-left text-xs text-slate-200 focus-visible:outline-2 focus-visible:outline-emerald-300">
        <span id={descriptionId} className="flex items-center gap-2"><span aria-hidden="true" style={{ backgroundColor: visual.colour }} className="size-3 shrink-0 rounded-full" />{visual.colourName} core · {visual.shortInput}</span>
        <span className="mt-1 block text-[10px] text-cyan-300 underline underline-offset-2">Read the visual key · illustration only</span>
      </button>
      <SceneMotionControl {...motion} compact />
    </aside>
  );
}

export function SceneVisualExplanation({ state, ...motion }: { state: State } & MotionProps) {
  const visual = explainVisualState(state);
  return (
    <section aria-label="Read the illustration" className="space-y-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
      <h3 className="font-semibold text-cyan-200">Read the illustration</h3>
      {state.renderMode === '2d-canvas' ? (
        <p>The four labelled scales show the selected control values. Each marker moves with its matching setting. Scale ends are the controls’ limits, not health targets, and a higher value is not automatically better. Read the guidance beside the numbers.</p>
      ) : (
        <>
          <p className="flex items-center gap-2"><span aria-hidden="true" style={{ backgroundColor: visual.colour }} className="size-4 rounded-full" /><strong>{visual.colourName} core</strong> · {visual.glow} · {visual.texture}</p>
          <p>Inputs used by this 3D view:</p>
          <ul className="list-disc space-y-1 pl-5">{visual.inputs.map(input => <li key={input}>{input}</li>)}</ul>
          <p>Open “How this scene responds” below for the rules behind this illustration.</p>
          <p>Read colour together with the input and this key. Red does not diagnose harm; green does not certify health. Glow, wobble and rotation are graphic effects. A small input change may stay within the same visual range.</p>
          <SceneMotionControl {...motion} />
          <p className="text-xs text-slate-400">Pausing stops automatic scene motion while keeping your chosen values and camera controls. Your device’s reduced-motion preference takes priority.</p>
        </>
      )}
    </section>
  );
}
