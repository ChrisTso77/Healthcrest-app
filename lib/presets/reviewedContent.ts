import type { CanonicalScenarioPreset, ScenarioEducation } from './types';

type ReviewedContent = Pick<CanonicalScenarioPreset, 'pillar' | 'title' | 'headline' | 'outcomes' | 'evidenceLevel'> & { education: ScenarioEducation };

// Repository-reviewed presentation is authoritative over older CMS copy.
// Check sources and update this catalogue before adding or changing health claims.
export const REVIEWED_SCENARIOS: Record<string, ReviewedContent> = {
  "integrated-harmony": {
    "pillar": "Systems",
    "title": "Connected habits example",
    "headline": "Explore habits together",
    "outcomes": [
      "Consider movement, food, sleep and stress together.",
      "Choose a manageable action that fits your circumstances.",
      "The display does not measure overall health or biological resilience."
    ],
    "evidenceLevel": "Guideline-level",
    "education": {
      "category": "Illustrative comparison",
      "checkedOn": "2026-10-28",
      "limitations": "These are illustrative settings, not personal targets. Sources support the general habit guidance, not the visual rules or a predicted outcome.",
      "sources": [
        {
          "title": "NHS: five steps to mental wellbeing",
          "url": "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/",
          "population": "General wellbeing guidance for the public.",
          "supports": "Activity, connection and manageable everyday actions.",
          "limitations": "Does not validate a combined health score or these example parameter values."
        }
      ]
    }
  },
  "single-pillar-failure": {
    "pillar": "Systems",
    "title": "Short sleep and higher stress example",
    "headline": "Compare a different set of example settings",
    "outcomes": [
      "Notice the chosen sleep duration and stress rating.",
      "The display illustrates inputs; it does not show tissue damage.",
      "Persistent sleep or stress difficulties may need support."
    ],
    "evidenceLevel": "Guideline-level",
    "education": {
      "category": "Illustrative comparison",
      "checkedOn": "2026-10-28",
      "limitations": "These are illustrative settings, not personal targets. Sources support the general habit guidance, not the visual rules or a predicted outcome.",
      "sources": [
        {
          "title": "NHS: insomnia and sleep habits",
          "url": "https://www.nhs.uk/conditions/insomnia/",
          "population": "General adult sleep information; individual needs vary.",
          "supports": "Sleep routines, bedroom comfort and seeking help for persistent difficulties.",
          "limitations": "Does not validate the preset values or predict sleep stages, recovery or brain clearance."
        },
        {
          "title": "NHS: help with stress",
          "url": "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/",
          "population": "General public advice; persistent difficulties may need professional support.",
          "supports": "Manageable goals, comfortable breathing and talking with others.",
          "limitations": "Does not establish changes in blood pressure, inflammation, hormones or heart-rate variability in this app."
        }
      ]
    }
  },
  "uk-cmo-optimal": {
    "pillar": "Fitness",
    "title": "Movement example: weekly activity",
    "headline": "Explore weekly movement",
    "outcomes": [
      "Consider activity intensity as well as duration.",
      "Include strength activity in the wider picture.",
      "No individual disease-risk reduction is calculated."
    ],
    "evidenceLevel": "Guideline-level",
    "education": {
      "category": "Everyday guidance",
      "checkedOn": "2026-10-28",
      "limitations": "These are illustrative settings, not personal targets. Sources support the general habit guidance, not the visual rules or a predicted outcome.",
      "sources": [
        {
          "title": "NHS: activity guidance for adults aged 19–64",
          "url": "https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-for-adults-aged-19-to-64/",
          "population": "Adults aged 19–64; adapt activity to health and ability.",
          "supports": "Weekly activity, strengthening and reducing prolonged sitting.",
          "limitations": "Intensity matters. This slider does not convert vigorous minutes and cannot predict individual disease risk."
        }
      ]
    }
  },
  "sleep-rung1-foundations": {
    "pillar": "Sleep",
    "title": "Sleep example: everyday foundations",
    "headline": "Explore sleep duration and routine",
    "outcomes": [
      "Adults differ in their sleep needs.",
      "A regular routine can be a practical starting point.",
      "The example does not establish sleep quality."
    ],
    "evidenceLevel": "Guideline-level",
    "education": {
      "category": "Everyday guidance",
      "checkedOn": "2026-10-28",
      "limitations": "These are illustrative settings, not personal targets. Sources support the general habit guidance, not the visual rules or a predicted outcome.",
      "sources": [
        {
          "title": "NHS: insomnia and sleep habits",
          "url": "https://www.nhs.uk/conditions/insomnia/",
          "population": "General adult sleep information; individual needs vary.",
          "supports": "Sleep routines, bedroom comfort and seeking help for persistent difficulties.",
          "limitations": "Does not validate the preset values or predict sleep stages, recovery or brain clearance."
        }
      ]
    }
  },
  "sleep-rung2-behavioral": {
    "pillar": "Sleep",
    "title": "Sleep example: routines and support",
    "headline": "Consider habits and support for sleep difficulties",
    "outcomes": [
      "Explore a consistent getting-up time.",
      "CBT for insomnia involves structured care, not a slider setting.",
      "Seek help when persistent difficulties affect daily life."
    ],
    "evidenceLevel": "Guideline-level",
    "education": {
      "category": "Everyday guidance",
      "checkedOn": "2026-10-28",
      "limitations": "These are illustrative settings, not personal targets. Sources support the general habit guidance, not the visual rules or a predicted outcome.",
      "sources": [
        {
          "title": "NHS: insomnia and sleep habits",
          "url": "https://www.nhs.uk/conditions/insomnia/",
          "population": "General adult sleep information; individual needs vary.",
          "supports": "Sleep routines, bedroom comfort and seeking help for persistent difficulties.",
          "limitations": "Does not validate the preset values or predict sleep stages, recovery or brain clearance."
        }
      ]
    }
  },
  "sleep-rung3-circadian": {
    "pillar": "Sleep",
    "title": "Sleep example: bedroom environment",
    "headline": "Consider a comfortable sleep environment",
    "outcomes": [
      "Think about comfort, darkness and quiet.",
      "The app does not measure sleep stages or hormones.",
      "This example is not an advanced sleep protocol."
    ],
    "evidenceLevel": "Guideline-level",
    "education": {
      "category": "Everyday guidance",
      "checkedOn": "2026-10-28",
      "limitations": "These are illustrative settings, not personal targets. Sources support the general habit guidance, not the visual rules or a predicted outcome.",
      "sources": [
        {
          "title": "NHS: insomnia and sleep habits",
          "url": "https://www.nhs.uk/conditions/insomnia/",
          "population": "General adult sleep information; individual needs vary.",
          "supports": "Sleep routines, bedroom comfort and seeking help for persistent difficulties.",
          "limitations": "Does not validate the preset values or predict sleep stages, recovery or brain clearance."
        }
      ]
    }
  },
  "sleep-rung4-experimental": {
    "pillar": "Sleep",
    "title": "Research example: timed sound during sleep",
    "headline": "Read a research example, not a routine recommendation",
    "outcomes": [
      "Laboratory studies used sound timed to measured brain activity.",
      "Reported memory findings differ between studies.",
      "The app delivers no stimulation and predicts no memory or recovery benefit."
    ],
    "evidenceLevel": "Experimental",
    "education": {
      "category": "Research example",
      "checkedOn": "2026-10-28",
      "limitations": "Early laboratory research is not routine advice. The preset values do not reproduce a study protocol or establish a personal benefit.",
      "sources": [
        {
          "title": "Papalambros et al. (2017): acoustic stimulation study",
          "url": "https://pubmed.ncbi.nlm.nih.gov/28337134/",
          "population": "13 cognitively healthy adults aged 60–84; one stimulation and one sham night.",
          "supports": "EEG-timed sound pulses were studied for sleep rhythms and word recall.",
          "limitations": "Small laboratory crossover study. Whole-night slow-wave activity was similar; interval effects and recall findings do not establish home-use benefit or brain clearance."
        },
        {
          "title": "Henin et al. (2019): acoustic stimulation replication",
          "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6831893/",
          "population": "12 healthy adults in a nap experiment and 19 in an overnight experiment; inclusion ages 18–30.",
          "supports": "Sleep-rhythm changes were observed without better performance on the tested memory tasks.",
          "limitations": "Different tasks and protocols limit generalisation. Results do not establish a reliable memory benefit or an insomnia treatment."
        }
      ]
    }
  },
  "active-vagal-reset": {
    "pillar": "Stress",
    "title": "Stress example: coping and support",
    "headline": "Explore manageable ways to cope",
    "outcomes": [
      "Try a comfortable coping practice or seek support.",
      "A chosen stress rating is a personal description.",
      "The app does not measure nervous-system activity or clinical outcomes."
    ],
    "evidenceLevel": "Guideline-level",
    "education": {
      "category": "Everyday guidance",
      "checkedOn": "2026-10-28",
      "limitations": "These are illustrative settings, not personal targets. Sources support the general habit guidance, not the visual rules or a predicted outcome.",
      "sources": [
        {
          "title": "NHS: help with stress",
          "url": "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/",
          "population": "General public advice; persistent difficulties may need professional support.",
          "supports": "Manageable goals, comfortable breathing and talking with others.",
          "limitations": "Does not establish changes in blood pressure, inflammation, hormones or heart-rate variability in this app."
        }
      ]
    }
  }
};

export function applyContentReview(preset: CanonicalScenarioPreset): CanonicalScenarioPreset {
  const content = Object.hasOwn(REVIEWED_SCENARIOS, preset.slug) ? REVIEWED_SCENARIOS[preset.slug] : undefined;
  if (content && content.pillar === preset.pillar) return { ...preset, ...content };
  return {
    ...preset,
    title: 'Unreviewed ' + preset.pillar + ' example',
    headline: 'Example settings awaiting content review',
    outcomes: ['These values remain available for illustration.', 'No health benefit or biological effect has been verified for this scenario.'],
    evidenceLevel: 'Unreviewed',
    education: { category: 'Awaiting review', limitations: 'CMS wording and evidence tags are not displayed until checked against sources in the reviewed catalogue.', sources: [] },
  };
}

export function reviewedFallback(base: Pick<CanonicalScenarioPreset, 'id' | 'slug' | 'pillar' | 'status' | 'parameters' | 'cameraShot'>): CanonicalScenarioPreset {
  return applyContentReview({ ...base, title: '', headline: '', outcomes: [], evidenceLevel: 'Unreviewed' });
}

export const REVIEWED_NARRATIVE = {
  _id: 'global-narrative',
  bottomLine: 'Explore everyday habits and choose a manageable next step.',
  pillarsSummary: 'Movement, food, sleep and stress are connected topics; the engine illustrates selected settings.',
  clinicalAlignment: 'NHS references support general habit guidance. The visual model does not diagnose health or predict individual outcomes.',
};

export function scenarioCategory(preset: CanonicalScenarioPreset): ScenarioEducation['category'] {
  return applyContentReview(preset).education!.category;
}
