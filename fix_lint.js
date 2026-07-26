const fs = require('fs');

function fixFile(path, replacer) {
  let content = fs.readFileSync(path, 'utf8');
  const newContent = replacer(content);
  if (content !== newContent) {
    fs.writeFileSync(path, newContent);
    console.log('Fixed', path);
  }
}

// 1. app/(app)/lessons/[lessonId]/articles/page.tsx
fixFile('app/(app)/lessons/[lessonId]/articles/page.tsx', content => {
  content = content.replace('activeLesson = sanityArticle as any;', 'activeLesson = sanityArticle as unknown as Record<string, unknown>;');
  return content;
});

// 2. app/(app)/lessons/[lessonId]/articles/read/page.tsx
fixFile('app/(app)/lessons/[lessonId]/articles/read/page.tsx', content => {
  return content
    .replace(/import Image from "next\/image";\n/, '')
    .replace(/import { client } from "@\/sanity\/client";\n/, '')
    .replace(/import { ARTICLE_BY_ID_QUERY } from "@\/sanity\/queries";\n/, '')
    .replace(/import { NoteData, LessonDataSchema } from "@\/types";/, 'import { NoteData } from "@/types";')
    .replace(/import { z } from "zod";\n/, '');
});

// 3. app/(app)/lessons/[lessonId]/concepts/page.tsx
fixFile('app/(app)/lessons/[lessonId]/concepts/page.tsx', content => {
  return content
    .replace(/import { getQuizzes, QUIZZES } from "@\/lib\/data";\n/, '')
    .replace('activeLesson = sanityConcept as any;', 'activeLesson = sanityConcept as unknown as Record<string, unknown>;');
});

// 4. app/(app)/lessons/[lessonId]/concepts/read/page.tsx
fixFile('app/(app)/lessons/[lessonId]/concepts/read/page.tsx', content => {
  return content
    .replace(/import { client } from "@\/sanity\/client";\n/, '')
    .replace(/import { CONCEPT_BY_ID_QUERY } from "@\/sanity\/queries";\n/, '')
    .replace(/import { NoteData, LessonDataSchema } from "@\/types";/, 'import { NoteData } from "@/types";');
});

// 5. app/(app)/lessons/[lessonId]/quizzes/read/QuizClient.tsx
fixFile('app/(app)/lessons/[lessonId]/quizzes/read/QuizClient.tsx', content => {
  // Fix `const [confettiPieces, setConfettiPieces] = useState<any[]>([]);`
  content = content.replace(/useState<any\[\]>/g, 'useState<{id: number, left: string, animationDuration: string, delay: string}[]>');
  // Fix `(mistake as any).questionText`
  content = content.replace(/\(mistake as any\)/g, '(mistake as Record<string, unknown>)');
  return content;
});

// 6. app/actions/agenda.ts
fixFile('app/actions/agenda.ts', content => {
  return content.replace(/import { prisma } from "@\/lib\/prisma";\n/, '');
});

// 7. app/actions/quiz.ts
fixFile('app/actions/quiz.ts', content => {
  return content
    .replace(/import { Prisma, ItemType } from "@prisma\/client";/, '')
    .replace(/import { ensureUserProgress } from "@\/lib\/user-progress";\n/, '')
    .replace(/import { logQuizAttemptInDb } from "\.\/quizLogDb";\n/, '');
});

// 8. components/home/DashboardHero.tsx
fixFile('components/home/DashboardHero.tsx', content => {
  if (!content.includes('useMemo')) {
    content = content.replace(/import React, { useEffect } from "react";/, 'import React, { useEffect, useMemo } from "react";');
    content = content.replace(/const days = \['M', 'T', 'W', 'T', 'F', 'S', 'S'\];/, 'const days = useMemo(() => [\'M\', \'T\', \'W\', \'T\', \'F\', \'S\', \'S\'], []);');
  }
  return content;
});

// 9. components/lessons/MarkReadButton.tsx
fixFile('components/lessons/MarkReadButton.tsx', content => {
  return content.replace(/import { useState, useTransition } from "react";/, 'import { useTransition } from "react";');
});

// 10. components/roadmap/RoadmapMap.tsx
fixFile('components/roadmap/RoadmapMap.tsx', content => {
  content = content.replace(/import React, { useEffect, useState } from "react";/, 'import React from "react";');
  content = content.replace(/const completedQuizDayOrders: any\[\] = \[\];/, 'const completedQuizDayOrders: number[] = [];');
  content = content.replace(/const isUnlocked = \(dayOrder: any\) =>/, 'const isUnlocked = (dayOrder: number) =>');
  return content;
});

// 11. components/roadmap/RoadmapSidebar.tsx
fixFile('components/roadmap/RoadmapSidebar.tsx', content => {
  return content.replace(/import React, { useEffect, useState } from "react";/, 'import React from "react";');
});

// 12. lib/lesson-access.ts
fixFile('lib/lesson-access.ts', content => {
  return content.replace(/const progress = await prisma.userProgress.findUnique\({ where: { userId } }\);\n/, '');
});
