import type { Metadata, Viewport } from "next";
import { Figtree, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';

/**
 * The three faces the design asks for, and no substitutes.
 *
 * Figtree for the interface, Newsreader for headings, JetBrains Mono for
 * figures. Inter and Literata stood in for the first two for a while on the
 * grounds that nobody could tell them apart; the person who drew the design
 * could, at a glance, so they are gone.
 */
const figtree = Figtree({ subsets: ["latin"], display: "swap" });

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-reading",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["500"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#51487F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // prevents zoom on focus in iOS
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "That's So Econ | Entrepreneurial Economics",
  description: "Learn economics through real entrepreneurship stories.",
  icons: {
    icon: "/favicon.png",
    // The mark is drawn as a rounded app tile, so iOS should use it when the
    // site is added to a home screen rather than screenshotting the page.
    apple: "/favicon.png",
  },
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
        className={`${figtree.className} ${newsreader.variable} ${jetbrains.variable} min-h-screen bg-white text-[#24203F] not-italic`}
      >
        <NextTopLoader color="var(--accent)" height={3} showSpinner={false} shadow="0 0 10px var(--accent),0 0 5px var(--accent)" />
        {children}
      </body>
    </html>
  );
}
