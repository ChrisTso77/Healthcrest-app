'use client';

import { useSyncExternalStore } from 'react';
import { MEASUREMENT_CHOICE_KEY, parseMeasurementChoice, type MeasurementChoice } from './measurement';

const CHOICE_EVENT = 'healthcrest:measurement-choice';
let failClosedOverride: string | null = null;

export function browserRequestsPrivacy(): boolean {
  if (typeof navigator === 'undefined') return false;
  const browser = navigator as Navigator & { globalPrivacyControl?: boolean };
  return browser.globalPrivacyControl === true || browser.doNotTrack === '1';
}

export function measurementSnapshot(): string {
  if (typeof window === 'undefined') return '';
  if (browserRequestsPrivacy()) return 'privacy-signal';
  if (failClosedOverride !== null) return failClosedOverride;
  try {
    const raw = window.localStorage.getItem(MEASUREMENT_CHOICE_KEY);
    return parseMeasurementChoice(raw) ? raw! : '';
  } catch { return ''; }
}

function subscribe(notify: () => void) {
  const changed = () => { notify(); };
  window.addEventListener('storage', changed);
  window.addEventListener(CHOICE_EVENT, changed);
  const timer = window.setInterval(changed, 60_000);
  return () => {
    window.removeEventListener('storage', changed);
    window.removeEventListener(CHOICE_EVENT, changed);
    window.clearInterval(timer);
  };
}
const serverSnapshot = () => '';
export function useMeasurementSnapshot() {
  return useSyncExternalStore(subscribe, measurementSnapshot, serverSnapshot);
}

export function saveMeasurementChoice(analytics: boolean, performance: boolean): boolean {
  const choice: MeasurementChoice = { version: 1, analytics, performance, savedAt: Date.now() };
  try {
    window.localStorage.setItem(MEASUREMENT_CHOICE_KEY, JSON.stringify(choice));
    failClosedOverride = null;
    window.dispatchEvent(new Event(CHOICE_EVENT));
    return true;
  } catch {
    // A failed permission write must never enable measurement. Revocation also
    // takes effect in this document even when browser storage is blocked.
    failClosedOverride = JSON.stringify({ ...choice, analytics: false, performance: false });
    try { window.localStorage.removeItem(MEASUREMENT_CHOICE_KEY); } catch { /* Keep this document denied if storage also blocks removal. */ }
    window.dispatchEvent(new Event(CHOICE_EVENT));
    return false;
  }
}
