"use client";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Global Error:", error);
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
          <div className="bg-surface p-8 rounded-xl shadow-sm max-w-md w-full text-center border border-[#C7D7FF]">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 className="text-2xl font-extrabold text-[#111111] mb-2 tracking-tight">Something went wrong</h2>
            <p className="text-muted mb-6 font-medium">
              We encountered a critical error while loading this page.
              {error.message && <span className="block mt-2 text-xs text-red-500 bg-red-50 p-2 rounded">{error.message}</span>}
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-strong transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
