import { Activity, Leaf, Moon, HeartHandshake } from "lucide-react";
import { HABITS } from "./model";
import { markerPosition } from "@/lib/education/settingComparison";

// Reuse the existing bounded input scale; the radial layout adds no health formula.
export function HabitIllustration({
  habit,
  value,
  beginning,
}: {
  habit: number;
  value: number;
  beginning: number;
}) {
  const h = HABITS[habit];
  const Icon = [Activity, Leaf, Moon, HeartHandshake][habit];
  function position(input: number) {
    const fraction = (markerPosition(input, h.min, h.max) - 12) / 276;
    const angle = ((135 + fraction * 270) * Math.PI) / 180;
    return { x: 180 + 132 * Math.cos(angle), y: 175 + 132 * Math.sin(angle) };
  }
  const opening = position(beginning),
    current = position(value);
  return (
    <div className="ev2-illustration">
      <svg
        viewBox="0 0 360 330"
        role="img"
        aria-label={`${h.label}: opening ${beginning}, current ${value} ${h.unit}. Scale ${h.min} to ${h.max}; slider limits, not targets.`}
      >
        <defs>
          <radialGradient id="ev2-aura">
            <stop stopColor="var(--habit-accent)" stopOpacity=".2" />
            <stop offset="1" stopColor="var(--habit-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="180" cy="175" r="150" fill="url(#ev2-aura)" />
        <circle
          cx="180"
          cy="175"
          r="102"
          fill="none"
          stroke="#ffffff"
          strokeOpacity=".09"
        />
        <circle
          cx="180"
          cy="175"
          r="118"
          fill="none"
          stroke="#ffffff"
          strokeOpacity=".09"
          strokeDasharray="1 9"
        />
        <path
          d="M86.66 268.34 A132 132 0 1 1 273.34 268.34"
          fill="none"
          stroke="#45655f"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle
          cx={opening.x}
          cy={opening.y}
          r="9"
          fill="#143e36"
          stroke="#dbe9e1"
          strokeWidth="2"
        />
        <path
          d="M0 -9 L9 0 L0 9 L-9 0 Z"
          transform={`translate(${current.x},${current.y})`}
          fill="var(--habit-accent)"
          stroke="#143e36"
          strokeWidth="2"
        />
        <text x="70" y="299" fill="#d0e2db" textAnchor="middle" fontSize="12">
          {h.min}
        </text>
        <text x="290" y="299" fill="#d0e2db" textAnchor="middle" fontSize="12">
          {h.max}
        </text>
      </svg>
      <div className="ev2-orbit-value" aria-hidden="true">
        <Icon size={30} />
        <span>CURRENT EXAMPLE</span>
        <strong>{value}</strong>
        <small>{h.unit}</small>
      </div>
      <p className="ev2-orbit-caption">An input scale. Not a health score.</p>
    </div>
  );
}
