'use client';

import { HabitWeekRollover } from '@/components/HabitWeekRollover';
import { useId, useRef, useState, type FormEvent } from 'react';
import { createHabitWeek, DAY_CHOICES, formatDay, localDate, weekDayDate, type HabitDay, type HabitWeek } from '@/lib/education/habitWeek';

export function HabitWeekPlan({ week, draft, onChange, onUseNextAction, onSave, hasUnsavedChanges, onStartNextWeek, onDownloadBackup }: {
  onStartNextWeek: (week: HabitWeek) => void;
  onDownloadBackup: () => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
  week: HabitWeek | null;
  draft: { action: string; cue: string; support: string };
  onChange: (week: HabitWeek | null) => void;
  onUseNextAction: (action: string) => void;
}) {
  const id = useId();
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const clearButton = useRef<HTMLButtonElement>(null);

  function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      onChange(createHabitWeek(startDate || localDate(new Date()), draft));
      setError('');
      heading.current?.focus();
    } catch { setError('Choose a valid start date and a manageable action above.'); }
  }

  function updateDay(index: number, change: Partial<HabitDay>) {
    if (!week) return;
    onChange({ ...week, days: week.days.map((day, i) => i === index ? { ...day, ...change } : day) });
  }

  function clear() {
    onChange(null);
    setConfirmClear(false);
    setStartDate('');
    requestAnimationFrame(() => startButton.current?.focus());
  }

  const recorded = week?.days.filter(day => day.choice !== '' || day.note.trim()).length ?? 0;
  return (
    <section id="seven-day-plan" tabIndex={-1} aria-labelledby={id + '-title'} className="hc-week">
      <span className="hc-eyebrow">Try, notice, adjust</span>
      <h3 id={id + '-title'} tabIndex={-1} ref={heading}>Your seven-day habit plan</h3>
      <p>Give one manageable action a place in your week. Use the check-ins to notice what fits and what could help. Seven days is a planning window; changes in health and the time needed to form a habit vary.</p>
      {!week ? (
        <form onSubmit={start} className="hc-week-start">
          <label htmlFor={id + '-start'}>Start date <span>(optional)</span></label>
          <p id={id + '-date-help'}>Leave this blank to start today, using this device’s date.</p>
          <input id={id + '-start'} type="date" min="1900-01-01" max="9999-12-25" value={startDate}
            aria-describedby={id + '-date-help'} onChange={event => { setStartDate(event.target.value); setError(''); }} />
          <button type="submit" ref={startButton} disabled={!draft.action.trim()}>Start seven-day plan</button>
          {!draft.action.trim() && <p>Write one manageable action above to start.</p>}
          {error && <p role="alert">{error}</p>}
        </form>
      ) : (
        <>
          <div className="hc-week-action" aria-label="Action for this week">
            <p><strong>{formatDay(week.startDate)} to {formatDay(weekDayDate(week.startDate, 6))}</strong></p>
            <p className="hc-week-chosen">{week.action}</p>
            {week.cue.trim() && <p>When: {week.cue}</p>}
            {week.support.trim() && <p>What could help: {week.support}</p>}
            <p>The action shown here stays attached to these check-ins. You can edit the draft above for a future plan.</p>
          </div>
          <p>{recorded} of 7 days have a check-in. Check in after a day, or leave it blank. You can adapt the action, choose rest or seek support.</p>
          <ol className="hc-week-days" aria-label="Seven daily check-ins">
            {week.days.map((day, index) => {
              const date = weekDayDate(week.startDate, index);
              const dayId = id + '-day-' + index;
              return (
                <li key={index}>
                  <details>
                    <summary><span>Day {index + 1} · <time dateTime={date}>{formatDay(date)}</time></span><span>{DAY_CHOICES.find(item => item.value === day.choice)!.label}{day.choice === '' && day.note.trim() ? ' · note added' : ''}</span></summary>
                    <div className="hc-week-day-fields">
                      <label htmlFor={dayId + '-choice'}>Day {index + 1}: what happened?</label>
                      <select id={dayId + '-choice'} value={day.choice} onChange={event => updateDay(index, { choice: event.target.value as HabitDay['choice'] })}>
                        {DAY_CHOICES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                      </select>
                      <label htmlFor={dayId + '-note'}>Day {index + 1}: a note <span>(optional)</span></label>
                      <p id={dayId + '-help'}>What helped, got in the way or made a smaller version possible?</p>
                      <textarea id={dayId + '-note'} rows={2} maxLength={180} value={day.note}
                        aria-describedby={dayId + '-help'} onChange={event => updateDay(index, { note: event.target.value })} />
                    </div>
                  </details>
                </li>
              );
            })}
          </ol>
          <div className="hc-week-review">
            <h4>Review your week</h4>
            <p>When you are ready, look back at what helped and what got in the way. Use that to choose a manageable next action.</p>
            <label htmlFor={id + '-review'}>What did this week teach me? <span>(optional)</span></label>
            <textarea id={id + '-review'} rows={3} maxLength={500} value={week.review} onChange={event => onChange({ ...week, review: event.target.value })} />
            <label htmlFor={id + '-next'}>An action I might try next <span>(optional)</span></label>
            <textarea id={id + '-next'} rows={2} maxLength={300} value={week.nextAction} onChange={event => onChange({ ...week, nextAction: event.target.value })} />
            <button type="button" disabled={!week.nextAction.trim()} onClick={() => onUseNextAction(week.nextAction.trim())}>Use this action in my draft</button>
          </div>
          <HabitWeekRollover week={week} draft={draft} onDownloadBackup={onDownloadBackup}
            onStart={next => { setConfirmClear(false); setStartDate(''); setError(''); onStartNextWeek(next); requestAnimationFrame(() => heading.current?.focus()); }} />
          <div className="hc-week-quick-save">
            <p>{hasUnsavedChanges ? 'Your latest changes are on this page. Save to keep them on this device.' : 'Save again whenever you change a check-in or review.'}</p>
            <button type="button" onClick={onSave}>Save week and all drafts</button>
            <p className="hc-plan-storage">This saves the drafts and current weeks for all four pillars in this browser.</p>
          </div>
          <p className="hc-plan-storage">Choose Save on this device below to keep this week with your drafts. Save again after editing. This page keeps one current week per pillar.</p>
          {!confirmClear ? <button type="button" ref={clearButton} onClick={() => setConfirmClear(true)}>Clear this week to start another</button> : (
            <div className="hc-week-confirm" role="group" aria-label="Clear this week confirmation">
              <p>Clear this pillar’s current week and its check-ins from this page? Download your next step below first if you want a separate copy. Your saved copy changes only when you save again. Your draft action and extra reflection notes will stay.</p>
              <button type="button" onClick={() => { setConfirmClear(false); requestAnimationFrame(() => clearButton.current?.focus()); }}>Keep this week</button>
              <button type="button" onClick={clear}>Clear current week</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
