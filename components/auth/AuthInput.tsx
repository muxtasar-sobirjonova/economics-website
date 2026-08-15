import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: React.ElementType;
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ id, label, icon: Icon, error, className = '', ...props }, ref) => {
    return (
      <motion.div 
        className={className}
        animate={error ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={ref}
            id={id}
            className={`appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border ${
              error ? 'border-red-300' : 'border-gray-200'
            } placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm transition-all shadow-sm`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </motion.div>
    );
  }
);
AuthInput.displayName = 'AuthInput';
