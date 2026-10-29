import test from 'node:test';
import assert from 'node:assert/strict';
import { assessMobileReport } from './performance-budget.mjs';

function fixture() {
  return {
    configSettings: { formFactor: 'mobile' },
    categories: Object.fromEntries(['performance', 'accessibility', 'best-practices', 'seo'].map(name => [name, { score: 0.9 }])),
    audits: {
      'largest-contentful-paint': { numericValue: 2500 },
      'cumulative-layout-shift': { numericValue: 0.1 },
      'total-blocking-time': { numericValue: 200 },
      'network-requests': { details: { items: [{ url: 'http://127.0.0.1:3001/_next/static/app.js' }] } },
    },
  };
}
test('accepts exact thresholds without claiming to measure INP', () => {
  const result = assessMobileReport(fixture());
  assert.equal(result.passed, true);
  assert.equal('inpMs' in result.metrics, false);
});
for (const name of ['performance', 'accessibility', 'best-practices', 'seo']) {
  test('rejects a below-budget ' + name + ' score even when it rounds to 90', () => {
    const report = fixture(); report.categories[name].score = 0.8999;
    assert.equal(assessMobileReport(report).passed, false);
  });
}
for (const [audit, value] of [['largest-contentful-paint', 2500.01], ['cumulative-layout-shift', 0.10001], ['total-blocking-time', 200.01]]) {
  test('rejects raw over-budget ' + audit, () => {
    const report = fixture(); report.audits[audit].numericValue = value;
    assert.equal(assessMobileReport(report).passed, false);
  });
}
for (const value of [undefined, null, NaN, Infinity, -1, '90']) {
  test('rejects invalid scores and metrics: ' + String(value), () => {
    const score = fixture(); score.categories.performance.score = value;
    assert.equal(assessMobileReport(score).passed, false);
    const metric = fixture(); metric.audits['largest-contentful-paint'].numericValue = value;
    assert.equal(assessMobileReport(metric).passed, false);
  });
}
test('rejects a category score above the valid range', () => {
  const report = fixture(); report.categories.performance.score = 90;
  assert.equal(assessMobileReport(report).passed, false);
});
test('rejects absent, runtime-failed, desktop and incomplete reports', () => {
  assert.equal(assessMobileReport(undefined).passed, false);
  const failed = fixture(); failed.runtimeError = { code: 'NO_FCP' };
  assert.equal(assessMobileReport(failed).passed, false);
  const desktop = fixture(); desktop.configSettings.formFactor = 'desktop';
  assert.equal(assessMobileReport(desktop).passed, false);
  const missing = fixture(); delete missing.audits['network-requests'];
  assert.equal(assessMobileReport(missing).passed, false);
});
for (const path of ['/_vercel/insights/script.js', '/_vercel/speed-insights/vitals', '/.well-known/vercel/insights/script.js']) {
  test('rejects unpermitted measurement and retains only its pathname: ' + path, () => {
    const report = fixture(); report.audits['network-requests'].details.items.push({ url: 'https://example.test' + path + '?private=example' });
    const result = assessMobileReport(report);
    assert.equal(result.passed, false);
    assert.deepEqual(result.analyticsRequests, [path]);
  });
}
test('rejects malformed network evidence', () => {
  const report = fixture(); report.audits['network-requests'].details.items = [{ url: 'invalid address' }];
  assert.equal(assessMobileReport(report).passed, false);
});
