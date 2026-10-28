import "./globals.css";
import { pageMetadata, SITE_URL, SITE_DESCRIPTION, WEBSITE_SCHEMA } from "@/lib/siteMetadata";
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  ...pageMetadata('Healthcrest', SITE_DESCRIPTION, '/'),
  metadataBase: new URL(SITE_URL),
  authors: [{ name: 'Chris Tsoto', url: SITE_URL + '/about' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA).replace(/</g, '\\u003c') }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
