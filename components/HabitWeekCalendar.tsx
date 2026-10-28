'use client';

import { useId, useState, type FormEvent } from 'react';
import { habitCheckInCalendar, isReminderTime } from '@/lib/education/habitCalendar';
import { formatDay, weekDayDate } from '@/lib/education/habitWeek';

export function HabitWeekCalendar({ startDate }: { startDate: string }) {
  const id = useId();
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  function download(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let url: string | undefined;
    let link: HTMLAnchorElement | undefined;
    try {
      const calendar = habitCheckInCalendar(startDate, time, new Date());
      url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
      link = document.createElement('a');
      link.href = url;
      link.download = 'healthcrest-check-ins.ics';
      document.body.appendChild(link);
      link.click();
      setMessage('Calendar download started. Import the file in your calendar app and review the entries and alerts.');
    } catch {
      setMessage('Calendar download is unavailable. Your plan is unchanged; you can set a reminder in your calendar yourself.');
    } finally {
      link?.remove();
      if (url) {
        const downloadUrl = url;
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      }
    }
  }
  return (
    <section aria-labelledby={id + '-title'} className="hc-week-calendar">
      <h4 id={id + '-title'}>Calendar check-ins (optional)</h4>
      <p>Download seven generic check-in reminders for this week’s dates. Import the file into a calendar app to use them; downloading it does not activate reminders.</p>
      <p><strong>{formatDay(startDate)} to {formatDay(weekDayDate(startDate, 6))}</strong></p>
      <form onSubmit={download}>
        <label htmlFor={id + '-time'}>Check-in time</label>
        <p id={id + '-time-help'}>Choose a local time. Your calendar app decides how local times and alerts are handled; review its dates, time zone and alert settings before importing.</p>
        <input id={id + '-time'} type="time" step={60} required value={time} aria-describedby={id + '-time-help'}
          onChange={event => { setTime(event.target.value); setMessage(''); }} />
        <p>The file contains the dates, chosen time, “Habit check-in” title and a link to Return to your plan. It leaves out your pillar, action, check-ins and notes. You still choose Restore my plan when you return.</p>
        <p>If you import it, your calendar provider may store or sync those entries. They do not update when you edit or clear a Healthcrest plan. Manage old entries in your calendar; importing again may create duplicates.</p>
        <button type="submit" disabled={!isReminderTime(time)}>Download calendar reminders</button>
      </form>
      <p aria-live="polite">{message}</p>
    </section>
  );
}
