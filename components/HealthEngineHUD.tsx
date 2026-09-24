import React, { useRef, useState } from 'react';
import type {
  CanonicalPresetParameters,
  CanonicalScenarioPreset,
  HealthStatus as CanonicalHealthStatus,
  PillarType as CanonicalPillarType,
} from '@/lib/presets/types';
import { FALLBACK_PRESETS } from '@/lib/presets/fallback';
import {
  Activity,
  Apple,
  Moon,
  Brain,
  Layers,
  Sun,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ChevronUp,
  ChevronDown,
  Zap,
  RotateCcw,
  Camera
} from 'lucide-react';

// Shared canonical health-engine domain types
export type PillarType = CanonicalPillarType;
export type HealthStatus = CanonicalHealthStatus;
export type RenderMode = 'high-3d' | 'lite-3d' | '2d-canvas';
export type HealthParameters = CanonicalPresetParameters;
export type PresetScenario = CanonicalScenarioPreset;

export interface CameraState {
  orbitAzimuth: number; // Horizontal rotation angle in degrees
  orbitElevation: number; // Vertical angle in degrees
  zoomDistance: number; // Camera zoom level (1.0 = baseline)
  activeShotId: string; // Active camera shot preset
  isGesturing: boolean;
  requestRevision: number; // Forces repeated requests for the same shot to reapply
}

export interface HealthEngineHUDProps {
  presets?: PresetScenario[];
  renderMode: RenderMode;
  onPillarChange?: (pillar: PillarType) => void;
  onRenderModeChange?: (mode: RenderMode) => void;
  onParameterChange?: (key: keyof HealthParameters, value: number) => void;
  onPresetLoad?: (preset: PresetScenario) => void;
  onCameraChange?: (camera: CameraState) => void;
}

// Scene 5 & Sleep Ladder Presets
// Scene 5 Camera Shot Director Presets
const CAMERA_SHOTS = [
  { id: 'shot-1-orbit', name: 'Shot 1: Equilibrium Orbit', azimuth: 45, elevation: 20, zoom: 1.0, desc: 'Wide panoramic orbit around balanced tetrapod core' },
  { id: 'shot-2-failure', name: 'Shot 2: Single-Pillar Strain', azimuth: 135, elevation: 35, zoom: 1.4, desc: 'Dolly-in focus on buckling sleep & stress legs' },
  { id: 'shot-3-macro', name: 'Shot 3: Core Deformation', azimuth: 0, elevation: 10, zoom: 2.2, desc: 'Macro view of geodesic core vertex displacement' },
  { id: 'shot-4-resonance', name: 'Shot 4: Systemic Resonance', azimuth: 220, elevation: 50, zoom: 0.8, desc: 'High isometric overview of social resonance dome' }
];

export const HealthEngineHUD: React.FC<HealthEngineHUDProps> = ({
  presets = [],
  renderMode,
  onPillarChange,
  onRenderModeChange,
  onParameterChange,
  onPresetLoad,
  onCameraChange,
}) => {
  // Navigation & Control States
  const [activePillar, setActivePillar] = useState<PillarType>('Systems');
  const [isDayTime, setIsDayTime] = useState<boolean>(false);
  const [isDockOpen, setIsDockOpen] = useState<boolean>(true);

  // Touch Gesture Camera State
  const [camera, setCamera] = useState<CameraState>({
    orbitAzimuth: 45,
    orbitElevation: 20,
    zoomDistance: 1.0,
    activeShotId: 'shot-1-orbit',
    isGesturing: false,
    requestRevision: 0
  });

  const cameraRequestRevision = useRef(0);

  // Active Health Parameters State
  const [params, setParams] = useState<HealthParameters>({
    aerobicMins: 180,
    strengthDays: 2,
    sleepDuration: 8,
    wholeFoodRatio: 80,
    stressLevel: 2,
    alcoholUnits: 2
  });

  const [activePreset, setActivePreset] = useState<PresetScenario | null>(
    FALLBACK_PRESETS[0]
  );

  const availablePresets = presets.length > 0 ? presets : FALLBACK_PRESETS;

  // Load Preset Handler
  const loadPreset = (preset: PresetScenario) => {
    setActivePreset(preset);
    setParams(preset.parameters);
    setActivePillar(preset.pillar);
    onPresetLoad?.(preset);
    if (preset.cameraShot) {
      applyCameraShot(preset.cameraShot);
    }
  };

  // Camera Shot Director Handler
  const applyCameraShot = (shotId: string) => {
    const shot = CAMERA_SHOTS.find(s => s.id === shotId);

    if (shot) {
      cameraRequestRevision.current += 1;

      const nextCamera: CameraState = {
        orbitAzimuth: shot.azimuth,
        orbitElevation: shot.elevation,
        zoomDistance: shot.zoom,
        activeShotId: shot.id,
        isGesturing: false,
        requestRevision: cameraRequestRevision.current,
      };

      setCamera(nextCamera);
      onCameraChange?.(nextCamera);
    }
  };

  // Slider change handler
  const handleParamChange = (key: keyof HealthParameters, val: number) => {
    setParams(prev => ({ ...prev, [key]: val }));
    setActivePreset(null);
    onParameterChange?.(key, val);
  };

  const pillarIcons: Record<PillarType, React.ReactNode> = {
    Fitness: <Activity className="w-4 h-4 text-emerald-400" />,
    Nutrition: <Apple className="w-4 h-4 text-amber-400" />,
    Sleep: <Moon className="w-4 h-4 text-violet-400" />,
    Stress: <Brain className="w-4 h-4 text-rose-400" />,
    Systems: <Layers className="w-4 h-4 text-cyan-400" />
  };

  const statusBadge: Record<HealthStatus, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    optimal: { label: 'OPTIMAL', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> },
    warning: { label: 'WARNING', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> },
    critical: { label: 'CRITICAL', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> }
  };

  return (
    <div className="relative w-full h-screen bg-transparent text-slate-100 font-sans overflow-hidden select-none">



      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP HEADER NAVIGATION BAR */}
      {/* ------------------------------------------------------------------ */}
      <header className="absolute top-0 inset-x-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between z-30">
        
        {/* Brand Logo & Platform Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-slate-100">HEALTH OPTIMISATION</h1>
            <p className="text-[10px] font-mono text-slate-400 tracking-wider">THE FOUR PILLARS ENGINE v2</p>
          </div>
        </div>

        {/* Pillar Selector Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
          {(['Fitness', 'Nutrition', 'Sleep', 'Stress', 'Systems'] as PillarType[]).map((pillar) => (
            <button
              key={pillar}
              onClick={() => {
                setActivePillar(pillar);
                setActivePreset(null);
                onPillarChange?.(pillar);
              }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                activePillar === pillar
                  ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              {pillarIcons[pillar]}
              <span>{pillar}</span>
            </button>
          ))}
        </nav>

        {/* Lighting & Rendering Switcher */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsDayTime(!isDayTime)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
            title="Toggle Circadian Lighting Mode"
          >
            {isDayTime ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-400" />}
          </button>

          <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
            {(['high-3d', 'lite-3d', '2d-canvas'] as RenderMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  onRenderModeChange?.(mode);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono capitalize transition-all ${
                  renderMode === mode
                    ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* 2. FLOATING CLINICAL HUD CARD (TOP-LEFT) */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute top-20 left-6 w-80 bg-slate-900/80 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 shadow-2xl z-20">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono tracking-wider uppercase text-slate-300">CLINICAL HUD</span>
          </div>
          
          {activePreset ? (
            <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${statusBadge[activePreset.status].bg} ${statusBadge[activePreset.status].text} ${statusBadge[activePreset.status].border}`}>
              {statusBadge[activePreset.status].icon}
              <span>{statusBadge[activePreset.status].label}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border bg-slate-800 text-slate-300 border-slate-700">
              <span>MANUAL</span>
            </div>
          )}
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">EVIDENCE LEVEL</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700/50">
              {activePreset?.evidenceLevel ?? 'Manual state'}
            </span>
          </div>

          <h3 className="text-xs font-semibold text-slate-100 leading-snug">
            {activePreset?.headline ?? 'Manual pillar and parameter configuration'}
          </h3>

          <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              {activePreset ? 'Key Health Outcomes:' : 'State Mode:'}
            </span>

            {activePreset ? (
              activePreset.outcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-300">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{outcome}</span>
                </div>
              ))
            ) : (
              <div className="flex items-start space-x-2 text-[11px] text-slate-300">
                <span className="text-cyan-400 font-bold">•</span>
                <span>No evidence preset is currently applied.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. STORYBOARD CAMERA DIRECTOR & TOUCH SHOTS (RIGHT FLOATING PANEL) */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute top-20 right-6 w-60 bg-slate-900/80 backdrop-blur-md border border-slate-800/90 rounded-2xl p-3 shadow-2xl z-20">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-800/80 mb-2">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono tracking-wider uppercase text-slate-300">SCENE 5 CAMERA DIRECTOR</span>
        </div>

        <div className="space-y-1.5">
          {CAMERA_SHOTS.map((shot) => (
            <button
              key={shot.id}
              onClick={() => applyCameraShot(shot.id)}
              className={`w-full text-left p-2 rounded-lg text-xs font-medium transition-all flex flex-col border ${
                camera.activeShotId === shot.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-950/40 text-slate-400 border-slate-800/80 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-[11px]">{shot.name}</span>
                {camera.activeShotId === shot.id && <Zap className="w-3 h-3 text-cyan-400 flex-shrink-0" />}
              </div>
              <span className="text-[9px] text-slate-500 mt-0.5 leading-tight">{shot.desc}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => applyCameraShot('shot-1-orbit')}
          className="w-full mt-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center justify-center space-x-1 border border-slate-700/50"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET CAMERA VIEWPORT</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. RETRACTABLE CONTROL DOCK & SLIDERS (BOTTOM DRAWER) */}
      {/* ------------------------------------------------------------------ */}
      <div className={`absolute bottom-0 inset-x-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/90 transition-all duration-300 z-30 ${isDockOpen ? 'h-64' : 'h-10'}`}>
        
        <button
          onClick={() => setIsDockOpen(!isDockOpen)}
          className="w-full h-10 px-6 flex items-center justify-between text-xs font-mono text-slate-400 hover:text-slate-200 border-b border-slate-800/50"
        >
          <div className="flex items-center space-x-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-wider uppercase">PARAMETER CONTROLS & SLEEP LADDER PRESETS</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{isDockOpen ? 'COLLAPSE' : 'EXPAND'}</span>
            {isDockOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {isDockOpen && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6 h-52 overflow-y-auto">
            
            {/* Left Col: Scenario Presets List */}
            <div className="md:col-span-4 space-y-2 border-r border-slate-800/80 pr-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">PRESET SCENARIOS & SLEEP LADDER</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {availablePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => loadPreset(preset)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all border ${
                      activePreset?.id === preset.id
                        ? 'bg-slate-800 border-emerald-500/50 text-slate-100 shadow-md'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate">{preset.title}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${statusBadge[preset.status].bg} ${statusBadge[preset.status].text}`}>
                        {preset.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Col: Live Parameter Sliders */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Aerobic Activity (MVPA)</span>
                  <span className="font-mono text-emerald-400">{params.aerobicMins} mins/wk</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400"
                  step="10"
                  value={params.aerobicMins}
                  onChange={(e) => handleParamChange('aerobicMins', Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <span className="text-[9px] font-mono text-slate-500 block">Guideline Target: 150–300 mins/week</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Sleep Duration</span>
                  <span className="font-mono text-violet-400">{params.sleepDuration} hrs/night</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="10"
                  step="0.5"
                  value={params.sleepDuration}
                  onChange={(e) => handleParamChange('sleepDuration', Number(e.target.value))}
                  className="w-full accent-violet-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <span className="text-[9px] font-mono text-slate-500 block">AASM Target: 7.0–9.0 hrs/night</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Whole Food Ratio</span>
                  <span className="font-mono text-amber-400">{params.wholeFoodRatio}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={params.wholeFoodRatio}
                  onChange={(e) => handleParamChange('wholeFoodRatio', Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <span className="text-[9px] font-mono text-slate-500 block">ACLM Target: Plant-predominant whole foods</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Perceived Stress Level</span>
                  <span className="font-mono text-rose-400">{params.stressLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={params.stressLevel}
                  onChange={(e) => handleParamChange('stressLevel', Number(e.target.value))}
                  className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <span className="text-[9px] font-mono text-slate-500 block">Target: Active parasympathetic buffering</span>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default HealthEngineHUD;
