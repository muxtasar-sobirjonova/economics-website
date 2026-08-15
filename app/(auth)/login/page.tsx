import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In | That\'s So Econ',
  description: 'Log in to continue your entrepreneurship economics journey.',
};

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome back"
      subtitle="Pick up where you left off — your streak is still alive."
      quote="I understood pricing the day I had to set one."
      quoteMeta="Chapter 3 · Pricing Power"
    >
      <LoginForm />

      <p className="mt-s5 text-meta text-muted">
        New here?{' '}
        <Link href="/signup" className="text-accent hover:text-accent-strong font-semibold">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
