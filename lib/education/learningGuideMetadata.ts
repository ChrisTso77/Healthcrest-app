import type { Metadata } from 'next';
import { pageMetadata, SITE_URL } from '@/lib/siteMetadata';
import { GUIDE_SOURCE_CHECKED_ON, type LearningGuide } from './learningGuides';

export function learningGuideMetadata(guide: LearningGuide): Metadata {
  const base = pageMetadata(guide.title + ' | Healthcrest', guide.description, '/learn/' + guide.slug);
  return {
    ...base,
    authors: [{ name: 'Healthcrest', url: SITE_URL + '/about' }],
    openGraph: { ...base.openGraph, type: 'article', modifiedTime: GUIDE_SOURCE_CHECKED_ON },
  };
}
export function learningGuideSchema(guide: LearningGuide) {
  const url = SITE_URL + '/learn/' + guide.slug;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article', headline: guide.title, description: guide.description,
        url, mainEntityOfPage: url, inLanguage: 'en-GB', dateModified: GUIDE_SOURCE_CHECKED_ON,
        author: { '@type': 'Organization', name: 'Healthcrest', url: SITE_URL + '/about' },
        publisher: { '@type': 'Organization', name: 'Healthcrest Ltd', url: SITE_URL },
        about: { '@type': 'Thing', name: guide.topicLabel },
        citation: guide.sources.map(source => ({ '@type': 'CreativeWork', name: source.title, url: source.url })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
          { '@type': 'ListItem', position: 2, name: 'Learn', item: SITE_URL + '/learn' },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ],
      },
    ],
  };
}
