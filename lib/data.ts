import { Question } from './types';

import { LESSON_1_QUESTIONS } from './quizzes/lesson1';
import { LESSON_2_QUESTIONS } from './quizzes/lesson2';
import { LESSON_3_QUESTIONS } from './quizzes/lesson3';
import { LESSON_4_QUESTIONS } from './quizzes/lesson4';
import { LESSON_5_QUESTIONS } from './quizzes/lesson5';
import { LESSON_6_QUESTIONS } from './quizzes/lesson6';
import { CHAPTER_1_QUIZ_QUESTIONS } from './quizzes/chapter1';

export const LESSON_CONCEPTS: { [key: number]: string } = {
  1: "Understand what entrepreneurship economics is, why entrepreneurs exist, and how businesses create, deliver, and capture value in the economy.",
  2: "Explore why entrepreneurs exist to solve inefficiencies and fill gaps that large incumbents ignore or cannot see.",
  3: "Discover how to identify true economic opportunities by distinguishing simple problems from profitable solutions.",
  4: "Learn the core economic drivers behind consumer behavior and why customers choose one product over another.",
  5: "Analyze the mechanisms of value creation, delivery, and how to effectively capture a share of that value.",
  6: "Examine how profit drives incentives and shapes the daily decision-making process of successful entrepreneurs.",
  7: "Understand the economic constraints and operational leverage that determine why some businesses scale while others fail.",
};

import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getLessons = cache(async () => {
  return prisma.lesson.findMany({
    orderBy: { dayOrder: 'asc' }
  });
});

export const getQuizzes = cache(async () => {
  return prisma.quiz.findMany({
    orderBy: { dayOrder: 'asc' }
  });
});

// Map lesson IDs to their questions
const questionsByLesson: { [key: number]: Question[] } = {
  1: LESSON_1_QUESTIONS,
  2: LESSON_2_QUESTIONS,
  3: LESSON_3_QUESTIONS,
  4: LESSON_4_QUESTIONS,
  5: LESSON_5_QUESTIONS,
  6: LESSON_6_QUESTIONS,
};

export const QUIZZES = [
  { id: 101, title: 'Lesson 1 Quiz', subtitle: 'Test your knowledge of Lesson 1', type: 'QUIZ', slug: 'lesson-1-quiz', questions: questionsByLesson[1], timeEstimate: 10 },
  { id: 102, title: 'Lesson 2 Quiz', subtitle: 'Test your knowledge of Lesson 2', type: 'QUIZ', slug: 'lesson-2-quiz', questions: questionsByLesson[2], timeEstimate: 10 },
  { id: 103, title: 'Lesson 3 Quiz', subtitle: 'Test your knowledge of Lesson 3', type: 'QUIZ', slug: 'lesson-3-quiz', questions: questionsByLesson[3], timeEstimate: 10 },
  { id: 104, title: 'Lesson 4 Quiz', subtitle: 'Test your knowledge of Lesson 4', type: 'QUIZ', slug: 'lesson-4-quiz', questions: questionsByLesson[4], timeEstimate: 10 },
  { id: 105, title: 'Lesson 5 Quiz', subtitle: 'Test your knowledge of Lesson 5', type: 'QUIZ', slug: 'lesson-5-quiz', questions: questionsByLesson[5], timeEstimate: 10 },
  { id: 106, title: 'Lesson 6 Quiz', subtitle: 'Test your knowledge of Lesson 6', type: 'QUIZ', slug: 'lesson-6-quiz', questions: questionsByLesson[6], timeEstimate: 10 },
  { id: 108, title: 'Chapter 1 Quiz', subtitle: 'Test your knowledge of all 6 lessons', type: 'QUIZ', slug: 'chapter-1-quiz', questions: CHAPTER_1_QUIZ_QUESTIONS, timeEstimate: 20 },
];

export const ALL_CONTENT = [];
