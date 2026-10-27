'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { Download, ArrowUpRight } from 'lucide-react';
import type { PillarType } from '@/lib/presets/types';
import { PILLAR_GUIDES } from '@/lib/education/healthGuide';

export type HabitPillar = Exclude<PillarType, 'Systems'>;
type Draft = { action: string; cue: string; support: string };
const options = [
  { key: 'Fitness', slug: 'fitness', label: 'Movement', starter: 'Try a manageable walk or another activity I enjoy.', cue: 'For example: after lunch, on a day that suits me.' },
  { key: 'Nutrition', slug: 'nutrition', label: 'Food', starter: 'Add vegetables, beans or a higher-fibre food to one familiar meal.', cue: 'For example: when I prepare my evening meal.' },
  { key: 'Sleep', slug: 'sleep', label: 'Sleep', starter: 'Make time for a regular wind-down routine.', cue: 'For example: before I get ready for bed.' },
  { key: 'Stress', slug: 'stress', label: 'Stress & support', starter: 'Make time for comfortable breathing or a conversation with someone I trust.', cue: 'For example: during a quiet break in my day.' },
] as const;

function initialDrafts(): Record<HabitPillar, Draft> {
  return {
    Fitness: { action: options[0].starter, cue: '', support: '' },
    Nutrition: { action: options[1].starter, cue: '', support: '' },
    Sleep: { action: options[2].starter, cue: '', support: '' },
    Stress: { action: options[3].starter, cue: '', support: '' },
  };
}

export function HabitPlanner({ initialPillar }: { initialPillar: HabitPillar }) {
  const [selected, setSelected] = useState<HabitPillar>(initialPillar);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [status, setStatus] = useState('');
  const id = useId();
  const option = options.find(item => item.key === selected)!;
  const guide = PILLAR_GUIDES[selected];
  const draft = drafts[selected];

  function update(field: keyof Draft, value: string) {
    setDrafts(current => ({ ...current, [selected]: { ...current[selected], [field]: value } }));
    setStatus('');
  }

  function download() {
    if (!draft.action.trim()) return;
    const text = [
      'HEALTHCREST — MY NEXT STEP',
      '',
      'Pillar: ' + option.label,
      'Why it matters: ' + guide.goal,
      '',
      'My manageable action: ' + draft.action.trim(),
      'When I will try it: ' + (draft.cue.trim() || 'Choose a moment that fits my routine.'),
      'What could help: ' + (draft.support.trim() || 'Keep the action small and adapt it to my circumstances.'),
      '',
      'Review after trying it: How did it fit my routine? What made it easier or harder? What would I adjust?',
      'An interrupted routine is a reason to adapt, not a failed health score.',
      '',
      'General guidance: ' + guide.guidance,
      guide.sourceLabel,
      guide.sourceUrl,
      '',
      'This is my chosen habit idea, not a prescription generated from engine settings.',
      'General educational information for adults. Adapt to health, ability and circumstances alongside appropriate clinical care.',
    ].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'healthcrest-next-step.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('Plan download started. Your browser may ask where to save it.');
  }

  return (
    <div className="hc-plan">
      <noscript><p className="hc-model-note">Enable JavaScript to switch pillars and download a plan. You can still read the starter idea and guidance below.</p></noscript>
      <div role="group" aria-label="Choose a habit pillar" className="hc-plan-choices">
        {options.map(item => (
          <button key={item.key} type="button" aria-pressed={selected === item.key}
            onClick={() => { setSelected(item.key); setStatus(''); }}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="hc-plan-grid">
        <section aria-labelledby={id + '-draft'} className="hc-plan-draft">
          <span className="hc-eyebrow">Make it your own</span>
          <h2 id={id + '-draft'}>My {option.label.toLowerCase()} next step</h2>
          <p id={id + '-scope'}>The starter is an idea to adapt, not a recommendation calculated from your engine settings.</p>
          <div className="hc-plan-field">
            <label htmlFor={id + '-action'}>One manageable action</label>
            <p id={id + '-action-help'}>Make it small enough to fit your health, ability and circumstances.</p>
            <textarea id={id + '-action'} required rows={3} maxLength={300} value={draft.action}
              aria-describedby={id + '-action-help'} onChange={event => update('action', event.target.value)} />
          </div>
          <div className="hc-plan-field">
            <label htmlFor={id + '-cue'}>When will I try it? <span>(optional)</span></label>
            <p id={id + '-cue-help'}>{option.cue}</p>
            <input id={id + '-cue'} type="text" maxLength={180} value={draft.cue}
              aria-describedby={id + '-cue-help'} onChange={event => update('cue', event.target.value)} />
          </div>
          <div className="hc-plan-field">
            <label htmlFor={id + '-support'}>What could make it easier? <span>(optional)</span></label>
            <p id={id + '-support-help'}>A smaller version, a reminder, a change to your surroundings or support from someone else.</p>
            <textarea id={id + '-support'} rows={2} maxLength={180} value={draft.support}
              aria-describedby={id + '-support-help'} onChange={event => update('support', event.target.value)} />
          </div>
          <div className="hc-plan-review">
            <h3>Try it, then reflect</h3>
            <p>How did it fit your routine? What made it easier or harder? What would you adjust? An interrupted routine is a reason to adapt, not a failed health score.</p>
          </div>
          <p className="hc-plan-storage">Your draft stays in this page while you explore its pillars. It is not saved when you leave or reload. Download it if you want to keep it.</p>
          <button type="button" className="hc-button hc-button-primary" onClick={download} disabled={!draft.action.trim()}>
            Download my next step <Download size={18} aria-hidden="true" />
          </button>
          <p role="status" className="hc-plan-status">{status}</p>
        </section>

        <aside aria-label="Why this habit matters" className="hc-plan-guidance">
          <span className="hc-eyebrow">Connect it to your goal</span>
          <h2>{guide.heading}</h2>
          <p className="hc-lead">{guide.goal}</p>
          <p>{guide.guidance}</p>
          <a href={guide.sourceUrl} target="_blank" rel="noopener noreferrer" className="hc-text-link">
            {guide.sourceLabel}<span className="hc-visually-hidden"> (opens in a new tab)</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <p>The engine helps you explore examples. Its colours and scenario labels do not measure your body or determine this plan.</p>
          <Link href={'/engine?pillar=' + option.slug} prefetch={false} className="hc-text-link">
            Explore {option.label.toLowerCase()} in the engine <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
