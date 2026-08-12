import React from "react";

export function ReviewCompletion({
  isPerfect,
  knewItCount,
  totalInSession,
  reviewAgainCount,
  activeLessonId,
  startSession,
  setActiveLessonId
}: {
  isPerfect: boolean;
  knewItCount: number;
  totalInSession: number;
  reviewAgainCount: number;
  activeLessonId: number;
  startSession: (id: number) => void;
  setActiveLessonId: (id: number | null) => void;
}) {
  return (
    <div className="flex-1 min-h-screen bg-slate-50 flex flex-col p-10 relative max-w-[1200px] mx-auto w-full">
      <div className="mb-2 shrink-0">
        <h1 className="text-[13px] font-[700] text-gray-900 uppercase tracking-[0.08em] mb-1">My Notes</h1>
        <p className="text-sm text-gray-500">Card Review Complete</p>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        {isPerfect && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {Array.from({length: 20}).map((_, i) => {
              const colors = ['#3D52A0', '#22C55E', '#FCD34D', '#F9A8D4'];
              const left = Math.random() * 100;
              const delay = Math.random() * 1.5;
              const duration = 1.5 + Math.random() * 1.5;
              return (
                <div key={i} className="absolute top-0 w-3 h-3 rounded-full animate-confettiFall"
                      style={{ left: `${left}%`, backgroundColor: colors[Math.floor(Math.random() * colors.length)], '--delay': `${delay}s`, '--duration': `${duration}s` } as React.CSSProperties} />
              );
            })}
          </div>
        )}
        
        <h2 className="text-[28px] font-[900] text-gray-900 mb-2 z-10">🎉 All Done!</h2>
        <p className="text-base text-gray-500 z-10">You memorized {knewItCount} of {totalInSession} notes today</p>
        {reviewAgainCount > 0 && (
          <p className="text-sm text-red-500 mt-2 font-bold z-10">↻ {reviewAgainCount} notes needed review</p>
        )}
        
        <div className="flex gap-4 z-10 mt-8">
          {reviewAgainCount > 0 && (
            <button onClick={() => startSession(activeLessonId)} className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold shadow-sm hover:bg-red-600">
              Review Again
            </button>
          )}
          <button onClick={() => setActiveLessonId(null)} className="bg-[#3D52A0] text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity">
            ← Back to days
          </button>
        </div>
      </div>
    </div>
  );
}
