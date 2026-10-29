export const MOBILE_BUDGET = Object.freeze({ score: 0.9, lcpMs: 2500, cls: 0.1, totalBlockingMs: 200 });

// Evaluate raw values: display rounding must never turn a failed budget into a pass.
export function assessMobileReport(report) {
  const failures = [];
  const metrics = { scores: {}, lcpMs: null, cls: null, totalBlockingMs: null };
  const analyticsRequests = [];
  if (report?.runtimeError) failures.push('Lighthouse reported a runtime error.');
  if (report?.configSettings?.formFactor !== 'mobile') failures.push('A mobile Lighthouse report is required.');
  for (const name of ['performance', 'accessibility', 'best-practices', 'seo']) {
    const score = report?.categories?.[name]?.score;
    if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 1) {
      failures.push('Missing or invalid category score: ' + name);
    } else {
      metrics.scores[name] = score;
      if (score < MOBILE_BUDGET.score) failures.push(name + ' score is below 90.');
    }
  }
  for (const [name, audit] of [
    ['lcpMs', 'largest-contentful-paint'], ['cls', 'cumulative-layout-shift'], ['totalBlockingMs', 'total-blocking-time'],
  ]) {
    const value = report?.audits?.[audit]?.numericValue;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      failures.push('Missing or invalid metric: ' + audit);
    } else {
      metrics[name] = value;
      if (value > MOBILE_BUDGET[name]) failures.push(audit + ' exceeds its lab budget.');
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
