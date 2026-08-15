import Link from "next/link";

export const MarketingFooter = () => (
  <footer className="border-t border-line mt-s6">
    <div className="max-w-[1180px] mx-auto px-s4 md:px-s5 py-s6 flex flex-col sm:flex-row items-center justify-between gap-s4">
      <span className="text-meta text-muted">That&apos;s So Econ</span>
      <nav className="flex flex-wrap items-center gap-s5 text-meta text-faint">
        <a href="#tracks" className="hover:text-ink transition-colors">Tracks</a>
        <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
        <Link href="/login" className="hover:text-ink transition-colors">Log in</Link>
      </nav>
      <span className="font-mono text-meta text-faint">© {new Date().getFullYear()}</span>
    </div>
  </footer>
);
