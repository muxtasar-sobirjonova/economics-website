import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getLessonAccessStatus } from "@/lib/lesson-access";
import { getLessons } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { client } from "@/sanity/client";
import { CONCEPTS_QUERY } from "@/sanity/queries";
import { MOCK_CONTENT, DEV_MOCK_CONTENT } from "@/lib/mockContent";
import { LessonOverview } from "@/components/lessons/LessonOverview";
export default async function ConceptsPage({ params }: { params: { lessonId: string } }) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const lessonId = parseInt(params.lessonId);
  if (isNaN(lessonId)) {
    notFound();
  }
  
  interface LessonData {
    id: number;
    title: string;
    subtitle?: string;
    description?: string;
    timeEstimate?: number;
    conceptText?: string;
    conceptSummary?: string;
  }
  
  const { isUnlocked, completedLessonIds } = await getLessonAccessStatus(userId, lessonId);
  if (!isUnlocked) {
    redirect("/roadmap");
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeTrack: true }
  });
  const activeTrack = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

  const lessons = await getLessons(activeTrack);
  const foundLesson = lessons.find((l) => l.dayOrder === lessonId) as LessonData | undefined;
  if (!foundLesson) {
    notFound();
  }
  
  let activeLesson: LessonData = foundLesson;

  // Fetch Sanity Data for dynamic title/description
  try {
    const sanityData = await client.fetch<{ lessonId: number, title?: string, conceptText?: string, conceptSummary?: string }[]>(CONCEPTS_QUERY);
    const sanityLesson = sanityData?.find((d) => d.lessonId === lessonId);
    if (sanityLesson) {
      activeLesson = {
        ...activeLesson,
        title: sanityLesson.title || activeLesson.title,
        conceptText: sanityLesson.conceptText,
        conceptSummary: sanityLesson.conceptSummary,
      };
    } else {
      let mockFallback = null;
      if (activeTrack === "ENTREPRENEURSHIP_ECONOMICS") mockFallback = MOCK_CONTENT[lessonId]?.concept;
      else if (activeTrack === "DEVELOPMENT_ECONOMICS") mockFallback = DEV_MOCK_CONTENT[lessonId]?.concept;

      if (mockFallback) {
        activeLesson = {
          ...activeLesson,
          title: mockFallback.title || activeLesson.title,
          conceptText: mockFallback.text,
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch Sanity data for concepts dashboard", error);
  }

  // Dynamic Time Estimate based on word count
  let timeEstimate = activeLesson.timeEstimate;
  if (!timeEstimate) {
    if (activeLesson.conceptText) {
      // rough word count / 200 wpm
      const words = (activeLesson.conceptText || "").replace(/<[^>]*>?/g, '').split(/\s+/).length;
      timeEstimate = Math.max(1, Math.ceil((words || 0) / 200)) || 5;
    } else {
      timeEstimate = 10;
    }
  }

  const avatarLetter = (session?.user?.name?.trim().charAt(0) || session?.user?.email?.trim().charAt(0) || "?").toUpperCase();

  return (
    <LessonOverview
      kind="concepts"
      lessonId={lessonId}
      dayLabel={`Day ${lessonId} / 56`}
      title={activeLesson.title}
      description={activeLesson.conceptSummary || activeLesson.description}
      timeLabel={`${timeEstimate} min`}
      readHref={`/lessons/${lessonId}/concepts/read`}
      avatarLetter={avatarLetter}
      lessons={lessons.map((l) => ({ id: l.dayOrder, title: l.title }))}
      completedLessonIds={completedLessonIds}
    />
  );
}
