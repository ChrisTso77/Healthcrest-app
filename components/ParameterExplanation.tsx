import Link from 'next/link';
import type { PillarType, RenderMode } from '@/lib/presets/types';
import { PARAMETER_GUIDES, PILLAR_GUIDES } from '@/lib/education/healthGuide';

type ParameterKey = keyof typeof PARAMETER_GUIDES;
const relatedPillar = {
  aerobic: 'Fitness',
  sleep: 'Sleep',
  nutrition: 'Nutrition',
  stress: 'Stress',
} as const;

export function ParameterExplanation({ parameter, value, activePillar, renderMode }: {
  parameter: ParameterKey;
  value: string;
  activePillar: PillarType;
  renderMode: RenderMode;
}) {
  const setting = PARAMETER_GUIDES[parameter];
  const pillar = relatedPillar[parameter];
  const guidance = PILLAR_GUIDES[pillar];
  const affects3D = activePillar === pillar || (activePillar === 'Systems' && parameter !== 'nutrition');
  const viewMeaning = renderMode === '2d-canvas'
    ? 'The 2D overview labels this setting and illustrates it with a shape. Read the value alongside the guidance; the size of a shape is not a health score.'
    : affects3D
      ? PILLAR_GUIDES[activePillar].visual
      : 'This setting does not change the ' + activePillar + ' 3D scene. Its value still changes in your scenario. Choose the ' + pillar + ' pillar or the 2D overview to explore its illustration.';

  return (
    <details className="min-w-0 rounded-lg border border-slate-700/70 bg-slate-950/40 text-xs leading-relaxed text-slate-300 open:border-emerald-500/40">
      <summary aria-label={'Explain this setting: ' + setting.label}
        className="min-h-9 cursor-pointer rounded-lg px-2 py-2 text-[11px] font-medium text-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">
        Explain this setting
      </summary>
      <div role="region" aria-label={setting.label + ' explained'} className="select-text space-y-3 border-t border-slate-800 p-3">
        <p><strong className="text-slate-100">Chosen scenario value: </strong>{value}</p>
        <p>{setting.meaning}</p>
        <div className="space-y-1">
          <h3 className="font-semibold text-slate-100">Why it matters</h3>
          <p>{guidance.goal}</p>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-slate-100">General adult guidance</h3>
          <p>{guidance.guidance}</p>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-slate-100">What changes in this view</h3>
          <p>{viewMeaning}</p>
          {renderMode !== '2d-canvas' && affects3D && <p>Illustrative rules use ranges, so a small change can leave the same colour. Colour is not a personal health rating.</p>}
        </div>
        <p className="text-[11px] text-slate-400">The NHS reference supports the general habit guidance. Visual rules are illustrations created for this engine.</p>
        <a href={guidance.sourceUrl} target="_blank" rel="noopener noreferrer"
          className="block rounded text-emerald-300 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-emerald-400">
          {guidance.sourceLabel} (opens in a new tab)
        </a>
        <Link prefetch={false} href={'/next-step?pillar=' + pillar.toLowerCase()}
          className="inline-block rounded-lg border border-emerald-500/40 px-3 py-2 font-medium text-emerald-300 hover:bg-emerald-500/10 focus-visible:outline-2 focus-visible:outline-emerald-400">
          Plan a manageable next step
        </Link>
      </div>
    </details>
  );
}
