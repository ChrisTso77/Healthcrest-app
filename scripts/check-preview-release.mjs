import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';

export function previewContext(environment) {
  const sha = environment.HEALTHCREST_PREVIEW_HEAD_SHA;
  const repository = environment.GITHUB_REPOSITORY;
  const token = environment.GH_TOKEN || environment.GITHUB_TOKEN;
  if (environment.GITHUB_EVENT_NAME !== 'pull_request') throw new Error('Preview verification requires a pull-request workflow.');
  if (!/^[a-f0-9]{40}$/.test(sha || '')) throw new Error('Preview verification requires the full lowercase PR head SHA.');
  if (!/^[A-Za-z0-9][A-Za-z0-9_.-]*\/[A-Za-z0-9_.-]+$/.test(repository || '') || ['.', '..'].includes(repository?.split('/')[1])) {
    throw new Error('Preview verification requires a valid repository.');
  }
  if (typeof token !== 'string' || !token || /\s/.test(token)) throw new Error('Preview verification requires a GitHub API token.');
  return { sha, repository, token };
}

export function previewOrigin(value) {
  if (typeof value !== 'string' || /\s/.test(value)) throw new Error('Preview deployment must supply a valid HTTPS Vercel origin.');
  let url;
  try { url = new URL(value); } catch { throw new Error('Preview deployment must supply a valid HTTPS Vercel origin.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash ||
      !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.vercel\.app$/.test(url.hostname)) {
    throw new Error('Preview deployment must supply a root HTTPS *.vercel.app origin without credentials or parameters.');
  }
  return url.origin;
}

export function selectPreviewDeployment(deployments, sha) {
  if (!Array.isArray(deployments)) throw new Error('GitHub deployments response is invalid.');
  return deployments.filter(item => item?.sha === sha && item.environment === 'Preview' && Number.isSafeInteger(item.id) && item.id > 0)
    .sort((a, b) => b.id - a.id)[0] || null;
}

export function successfulPreviewOrigin(statuses) {
  if (!Array.isArray(statuses)) throw new Error('GitHub deployment statuses response is invalid.');
  if (!statuses.length) return null;
  const status = statuses[0];
  if (status.environment !== undefined && status.environment !== 'Preview') throw new Error('Deployment status is not Preview.');
  if (['failure', 'error', 'inactive'].includes(status.state)) throw new Error('Latest preview deployment did not succeed.');
  if (['pending', 'queued', 'in_progress'].includes(status.state)) return null;
  if (status.state !== 'success') throw new Error('Deployment status is invalid.');
  return previewOrigin(status.environment_url);
}

export function previewChildEnvironment(environment, origin, sha) {
  const child = { ...environment, HEALTHCREST_RELEASE_ORIGIN: previewOrigin(origin), HEALTHCREST_EXPECTED_COMMIT: sha };
  delete child.GH_TOKEN;
  delete child.GITHUB_TOKEN;
  delete child.HEALTHCREST_REQUIRE_MAIN;
  return child;
}

export async function discoverPreview(context, { fetchImpl = fetch, sleep = delay, now = Date.now, timeoutMs = 180_000 } = {}) {
  const deadline = now() + timeoutMs;
  const base = 'https://api.github.com/repos/' + context.repository.split('/').map(encodeURIComponent).join('/');
  async function get(path) {
    const remaining = deadline - now();
    if (remaining <= 0) throw new Error('Timed out waiting for an exact-head Preview deployment.');
    let response;
    try {
      response = await fetchImpl(base + path, { redirect: 'error', signal: AbortSignal.timeout(Math.min(10_000, remaining)),
        headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + context.token, 'X-GitHub-Api-Version': '2022-11-28' } });
    } catch { throw new Error('GitHub preview metadata request failed.'); }
    if (!response.ok) throw new Error('GitHub preview metadata request was rejected.');
    try { return await response.json(); } catch { throw new Error('GitHub preview metadata response is invalid.'); }
  }
  while (now() < deadline) {
    const deployments = await get('/deployments?sha=' + context.sha + '&environment=Preview&per_page=100');
    const deployment = selectPreviewDeployment(deployments, context.sha);
    if (deployment) {
      const origin = successfulPreviewOrigin(await get('/deployments/' + deployment.id + '/statuses?per_page=100'));
      if (origin) return origin;
    }
    const remaining = deadline - now();
    if (remaining > 0) await sleep(Math.min(10_000, remaining));
  }
  throw new Error('Timed out waiting for an exact-head Preview deployment.');
}

async function main() {
  let context;
  let origin = null;
  try {
    context = previewContext(process.env);
    origin = await discoverPreview(context);
  } catch (error) {
    await mkdir('artifacts/release-readiness', { recursive: true });
    await writeFile('artifacts/release-readiness/summary.json', JSON.stringify({ passed: false, origin, checks: [],
      release: { mode: 'remote-deployment', expectedCommit: context?.sha || null, identityVerified: false }, error: error.message }, null, 2));
    console.error(error.message);
    process.exitCode = 1;
    return;
  }
  console.log('Verifying exact-head Preview release: ' + context.sha + ' at ' + origin);
  const child = spawn(process.execPath, [fileURLToPath(new URL('./check-release.mjs', import.meta.url))], {
    stdio: 'inherit', env: previewChildEnvironment(process.env, origin, context.sha),
  });
  process.exitCode = await new Promise(resolve => {
    child.once('error', () => resolve(1));
    child.once('exit', code => resolve(code === 0 ? 0 : 1));
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
