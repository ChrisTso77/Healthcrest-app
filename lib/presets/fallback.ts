import type { CanonicalScenarioPreset } from './types';

export const FALLBACK_PRESETS: CanonicalScenarioPreset[] = [
  {
    id: 'integrated-harmony',
    slug: 'integrated-harmony',
    title: 'Integrated Harmony (Scene 5)',
    pillar: 'Systems',
    status: 'optimal',
    evidenceLevel: 'Guideline-level',
    parameters: { aerobicMins: 180, strengthDays: 2, sleepDuration: 8, wholeFoodRatio: 80, stressLevel: 2, alcoholUnits: 2 },
    headline: 'Maximum Allostatic Resilience & Systemic Equilibrium',
    outcomes: ['Tetrapod Balance Maintained (0° Tilt)', 'Low Chronic Disease Hazard Ratio', 'Oxytocin Shield Active'],
    cameraShot: 'shot-1-orbit'
  },
  {
    id: 'single-pillar-failure',
    slug: 'single-pillar-failure',
    title: 'Single-Pillar Failure (Scene 5)',
    pillar: 'Systems',
    status: 'warning',
    evidenceLevel: 'High-quality review',
    parameters: { aerobicMins: 300, strengthDays: 4, sleepDuration: 4.5, wholeFoodRatio: 50, stressLevel: 8, alcoholUnits: 18 },
    headline: 'Structural Imbalance: Sleep & Stress Failure',
    outcomes: ['Platform Tilts 28° Off-Axis', 'Structural Micro-cracks on Core', 'Corrosive Friction Fog Active'],
    cameraShot: 'shot-2-failure'
  },
  {
    id: 'uk-cmo-optimal',
    slug: 'uk-cmo-optimal',
    title: 'UK CMO Optimal Zone',
    pillar: 'Fitness',
    status: 'optimal',
    evidenceLevel: 'Guideline-level',
    parameters: { aerobicMins: 180, strengthDays: 2, sleepDuration: 8, wholeFoodRatio: 80, stressLevel: 3, alcoholUnits: 4 },
    headline: 'Optimal Functional Capacity & Allostatic Resilience',
    outcomes: ['-35% CVD Mortality Risk', '-40% Type 2 Diabetes Risk', 'Enhanced Vascular Elasticity'],
    cameraShot: 'shot-1-orbit'
  },
  {
    id: 'sleep-rung1-foundations',
    slug: 'sleep-rung1-foundations',
    title: 'Sleep Rung 1: Foundations',
    pillar: 'Sleep',
    status: 'optimal',
    evidenceLevel: 'Guideline-level',
    parameters: { aerobicMins: 150, strengthDays: 2, sleepDuration: 8, wholeFoodRatio: 75, stressLevel: 3, alcoholUnits: 0 },
    headline: '7-9h Restorative Sleep & Substance Cut-offs',
    outcomes: ['High-amplitude 24h Circadian Wave', 'Lower Cardiometabolic Hazard', 'Zero Nocturnal Micro-arousals'],
    cameraShot: 'shot-3-macro'
  },
  {
    id: 'sleep-rung2-behavioral',
    slug: 'sleep-rung2-behavioral',
    title: 'Sleep Rung 2: Behavioral & CBT-I',
    pillar: 'Sleep',
    status: 'optimal',
    evidenceLevel: 'High-quality review',
    parameters: { aerobicMins: 150, strengthDays: 2, sleepDuration: 8, wholeFoodRatio: 80, stressLevel: 2, alcoholUnits: 0 },
    headline: 'Morning Light Anchors & Stimulus Control',
    outcomes: ['Phase-aligned Circadian Clock', 'Reduced Sleep Onset Latency', 'Adenosine Sleep Pressure Optimization'],
    cameraShot: 'shot-3-macro'
  },
  {
    id: 'sleep-rung3-circadian',
    slug: 'sleep-rung3-circadian',
    title: 'Sleep Rung 3: Thermal & Chrono',
    pillar: 'Sleep',
    status: 'optimal',
    evidenceLevel: 'Emerging / Review',
    parameters: { aerobicMins: 180, strengthDays: 3, sleepDuration: 8.5, wholeFoodRatio: 85, stressLevel: 2, alcoholUnits: 0 },
    headline: 'Pre-bed Thermal Drop & Blue-Light Shielding',
    outcomes: ['Deep Slow-Wave (N3) Expansion', 'Melatonin Secretion Protection', 'Vagal HRV Tone Recovery'],
    cameraShot: 'shot-3-macro'
  },
  {
    id: 'sleep-rung4-experimental',
    slug: 'sleep-rung4-experimental',
    title: 'Sleep Rung 4: Acoustic Delta & Flush',
    pillar: 'Sleep',
    status: 'optimal',
    evidenceLevel: 'Experimental',
    parameters: { aerobicMins: 200, strengthDays: 3, sleepDuration: 8.5, wholeFoodRatio: 90, stressLevel: 1, alcoholUnits: 0 },
    headline: 'Acoustic Pink-Noise Delta & Glymphatic Flush',
    outcomes: ['Amplified Slow Delta Oscillations', 'Bioluminescent Glymphatic Clearance', 'Peak Recovery Readiness'],
    cameraShot: 'shot-3-macro'
  },
  {
    id: 'active-vagal-reset',
    slug: 'active-vagal-reset',
    title: 'Active Parasympathetic Reset',
    pillar: 'Stress',
    status: 'optimal',
    evidenceLevel: 'High-quality review',
    parameters: { aerobicMins: 150, strengthDays: 2, sleepDuration: 7.5, wholeFoodRatio: 70, stressLevel: 2, alcoholUnits: 0 },
    headline: 'Parasympathetic Dominance & Expanded HRV',
    outcomes: ['Vagus Nerve Stimulation', 'Normalised Blood Pressure', 'Suppressed Pro-inflammatory Cytokines'],
    cameraShot: 'shot-4-resonance'
  }
];
