import React from 'react';
import { IconBrandGoogle } from '@tabler/icons-react';

interface GoogleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function GoogleButton({ label, className = '', ...props }: GoogleButtonProps) {
  return (
    <button
      {...props}
      type="button"
      className={`w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-bold text-[#24203F] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all active:scale-[0.98] ${className}`}
    >
      <IconBrandGoogle className="h-5 w-5 mr-2 text-[#EA4335]" />
      {label}
    </button>
  );
}
