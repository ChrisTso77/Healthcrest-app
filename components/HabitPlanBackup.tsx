'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { parseSavedHabitDraft, type SavedHabitDraft } from '@/lib/education/habitDraft';

const MAX_BACKUP_BYTES = 120_000;
const names = { Fitness: 'Movement', Nutrition: 'Food', Sleep: 'Sleep', Stress: 'Stress & support' } as const;

export function HabitPlanBackup({ value, onImport, onStatus }: {
  value: SavedHabitDraft;
  onImport: (saved: SavedHabitDraft) => void;
  onStatus: (message: string) => void;
}) {
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const sequence = useRef(0);
  const [reading, setReading] = useState(false);
  const [candidate, setCandidate] = useState<{ saved: SavedHabitDraft; name: string } | null>(null);
  useEffect(() => () => { sequence.current += 1; }, []);

  function downloadBackup() {
    let url: string | undefined;
    let link: HTMLAnchorElement | undefined;
    try {
      const saved = parseSavedHabitDraft(JSON.stringify(value));
      if (!saved) throw new Error('Invalid backup');
      url = URL.createObjectURL(new Blob([JSON.stringify(saved, null, 2)], { type: 'application/json;charset=utf-8' }));
      link = document.createElement('a');
      link.href = url;
      link.download = 'healthcrest-plan-backup.json';
      document.body.appendChild(link);
      link.click();
      onStatus('Backup download started for all four pillars. This does not save your browser draft.');
    } catch {
      onStatus('Backup download is unavailable in this browser. Your page edits are unchanged; you can try the text download or printing.');
    } finally {
      link?.remove();
      if (url) {
        const downloadUrl = url;
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      }
    }
  }

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
      setCandidate({ saved, name: file.name.slice(0, 180) + (file.name.length > 180 ? '…' : '') });
      onStatus('Backup checked. Review its summary before replacing your page drafts.');
      requestAnimationFrame(() => previewHeading.current?.focus());
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
      <button type="button" onClick={downloadBackup}>Download all-pillar backup</button>
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
        <button type="button" onClick={apply}>Replace page drafts with backup</button>
      </section>}
      {(reading || candidate) && <button type="button" onClick={cancel}>Cancel backup import</button>}
    </section>
  );
}
