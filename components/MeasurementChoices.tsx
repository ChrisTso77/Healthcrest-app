'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useMeasurementEnabled } from '@/components/MeasurementProvider';
import { parseMeasurementChoice } from '@/lib/privacy/measurement';
import { saveMeasurementChoice, useMeasurementSnapshot } from '@/lib/privacy/measurementChoice';

export function MeasurementNotice() {
  const enabled = useMeasurementEnabled();
  if (!enabled) return null;
  return <p className="hc-measurement-notice">Optional measurement is your choice. <Link href="/privacy" prefetch={false}>Choose your privacy settings</Link>.</p>;
}

export function MeasurementChoices() {
  const enabled = useMeasurementEnabled();
  const snapshot = useMeasurementSnapshot();
  const choice = parseMeasurementChoice(snapshot);
  const signal = snapshot === 'privacy-signal';
  const [status, setStatus] = useState('');

  function persist(analytics: boolean, performance: boolean) {
    const saved = saveMeasurementChoice(analytics, performance);
    if (!saved) {
      setStatus('Your browser could not save this choice. Optional measurement is off for this page.');
      return;
    }
    // A fresh document removes any previously loaded measurement script and
    // associated handlers, including when withdrawing only one category.
    window.location.reload();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    persist(enabled && !signal && data.has('analytics'), enabled && !signal && data.has('performance'));
  }

  return (
    <section aria-labelledby="measurement-choices-title" className="hc-privacy-choices">
      <h2 id="measurement-choices-title">Your measurement choices</h2>
      <p>Both options are off unless you choose them. You can use every Healthcrest tool without agreeing.</p>
      {!enabled && <p>Optional measurement is not active on this version of the website. You can still save a choice to keep it off.</p>}
      {signal && <p>Your browser requests no optional measurement. We respect that setting.</p>}
      <form key={snapshot} onSubmit={submit}>
        <label><input name="analytics" type="checkbox" defaultChecked={choice?.analytics ?? false} disabled={!enabled || signal} /><span><strong>Allow usage statistics</strong><span>Help us understand visits to public pages using Vercel Web Analytics.</span></span></label>
        <label><input name="performance" type="checkbox" defaultChecked={choice?.performance ?? false} disabled={!enabled || signal} /><span><strong>Allow performance measurement</strong><span>Help us understand page speed on real devices using Vercel Speed Insights.</span></span></label>
        <div className="hc-privacy-actions">
          <button type="submit" className="hc-button hc-button-primary">Save my choices</button>
          <button type="button" className="hc-button hc-privacy-secondary" onClick={() => persist(false, false)}>Keep optional measurement off</button>
        </div>
      </form>
      <p role="status">{status || (signal ? 'Optional measurement is off because of your browser setting.' : choice ? 'Saved on this browser: usage statistics ' + (choice.analytics ? 'allowed' : 'off') + '; performance measurement ' + (choice.performance ? 'allowed' : 'off') + '.' : 'No permission saved. Optional measurement is off.')}</p>
      <p>Permission expires after 180 days. Return here to change or withdraw it. Your saved habit drafts are separate and are not changed by these controls.</p>
      <noscript><style>{'.hc-privacy-choices form { display: none; }'}</style><p>These choices need JavaScript. With JavaScript disabled, optional measurement does not run.</p></noscript>
    </section>
  );
}
