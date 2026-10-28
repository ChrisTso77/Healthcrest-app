'use client';

import { useId, useState } from 'react';
import type { HabitDrafts, HabitPillar } from '@/lib/education/habitDraft';
import { formatDay, summarizeHabitWeek, weekDayDate } from '@/lib/education/habitWeek';

export function HabitDraftOverview({ drafts, pillars, selected, onOpen }: {
  drafts: HabitDrafts;
  pillars: readonly { key: HabitPillar; label: string }[];
  selected: HabitPillar;
  onOpen: (pillar: HabitPillar) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <section aria-label="Pillar draft overview" className="hc-draft-overview">
      <button type="button" aria-expanded={expanded} aria-controls={id + '-content'} onClick={() => setExpanded(current => !current)}>
        {expanded ? 'Hide pillar drafts' : 'See all four pillar drafts'}
      </button>
      <div id={id + '-content'} hidden={!expanded}>
        {expanded && <>
          <h2>Your pillar drafts</h2>
          <p>These are the drafts currently on this page, including any starter ideas. Restore your saved plan to see that copy. Saving is manual.</p>
          <p>You can focus on one pillar; there is no need to complete all four. A day with a choice or a non-blank note counts as a check-in. Counts describe your records, not health outcomes.</p>
          <div className="hc-draft-overview-grid">
            {pillars.map(pillar => {
              const draft = drafts[pillar.key];
              const week = draft.week;
              return (
                <article key={pillar.key} aria-labelledby={id + '-' + pillar.key} className="hc-draft-overview-card">
                  <h3 id={id + '-' + pillar.key}>{pillar.label}</h3>
                  <p><strong>Next step draft:</strong></p>
                  <p className="hc-draft-overview-action">{draft.action.trim() || 'No action written yet.'}</p>
                  {week ? <>
                    <p><strong>Current week:</strong> <time dateTime={week.startDate}>{formatDay(week.startDate)}</time> to <time dateTime={weekDayDate(week.startDate, 6)}>{formatDay(weekDayDate(week.startDate, 6))}</time></p>
                    <p><strong>Action for this week:</strong></p>
                    <p className="hc-draft-overview-action">{week.action}</p>
                    <p><strong>Days with a check-in:</strong> {summarizeHabitWeek(week).recordedDays} of 7</p>
                  </> : <p>No dated week on this page.</p>}
                  <button type="button" aria-pressed={selected === pillar.key} onClick={() => onOpen(pillar.key)}>
                    Open {pillar.label.toLowerCase()} draft
                  </button>
                </article>
              );
            })}
          </div>
        </>}
      </div>
    </section>
  );
}
