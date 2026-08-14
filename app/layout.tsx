import type { Metadata, Viewport } from "next";
import { Literata, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';

// Literata carries the whole product — interface and article body alike.
const literata = Literata({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-literata",
});

// Numerals, codes and tags only.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["500"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#6E5FC4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // prevents zoom on focus in iOS
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "That's So Econ | Entrepreneurial Economics",
  description: "Learn economics through real entrepreneurship stories.",
  openGraph: {
    title: "That's So Econ",
    description: "Learn economics through real entrepreneurship stories.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "That's So Econ",
    description: "Learn economics through real entrepreneurship stories.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light only" />
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      </head>
      <body
        className={`${literata.variable} ${jetbrains.variable} font-sans min-h-screen bg-bg text-ink`}
      >
        <NextTopLoader color="var(--accent)" height={3} showSpinner={false} shadow="0 0 10px var(--accent),0 0 5px var(--accent)" />
        {children}
      </body>
    </html>
  );
}
