import type { NextConfig } from "next";
import { buildReleaseHeaders } from './scripts/release-identity.mjs';

const releaseHeaders = buildReleaseHeaders(process.env);

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: '/:path*', headers: [
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        // Baseline containment only. Script/style/resource restrictions need a
        // separate nonce/static-rendering review; do not claim full XSS coverage.
        { key: 'Content-Security-Policy', value: "base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'" },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ...releaseHeaders,
      ] },
      // The fallback contains the same PNG as /icon. Static hosts can infer an
      // ICO media type from its conventional filename; keep it bound to the bytes.
      { source: '/favicon.ico', headers: [{ key: 'Content-Type', value: 'image/png' }] },
    ];
  },
  images: { formats: ['image/avif', 'image/webp'] },
};

export default nextConfig;
