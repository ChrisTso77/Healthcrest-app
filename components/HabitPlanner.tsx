'use client';

import { HabitSelectionMark } from '@/components/HabitSelectionMark';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { HabitDraftOverview } from '@/components/HabitDraftOverview';
import { HabitPlanEvidence } from '@/components/HabitPlanEvidence';
import { HabitPlanBackup } from '@/components/HabitPlanBackup';
import { HabitPlanPrint } from '@/components/HabitPlanPrint';
import { HabitWeekPlan } from '@/components/HabitWeekPlan';
import { downloadHabitBackup } from '@/lib/education/downloadHabitBackup';
import { weekDownloadLines, type HabitWeek } from '@/lib/education/habitWeek';
import { UrgentSupport } from '@/components/UrgentSupport';
import { Download, Printer, ArrowUpRight } from 'lucide-react';
import { HABIT_DRAFT_KEY, type HabitPillar, type HabitDraft as Draft, type SavedHabitDraft } from '@/lib/education/habitDraft';
import { recoverLegacyHabit } from '@/lib/education/legacyHabitRecovery';
import { PILLAR_GUIDES } from '@/lib/education/healthGuide';

// Prevent edits before React can retain them. Server-rendered guidance stays readable.
const subscribeToReadiness = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export type { HabitPillar } from '@/lib/education/habitDraft';
type RestoreOrigin = 'return' | 'saved';
type RestoreRequest = { origin: RestoreOrigin; stage: 'confirm' } | { origin: RestoreOrigin; stage: 'error'; message: string };
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

export function HabitPlanner({ initialPillar, initialAction, initialGuideSource }: {
  initialPillar: HabitPillar; initialAction?: string; initialGuideSource?: { title: string; href: string };
}) {
  const ready = useSyncExternalStore(subscribeToReadiness, clientReady, serverReady);
  const removeError = 'The saved plan could not be removed in this browser. Your current edits are unchanged.';
  const [selected, setSelected] = useState<HabitPillar>(initialPillar);
  const [drafts, setDrafts] = useState(() => {
    const initial = initialDrafts();
    if (initialAction) initial[initialPillar].action = initialAction;
    return initial;
  });
  const [status, setStatus] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [restoreRequest, setRestoreRequest] = useState<RestoreRequest | null>(null);
  const returnButton = useRef<HTMLButtonElement>(null);
  const restoreButton = useRef<HTMLButtonElement>(null);
  const keepEditsButton = useRef<HTMLButtonElement>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const removeButton = useRef<HTMLButtonElement>(null);
  const keepButton = useRef<HTMLButtonElement>(null);
  const [planRevision, setPlanRevision] = useState(0);
  const id = useId();
  const option = options.find(item => item.key === selected)!;
  const guide = PILLAR_GUIDES[selected];
  const draft = drafts[selected];

  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDrafts(current => ({ ...current, [selected]: { ...current[selected], [field]: value } }));
    setStatus('');
    setUnsavedChanges(true);
  }

  // Export does not prove the browser kept a durable file. Keep the dirty state.
  function saveDraft() { downloadBackup(); }

  useEffect(() => {
    if (!unsavedChanges) return;
    const leave = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.download || anchor.target === '_blank') return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin === window.location.origin && destination.pathname === window.location.pathname && destination.search === window.location.search) return;
      if (!window.confirm('Your edits are only on this page. Export a backup before leaving if you want to keep them. Leave this page?')) {
        event.preventDefault(); event.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', leave);
    document.addEventListener('click', navigate, true);
    return () => { window.removeEventListener('beforeunload', leave); document.removeEventListener('click', navigate, true); };
  }, [unsavedChanges]);

  function focusRestore(origin: RestoreOrigin, showError = false) {
    requestAnimationFrame(() => {
      (origin === 'return' ? returnButton.current : restoreButton.current)?.focus();
      if (showError) document.getElementById(id + '-restore-' + origin + '-error')?.scrollIntoView({ block: 'nearest' });
    });
  }

  function requestRestore(origin: RestoreOrigin) {
    setConfirmRemove(false);
    setStatus('');
    if (unsavedChanges) {
      setRestoreRequest({ origin, stage: 'confirm' });
      requestAnimationFrame(() => keepEditsButton.current?.focus());
    } else restoreDraft(origin);
  }

  function restoreDraft(origin: RestoreOrigin) {
    setConfirmRemove(false);
    setRestoreRequest(null);
    try {
      const recovered = recoverLegacyHabit(window.localStorage);
      const saved = recovered.status === 'available' ? recovered.saved : null;
      if (!saved) {
        const message = 'No compatible saved draft was found. Your current edits are unchanged.';
        setStatus(message);
        setRestoreRequest({ origin, stage: 'error', message });
        focusRestore(origin, true);
        return;
      }
      setPlanRevision(current => current + 1);
      setDrafts(saved.drafts);
      setSelected(saved.selected);
      setUnsavedChanges(true);
      if (origin === 'return') requestAnimationFrame(() => {
        const target = saved.drafts[saved.selected].week
          ? document.getElementById('seven-day-plan')
          : document.getElementById(id + '-action');
        target?.focus();
        target?.scrollIntoView({ block: 'start' });
      });
      else focusRestore(origin);
      setStatus('Saved draft restored, including your drafts for all four pillars.');
    } catch {
      const message = 'Saved drafts are unavailable in this browser. Your current edits are unchanged.';
      setStatus(message);
      setRestoreRequest({ origin, stage: 'error', message });
      focusRestore(origin, true);
    }
  }

  function restorePrompt(origin: RestoreOrigin) {
    if (restoreRequest?.origin !== origin) return null;
    if (restoreRequest.stage === 'error') return <p id={id + '-restore-' + origin + '-error'} className="hc-plan-restore-error">{restoreRequest.message}</p>;
    return <div id={id + '-restore-' + origin} role="group" aria-label="Restore confirmation" className="hc-plan-restore-confirmation">
      <p id={id + '-restore-' + origin + '-scope'}>Restoring replaces the drafts, notes and seven-day check-ins currently on this page for all four habits with the saved copy. Export a backup first if you want to keep these page edits.</p>
      <div className="hc-plan-save-actions">
        <button type="button" ref={keepEditsButton} onClick={() => {
          setRestoreRequest(null);
          setStatus('Restore cancelled.');
          focusRestore(origin);
        }}>Keep my edits</button>
        <button type="button" aria-describedby={id + '-restore-' + origin + '-scope'} onClick={() => restoreDraft(origin)}>Replace edits and restore</button>
      </div>
    </div>;
  }

  function importBackup(saved: SavedHabitDraft) {
    setConfirmRemove(false);
    setPlanRevision(current => current + 1);
    setDrafts(saved.drafts);
    setSelected(saved.selected);
    setUnsavedChanges(true);
    setRestoreRequest(null);
    setStatus('Backup imported into page memory only. Export a backup to keep a separate copy; the old saved copy is unchanged.');
    requestAnimationFrame(() => {
      const target = saved.drafts[saved.selected].week
        ? document.getElementById('seven-day-plan')
        : document.getElementById(id + '-action');
      target?.focus();
      target?.scrollIntoView({ block: 'start' });
    });
  }

  function downloadBackup() {
    try {
      downloadHabitBackup({ version: 3, selected, drafts });
      setStatus('Backup download requested for all four pillars. Check that your browser saved the file. It may contain unencrypted sensitive notes; your page edits and old saved copy are unchanged.');
    } catch {
      setStatus('Backup download is unavailable in this browser. Your page edits are unchanged; you can try the text download or printing.');
    }
  }

  function startNextWeek(week: HabitWeek) {
    setConfirmRemove(false);
    setDrafts(current => ({ ...current, [selected]: { ...current[selected], action: week.action, cue: week.cue, support: week.support, week } }));
    setUnsavedChanges(true);
    setRestoreRequest(null);
    setStatus('New week started in page memory. Export a backup to keep it.');
  }

  function removeSavedDraft() {
    if (!confirmRemove) return;
    try {
      window.localStorage.removeItem(HABIT_DRAFT_KEY);
      setUnsavedChanges(true);
      setConfirmRemove(false);
      setStatus('Saved plan removed from this browser. Your current edits are unchanged.');
      requestAnimationFrame(() => removeButton.current?.focus());
    } catch {
      setStatus(removeError);
    }
  }

  function printPlan() {
    if (!draft.action.trim() && !draft.week) return;
    try {
      window.print();
    } catch {
      setStatus('Printing is unavailable in this browser. You can download your plan instead.');
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
    <fieldset className="hc-plan" disabled={!ready} aria-label="Habit planner" aria-busy={!ready}>
      <noscript><style>{'.hc-week-start, .hc-plan-return-actions, .hc-week-quick-save, .hc-plan-print-button, .hc-plan-backup, .hc-week-next, .hc-draft-overview { display: none; }'}</style><p className="hc-model-note">Enable JavaScript to switch pillars and download a plan. Seven-day check-ins and saving also need JavaScript. You can still read the starter idea and guidance below.</p></noscript>
      <section id="return-to-plan" tabIndex={-1} aria-labelledby={id + '-return-title'} className="hc-plan-return">
        <h2 id={id + '-return-title'}>Return to your plan</h2>
        <p>Restore my plan reads an older saved copy only when you ask. It does not change that copy. New edits remain in page memory and do not sync. Exported files are user-managed and unencrypted.</p>
        <div className="hc-plan-return-actions">
          <button type="button" ref={returnButton} onClick={() => requestRestore('return')}
            aria-expanded={restoreRequest?.origin === 'return' && restoreRequest.stage === 'confirm'}
            aria-controls={restoreRequest?.origin === 'return' && restoreRequest.stage === 'confirm' ? id + '-restore-return' : undefined}
            aria-describedby={restoreRequest?.origin === 'return' && restoreRequest.stage === 'error' ? id + '-restore-return-error' : undefined}>Restore my plan</button>
          {restorePrompt('return')}
          <a href="#seven-day-plan">Go to the current week on this page</a>
        </div>
        <p className="hc-plan-unsaved" aria-live="polite">{unsavedChanges ? 'Your edits exist only on this page. Export a backup to keep them.' : 'New edits are not saved on this device. Export before leaving; closing, refreshing or a crash may lose page edits.'}</p>
      </section>
      <div role="group" aria-label="Choose a habit pillar" className="hc-plan-choices">
        {options.map(item => (
          <button key={item.key} type="button" aria-pressed={selected === item.key}
            onClick={() => { setSelected(item.key); setConfirmRemove(false); setRestoreRequest(null); setStatus(''); }}>
            {item.label}
            <HabitSelectionMark selected={selected === item.key} />
          </button>
        ))}
      </div>

      <HabitDraftOverview drafts={drafts} pillars={options} selected={selected} onOpen={pillar => {
        setRestoreRequest(null);
        setConfirmRemove(false);
        setSelected(pillar);
        setStatus('');
        requestAnimationFrame(() => {
          const target = document.getElementById(id + '-action');
          target?.focus();
          target?.scrollIntoView({ block: 'center' });
        });
      }} />

      <div className="hc-plan-grid">
        <section aria-labelledby={id + '-draft'} className="hc-plan-draft">
          <span className="hc-eyebrow">Make it your own</span>
          <h2 id={id + '-draft'}>My {option.label.toLowerCase()} next step</h2>
          <p id={id + '-scope'}>The starter is an idea to adapt, not a recommendation calculated from your Habit Explorer settings.</p>
          {initialGuideSource && selected === initialPillar && draft.action === initialAction && planRevision === 0 && <p className="hc-plan-guide-origin">
            Starting idea from <Link href={initialGuideSource.href} prefetch={false}>{initialGuideSource.title}</Link>. Edit the wording to fit your circumstances. Using this idea does not restore or save a plan.
          </p>}
          <a href="#habit-plan-evidence" className="hc-plan-evidence-jump">Read the evidence for this habit</a>
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
          <HabitWeekPlan key={selected + '-' + planRevision} week={draft.week} draft={draft} onSave={saveDraft} hasUnsavedChanges={unsavedChanges}
            onStartNextWeek={startNextWeek} onDownloadBackup={downloadBackup}
            onChange={week => update('week', week)}
            onUseNextAction={action => { update('action', action); document.getElementById(id + '-action')?.focus(); }} />
          <section id="saved-draft-controls" tabIndex={-1} aria-label="Keep your draft" className="hc-plan-keep">
            <h3>Keep your draft</h3>
            <p className="hc-plan-storage">Export requests a separate unencrypted JSON file of all four drafts, notes and weeks. New edits are not saved in browser storage. Verify your download and manage any sensitive file copies yourself.</p>
            <p className="hc-plan-storage">Restoring asks before replacing unsaved drafts, notes and check-ins for all four habits. Removing a saved plan needs confirmation and clears only the saved copy, keeping your current page edits.</p>
            <div className="hc-plan-save-actions">
              <button type="button" onClick={saveDraft}>Export all drafts as JSON</button>
              <button type="button" ref={restoreButton} onClick={() => requestRestore('saved')}
                aria-expanded={restoreRequest?.origin === 'saved' && restoreRequest.stage === 'confirm'}
                aria-controls={restoreRequest?.origin === 'saved' && restoreRequest.stage === 'confirm' ? id + '-restore-saved' : undefined}
                aria-describedby={restoreRequest?.origin === 'saved' && restoreRequest.stage === 'error' ? id + '-restore-saved-error' : undefined}>Restore saved draft</button>
              <button type="button" ref={removeButton} aria-expanded={confirmRemove}
                aria-controls={confirmRemove ? id + '-remove-confirmation' : undefined}
                onClick={() => {
                  setRestoreRequest(null);
                  setConfirmRemove(true);
                  setStatus('');
                  requestAnimationFrame(() => keepButton.current?.focus());
                }}>Remove saved plan</button>
            </div>
            {restorePrompt('saved')}
            {confirmRemove && <div id={id + '-remove-confirmation'} role="group" aria-labelledby={id + '-remove-title'} className="hc-plan-removal">
              <h4 id={id + '-remove-title'}>Remove the saved plan on this browser?</h4>
              <p id={id + '-remove-scope'}>This removes the saved copy for all four habits, including saved notes and seven-day check-ins. The drafts currently on this page stay available.</p>
              <p>Download a backup first if you want a separate copy. Downloaded files and printed copies are not removed.</p>
              {status === removeError && <p className="hc-plan-removal-error">{removeError}</p>}
              <div className="hc-plan-save-actions">
                <button type="button" ref={keepButton} onClick={() => {
                  setConfirmRemove(false);
                  setStatus('Removal cancelled.');
                  requestAnimationFrame(() => removeButton.current?.focus());
                }}>Keep saved plan</button>
                <button type="button" aria-describedby={id + '-remove-scope'} onClick={removeSavedDraft}>Remove saved copy</button>
              </div>
            </div>}
            <p className="hc-plan-storage">Without saving, drafts are discarded when you leave or reload. You can also download a plan to keep a separate copy.</p>
          </section>
          <HabitPlanBackup drafts={drafts} onDownload={downloadBackup} onImport={importBackup} onStatus={setStatus} />
          <div className="hc-plan-export-actions">
            <button type="button" className="hc-button hc-button-primary" onClick={download} disabled={!draft.action.trim() && !draft.week}>
              Download my next step <Download size={18} aria-hidden="true" />
            </button>
            <button type="button" className="hc-button hc-plan-print-button" onClick={printPlan} disabled={!draft.action.trim() && !draft.week} aria-describedby={id + '-print-help'}>
              Print my plan <Printer size={18} aria-hidden="true" />
            </button>
          </div>
          <p id={id + '-print-help'} className="hc-plan-storage">Print the current draft and check-ins for this pillar, including page edits. Choose a printer or Save as PDF if your browser offers it. Printing does not save your browser draft.</p>
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
          <HabitPlanEvidence pillar={selected} actionId={id + '-action'} />
          <p>The Habit Explorer helps you explore examples. Its colours and scenario labels do not measure your body or determine this plan.</p>
          <Link href={'/engine?pillar=' + option.slug} prefetch={false} className="hc-text-link">
            Explore {option.label.toLowerCase()} in the Habit Explorer <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </aside>
      </div>
      <HabitPlanPrint label={option.label} draft={draft} />
    </fieldset>
  );
}
