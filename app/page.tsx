'use client';

import React, { useState, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import {
  ShieldAlert,
  Info,
  X,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Apple,
  Moon,
  Brain,
  Scale
} from 'lucide-react';

// Import local components and state machine types
import {
  HealthEngineHUD,
  type CameraState,
  type PresetScenario,
} from '@/components/HealthEngineHUD';
import { HealthEngine2DFallback } from '@/components/HealthEngine2DFallback';
import {
  pillarsReducer,
  initialPillarsState
} from '@/state/PillarsStateMachine';

// Dynamically import Three.js Canvas with SSR disabled to prevent server-side DOM errors
function WebGLLoadErrorFallback() {
  return <CanvasPlaceholder />;
}

const WebGLCanvasWrapper = dynamic(
  () => import('./WebGLCanvasWrapper').catch(() => WebGLLoadErrorFallback),
  { ssr: false, loading: () => <CanvasPlaceholder /> }
);

function CanvasPlaceholder() {
  return (
    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-400 select-none">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-20 h-20 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <Layers className="w-8 h-8 text-cyan-400 absolute animate-pulse" />
      </div>
      <p className="text-xs font-mono tracking-widest uppercase text-slate-300">
        INITIALISING 3D HEALTH ENGINE...
      </p>
      <p className="text-[10px] font-mono text-slate-500 mt-1">
        Compiling WebGL Shaders & Neural Meshes
      </p>
    </div>
  );
}

export default function FourPillarsHealthEnginePage() {
  // Master State Machine Driven by Reducer
  const [state, dispatch] = useReducer(pillarsReducer, initialPillarsState);

  const [cameraState, setCameraState] = useState<CameraState>({
    orbitAzimuth: 45,
    orbitElevation: 20,
    zoomDistance: 1.0,
    activeShotId: 'shot-1-orbit',
    isGesturing: false,
    requestRevision: 0,
  });

  // UI Control States
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);
  const [isNarrativeOpen, setIsNarrativeOpen] = useState<boolean>(false);
  const [presetsList, setPresetsList] = useState<PresetScenario[]>([]);
  const [, setIsLoadingPresets] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch Preset Scenarios from Next.js App Router API (/api/presets) on mount
  useEffect(() => {
    async function fetchPresets() {
      try {
        setIsLoadingPresets(true);
        const res = await fetch('/api/presets');
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPresetsList(json.data);
        } else if (Array.isArray(json)) {
          setPresetsList(json);
        }
      } catch (err: unknown) {
        console.warn('Failed to load presets from /api/presets, using local fallback presets:', err);
        setApiError('CMS connection offline — using local evidence presets.');
      } finally {
        setIsLoadingPresets(false);
      }
    }

    fetchPresets();
  }, []);

  return (
    <main className="relative w-full h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      {/* ------------------------------------------------------------------ */}
      {/* 1. VISUAL VIEWPORT LAYER (3D WebGL vs 2D Fallback) */}
      {/* ------------------------------------------------------------------ */}
      {state.renderMode === '2d-canvas' ? (
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-auto bg-slate-950 p-6">
          <HealthEngine2DFallback
            activePillar={state.activePillar}
            aerobicMins={state.parameters.aerobicVolume}
            sleepDuration={state.parameters.sleepDuration}
            wholeFoodRatio={state.parameters.wholeFoodRatio}
            stressLevel={state.parameters.perceivedStress}
            healthStatus={
              state.overlay.status === "Optimal"
                ? "optimal"
                : state.overlay.status === "Warning"
                  ? "warning"
                  : state.overlay.status === "Critical"
                    ? "critical"
                    : "manual"
            }
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <WebGLCanvasWrapper
            state={state}
            cameraState={cameraState}
            dispatch={dispatch}
          />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. OVERLAY HUD INTERFACE */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-10 w-full h-full pointer-events-none [&_button]:pointer-events-auto [&_input]:pointer-events-auto [&_select]:pointer-events-auto">
        <HealthEngineHUD
        presets={presetsList}
        activePillar={state.activePillar}
        renderMode={state.renderMode}
        activePresetId={state.activePreset}
        camera={cameraState}
        parameters={{
          aerobicMins: state.parameters.aerobicVolume,
          strengthDays: state.parameters.resistanceDays,
          sleepDuration: state.parameters.sleepDuration,
          wholeFoodRatio: state.parameters.wholeFoodRatio,
          stressLevel: state.parameters.perceivedStress,
          alcoholUnits: state.parameters.alcoholUnits,
        }}
        onCameraChange={setCameraState}
        onPillarChange={(pillar) => {
          const sceneMap = {
            Fitness: "fitness",
            Nutrition: "nutrition",
            Sleep: "sleep",
            Stress: "stress",
            Systems: "system",
          } as const;

          dispatch({
            type: "SET_SCENE",
            payload: sceneMap[pillar],
          });
        }}
        onRenderModeChange={(mode) => {
          dispatch({
            type: "SET_RENDER_MODE",
            payload: mode,
          });
        }}
        onParameterChange={(key, value) => {
          const parameterMap = {
            aerobicMins: "aerobicVolume",
            strengthDays: "resistanceDays",
            sleepDuration: "sleepDuration",
            wholeFoodRatio: "wholeFoodRatio",
            stressLevel: "perceivedStress",
          } as const;

          const mappedKey = parameterMap[key as keyof typeof parameterMap];

          if (mappedKey) {
            dispatch({
              type: "UPDATE_PARAM",
              payload: { key: mappedKey, value },
            });
          }
        }}
        onPresetLoad={(preset) => {
          dispatch({
            type: "APPLY_CANONICAL_PRESET",
            payload: preset,
          });
        }}
      />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. FOOTER & NARRATIVE / MEDICO-LEGAL ACTION BAR */}
      {/* ------------------------------------------------------------------ */}
      <footer className="absolute bottom-1 right-6 z-40 flex items-center space-x-3 text-[11px] font-mono text-slate-400">
        {apiError && (
          <span className="flex items-center space-x-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            <span>{apiError}</span>
          </span>
        )}

        {/* Global Narrative Trigger */}
        <button
          onClick={() => setIsNarrativeOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-emerald-200 transition-all shadow-lg pointer-events-auto"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Home & Global Narrative</span>
        </button>

        {/* Disclaimer Trigger */}
        <button
          onClick={() => setIsDisclaimerOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-emerald-400 transition-all shadow-lg pointer-events-auto"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Clinical & Legal Disclaimer</span>
        </button>
      </footer>

      {/* ------------------------------------------------------------------ */}
      {/* 4. HOME PAGE & GLOBAL NARRATIVE DRAWER / MODAL */}
      {/* ------------------------------------------------------------------ */}
      {isNarrativeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold tracking-wide text-slate-100">
                    THE FOUR PILLARS HEALTH OPTIMISATION PLATFORM
                  </h2>
                  <p className="text-[11px] font-mono text-slate-400">
                    Global Narrative & Clinical Reference Framework
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNarrativeOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-300 leading-relaxed font-sans">
              
              {/* Bottom Line Highlight Box */}
              <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-cyan-500/10 border border-emerald-500/30 rounded-2xl space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>The Bottom Line</span>
                </span>
                <p className="text-xs font-medium text-slate-100 leading-relaxed">
                  Health optimisation is an evidence-based approach that distils six core lifestyle principles into four practical, interconnected pillars—Fitness, Nutrition, Sleep, and Stress Regulation. Rather than treating these as isolated habits, our framework models them as a single biological system where strengthening one pillar protects the whole, while neglecting one quietly undermines the rest.
                </p>
              </div>

              {/* The Four Core Pillars Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 border-b border-slate-800 pb-2 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>The Four Core Pillars</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Fitness */}
                  <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
                      <Activity className="w-4 h-4" />
                      <span>1. Fitness & Movement</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      The Fitness Pillar focuses on structured cardiorespiratory movement, functional physical activity, and minimising prolonged sedentary behaviour. Physical activity serves as a primary stimulus for expanding functional capacity, improving cardiovascular elasticity, and reducing the risk of chronic conditions such as type 2 diabetes and cardiovascular disease. To maintain baseline health, UK Chief Medical Officers (CMO) guidance recommends accumulating at least 150 minutes of moderate-intensity activity (or 75 minutes of vigorous activity) each week, alongside muscle-strengthening exercises on two or more days.
                    </p>
                  </div>

                  {/* Nutrition */}
                  <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
                      <Apple className="w-4 h-4" />
                      <span>2. Nutrition</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      The Nutrition Pillar centres on a whole-food, plant-predominant pattern of eating that limits ultra-processed foods and prioritises nutrient-dense ingredients. Nutritious eating plays a pivotal role in maintaining metabolic stability, supporting gut microbiome diversity, and reducing long-term cardiovascular and metabolic disease risks. In line with NHS Eatwell guidance, a foundational daily practice includes consuming at least five portions of fruit and vegetables, opting for wholegrain starchy carbohydrates, and maintaining hydration with 6 to 8 glasses of fluid.
                    </p>
                  </div>

                  {/* Sleep */}
                  <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-violet-400 font-semibold text-xs">
                      <Moon className="w-4 h-4" />
                      <span>3. Sleep</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      The Sleep Pillar focuses on establishing restorative sleep patterns, prioritising duration, timing, efficiency, and consistent sleep architecture. Quality sleep is fundamental to physiological recovery, immune system function, metabolic regulation, and emotional resilience. Grounded in lifestyle medicine consensus, adults should aim for 7 to 9 hours of quality sleep per night to safeguard cardiometabolic and mental health.
                    </p>
                  </div>

                  {/* Stress */}
                  <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs">
                      <Brain className="w-4 h-4" />
                      <span>4. Stress Regulation</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      The Stress Regulation Pillar encompasses evidence-based cognitive and behavioural strategies—such as mindfulness, breathing techniques, and relaxation practices—designed to manage allostatic load. Managing stress matters because chronic psychological strain dysregulates cortisol levels and sympathetic nervous system activity, quietly undermining gains achieved in physical fitness, nutrition, and sleep recovery. Incorporating routine relaxation and mindfulness practices serves as a crucial intervention to down-regulate sympathetic arousal, lower blood pressure, and reduce anxiety.
                    </p>
                  </div>

                </div>
              </div>

              {/* Clinical Alignment & Reference Standards */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>Clinical Alignment & Reference Standards</span>
                </h3>
                
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  This health optimisation framework is fully aligned with the six foundational pillars of lifestyle medicine: nutrition, physical activity, sleep, stress management, avoidance of risky substances, and social connection. Rather than siloing substance risk reduction (such as alcohol moderation and smoking cessation) and social connectedness into separate standalone areas, they are integrated across all four pillars as cross-cutting factors that directly influence overall resilience.
                </p>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Official UK public health guidance—including NHS “Live Well” guidance, UK Chief Medical Officers’ physical activity guidelines, and NICE evidence standards—serves as a primary reference point across our content and scenario models. However, all materials, visualisations, and interactive tools provided on this platform are designed strictly for educational and informational purposes. They are not intended to diagnose, treat, or replace individual clinical advice, and you should always consult a qualified healthcare professional regarding any medical concerns or before embarking on a new health regimen.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                onClick={() => setIsNarrativeOpen(false)}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors shadow-lg shadow-emerald-500/20"
              >
                Close & Return to 3D Engine
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. MEDICO-LEGAL DISCLAIMER MODAL */}
      {/* ------------------------------------------------------------------ */}
      {isDisclaimerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center space-x-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-semibold tracking-wide text-slate-100">
                  CLINICAL & MEDICO-LEGAL DISCLAIMER
                </h2>
              </div>
              <button
                onClick={() => setIsDisclaimerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 space-y-4 overflow-y-auto text-xs text-slate-300 leading-relaxed font-sans">
              
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start space-x-3 text-amber-200">
                <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium leading-snug">
                  The Four Pillars Health Optimisation Platform is an interactive educational tool designed to demonstrate lifestyle medicine principles. It does not provide medical diagnoses or treatment plans.
                </p>
              </div>

              <section className="space-y-1.5">
                <h3 className="text-xs font-semibold text-slate-100 uppercase font-mono tracking-wider">
                  1. Educational Purpose Only
                </h3>
                <p>
                  All contents of this platform—including text, 3D bio-visualisations, scenario presets, parameter sliders, evidence summaries, and HUD overlays—are provided strictly for educational and informational purposes. They do not constitute personalized medical advice.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-xs font-semibold text-slate-100 uppercase font-mono tracking-wider">
                  2. No Doctor-Patient Relationship
                </h3>
                <p>
                  Interaction with this website or its underlying state models does not create a doctor-patient or therapeutic relationship between you and the platform developers, clinical reviewers, or affiliated institutions.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-xs font-semibold text-slate-100 uppercase font-mono tracking-wider">
                  3. Emergency Medical Protocol
                </h3>
                <p>
                  This platform is not equipped for emergency care. If you are experiencing acute chest pain, shortness of breath, severe pain, or a medical emergency, immediately call local emergency services (999 UK / 911 US / 112 EU) or visit the nearest emergency department.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-xs font-semibold text-slate-100 uppercase font-mono tracking-wider">
                  4. Clinical Triage & Physical Activity
                </h3>
                <p>
                  Before commencing any new exercise regime or changing dietary habits, complete an appropriate physical readiness evaluation (e.g. PAR-Q+) or consult a registered physician or lifestyle medicine practitioner.
                </p>
              </section>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
              <button
                onClick={() => setIsDisclaimerOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors shadow-lg shadow-emerald-500/20"
              >
                I Understand & Acknowledge
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
