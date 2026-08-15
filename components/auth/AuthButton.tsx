import React from 'react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function AuthButton({ children, loading, className = '', ...props }: AuthButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-brand-primary hover:bg-[#6859e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98] ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
