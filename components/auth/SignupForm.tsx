"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { IconMail, IconUser, IconBulb, IconArticle, IconNotes } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { signupAction } from '@/app/actions/auth';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  terms: z.literal(true, {
    error: "You must accept the terms and conditions"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  });

  const passwordValue = watch('password', '');
  
  const getPasswordStrength = (pw: string) => {
    if (!pw || pw.length === 0) return 0;
    if (pw.length < 6) return 1;
    if (pw.length < 8) return 2;
    return 3;
  };
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: SignupFormValues) => {
    setError('');
    setLoading(true);

    try {
      await signupAction({ name: data.name, email: data.email, password: data.password });
      router.push('/login?registered=true');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    signIn('google', { callbackUrl: '/home' });
  };

  return (
    <>
      <form className="mt-8 space-y-5" onSubmit={handleFormSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-200 font-medium">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <AuthInput
            id="name"
            type="text"
            label="Full Name"
            icon={IconUser}
            placeholder="Full Name"
            error={errors.name?.message}
            {...register('name')}
          />
          
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
          
          <div>
            <PasswordInput
              id="password"
              label="Password"
              placeholder="Password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            {/* Password Strength Indicator */}
            <div className="mt-2 flex gap-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full flex-1 rounded-full transition-colors ${strength >= 1 ? 'bg-red-400' : 'bg-transparent'}`}></div>
              <div className={`h-full flex-1 rounded-full transition-colors ${strength >= 2 ? 'bg-yellow-400' : 'bg-transparent'}`}></div>
              <div className={`h-full flex-1 rounded-full transition-colors ${strength >= 3 ? 'bg-green-400' : 'bg-transparent'}`}></div>
            </div>
          </div>
          
          <PasswordInput
            id="confirm-password"
            label="Confirm Password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        {/* Feature Strip */}
        <div className="flex justify-between items-center py-2 px-1 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#F3F1FF] text-brand-primary flex items-center justify-center">
              <IconBulb size={12} stroke={2.5} />
            </div>
            Concepts
          </div>
          <span className="text-gray-300">·</span>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#F3F1FF] text-brand-primary flex items-center justify-center">
              <IconArticle size={12} stroke={2.5} />
            </div>
            Articles
          </div>
          <span className="text-gray-300">·</span>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#F3F1FF] text-brand-primary flex items-center justify-center">
              <IconNotes size={12} stroke={2.5} />
            </div>
            Quizzes
          </div>
        </div>

        <div className="flex items-start flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                {...register('terms')}
              />
            </div>
            <div className="ml-2 text-sm text-gray-600">
              <label htmlFor="terms">
                I agree to the{' '}
                <Link href="/terms" className="font-bold text-brand-primary hover:text-[#6859e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-bold text-brand-primary hover:text-[#6859e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
          {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}
        </div>

        <div>
          <AuthButton type="submit" loading={loading}>
            Sign Up
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
            label="Sign up with Google" 
            onClick={handleGoogleSignUp} 
          />
        </div>
      </div>
    </>
  );
}
