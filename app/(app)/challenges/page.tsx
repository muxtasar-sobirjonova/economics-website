import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DAILY_CHALLENGES } from "@/lib/challenges";
import { NotesReviewClient } from "@/components/notes/NotesReviewClient";

export const dynamic = "force-dynamic";

export default async function ChallengesPage() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeTrack: true }
  });
  const activeTrack = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

  // Fetch only DailyChallenge notes
  const notes = await prisma.note.findMany({
    where: { 
      userId, 
      track: activeTrack,
      source: {
        startsWith: 'DailyChallenge-'
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Sort ascending by creation date so the first challenge is Day 1
  const chronologicalNotes = [...notes].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const globalNotes = chronologicalNotes.map((n, index) => {
    // We still want the *original* challenge text, so we get the day from the source if possible
    const dayStr = n.source?.split("-").pop();
    const originalDay = dayStr ? parseInt(dayStr) : 1;
    const challenge = DAILY_CHALLENGES[originalDay % DAILY_CHALLENGES.length];

    const formattedContent = `
<div class="mb-4">
  <div class="text-xs font-bold text-purple-600 mb-1 uppercase tracking-wider">Challenge</div>
  <div class="text-gray-800 font-medium italic border-l-2 border-purple-300 pl-3">${challenge.prompt}</div>
</div>
<div>
  <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Your Reflection</div>
  <div class="text-gray-900">${n.content}</div>
</div>
    `.trim();

    return {
      id: n.id,
      lessonId: index + 1, // Day 1, Day 2, etc.
      content: formattedContent,
      color: n.color || '#F8F9FC',
      source: n.source || undefined,
      timestamp: n.createdAt.toISOString()
    };
  });

  const dummyLessons = globalNotes.map((n) => {
    return {
      id: String(n.lessonId),
      title: "Daily Challenge Reflection",
      dayOrder: n.lessonId,
      tag: "Challenge",
      timeEstimate: 5,
      track: activeTrack,
      conceptText: null,
      conceptSummary: null,
      conceptTakeaways: null,
      articleTitle: null,
      articleText: null,
      articleSummary: null,
      articleTakeaways: null,
      createdAt: new Date(),
      updatedAt: new Date()
    } as unknown as import("@prisma/client").Lesson;
  });

  return (
    <div className="flex flex-col w-full min-h-screen">
      <NotesReviewClient 
        initialNotes={globalNotes} 
        lessons={dummyLessons} 
        title="My Challenges" 
        subtitle="Your saved responses to the Daily Challenges" 
        size="large"
      />
    </div>
  );
}
