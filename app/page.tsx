import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, Apple, ArrowDown, ArrowUpRight, Brain, Moon } from 'lucide-react';
import { LandingEnginePreview } from '@/components/LandingEnginePreview';
import { PILLAR_GUIDES } from '@/lib/education/healthGuide';
import { HummingbirdAnimation } from '@/components/HummingbirdAnimation';
import './landing.css';

export const metadata: Metadata = {
  title: 'Healthcrest | Health through everyday habits',
  description: 'Understand the connections between movement, food, sleep and stress. Explore evidence-informed education and practical tools for everyday health.',
};

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
      <header className="hc-header">
        <Link href="/" aria-label="Healthcrest home" className="hc-brand">
          {/* Preserve the supplied artwork without cropping its wordmark or tagline. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/healthcrest-logo.png" alt="HealthCrest — Optimising health" width={1664} height={940} />
        </Link>
        <nav className="hc-navigation" aria-label="Main navigation">
          <a href="#purpose">Our purpose</a>
          <a href="#pillars">Four pillars</a>
          <a href="#how-it-works">How it works</a>
          <Link href="/learn" prefetch={false}>Learn</Link>
        </nav>
        <Link prefetch={false} href="/engine" className="hc-header-cta">Explore engine <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="hc-hero hc-section" aria-labelledby="hero-title">
          <div className="hc-hero-copy">
            <span className="hc-eyebrow">Prevention through understanding</span>
            <h1 id="hero-title">Small habits.<br /><em>Connected health.</em></h1>
            <p className="hc-hero-description">Understand how movement, food, sleep and stress relate to your health—and find practical ways to care for yourself, every day.</p>
            <div className="hc-hero-actions">
              <Link prefetch={false} href="/engine" className="hc-button hc-button-primary">Explore the engine <ArrowUpRight size={19} aria-hidden="true" /></Link>
              <a href="#how-it-works" className="hc-text-link">See how it works <ArrowDown size={15} aria-hidden="true" /></a>
            </div>
            <p className="hc-hero-footnote">An educational space to explore. No account needed.</p>
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
        </section>

        <LandingEnginePreview />

        <section id="how-it-works" className="hc-how hc-section" aria-labelledby="how-title">
          <div className="hc-section-heading">
            <div>
              <span className="hc-eyebrow">From curiosity to a first step</span>
              <h2 id="how-title">Explore. Understand.<br /><em>Make it practical.</em></h2>
            </div>
            <p>The optimisation engine is a place to learn through exploration. Aim for a useful insight, rather than trying to push every setting to its maximum.</p>
          </div>
          <ol className="hc-step-grid">
            <li><span>01</span><h3>Choose a pillar</h3><p>Start with movement, food, sleep or stress. You can also explore the combined Systems view.</p></li>
            <li><span>02</span><h3>Try an example</h3><p>Change a setting or choose a scenario. Watch how the educational visualisation responds.</p></li>
            <li><span>03</span><h3>Read the meaning</h3><p>Open the Guide for explanations, evidence labels, NHS references and one possible habit to try.</p></li>
          </ol>
          <aside className="hc-model-note" aria-label="About the educational model">
            <span className="hc-note-mark" aria-hidden="true">i</span>
            <p>The engine illustrates selected habits and example scenarios. Its colours, shapes and labels are not measurements of your body, a personal health score or a diagnosis. The Guide explains the model’s limits.</p>
          </aside>
        </section>

        <section className="hc-invitation hc-section" aria-labelledby="invitation-title">
          <span className="hc-eyebrow">Your next step can be small</span>
          <h2 id="invitation-title">Begin with understanding.<br /><em>Build from there.</em></h2>
          <p>Choose one pillar. Ask one question. Find one practical idea to bring into your everyday life.</p>
          <Link prefetch={false} href="/engine" className="hc-button hc-button-primary">Explore the engine <ArrowUpRight size={19} aria-hidden="true" /></Link>
        </section>

        <section className="hc-sources hc-section" aria-labelledby="sources-title">
          <h2 id="sources-title">Starting points in the evidence</h2>
          <p>Our general habit guidance links to these NHS resources. They support the educational guidance, rather than validating every visual effect or scenario claim in the engine.</p>
          <ul>
            {(['Fitness', 'Nutrition', 'Sleep', 'Stress'] as const).map((pillar) => (
              <li key={pillar}><a href={PILLAR_GUIDES[pillar].sourceUrl} target="_blank" rel="noopener noreferrer">{PILLAR_GUIDES[pillar].sourceLabel}<span className="hc-visually-hidden"> (opens in a new tab)</span><ArrowUpRight size={14} aria-hidden="true" /></a></li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="hc-footer">
        <Link href="/" aria-label="Healthcrest home" className="hc-brand">
          {/* Preserve the supplied artwork without cropping its wordmark or tagline. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/healthcrest-logo.png" alt="HealthCrest — Optimising health" width={1664} height={940} />
        </Link>
        <p>Evidence-informed understanding. Practical everyday care.</p>
        <p className="hc-footer-note">Educational information for adults. Adapt ideas to your health, ability and circumstances, alongside appropriate clinical advice.</p>
      </footer>
    </div>
  );
}
