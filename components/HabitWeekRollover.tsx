'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { createHabitWeek, formatDay, localDate, weekDayDate, type HabitWeek } from '@/lib/education/habitWeek';

type Proposal = { startDate: string; action: string; cue: string; support: string };
export function HabitWeekRollover({ week, draft, onStart, onDownloadBackup }: {
  week: HabitWeek;
  draft: { action: string; cue: string; support: string };
  onStart: (week: HabitWeek) => void;
  onDownloadBackup: () => void;
}) {
  const id = useId();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [ready, setReady] = useState<HabitWeek | null>(null);
  const [error, setError] = useState('');
  const prepareButton = useRef<HTMLButtonElement>(null);
  const actionField = useRef<HTMLTextAreaElement>(null);
  const confirmation = useRef<HTMLHeadingElement>(null);

  function open() {
    setProposal({ startDate: '', action: week.nextAction.trim() || (draft.action.trim() ? draft.action : week.action), cue: draft.cue, support: draft.support });
    setReady(null);
    setError('');
    requestAnimationFrame(() => actionField.current?.focus());
  }
  function cancel() {
    setProposal(null);
    setReady(null);
    setError('');
    requestAnimationFrame(() => prepareButton.current?.focus());
  }
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!proposal) return;
    try {
      setReady(createHabitWeek(proposal.startDate || localDate(new Date()), proposal));
      setError('');
      requestAnimationFrame(() => confirmation.current?.focus());
    } catch {
      setError('Choose a valid start date and a manageable action for the new week.');
    }
  }
  function replace() {
    if (!ready) return;
    const next = ready;
    setProposal(null);
    setReady(null);
    setError('');
    onStart(next);
  }

  return (
    <section className="hc-week-next" aria-labelledby={id + '-title'}>
      <h4 id={id + '-title'}>Plan another week</h4>
      <p>Use what you learned to choose your next manageable action. Your current week stays in place while you prepare.</p>
      {!proposal ? <button type="button" ref={prepareButton} onClick={open}>Prepare another week</button> : <>
        <div className="hc-week-next-backup">
          <p>Keep the old record in a downloaded backup before replacement. It includes the current drafts and weeks for all four pillars; the preparation fields below are separate. Check that the download has finished saving before you replace a record you want to keep.</p>
          <button type="button" onClick={onDownloadBackup}>Download backup of current plans</button>
        </div>
        {!ready ? <form onSubmit={review} className="hc-week-next-form">
          <label htmlFor={id + '-action'}>Action for the new week</label>
          <textarea id={id + '-action'} ref={actionField} rows={3} maxLength={300} required value={proposal.action}
            onChange={event => { setProposal({ ...proposal, action: event.target.value }); setError(''); }} />
          <label htmlFor={id + '-date'}>New week start date <span>(optional)</span></label>
          <p id={id + '-date-help'}>Leave this blank to start today, using this device’s date.</p>
          <input id={id + '-date'} type="date" min="1900-01-01" max="9999-12-25" value={proposal.startDate}
            aria-describedby={id + '-date-help'} onChange={event => { setProposal({ ...proposal, startDate: event.target.value }); setError(''); }} />
          <label htmlFor={id + '-cue'}>When will I try the new action? <span>(optional)</span></label>
          <input id={id + '-cue'} type="text" maxLength={180} value={proposal.cue} onChange={event => setProposal({ ...proposal, cue: event.target.value })} />
          <label htmlFor={id + '-support'}>What could help with the new action? <span>(optional)</span></label>
          <textarea id={id + '-support'} rows={2} maxLength={180} value={proposal.support} onChange={event => setProposal({ ...proposal, support: event.target.value })} />
          <p>Your current plan stays in place until you confirm replacement. Saving or downloading now keeps that current plan, without these preparation fields. Each pillar keeps one current week.</p>
          <button type="submit">Review new week</button>
          {error && <p role="alert">{error}</p>}
        </form> : <div className="hc-week-confirm" role="group" aria-labelledby={id + '-confirm-title'}>
          <h5 id={id + '-confirm-title'} ref={confirmation} tabIndex={-1}>Replace this week’s page record?</h5>
          <p><strong><time dateTime={ready.startDate}>{formatDay(ready.startDate)}</time> to <time dateTime={weekDayDate(ready.startDate, 6)}>{formatDay(weekDayDate(ready.startDate, 6))}</time></strong></p>
          <p className="hc-week-next-action">{ready.action}</p>
          {ready.cue.trim() && <p>When: {ready.cue}</p>}
          {ready.support.trim() && <p>What could help: {ready.support}</p>}
          <p>This replaces this pillar’s current week, daily check-ins and weekly review on this page with a new week and seven blank check-ins. The draft action, cue and support become the new choices. Extra reflection notes and the other pillars stay as they are.</p>
          <p>Your saved browser copy changes only when you save again. Keep this week in a downloaded backup first if you want a separate record.</p>
          <button type="button" onClick={() => { setReady(null); requestAnimationFrame(() => actionField.current?.focus()); }}>Keep editing new week</button>
          <button type="button" onClick={replace}>Replace with this new week</button>
        </div>}
        <button type="button" onClick={cancel}>Cancel new week preparation</button>
      </>}
    </section>
  );
}
