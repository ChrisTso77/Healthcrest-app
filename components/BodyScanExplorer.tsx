'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { PillarParameters, PillarsAction } from '@/state/PillarsStateTypes';
import type { PillarType } from '@/lib/presets/types';
import { PILLAR_GUIDES } from '@/lib/education/healthGuide';

type Habit = Exclude<PillarType, 'Systems'>;
type Region = 'head' | 'chest' | 'core' | 'legs';
type Stop = { region: Region; title: string; detail: string };
const regionPosition: Record<Region, number> = { head: 11, chest: 29, core: 49, legs: 74 };
const regionLabel: Record<Region, string> = { head: 'Head', chest: 'Chest', core: 'Abdomen', legs: 'Legs' };
const stops: Record<Habit, Stop[]> = {
  Fitness: [
    { region: 'head', title: 'Brain and mood', detail: 'A bout of activity can ease anxiety symptoms and support sleep. A repeated routine is associated with better mental wellbeing and cognitive health, which can help daily function. It does not replace mental health treatment.' },
    { region: 'chest', title: 'Heart and lungs', detail: 'Movement raises heart rate and breathing to supply working muscles. With a sustained routine, cardiorespiratory fitness and blood pressure can improve, supporting a lower population-level risk of heart disease and stroke.' },
    { region: 'core', title: 'Metabolic health', detail: 'Working muscles take up glucose and can become more sensitive to insulin. Repeated activity helps glucose regulation and is associated with lower type 2 diabetes risk. This does not predict an individual outcome.' },
    { region: 'legs', title: 'Muscle, bone and function', detail: 'Walking and other movement challenge endurance and physical function. Resistance and weight-bearing exercise add distinct muscle and bone benefits, helping maintain independence and reduce falls risk with age.' },
  ],
  Nutrition: [
    { region: 'core', title: 'Digestion and fibre', detail: 'Varied fruit, vegetables and fibre-rich foods support regular bowel function. The selected portion count alone cannot describe the quality of a whole diet.' },
    { region: 'chest', title: 'Heart and circulation', detail: 'A balanced eating pattern with more fibre and attention to salt and saturated fat supports blood pressure and cholesterol health. Over time, this helps reduce cardiovascular risk at a population level; fruit alone does not guarantee protection.' },
    { region: 'head', title: 'Brain and daily energy', detail: 'Balanced meals provide energy and nutrients used throughout the body, including the brain. A fruit and vegetable count cannot establish cognition, mental health or blood glucose outcomes.' },
    { region: 'legs', title: 'Muscle and bone', detail: 'Adequate energy, protein and key nutrients support muscle and bone maintenance alongside activity. Fruit and vegetables contribute nutrients but do not replace protein foods, calcium sources or strength exercise.' },
  ],
  Sleep: [
    { region: 'head', title: 'Brain and mood', detail: 'Adequate, regular sleep supports attention, learning and emotional regulation. Persistent poor sleep can make concentration and mood harder to manage, but duration alone does not measure sleep quality.' },
    { region: 'core', title: 'Metabolic regulation', detail: 'Sleep loss can affect appetite signals and insulin sensitivity. A steadier routine can support metabolic health, though this illustration cannot diagnose or prevent diabetes.' },
    { region: 'chest', title: 'Heart and circulation', detail: 'Sleep and circadian rhythms interact with blood pressure and cardiovascular function. Repeated short sleep is associated with higher cardiovascular risk; hours alone cannot determine personal risk.' },
    { region: 'legs', title: 'Recovery and immune function', detail: 'Sleep supports recovery and immune function. Training, nutrition, illness and sleep quality also matter; more hours are not automatically better.' },
  ],
  Stress: [
    { region: 'head', title: 'Stress and attention', detail: 'Grounding and mindful attention may help you notice stress and respond more deliberately. Coping skills support wellbeing but cannot remove a stressful circumstance or replace treatment.' },
    { region: 'chest', title: 'Breathing and heart response', detail: 'Stress can speed breathing and heart rate. Slow, comfortable breathing can help some people settle during an acute response. A daily practice count cannot predict blood pressure or heart disease risk.' },
    { region: 'core', title: 'Gut and routines', detail: 'Stress can affect appetite, digestion and daily routines. Coping strategies and practical support may help people eat regularly and seek help. Breathing does not directly prevent digestive disease.' },
    { region: 'legs', title: 'Tension and rest', detail: 'Stress can accompany muscle tension and disturbed rest. A gentle body scan, movement and rest can help people notice and release tension. Persistent pain or severe distress merits appropriate care.' },
  ],
};
const settings: Record<Habit, { key: keyof PillarParameters; label: string; unit: string; min: number; max: number; step: number }> = {
  Fitness: { key: 'aerobicVolume', label: 'Moderate activity per week', unit: 'minutes/week', min: 0, max: 600, step: 10 },
  Nutrition: { key: 'fruitVegPortions', label: 'Fruit and vegetable portions per day', unit: 'portions/day', min: 0, max: 8, step: 1 },
  Sleep: { key: 'sleepDuration', label: 'Typical sleep per night', unit: 'hours/night', min: 4, max: 11, step: .5 },
  Stress: { key: 'downRegPracticeMins', label: 'Time for calming practice each day', unit: 'minutes/day', min: 0, max: 30, step: 1 },
};
const habits: Habit[] = ['Fitness', 'Nutrition', 'Sleep', 'Stress'];
const supportingSources: Record<Habit, readonly { label: string; url: string }[]> = {
  Fitness: [
    { label: 'WHO activity guidance', url: 'https://www.who.int/europe/publications/i/item/9789240014886' },
    { label: 'High-volume activity cohort', url: 'https://pubmed.ncbi.nlm.nih.gov/35876019/' },
    { label: 'AHA exercise risk statement', url: 'https://professional.heart.org/en/science-news/exercise-related-acute-cardiovascular-events-and-potential-deleterious-adaptations' },
    { label: '2023 PCOS guideline', url: 'https://pubmed.ncbi.nlm.nih.gov/37580861/' },
    { label: 'ACOG premenstrual guidance', url: 'https://www.acog.org/womens-health/faqs/Premenstrual-Syndrome' },
    { label: 'ACOG female athlete guidance', url: 'https://www.acog.org/womens-health/faqs/the-healthy-female-athlete' },
    { label: 'NIAMS bone health', url: 'https://www.niams.nih.gov/health-topics/exercise-your-bone-health' },
  ],
  Nutrition: [{ label: 'NHS fibre guidance', url: 'https://www.nhs.uk/live-well/eat-well/digestive-health/how-to-get-more-fibre-into-your-diet/' }],
  Sleep: [{ label: 'NIH sleep and health', url: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects' }],
  Stress: [
    { label: 'WHO coping skills guide', url: 'https://www.who.int/publications/i/item/9789240003927' },
    { label: 'NHS stress symptoms', url: 'https://www.nhs.uk/every-mind-matters/mental-health-issues/stress/' },
    { label: 'NHS breathing exercise', url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/' },
  ],
};
function note(habit: Habit, value: number): string {
  if (habit === 'Fitness') return value === 0 ? 'Possible benefits if activity is added; none is implied at zero.' : value < 150 ? 'Some moderate activity is beneficial below the guideline range. Build gradually.' : value <= 300 ? 'If these are moderate minutes, this is in the usual adult guideline range; include strength work on at least two days.' : 'For moderate activity above 300 minutes, further benefit may be smaller. No universal harmful minute threshold is established; recovery, intensity, injury and health conditions matter.';
  if (habit === 'Nutrition') return value < 5 ? 'The NHS Eatwell Guide suggests at least five varied portions a day. This is one part of balanced meals.' : 'Variety and the rest of the eating pattern still matter. Additional portions do not imply proportional benefit.';
  if (habit === 'Sleep') return value < 7 ? 'Below the usual 7–9 hour adult range; sleep opportunity and regularity matter.' : value <= 9 ? 'Within the usual adult range, with individual variation. Quality and regularity matter too.' : 'Longer sleep is not automatically healthier. Persistent long sleep or fatigue warrants assessment.';
  return 'This time is an example, not an evidence-based therapeutic dose. Support and addressing stressors also matter.';
}
function context(habit: Habit, model: 'male' | 'female', region: Region): string {
  if (habit !== 'Fitness') return 'These mechanisms apply across sexes. Needs can vary with age, pregnancy, menopause, medicines and medical conditions. Illustration choice does not identify any of these.';
  if (model === 'male') return 'This general benefit applies across sexes; the image does not predict an individual response.';
  return ({ head: 'Regular activity may ease premenstrual symptoms for some people, without guaranteeing hormone changes.', chest: 'During and after menopause, activity supports cardiovascular health but does not restore estrogen.', core: 'For people with PCOS, activity can support metabolic health; it is not a cure. Pregnancy needs individual advice.', legs: 'Weight-bearing and resistance activity supports bone and muscle after menopause. Intense training with inadequate energy can disrupt periods.' })[region];
}
export function BodyScanExplorer({ activePillar, parameters, dispatch, onOriginalView }: { activePillar: PillarType; parameters: PillarParameters; dispatch: (action: PillarsAction) => void; onOriginalView: () => void }) {
  const [selected, setSelected] = useState<Habit>(activePillar === 'Systems' ? 'Fitness' : activePillar);
  const [model, setModel] = useState<'male' | 'female'>('female');
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [voice, setVoice] = useState(false);
  const [status, setStatus] = useState('Move the scanner or start the guided scan.');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speech = useRef<SpeechSynthesisUtterance | null>(null);
  const runId = useRef(0);
  const habit = activePillar === 'Systems' ? selected : activePillar;
  const setting = settings[habit];
  const value = parameters[setting.key];
  const entries = stops[habit];
  const stop = entries[index] ?? entries[0];
  const clear = () => { runId.current++; if (timer.current) clearTimeout(timer.current); timer.current = null; if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel(); speech.current = null; };
  const pause = () => { setRunning(false); clear(); };
  useEffect(() => { const token = runId; const timeout = timer; return () => { token.current++; if (timeout.current) clearTimeout(timeout.current); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }; }, []);
  useEffect(() => { if (!running) return; const id = ++runId.current; const current = entries[index] ?? entries[0]; const next = () => { if (id !== runId.current) return; if (index >= entries.length - 1) { setRunning(false); setStatus('Scan complete. Choose a region or start again.'); return; } setIndex(index + 1); setPosition(null); };
    if (voice && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
      const utterance = new SpeechSynthesisUtterance(current.title + '. ' + current.detail + ' ' + note(habit, value) + ' ' + context(habit, model, current.region));
      utterance.lang = 'en-GB'; utterance.rate = .95;
      const started = Date.now();
      const minimumMs = Math.max(16000, utterance.text.trim().split(/\s+/).length * 380);
      utterance.onend = () => {
        if (id !== runId.current) return;
        const elapsed = Date.now() - started;
        if (elapsed < Math.min(5000, minimumMs / 4)) {
          setVoice(false);
          setStatus('Voice ended before the explanation could be spoken; continuing with captions.');
          return;
        }
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(next, Math.max(800, minimumMs - elapsed));
      };
      utterance.onerror = () => { if (id === runId.current) { setVoice(false); setStatus('Voice stopped; continuing with captions.'); } }; speech.current = utterance; timer.current = setTimeout(() => { if (id === runId.current) { setRunning(false); setVoice(false); setStatus('Voice completion was not reported. Captions are available; start the scan to try again.'); } }, Math.max(45000, utterance.text.split(/\s+/).length * 1100)); window.speechSynthesis.speak(utterance);
    } else timer.current = setTimeout(next, Math.max(16000, current.detail.split(/\s+/).length * 280));
    const token = runId; const timeout = timer; return () => { token.current++; if (timeout.current) clearTimeout(timeout.current); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, [running, index, voice, habit, value, model, entries]);
  const choose = (i: number) => { pause(); setIndex(i); setPosition(null); setStatus('Selected ' + entries[i].title + '.'); };
  const speakManual = () => {
    if (!voice || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
    runId.current++;
    window.speechSynthesis.cancel();
    const id = runId.current;
    const utterance = new SpeechSynthesisUtterance(stop.title + '. ' + stop.detail + ' ' + note(habit, value) + ' ' + context(habit, model, stop.region));
    utterance.lang = 'en-GB'; utterance.rate = .95; utterance.onerror = () => { if (id === runId.current) { setVoice(false); setStatus('Voice stopped; captions remain available.'); } }; speech.current = utterance; window.speechSynthesis.speak(utterance);
  };
  return <section aria-label="Habit body scan" className="hc-body-scan relative z-0 h-full overflow-y-auto bg-slate-950 px-4 pb-20 pt-20 text-slate-100 sm:px-6">
    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(280px,1fr)_minmax(340px,1fr)]">
      <div className="relative min-h-[510px] overflow-hidden rounded-2xl border border-emerald-700/40 bg-[radial-gradient(ellipse_at_center,#173b48,#07141e_75%)]" aria-label="Illustrative anatomy with approximate scanning region">
        <p className="absolute left-4 top-4 z-10 text-xs tracking-widest text-emerald-200">BODY SYSTEMS · APPROXIMATE HIGHLIGHT</p>
        <div className="relative mx-auto h-[495px] w-[285px]">
          <Image src={'/media/body-scan-' + model + '.webp'} alt={'Illustrative ' + model + ' anatomy showing organs and muscles'} fill sizes="285px" className="object-contain" priority />
          <div aria-hidden="true" className="pointer-events-none absolute left-[-10px] right-[-10px] h-10 rounded-[50%] border-2 border-emerald-300 bg-emerald-300/10 shadow-[0_0_25px_#37e5cb] transition-[top] duration-700 motion-reduce:transition-none" style={{ top: (position ?? regionPosition[stop.region]) + '%' }} />
        </div>
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-emerald-500/30 bg-slate-950/90 p-3 text-sm"><strong className="block text-emerald-200">{stop.title}</strong><span className="text-slate-300">The ring marks an approximate region, not a precise organ.</span></div>
      </div>
      <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900 p-4 sm:p-6">
        <div><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs uppercase tracking-widest text-emerald-300">Habit Explorer · body scan</p><h1 className="mt-1 text-xl font-semibold">How habits support body systems</h1></div><button type="button" onClick={onOriginalView} className="min-h-11 rounded-lg border border-slate-500 px-3 text-sm text-slate-200 focus-visible:outline-2 focus-visible:outline-emerald-300">Original view</button></div><p className="mt-2 text-sm text-slate-300">These explanations illustrate mechanisms and possible benefits. They do not measure your body or predict your health.</p></div>
        <label className="block text-sm" htmlFor="scan-habit">Habit</label><select id="scan-habit" value={habit} onChange={e => { const next = e.target.value as Habit; pause(); setSelected(next); dispatch({ type: 'SET_SCENE', payload: ({ Fitness: 'fitness', Nutrition: 'nutrition', Sleep: 'sleep', Stress: 'stress' })[next] as 'fitness' | 'nutrition' | 'sleep' | 'stress' }); setIndex(0); setPosition(null); }} className="min-h-11 w-full rounded-lg border border-slate-500 bg-slate-950 px-3">{habits.map(h => <option key={h} value={h}>{({ Fitness: 'Movement & strength', Nutrition: 'Balanced meals', Sleep: 'Sleep routines', Stress: 'Stress & support' })[h]}</option>)}</select>
        <label className="block text-sm" htmlFor="scan-model">Body illustration</label><select id="scan-model" value={model} onChange={e => { pause(); setModel(e.target.value as 'male' | 'female'); }} className="min-h-11 w-full rounded-lg border border-slate-500 bg-slate-950 px-3"><option value="female">Female illustration</option><option value="male">Male illustration</option></select><p className="text-xs text-slate-400">The illustration does not determine your identity, physiology or personal risk.</p>
        <label className="block text-sm" htmlFor="scan-setting">{setting.label}: <output className="font-semibold text-emerald-200">{value} {setting.unit}</output></label><input id="scan-setting" type="range" min={setting.min} max={setting.max} step={setting.step} value={Math.min(setting.max, Math.max(setting.min, value))} onChange={e => { pause(); dispatch({ type: 'UPDATE_PARAM', payload: { key: setting.key, value: Number(e.target.value) } }); }} className="w-full accent-emerald-400" /><p className="text-xs text-slate-300">{note(habit, value)}{habit === 'Fitness' && ' This example does not convert vigorous activity into moderate-equivalent minutes.'}</p>
        <label className="block text-sm" htmlFor="scan-manual">Move scanner manually: {regionLabel[stop.region]}</label><input id="scan-manual" type="range" min="0" max="100" value={position ?? regionPosition[stop.region]} aria-valuetext={regionLabel[stop.region]} onChange={e => { const pos = Number(e.target.value); pause(); setPosition(pos); const nearest = entries.map((entry, i) => ({ i, distance: Math.abs(regionPosition[entry.region] - pos) })).sort((a, b) => a.distance - b.distance)[0]; setIndex(nearest.i); setStatus('Manual scan: ' + entries[nearest.i].title + '.'); }} onPointerUp={speakManual} onKeyUp={e => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) speakManual(); }} className="w-full accent-cyan-300 focus-visible:outline-2 focus-visible:outline-emerald-300" /><div className="flex justify-between text-xs text-slate-400"><span>Head</span><span>Feet</span></div>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { if (running) { pause(); setStatus('Scan paused.'); } else { clear(); setIndex(0); setPosition(null); setRunning(true); setStatus('Guided scan in progress.'); } }} className="min-h-11 rounded-lg bg-emerald-400 px-4 font-semibold text-slate-950">{running ? 'Pause scan' : 'Start scan'}</button><button type="button" aria-pressed={voice} onClick={() => { pause(); if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { setStatus('Speech is unavailable in this browser. Captions still work.'); return; } setVoice(!voice); setStatus(!voice ? 'Voice enabled.' : 'Voice disabled.'); }} className="min-h-11 rounded-lg border border-slate-500 px-4">Voice {voice ? 'on' : 'off'}</button></div>
        <p role="status" className="text-xs text-slate-300">{status}</p>
        <div className="rounded-xl border border-emerald-500/30 bg-slate-950/70 p-4" aria-live={voice ? 'off' : 'polite'}><p className="text-xs text-emerald-300">REGION {index + 1} OF 4</p><h2 className="mt-2 font-semibold">{stop.title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-200">{stop.detail} {note(habit, value)}</p><p className="mt-2 text-xs leading-relaxed text-slate-300">{context(habit, model, stop.region)}</p></div>
        <div role="group" aria-label="Choose a body region" className="grid grid-cols-2 gap-2">{entries.map((entry, i) => <button type="button" key={entry.region} aria-pressed={index === i} onClick={() => choose(i)} className="min-h-11 rounded-lg border border-slate-600 px-2 text-sm text-slate-200 aria-pressed:border-emerald-300 aria-pressed:text-emerald-200">{entry.title}</button>)}</div>
        <p className="text-xs leading-relaxed text-slate-400">General guidance: <a href={PILLAR_GUIDES[habit].sourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-200 underline">{PILLAR_GUIDES[habit].sourceLabel}</a>. Further reading: {supportingSources[habit].map((source, i) => <span key={source.url}>{i > 0 ? '; ' : ''}<a href={source.url} target="_blank" rel="noopener noreferrer" className="text-emerald-200 underline">{source.label}</a></span>)}. These sources support general mechanisms, not a dose-specific prediction or the animation. The focus order is an editorial choice.</p>
      </div>
    </div>
  </section>;
}
