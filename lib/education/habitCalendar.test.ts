import { describe, expect, test } from 'vitest';
import { habitCheckInCalendar, isReminderTime } from './habitCalendar';

const stamp = new Date('2026-10-28T10:15:30.123Z');
const unfold = (value: string) => value.replace(/\r\n /g, '');

describe('finite generic calendar check-ins', () => {
  test('creates seven local-time events with UTC creation stamps and display alarms', () => {
    const text = unfold(habitCheckInCalendar('2026-10-28', '18:30', stamp));
    expect(text.match(/^BEGIN:VEVENT$/gm)).toHaveLength(7);
    expect(text.match(/^END:VEVENT$/gm)).toHaveLength(7);
    expect(text.match(/^BEGIN:VALARM$/gm)).toHaveLength(7);
    expect(text.match(/^TRIGGER:PT0M$/gm)).toHaveLength(7);
    expect(text.match(/^SUMMARY:Habit check-in$/gm)).toHaveLength(7);
    expect(text.match(/^DTSTAMP:20261028T101530Z$/gm)).toHaveLength(7);
    expect(text).toContain('DTSTART:20261028T183000\r\n');
    expect(text).toContain('DTSTART:20261103T183000\r\n');
    expect(text).not.toMatch(/TZID|RRULE|ATTENDEE|ORGANIZER|METHOD:REQUEST/);
    expect(text.match(/^DTSTART:[^\r\n]+/gm)?.every(line => !line.endsWith('Z'))).toBe(true);
  });
  test('uses CRLF and byte-bounded folding without changing descriptions when unfolded', () => {
    const text = habitCheckInCalendar('2026-10-28', '09:00', stamp);
    expect(text.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true);
    expect(text.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(text.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/);
    for (const line of text.split('\r\n')) expect(Buffer.byteLength(line, 'utf8')).toBeLessThanOrEqual(75);
    expect(text).toContain('\r\n ');
    expect(unfold(text)).toContain('record an optional check-in. Your habit actions and notes are not included in this event. https://www.healthcrest.uk/next-step#return-to-plan');
  });
  test('keeps identifiers stable for repeated downloads while changing them for a different week or time', () => {
    const ids = (date: string, time: string, generated = stamp) => unfold(habitCheckInCalendar(date, time, generated)).match(/^UID:[^\r\n]+/gm)!;
    const original = ids('2026-10-28', '09:00');
    expect(new Set(original).size).toBe(7);
    expect(ids('2026-10-28', '09:00', new Date('2026-10-29T10:15:30Z'))).toEqual(original);
    expect(ids('2026-11-04', '09:00')).not.toEqual(original);
    expect(ids('2026-10-28', '10:00')).not.toEqual(original);
  });
  test('uses only fixed generic content and the public restore URL', () => {
    const text = unfold(habitCheckInCalendar('2026-10-28', '09:00', stamp));
    expect(text.match(/^URL:https:\/\/www.healthcrest.uk\/next-step#return-to-plan$/gm)).toHaveLength(7);
    expect(text).not.toMatch(/\?pillar=|\?idea=|Fitness|Nutrition|Sleep|Stress|LOCATION:|mailto:|javascript:/);
    expect(text).not.toContain('DESCRIPTION:Read');
    expect(text.match(/^TRANSP:TRANSPARENT$/gm)).toHaveLength(7);
  });
  test('handles leap days and year boundaries as calendar dates rather than elapsed local hours', () => {
    const leap = unfold(habitCheckInCalendar('2028-02-27', '01:30', stamp));
    expect(leap).toContain('DTSTART:20280229T013000');
    expect(leap).toContain('DTSTART:20280304T013000');
    const year = unfold(habitCheckInCalendar('2026-12-29', '00:00', stamp));
    expect(year).toContain('DTSTART:20270104T000000');
    const upper = unfold(habitCheckInCalendar('9999-12-25', '23:59', stamp));
    expect(upper).toContain('DTSTART:99991231T235900');
  });
  test('does not shift local reminder times across daylight-saving dates', () => {
    const text = unfold(habitCheckInCalendar('2027-03-26', '01:30', stamp));
    const starts = text.match(/^DTSTART:[^\r\n]+/gm)!;
    expect(starts).toHaveLength(7);
    expect(starts.every(line => line.endsWith('T013000'))).toBe(true);
    expect(text).toContain('DTSTART:20270328T013000');
  });
  test('rejects invalid dates and unsupported time syntax before generating a file', () => {
    for (const date of ['2026-02-29', '2026-13-01', '1899-12-31', '9999-12-26', '2026-10-28\r\nATTENDEE:bad']) {
      expect(() => habitCheckInCalendar(date, '09:00', stamp)).toThrow('Invalid calendar options');
    }
    for (const time of ['', '9:00', '24:00', '12:60', '12:30:00', '12:30Z', '12:30\r\nATTENDEE:bad']) {
      expect(isReminderTime(time)).toBe(false);
      expect(() => habitCheckInCalendar('2026-10-28', time, stamp)).toThrow('Invalid calendar options');
    }
    expect(isReminderTime('00:00')).toBe(true);
    expect(isReminderTime('23:59')).toBe(true);
  });
  test('rejects invalid or unrepresentable creation stamps without mutating the supplied date', () => {
    for (const date of [new Date('invalid'), new Date('1899-12-31T23:59:59Z'), new Date('+010000-01-01T00:00:00Z')]) {
      expect(() => habitCheckInCalendar('2026-10-28', '09:00', date)).toThrow('Invalid calendar options');
    }
    const before = stamp.toISOString();
    habitCheckInCalendar('2026-10-28', '09:00', stamp);
    expect(stamp.toISOString()).toBe(before);
  });
});
