import React from "react";

export default function RoadmapLoading() {
  return (
    <div className="roadmap-page min-h-screen w-full font-sans flex flex-col p-0 bg-slate-50">
      {/* Page Header Skeleton */}
      <div className="w-full bg-white flex justify-between items-center shrink-0 border-b border-slate-100 px-8 h-[52px]">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* Content area Skeleton */}
      <div className="flex flex-col xl:flex-row flex-1 overflow-y-auto xl:overflow-hidden p-4 gap-5">
        {/* Left Content Area Skeleton */}
        <div className="flex-1 flex flex-col items-center pb-10">
          <div className="w-full max-w-[600px] h-32 bg-gray-200 rounded-2xl animate-pulse mb-8 mt-4"></div>
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mb-6"></div>
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mb-6 ml-20"></div>
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mb-6 mr-20"></div>
        </div>

        {/* Right panel Skeleton */}
        <div className="w-full xl:w-[320px] shrink-0 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-24 w-full bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-24 w-full bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-24 w-full bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
