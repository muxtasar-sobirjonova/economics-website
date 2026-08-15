import { FaqAccordion } from "./FaqAccordion";
import Link from "next/link";

/** Small previews built from the real design tokens — not hand-drawn fakes. */

const AgendaPreview = () => (
  <div className="rounded-lg border border-line bg-surface shadow-sh2 p-s4 w-full max-w-[420px]">
    <div className="flex items-baseline justify-between mb-s3">
      <span className="text-ui font-semibold text-ink">Today&apos;s Agenda</span>
      <span className="font-mono text-meta text-muted tabular">1 / 3 done</span>
    </div>
    <div className="h-1 w-full bg-bg-sunk rounded-sm overflow-hidden mb-s3">
      <div className="h-full w-1/3 bg-accent rounded-sm" />
    </div>
    {[
      { k: "CONCEPT", tone: "concept", t: "Marginal cost, plainly", done: true },
      { k: "ARTICLE", tone: "article", t: "Why Airbnb priced beds like hotels", done: false },
      { k: "QUIZ", tone: "quiz", t: "10 questions · pass at 8", done: false },
    ].map((r) => (
      <div key={r.k} className="flex items-center gap-s3 p-s3 rounded-md border border-line bg-raised mb-s2 last:mb-0">
        <span className="w-[3px] self-stretch rounded-sm" style={{ background: `var(--${r.tone})` }} />
        <span className="min-w-0 flex-1">
          <span className="text-label uppercase px-[6px] py-[2px] rounded-sm" style={{ background: `var(--${r.tone}-soft)`, color: `var(--${r.tone})` }}>
            {r.k}
          </span>
          <span className="block text-meta text-ink truncate mt-1">{r.t}</span>
        </span>
        <span className={`w-6 h-6 rounded-full border shrink-0 ${r.done ? "bg-success border-success" : "border-line bg-bg-sunk"}`} />
      </div>
    ))}
  </div>
);

const QuizPreview = () => (
  <div className="rounded-lg border border-line bg-surface shadow-sh2 p-s4 w-full max-w-[420px]">
    <p className="text-ui font-semibold text-ink mb-s3">Why price against hotels, not under them?</p>
    <div className="flex items-center gap-s3 p-s3 rounded-md border border-success bg-success-soft mb-s2">
      <span className="w-6 h-6 rounded-sm grid place-items-center bg-success text-white font-mono text-[11px]">A</span>
      <span className="text-meta text-ink">Marginal cost is near zero</span>
    </div>
    <div className="flex items-center gap-s3 p-s3 rounded-md border border-line bg-raised opacity-60">
      <span className="w-6 h-6 rounded-sm grid place-items-center bg-bg-sunk text-muted font-mono text-[11px]">B</span>
      <span className="text-meta text-ink">Hotels had already cut rates</span>
    </div>
  </div>
);

const NotesPreview = () => (
  <div className="w-full max-w-[420px] flex flex-col gap-s3">
    <div className="rounded-md p-s4 shadow-sh2" style={{ background: "var(--hl-yellow)" }}>
      <span className="text-label uppercase text-black/50">Article · Day 17</span>
      <p className="text-meta text-black/85 mt-s2">
        &ldquo;Adding one guest to a room you already heat costs almost nothing.&rdquo;
      </p>
    </div>
    <div className="rounded-md p-s4 shadow-sh2 ml-s6" style={{ background: "var(--hl-blue)" }}>
      <span className="text-label uppercase text-black/50">My note</span>
      <p className="text-meta text-black/85 mt-s2">
        Is this the same as price discrimination? Check day 19.
      </p>
    </div>
  </div>
);

const ArticlePreview = () => (
  <div className="rounded-lg border border-line bg-read-bg shadow-sh2 p-s5 w-full max-w-[420px]">
    <span className="text-label uppercase" style={{ color: "var(--article)" }}>Article · 12 min</span>
    <h3 className="text-h3 font-semibold mt-s2" style={{ color: "var(--read-text)" }}>
      The bed that cost nothing to make
    </h3>
    <p className="text-meta mt-s3 leading-[1.7]" style={{ color: "var(--read-text)", opacity: .75 }}>
      Three founders had a loft, two air mattresses and a city with no rooms
      left. What they discovered about price had nothing to do with bedding…
    </p>
  </div>
);

function Section({
  id, eyebrow, title, body, children, flip,
}: {
  id?: string; eyebrow: string; title: string; body: string; children: React.ReactNode; flip?: boolean;
}) {
  return (
    <section id={id} className="max-w-[1180px] mx-auto px-s4 md:px-s5 py-s7 md:py-s8">
      <div className={`flex flex-col ${flip ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-s6 md:gap-s8`}>
        <div className="flex-1 min-w-0">
          <span className="font-mono text-label uppercase text-accent-strong">{eyebrow}</span>
          <h2 className="mt-s3 text-h1-sm md:text-h1 font-semibold text-ink text-balance">{title}</h2>
          <p className="mt-s4 text-ui text-muted max-w-[54ch]">{body}</p>
        </div>
        <div className="flex-1 w-full flex justify-center">{children}</div>
      </div>
    </section>
  );
}

const APPROACH = [
  { t: "Learn by doing, not memorising", b: "Every concept is immediately spent on a decision someone actually had to make." },
  { t: "Real case studies, not just theory", b: "168 readings drawn from ventures, markets and mistakes you can name." },
  { t: "A plan that adapts daily", b: "Miss a day and the plan reshuffles instead of shaming you into quitting." },
];

const TRACKS = [
  { t: "Entrepreneurship Economics", b: "Why founders exist, how value is created, captured and priced." },
  { t: "Development Economics", b: "Why some countries grow rich and others stay poor." },
  { t: "Behavioral Economics", b: "How people actually decide — shortcuts, biases and nudges." },
];

export const MarketingSections = () => (
  <>
    <Section
      id="how"
      eyebrow="Your personal study plan"
      title="Stop guessing. Start learning."
      body="The dashboard shows one day's work: a concept, a case study, a quiz. Nothing else competes for attention until those three are done."
    >
      <AgendaPreview />
    </Section>

    <Section
      eyebrow="Case study driven"
      title="Applied case studies."
      body="Magazine-length readings about ventures that got it right and wrong, set in a serif built for the long haul."
      flip
    >
      <ArticlePreview />
    </Section>

    <Section
      eyebrow="Active recall"
      title="Mastery through assessment."
      body="Ten questions, eight to pass. Wrong answers become a review deck instead of a dead end."
    >
      <QuizPreview />
    </Section>

    <Section
      eyebrow="Spaced repetition notes"
      title="Highlight it. Save it. Never forget it."
      body="Select any line while reading, pick a colour, and it comes back as a flashcard days later — with the lesson it came from attached."
      flip
    >
      <NotesPreview />
    </Section>

    {/* Tracks */}
    <section id="tracks" className="max-w-[1180px] mx-auto px-s4 md:px-s5 py-s7 md:py-s8">
      <div className="text-center mb-s6">
        <span className="font-mono text-label uppercase text-accent-strong">Three tracks</span>
        <h2 className="mt-s3 text-h1-sm md:text-h1 font-semibold text-ink">Pick where to start.</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-s4">
        {TRACKS.map((t, i) => (
          <div key={t.t} className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
            <span className="font-mono text-label uppercase text-faint">0{i + 1}</span>
            <h3 className="text-h3 font-semibold text-ink mt-s2">{t.t}</h3>
            <p className="text-meta text-muted mt-s2">{t.b}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Approach */}
    <section className="max-w-[1180px] mx-auto px-s4 md:px-s5 py-s7 md:py-s8">
      <div className="text-center mb-s6">
        <span className="font-mono text-label uppercase text-accent-strong">Our approach</span>
        <h2 className="mt-s3 text-h1-sm md:text-h1 font-semibold text-ink">Why choose That&apos;s So Econ?</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-s4">
        {APPROACH.map((a) => (
          <div key={a.t} className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
            <h3 className="text-h3 font-semibold text-ink">{a.t}</h3>
            <p className="text-meta text-muted mt-s2">{a.b}</p>
          </div>
        ))}
      </div>
    </section>

    {/* FAQ */}
    <section id="faq" className="max-w-[820px] mx-auto px-s4 md:px-s5 py-s7 md:py-s8">
      <div className="text-center mb-s6">
        <span className="font-mono text-label uppercase text-accent-strong">Support</span>
        <h2 className="mt-s3 text-h1-sm md:text-h1 font-semibold text-ink">Frequently asked questions</h2>
      </div>
      <FaqAccordion />
    </section>

    {/* Closing */}
    <section className="max-w-[1180px] mx-auto px-s4 md:px-s5 py-s8 text-center">
      <h2 className="text-h1-sm md:text-h1 font-semibold text-ink text-balance max-w-[22ch] mx-auto">
        Your plot is empty ground today.
      </h2>
      <p className="mt-s4 text-ui text-muted">
        Twelve minutes from now it has its first building.
      </p>
      <Link
        href="/signup"
        className="mt-s6 inline-flex items-center px-s6 py-s3 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors min-h-[48px]"
      >
        Get started free
      </Link>
    </section>
  </>
);
