import type { CanonicalScenarioPreset } from '@/lib/presets/types';
import { applyContentReview } from '@/lib/presets/reviewedContent';

export function ScenarioEvidence({ preset, expanded = false }: { preset: CanonicalScenarioPreset; expanded?: boolean }) {
  const review = applyContentReview(preset).education!;
  return (
    <details open={expanded} className="space-y-2 border-t border-slate-700 pt-2 text-xs leading-relaxed text-slate-300">
      <summary className="cursor-pointer py-2 font-medium text-emerald-300">Sources and limits</summary>
      <div role="region" aria-label="Scenario sources and limits" className="select-text space-y-3">
        <p>{review.limitations}</p>
        {review.checkedOn && <p>Source check: {review.checkedOn}</p>}
        {review.sources.map(source => (
          <section key={source.url} aria-label={source.title} className="space-y-2 rounded-lg border border-slate-700 p-3">
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-emerald-300 underline underline-offset-4">
              {source.title} (opens in a new tab)
            </a>
            <p><strong>Who it covers: </strong>{source.population}</p>
            <p><strong>What it supports: </strong>{source.supports}</p>
            <p><strong>Limits: </strong>{source.limitations}</p>
          </section>
        ))}
      </div>
    </details>
  );
}
