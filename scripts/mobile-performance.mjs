import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';
import { assessPerformanceReport, PERFORMANCE_BUDGET } from './performance-budget.mjs';
import { PERFORMANCE_PROFILES, lighthouseProfileArgs } from './performance-profiles.mjs';

const output = 'artifacts/mobile-performance';
// Keep the historical report location; summaries identify each route and form factor.
const summaries = [];
let auditError;
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3001'], {
  stdio: 'inherit', env: process.env,
});
let serverExited = false;
server.on('exit', () => { serverExited = true; });
server.on('error', () => { serverExited = true; });

function runAudit(url, name, formFactor) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', [
      '--yes', 'lighthouse@13.6.0', url,
      '--output=json', '--output=html', '--output-path=' + output + '/' + name,
      '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
      ...lighthouseProfileArgs(formFactor), '--no-enable-error-reporting',
    ], { stdio: 'inherit', env: { ...process.env, CHROME_PATH: chromium.executablePath() } });
    const timer = setTimeout(() => { child.kill('SIGTERM'); reject(new Error('Lighthouse audit timed out: ' + name)); }, 180_000);
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('exit', code => { clearTimeout(timer); if (code === 0) resolve(); else reject(new Error('Lighthouse failed for ' + name + ': ' + code)); });
  });
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (serverExited) throw new Error('Performance server exited before it was ready');
    try {
      if ((await fetch('http://127.0.0.1:3001/', { signal: AbortSignal.timeout(1000) })).ok) { ready = true; break; }
    } catch { /* Retry while the production server starts. */ }
    await delay(250);
  }
  if (!ready) throw new Error('Performance server did not become ready');
  for (const { name, path, formFactor } of PERFORMANCE_PROFILES) {
    const url = 'http://127.0.0.1:3001' + path;
    await runAudit(url, name, formFactor);
    const report = JSON.parse(await readFile(output + '/' + name + '.report.json', 'utf8'));
    const assessment = assessPerformanceReport(report, { formFactor, url });
    const summary = {
      page: name, path, expectedFormFactor: formFactor, lighthouseVersion: report?.lighthouseVersion,
      formFactor: report?.configSettings?.formFactor,
      screenEmulation: report?.configSettings?.screenEmulation,
      throttlingMethod: report?.configSettings?.throttlingMethod,
      scores: Object.fromEntries(Object.entries(assessment.metrics.scores).map(([key, value]) => [key, value * 100])),
      lcpMs: assessment.metrics.lcpMs, cls: assessment.metrics.cls,
      totalBlockingMs: assessment.metrics.totalBlockingMs,
      analyticsRequests: assessment.analyticsRequests,
      passed: assessment.passed, failures: assessment.failures,
    };
    summaries.push(summary);
    console.log((formFactor === 'mobile' ? 'LIGHTHOUSE_MOBILE ' : 'LIGHTHOUSE_DESKTOP ') + JSON.stringify(summary));
  }
  if (summaries.some(summary => !summary.passed)) throw new Error('Performance lab budgets failed. Review artifacts/mobile-performance/summary.json and the Lighthouse reports.');
} catch (error) {
  auditError = error;
  throw error;
} finally {
  try {
    await writeFile(output + '/summary.json', JSON.stringify({
      scope: 'Single-run Lighthouse navigation lab profiles of the production build on a GitHub runner: five mobile and three desktop. Explorer profiles explicitly use 2D; not evidence of 3D/GPU, real devices, interaction INP, field percentiles or deployed provider settings.',
      budget: PERFORMANCE_BUDGET, expectedProfiles: PERFORMANCE_PROFILES.length,
      completedProfiles: summaries.length,
      passed: !auditError && summaries.length === PERFORMANCE_PROFILES.length && summaries.every(summary => summary.passed),
      error: auditError?.message, summaries,
    }, null, 2));
  } finally { server.kill('SIGTERM'); }
}
