export function UrgentSupport({ dark = false }: { dark?: boolean }) {
  return (
    <aside aria-label="Urgent mental health support" className={dark
      ? 'hc-urgent-support-dark space-y-2 rounded-xl border border-emerald-500/40 bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-200 [&_a]:underline [&_a]:underline-offset-4 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-emerald-300'
      : 'hc-urgent-support'}>
      <h3>Need support now?</h3>
      <p>In England, for urgent mental health help, <a href="https://111.nhs.uk/">use NHS 111 online</a> or call <a href="tel:111">111</a> and select the mental health option. <a href="https://www.samaritans.org/how-we-can-help/contact-samaritan/">Samaritans</a> offers free listening support, day or night, on <a href="tel:116123">116 123</a> in the UK and Ireland.</p>
      <p>If a life is at risk or you cannot keep yourself or someone else safe, call <a href="tel:999">999</a> or go to A&amp;E. Outside the UK, use your local urgent services. <a href="https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/">NHS urgent-help guidance</a>.</p>
    </aside>
  );
}
