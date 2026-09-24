import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  throw new Error(
    'NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN are required.'
  );
}

const seed = JSON.parse(
  await readFile(
    new URL('./pillars-seed-data-v3.json', import.meta.url),
    'utf8'
  )
);

if (!Array.isArray(seed.pillars) || seed.pillars.length === 0) {
  throw new Error('No pillars found in the seed file.');
}

if (
  !Array.isArray(seed.scenarioPresets) ||
  seed.scenarioPresets.length === 0
) {
  throw new Error('No scenario presets found in the seed file.');
}

const pillarIds = new Set(
  seed.pillars.map((pillar: { _id: string }) => pillar._id)
);

for (const preset of seed.scenarioPresets) {
  const ref = preset.pillar?._ref;

  if (!ref || !pillarIds.has(ref)) {
    throw new Error(
      `Preset ${preset._id} references missing pillar ${ref ?? '<none>'}`
    );
  }
}

const documents = [
  ...seed.pillars,
  ...seed.scenarioPresets,
];

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

console.log(
  `Preparing to import ${documents.length} documents into ${projectId}/${dataset}`
);

for (const document of documents) {
  console.log(` - ${document._id} (${document._type})`);
}

const transaction = documents.reduce(
  (
    tx: ReturnType<typeof client.transaction>,
    document: {
      _id: string;
      _type: string;
      [key: string]: unknown;
    }
  ) => tx.createOrReplace(document),
  client.transaction()
);

const result = await transaction.commit();

console.log(`Import successful: ${result.transactionId}`);
