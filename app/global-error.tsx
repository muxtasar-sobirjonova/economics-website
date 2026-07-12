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
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Critical Error</h2>
            <p className="text-slate-600 mb-6">
              A critical error occurred while rendering the page layout.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
