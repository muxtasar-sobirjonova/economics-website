import React from "react";
import { redirect } from "next/navigation";
import { getLessons } from "@/lib/data";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NotesReviewClient } from "@/components/notes/NotesReviewClient";

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

  // Fetch real Note records from the database
  let globalNotes: { id: string; lessonId: number; content: string; color?: string; source?: string; timestamp?: string }[] = [];
  let totalNotes = 0;
  try {
    const [notes, count] = await Promise.all([
      prisma.note.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take,
        skip
      }),
      prisma.note.count({ where: { userId } })
    ]);
    totalNotes = count;
    
    // Format to match the client component's expectation if necessary
    globalNotes = notes.map(n => ({
      id: n.id,
      lessonId: parseInt(n.lessonId || '1'),
      content: n.content,
      timestamp: n.createdAt.toISOString()
    }));
  } catch (error) {
    console.error("Failed to fetch notes:", error);
  }

  const lessons = await getLessons();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <NotesReviewClient initialNotes={globalNotes} lessons={lessons} />
      
      {totalNotes > 20 && (
        <div className="flex justify-center gap-4 py-8 bg-[#F8F9FC]">
          {page > 1 && (
            <a href={`/saved?page=${page - 1}`} className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-semibold text-sm">
              ← Previous
            </a>
          )}
          {page * take < totalNotes && (
            <a href={`/saved?page=${page + 1}`} className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-semibold text-sm">
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
