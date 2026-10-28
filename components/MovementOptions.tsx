export function MovementOptions({ guideHref = '' }: { guideHref?: string }) {
  return (
    <aside aria-label="Movement options" className="hc-movement-options">
      <h2>Movement that fits your circumstances</h2>
      <p>Choose the guidance relevant to you. You can make a plan around finding suitable activity or support.</p>
      <ul>
        <li><a href={guideHref + '#age-appropriate-guidance'}>Read movement guidance for ages 65 and over</a></li>
        <li><a href={guideHref + '#adapt-movement'}>Explore seated movement and suitable support</a></li>
      </ul>
      <p>These links open general information. You can adapt your plan in your own words.</p>
    </aside>
  );
}
