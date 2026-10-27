import React, { useId } from 'react';

/**
 * 2D SVG FALLBACK ENGINE COMPONENT
 * Path: components/HealthEngine2DFallback.tsx
 * 
 * Provides an accessible, lightweight vector fallback for low-power hardware,
 * mobile battery-saver modes, and Tier 3 rendering.
 */

export interface FallbackProps {
  activePillar?: 'Fitness' | 'Nutrition' | 'Sleep' | 'Stress' | 'Systems';
  aerobicMins?: number;
  sleepDuration?: number;
  wholeFoodRatio?: number;
  stressLevel?: number;
  healthStatus?: 'optimal' | 'warning' | 'critical' | 'manual';
}

export const HealthEngine2DFallback: React.FC<FallbackProps> = ({
  activePillar = 'Systems',
  aerobicMins = 180,
  sleepDuration = 8.0,
  wholeFoodRatio = 75,
  stressLevel = 3,
  healthStatus = 'optimal'
}) => {
  const id = useId();

  // Status Colors
  const statusColors = {
    optimal: '#10B981', // Emerald
    warning: '#F59E0B', // Amber
    critical: '#EF4444', // Rose
    manual: '#64748B' // Slate
  };

  const coreColor = statusColors[healthStatus];

  // Calculate dynamic 2D vector parameters based on health inputs
  const sleepWaveAmplitude = Math.min(Math.max((sleepDuration / 8) * 35, 10), 50);
  const stressAngle = (stressLevel / 10) * 120 - 60; // -60 to +60 degrees
  const fitnessBarHeight = (aerobicMins / 300) * 120;
  const nutritionCircleRadius = (wholeFoodRatio / 100) * 45 + 15;

  return (
    <div
      data-testid="health-engine-2d-fallback"
      className="w-full max-w-2xl mx-auto min-w-0 bg-slate-900/90 p-4 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="min-w-0">
          <p className="text-xs font-mono tracking-widest text-emerald-400 uppercase">2D OVERVIEW</p>
          <h2 className="text-base font-semibold text-slate-100">Interactive 2D Vector Health Engine</h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Preset status</span>
          <span style={{ color: healthStatus === 'manual' ? '#CBD5E1' : coreColor }} className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950/60 border border-current">
            {healthStatus.toUpperCase()}
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-300">Selected pillar: {activePillar}</p>

        {/* Central SVG Canvas */}
        <svg
          viewBox="0 0 600 400"
          role="img"
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-description`}
          className="w-full h-auto"
        >
          <title id={`${id}-title`}>Current parameter illustration</title>
          <desc id={`${id}-description`}>
            Selected pillar: {activePillar}. Preset status: {healthStatus}.
            Aerobic activity: {aerobicMins} minutes per week.
            Whole food ratio: {wholeFoodRatio} percent.
            Sleep duration: {sleepDuration} hours per night.
            Perceived stress: {stressLevel} out of 10.
          </desc>
          <defs>
            {/* Core Bioluminescent Glow */}
            <radialGradient id={`${id}-coreGlow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={coreColor} stopOpacity="0.8" />
              <stop offset="50%" stopColor={coreColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor="#090D16" stopOpacity="0" />
            </radialGradient>

            {/* Vascular Gradient */}
            <linearGradient id={`${id}-fitnessGrad`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#064E3B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Sleep Wave Gradient */}
            <linearGradient id={`${id}-sleepGrad`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* BACKGROUND SYSTEM GRID */}
          <pattern id={`${id}-grid`} width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E293B" strokeWidth="0.5" />
          </pattern>
          <rect width="600" height="400" fill={`url(#${id}-grid)`} rx="12" />

          {/* 1. FITNESS VECTOR: Vascular/Muscle Pillar Bar */}
          <g transform="translate(80, 260)">
            <rect x="-20" y={-fitnessBarHeight} width="40" height={fitnessBarHeight} rx="6" fill={`url(#${id}-fitnessGrad)`} />
            <text x="0" y="25" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">FITNESS</text>
            <text x="0" y="40" textAnchor="middle" fill="#10B981" fontSize="10" fontFamily="monospace">{aerobicMins}m MVPA</text>
          </g>

          {/* 2. NUTRITION VECTOR: Glycemic & Gut Biofilm Orbit */}
          <g transform="translate(220, 200)">
            <circle r={nutritionCircleRadius} fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 3" />
            <circle r={nutritionCircleRadius * 0.6} fill="#F59E0B" fillOpacity="0.2" />
            <text x="0" y="70" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">NUTRITION</text>
            <text x="0" y="85" textAnchor="middle" fill="#F59E0B" fontSize="10" fontFamily="monospace">{wholeFoodRatio}% Whole</text>
          </g>

          {/* 3. SLEEP VECTOR: Circadian Sine Wave */}
          <g transform="translate(360, 200)">
            <path
              d={`M -60 0 Q -30 ${-sleepWaveAmplitude}, 0 0 T 60 0`}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="0" cy="0" r="5" fill="#8B5CF6" />
            <text x="0" y="70" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">SLEEP</text>
            <text x="0" y="85" textAnchor="middle" fill="#8B5CF6" fontSize="10" fontFamily="monospace">{sleepDuration}h / night</text>
          </g>

          {/* 4. STRESS VECTOR: Autonomic Gauge */}
          <g transform="translate(500, 200)">
            <path d="M -40 0 A 40 40 0 0 1 40 0" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <g transform={`rotate(${stressAngle})`}>
              <line x1="0" y1="0" x2="0" y2="-35" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="0" r="4" fill="#F43F5E" />
            </g>
            <text x="0" y="70" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">STRESS</text>
            <text x="0" y="85" textAnchor="middle" fill="#F43F5E" fontSize="10" fontFamily="monospace">Lvl {stressLevel}/10</text>
          </g>

          {/* CENTRAL VITALITY CORE MESH (CONNECTING SYSTEM) */}
          <g transform="translate(300, 110)">
            <circle r="50" fill={`url(#${id}-coreGlow)`} />
            <circle r="22" fill="#090D16" stroke={coreColor} strokeWidth="3" />
            <circle r="8" fill={coreColor} />
            <text x="0" y="-32" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontFamily="monospace" fontWeight="bold">VITALITY CORE</text>
          </g>

          {/* INTERDEPENDENCE CONNECTING RAYS */}
          <line x1="80" y1="180" x2="260" y2="110" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4 4" />
          <line x1="220" y1="150" x2="280" y2="110" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4 4" />
          <line x1="360" y1="150" x2="320" y2="110" stroke="#8B5CF6" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4 4" />
          <line x1="500" y1="180" x2="340" y2="110" stroke="#F43F5E" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4 4" />
        </svg>

      <section aria-labelledby={`${id}-values`} className="border-t border-slate-800 pt-4">
        <h3 id={`${id}-values`} className="text-sm font-semibold">Current parameter values</h3>
        <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-400">Aerobic activity</dt>
            <dd className="font-mono text-emerald-300">{aerobicMins} minutes/week</dd>
          </div>
          <div>
            <dt className="text-slate-400">Whole food ratio</dt>
            <dd className="font-mono text-amber-300">{wholeFoodRatio}%</dd>
          </div>
          <div>
            <dt className="text-slate-400">Sleep duration</dt>
            <dd className="font-mono text-violet-300">{sleepDuration} hours/night</dd>
          </div>
          <div>
            <dt className="text-slate-400">Perceived stress</dt>
            <dd className="font-mono text-rose-300">{stressLevel} / 10</dd>
          </div>
        </dl>
      </section>
      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        {healthStatus === 'manual'
          ? 'Manual settings. Select a preset to view its evidence summary.'
          : 'Educational preset status. View the clinical summary for its evidence.'}
      </p>
    </div>
  );
};

export default HealthEngine2DFallback;
