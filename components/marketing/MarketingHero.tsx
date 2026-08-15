import Link from "next/link";

const STATS = [
  { n: "56", label: "days per track" },
  { n: "168", label: "lessons in all" },
  { n: "12", label: "min a day" },
];

export const MarketingHero = () => (
  <section className="relative overflow-hidden">
    {/* One quiet wash of colour, not a light show */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ background: "radial-gradient(90rem 40rem at 50% -10%, var(--accent-soft), transparent 60%)" }}
    />

    <div className="relative max-w-[1180px] mx-auto px-s4 md:px-s5 pt-s8 pb-s7 text-center">
      <span className="font-mono text-label uppercase text-accent-strong">
        56 days · 3 tracks · real ventures
      </span>

      <h1 className="mt-s4 text-h1 md:text-display font-semibold text-ink text-balance max-w-[18ch] mx-auto">
        Learn economics by building something on it.
      </h1>

      <p className="mt-s5 text-ui md:text-h3 text-muted max-w-[58ch] mx-auto font-normal">
        One lesson a day, told through the decisions real founders made. Pass the
        quiz and the day puts up a building on your plot. Eight chapters later you
        have a skyline — and the theory to explain it.
      </p>

      <div className="mt-s6 flex flex-wrap items-center justify-center gap-s3">
        <Link
          href="/signup"
          className="px-s6 py-s3 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors min-h-[48px] flex items-center"
        >
          Get started free
        </Link>
        <Link
          href="#how"
          className="px-s6 py-s3 rounded-md border border-line-strong text-ink text-ui font-medium hover:border-accent hover:text-accent transition-colors min-h-[48px] flex items-center"
        >
          See the roadmap
        </Link>
      </div>

      <dl className="mt-s8 flex flex-wrap justify-center gap-s7">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <dt className="font-mono text-h1 text-ink tabular leading-none">{s.n}</dt>
            <dd className="text-label uppercase text-faint mt-s2">{s.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);
