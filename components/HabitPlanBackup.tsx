'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { formatDay, weekDayDate } from '@/lib/education/habitWeek';
import { habitBackupDifferences } from '@/lib/education/habitBackupComparison';
import { parseSavedHabitDraft, type HabitDrafts, type HabitPillar, type SavedHabitDraft } from '@/lib/education/habitDraft';

const MAX_BACKUP_BYTES = 120_000;
const names = { Fitness: 'Movement', Nutrition: 'Food', Sleep: 'Sleep', Stress: 'Stress & support' } as const;

export function HabitPlanBackup({ drafts, onDownload, onImport, onStatus }: {
  drafts: HabitDrafts;
  onDownload: () => void;
  onImport: (saved: SavedHabitDraft) => void;
  onStatus: (message: string) => void;
}) {
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const sequence = useRef(0);
  const [reading, setReading] = useState(false);
  const [candidate, setCandidate] = useState<{ saved: SavedHabitDraft; name: string; revision: number } | null>(null);
  useEffect(() => () => { sequence.current += 1; }, []);
  useEffect(() => { if (candidate) previewHeading.current?.focus(); }, [candidate]);

  async function readBackup(file: File | undefined) {
    const request = ++sequence.current;
    setCandidate(null);
    setReading(false);
    onStatus('');
    if (!file) return;
    if (file.size === 0 || file.size > MAX_BACKUP_BYTES) {
      if (fileInput.current) fileInput.current.value = '';
      onStatus('Choose a non-empty Healthcrest JSON backup up to 120 KB. Your page edits are unchanged.');
      return;
    }
    setReading(true);
    onStatus('Checking the backup on this device.');
    try {
      const raw = await file.text();
      if (request !== sequence.current) return;
      const saved = parseSavedHabitDraft(raw);
      setReading(false);
      if (!saved) {
        if (fileInput.current) fileInput.current.value = '';
        onStatus('That file is not a compatible Healthcrest backup. Your page edits and saved copy are unchanged.');
        return;
      }
      setCandidate({ saved, name: file.name.slice(0, 180) + (file.name.length > 180 ? '…' : ''), revision: request });
      onStatus('Backup checked. Review its summary before replacing your page drafts.');
    } catch {
      if (request !== sequence.current) return;
      setReading(false);
      if (fileInput.current) fileInput.current.value = '';
      onStatus('The backup could not be read. Your page edits and saved copy are unchanged.');
    }
  }

  function cancel() {
    sequence.current += 1;
    setReading(false);
    setCandidate(null);
    if (fileInput.current) fileInput.current.value = '';
    onStatus('Backup import cancelled. Your page edits and saved copy are unchanged.');
    fileInput.current?.focus();
  }

  const comparison = candidate ? (Object.keys(names) as HabitPillar[]).map(pillar => ({
    pillar, changes: habitBackupDifferences(drafts[pillar], candidate.saved.drafts[pillar]),
  })) : [];

  function apply() {
    if (!candidate) return;
    sequence.current += 1;
    onImport(candidate.saved);
    setCandidate(null);
    if (fileInput.current) fileInput.current.value = '';
  }

  return (
    <section id="plan-backup-controls" tabIndex={-1} aria-labelledby={id + '-title'} className="hc-plan-backup">
      <h3 id={id + '-title'}>Keep a backup or move your plan</h3>
      <p>Download a backup of the current page drafts, notes and current weeks for all four pillars. You can choose that file in the planner on another device. This is a manual transfer; plans do not sync automatically.</p>
      <p>The backup contains your notes and is not encrypted by Healthcrest. Keep it somewhere suitable for the personal information you include. Deleting a saved browser draft does not delete this file.</p>
      <button type="button" onClick={onDownload}>Download all-pillar backup</button>
      <div className="hc-backup-file">
        <label htmlFor={id + '-file'}>Choose a Healthcrest backup</label>
        <p id={id + '-file-help'}>Choose a JSON backup up to 120 KB. The file is read in this browser and is not uploaded. Selecting it does not replace your drafts.</p>
        <input ref={fileInput} id={id + '-file'} type="file" accept=".json,application/json"
          aria-describedby={id + '-file-help'} onChange={event => { void readBackup(event.currentTarget.files?.[0]); }} />
      </div>
      {reading && <p>Checking the file… You can cancel while it is being read.</p>}
      {candidate && <section className="hc-backup-preview" aria-labelledby={id + '-preview-title'}>
        <h4 id={id + '-preview-title'} tabIndex={-1} ref={previewHeading}>Review this backup</h4>
        <p className="hc-backup-filename">File: {candidate.name}</p>
        <p>Contains four pillar drafts and {Object.values(candidate.saved.drafts).filter(draft => draft.week !== null).length} current seven-day plans. Opens with {names[candidate.saved.selected]} selected.</p>
        <p>Using this backup replaces all four drafts, notes and current weeks on this page. Your saved browser copy stays as it is until you choose Save on this device. Download a backup of your current page first if you want to keep it.</p>
        <p className="hc-backup-change-count">{comparison.filter(item => item.changes.length > 0).length} of 4 pillar drafts differ from this page.</p>
        <details key={candidate.revision} className="hc-backup-compare">
          <summary>Compare the backup with this page</summary>
          <p>This compares the backup with your current page edits, including text and spacing. It does not check the separately saved browser copy or tell which copy is newer.</p>
          <p>Daily notes, reflection notes and weekly reviews are not repeated here. If they differ, the changed part is listed.</p>
          {comparison.map(({ pillar, changes }) => <article key={pillar} aria-labelledby={id + '-compare-' + pillar}>
            <h5 id={id + '-compare-' + pillar}>{names[pillar]}</h5>
            {changes.length === 0 ? <p>Matches the current page draft and week.</p> : <>
              <p>Different parts:</p>
              <ul>{changes.map(change => <li key={change}>{change}</li>)}</ul>
            </>}
            <div className="hc-backup-compare-copies">
              {[{ label: 'Current page', draft: drafts[pillar] }, { label: 'Backup', draft: candidate.saved.drafts[pillar] }].map(({ label, draft }) => <div key={label}>
                <h6>{label}</h6>
                <p><strong>Next step action:</strong></p>
                <p className="hc-backup-compare-action">{draft.action.trim() ? draft.action : 'No action written yet.'}</p>
                {draft.week ? <>
                  <p><strong>Week:</strong> <time dateTime={draft.week.startDate}>{formatDay(draft.week.startDate)}</time> to <time dateTime={weekDayDate(draft.week.startDate, 6)}>{formatDay(weekDayDate(draft.week.startDate, 6))}</time></p>
                  <p><strong>Week action:</strong></p>
                  <p className="hc-backup-compare-action">{draft.week.action}</p>
                </> : <p>No dated week.</p>}
              </div>)}
            </div>
          </article>)}
        </details>
        <button type="button" onClick={apply}>Replace page drafts with backup</button>
      </section>}
      {(reading || candidate) && <button type="button" onClick={cancel}>Cancel backup import</button>}
    </section>
  );
}
