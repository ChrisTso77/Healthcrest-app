import { useId } from 'react';
import type { Lesson } from '@/lib/education/library/types';

export function EducationDiagram({ diagram }: { diagram: Lesson['diagram'] }) {
  const id = useId();
  return <figure className="hc-education-diagram">
    <svg role="img" aria-labelledby={id + '-title ' + id + '-desc'} viewBox="0 0 320 240" width="320" height="240">
      <title id={id + '-title'}>{diagram.title}</title><desc id={id + '-desc'}>{diagram.description}</desc>
      {diagram.labels.map((label, index) => <g key={label}>
        <rect x="18" y={12 + index * 76} width="284" height="62" rx="10" fill="#e7f4ee" stroke="#285e48" strokeWidth="2" />
        <text x="160" y={50 + index * 76} textAnchor="middle" fill="#173e31" fontSize="18" fontFamily="system-ui, sans-serif">{label}</text>
      </g>)}
    </svg>
    <figcaption><strong>{diagram.title}.</strong> {diagram.description}</figcaption>
  </figure>;
}
