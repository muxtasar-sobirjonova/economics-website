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
      subtitle="Log in to continue your entrepreneurship economics journey."
    >
      <LoginForm />

      <div className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/signup" className="font-bold text-brand-primary hover:text-[#6859e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
          Sign up
        </Link>
      </div>
    </AuthLayout>
  );
}
