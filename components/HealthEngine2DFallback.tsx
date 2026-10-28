import { useId } from 'react';
import { PILLAR_GUIDES } from '@/lib/education/healthGuide';

export interface FallbackProps {
  activePillar?: 'Fitness' | 'Nutrition' | 'Sleep' | 'Stress' | 'Systems';
  aerobicMins?: number;
  sleepDuration?: number;
  wholeFoodRatio?: number;
  stressLevel?: number;
  healthStatus?: 'optimal' | 'warning' | 'critical' | 'manual';
}

export function HealthEngine2DFallback({
  activePillar = 'Systems', aerobicMins = 180, sleepDuration = 8,
  wholeFoodRatio = 75, stressLevel = 3, healthStatus = 'optimal',
}: FallbackProps) {
  const id = useId();
  const scales = [
    { key: 'Fitness', label: 'Movement', value: aerobicMins, min: 0, max: 400, short: aerobicMins + ' min/week', ends: ['0 min', '400 min'], note: PILLAR_GUIDES.Fitness.goal },
    { key: 'Nutrition', label: 'Food setting', value: wholeFoodRatio, min: 0, max: 100, short: wholeFoodRatio + '%', ends: ['0%', '100%'], note: 'This example percentage is not a diet-quality score or an NHS target.' },
    { key: 'Sleep', label: 'Sleep', value: sleepDuration, min: 4, max: 10, short: sleepDuration + 'h / night', ends: ['4 hours', '10 hours'], note: PILLAR_GUIDES.Sleep.goal },
    { key: 'Stress', label: 'Perceived stress', value: stressLevel, min: 1, max: 10, short: stressLevel + ' / 10', ends: ['1 · lower', '10 · higher'], note: 'A chosen description of stress, not a clinical test.' },
  ] as const;

  return (
    <div data-testid="health-engine-2d-fallback" className="mx-auto w-full min-w-0 max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-slate-100 shadow-2xl sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="min-w-0">
          <p className="text-xs font-mono tracking-widest text-cyan-300 uppercase">LABELLED HABIT DIAGRAM</p>
          <h2 className="text-base font-semibold text-slate-100">Habit Explorer · 2D view</h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Scenario</span>
          <span className="rounded-full border border-slate-600 bg-slate-950/60 px-2.5 py-1 text-[10px] font-mono font-bold text-cyan-200">{healthStatus === 'manual' ? 'MANUAL' : 'EXAMPLE'}</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-300">Selected pillar: {activePillar}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">Each marker shows one chosen setting. The scale ends are control limits, not health targets. A higher value is not automatically better.</p>
      <div role="img" aria-labelledby={id + '-title'} aria-describedby={id + '-description'} className="mt-4">
        <span id={id + '-title'} className="sr-only">Current parameter illustration</span>
        <span id={id + '-description'} className="sr-only">Selected pillar: {activePillar}. Scenario: {healthStatus === 'manual' ? 'manual settings' : 'example settings'}. Aerobic activity: {aerobicMins} minutes per week. Whole food ratio: {wholeFoodRatio} percent. Sleep duration: {sleepDuration} hours per night. Perceived stress: {stressLevel} out of 10. Markers show selected inputs, not predicted outcomes.</span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {scales.map(scale => {
            const position = 12 + Math.min(1, Math.max(0, (scale.value - scale.min) / (scale.max - scale.min))) * 276;
            return (
              <div key={scale.key} className={'min-w-0 rounded-xl border p-3 ' + (activePillar === scale.key ? 'border-cyan-400/60 bg-cyan-500/5' : 'border-slate-700 bg-slate-950/30')}>
                <p className="text-sm font-semibold">{scale.label}</p>
                <p className="mt-1 font-mono text-base text-cyan-200">{scale.short}</p>
                <svg viewBox="0 0 300 28" aria-hidden="true" className="mt-3 w-full">
                  <line x1="12" x2="288" y1="14" y2="14" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                  <line x1="12" x2={position} y1="14" y2="14" stroke="#7DD3FC" strokeWidth="6" strokeLinecap="round" />
                  <path d={'M ' + position + ' 3 L ' + (position - 7) + ' 14 L ' + position + ' 25 L ' + (position + 7) + ' 14 Z'} fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
                </svg>
                <div className="flex justify-between gap-2 text-[11px] text-slate-400"><span>{scale.ends[0]}</span><span>{scale.ends[1]}</span></div>
                <p className="mt-3 text-xs leading-relaxed text-slate-300">{scale.note}</p>
              </div>
            );
          })}
        </div>
      </div>
      <section aria-labelledby={id + '-values'} className="mt-4 border-t border-slate-800 pt-4">
        <h3 id={id + '-values'} className="text-sm font-semibold">Current parameter values</h3>
        <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-400">Aerobic activity</dt><dd className="font-mono text-cyan-200">{aerobicMins} minutes/week</dd></div>
          <div><dt className="text-slate-400">Whole food ratio</dt><dd className="font-mono text-cyan-200">{wholeFoodRatio}%</dd></div>
          <div><dt className="text-slate-400">Sleep duration</dt><dd className="font-mono text-cyan-200">{sleepDuration} hours/night</dd></div>
          <div><dt className="text-slate-400">Perceived stress</dt><dd className="font-mono text-cyan-200">{stressLevel} / 10</dd></div>
        </dl>
      </section>
      <p className="mt-4 text-xs leading-relaxed text-slate-400">{healthStatus === 'manual' ? 'Manual settings. Select a preset to view its evidence summary.' : 'Illustrative example. Open the scenario summary for sources and limits.'} Open the Guide to connect these inputs to general habit guidance.</p>
    </div>
  );
}

export default HealthEngine2DFallback;
