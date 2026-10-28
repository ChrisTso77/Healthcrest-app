import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';

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
    child.on('exit', code => { clearTimeout(timer); code === 0 ? resolve() : reject(new Error('Lighthouse failed for ' + name + ': ' + code)); });
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
    if (report.runtimeError) throw new Error('Lighthouse runtime error: ' + report.runtimeError.message);
    const requests = report.audits['network-requests']?.details?.items ?? [];
    const summary = {
      page: name, lighthouseVersion: report.lighthouseVersion,
      formFactor: report.configSettings.formFactor,
      scores: Object.fromEntries(Object.entries(report.categories).map(([key, value]) => [key, Math.round(value.score * 100)])),
      lcpMs: Math.round(report.audits['largest-contentful-paint'].numericValue),
      cls: report.audits['cumulative-layout-shift'].numericValue,
      totalBlockingMs: Math.round(report.audits['total-blocking-time'].numericValue),
      analyticsRequests: requests.filter(item => /\/_vercel\/(?:insights|speed-insights)\//.test(item.url)).map(item => item.url),
    };
    summaries.push(summary);
    console.log('LIGHTHOUSE_MOBILE ' + JSON.stringify(summary));
  }
  await writeFile(output + '/summary.json', JSON.stringify({
    scope: 'Single-run mobile Lighthouse lab audit of the production build on a GitHub runner. Not PageSpeed Insights field data or evidence of deployed Vercel dashboard settings.',
    summaries,
  }, null, 2));
} finally {
  server.kill('SIGTERM');
}
