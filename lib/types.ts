import type { PortableTextBlock } from "@portabletext/types";

export interface Topic {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
}

export interface Question {
  _key: string;
  questionText: string;
  type: 'multiple-choice' | 'open-ended';
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  topic: Topic;
  body: PortableTextBlock[]; // Sanity portable text blocks
  excerpt?: string;
  author?: string;
  publishedAt: string;
  questions?: Question[];
}

export interface AgendaItem {
  id: string; // unique id for this agenda item
  contentId: number; // lesson or quiz id
  contentType: 'ARTICLE' | 'QUIZ' | 'REVIEW';
  title: string;
  timeEstimate: number; // in minutes
  isCompleted: boolean;
  reviewMistakeCount?: number; // for review items only
}

export interface DailyAgenda {
  date: string; // YYYY-MM-DD
  items: AgendaItem[];
  totalTimeMinutes: number;
  dailyGoalMinutes: number;
}
