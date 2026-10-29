import { isWeekStart, weekDayDate } from './habitWeek';
import { SITE_URL } from '@/lib/siteMetadata';

export function isReminderTime(value: string): boolean {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

// Every generated line is ASCII: only validated dates/times and fixed copy enter this file.
// RFC 5545 folds content lines after at most 75 octets, with a space on continuation lines.
function foldLine(value: string): string {
  let folded = value.slice(0, 75);
  for (let index = 75; index < value.length; index += 74) folded += '\r\n ' + value.slice(index, index + 74);
  return folded;
}

// Floating local times deliberately have neither a UTC suffix nor a TZID.
// Calendar applications interpret these in their local time settings.
export function habitCheckInCalendar(startDate: string, time: string, generatedAt: Date): string {
  if (!isWeekStart(startDate) || !isReminderTime(time) || !Number.isFinite(generatedAt.getTime())
    || generatedAt.getUTCFullYear() < 1900 || generatedAt.getUTCFullYear() > 9999) throw new Error('Invalid calendar options');
  const stamp = generatedAt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const start = startDate.replace(/-/g, '');
  const clock = time.replace(':', '') + '00';
  const returnUrl = SITE_URL + '/next-step#return-to-plan';
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Healthcrest//Seven-day check-ins//EN', 'CALSCALE:GREGORIAN',
    ...Array.from({ length: 7 }, (_, index) => {
      const date = weekDayDate(startDate, index).replace(/-/g, '');
      return [
        'BEGIN:VEVENT',
        'UID:healthcrest-checkin-' + start + '-' + clock + '-' + index + '@healthcrest.uk',
        'DTSTAMP:' + stamp,
        'DTSTART:' + date + 'T' + clock,
        'SUMMARY:Habit check-in',
        'DESCRIPTION:Return to Healthcrest to restore your saved plan and record an optional check-in. Your habit actions and notes are not included in this event. ' + returnUrl,
        'URL:' + returnUrl,
        'TRANSP:TRANSPARENT',
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:PT0M', 'DESCRIPTION:Habit check-in', 'END:VALARM',
        'END:VEVENT',
      ];
    }).flat(),
    'END:VCALENDAR',
  ];
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
