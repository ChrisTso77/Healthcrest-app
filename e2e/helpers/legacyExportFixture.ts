import type { Page } from '@playwright/test';
// Compatibility tests deliberately seed an OLD saved record after obtaining a
// valid export. This is fixture setup, not app persistence or a migration.
// New no-write contracts are tested independently by planner-confidentiality-check.
export async function seedLegacyFromExport(page: Page) {
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export all drafts as JSON', exact: true }).click();
  const file = await pending;
  const stream = await file.createReadStream();
  if (!stream) throw new Error('Synthetic fixture export unavailable');
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString('utf8');
  JSON.parse(raw);
  await page.evaluate(value => localStorage.setItem('healthcrest.habit-draft.v1', value), raw);
}
