import type { NextConfig } from "next";
import { buildReleaseHeaders } from './scripts/release-identity.mjs';

const releaseHeaders = buildReleaseHeaders(process.env);

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'Referrer-Policy', value: 'no-referrer' }, ...releaseHeaders] }];
  },
  images: { formats: ['image/avif', 'image/webp'] },
};

export default nextConfig;
