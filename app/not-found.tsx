import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      <div className="bg-surface p-8 rounded-xl shadow-sm max-w-md w-full text-center border border-line">
        <div className="w-16 h-16 bg-bg-sunk text-faint rounded-full flex items-center justify-center mx-auto mb-6">
          <SearchX size={32} />
        </div>
        <h2 className="text-2xl font-bold text-ink mb-2">Page Not Found</h2>
        <p className="text-muted mb-8">
          We couldn&apos;t find the page you were looking for. It might have been moved or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
