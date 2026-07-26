import React from "react";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex justify-center p-4">
      <div className="w-full max-w-[1200px] mt-8 flex flex-col md:flex-row gap-6">
        
        {/* Left column Skeleton */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="h-40 bg-white border border-slate-200 rounded-3xl animate-pulse w-full"></div>
          <div className="h-64 bg-white border border-slate-200 rounded-3xl animate-pulse w-full"></div>
          <div className="h-64 bg-white border border-slate-200 rounded-3xl animate-pulse w-full"></div>
        </div>

        {/* Right column Skeleton */}
        <div className="w-full md:w-[320px] flex flex-col gap-6 shrink-0">
          <div className="h-48 bg-white border border-slate-200 rounded-3xl animate-pulse w-full"></div>
          <div className="h-48 bg-white border border-slate-200 rounded-3xl animate-pulse w-full"></div>
        </div>

      </div>
    </div>
  );
}
