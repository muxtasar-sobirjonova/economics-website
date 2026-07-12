'use client';

import React, { useState, forwardRef } from 'react';
import { IconLock, IconEye, IconEyeOff } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label: string;
  error?: string;
  icon?: React.ElementType;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ id, label, error, className = '', icon: Icon = IconLock, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

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
            type={showPassword ? 'text' : 'password'}
            className={`appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 pr-10 border ${
              error ? 'border-red-300' : 'border-gray-200'
            } placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm transition-all shadow-sm`}
            {...props}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-brand-primary transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </motion.div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';
