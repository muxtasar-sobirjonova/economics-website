import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const viewport: Viewport = {
  themeColor: "#1A1A3E",
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
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white text-[#24203F]`}
      >
        <NextTopLoader color="#7B6FE7" height={3} showSpinner={false} shadow="0 0 10px #7B6FE7,0 0 5px #7B6FE7" />
        {children}
      </body>
    </html>
  );
}
