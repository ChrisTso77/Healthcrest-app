import { createHash, randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, open, readFile, readdir, realpath, rename, rm, stat, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const CLI_VERSION = '8.27.0';
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const day = 86400000;
const inside = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
};

async function digest(file) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}

function command(executable, args, output, cwd, environment = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, { cwd, env: { ...process.env, ...environment }, shell: false, windowsHide: true, stdio: ['ignore', output, output] });
    const timeout = setTimeout(() => child.kill(), 60 * 60 * 1000);
    child.once('close', () => clearTimeout(timeout));
    child.once('error', () => clearTimeout(timeout));
    child.once('error', () => reject(new Error('Backup subprocess could not start; check installed tools.')));
    child.once('close', code => code === 0 ? resolve() : reject(new Error('Backup subprocess failed; inspect the private run log.')));
  });
}

async function configuration(config) {
  if (!/^[a-z0-9]+$/.test(config.project ?? '') || !/^[a-z0-9][a-z0-9_-]*$/.test(config.dataset ?? '')) {
    throw new Error('Provide an explicit Sanity project ID and dataset name.');
  }
  if (!config.privateDirectoryConfirmed || !path.isAbsolute(config.destination ?? '')) {
    throw new Error('Confirm an existing absolute private destination outside the repository.');
  }
  const destination = await realpath(config.destination);
  const repo = await realpath(repository);
  if (inside(repo, destination) || inside(destination, repo)) throw new Error('Backup destination must be separate from the repository.');
  if (!(await stat(destination)).isDirectory()) throw new Error('Backup destination must be a directory.');
  return { ...config, destination };
}

async function records(config) {
  const results = [];
  for (const name of await readdir(config.destination)) {
    if (!name.startsWith(`healthcrest-${config.project}-${config.dataset}-`)) continue;
    const directory = path.join(config.destination, name);
    try {
      const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'));
      if (manifest.project !== config.project || manifest.dataset !== config.dataset || manifest.status !== 'archive-checked') continue;
      const timestamp = Date.parse(manifest.startedAt);
      if (!Number.isFinite(timestamp)) continue;
      results.push({ directory, manifest, timestamp });
    } catch { /* Failed/partial runs are deliberately not successful backups. */ }
  }
  return results.sort((a, b) => b.timestamp - a.timestamp);
}

export async function checkBackup(input, now = Date.now()) {
  const config = await configuration(input);
  const successes = await records(config);
  if (!successes.length) throw new Error('No archive-checked backup exists for this project/dataset.');
  const latest = successes[0];
  const age = now - latest.timestamp;
  if (age < 0 || age >= day) throw new Error('Latest archive-checked backup is stale or has a future timestamp; investigate.');
  if (await digest(path.join(latest.directory, 'dataset.tar.gz')) !== latest.manifest.sha256) {
    throw new Error('Latest backup checksum does not match; investigate.');
  }
  return { status: 'fresh', ageHours: Math.round(age / 360000) / 10, olderThan30Days: successes.filter(item => now - item.timestamp > 30 * day).length };
}

export async function exportBackup(input) {
  const config = await configuration(input);
  if (!path.isAbsolute(config.tools ?? '')) throw new Error('Provide the absolute private Sanity tooling directory.');
  const tools = await realpath(config.tools);
  const cliDirectory = path.join(tools, 'node_modules', '@sanity', 'cli');
  const metadata = JSON.parse(await readFile(path.join(cliDirectory, 'package.json'), 'utf8'));
  if (metadata.version !== CLI_VERSION) throw new Error(`Install the reviewed @sanity/cli ${CLI_VERSION} in the tooling directory.`);
  const startedAt = new Date().toISOString();
  const prefix = `healthcrest-${config.project}-${config.dataset}-`;
  const name = `${prefix}${startedAt.replace(/[:.]/g, '-')}-${randomUUID()}`;
  const lock = path.join(config.destination, `.${prefix}lock`);
  await mkdir(lock); // Never overlap exports; a stale lock requires operator investigation.
  const staging = path.join(config.destination, `.${name}.partial`);
  try {
    await mkdir(staging, { mode: 0o700 });
    const privateTemp = path.join(staging, 'temporary');
    await mkdir(privateTemp, { mode: 0o700 });
    const archive = path.join(staging, 'dataset.tar.gz');
    const log = await open(path.join(staging, 'export.log'), 'wx', 0o600);
    try {
      await command(process.execPath, [path.join(cliDirectory, 'bin', 'run.js'), 'datasets', 'export', config.dataset, archive, '--project', config.project, '--mode', 'stream'], log.fd, tools, {
        TMPDIR: privateTemp, TMP: privateTemp, TEMP: privateTemp, DO_NOT_TRACK: '1', NO_UPDATE_NOTIFIER: '1',
      });
    } finally { await log.close(); }
    const output = await readFile(path.join(staging, 'export.log'), 'utf8');
    if (/warn|skip|ignor|fail|error|⚠/i.test(output)) throw new Error('Export reported a warning or possible omission; review the private log.');
    if (!(await stat(archive)).size) throw new Error('Export archive is empty.');
    const listing = await open(path.join(staging, 'archive-list.log'), 'wx', 0o600);
    try {
      await command(process.platform === 'win32' ? 'tar.exe' : 'tar', ['-tzf', archive], listing.fd, tools);
    } finally { await listing.close(); }
    const entries = (await readFile(path.join(staging, 'archive-list.log'), 'utf8')).split(/\r?\n/).filter(Boolean);
    if (entries.some(entry => entry.startsWith('/') || entry.includes('\\') || /^[A-Za-z]:/.test(entry) || entry.split('/').includes('..'))) {
      throw new Error('Archive contains unsafe entry names.');
    }
    for (const required of ['data.ndjson', 'assets.json']) {
      if (!entries.some(entry => entry === required || entry.endsWith(`/${required}`))) throw new Error('Archive lacks expected dataset/asset metadata.');
    }
    const manifest = { status: 'archive-checked', project: config.project, dataset: config.dataset, startedAt, completedAt: new Date().toISOString(), cliVersion: CLI_VERSION, sha256: await digest(archive), bytes: (await stat(archive)).size };
    await writeFile(path.join(staging, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    await rename(staging, path.join(config.destination, name));
    return { status: 'archive-checked', restoreTested: false };
  } finally {
    // Failed archives/logs remain private and partial; never overwrite or prune an earlier success.
    await rm(lock, { recursive: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const value = name => { const index = args.indexOf(name); return index < 0 ? undefined : args[index + 1]; };
  const allowed = new Set(['--project', '--dataset', '--destination', '--tools', '--private-directory-confirmed', '--check']);
  try {
    for (let i = 0; i < args.length; i++) {
      if (!allowed.has(args[i])) throw new Error('Unknown backup argument.');
      if (!['--private-directory-confirmed', '--check'].includes(args[i])) {
        if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Missing backup argument value.');
        i++;
      }
    }
    const config = { project: value('--project'), dataset: value('--dataset'), destination: value('--destination'), tools: value('--tools'), privateDirectoryConfirmed: args.includes('--private-directory-confirmed') };
    console.log(JSON.stringify(await (args.includes('--check') ? checkBackup(config) : exportBackup(config))));
  } catch (error) {
    // Filesystem/provider errors can contain private paths/content: do not echo them to scheduler/CI logs.
    console.error(error.code || error instanceof SyntaxError ? 'Backup filesystem/configuration operation failed; inspect the private destination and permissions.' : error.message);
    process.exitCode = 1;
  }
}
