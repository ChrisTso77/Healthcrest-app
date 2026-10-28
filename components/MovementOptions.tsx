import Link from 'next/link';

export function MovementOptions({ guideHref = '' }: { guideHref?: string }) {
  return (
    <aside aria-label="Movement options" className="hc-movement-options">
      <h2>Movement that fits your circumstances</h2>
      <p>Choose the guidance relevant to you. You can make a plan around finding suitable activity or support.</p>
      <ul>
        <li><Link href={guideHref + '#age-appropriate-guidance'} prefetch={false}>Read movement guidance for ages 65 and over</Link></li>
        <li><Link href={guideHref + '#adapt-movement'} prefetch={false}>Explore seated movement and suitable support</Link></li>
      </ul>
      <p>These links open general information. You can adapt your plan in your own words.</p>
    </aside>
  );
}
