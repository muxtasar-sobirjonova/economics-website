import Link from 'next/link';

export const MarketingFooter = () => (
  <footer className="py-16 border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary text-white font-black text-xl flex items-center justify-center w-10 h-10 rounded-xl shadow-sm">
              T
            </div>
            <span className="font-bold text-slate-900 text-2xl tracking-tight">
              That's So Econ.
            </span>
          </div>
          <p className="text-gray-600 font-medium">Master Entrepreneurial Economics, One Concept at a Time.</p>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-600">
        <div>© {new Date().getFullYear()} That's So Econ. All rights reserved.</div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Privacy</Link>
          <Link href="#" className="hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Terms</Link>
        </div>
      </div>
    </div>
  </footer>
);
