'use client';
import Link from 'next/link';
import type { ComponentProps } from 'react';
let activeGuard: (() => boolean) | null = null;
// A client-only registration; unmount can remove only its own guard.
export function registerPlannerGuard(guard: () => boolean) {
  activeGuard = guard;
  return () => { if (activeGuard === guard) activeGuard = null; };
}
export default function PlannerSafeLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} onNavigate={event => {
    props.onNavigate?.(event);
    const href = typeof props.href === 'string' ? props.href : null;
    if (href) {
      const url = new URL(href, location.href);
      if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search) return;
    }
    if (activeGuard && !activeGuard()) event.preventDefault();
  }} />;
}
