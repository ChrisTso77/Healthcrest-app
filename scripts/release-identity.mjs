export const CANONICAL_ORIGIN = 'https://www.healthcrest.uk';
export const RELEASE_HEADER = 'X-Healthcrest-Commit';
const fullCommit = /^[a-f0-9]{40}$/;

function commit(value, label, optional = false) {
  if (!value && optional) return null;
  if (typeof value !== 'string' || !fullCommit.test(value)) {
    throw new Error(label + ' must be a full lowercase 40-character Git commit SHA.');
  }
  return value;
}

// Next compiles these headers into routes-manifest.json at build time. This
// snapshot must not be replaced by a request handler reading runtime variables.
export function buildReleaseHeaders(environment) {
  const vercel = commit(environment.VERCEL_GIT_COMMIT_SHA, 'Vercel build commit', true);
  const supplied = commit(environment.HEALTHCREST_BUILD_COMMIT, 'Explicit build commit', true);
  if (vercel && supplied && vercel !== supplied) throw new Error('Build commit sources disagree.');
  const sha = vercel || supplied;
  return sha ? [{ key: RELEASE_HEADER, value: sha }] : [];
}

export function releaseTarget(environment) {
  const suppliedOrigin = environment.HEALTHCREST_RELEASE_ORIGIN;
  const target = new URL(suppliedOrigin || 'http://127.0.0.1:3002');
  if (target.username || target.password || target.search || target.hash || target.pathname !== '/' ||
      (target.protocol !== 'https:' && !(target.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(target.hostname)))) {
    throw new Error('Release origin must be an HTTPS origin, or HTTP localhost, without credentials, a path, query or fragment.');
  }
  const expectedCommit = commit(environment.HEALTHCREST_EXPECTED_COMMIT, 'Expected release commit', !suppliedOrigin);
  if (environment.HEALTHCREST_REQUIRE_MAIN === '1') {
    if (environment.GITHUB_EVENT_NAME !== 'workflow_dispatch' || environment.GITHUB_REF !== 'refs/heads/main' ||
        target.origin !== CANONICAL_ORIGIN || expectedCommit !== commit(environment.GITHUB_SHA, 'Workflow checkout commit')) {
      throw new Error('Production smoke must run manually from main against the canonical origin, with the expected commit matching that checkout.');
    }
  }
  return { origin: target.origin, suppliedOrigin: Boolean(suppliedOrigin), expectedCommit,
    mode: suppliedOrigin ? (target.origin === CANONICAL_ORIGIN ? 'canonical-live' : 'remote-deployment') : 'local-build' };
}

export function assertReleaseCommit(observed, expected) {
  const actual = commit(observed, 'Observed deployment commit');
  if (actual !== commit(expected, 'Expected release commit')) throw new Error('Deployment commit does not match the expected release.');
  return actual;
}

export function releaseProvenance(environment) {
  const sourceCommit = fullCommit.test(environment.GITHUB_SHA || '') ? environment.GITHUB_SHA : null;
  const event = ['pull_request', 'push', 'workflow_dispatch'].includes(environment.GITHUB_EVENT_NAME) ? environment.GITHUB_EVENT_NAME : null;
  const validRun = environment.GITHUB_SERVER_URL === 'https://github.com' &&
    /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(environment.GITHUB_REPOSITORY || '') && /^\d+$/.test(environment.GITHUB_RUN_ID || '');
  return { sourceCommit, event,
    checkoutScope: event === 'pull_request' ? 'GitHub pull-request merge checkout; not the pull-request head SHA' : 'Workflow source checkout or local shell',
    workflowRunUrl: validRun ? 'https://github.com/' + environment.GITHUB_REPOSITORY + '/actions/runs/' + environment.GITHUB_RUN_ID : null };
}
