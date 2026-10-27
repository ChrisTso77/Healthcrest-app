import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healthcrest",
  description: "Understand everyday habits and explore practical, evidence-informed ways to care for your health.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
