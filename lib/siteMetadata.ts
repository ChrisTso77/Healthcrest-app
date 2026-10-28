import type { Metadata } from 'next';

export const SITE_URL = 'https://www.healthcrest.uk';
export const SITE_DESCRIPTION = 'Understand everyday habits and explore practical, evidence-informed ways to care for your health.';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const images = [{
    url: new URL('/opengraph-image', SITE_URL).toString(),
    width: 1200,
    height: 630,
    alt: 'Healthcrest — Health through everyday habits. Explore movement, food, sleep and stress support.',
  }];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Healthcrest', locale: 'en_GB', type: 'website', images },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Healthcrest',
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: 'en-GB',
  creator: {
    '@type': 'Person',
    name: 'Chris Tsoto',
    jobTitle: 'Clinical Pharmacist',
    honorificSuffix: 'MBA',
    url: SITE_URL + '/about',
  },
};
