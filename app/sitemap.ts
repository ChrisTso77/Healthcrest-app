import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteMetadata';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/start', '/learn', '/engine', '/next-step', '/about', '/contact', '/storage', '/privacy']
    .map(path => ({ url: new URL(path, SITE_URL).toString() }));
}
