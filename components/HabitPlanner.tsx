'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { HabitWeekPlan } from '@/components/HabitWeekPlan';
import { weekDownloadLines } from '@/lib/education/habitWeek';
import { UrgentSupport } from '@/components/UrgentSupport';
import { Download, ArrowUpRight } from 'lucide-react';
import { HABIT_DRAFT_KEY, parseSavedHabitDraft, type HabitPillar, type HabitDraft as Draft } from '@/lib/education/habitDraft';
import { PILLAR_GUIDES } from '@/lib/education/healthGuide';

export type { HabitPillar } from '@/lib/education/habitDraft';
const options = [
  { key: 'Fitness', slug: 'fitness', label: 'Movement', starter: 'Try a manageable walk or another activity I enjoy.', cue: 'For example: after lunch, on a day that suits me.' },
  { key: 'Nutrition', slug: 'nutrition', label: 'Food', starter: 'Add vegetables, beans or a higher-fibre food to one familiar meal.', cue: 'For example: when I prepare my evening meal.' },
  { key: 'Sleep', slug: 'sleep', label: 'Sleep', starter: 'Make time for a regular wind-down routine.', cue: 'For example: before I get ready for bed.' },
  { key: 'Stress', slug: 'stress', label: 'Stress & support', starter: 'Make time for comfortable breathing or a conversation with someone I trust.', cue: 'For example: during a quiet break in my day.' },
] as const;

function initialDrafts(): Record<HabitPillar, Draft> {
  return {
    Fitness: { action: options[0].starter, cue: '', support: '', reflection: '', week: null },
    Nutrition: { action: options[1].starter, cue: '', support: '', reflection: '', week: null },
    Sleep: { action: options[2].starter, cue: '', support: '', reflection: '', week: null },
    Stress: { action: options[3].starter, cue: '', support: '', reflection: '', week: null },
  };
}

export function HabitPlanner({ initialPillar, initialAction }: { initialPillar: HabitPillar; initialAction?: string }) {
  const [selected, setSelected] = useState<HabitPillar>(initialPillar);
  const [drafts, setDrafts] = useState(() => {
    const initial = initialDrafts();
    if (initialAction) initial[initialPillar].action = initialAction;
    return initial;
  });
  const [status, setStatus] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [confirmReturn, setConfirmReturn] = useState(false);
  const id = useId();
  const option = options.find(item => item.key === selected)!;
  const guide = PILLAR_GUIDES[selected];
  const draft = drafts[selected];

  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDrafts(current => ({ ...current, [selected]: { ...current[selected], [field]: value } }));
    setStatus('');
    setUnsavedChanges(true);
  }

  function saveDraft() {
    try {
      const raw = JSON.stringify({ version: 3, selected, drafts });
      if (!parseSavedHabitDraft(raw)) throw new Error('Invalid draft');
      window.localStorage.setItem(HABIT_DRAFT_KEY, raw);
      setUnsavedChanges(false);
      setStatus('Saved draft on this device. Save again after making changes.');
    } catch {
      setStatus('Saving is unavailable in this browser. You can download your plan instead.');
    }
  }

  function restoreDraft(openWeek = false) {
    try {
      const saved = parseSavedHabitDraft(window.localStorage.getItem(HABIT_DRAFT_KEY));
      if (!saved) {
        setStatus('No compatible saved draft was found. Your current edits are unchanged.');
        return;
      }
      setDrafts(saved.drafts);
      setSelected(saved.selected);
      setUnsavedChanges(false);
      setConfirmReturn(false);
      if (openWeek) requestAnimationFrame(() => {
        const target = saved.drafts[saved.selected].week
          ? document.getElementById('seven-day-plan')
          : document.getElementById(id + '-action');
        target?.focus();
        target?.scrollIntoView({ block: 'start' });
      });
      setStatus('Saved draft restored, including your drafts for all four pillars.');
    } catch {
      setStatus('Saved drafts are unavailable in this browser. Your current edits are unchanged.');
    }
  }

  function removeSavedDraft() {
    try {
      window.localStorage.removeItem(HABIT_DRAFT_KEY);
      setUnsavedChanges(true);
      setStatus('Saved draft removed from this browser. Your current edits are unchanged.');
    } catch {
      setStatus('The saved draft could not be removed in this browser. Your current edits are unchanged.');
    }
  }

  function download() {
    if (!draft.action.trim() && !draft.week) return;
    const text = [
      'HEALTHCREST — MY NEXT STEP',
      '',
      'Pillar: ' + option.label,
      'Why it matters: ' + guide.goal,
      '',
      'My manageable action: ' + (draft.action.trim() || 'Choose a new action when ready.'),
      'When I will try it: ' + (draft.cue.trim() || 'Choose a moment that fits my routine.'),
      'What could help: ' + (draft.support.trim() || 'Keep the action small and adapt it to my circumstances.'),
      '',
      'Review after trying it: How did it fit my routine? What made it easier or harder? What would I adjust?',
      'An interrupted routine is a reason to adapt, not a failed health score.',
      '',
      ...(draft.reflection.trim() ? ['My reflection: ' + draft.reflection.trim(), ''] : []),
      ...(draft.week ? weekDownloadLines(draft.week) : []),
      'General guidance: ' + guide.guidance,
      guide.sourceLabel,
      guide.sourceUrl,
      '',
      'This is my chosen habit idea, not a prescription generated from Habit Explorer settings.',
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
      <noscript><style>{'.hc-week-start, .hc-plan-return-actions, .hc-week-quick-save { display: none; }'}</style><p className="hc-model-note">Enable JavaScript to switch pillars and download a plan. Seven-day check-ins and saving also need JavaScript. You can still read the starter idea and guidance below.</p></noscript>
      <section id="return-to-plan" tabIndex={-1} aria-labelledby={id + '-return-title'} className="hc-plan-return">
        <h2 id={id + '-return-title'}>Return to your plan</h2>
        <p>Choose Restore my plan to read the saved copy on this device and open its selected week. Restoring replaces the drafts currently on this page. Plans stay in this browser and do not sync between devices.</p>
        <div className="hc-plan-return-actions">
          {!confirmReturn ? <button type="button" onClick={() => { if (unsavedChanges) { setConfirmReturn(true); requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('#return-to-plan [role="group"] button')?.focus()); } else restoreDraft(true); }}>Restore my plan</button> : (
            <div role="group" aria-label="Restore confirmation">
              <p>Replace your current page edits with the saved plan? Save or download first if you want to keep these edits.</p>
              <button type="button" onClick={() => { setConfirmReturn(false); requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('#return-to-plan button')?.focus()); }}>Keep my edits</button>
              <button type="button" onClick={() => { setConfirmReturn(false); restoreDraft(true); }}>Replace edits and restore</button>
            </div>
          )}
          <a href="#seven-day-plan">Go to the current week on this page</a>
        </div>
        <p className="hc-plan-unsaved" aria-live="polite">{unsavedChanges ? 'You have page changes to save. Choose Save on this device to keep them.' : 'Saving is manual. Save again after editing your plan or check-ins.'}</p>
      </section>
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
          <p id={id + '-scope'}>The starter is an idea to adapt, not a recommendation calculated from your Habit Explorer settings.</p>
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
            <h3>Extra reflection notes</h3>
            <p>How did it fit your routine? What made it easier or harder? What would you adjust? An interrupted routine is a reason to adapt, not a failed health score.</p>
          </div>
          <div className="hc-plan-field">
            <label htmlFor={id + '-reflection'}>What did I learn? <span>(optional)</span></label>
            <p id={id + '-reflection-help'}>Keep a general note here, or use the daily check-ins and weekly review below.</p>
            <textarea id={id + '-reflection'} rows={4} maxLength={500} value={draft.reflection}
              aria-describedby={id + '-reflection-help'} onChange={event => update('reflection', event.target.value)} />
          </div>
          <HabitWeekPlan key={selected} week={draft.week} draft={draft} onSave={saveDraft} hasUnsavedChanges={unsavedChanges}
            onChange={week => update('week', week)}
            onUseNextAction={action => { update('action', action); document.getElementById(id + '-action')?.focus(); }} />
          <section id="saved-draft-controls" tabIndex={-1} aria-label="Keep your draft" className="hc-plan-keep">
            <h3>Keep your draft</h3>
            <p className="hc-plan-storage">Choose Save on this device to keep all four pillar drafts, reflection notes and seven-day check-ins in this browser. They do not sync to other devices. Saving is manual: save again after editing.</p>
            <p className="hc-plan-storage">Restore replaces the drafts currently on this page. Remove clears only the saved copy and keeps your current edits.</p>
            <div className="hc-plan-save-actions">
              <button type="button" onClick={saveDraft}>Save on this device</button>
              <button type="button" onClick={() => restoreDraft()}>Restore saved draft</button>
              <button type="button" onClick={removeSavedDraft}>Remove saved draft</button>
            </div>
            <p className="hc-plan-storage">Without saving, drafts are discarded when you leave or reload. You can also download a plan to keep a separate copy.</p>
          </section>
          <button type="button" className="hc-button hc-button-primary" onClick={download} disabled={!draft.action.trim() && !draft.week}>
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
          {selected === 'Stress' && <UrgentSupport />}
          <p>The Habit Explorer helps you explore examples. Its colours and scenario labels do not measure your body or determine this plan.</p>
          <Link href={'/engine?pillar=' + option.slug} prefetch={false} className="hc-text-link">
            Explore {option.label.toLowerCase()} in the Habit Explorer <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
