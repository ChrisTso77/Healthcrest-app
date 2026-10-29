export const PERFORMANCE_BUDGET = Object.freeze({ score: 0.9, lcpMs: 2500, cls: 0.1, totalBlockingMs: 200 });
// Retain the original entry points for existing local tooling.
export const MOBILE_BUDGET = PERFORMANCE_BUDGET;
export const REQUIRED_ACCESSIBILITY_AUDITS = Object.freeze(['color-contrast', 'heading-order']);
export function assessMobileReport(report) {
  return assessPerformanceReport(report);
}

// Evaluate raw values: display rounding must never turn a failed budget into a pass.
export function assessPerformanceReport(report, { formFactor = 'mobile', url } = {}) {
  const failures = [];
  const metrics = { scores: {}, lcpMs: null, cls: null, totalBlockingMs: null };
  const analyticsRequests = [];
  if (report?.runtimeError) failures.push('Lighthouse reported a runtime error.');
  if (!['mobile', 'desktop'].includes(formFactor)) failures.push('Unsupported requested form factor.');
  if (report?.configSettings?.formFactor !== formFactor) failures.push('Report form factor does not match the requested profile.');
  if (report?.configSettings?.screenEmulation?.mobile !== (formFactor === 'mobile') || report?.configSettings?.screenEmulation?.disabled === true) {
    failures.push('Screen emulation does not match the requested profile.');
  }
  if (url !== undefined) {
    try {
      const expected = new URL(url).href;
      if (new URL(report?.requestedUrl).href !== expected || new URL(report?.finalDisplayedUrl ?? report?.finalUrl).href !== expected) {
        failures.push('Report address does not match the requested route and query.');
      }
    } catch { failures.push('Report route evidence is missing or invalid.'); }
  }
  // A high category score must not mask these confirmed Explorer regressions.
  for (const id of REQUIRED_ACCESSIBILITY_AUDITS) {
    const audit = report?.audits?.[id];
    if (!(audit?.score === 1 || (audit?.score === null && audit?.scoreDisplayMode === 'notApplicable'))) {
      failures.push('Required accessibility audit failed or is missing: ' + id);
    }
  }
  for (const name of ['performance', 'accessibility', 'best-practices', 'seo']) {
    const score = report?.categories?.[name]?.score;
    if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 1) {
      failures.push('Missing or invalid category score: ' + name);
    } else {
      metrics.scores[name] = score;
      if (score < PERFORMANCE_BUDGET.score) failures.push(name + ' score is below 90.');
    }
  }
  for (const [name, audit] of [
    ['lcpMs', 'largest-contentful-paint'], ['cls', 'cumulative-layout-shift'], ['totalBlockingMs', 'total-blocking-time'],
  ]) {
    const value = report?.audits?.[audit]?.numericValue;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || (name === 'lcpMs' && value === 0)) {
      failures.push('Missing or invalid metric: ' + audit);
    } else {
      metrics[name] = value;
      if (value > PERFORMANCE_BUDGET[name]) failures.push(audit + ' exceeds its lab budget.');
    }
  }
  const requests = report?.audits?.['network-requests']?.details?.items;
  if (!Array.isArray(requests)) {
    failures.push('Network-request evidence is missing.');
  } else {
    for (const request of requests) {
      try {
        const path = new URL(request.url).pathname;
        if (/^\/_vercel\/(?:insights|speed-insights)(?:\/|$)/.test(path) || path.startsWith('/.well-known/vercel/')) {
          analyticsRequests.push(path);
        }
      } catch { failures.push('Network-request evidence contains an invalid address.'); }
    }
  }
  if (analyticsRequests.length) failures.push('Optional measurement was requested without visitor permission.');
  return { passed: failures.length === 0, failures, metrics, analyticsRequests };
}
