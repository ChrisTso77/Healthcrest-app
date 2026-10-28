import type { MetadataRoute } from 'next';
import { LEARNING_GUIDES, GUIDE_SOURCE_CHECKED_ON } from '@/lib/education/learningGuides';
import { SITE_URL } from '@/lib/siteMetadata';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/start', '/learn', '/engine', '/next-step', '/about', '/contact', '/storage', '/privacy']
    .map(path => ({ url: new URL(path, SITE_URL).toString() }))
    .concat(LEARNING_GUIDES.map(guide => ({ url: SITE_URL + '/learn/' + guide.slug, lastModified: GUIDE_SOURCE_CHECKED_ON })));
}
