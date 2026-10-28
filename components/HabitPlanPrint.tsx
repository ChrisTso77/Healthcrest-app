import type { HabitDraft } from '@/lib/education/habitDraft';
import { DAY_CHOICES, formatDay, weekDayDate } from '@/lib/education/habitWeek';
import { SITE_URL } from '@/lib/siteMetadata';

export function HabitPlanPrint({ label, draft }: { label: string; draft: HabitDraft }) {
  const week = draft.week;
  const days = week?.days ?? Array.from({ length: 7 }, () => ({ choice: '' as const, note: '' }));
  return (
    <section className="hc-plan-print" aria-label="Printable habit plan">
      <h1>Healthcrest — My habit plan</h1>
      <p><strong>Pillar: {label}</strong></p>
      <p>Current page copy for this pillar only. Printing does not save or update the browser copy.</p>
      <section className="hc-print-block">
        <h2>My next step draft</h2>
        <p><strong>One manageable action:</strong></p>
        <p className="hc-print-writing">{draft.action.trim() || 'Choose an action: ______________________________'}</p>
        <p><strong>When I will try it:</strong> <span className="hc-print-writing">{draft.cue.trim() || '______________________________'}</span></p>
        <p><strong>What could make it easier:</strong> <span className="hc-print-writing">{draft.support.trim() || '______________________________'}</span></p>
        <p><strong>Extra reflection notes:</strong></p>
        <p className="hc-print-writing hc-print-note">{draft.reflection.trim() || 'What helped? What would I adjust? ______________________________'}</p>
      </section>
      <section className="hc-print-block">
        <h2>{week ? 'My current seven-day plan' : 'Seven-day paper check-ins'}</h2>
        {week ? <>
          <p><strong>{formatDay(week.startDate)} to {formatDay(weekDayDate(week.startDate, 6))}</strong></p>
          <p><strong>Action for this week:</strong> <span className="hc-print-writing">{week.action}</span></p>
          <p><strong>When:</strong> <span className="hc-print-writing">{week.cue.trim() || '______________________________'}</span></p>
          <p><strong>What could help:</strong> <span className="hc-print-writing">{week.support.trim() || '______________________________'}</span></p>
          <p>This action belongs to the current week and can differ from the draft above.</p>
        </> : <p>No dated week has been started on this page. Use your draft action above and write a start date: __________________.</p>}
        <p>For each day, you can write: {DAY_CHOICES.filter(choice => choice.value !== '').map(choice => choice.label).join(' · ')}. Leave a day blank if you choose.</p>
      </section>
      <ol className="hc-print-days" aria-label="Paper daily check-ins">
        {days.map((day, index) => <li key={index}>
          <h3>Day {index + 1}{week ? ' · ' + formatDay(weekDayDate(week.startDate, index)) : ''}</h3>
          <p><strong>What happened:</strong> {week ? DAY_CHOICES.find(choice => choice.value === day.choice)!.label : '______________________________'}</p>
          <p><strong>Note:</strong> <span className="hc-print-writing">{day.note.trim() || '______________________________'}</span></p>
        </li>)}
      </ol>
      <section className="hc-print-block">
        <h2>Review my week</h2>
        <p>What helped? What got in the way? What would I adjust?</p>
        <p className="hc-print-writing hc-print-note">{week?.review.trim() || '____________________________________________________________'}</p>
        <p><strong>An action I might try next:</strong></p>
        <p className="hc-print-writing hc-print-note">{week?.nextAction.trim() || '____________________________________________________________'}</p>
      </section>
      <section className="hc-print-block hc-print-guidance">
        <h2>Keep it manageable</h2>
        <p>Seven days is a planning window. Changes in health and the time needed to form a habit vary. These check-ins are not a health score.</p>
        <p>General educational information for adults. Adapt your chosen action to your health, ability and circumstances alongside appropriate clinical care.</p>
        <p>Evidence and practical guides: <a href={SITE_URL + '/learn'}>{SITE_URL + '/learn'}</a></p>
        <p>Paper notes do not sync to Healthcrest. Keep this copy somewhere suitable for any personal information you include.</p>
      </section>
    </section>
  );
}
