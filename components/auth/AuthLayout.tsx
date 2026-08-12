import React from 'react';

export default function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-white text-white font-black text-2xl flex items-center justify-center w-11 h-11 rounded-xl shadow-sm p-1">
               <img src="/favicon.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col justify-center mt-1">
              <span className="text-[10px] font-bold tracking-[0.22em] text-[#5E1451] leading-none mb-0.5">THAT&apos;S SO</span>
              <span className="text-2xl font-black text-[#24203F] leading-none">ECON<span className="text-[#5E1451]">!</span></span>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {subtitle}
            </p>
          </div>
        </div>

        {children}
        
      </div>
    </div>
  );
}
