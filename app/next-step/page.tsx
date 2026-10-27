import type { Metadata } from 'next';
import Link from 'next/link';
import { HabitPlanner, type HabitPillar } from '@/components/HabitPlanner';
import '../landing.css';
import './next-step.css';

export const metadata: Metadata = {
  title: 'My next step | Healthcrest',
  description: 'Turn an educational insight into one manageable everyday habit. Adapt a starter idea and download your next-step plan.',
};

export default async function NextStepPage({ searchParams }: {
  searchParams: Promise<{ pillar?: string | string[] }>;
}) {
  const { pillar } = await searchParams;
  let initialPillar: HabitPillar = 'Fitness';
  switch (pillar) {
    case 'nutrition': initialPillar = 'Nutrition'; break;
    case 'sleep': initialPillar = 'Sleep'; break;
    case 'stress': initialPillar = 'Stress'; break;
  }
  return (
    <div className="hc-landing hc-plan-page">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <header className="hc-header">
        <Link href="/" className="hc-brand" aria-label="Healthcrest home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/healthcrest-logo.png" alt="HealthCrest — Optimising health" width={1664} height={940} />
        </Link>
        <Link href="/engine" prefetch={false} className="hc-header-cta">Explore the engine</Link>
      </header>
      <main id="main-content" tabIndex={-1} className="hc-section hc-plan-main">
        <span className="hc-eyebrow">From understanding to everyday care</span>
        <h1>One habit.<br /><em>Your next step.</em></h1>
        <p className="hc-plan-intro">Choose a pillar, adapt a starter idea and give it a place in your routine. Start with something manageable; you can adjust it as you learn.</p>
        <HabitPlanner initialPillar={initialPillar} />
      </main>
      <footer className="hc-footer">
        <p>Healthcrest · Evidence-informed understanding. Practical everyday care.</p>
        <p className="hc-footer-note">General educational ideas for adults, to adapt to your health, ability and circumstances. Everyday habits can complement appropriate clinical care.</p>
      </footer>
    </div>
  );
}
