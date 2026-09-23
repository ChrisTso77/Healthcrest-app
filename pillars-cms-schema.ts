const pillarsCmsSchema = [
  {
    name: 'pillar',
    title: 'Pillar',
    type: 'document',
    fields: [
      { name: 'title', type: 'string', validation: (rule: any) => rule.required() },
      { name: 'slug', type: 'slug', options: { source: 'title' }, validation: (rule: any) => rule.required() },
      { name: 'accentColor', type: 'string' },
    ],
  },
  {
    name: 'scenarioPreset',
    title: 'Scenario Preset',
    type: 'document',
    fields: [
      { name: 'title', type: 'string', validation: (rule: any) => rule.required() },
      { name: 'slug', type: 'slug', options: { source: 'title' }, validation: (rule: any) => rule.required() },
      { name: 'healthStatus', type: 'string', options: { list: ['optimal', 'warning', 'critical'] } },
      { name: 'evidenceLevel', type: 'string' },
      { name: 'parameters', type: 'object', fields: [{ name: 'aerobicMins', type: 'number' }, { name: 'strengthDays', type: 'number' }, { name: 'sleepDuration', type: 'number' }, { name: 'wholeFoodRatio', type: 'number' }, { name: 'stressLevel', type: 'number' }, { name: 'alcoholUnits', type: 'number' }] },
      { name: 'visualProps', type: 'object', fields: [{ name: 'coreColor', type: 'string' }, { name: 'emissiveIntensity', type: 'number' }, { name: 'wobbleSpeed', type: 'number' }, { name: 'wobbleFactor', type: 'number' }, { name: 'particleDensity', type: 'number' }] },
      { name: 'narrativeOverlay', type: 'object', fields: [{ name: 'headline', type: 'string' }, { name: 'body', type: 'text' }, { name: 'outcomes', type: 'array', of: [{ type: 'string' }] }] },
      { name: 'pillar', type: 'reference', to: [{ type: 'pillar' }] },
    ],
  },
  {
    name: 'storyboardScene',
    title: 'Storyboard Scene',
    type: 'document',
    fields: [
      { name: 'sceneNumber', type: 'number', validation: (rule: any) => rule.required().integer() },
      { name: 'title', type: 'string', validation: (rule: any) => rule.required() },
      { name: 'visualMetaphor', type: 'text' },
      { name: 'associatedPillar', type: 'reference', to: [{ type: 'pillar' }] },
      { name: 'presets', type: 'array', of: [{ type: 'reference', to: [{ type: 'scenarioPreset' }] }] },
    ],
  },
  {
    name: 'globalNarrative',
    title: 'Global Narrative',
    type: 'document',
    fields: [
      { name: 'bottomLine', type: 'text' },
      { name: 'pillarsSummary', type: 'text' },
      { name: 'clinicalAlignment', type: 'text' },
    ],
  },
];

export default pillarsCmsSchema;
