import Link from 'next/link';

export const MarketingNav = () => (
  <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 w-full transition-all duration-300" aria-label="Main Navigation">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 relative z-50">
        <Link href="/" aria-label="That's So Econ Home" className="flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-brand-primary/50 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
          <div className="bg-brand-primary text-white font-black text-2xl flex items-center justify-center w-10 h-10 rounded-xl shadow-sm">
            T
          </div>
          <span className="font-bold text-slate-900 text-xl tracking-tight">
            That's So Econ.
          </span>
        </Link>
      </div>
      
      <div className="hidden lg:flex items-center gap-8" role="menubar">
        <Link href="#roadmap" className="font-semibold text-sm transition-colors text-gray-600 hover:text-slate-900 pb-1 border-b-2 border-transparent focus:outline-none focus:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" role="menuitem">Roadmap</Link>
        <Link href="#concepts" className="font-semibold text-sm transition-colors text-gray-600 hover:text-slate-900 pb-1 border-b-2 border-transparent focus:outline-none focus:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" role="menuitem">Concepts</Link>
        <Link href="#articles" className="font-semibold text-sm transition-colors text-gray-600 hover:text-slate-900 pb-1 border-b-2 border-transparent focus:outline-none focus:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" role="menuitem">Articles</Link>
        <Link href="#quizzes" className="font-semibold text-sm transition-colors text-gray-600 hover:text-slate-900 pb-1 border-b-2 border-transparent focus:outline-none focus:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" role="menuitem">Quizzes</Link>
        <Link href="#my-notes" className="font-semibold text-sm transition-colors text-gray-600 hover:text-slate-900 pb-1 border-b-2 border-transparent focus:outline-none focus:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" role="menuitem">Notes</Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/login" className="text-slate-900 font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
          Log In
        </Link>
        <Link href="/signup" className="bg-brand-primary text-white px-4 sm:px-5 py-2 rounded-full font-bold hover:bg-[#6859e0] transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/50 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
          Sign Up
        </Link>
      </div>
    </div>
  </nav>
);
