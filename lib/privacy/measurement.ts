export const MEASUREMENT_CHOICE_KEY = 'healthcrest.measurement-choice.v1';
export const CHOICE_LIFETIME_MS = 180 * 24 * 60 * 60 * 1000;
export type MeasurementKind = 'analytics' | 'performance';
export type MeasurementChoice = { version: 1; analytics: boolean; performance: boolean; savedAt: number };
export type MeasurementContext = {
  enabled: boolean; choice: MeasurementChoice | null; privacySignal: boolean;
  origin: string; currentUrl: string; referrer: string;
};
const PUBLIC_PATHS = new Set(['/', '/learn', '/start', '/engine', '/about', '/contact', '/storage']);

export function deploymentAllowsMeasurement(flag: string | undefined, environment: string | undefined): boolean {
  return flag === 'true' && environment === 'production';
}

export function parseMeasurementChoice(raw: string | null, now = Date.now()): MeasurementChoice | null {
  if (!raw || raw.length > 300) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)
      || Object.keys(value).sort().join(',') !== 'analytics,performance,savedAt,version'
      || value.version !== 1 || typeof value.analytics !== 'boolean' || typeof value.performance !== 'boolean'
      || !Number.isFinite(value.savedAt) || value.savedAt < 0 || value.savedAt > now + 300_000
      || now >= value.savedAt + CHOICE_LIFETIME_MS) return null;
    return { version: 1, analytics: value.analytics, performance: value.performance, savedAt: value.savedAt };
  } catch { return null; }
}

export function safeMeasurementUrl(raw: string, origin: string): string | null {
  try {
    const url = new URL(raw, origin);
    const base = new URL(origin);
    if (!['https:', 'http:'].includes(url.protocol) || url.origin !== base.origin || url.username || url.password
      || !PUBLIC_PATHS.has(url.pathname)) return null;
    return base.origin + url.pathname;
  } catch { return null; }
}

export function safeMeasurementReferrer(raw: string, origin: string): boolean {
  if (!raw) return true;
  try {
    const url = new URL(raw);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) return false;
    return url.origin === new URL(origin).origin ? PUBLIC_PATHS.has(url.pathname) : url.pathname === '/';
  } catch { return false; }
}

export function canMeasure(kind: MeasurementKind, context: MeasurementContext): boolean {
  return context.enabled && !context.privacySignal && context.choice?.[kind] === true
    && parseMeasurementChoice(JSON.stringify(context.choice)) !== null
    && safeMeasurementUrl(context.currentUrl, context.origin) !== null
    && safeMeasurementReferrer(context.referrer, context.origin);
}

export function filterPageMeasurement(event: { type: string; url: string }, context: MeasurementContext) {
  if (event.type !== 'pageview' || !canMeasure('analytics', context)) return null;
  const url = safeMeasurementUrl(event.url, context.origin);
  return url ? { type: 'pageview' as const, url } : null;
}

export function filterPerformanceMeasurement(event: { type: string; url: string }, context: MeasurementContext) {
  if (event.type !== 'vital' || !canMeasure('performance', context)) return null;
  const url = safeMeasurementUrl(event.url, context.origin);
  return url ? { type: 'vital' as const, url, route: new URL(url).pathname } : null;
}
