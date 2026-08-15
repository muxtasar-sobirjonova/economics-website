"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconMail } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { GoogleButton } from '@/components/auth/GoogleButton';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/home');
      router.refresh();
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/home' });
  };

  return (
    <>
      <form className="mt-8 space-y-6" onSubmit={handleFormSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-200 font-medium">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <AuthInput
            id="email-address"
            type="email"
            label="Email address"
            icon={IconMail}
            placeholder="Email address"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link href="/forgot-password" className="font-bold text-brand-primary hover:text-[#6859e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
              Forgot password?
            </Link>
          </div>
        </div>

        <div>
          <AuthButton type="submit" loading={loading}>
            Log In
          </AuthButton>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500 font-medium">
              or
            </span>
          </div>
        </div>

        <div className="mt-6">
          <GoogleButton 
            label="Sign in with Google" 
            onClick={handleGoogleSignIn} 
          />
        </div>
      </div>
    </>
  );
}
