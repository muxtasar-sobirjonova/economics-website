import { groq } from 'next-sanity';

export const ALL_ARTICLES_QUERY = groq`*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  author,
  publishedAt,
  topic->{
    _id,
    title,
    slug
  }
}`;

export const LATEST_ARTICLES_QUERY = groq`*[_type == "article"] | order(publishedAt desc)[0...6] {
  _id,
  title,
  slug,
  excerpt,
  author,
  publishedAt,
  topic->{
    _id,
    title,
    slug
  }
}`;

export const ARTICLE_BY_SLUG_QUERY = groq`*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  author,
  publishedAt,
  body,
  topic->{
    _id,
    title,
    slug,
    description
  },
  questions[]{
    _key,
    questionText,
    type,
    options,
    correctAnswer,
    explanation
  }
}`;

export const ALL_TOPICS_QUERY = groq`*[_type == "topic"] | order(title asc) {
  _id,
  title,
  slug,
  description
}`;

export const CONCEPTS_QUERY = groq`*[_type == "lesson"] | order(lessonNumber asc) {
  lessonId,
  lessonNumber,
  title,
  conceptText,
  conceptSummary,
  conceptTakeaways
}`;

export const EXAMPLES_QUERY = groq`*[_type == "lesson"] | order(lessonNumber asc) {
  lessonId,
  lessonNumber,
  title,
  exampleText
}`;

export const ARTICLES_QUERY = groq`*[_type == "lesson"] | order(lessonNumber asc) {
  lessonId,
  lessonNumber,
  title,
  articleContent,
  articleSummary,
  articleTakeaways
}`;

export const QUIZZES_QUERY = groq`*[_type == "lesson"] | order(lessonNumber asc) {
  lessonId,
  lessonNumber,
  title,
  questions[]->{
    _key,
    questionText,
    type,
    options,
    correctAnswer,
    explanation
  }
}`;

export const ARTICLE_BY_ID_QUERY = groq`*[_type == "lesson" && lessonId == $lessonId][0] {
  lessonId,
  lessonNumber,
  title,
  articleContent,
  articleSummary,
  articleTakeaways
}`;

export const CONCEPT_BY_ID_QUERY = groq`*[_type == "lesson" && lessonId == $lessonId][0] {
  lessonId,
  lessonNumber,
  title,
  conceptText,
  conceptSummary,
  conceptTakeaways
}`;

export const QUIZ_BY_ID_QUERY = groq`*[_type == "lesson" && lessonId == $lessonId][0] {
  lessonId,
  lessonNumber,
  title,
  questions[]->{
    _key,
    questionText,
    type,
    options,
    correctAnswer,
    explanation
  }
}`;
