import React from 'react';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Track } from '@prisma/client';

export default async function ReviewPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { activeTrack: true }
  });

  if (!user || !user.activeTrack) {
    redirect('/track-selection');
  }

  // Fetch all quiz results for this user in their active track
  const quizResults = await prisma.quizResult.findMany({
    where: {
      userId: session.user.id,
      track: user.activeTrack as Track
    },
    orderBy: {
      date: 'desc'
    }
  });

  // Since a user can take a quiz multiple times, we only want their LATEST score for each quiz
  const latestResultsMap = new Map<string, typeof quizResults[0]>();
  for (const result of quizResults) {
    if (!latestResultsMap.has(result.quizId)) {
      latestResultsMap.set(result.quizId, result);
    }
  }

  // Filter quizzes where the latest score is less than 6
  const needsReviewQuizIds = Array.from(latestResultsMap.values())
    .filter(result => result.score < 6)
    .map(result => parseInt(result.quizId) - 100);

  // Fetch the actual lessons corresponding to these quizzes
  const lessonsToReview = await prisma.lesson.findMany({
    where: {
      track: user.activeTrack as Track,
      dayOrder: {
        in: needsReviewQuizIds
      }
    },
    select: {
      id: true,
      title: true,
      dayOrder: true,
      tag: true
    },
    orderBy: {
      dayOrder: 'asc'
    }
  });

  return (
    <div className="min-h-screen bg-bg bg-sky flex flex-col">
      <header className="bg-surface border-b border-line px-6 py-4 flex items-center shrink-0">
        <Link href="/" className="mr-4 p-2 -ml-2 rounded-full hover:bg-bg transition-colors">
          <ArrowLeft size={20} className="text-muted" />
        </Link>
        <h1 className="text-h3 font-semibold text-ink">Mistakes</h1>
      </header>

      <main className="flex-1 max-w-[800px] w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
        
        <div className="bg-surface rounded-3xl p-6 md:p-8 border border-line shadow-sm">
          <h2 className="text-h2 font-semibold text-ink mb-s2">Room for improvement</h2>
          <p className="text-muted text-[15px] mb-8">
            These are lessons where you scored less than 6 out of 10 on the quiz. We recommend reviewing the core materials before trying again!
          </p>

          {lessonsToReview.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-ink mb-1">You&apos;re all caught up!</h3>
              <p className="text-muted text-sm">You don&apos;t have any lessons that need review right now.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {lessonsToReview.map((lesson) => (
                <div key={lesson.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-line bg-bg hover:bg-bg-sunk/50 transition-colors">
                  <div className="flex flex-col pr-4">
                    <span className="text-xs font-bold text-accent tracking-wider uppercase mb-1">
                      Lesson {lesson.dayOrder}
                    </span>
                    <h3 className="text-ink font-bold text-lg leading-tight">{lesson.title}</h3>
                    <p className="text-muted text-xs mt-1">{lesson.tag}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
                    <Link href={`/lessons/${lesson.dayOrder}/concepts`} className="flex-1 sm:flex-none">
                      <button className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface border border-line text-muted text-sm font-semibold flex items-center justify-center gap-2 hover:bg-bg hover:text-accent transition-all">
                        <Lightbulb size={16} />
                        Concept
                      </button>
                    </Link>
                    <Link href={`/lessons/${lesson.dayOrder}/articles`} className="flex-1 sm:flex-none">
                      <button className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all">
                        <BookOpen size={16} />
                        Article
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
