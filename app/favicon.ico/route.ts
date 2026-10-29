import { createBrowserIcon } from '@/lib/branding/browserIcon';

// The conventional address and metadata icon use the same PNG renderer.
export const dynamic = 'force-static';

export function GET() {
  return createBrowserIcon();
}
