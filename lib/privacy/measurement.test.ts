import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  CHOICE_LIFETIME_MS, deploymentAllowsMeasurement, parseMeasurementChoice, safeMeasurementUrl,
  safeMeasurementReferrer, filterPageMeasurement, filterPerformanceMeasurement, type MeasurementContext,
} from './measurement';

const now = Date.UTC(2026, 9, 28);
const origin = 'https://www.healthcrest.uk';
function context(overrides: Partial<MeasurementContext> = {}): MeasurementContext {
  return { enabled: true, choice: { version: 1, analytics: true, performance: true, savedAt: now },
    privacySignal: false, origin, currentUrl: origin + '/learn?pillar=stress&idea=access#private', referrer: '', ...overrides };
}
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(now); });
afterEach(() => vi.useRealTimers());

describe('optional measurement launch and permission boundaries', () => {
  test.each([
    [undefined, 'production'], ['false', 'production'], ['1', 'production'],
    ['true', undefined], ['true', 'preview'], ['true', 'development'],
  ])('stays off for flag %s and deployment %s', (flag, environment) => {
    expect(deploymentAllowsMeasurement(flag, environment)).toBe(false);
  });
  test('requires explicit production enablement', () => expect(deploymentAllowsMeasurement('true', 'production')).toBe(true));
  test.each([
    null, '', 'not-json', '[]',
    JSON.stringify({ version: 2, analytics: true, performance: true, savedAt: now }),
    JSON.stringify({ version: 1, analytics: 'yes', performance: true, savedAt: now }),
    JSON.stringify({ version: 1, analytics: true, performance: true, savedAt: now, note: 'private' }),
    JSON.stringify({ version: 1, analytics: true, performance: true, savedAt: now + 300_001 }),
    JSON.stringify({ version: 1, analytics: true, performance: true, savedAt: now - CHOICE_LIFETIME_MS }),
  ])('invalid or expired permission cannot enable collection: %s', raw => {
    expect(parseMeasurementChoice(raw)).toBeNull();
  });
  test('preserves independent choices within the permitted lifetime', () => {
    const value = { version: 1, analytics: false, performance: true, savedAt: now - CHOICE_LIFETIME_MS + 1 };
    expect(parseMeasurementChoice(JSON.stringify(value))).toEqual(value);
  });
});

describe('URL and private-page protection', () => {
  test.each(['/', '/learn', '/start', '/engine', '/about', '/contact', '/storage'])('only returns the canonical public path for %s', path => {
    expect(safeMeasurementUrl(origin + path + '?pillar=stress&note=secret#reflection', origin)).toBe(origin + path);
  });
  test.each(['/next-step', '/privacy', '/api/presets', '/studio', '/unknown', '/learn/private', 'https://elsewhere.example/learn', 'javascript:alert(1)', 'https://alice:secret@www.healthcrest.uk/learn'])('rejects excluded, unknown or foreign locations: %s', url => {
    expect(safeMeasurementUrl(url, origin)).toBeNull();
  });
  test.each([
    origin + '/next-step', origin + '/start?pillar=stress',
    'https://example.org/person/alice', 'https://example.org/?token=secret',
  ])('does not collect with a potentially sensitive referrer: %s', referrer => {
    expect(safeMeasurementReferrer(referrer, origin)).toBe(false);
  });
  test('accepts empty, public same-origin and origin-only external referrers', () => {
    expect(safeMeasurementReferrer('', origin)).toBe(true);
    expect(safeMeasurementReferrer(origin + '/about', origin)).toBe(true);
    expect(safeMeasurementReferrer('https://example.org/', origin)).toBe(true);
  });
});

describe('SDK send boundary', () => {
  const page = { type: 'pageview', url: origin + '/learn?health=secret#note', extra: 'PRIVATE-NOTE' };
  const vital = { type: 'vital', url: origin + '/engine?pillar=stress#private', route: '/private-person', extra: 'PRIVATE-NOTE' };
  test('rebuilds events from an allowlist instead of retaining arbitrary fields', () => {
    expect(filterPageMeasurement(page, context())).toEqual({ type: 'pageview', url: origin + '/learn' });
    expect(filterPerformanceMeasurement(vital, context())).toEqual({ type: 'vital', url: origin + '/engine', route: '/engine' });
  });
  test('rejects custom analytics events', () => {
    expect(filterPageMeasurement({ ...page, type: 'event' }, context())).toBeNull();
  });
  test.each([
    { enabled: false }, { choice: null }, { privacySignal: true },
    { currentUrl: origin + '/next-step' }, { referrer: origin + '/start?pillar=stress' },
    { choice: { version: 1 as const, analytics: false, performance: false, savedAt: now } },
    { choice: { version: 1 as const, analytics: true, performance: true, savedAt: now - CHOICE_LIFETIME_MS } },
  ])('rechecks permission and context for every later event: %j', overrides => {
    expect(filterPageMeasurement(page, context(overrides))).toBeNull();
    expect(filterPerformanceMeasurement(vital, context(overrides))).toBeNull();
  });
  test('does not transfer permission from one measurement category to the other', () => {
    const c = context({ choice: { version: 1, analytics: false, performance: true, savedAt: now } });
    expect(filterPageMeasurement(page, c)).toBeNull();
    expect(filterPerformanceMeasurement(vital, c)).not.toBeNull();
  });
});
