import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'Referrer-Policy', value: 'no-referrer' }] }];
  },
  images: { formats: ['image/avif', 'image/webp'] },
};

export default nextConfig;
