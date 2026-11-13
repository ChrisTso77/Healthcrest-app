import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { PREVIEW_ORIGIN, PREVIEW_COMMIT, TRUSTED_REF, TRUSTED_WORKFLOW, protectedPreviewAuth,
  isProtectedPreviewRequest, protectedPreviewGet, protectedPreviewRoute, protectedPreviewIdentity,
  redactPreviewCredential, anonymousPreviewProtection } from './protected-preview-auth.mjs';

const credential = 'SYNTHETIC-OIDC-NOT-A-REAL-CREDENTIAL';
const environment = () => ({ GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_REPOSITORY: 'ChrisTso77/Healthcrest-app', GITHUB_REF: TRUSTED_REF,
  GITHUB_WORKFLOW: TRUSTED_WORKFLOW, HEALTHCREST_PREVIEW_OIDC_TOKEN: credential });
const auth = () => protectedPreviewAuth(environment(), PREVIEW_ORIGIN, PREVIEW_COMMIT);

test('approved manual context and frozen target allow an opaque credential', () => {
  assert.equal(auth().origin, PREVIEW_ORIGIN);
  assert(Object.isFrozen(auth()));
});
for (const patch of [{ GITHUB_ACTIONS: 'false' }, { GITHUB_EVENT_NAME: 'pull_request' },
  { GITHUB_EVENT_NAME: 'pull_request_target' }, { GITHUB_REPOSITORY: 'untrusted/fork' },
  { GITHUB_REF: 'refs/pull/139/merge' }, { GITHUB_REF: 'refs/heads/main' },
  { GITHUB_WORKFLOW: 'another workflow' }, { HEALTHCREST_PREVIEW_OIDC_TOKEN: '' },
  { HEALTHCREST_PREVIEW_OIDC_TOKEN: 'bad\r\nvalue' }]) {
  test('rejects an unapproved context: ' + Object.keys(patch)[0] + '=' + Object.values(patch)[0].slice(0,25), () => {
    assert.throws(() => protectedPreviewAuth({ ...environment(), ...patch }, PREVIEW_ORIGIN, PREVIEW_COMMIT));
  });
}
test('rejects Production, other deployments and source drift before requests', () => {
  for (const origin of ['https://www.healthcrest.uk', 'https://another.vercel.app', PREVIEW_ORIGIN + '/']) {
    assert.throws(() => protectedPreviewAuth(environment(), origin, PREVIEW_COMMIT));
  }
  assert.throws(() => protectedPreviewAuth(environment(), PREVIEW_ORIGIN, 'a'.repeat(40)));
});
test('API token is confined to fixed origin; redirects disabled and Range preserved', async () => {
  const calls = [];
  const request = { get: async (...args) => { calls.push(args); return 'response'; } };
  assert.equal(await protectedPreviewGet(request, PREVIEW_ORIGIN + '/icon', { maxRedirects: 5, headers: { Range: 'bytes=0-31' } }, auth()), 'response');
  assert.equal(calls[0][1].maxRedirects, 0);
  assert.equal(calls[0][1].headers.Range, 'bytes=0-31');
  assert.equal(calls[0][1].headers['x-vercel-trusted-oidc-idp-token'], credential);
  for (const url of ['https://www.healthcrest.uk', PREVIEW_ORIGIN + '.evil.test', 'http://healthcrest-55j1i65dz-tsotsoft.vercel.app', PREVIEW_ORIGIN.replace('https://', 'https://user:password@')]) {
    assert.equal(isProtectedPreviewRequest(url, auth()), false);
    assert.throws(() => protectedPreviewGet(request, url, {}, auth()));
  }
  assert.equal(calls.length, 1);
});
test('browser transport aborts foreign requests before credential attachment', async () => {
  const calls = [];
  const route = (url, method = 'GET') => ({ request: () => ({ url: () => url, method: () => method, headers: () => ({ accept: 'text/html' }) }),
    abort: () => calls.push('abort'), continue: options => calls.push(options) });
  await protectedPreviewRoute(route('https://vercel.com/sso-api'), auth());
  assert.deepEqual(calls, ['abort']);
  await protectedPreviewRoute(route(PREVIEW_ORIGIN + '/learn'), auth());
  assert.equal(calls[1].headers.accept, 'text/html');
  assert.equal(calls[1].headers['x-vercel-trusted-oidc-idp-token'], credential);
  await protectedPreviewRoute(route(PREVIEW_ORIGIN + '/api/presets', 'POST'), auth());
  assert.equal(calls[2], 'abort');
});
test('authentication failures and wrong source cannot pass identity', () => {
  const response = (status, sha = PREVIEW_COMMIT) => ({ status: () => status, headers: () => ({ 'x-healthcrest-commit': sha }) });
  for (const status of [302, 401, 403, 500]) assert.throws(() => protectedPreviewIdentity(response(status), PREVIEW_COMMIT));
  for (const sha of ['', 'a'.repeat(40), 'short']) assert.throws(() => protectedPreviewIdentity(response(200, sha), PREVIEW_COMMIT));
  assert.equal(protectedPreviewIdentity(response(200), PREVIEW_COMMIT), PREVIEW_COMMIT);
});
test('failure redaction removes all literal token copies from JSON and messages', () => {
  const raw = JSON.stringify({ error: `header: ${credential}; repeated ${credential}`, passed: false });
  const safe = redactPreviewCredential(raw, credential);
  assert(!safe.includes(credential)); assert.equal(JSON.parse(safe).passed, false);
  assert.equal(redactPreviewCredential('ordinary failure', undefined), 'ordinary failure');
});
test('anonymous access must remain protected; public pages and unrelated redirects fail', () => {
  const response = (status, location) => ({ status: () => status, headers: () => ({ location }) });
  assert.equal(anonymousPreviewProtection(response(401)).protected, true);
  assert.equal(anonymousPreviewProtection(response(403)).protected, true);
  const result = anonymousPreviewProtection(response(302, 'https://vercel.com/sso-api?nonce=SYNTHETIC-NONCE'));
  assert.deepEqual(result, { status: 302, protected: true, redirectOrigin: 'https://vercel.com', redirectPath: '/sso-api' });
  for (const status of [200, 404, 500]) assert.throws(() => anonymousPreviewProtection(response(status)));
  for (const location of ['https://www.healthcrest.uk', 'https://vercel.com.evil.test/sso-api', 'invalid']) {
    assert.throws(() => anonymousPreviewProtection(response(302, location)));
  }
});
test('missing auth fails closed in actual harness with no network/browser launch', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'healthcrest-protected-preview-'));
  try {
    const env = { ...process.env, ...environment(), HEALTHCREST_PREVIEW_OIDC_TOKEN: '',
      HEALTHCREST_RELEASE_ORIGIN: PREVIEW_ORIGIN, HEALTHCREST_EXPECTED_COMMIT: PREVIEW_COMMIT };
    delete env.HEALTHCREST_REQUIRE_MAIN;
    const result = spawnSync(process.execPath, [fileURLToPath(new URL('./check-release.mjs', import.meta.url))], { cwd, env, encoding: 'utf8', timeout: 10_000 });
    assert.equal(result.status, 1);
    const text = await readFile(join(cwd, 'artifacts/release-readiness/summary.json'), 'utf8');
    const report = JSON.parse(text);
    assert.equal(report.passed, false); assert.equal(report.release.identityVerified, false);
    assert.deepEqual(report.checks, []); assert.match(report.error, /credential is unavailable/);
    assert(!text.includes(credential));
  } finally { await rm(cwd, { recursive: true, force: true }); }
});

test('Planner harness missing auth fails closed before any browser, storage or network operation', async () => {
  const cwd=await mkdtemp(join(tmpdir(),'healthcrest-planner-preview-'));
  try {
    const script=fileURLToPath(new URL('./check-planner-preview.mjs',import.meta.url));
    const env={...process.env,...environment(),HEALTHCREST_RELEASE_ORIGIN:PREVIEW_ORIGIN,HEALTHCREST_EXPECTED_COMMIT:PREVIEW_COMMIT};
    delete env.HEALTHCREST_PREVIEW_OIDC_TOKEN;
    const result=spawnSync(process.execPath,[script],{cwd,env,encoding:'utf8'});
    assert.equal(result.status,1);
    const text=await readFile(join(cwd,'artifacts/release-readiness/planner-preview.json'),'utf8');
    const report=JSON.parse(text);assert.equal(report.passed,false);assert.equal(report.identity,null);
    assert.deepEqual(report.scenarios,[]);assert.equal(report.protection,null);
    assert.match(report.error,/credential is unavailable/);assert(!text.includes(credential));
  } finally {await rm(cwd,{recursive:true,force:true});}
});
