import type { NextConfig } from "next";
import { buildReleaseHeaders } from './scripts/release-identity.mjs';

const releaseHeaders = buildReleaseHeaders(process.env);

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: '/:path*', headers: [{ key: 'Referrer-Policy', value: 'no-referrer' }, ...releaseHeaders] },
      // The fallback contains the same PNG as /icon. Static hosts can infer an
      // ICO media type from its conventional filename; keep it bound to the bytes.
      { source: '/favicon.ico', headers: [{ key: 'Content-Type', value: 'image/png' }] },
    ];
  },
  images: { formats: ['image/avif', 'image/webp'] },
};

export default nextConfig;
