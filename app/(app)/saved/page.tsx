import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLessons } from "@/lib/data";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NotesReviewClient } from "@/components/notes/NotesReviewClient";

export const dynamic = "force-dynamic";

export default async function SavedPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const pageParam = Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page;
  const page = parseInt(pageParam || "1", 10);
  const take = 20;
  const skip = (page - 1) * take;

  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeTrack: true }
  });
  const activeTrack = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

  // Fetch real Note records from the database
  let globalNotes: { id: string; lessonId: number; content: string; color?: string; source?: string; timestamp?: string }[] = [];
  let totalNotes = 0;
  try {
    // Only fetch notes that do NOT start with DailyChallenge-
    const [rawNotes, count] = await Promise.all([
      prisma.note.findMany({
        where: { userId, track: activeTrack },
        orderBy: { createdAt: "desc" },
        take: take + 10,
        skip
      }),
      prisma.note.count({ 
        where: { userId, track: activeTrack } 
      })
    ]);
    
    // Filter out daily challenges in javascript to avoid Prisma null/NOT bugs
    const notes = rawNotes.filter(n => {
       const isDaily = typeof n.source === 'string' && n.source.startsWith('DailyChallenge-');
       return !isDaily;
    }).slice(0, take);

    totalNotes = count;
    
    // Format to match the client component's expectation if necessary
    globalNotes = notes.map(n => {
      const content = n.content;
      const lessonId = parseInt(n.lessonId || '1');
      
      return {
        id: n.id,
        lessonId,
        content,
        source: n.source || undefined,
        timestamp: n.createdAt.toISOString()
      };
    });
  } catch (error) {
    console.error("Failed to fetch notes:", error);
  }

  const lessonsData = await getLessons(activeTrack);
  const lessons = JSON.parse(JSON.stringify(lessonsData));

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <NotesReviewClient initialNotes={globalNotes} lessons={lessons} />
      
      {totalNotes > 20 && (
        <div className="flex justify-center gap-4 py-8 bg-slate-50">
          {page > 1 && (
            <Link href={`/saved?page=${page - 1}`} className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-semibold text-sm">
              ← Previous
            </Link>
          )}
          {page * take < totalNotes && (
            <Link href={`/saved?page=${page + 1}`} className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-semibold text-sm">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
