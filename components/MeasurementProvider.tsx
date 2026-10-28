'use client';

import { createContext, useCallback, useContext, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { canMeasure, filterPageMeasurement, filterPerformanceMeasurement, parseMeasurementChoice, type MeasurementContext } from '@/lib/privacy/measurement';
import { browserRequestsPrivacy, measurementSnapshot, useMeasurementSnapshot } from '@/lib/privacy/measurementChoice';

const MeasurementEnabled = createContext(false);
export const useMeasurementEnabled = () => useContext(MeasurementEnabled);

function currentContext(enabled: boolean): MeasurementContext {
  return {
    enabled, choice: parseMeasurementChoice(measurementSnapshot()), privacySignal: browserRequestsPrivacy(),
    origin: window.location.origin, currentUrl: window.location.href, referrer: document.referrer,
  };
}

function OptionalMeasurement({ enabled }: { enabled: boolean }) {
  const snapshot = useMeasurementSnapshot();
  const pathname = usePathname();
  const pageFilter = useCallback((event: { type: string; url: string }) => filterPageMeasurement(event, currentContext(enabled)), [enabled]);
  const performanceFilter = useCallback((event: { type: string; url: string }) => filterPerformanceMeasurement(event, currentContext(enabled)), [enabled]);
  if (!enabled || !pathname || !parseMeasurementChoice(snapshot) || typeof window === 'undefined') return null;
  const context = currentContext(enabled);
  // Both mounting and every later send are checked, including after withdrawal,
  // route changes, permission expiry and storage failures.
  return (
    <>
      {canMeasure('analytics', context) && <Analytics beforeSend={pageFilter} />}
      {canMeasure('performance', context) && <SpeedInsights beforeSend={performanceFilter} />}
    </>
  );
}

export function MeasurementProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  return (
    <MeasurementEnabled.Provider value={enabled}>
      {children}
      <OptionalMeasurement enabled={enabled} />
    </MeasurementEnabled.Provider>
  );
}
