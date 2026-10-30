import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { CLI_VERSION, exportBackup, checkBackup } from './sanity-backup.mjs';

async function fixture(t, mode = 'success') {
  const root = await mkdtemp(path.join(tmpdir(), 'healthcrest-backup-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const destination = path.join(root, 'private');
  const tools = path.join(root, 'tools');
  const cli = path.join(tools, 'node_modules', '@sanity', 'cli');
  const source = path.join(root, 'source', 'dataset');
  await Promise.all([mkdir(destination), mkdir(path.join(cli, 'bin'), { recursive: true }), mkdir(source, { recursive: true })]);
  await writeFile(path.join(source, 'data.ndjson'), '{"_id":"synthetic-test","_type":"fixture"}\n');
  if (mode !== 'missing-metadata') await writeFile(path.join(source, 'assets.json'), '{}');
  const archive = path.join(root, 'fixture.tar.gz');
  const tar = spawnSync(process.platform === 'win32' ? 'tar.exe' : 'tar', ['-czf', archive, '-C', path.dirname(source), 'dataset']);
  assert.equal(tar.status, 0, 'Synthetic archive creation must succeed');
  await writeFile(path.join(cli, 'package.json'), JSON.stringify({ version: CLI_VERSION }));
  await writeFile(path.join(cli, 'bin', 'run.js'), `
    const fs = require('node:fs');
    const assert = require('node:assert/strict');
    const args = process.argv.slice(2);
    assert.deepEqual(args.slice(0, 3), ['datasets', 'export', 'production']);
    assert.deepEqual(args.slice(4), ['--project', 'fixture123', '--mode', 'stream']);
    assert.equal(process.env.DO_NOT_TRACK, '1');
    assert.equal(process.env.NO_UPDATE_NOTIFIER, '1');
    for (const variable of ['TMPDIR', 'TMP', 'TEMP']) {
      assert.equal(process.env[variable], require('node:path').join(require('node:path').dirname(args[3]), 'temporary'));
    }
    const mode = ${JSON.stringify(mode)};
    if (mode === 'fail') { console.error('PRIVATE-FIXTURE-CONTENT'); process.exit(1); }
    if (mode === 'corrupt') fs.writeFileSync(args[3], 'not a tar archive');
    else fs.copyFileSync(${JSON.stringify(archive)}, args[3]);
    if (mode === 'warning') console.error('Asset failed with HTTP 404 (ignoring): PRIVATE-ASSET');
    else console.log('Export completed');
  `);
  return { project: 'fixture123', dataset: 'production', tools, destination, privateDirectoryConfirmed: true };
}

test('exports a synthetic archive, checks integrity and reports freshness without dataset output', async t => {
  const config = await fixture(t);
  assert.deepEqual(await exportBackup(config), { status: 'archive-checked', restoreTested: false });
  assert.equal((await checkBackup(config)).status, 'fresh');
  const directories = await readdir(config.destination);
  assert.equal(directories.length, 1);
  const manifest = JSON.parse(await readFile(path.join(config.destination, directories[0], 'manifest.json'), 'utf8'));
  assert.equal(manifest.cliVersion, CLI_VERSION);
  assert.match(manifest.sha256, /^[a-f0-9]{64}$/);
});

test('zero-exit asset warning blocks success and preserves the preceding archive', async t => {
  const config = await fixture(t);
  await exportBackup(config);
  const other = await fixture(t, 'warning');
  await assert.rejects(exportBackup({ ...config, tools: other.tools }), /warning or possible omission/);
  assert.equal((await checkBackup(config)).status, 'fresh');
  const names = await readdir(config.destination);
  assert.equal(names.filter(name => !name.startsWith('.')).length, 1);
  assert.equal(names.filter(name => name.endsWith('.partial')).length, 1);
});

test('provider failure does not echo private output or create a successful backup', async t => {
  const config = await fixture(t, 'fail');
  await assert.rejects(exportBackup(config), error => /subprocess failed/.test(error.message) && !error.message.includes('PRIVATE'));
  await assert.rejects(checkBackup(config), /No archive-checked backup/);
});

test('invalid gzip/tar cannot become a successful backup', async t => {
  const config = await fixture(t, 'corrupt');
  await assert.rejects(exportBackup(config), /subprocess failed/);
  await assert.rejects(checkBackup(config), /No archive-checked backup/);
});

test('readable tar without asset metadata cannot become a successful backup', async t => {
  const config = await fixture(t, 'missing-metadata');
  await assert.rejects(exportBackup(config), /lacks expected/);
  await assert.rejects(checkBackup(config), /No archive-checked backup/);
});

test('checksum mismatch is detected by the separate freshness check', async t => {
  const config = await fixture(t);
  await exportBackup(config);
  const [directory] = await readdir(config.destination);
  await writeFile(path.join(config.destination, directory, 'dataset.tar.gz'), 'tampered');
  await assert.rejects(checkBackup(config), /checksum/);
});

test('24-hour boundary fails; 30-day retention candidates are reported without deletion', async t => {
  const config = await fixture(t);
  await exportBackup(config);
  const [directory] = await readdir(config.destination);
  const manifestFile = path.join(config.destination, directory, 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
  await assert.rejects(checkBackup(config, Date.parse(manifest.startedAt) + 86400000), /stale/);
  manifest.startedAt = new Date(Date.now() - 31 * 86400000).toISOString();
  await writeFile(manifestFile, JSON.stringify(manifest));
  await exportBackup(config);
  assert.equal((await checkBackup(config)).olderThan30Days, 1);
  assert.equal((await readdir(config.destination)).length, 2);
});

test('lock blocks overlapping exports without removing the existing lock', async t => {
  const config = await fixture(t);
  const lock = path.join(config.destination, '.healthcrest-fixture123-production-lock');
  await mkdir(lock);
  await assert.rejects(exportBackup(config), { code: 'EEXIST' });
  assert.deepEqual(await readdir(config.destination), [path.basename(lock)]);
});

test('requires explicit target/private folder and exact reviewed tooling', async t => {
  const config = await fixture(t);
  await assert.rejects(exportBackup({ ...config, privateDirectoryConfirmed: false }), /Confirm an existing/);
  await assert.rejects(exportBackup({ ...config, project: '--malicious' }), /explicit Sanity/);
  await assert.rejects(exportBackup({ ...config, destination: path.resolve('.') }), /separate from the repository/);
  await writeFile(path.join(config.tools, 'node_modules', '@sanity', 'cli', 'package.json'), '{"version":"0.0.0"}');
  await assert.rejects(exportBackup(config), /reviewed/);
});
