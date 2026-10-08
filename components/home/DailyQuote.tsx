import React from 'react';

const TRACK_QUOTES: Record<string, { text: string; author: string }[]> = {
  ENTREPRENEURSHIP_ECONOMICS: [
    { text: "The entrepreneur always looks for change, responds to it, and exploits it as an opportunity.", author: "Peter Drucker" },
    { text: "Capitalism is a process of creative destruction.", author: "Joseph Schumpeter" }
  ],
  BEHAVIORAL_ECONOMICS: [
    { text: "Nothing in life is as important as you think it is, while you are thinking about it.", author: "Daniel Kahneman" },
    { text: "If you want people to do something, make it easy.", author: "Richard Thaler" }
  ],
  DEVELOPMENT_ECONOMICS: [
    { text: "Development consists of the removal of various types of unfreedoms that leave people with little choice.", author: "Amartya Sen" },
    { text: "Poverty is not just a lack of money; it is not having the capability to realize one's full potential.", author: "Esther Duflo" }
  ]
};

export const DailyQuote = ({ activeTrack = "ENTREPRENEURSHIP_ECONOMICS" }: { activeTrack?: string }) => {
  const quotes = TRACK_QUOTES[activeTrack] || TRACK_QUOTES.ENTREPRENEURSHIP_ECONOMICS;
  
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const currentQuote = quotes[getDayOfYear() % quotes.length];

  // Set like a pull quote at the foot of the dashboard rather than a banner
  // across the top of it: it is the one thing on that page that is not a task.
  return (
    <>
      <span
        className="w-9 h-9 rounded-md grid place-items-center shrink-0 mt-0.5"
        style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}
        aria-hidden
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 7H5a2 2 0 00-2 2v4a2 2 0 002 2h2v2a2 2 0 01-2 2H4v2h1a4 4 0 004-4V7zm11 0h-4a2 2 0 00-2 2v4a2 2 0 002 2h2v2a2 2 0 01-2 2h-1v2h1a4 4 0 004-4V7z" />
        </svg>
      </span>
      <span className="min-w-0">
        <p className="font-reading text-h3 text-ink leading-snug max-w-[62ch]">
          {currentQuote.text}
        </p>
        <span className="block text-meta text-muted mt-s2">{currentQuote.author}</span>
      </span>
    </>
  );
};
