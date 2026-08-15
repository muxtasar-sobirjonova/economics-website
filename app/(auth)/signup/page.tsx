import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { SignupForm } from '@/components/auth/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | That\'s So Econ',
  description: 'Create an account to start your entrepreneurship economics journey.',
};

export default function SignupPage() {
  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Start learning concepts, reading articles, and taking quizzes."
    >
      <SignupForm />

      <div className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-brand-primary hover:text-[#6859e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
          Log in
        </Link>
      </div>
    </AuthLayout>
  );
}
