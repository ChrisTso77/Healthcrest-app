import { learningGuideHref } from '@/lib/education/learningGuides';
import { pageMetadata } from '@/lib/siteMetadata';
import Link from 'next/link';
import { Activity, Apple, ArrowUpRight, Brain, Moon } from 'lucide-react';
import { LandingEnginePreview } from '@/components/LandingEnginePreview';
import { PILLAR_GUIDES } from '@/lib/education/healthGuide';
import { HummingbirdAnimation } from '@/components/HummingbirdAnimation';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { UrgentSupport } from '@/components/UrgentSupport';
import './landing.css';

export const metadata = pageMetadata(
  "Healthcrest | Health through everyday habits",
  "Understand the connections between movement, food, sleep and stress. Explore evidence-informed education and practical tools for everyday health.",
  '/',
);

const pillars = [
  { title: 'Movement', slug: 'fitness', icon: Activity, note: 'Build activity into your week in a way that suits your ability and circumstances.', className: 'hc-movement' },
  { title: 'Food', slug: 'nutrition', icon: Apple, note: 'Explore balanced eating patterns, rather than chasing a perfect meal or a score.', className: 'hc-food' },
  { title: 'Sleep', slug: 'sleep', icon: Moon, note: 'Make room for sleep, consistent routines and recovery.', className: 'hc-sleep' },
  { title: 'Stress & support', slug: 'stress', icon: Brain, note: 'Explore practical ways to cope, rest and connect with other people.', className: 'hc-stress' },
];

export default function HealthcrestHomePage() {
  return (
    <div className="hc-landing" id="top">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        <section className="hc-hero hc-section" aria-labelledby="hero-title">
          <div className="hc-hero-copy">
            <span className="hc-eyebrow">Health through everyday habits</span>
            <h1 id="hero-title">Small habits.<br /><em>Connected health.</em></h1>
            <p className="hc-hero-description">Understand how movement, food, sleep and stress relate to your health—and find practical ways to care for yourself, every day.</p>
            <div className="hc-hero-actions">
              <Link prefetch={false} href="/engine" className="hc-button hc-button-primary">Try the Habit Explorer <ArrowUpRight size={19} aria-hidden="true" /></Link>
              <Link href="/start" prefetch={false} className="hc-text-link">Find my starting point <ArrowUpRight size={15} aria-hidden="true" /></Link>
            </div>
            <p className="hc-hero-footnote">An educational space to explore. No account needed.</p>
            <p className="hc-hero-footnote">Created by Chris Tsoto, Clinical Pharmacist, MBA. <Link href="/about" prefetch={false} className="hc-text-link">About &amp; sources</Link></p>
          </div>
          <figure className="hc-hero-art" aria-label="A connected approach to everyday health">
            <div className="hc-art-orbit hc-art-orbit-one" aria-hidden="true" />
            <div className="hc-art-orbit hc-art-orbit-two" aria-hidden="true" />
            <div className="hc-hummingbird-stage" id="hummingbird-stage"><HummingbirdAnimation /></div>
            <div className="hc-art-notes">
              <span className="hc-art-note">Understand the science</span>
              <span className="hc-art-note">Put it into practice</span>
            </div>
            <figcaption>Care begins with understanding.</figcaption>
          </figure>
        </section>

        <LandingEnginePreview />

        <section id="purpose" className="hc-purpose hc-section" aria-labelledby="purpose-title">
          <div>
            <span className="hc-eyebrow">What Healthcrest is about</span>
            <h2 id="purpose-title">Prevention starts<br />with understanding.</h2>
          </div>
          <div className="hc-purpose-copy">
            <p className="hc-lead">We believe looking after health should begin long before illness.</p>
            <p>Healthcrest exists to make evidence-based health information easier to understand, and to give people practical tools to look after themselves.</p>
            <p>Our focus is on non-pharmacological approaches: everyday habits and supportive actions that do not involve a medicine. These can complement appropriate medical care.</p>
            <p>Our starting point is simple: help people understand the connections, explore what the evidence says, and choose a manageable next step.</p>
            <p>Created by <strong>Chris Tsoto</strong>, Clinical Pharmacist, GPhC registration 2055329, MBA. <Link href="/about" prefetch={false} className="hc-text-link">Meet the creator and read our content approach</Link>.</p>
            <p className="hc-review-note">NHS habit references checked <time dateTime="2026-10-28">28 October 2026</time>. This source check does not certify the visual model as clinically validated.</p>
          </div>
        </section>

        <section id="pillars" className="hc-pillars hc-section" aria-labelledby="pillars-title">
          <div className="hc-section-heading">
            <div>
              <span className="hc-eyebrow">A connected foundation</span>
              <h2 id="pillars-title">Four pillars.<br />One everyday life.</h2>
            </div>
            <p>These habits do not happen in isolation. Explore each pillar, then see how they fit together. Social connection and reducing harmful substance use also belong in the wider picture.</p>
          </div>
          <div className="hc-pillar-grid">
            {pillars.map((pillar, index) => (
              <Link key={pillar.slug} prefetch={false} href={`/engine?pillar=${pillar.slug}`} className={`hc-pillar-card ${pillar.className}`}>
                <span className="hc-pillar-number">0{index + 1}</span>
                <pillar.icon size={28} strokeWidth={1.4} aria-hidden="true" />
                <h3>{pillar.title}</h3>
                <p>{pillar.note}</p>
                <span className="hc-pillar-link">Explore this pillar <ArrowUpRight size={17} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
          <UrgentSupport />
        </section>

        <section id="how-it-works" className="hc-how hc-section" aria-labelledby="how-title">
          <div className="hc-section-heading">
            <div>
              <span className="hc-eyebrow">From curiosity to a first step</span>
              <h2 id="how-title">Explore. Understand.<br /><em>Make it practical.</em></h2>
            </div>
            <p>The Habit Explorer is a place to learn through exploration. Aim for a useful insight, rather than trying to push every setting to its maximum.</p>
          </div>
          <ol className="hc-step-grid">
            <li><span>01</span><h3>Choose a pillar</h3><p>Start with movement, food, sleep or stress. You can also explore the combined Systems view.</p></li>
            <li><span>02</span><h3>Try an example</h3><p>Change a setting or choose a scenario. Watch how the educational visualisation responds.</p></li>
            <li><span>03</span><h3>Read the meaning</h3><p>Open the Guide for explanations, evidence labels, NHS references and one possible habit to try.</p></li>
          </ol>
          <aside className="hc-model-note" aria-label="About the educational model">
            <span className="hc-note-mark" aria-hidden="true">i</span>
            <p>The Habit Explorer illustrates selected habits and example scenarios. Its colours, shapes and labels are not measurements of your body, a personal health score or a diagnosis. The Guide explains the model’s limits.</p>
          </aside>
        </section>

        <section className="hc-start hc-section" aria-labelledby="start-title">
          <span className="hc-eyebrow">Start here</span>
          <h2 id="start-title">A question worth exploring.</h2>
          <div className="hc-start-grid">
            <Link href={learningGuideHref('Fitness')!} prefetch={false}><h3>How much activity do adults need?</h3><p>Understand weekly movement guidance and find an approachable first step.</p></Link>
            <Link href={learningGuideHref('Nutrition')!} prefetch={false}><h3>What does balanced eating mean?</h3><p>Look at everyday food patterns and the NHS Eatwell Guide.</p></Link>
            <Link href={learningGuideHref('Sleep')!} prefetch={false}><h3>Where can I start with sleep?</h3><p>Explore sleep routines, recovery and when to seek support.</p></Link>
            <Link href={learningGuideHref('Stress')!} prefetch={false}><h3>What could help with stress?</h3><p>Find manageable coping ideas and routes to further support.</p></Link>
          </div>
        </section>

        <section className="hc-return hc-section" aria-labelledby="return-title">
          <h2 id="return-title">Keep one next step to return to.</h2>
          <p>Make a seven-day plan, note what helps and choose your next adjustment. Save it on this device if you choose. No account or email subscription needed.</p>
          <Link href="/next-step#saved-draft-controls" prefetch={false} className="hc-text-link">Make or restore a habit plan <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <p><Link href="/next-step#return-to-plan" prefetch={false} className="hc-text-link">Return to my plan <ArrowUpRight size={16} aria-hidden="true" /></Link></p>
          <p><Link href="/next-step#seven-day-plan" prefetch={false} className="hc-text-link">Try a seven-day habit plan <ArrowUpRight size={16} aria-hidden="true" /></Link></p>
        </section>

        <section className="hc-invitation hc-section" aria-labelledby="invitation-title">
          <span className="hc-eyebrow">Your next step can be small</span>
          <h2 id="invitation-title">Begin with understanding.<br /><em>Build from there.</em></h2>
          <p>Choose one pillar. Ask one question. Find one practical idea to bring into your everyday life.</p>
          <Link prefetch={false} href="/engine" className="hc-button hc-button-primary">Try the Habit Explorer <ArrowUpRight size={19} aria-hidden="true" /></Link>
        </section>

        <section className="hc-sources hc-section" aria-labelledby="sources-title">
          <h2 id="sources-title">Starting points in the evidence</h2>
          <p>Our general habit guidance links to these NHS resources. They support the educational guidance, rather than validating every visual effect or scenario claim in the Habit Explorer.</p>
          <ul>
            {(['Fitness', 'Nutrition', 'Sleep', 'Stress'] as const).map((pillar) => (
              <li key={pillar}><a href={PILLAR_GUIDES[pillar].sourceUrl} target="_blank" rel="noopener noreferrer">{PILLAR_GUIDES[pillar].sourceLabel}<span className="hc-visually-hidden"> (opens in a new tab)</span><ArrowUpRight size={14} aria-hidden="true" /></a></li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
