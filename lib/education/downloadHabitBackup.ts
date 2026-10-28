import { parseSavedHabitDraft, type SavedHabitDraft } from './habitDraft';

// Called only by an explicit browser download action.
export function downloadHabitBackup(value: SavedHabitDraft): void {
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
  } finally {
    link?.remove();
    if (url) {
      const downloadUrl = url;
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    }
  }
}
