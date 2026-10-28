import "./globals.css";
import { pageMetadata, SITE_URL, SITE_DESCRIPTION, WEBSITE_SCHEMA } from "@/lib/siteMetadata";
import { MeasurementProvider } from '@/components/MeasurementProvider';
import { deploymentAllowsMeasurement } from '@/lib/privacy/measurement';

export const metadata = {
  ...pageMetadata('Healthcrest', SITE_DESCRIPTION, '/'),
  metadataBase: new URL(SITE_URL),
  referrer: 'no-referrer' as const,
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
        <MeasurementProvider enabled={deploymentAllowsMeasurement(process.env.HEALTHCREST_TELEMETRY_ENABLED, process.env.VERCEL_ENV)}>
          {children}
        </MeasurementProvider>
      </body>
    </html>
  );
}
