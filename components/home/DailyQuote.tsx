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

  return (
    <div className="w-full flex items-center gap-s3 px-s4 md:px-s6 lg:px-s7 py-s3 bg-surface border-b border-line">
      <span className="text-label uppercase text-accent shrink-0">Today</span>
      <p className="text-meta text-muted italic truncate">
        &ldquo;{currentQuote.text}&rdquo;
        <span className="not-italic text-faint"> &mdash; {currentQuote.author}</span>
      </p>
    </div>
  );
};
