import { useId, useState, type FC, type ReactNode } from 'react';
import type {
  CanonicalPresetParameters,
  CanonicalScenarioPreset,
  HealthStatus,
  PillarType,
  RenderMode,
  CameraState,
} from '@/lib/presets/types';
import {
  CAMERA_SHOTS,
  createCameraStateForShot,
} from '@/lib/camera/cameraShots';
import {
  resolveActivePreset,
  resolveAvailablePresets,
} from '@/lib/presets/presetSelection';
import { createPresetLoadPlan } from '@/lib/presets/createPresetLoadPlan';
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

interface HealthEngineHUDProps {
  isDockOpen: boolean;
  onDockToggle: () => void;
  presets?: CanonicalScenarioPreset[];
  activePillar: PillarType;
  renderMode: RenderMode;
  parameters: CanonicalPresetParameters;
  activePresetId: string | null;
  camera: CameraState;
  onPillarChange?: (pillar: PillarType) => void;
  onRenderModeChange?: (mode: RenderMode) => void;
  onParameterChange?: (key: keyof CanonicalPresetParameters, value: number) => void;
  onPresetLoad?: (preset: CanonicalScenarioPreset) => void;
  onCameraChange?: (camera: CameraState) => void;
}

export const HealthEngineHUD: FC<HealthEngineHUDProps> = ({
  isDockOpen,
  onDockToggle,
  presets = [],
  activePillar,
  renderMode,
  parameters,
  activePresetId,
  camera,
  onPillarChange,
  onRenderModeChange,
  onParameterChange,
  onPresetLoad,
  onCameraChange,
}) => {
  // Navigation & Control States
  const [isDayTime, setIsDayTime] = useState<boolean>(false);
  const controlsId = useId();
  const [mobilePanel, setMobilePanel] = useState<'clinical' | 'camera' | null>(null);

  const availablePresets =
    resolveAvailablePresets(presets);

  const activePreset = resolveActivePreset(
    availablePresets,
    activePresetId
  );

  // Load Preset Handler
  const loadPreset = (preset: CanonicalScenarioPreset) => {
    const plan = createPresetLoadPlan(
      preset,
      camera
    );

    onPresetLoad?.(plan.preset);

    if (plan.cameraState) {
      onCameraChange?.(plan.cameraState);
    }
  };

  // Camera Shot Director Handler
  const applyCameraShot = (shotId: string) => {
    const nextCamera = createCameraStateForShot(
      camera,
      shotId
    );

    if (nextCamera) {
      onCameraChange?.(nextCamera);
    }
  };

  // Slider change handler
  const handleParamChange = (key: keyof CanonicalPresetParameters, val: number) => {
    onParameterChange?.(key, val);
  };

  const pillarIcons: Record<PillarType, ReactNode> = {
    Fitness: <Activity className="w-4 h-4 text-emerald-400" />,
    Nutrition: <Apple className="w-4 h-4 text-amber-400" />,
    Sleep: <Moon className="w-4 h-4 text-violet-400" />,
    Stress: <Brain className="w-4 h-4 text-rose-400" />,
    Systems: <Layers className="w-4 h-4 text-cyan-400" />
  };

  const statusBadge: Record<HealthStatus, { label: string; bg: string; text: string; border: string; icon: ReactNode }> = {
    optimal: { label: 'OPTIMAL', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> },
    warning: { label: 'WARNING', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> },
    critical: { label: 'CRITICAL', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> }
  };

  return (
    <div
      className="relative w-full h-dvh xl:h-screen bg-transparent text-slate-100 font-sans overflow-hidden select-none"
      data-alcohol-units={parameters.alcoholUnits}
    >



      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP HEADER NAVIGATION BAR */}
      {/* ------------------------------------------------------------------ */}
      <header className="absolute top-0 inset-x-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-3 py-2 flex flex-wrap items-center justify-between gap-2 z-50 xl:z-30 xl:h-16 xl:flex-nowrap xl:gap-0 xl:px-6 xl:py-0">
        
        {/* Brand Logo & Platform Title */}
        <div className="flex min-w-0 items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs xl:text-sm font-semibold tracking-wide text-slate-100">HEALTH OPTIMISATION</h1>
            <p className="text-[9px] xl:text-[10px] font-mono text-slate-400 tracking-wider">THE FOUR PILLARS ENGINE v2</p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 xl:hidden">
          <button
            type="button"
            aria-label="Clinical summary"
            aria-expanded={mobilePanel === 'clinical'}
            aria-controls={`${controlsId}-clinical-panel`}
            onClick={() => setMobilePanel((panel) => panel === 'clinical' ? null : 'clinical')}
            className="flex size-9 items-center justify-center rounded-lg border border-slate-700 text-emerald-300"
          >
            <ShieldCheck className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Camera controls"
            aria-expanded={mobilePanel === 'camera'}
            aria-controls={`${controlsId}-camera-panel`}
            onClick={() => setMobilePanel((panel) => panel === 'camera' ? null : 'camera')}
            className="flex size-9 items-center justify-center rounded-lg border border-slate-700 text-cyan-300"
          >
            <Camera className="size-4" />
          </button>
        </div>

        {/* Pillar Selector Tabs */}
        <nav aria-label="Health pillars" className="grid w-full grid-cols-5 gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 xl:flex xl:w-auto">
          {(['Fitness', 'Nutrition', 'Sleep', 'Stress', 'Systems'] as PillarType[]).map((pillar) => (
            <button
              key={pillar}
              aria-pressed={activePillar === pillar}
              onClick={() => {
                onPillarChange?.(pillar);
              }}
              className={`flex min-h-9 min-w-0 items-center justify-center gap-1 px-0.5 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-150 xl:min-h-0 xl:gap-2 xl:px-3 xl:text-xs ${
                activePillar === pillar
                  ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <span className="hidden xl:inline-flex">{pillarIcons[pillar]}</span>
              <span>{pillar}</span>
            </button>
          ))}
        </nav>

        {/* Lighting & Rendering Switcher */}
        <div className="flex w-full items-center justify-between gap-3 xl:w-auto">
          <button
            onClick={() => setIsDayTime(!isDayTime)}
            className="min-h-9 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors xl:min-h-0"
            title="Toggle Circadian Lighting Mode"
          >
            {isDayTime ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-400" />}
          </button>

          <div role="group" aria-label="Render mode" className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
            {(['high-3d', 'lite-3d', '2d-canvas'] as RenderMode[]).map((mode) => (
              <button
                key={mode}
                aria-pressed={renderMode === mode}
                onClick={() => {
                  onRenderModeChange?.(mode);
                }}
                className={`min-h-9 px-2.5 py-1 rounded-md text-[11px] font-mono capitalize transition-all xl:min-h-0 ${
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
      <div
        id={`${controlsId}-clinical-panel`}
        role="region"
        aria-label="Clinical summary"
        className={`absolute top-44 left-3 right-3 max-h-[calc(100dvh-18rem)] overflow-y-auto pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 shadow-2xl z-40 ${mobilePanel === 'clinical' ? 'block' : 'hidden'} xl:block xl:top-20 xl:left-6 xl:right-auto xl:w-80 xl:max-h-none xl:bg-slate-900/80 xl:z-20`}
      >
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
      <div
        id={`${controlsId}-camera-panel`}
        role="region"
        aria-label="Camera controls"
        className={`absolute top-44 left-3 right-3 max-h-[calc(100dvh-18rem)] overflow-y-auto pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-slate-800/90 rounded-2xl p-3 shadow-2xl z-40 ${mobilePanel === 'camera' ? 'block' : 'hidden'} xl:block xl:top-20 xl:left-auto xl:right-6 xl:w-60 xl:max-h-none xl:bg-slate-900/80 xl:z-20`}
      >
        <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-800/80 mb-2">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono tracking-wider uppercase text-slate-300">SCENE 5 CAMERA DIRECTOR</span>
        </div>

        <div className="space-y-1.5">
          {CAMERA_SHOTS.map((shot) => (
            <button
              key={shot.id}
              aria-pressed={camera.activeShotId === shot.id}
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
      <div className={`absolute bottom-[var(--engine-footer-space,4rem)] inset-x-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/90 transition-all duration-300 z-30 h-[var(--engine-dock-space)] xl:h-[var(--engine-desktop-dock-space)]`}>
        
        <button
          onClick={onDockToggle}
          aria-expanded={isDockOpen}
          className="w-full h-10 px-3 xl:px-6 flex items-center justify-between text-[10px] xl:text-xs font-mono text-slate-400 hover:text-slate-200 border-b border-slate-800/50"
        >
          <div className="flex items-center space-x-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-wider uppercase">
              <span className="xl:hidden">Parameters & presets</span>
              <span className="hidden xl:inline">PARAMETER CONTROLS & SLEEP LADDER PRESETS</span>
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{isDockOpen ? 'COLLAPSE' : 'EXPAND'}</span>
            {isDockOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {isDockOpen && (
          <div className="pointer-events-auto p-3 xl:p-5 grid grid-cols-1 xl:grid-cols-12 gap-4 xl:gap-6 h-[calc(100%_-_2.5rem)] xl:h-52 overflow-y-auto">
            
            {/* Left Col: Scenario Presets List */}
            <div className="xl:col-span-4 space-y-2 border-b pb-3 xl:pb-0 xl:border-b-0 xl:border-r border-slate-800/80 xl:pr-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">PRESET SCENARIOS & SLEEP LADDER</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {availablePresets.map((preset) => (
                  <button
                    key={preset.id}
                    aria-pressed={activePreset?.id === preset.id}
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
            <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor={`${controlsId}-aerobic`} className="font-medium text-slate-300">Aerobic Activity (MVPA)</label>
                  <span className="font-mono text-emerald-400">{parameters.aerobicMins} mins/wk</span>
                </div>
                <input
                  id={`${controlsId}-aerobic`}
                  aria-describedby={`${controlsId}-aerobic-guidance`}
                  aria-valuetext={`${parameters.aerobicMins} minutes per week`}
                  type="range"
                  min="0"
                  max="400"
                  step="10"
                  value={parameters.aerobicMins}
                  onChange={(e) => handleParamChange('aerobicMins', Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <span id={`${controlsId}-aerobic-guidance`} className="text-[9px] font-mono text-slate-500 block">Guideline Target: 150–300 mins/week</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor={`${controlsId}-sleep`} className="font-medium text-slate-300">Sleep Duration</label>
                  <span className="font-mono text-violet-400">{parameters.sleepDuration} hrs/night</span>
                </div>
                <input
                  id={`${controlsId}-sleep`}
                  aria-describedby={`${controlsId}-sleep-guidance`}
                  aria-valuetext={`${parameters.sleepDuration} hours per night`}
                  type="range"
                  min="4"
                  max="10"
                  step="0.5"
                  value={parameters.sleepDuration}
                  onChange={(e) => handleParamChange('sleepDuration', Number(e.target.value))}
                  className="w-full accent-violet-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <span id={`${controlsId}-sleep-guidance`} className="text-[9px] font-mono text-slate-500 block">AASM Target: 7.0–9.0 hrs/night</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor={`${controlsId}-nutrition`} className="font-medium text-slate-300">Whole Food Ratio</label>
                  <span className="font-mono text-amber-400">{parameters.wholeFoodRatio}%</span>
                </div>
                <input
                  id={`${controlsId}-nutrition`}
                  aria-describedby={`${controlsId}-nutrition-guidance`}
                  aria-valuetext={`${parameters.wholeFoodRatio} percent`}
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={parameters.wholeFoodRatio}
                  onChange={(e) => handleParamChange('wholeFoodRatio', Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <span id={`${controlsId}-nutrition-guidance`} className="text-[9px] font-mono text-slate-500 block">ACLM Target: Plant-predominant whole foods</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor={`${controlsId}-stress`} className="font-medium text-slate-300">Perceived Stress Level</label>
                  <span className="font-mono text-rose-400">{parameters.stressLevel} / 10</span>
                </div>
                <input
                  id={`${controlsId}-stress`}
                  aria-describedby={`${controlsId}-stress-guidance`}
                  aria-valuetext={`${parameters.stressLevel} out of 10`}
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={parameters.stressLevel}
                  onChange={(e) => handleParamChange('stressLevel', Number(e.target.value))}
                  className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <span id={`${controlsId}-stress-guidance`} className="text-[9px] font-mono text-slate-500 block">Target: Active parasympathetic buffering</span>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default HealthEngineHUD;
