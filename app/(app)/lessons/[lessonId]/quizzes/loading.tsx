import React from "react";
import { IconLoader } from "@tabler/icons-react";

export default function Loading() {
  return (
    <div className="min-h-screen font-sans flex flex-col text-[#1F2937] bg-slate-50">
      {/* Skeleton Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-6">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse"></div>
      </header>

      <main className="px-10 pb-16 max-w-[1240px] w-full mx-auto mt-4">
        {/* Skeleton Header Card */}
        <div className="flex items-center mb-10 px-8 py-4 rounded-3xl bg-white border border-[#EBEBEB] shadow-sm relative h-[116px]">
          <div className="w-[84px] h-[84px] rounded-[20px] bg-gray-100 animate-pulse shrink-0 ml-2"></div>
          <div className="flex-1 px-3 ml-6 flex flex-col justify-center gap-2">
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-[160px] h-[44px] bg-gray-200 rounded-[14px] animate-pulse"></div>
        </div>

        {/* Skeleton Layout Content */}
        <div className="flex flex-col md:flex-row gap-8 md:items-start mb-5">
          <div className="flex-1 flex items-center gap-4">
             <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-full md:w-[340px] flex items-center gap-3">
             <div className="h-4 w-40 bg-gray-200 rounded animate-pulse hidden md:block"></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white p-8 border border-[#EBEBEB] border-l-4 border-l-gray-300 rounded-2xl h-[180px] animate-pulse"></div>
          <div className="w-full md:w-[340px] bg-white p-8 border border-[#EBEBEB] border-l-4 border-l-gray-300 rounded-2xl h-[280px] animate-pulse"></div>
        </div>
        
        {/* Skeleton Loader Spinner for Slider */}
        <div className="flex items-center justify-center py-10 bg-white border border-[#EBEBEB] rounded-3xl">
           <IconLoader className="animate-spin text-gray-300" size={32} />
        </div>
      </main>
    </div>
  );
}
