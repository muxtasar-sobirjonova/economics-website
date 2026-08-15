import { LessonOverview } from "@/components/lessons/LessonOverview";
import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { client } from "@/sanity/client";
import { ARTICLES_QUERY } from "@/sanity/queries";
import { getLessons } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { getLessonAccessStatus } from "@/lib/lesson-access";
import { MOCK_CONTENT, DEV_MOCK_CONTENT } from "@/lib/mockContent";
import { SanityArticle } from "@/types";


import { Suspense } from "react";

async function ArticlesContent({ userId, lessonId, avatarLetter }: { userId: string, lessonId: number, avatarLetter: string }) {
  const { isUnlocked, completedLessonIds } = await getLessonAccessStatus(userId, lessonId);

  // Security Logic: Ensure the requested lesson is actually unlocked
  if (!isUnlocked) {
    redirect("/roadmap");
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeTrack: true }
  });
  const activeTrack = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

  const lessons = await getLessons(activeTrack);
  const baseLesson = lessons.find((l) => Number(l.dayOrder) === lessonId) || lessons[0];

  let sanityArticle: SanityArticle | undefined = undefined;
  try {
    const sanityData = await client.fetch<{ lessonId: number, title?: string, articleContent?: string, articleSummary?: string }[]>(ARTICLES_QUERY);
    const lessonData = sanityData?.find((d) => d.lessonId === lessonId);
    if (lessonData) {
      sanityArticle = {
        lessonId: lessonData.lessonId,
        title: lessonData.title || "",
        content: lessonData.articleContent,
        summary: lessonData.articleSummary
      } as SanityArticle;
    }
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }
  
  // Use mock content as fallback if Sanity fetch fails
  let mockContentFallback = null;
  if (!sanityArticle) {
    if (activeTrack === "ENTREPRENEURSHIP_ECONOMICS") mockContentFallback = MOCK_CONTENT[lessonId]?.article;
    else if (activeTrack === "DEVELOPMENT_ECONOMICS") mockContentFallback = DEV_MOCK_CONTENT[lessonId]?.article;
  }

  interface ActiveArticleData {
    title?: string;
    content?: string;
    text?: string;
    articleSummary?: string;
    summary?: string;
  }

  let activeLesson: ActiveArticleData | null = null;
  if (sanityArticle) {
    activeLesson = {
      title: sanityArticle.title,
      content: sanityArticle.content,
      summary: sanityArticle.summary
    };
  } else if (mockContentFallback) {
    activeLesson = {
      title: mockContentFallback.title,
      text: mockContentFallback.text,
      summary: mockContentFallback.summary
    };
  } else if (baseLesson) {
    activeLesson = {
      title: baseLesson.title,
      text: baseLesson.articleText || undefined,
      summary: baseLesson.articleSummary || undefined
    };
  }
  const articleText = activeLesson?.content || activeLesson?.text || "Content coming soon.";
  const articleSummary = activeLesson?.summary || articleText;

  // Dynamic Time Estimate based on word count
  let timeEstimate = baseLesson.timeEstimate;
  if (!timeEstimate) {
    if (articleText) {
      // rough word count / 200 wpm
      const words = (articleText || "").replace(/<[^>]*>?/g, '').split(/\s+/).length;
      timeEstimate = Math.max(1, Math.ceil((words || 0) / 200)) || 5;
    } else {
      timeEstimate = 10;
    }
  }

  return (
    <LessonOverview
      kind="articles"
      lessonId={lessonId}
      dayLabel={`Day ${lessonId} / 56`}
      title={activeLesson?.title || "Reading"}
      description={articleSummary}
      timeLabel="5\u201320 min"
      readHref={`/lessons/${lessonId}/articles/read`}
      avatarLetter={avatarLetter}
      lessons={lessons.map((l) => ({ id: l.dayOrder, title: l.title }))}
      completedLessonIds={completedLessonIds}
    />
  );
}

function ArticlesSkeleton() {
  return (
    <div className="w-full max-w-[1100px] mx-auto px-s4 md:px-s6 py-s6 flex flex-col gap-s5">
      <div className="h-52 bg-bg-sunk animate-pulse rounded-lg" />
      <div className="h-40 bg-bg-sunk animate-pulse rounded-lg" />
    </div>
  );
}

export default async function ArticlesPage({ params }: { params: { lessonId: string } }) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const lessonId = parseInt(params.lessonId) || 1;

  const avatarLetter = (session?.user?.name?.trim().charAt(0) || session?.user?.email?.trim().charAt(0) || "?").toUpperCase();

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<ArticlesSkeleton />}>
        <ArticlesContent userId={userId} lessonId={lessonId} avatarLetter={avatarLetter} />
      </Suspense>
    </div>
  );
}