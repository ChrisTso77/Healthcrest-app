import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/media/healthcrest-logo.png';

export function SiteBrand({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/" aria-label="Healthcrest home" className="hc-brand">
      <Image src={logo} alt="Healthcrest" loading={footer ? 'lazy' : 'eager'} sizes={footer ? '(max-width: 700px) 280px, 220px' : '(max-width: 700px) 200px, 220px'} />
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="hc-header">
      <SiteBrand />
      <nav className="hc-navigation" aria-label="Main navigation">
        <Link href="/learn" prefetch={false}>Learn</Link>
        <Link href="/engine" prefetch={false}>Habit Explorer</Link>
        <Link href="/about" prefetch={false}>About</Link>
        <Link href="/contact" prefetch={false}>Contact</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="hc-footer">
      <SiteBrand footer />
      <div className="hc-footer-links">
        <p>Health through everyday habits</p>
        <nav aria-label="Footer navigation">
          <Link href="/about" prefetch={false}>About &amp; sources</Link>
          <Link href="/contact" prefetch={false}>Contact</Link>
          <Link href="/storage" prefetch={false}>Browser storage</Link>
        </nav>
      </div>
      <p className="hc-footer-note">Educational information for adults. Adapt ideas to your health, ability and circumstances, alongside appropriate clinical advice.</p>
    </footer>
  );
}
