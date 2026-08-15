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
      title="Break ground" 
      subtitle="Free, no card. Pick a track after you sign up."
      quote="Eight chapters later you have a skyline."
      quoteMeta="56 days · 168 lessons"
    >
      <SignupForm />

      <div className="mt-8 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-accent hover:text-[#6859e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          Log in
        </Link>
      </div>
    </AuthLayout>
  );
}
