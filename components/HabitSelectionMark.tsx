import { Check } from 'lucide-react';

// aria-pressed already communicates selection to assistive technology.
export function HabitSelectionMark({ selected }: { selected: boolean }) {
  return <Check size={16} aria-hidden="true" className="hc-selection-mark" data-selected={selected} />;
}
