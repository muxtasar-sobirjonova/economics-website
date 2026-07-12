import React from 'react';

export default function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary text-white font-black text-2xl flex items-center justify-center w-11 h-11 rounded-xl shadow-sm">
              T
            </div>
            <span className="font-bold text-[#24203F] text-[22px] tracking-wide">
              That's So Econ.
            </span>
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
