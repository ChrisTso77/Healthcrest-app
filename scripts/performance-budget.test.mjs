import test from 'node:test';
import assert from 'node:assert/strict';
import { assessMobileReport, assessPerformanceReport } from './performance-budget.mjs';
import { PERFORMANCE_PROFILES, lighthouseProfileArgs } from './performance-profiles.mjs';

function fixture() {
  return {
    requestedUrl: 'http://127.0.0.1:3001/', finalDisplayedUrl: 'http://127.0.0.1:3001/',
    configSettings: { formFactor: 'mobile', screenEmulation: { mobile: true, disabled: false } },
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
test('rejects a zero LCP while preserving valid zero CLS and blocking time', () => {
  const report = fixture(); report.audits['cumulative-layout-shift'].numericValue = 0;
  report.audits['total-blocking-time'].numericValue = 0;
  assert.equal(assessMobileReport(report).passed, true);
  report.audits['largest-contentful-paint'].numericValue = 0;
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
test('desktop uses the complete preset and passes only with matching emulation', () => {
  assert.deepEqual(lighthouseProfileArgs('desktop'), ['--preset=desktop']);
  const report = fixture(); report.configSettings.formFactor = 'desktop';
  assert.equal(assessPerformanceReport(report, { formFactor: 'desktop' }).passed, false);
  report.configSettings.screenEmulation.mobile = false;
  assert.equal(assessPerformanceReport(report, { formFactor: 'desktop' }).passed, true);
  assert.equal(assessMobileReport(report).passed, false);
});
test('mobile preserves its configuration and rejects disabled/missing emulation', () => {
  assert.deepEqual(lighthouseProfileArgs('mobile'), ['--form-factor=mobile']);
  const report = fixture(); report.configSettings.screenEmulation.disabled = true;
  assert.equal(assessMobileReport(report).passed, false);
  delete report.configSettings.screenEmulation;
  assert.equal(assessMobileReport(report).passed, false);
});
test('unknown form factors cannot fall through to desktop or bypass assessment', () => {
  assert.throws(() => lighthouseProfileArgs('tablet'));
  assert.equal(assessPerformanceReport(fixture(), { formFactor: 'tablet' }).passed, false);
});
test('route evidence must match origin, pathname and the requested public query', () => {
  const url = 'http://127.0.0.1:3001/engine?pillar=sleep&view=2d';
  const report = fixture(); report.requestedUrl = report.finalDisplayedUrl = url;
  assert.equal(assessPerformanceReport(report, { url }).passed, true);
  for (const actual of ['http://127.0.0.1:3001/', 'https://other.test/engine?pillar=sleep&view=2d', 'http://127.0.0.1:3001/engine?pillar=sleep']) {
    report.finalDisplayedUrl = actual;
    assert.equal(assessPerformanceReport(report, { url }).passed, false);
  }
});
test('missing and malformed route evidence cannot count as a measured profile', () => {
  const url = 'http://127.0.0.1:3001/';
  const report = fixture(); delete report.requestedUrl;
  assert.equal(assessPerformanceReport(report, { url }).passed, false);
  report.requestedUrl = url; report.finalDisplayedUrl = 'invalid';
  assert.equal(assessPerformanceReport(report, { url }).passed, false);
  assert.equal(assessPerformanceReport(fixture(), { url: 'invalid' }).passed, false);
});
test('supports Lighthouse finalUrl evidence without silently accepting a redirect', () => {
  const report = fixture(); delete report.finalDisplayedUrl; report.finalUrl = report.requestedUrl;
  assert.equal(assessPerformanceReport(report, { url: report.requestedUrl }).passed, true);
  report.finalUrl = 'http://127.0.0.1:3001/contact';
  assert.equal(assessPerformanceReport(report, { url: report.requestedUrl }).passed, false);
});
test('every profile audits a fixed public route without notes, storage permissions or external origins', () => {
  assert.equal(new Set(PERFORMANCE_PROFILES.map(profile => profile.name)).size, PERFORMANCE_PROFILES.length);
  for (const profile of PERFORMANCE_PROFILES) {
    const url = new URL(profile.path, 'http://127.0.0.1:3001');
    assert.equal(url.origin, 'http://127.0.0.1:3001');
    assert.equal(url.hash, '');
    assert.ok(['/', '/start', '/learn/balanced-meals', '/next-step', '/engine'].includes(url.pathname));
    assert.ok([...url.searchParams.keys()].every(key => ['pillar', 'view'].includes(key)));
    if (url.pathname === '/engine') assert.equal(url.searchParams.get('view'), '2d');
    assert.ok(['mobile', 'desktop'].includes(profile.formFactor));
  }
  for (const path of ['/learn/balanced-meals', '/next-step?pillar=sleep', '/engine?pillar=sleep&view=2d']) {
    assert.deepEqual(PERFORMANCE_PROFILES.filter(profile => profile.path === path).map(profile => profile.formFactor).sort(), ['desktop', 'mobile']);
  }
});
