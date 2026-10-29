import type { Metadata } from 'next';
import { pageMetadata, SITE_URL } from '@/lib/siteMetadata';
import { GUIDE_SOURCE_CHECKED_ON, type LearningGuide } from './learningGuides';

export const GUIDE_AUTHOR = { name: 'Healthcrest', url: SITE_URL + '/about' } as const;
export function learningGuideBreadcrumbs(guide: LearningGuide) {
  return [
    { name: 'Home', href: '/' },
    { name: 'Learn', href: '/learn' },
    { name: guide.topicLabel, href: '/learn/' + guide.slug },
  ];
}

export function learningGuideMetadata(guide: LearningGuide): Metadata {
  const base = pageMetadata(guide.title + ' | Healthcrest', guide.description, '/learn/' + guide.slug);
  return {
    ...base,
    authors: [GUIDE_AUTHOR],
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
        author: { '@type': 'Organization', ...GUIDE_AUTHOR },
        publisher: { '@type': 'Organization', name: 'Healthcrest Ltd', url: SITE_URL },
        about: { '@type': 'Thing', name: guide.topicLabel },
        citation: guide.sources.map(source => ({ '@type': 'CreativeWork', name: source.title, url: source.url })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: learningGuideBreadcrumbs(guide).map((item, index) => ({
          '@type': 'ListItem', position: index + 1, name: item.name, item: new URL(item.href, SITE_URL).href,
        })),
      },
    ],
  };
}
