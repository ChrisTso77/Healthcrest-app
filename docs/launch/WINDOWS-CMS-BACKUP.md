# Private Sanity backups on Windows

Prepared 30 October 2026 for the owner-operated computer. This setup is not installed or scheduled by a repository merge. The computer must be on, connected and able to authenticate at least daily. A computer that is regularly off for more than 24 hours cannot support the agreed data-loss target; investigate a missed/stale backup instead of claiming the target was met.

## One-time setup

1. Use a supported Windows installation with Node.js 22.12 or later and Windows `tar.exe`. Confirm `node --version` and `tar --version` in PowerShell. Install Node from its official source if needed. Do not use an unreviewed CLI upgrade automatically.
2. Create a private folder outside the Healthcrest checkout. The example below uses your local Windows user profile. Check **Properties → Security**: restrict access to your account and necessary system/administrator accounts. These checksums do not encrypt backups. Use existing device/storage encryption and a private second copy where available; a copy on the same disk alone does not protect against disk loss. Do not place exports in public/shared folders, Git or public workflow artifacts. No new cloud storage provider is selected here.
3. From the reviewed checkout, run the setup commands below. The paths are examples under your own profile; no actual username, project ID or token belongs in this document.

```powershell
$backupRoot = Join-Path $env:LOCALAPPDATA 'Healthcrest\CMSBackups'
$backupTools = Join-Path $env:LOCALAPPDATA 'Healthcrest\BackupTools'
$backupRunner = Join-Path $env:LOCALAPPDATA 'Healthcrest\BackupRunner'
New-Item -ItemType Directory -Force $backupRoot, $backupTools, $backupRunner | Out-Null
Copy-Item .\scripts\sanity-backup.mjs (Join-Path $backupRunner 'sanity-backup.mjs')
npm install --prefix $backupTools --save-exact @sanity/cli@8.27.0
$sanityCli = Join-Path $backupTools 'node_modules\@sanity\cli\bin\run.js'
node $sanityCli login
```

The CLI is installed separately from the website dependency tree, with its own local lockfile. Use a read-capable account/session restricted to the required project. Do not paste access tokens into commands, task arguments, Git or chat. The scheduled task must run under this same Windows account; test whether that account's session works unattended. Follow existing token-management practice if a separate token is required; its secure storage is not configured by these commands.

Confirm the exact project ID and dataset in your existing Sanity controls. Do not assume a dataset name from an example. Replace the two placeholder values below locally:

```powershell
$sanityProject = 'YOUR_PROJECT_ID'
$sanityDataset = 'YOUR_DATASET'
node (Join-Path $backupRunner 'sanity-backup.mjs') --project $sanityProject --dataset $sanityDataset --tools $backupTools --destination $backupRoot --private-directory-confirmed
if ($LASTEXITCODE -ne 0) { throw 'Backup failed; inspect the private run folder.' }
node (Join-Path $backupRunner 'sanity-backup.mjs') --check --project $sanityProject --dataset $sanityDataset --destination $backupRoot --private-directory-confirmed
```

The explicit private-directory flag records your folder check; the runner cannot certify Windows ACLs, encryption, cloud sharing or physical device security. Setup is incomplete until the real first export and freshness check succeed. Do not send the archive or private logs to this repository.

## Task Scheduler

Create **Healthcrest CMS daily backup** under your own account in Windows Task Scheduler:

- Trigger: daily at a time the computer is normally on, for example 10:00 local Windows time. Record the actual time/time zone chosen.
- Action: **Start a program**. Use the absolute `node.exe` path shown by `(Get-Command node).Source`.
- Arguments: the quoted absolute runner path, then the export arguments from the successful manual command above. Substitute actual project/dataset/folder values; do not include tokens. Example structure:

```text
"C:\Users\YOUR_USER\AppData\Local\Healthcrest\BackupRunner\sanity-backup.mjs" --project YOUR_PROJECT_ID --dataset YOUR_DATASET --tools "C:\Users\YOUR_USER\AppData\Local\Healthcrest\BackupTools" --destination "C:\Users\YOUR_USER\AppData\Local\Healthcrest\CMSBackups" --private-directory-confirmed
```

- Run as the same authenticated account. Start with **Run only when user is logged on** and verify it works. Logged-off operation needs separate verification of permissions/authentication.
- Settings: run as soon as possible after a missed start; do not start a new instance if already running. An interrupted export can leave a lock directory; investigate that no export is active before removing the lock manually. Do not solve failures by deleting earlier successful backups.
- Run the task manually once. Confirm **Last Run Result = 0**, a new `archive-checked` manifest and a successful `--check`. Record the real date/result privately. Then verify the first scheduled execution too.

Run the freshness command daily, including after missed starts. It fails if no checked archive exists, the newest checked archive is at least 24 hours old, its timestamp is in the future, or its checksum differs. Task Scheduler does not automatically notify you of these failures: review its history/result and the freshness check daily until an existing alert mechanism is configured and tested. This is not yet unattended monitoring.

Run an additional export using the same command before bulk CMS edits/imports. This backup tool performs no dataset writes or restore actions.

## What the runner verifies

The pinned CLI exports in stream mode with default documents/drafts/assets. No filters or asset-verification bypass are added. Both CLI output streams and CLI temporary export files stay in the private run folder. The child process opts out of Sanity CLI telemetry/update notifications; this does not change website measurement settings. A subprocess failure, warning/skip/error text, unreadable tar/gzip, unsafe archive entry name or missing dataset/asset metadata blocks success. A subprocess running for more than one hour is terminated and the run is not accepted. Failed runs remain `.partial`; earlier successes are retained. A successful run gets a SHA-256 manifest only after these checks.

`archive-checked` means these export/archive checks passed. It does not establish document/asset completeness against the live dataset, semantic validity, a restorable archive or a successful recovery. Test a restore in a separately authorised non-production dataset before relying on recovery. No restore/create/import commands are part of this runner.

The freshness result reports `olderThan30Days`. Review those copies against the agreed 30-day retention policy and remove expired copies manually only after confirming a newer checked backup and any incident-preservation needs. Neither successful nor failed runs are pruned automatically. Review partial logs/archives too: they may contain private data. Retention is an operator action until separately tested automation exists.

## Evidence to return

Report only: Windows/Node/CLI versions; private folder access check completed; exact project/dataset confirmed (no credentials); first manual and scheduled run time/result; latest backup age; asset-warning outcome; retention review; remaining gaps. Keep manifests/logs/exports private. Website/CMS recovery targets and remaining rehearsal requirements are in [OPERATIONS-RUNBOOK.md](OPERATIONS-RUNBOOK.md). Visitor browser-local plans are outside these backups.

Official references checked 30 October 2026: [Sanity export guide](https://www.sanity.io/docs/content-lake/exporting-data), [Sanity datasets CLI reference](https://www.sanity.io/docs/cli-reference/cli-datasets). Sanity documents that missing asset binaries can be skipped while an export still completes; this runner conservatively rejects warnings. Exports consume existing API/storage capacity; provider limits still apply.
