import { z } from 'zod';

export interface QuizQuestion {
  _key?: string;
  questionText: string;
  type: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Mistake {
  questionId?: string;
  userAnswer?: string;
  questionText?: string;
  correctAnswer?: string;
  explanation?: string;
}

export interface SanityQuiz {
  lessonId: number;
  title: string;
  questions: QuizQuestion[];
}

export interface NoteData {
  id: string;
  lessonId: string | null;
  content: string;
  color?: string;
  source?: string;
  timestamp?: string;
}

// Zod schemas for CMS validation

export const QuizQuestionSchema = z.object({
  _key: z.string().optional(),
  questionText: z.string(),
  type: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.number().int(),
  explanation: z.string().optional(),
});

export const SanityQuizSchema = z.object({
  lessonId: z.number().int(),
  title: z.string().optional().default(""),
  questions: z.array(QuizQuestionSchema).default([]),
});

export const LessonDataSchema = z.object({
  lessonId: z.number().int(),
  lessonNumber: z.number().int(),
  slug: z.string().optional(),
  description: z.string().optional(),
  title: z.string(),
  conceptText: z.any().optional(), // Portable text
  conceptSummary: z.string().optional(),
  conceptTakeaways: z.array(z.string()).optional(),
  exampleText: z.any().optional(),
  articleContent: z.any().optional(),
  articleSummary: z.string().optional(),
  articleTakeaways: z.array(z.string()).optional(),
  questions: z.array(QuizQuestionSchema).optional()
});

export const ArticleDataSchema = z.object({
  lessonId: z.number().int(),
  title: z.string(),
  content: z.string().optional(),
  summary: z.string().optional()
});

export type SanityArticle = z.infer<typeof ArticleDataSchema>;
