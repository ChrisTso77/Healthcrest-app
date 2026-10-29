// Fixed public routes only. Each Lighthouse invocation starts with its normal storage reset.
export const PERFORMANCE_PROFILES = Object.freeze([
  { name: 'home', path: '/', formFactor: 'mobile' },
  { name: 'start', path: '/start', formFactor: 'mobile' },
  { name: 'guide-mobile', path: '/learn/balanced-meals', formFactor: 'mobile' },
  { name: 'planner-mobile', path: '/next-step?pillar=sleep', formFactor: 'mobile' },
  { name: 'explorer-2d-mobile', path: '/engine?pillar=sleep&view=2d', formFactor: 'mobile' },
  { name: 'guide-desktop', path: '/learn/balanced-meals', formFactor: 'desktop' },
  { name: 'planner-desktop', path: '/next-step?pillar=sleep', formFactor: 'desktop' },
  { name: 'explorer-2d-desktop', path: '/engine?pillar=sleep&view=2d', formFactor: 'desktop' },
].map(profile => Object.freeze(profile)));

export function lighthouseProfileArgs(formFactor) {
  // Changing only --form-factor changes scoring, not the complete desktop configuration.
  if (formFactor === 'desktop') return ['--preset=desktop'];
  if (formFactor === 'mobile') return ['--form-factor=mobile'];
  throw new Error('Unsupported Lighthouse form factor.');
}
