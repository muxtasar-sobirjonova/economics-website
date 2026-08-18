import React from 'react';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Mail, Award, Clock, Compass } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SignOutButton from '@/components/profile/SignOutButton'; // We'll create this to handle sign out safely on client

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      progress: true
    }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  const avatarLetter = (user.name?.trim().charAt(0) || user.email?.trim().charAt(0) || "?").toUpperCase();
  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Format track name to look nice (e.g. ENTREPRENEURSHIP_ECONOMICS -> Entrepreneurship Economics)
  const trackName = (user.activeTrack || 'No track selected')
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center shrink-0">
        <Link href="/" className="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">My Profile</h1>
      </header>

      <main className="flex-1 max-w-[600px] w-full mx-auto p-6 md:p-10 flex flex-col gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-brand-primary/20 to-indigo-500/20"></div>
          
          <div className="w-24 h-24 rounded-full bg-brand-primary text-white font-black text-4xl flex items-center justify-center shadow-lg border-4 border-white relative z-10 mb-4">
            {avatarLetter}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name || 'Student'}</h2>
          
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-6">
            <Mail size={14} />
            {user.email || 'No email provided'}
          </div>

          <div className="w-full flex gap-4 mt-2">
            <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mb-2">
                <Award size={20} />
              </div>
              <div className="text-2xl font-black text-gray-900">{user.lessonsCompleted || 0}</div>
              <div className="text-xs font-semibold text-gray-500 tracking-wider uppercase mt-1">Lessons</div>
            </div>
            
            <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mb-2">
                <Clock size={20} />
              </div>
              <div className="text-lg font-black text-gray-900 mt-1">{joinedDate}</div>
              <div className="text-xs font-semibold text-gray-500 tracking-wider uppercase mt-1">Joined</div>
            </div>
          </div>
        </div>

        {/* Settings / Details */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 px-2">Account Details</h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Compass size={18} className="text-brand-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500">Current Track</span>
                <span className="text-sm font-bold text-gray-900">{trackName}</span>
              </div>
            </div>
            <Link href="/track-selection" className="text-xs font-bold text-brand-primary hover:underline px-2 py-1">
              Change
            </Link>
          </div>

          <div className="mt-2">
             <SignOutButton />
          </div>
        </div>
      </main>
    </div>
  );
}
