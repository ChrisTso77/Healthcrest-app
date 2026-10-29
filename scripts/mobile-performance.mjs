import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';
import { assessMobileReport, MOBILE_BUDGET } from './performance-budget.mjs';

const output = 'artifacts/mobile-performance';
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3001'], {
  stdio: 'inherit', env: process.env,
});
let serverExited = false;
server.on('exit', () => { serverExited = true; });

function runAudit(url, name) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', [
      '--yes', 'lighthouse@13.6.0', url,
      '--output=json', '--output=html', '--output-path=' + output + '/' + name,
      '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
      '--form-factor=mobile', '--no-enable-error-reporting',
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
  const summaries = [];
  for (const [name, path] of [['home', '/'], ['start', '/start']]) {
    await runAudit('http://127.0.0.1:3001' + path, name);
    const report = JSON.parse(await readFile(output + '/' + name + '.report.json', 'utf8'));
    const assessment = assessMobileReport(report);
    const summary = {
      page: name, lighthouseVersion: report?.lighthouseVersion,
      formFactor: report?.configSettings?.formFactor,
      scores: Object.fromEntries(Object.entries(assessment.metrics.scores).map(([key, value]) => [key, value * 100])),
      lcpMs: assessment.metrics.lcpMs, cls: assessment.metrics.cls,
      totalBlockingMs: assessment.metrics.totalBlockingMs,
      analyticsRequests: assessment.analyticsRequests,
      passed: assessment.passed, failures: assessment.failures,
    };
    summaries.push(summary);
    console.log('LIGHTHOUSE_MOBILE ' + JSON.stringify(summary));
  }
  await writeFile(output + '/summary.json', JSON.stringify({
    scope: 'Single-run mobile Lighthouse lab audit of the production build on a GitHub runner. Not PageSpeed Insights field data or evidence of deployed Vercel dashboard settings.',
    budget: MOBILE_BUDGET, passed: summaries.every(summary => summary.passed), summaries,
  }, null, 2));
  if (summaries.some(summary => !summary.passed)) throw new Error('Mobile lab budgets failed. Review artifacts/mobile-performance/summary.json and the Lighthouse reports.');
} finally {
  server.kill('SIGTERM');
}
