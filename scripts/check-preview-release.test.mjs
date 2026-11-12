import test from 'node:test';
import assert from 'node:assert/strict';
import { previewContext, previewOrigin, selectPreviewDeployment, successfulPreviewOrigin, previewChildEnvironment, discoverPreview } from './check-preview-release.mjs';

const sha = 'a'.repeat(40), other = 'b'.repeat(40);
const environment = () => ({ GITHUB_EVENT_NAME: 'pull_request', GITHUB_REPOSITORY: 'owner/repo', HEALTHCREST_PREVIEW_HEAD_SHA: sha, GITHUB_TOKEN: 'synthetic-token' });
test('requires PR context, exact head, valid repository and token', () => {
  assert.deepEqual(previewContext(environment()), { sha, repository: 'owner/repo', token: 'synthetic-token' });
  for (const patch of [{ GITHUB_EVENT_NAME: 'push' }, { HEALTHCREST_PREVIEW_HEAD_SHA: 'short' }, { GITHUB_REPOSITORY: 'owner/../other' }, { GITHUB_REPOSITORY: 'owner/..' }, { GITHUB_TOKEN: '' }]) {
    assert.throws(() => previewContext({ ...environment(), ...patch }));
  }
});
test('selects latest exact-head Preview only, never Production or another source', () => {
  const selected = { id: 4, sha, environment: 'Preview' };
  assert.equal(selectPreviewDeployment([{ id: 9, sha, environment: 'Production' }, { id: 8, sha: other, environment: 'Preview' }, { id: 3, sha, environment: 'Preview' }, selected], sha), selected);
  assert.equal(selectPreviewDeployment([{ id: 9, sha, environment: 'Production' }, { id: 8, sha: other, environment: 'Preview' }], sha), null);
  assert.throws(() => selectPreviewDeployment({}, sha));
});
test('validates a root HTTPS Vercel preview origin', () => {
  assert.equal(previewOrigin('https://healthcrest-example.vercel.app/'), 'https://healthcrest-example.vercel.app');
});
for (const value of ['https://www.healthcrest.uk', 'http://healthcrest.vercel.app', 'https://vercel.app', 'https://healthcrest.vercel.app.evil.test', 'https://evil.test/healthcrest.vercel.app', 'https://user:secret@healthcrest.vercel.app', 'https://healthcrest.vercel.app:444', 'https://healthcrest.vercel.app/path', 'https://healthcrest.vercel.app/?secret=1', 'https://healthcrest.vercel.app/#fragment', 'not a URL', null]) {
  test('rejects unsafe or non-preview URL ' + String(value).replace('user:secret', 'credentials'), () => assert.throws(() => previewOrigin(value)));
}
test('only latest successful Preview status supplies the origin', () => {
  const success = { state: 'success', environment: 'Preview', environment_url: 'https://healthcrest-example.vercel.app' };
  assert.equal(successfulPreviewOrigin([success]), success.environment_url);
  assert.equal(successfulPreviewOrigin([{ state: 'pending' }, success]), null);
  assert.throws(() => successfulPreviewOrigin([{ state: 'failure' }, success]));
  assert.throws(() => successfulPreviewOrigin([{ ...success, environment: 'Production' }]));
  assert.throws(() => successfulPreviewOrigin([{ ...success, environment_url: 'https://www.healthcrest.uk' }]));
});
test('child gets explicit preview identity and no GitHub tokens or production-main mode', () => {
  const source = { ...environment(), GH_TOKEN: 'another-synthetic-token', HEALTHCREST_REQUIRE_MAIN: '1', HEALTHCREST_RELEASE_ORIGIN: 'https://www.healthcrest.uk' };
  const child = previewChildEnvironment(source, 'https://healthcrest-example.vercel.app', sha);
  assert.equal(child.HEALTHCREST_RELEASE_ORIGIN, 'https://healthcrest-example.vercel.app');
  assert.equal(child.HEALTHCREST_EXPECTED_COMMIT, sha);
  for (const key of ['GH_TOKEN', 'GITHUB_TOKEN', 'HEALTHCREST_REQUIRE_MAIN']) assert.equal(key in child, false);
  assert.equal(source.GH_TOKEN, 'another-synthetic-token');
});
test('discovery uses only fixed GitHub GET paths and validates status origin', async () => {
  const requests = [];
  const origin = await discoverPreview(previewContext(environment()), { fetchImpl: async (url, options) => {
    requests.push({ url, options });
    return { ok: true, json: async () => url.includes('/statuses?') ? [{ state: 'success', environment: 'Preview', environment_url: 'https://healthcrest-example.vercel.app' }] : [{ id: 7, sha, environment: 'Preview' }] };
  } });
  assert.equal(origin, 'https://healthcrest-example.vercel.app');
  assert.equal(requests.length, 2);
  assert(requests.every(({ url, options }) => url.startsWith('https://api.github.com/repos/owner/repo/deployments') && options.redirect === 'error' && options.method === undefined));
});
test('wrong-source/Production discovery times out without fetching their statuses', async () => {
  let time = 0, requests = 0;
  await assert.rejects(discoverPreview(previewContext(environment()), { timeoutMs: 20_000, now: () => time, sleep: async ms => { time += ms; }, fetchImpl: async url => {
    requests++; assert(!url.includes('/statuses?'));
    return { ok: true, json: async () => [{ id: 7, sha: other, environment: 'Preview' }, { id: 8, sha, environment: 'Production' }] };
  } }), /Timed out/);
  assert.equal(requests, 2);
});
test('provider errors and terminal preview failures fail closed', async () => {
  await assert.rejects(discoverPreview(previewContext(environment()), { fetchImpl: async () => ({ ok: false }) }), /rejected/);
  await assert.rejects(discoverPreview(previewContext(environment()), { fetchImpl: async url => ({ ok: true, json: async () => url.includes('/statuses?') ? [{ state: 'error' }] : [{ id: 7, sha, environment: 'Preview' }] }) }), /did not succeed/);
});
