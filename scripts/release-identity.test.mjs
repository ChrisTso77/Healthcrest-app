import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CANONICAL_ORIGIN, RELEASE_HEADER, assertReleaseCommit, buildReleaseHeaders, releaseProvenance, releaseTarget } from './release-identity.mjs';

const sha = 'a'.repeat(40), other = 'b'.repeat(40);
const production = () => ({ HEALTHCREST_RELEASE_ORIGIN: CANONICAL_ORIGIN, HEALTHCREST_EXPECTED_COMMIT: sha,
  HEALTHCREST_REQUIRE_MAIN: '1', GITHUB_SHA: sha, GITHUB_REF: 'refs/heads/main', GITHUB_EVENT_NAME: 'workflow_dispatch' });

test('build headers snapshot the Vercel commit without retaining mutable runtime values', () => {
  const environment = { VERCEL_GIT_COMMIT_SHA: sha };
  const headers = buildReleaseHeaders(environment);
  environment.VERCEL_GIT_COMMIT_SHA = other;
  assert.deepEqual(headers, [{ key: RELEASE_HEADER, value: sha }]);
});
test('explicit CI build identity can be the checked-out synthetic merge SHA', () => {
  assert.deepEqual(buildReleaseHeaders({ HEALTHCREST_BUILD_COMMIT: sha, GITHUB_SHA: other }), [{ key: RELEASE_HEADER, value: sha }]);
});
test('a local build without supplied identity does not invent a commit', () => {
  assert.deepEqual(buildReleaseHeaders({ GITHUB_SHA: sha }), []);
  assert.equal(releaseTarget({}).expectedCommit, null);
});
test('conflicting provider and explicit build identities fail', () => {
  assert.throws(() => buildReleaseHeaders({ VERCEL_GIT_COMMIT_SHA: sha, HEALTHCREST_BUILD_COMMIT: other }), /disagree/);
});
for (const value of ['short', 'A'.repeat(40), sha + '\r\nInjected: value']) {
  test('malformed build identity cannot enter a response header: ' + JSON.stringify(value), () => {
    assert.throws(() => buildReleaseHeaders({ VERCEL_GIT_COMMIT_SHA: value }));
    assert.throws(() => buildReleaseHeaders({ HEALTHCREST_BUILD_COMMIT: value }));
  });
}
test('manual canonical smoke binds expected identity to the main checkout', () => {
  assert.deepEqual(releaseTarget(production()), { origin: CANONICAL_ORIGIN, suppliedOrigin: true, expectedCommit: sha, mode: 'canonical-live' });
});
for (const [name, changes] of [
  ['wrong branch', { GITHUB_REF: 'refs/heads/feature' }],
  ['stale expected commit', { HEALTHCREST_EXPECTED_COMMIT: other }],
  ['non-manual event', { GITHUB_EVENT_NAME: 'push' }],
  ['different origin', { HEALTHCREST_RELEASE_ORIGIN: 'https://preview.example.test' }],
  ['missing checkout commit', { GITHUB_SHA: undefined }],
]) {
  test('production workflow rejects ' + name, () => assert.throws(() => releaseTarget({ ...production(), ...changes })));
}
test('remote smoke requires an explicit full expected commit', () => {
  for (const value of [undefined, '', 'short', 'A'.repeat(40)]) {
    assert.throws(() => releaseTarget({ HEALTHCREST_RELEASE_ORIGIN: CANONICAL_ORIGIN, HEALTHCREST_EXPECTED_COMMIT: value }));
  }
  assert.equal(releaseTarget({ HEALTHCREST_RELEASE_ORIGIN: 'https://preview.example.test', HEALTHCREST_EXPECTED_COMMIT: sha }).mode, 'remote-deployment');
});
for (const origin of ['https://user:password@example.test', 'https://example.test/path', 'https://example.test?token=hidden',
  'https://example.test#fragment', 'http://example.test', 'file:///tmp/check', 'https://example.test:invalid']) {
  test('unsafe or ambiguous target is rejected: ' + origin, () => {
    assert.throws(() => releaseTarget({ HEALTHCREST_RELEASE_ORIGIN: origin, HEALTHCREST_EXPECTED_COMMIT: sha }));
  });
}
test('HTTP loopback checks remain available but need an expected commit when explicitly supplied', () => {
  assert.equal(releaseTarget({ HEALTHCREST_RELEASE_ORIGIN: 'http://localhost:3002', HEALTHCREST_EXPECTED_COMMIT: sha }).mode, 'remote-deployment');
});
test('matching deployment identity succeeds', () => assert.equal(assertReleaseCommit(sha, sha), sha));
for (const [name, observed] of [['missing', undefined], ['stale', other], ['duplicate', sha + ', ' + sha], ['malformed', 'not-a-commit']]) {
  test(name + ' deployment identity fails even if public pages otherwise work', () => assert.throws(() => assertReleaseCommit(observed, sha)));
}
test('report provenance distinguishes the PR merge checkout from the PR head', () => {
  const provenance = releaseProvenance({ GITHUB_SHA: sha, GITHUB_EVENT_NAME: 'pull_request', GITHUB_SERVER_URL: 'https://github.com',
    GITHUB_REPOSITORY: 'ChrisTso77/Healthcrest-app', GITHUB_RUN_ID: '1234' });
  assert.equal(provenance.sourceCommit, sha);
  assert.match(provenance.checkoutScope, /not the pull-request head/);
  assert.equal(provenance.workflowRunUrl, 'https://github.com/ChrisTso77/Healthcrest-app/actions/runs/1234');
  assert.equal(releaseProvenance({ GITHUB_SERVER_URL: 'https://user:password@example.test', GITHUB_SHA: 'private-value' }).workflowRunUrl, null);
});
test('configuration failure retains a failed report before any browser or network access', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'healthcrest-release-failure-'));
  try {
    const result = spawnSync(process.execPath, [fileURLToPath(new URL('./check-release.mjs', import.meta.url))], {
      cwd: directory, env: { HEALTHCREST_RELEASE_ORIGIN: 'https://user:private-value@example.test', HEALTHCREST_EXPECTED_COMMIT: sha },
      encoding: 'utf8', timeout: 10_000,
    });
    assert.equal(result.status, 1);
    const text = await readFile(join(directory, 'artifacts/release-readiness/summary.json'), 'utf8');
    const report = JSON.parse(text);
    assert.equal(report.passed, false);
    assert.equal(report.release.identityVerified, false);
    assert.equal(report.origin, null);
    assert.deepEqual(report.checks, []);
    assert.match(report.error, /Release origin/);
    assert.equal(text.includes('private-value'), false);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
