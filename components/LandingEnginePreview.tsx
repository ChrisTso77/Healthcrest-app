'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Activity, Apple, Moon, Brain } from 'lucide-react';
import { PILLAR_GUIDES } from '@/lib/education/healthGuide';

const pillars = [
  { key: 'Fitness', label: 'Movement', slug: 'fitness', icon: Activity, x: 100, y: 70 },
  { key: 'Nutrition', label: 'Food', slug: 'nutrition', icon: Apple, x: 320, y: 70 },
  { key: 'Sleep', label: 'Sleep', slug: 'sleep', icon: Moon, x: 320, y: 270 },
  { key: 'Stress', label: 'Stress & support', slug: 'stress', icon: Brain, x: 100, y: 270 },
] as const;

export function LandingEnginePreview() {
  const [selected, setSelected] = useState<(typeof pillars)[number]>(pillars[0]);
  const id = useId();
  const guide = PILLAR_GUIDES[selected.key];

  return (
    <section id="engine-preview" aria-labelledby="preview-title" className="hc-preview hc-section">
      <div className="hc-preview-intro">
        <span className="hc-eyebrow hc-eyebrow-light">A first look inside</span>
        <h2 id="preview-title">See the connections.<br />Start with one habit.</h2>
        <p>Choose a pillar for a taste of the guidance inside. The full engine lets you explore example settings, visualise their connections and understand what they mean.</p>
        <div role="group" aria-label="Preview pillars" className="hc-preview-choices">
          {pillars.map((pillar) => (
            <button key={pillar.key} type="button" aria-pressed={selected.key === pillar.key} onClick={() => setSelected(pillar)}>
              <pillar.icon size={17} aria-hidden="true" />
              {pillar.label}
            </button>
          ))}
        </div>
        <div className="hc-preview-reading" role="region" aria-label="Selected habit">
          <p className="hc-preview-label">{selected.label}</p>
          <h3>{guide.heading}</h3>
          <p>{guide.goal}</p>
          <p><strong>One possible first step:</strong> {guide.firstStep}</p>
        </div>
        <Link prefetch={false} className="hc-button hc-button-light" href={`/engine?pillar=${selected.slug}`}>
          Explore {selected.label.toLowerCase()} in the engine <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <div className="hc-preview-map">
        <svg viewBox="0 0 420 340" role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
          <title id={`${id}-title`}>Four connected pillars of everyday health</title>
          <desc id={`${id}-description`}>Movement, food, sleep and stress support surround everyday health. Selected pillar: {selected.label}. This is a navigation preview, not a health score.</desc>
          <circle cx="210" cy="170" r="114" fill="none" stroke="#315A4D" strokeWidth="1" strokeDasharray="3 8" />
          {pillars.map((pillar) => (
            <g key={pillar.key}>
              <line x1={pillar.x} y1={pillar.y} x2="210" y2="170" stroke={selected.key === pillar.key ? '#C7EBA0' : '#315A4D'} strokeWidth={selected.key === pillar.key ? 2 : 1} />
              <circle cx={pillar.x} cy={pillar.y} r={selected.key === pillar.key ? 35 : 29} fill={selected.key === pillar.key ? '#C7EBA0' : '#183E32'} stroke="#567C66" strokeWidth="1" />
              <text x={pillar.x} y={pillar.y + 4} textAnchor="middle" fill={selected.key === pillar.key ? '#133B2D' : '#D9E7DE'} fontSize={pillar.key === 'Stress' ? 10 : 12} fontFamily="sans-serif">{pillar.label}</text>
            </g>
          ))}
          <circle cx="210" cy="170" r="57" fill="#F4F5E9" />
          <text x="210" y="166" textAnchor="middle" fill="#173D30" fontSize="16" fontFamily="Georgia, serif">Everyday</text>
          <text x="210" y="187" textAnchor="middle" fill="#173D30" fontSize="16" fontFamily="Georgia, serif">health</text>
        </svg>
        <p>Connected habits. A whole-person perspective.</p>
        <span>Illustrative preview · no personal health score</span>
      </div>
    </section>
  );
}
