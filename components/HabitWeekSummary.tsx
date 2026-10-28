'use client';

import { useId, useState } from 'react';
import { DAY_CHOICES, formatDay, summarizeHabitWeek, weekDayDate, WEEK_SUMMARY_SCOPE, type HabitWeek } from '@/lib/education/habitWeek';

export function HabitWeekSummary({ week, onOpenDay }: { week: HabitWeek; onOpenDay: (index: number) => void }) {
  const id = useId();
  const [selectedDay, setSelectedDay] = useState('0');
  const [expanded, setExpanded] = useState(false);
  const summary = summarizeHabitWeek(week);
  return (
    <section className="hc-week-summary" aria-labelledby={id + '-title'}>
      <h4 id={id + '-title'}>Your week at a glance</h4>
      <p>{WEEK_SUMMARY_SCOPE}</p>
      <dl className="hc-week-summary-facts">
        <div><dt>Days with a choice</dt><dd>{summary.chosenDays}</dd></div>
        <div><dt>Days with notes only</dt><dd>{summary.notesOnlyDays}</dd></div>
        <div><dt>Blank days</dt><dd>{summary.blankDays}</dd></div>
      </dl>
      <p>A notes-only day still counts as a check-in. Blank days can stay blank.</p>
      <div className="hc-week-summary-choices">
        <button type="button" aria-expanded={expanded} aria-controls={id + '-choices'} onClick={() => setExpanded(current => !current)}>{expanded ? 'Hide choice counts' : 'See counts for each choice'}</button>
        <div id={id + '-choices'} hidden={!expanded}>
        <p>Each bar shows a number of days out of seven. No choice selected includes notes-only and blank days.</p>
        <dl className="hc-week-choice-counts">
          {summary.choices.map(choice => <div key={choice.value}>
            <dt><span>{choice.label}</span><span className="hc-week-count-track" aria-hidden="true"><span style={{ width: (week.days.length ? choice.count / week.days.length * 100 : 0) + '%' }} /></span></dt>
            <dd>{choice.count} {choice.count === 1 ? 'day' : 'days'}</dd>
          </div>)}
        </dl>
        </div>
      </div>
      <div className="hc-week-summary-jump">
        <label htmlFor={id + '-day'}>Day to open</label>
        <select id={id + '-day'} value={selectedDay} onChange={event => setSelectedDay(event.target.value)}>
          {week.days.map((day, index) => <option key={index} value={index}>
            {'Day ' + (index + 1) + ' · ' + formatDay(weekDayDate(week.startDate, index)) + ' · ' + DAY_CHOICES.find(choice => choice.value === day.choice)!.label + (day.note.trim() ? ' · note added' : '')}
          </option>)}
        </select>
        <button type="button" onClick={() => onOpenDay(Number(selectedDay))}>Open selected day</button>
      </div>
    </section>
  );
}
