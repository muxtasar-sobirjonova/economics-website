import React from 'react';

const getDailyQuote = () => {
  return { 
    text: "The entrepreneur always looks for change, responds to it, and exploits it as an opportunity.", 
    author: "Peter Drucker" 
  };
};

export const DailyQuote = () => {
  const currentQuote = getDailyQuote();

  return (
    <div className="w-full text-center pt-10 pb-4">
      <p
        className="text-slate-900 italic mx-auto px-4 max-w-[800px] text-base leading-relaxed font-serif"
      >
        “{currentQuote.text}”
      </p>
      <p className="text-slate-900/60 text-[13px] mt-2 text-center">— {currentQuote.author}</p>
    </div>
  );
};
