import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center border border-slate-200">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <SearchX size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
        <p className="text-slate-600 mb-8">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
