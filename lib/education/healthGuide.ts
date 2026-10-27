import type { EvidenceLevel, PillarType } from '@/lib/presets/types';

// General adult guidance reviewed against the linked NHS sources on 2026-10-27.
// Visual explanations describe this app's illustrative model, not clinical rules.
export const PILLAR_GUIDES = {
  Fitness: {
    heading: 'Move more and build capacity',
    goal: 'Movement and strength activity support fitness and everyday function.',
    firstStep: 'Choose a manageable walk, cycle or other activity you enjoy, then build gradually.',
    guidance: 'For adults aged 19–64, NHS guidance describes at least 150 minutes of moderate activity or 75 minutes of vigorous activity each week, plus strengthening activity on at least 2 days. Adapt activity to your health and ability.',
    visual: 'This scene changes colour and movement with weekly aerobic minutes. Its cut-offs below 60 and above 350 minutes are illustrative choices, not exercise limits or personal risk estimates. Strength activity is not represented by this scene.',
    sourceLabel: 'NHS: adult physical activity guidance (19–64)',
    sourceUrl: 'https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-for-adults-aged-19-to-64/',
  },
  Nutrition: {
    heading: 'Build a balanced eating pattern',
    goal: 'Food choices work together across the day and week; a single percentage cannot describe diet quality.',
    firstStep: 'Try adding vegetables, beans or a higher-fibre starchy food to a familiar meal.',
    guidance: 'The NHS Eatwell Guide describes variety and balance across food groups. It does not set a whole-food percentage target for this slider.',
    visual: 'The nutrition scene responds to food-pattern inputs, including the whole-food setting. Its colour is an illustration of those settings, not an assessment of nutrient intake or metabolic health.',
    sourceLabel: 'NHS: the Eatwell Guide',
    sourceUrl: 'https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/',
  },
  Sleep: {
    heading: 'Support sleep and recovery',
    goal: 'Sleep duration, routines and how you feel during the day all matter.',
    firstStep: 'Choose a consistent getting-up time and a regular wind-down routine.',
    guidance: 'Adults generally need 7–9 hours of sleep, with individual variation. Seek support if persistent sleep problems affect daily life; duration alone does not establish sleep quality.',
    visual: 'Below 6 hours, the 3D core becomes slower and dimmer; otherwise it brightens. This illustrates the chosen duration, not sleep stages, brain clearance or measured recovery.',
    sourceLabel: 'NHS: sleep needs and insomnia support',
    sourceUrl: 'https://www.nhs.uk/conditions/insomnia/',
  },
  Stress: {
    heading: 'Make room for coping and recovery',
    goal: 'Managing stress can include practical changes, rest, relaxation and support from other people.',
    firstStep: 'Try a short, comfortable breathing practice, or talk with someone you trust.',
    guidance: 'NHS advice includes manageable targets, breathing exercises and seeking support. A stress rating is a personal description, not a diagnosis.',
    visual: 'A chosen stress rating above 6 changes the seesaw tilt and colour. The seesaw is a metaphor; it does not measure hormones or nervous-system activity.',
    sourceLabel: 'NHS: getting help with stress',
    sourceUrl: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/',
  },
  Systems: {
    heading: 'Connect the habits',
    goal: 'Explore movement, food, sleep and stress together. Social connection and support matter too.',
    firstStep: 'Pick one manageable habit to repeat this week, perhaps an activity with someone else.',
    guidance: 'NHS wellbeing guidance brings together activity, relationships, learning, giving and mindfulness. Sustainable habits and daily function matter more than maximising every slider.',
    visual: 'The combined 3D scene currently responds to activity, sleep and stress settings. Nutrition and strength do not change its combined colour. It is not a complete model of health or an overall health score.',
    sourceLabel: 'NHS: five steps to mental wellbeing',
    sourceUrl: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/',
  },
} satisfies Record<PillarType, {
  heading: string;
  goal: string;
  firstStep: string;
  guidance: string;
  visual: string;
  sourceLabel: string;
  sourceUrl: string;
}>;

export const PARAMETER_GUIDES = {
  aerobic: {
    label: 'Weekly aerobic activity',
    hint: 'Weekly movement minutes. Intensity matters; see the Guide.',
    meaning: 'MVPA means moderate-to-vigorous physical activity. Moderate activity makes you breathe faster while still allowing conversation. This simplified slider does not convert vigorous minutes into moderate-equivalent minutes.',
  },
  sleep: {
    label: 'Sleep Duration',
    hint: 'Adults often need 7–9 hours; quality and routine also matter.',
    meaning: 'Hours of sleep per night in the scenario. This setting does not measure sleep quality, regularity or sleep disorders.',
  },
  nutrition: {
    label: 'Whole Food Ratio',
    hint: 'An exploration setting, not a validated nutrition target.',
    meaning: 'An approximate share of food described as whole or minimally processed in the scenario. It is not a measured diet-quality score; use the Eatwell Guide for a balanced eating pattern.',
  },
  stress: {
    label: 'Perceived Stress Level',
    hint: 'A chosen rating: 1 is lower stress, 10 is higher stress.',
    meaning: 'A subjective stress rating for exploring the scene. It is not a clinical test or a measurement of cortisol, heart-rate variability or nervous-system balance.',
  },
} as const;

export const EVIDENCE_GUIDES: Record<EvidenceLevel, string> = {
  'Guideline-level': 'Tagged as drawing on published guidance. Check the source, its audience and how it applies to the scenario.',
  'High-quality review': 'Tagged as drawing on a research review. Relevance depends on the studies and how their findings are used.',
  Emerging: 'Early or developing evidence; conclusions may change.',
  'Emerging / Review': 'Developing evidence or a review of it; check the original research and its limits.',
  Experimental: 'Exploratory content. It does not establish a proven health intervention or a routine recommendation.',
};

export const ENGINE_GLOSSARY = [
  ['Core and lattice', 'The central shape and outer mesh are visual metaphors for interacting habits. They are not an anatomical scan or a picture of tissue damage.'],
  ['Colour and movement', 'Colours are specific to each scene. Blue or purple can identify a scene rather than a warning. Movement and glow respond to selected inputs; they are not measured body signals.'],
  ['Particles', 'Visual texture. Lite 3D uses fewer particles to reduce graphics work; their number is not a health measure.'],
  ['2D shapes', 'Bars, circles, waves and the gauge illustrate the selected parameter values. Read their labels and values rather than treating their size as a health score.'],
  ['CBT-I', 'Cognitive behavioural therapy for insomnia: a structured approach to thoughts and behaviours that keep sleep problems going.'],
  ['Circadian', 'Relating to the roughly 24-hour body clock and daily rhythms.'],
  ['HRV', 'Heart-rate variability: variation in the time between heartbeats. This app does not measure it.'],
  ['Allostatic resilience', 'Scenario wording about coping with demands and recovering. The app does not calculate or measure this capacity.'],
  ['Shield, fog, micro-cracks and resonance', 'Storytelling terms used in some scenario notes. They are not observations of hormones, tissue damage or a physical structure in your body.'],
] as const;
