import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN are required.');
}

const seed = JSON.parse(
  await readFile(new URL('./pillars-seed-data-v3.json', import.meta.url), 'utf8')
);

const documents = [
  ...seed.pillars,
  ...seed.scenarioPresets,
  ...seed.storyboardScenes,
  seed.globalNarrative,
];

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const transaction = documents.reduce(
  (currentTransaction: ReturnType<typeof client.transaction>, document: { _id: string }) =>
    currentTransaction.createOrReplace(document),
  client.transaction()
);

const result = await transaction.commit();
console.log(`Imported ${documents.length} Sanity documents: ${result.transactionId}`);
