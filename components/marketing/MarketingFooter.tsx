import Link from 'next/link';

export const MarketingFooter = () => (
  <footer className="py-16 border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white text-white font-black text-xl flex items-center justify-center w-10 h-10 rounded-xl shadow-sm p-1">
               <img src="/favicon.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col justify-center mt-1">
              <span className="text-[10px] font-bold tracking-[0.22em] text-[#5E1451] leading-none mb-0.5">That&apos;s So</span>
              <span className="text-2xl font-black text-slate-900 leading-none">Econ<span className="text-[#5E1451]">!</span></span>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Master Entrepreneurial Economics, One Concept at a Time.</p>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-600">
        <div>© {new Date().getFullYear()} That&apos;s So Econ! All rights reserved.</div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Privacy</Link>
          <Link href="#" className="hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Terms</Link>
        </div>
      </div>
    </div>
  </footer>
);
