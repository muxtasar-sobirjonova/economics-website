import { createClient } from '@sanity/client';
import { MOCK_CONTENT } from '../lib/mockContent';
import { QUIZZES } from '../lib/data';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('Error: Missing Sanity Project ID or API Token in .env file.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  useCdn: false, // We must use the live API to write data
  token,
  apiVersion: '2024-03-12',
});

async function migrate() {
  console.log('Starting migration to Sanity...');

  for (const dayStr of Object.keys(MOCK_CONTENT)) {
    const dayOrder = parseInt(dayStr, 10);
    const content = MOCK_CONTENT[dayOrder];
    
    // Create Lesson
    const lessonSlug = `day-${dayOrder}`;
    const lessonDoc = {
      _type: 'lesson',
      _id: `lesson-${dayOrder}`,
      title: content.concept.title,
      slug: { current: lessonSlug },
      tag: `Day ${dayOrder}`,
      dayOrder: dayOrder,
      timeEstimate: 15,
      excerpt: content.concept.text.substring(0, 100) + '...',
    };
    console.log(`Creating Lesson: ${lessonDoc.title}`);
    await client.createOrReplace(lessonDoc);

    // Create Article
    const articleDoc = {
      _type: 'article',
      _id: `article-${dayOrder}`,
      title: content.article.title || `Article for Day ${dayOrder}`,
      slug: { current: `article-day-${dayOrder}` },
      lesson: {
        _type: 'reference',
        _ref: lessonDoc._id,
      },
      body: [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: content.article.text }],
        }
      ]
    };
    console.log(`Creating Article: ${articleDoc.title}`);
    await client.createOrReplace(articleDoc);
    
    // Check if there's a quiz for this day
    const quiz = QUIZZES.find(q => q.title.includes(`Lesson ${dayOrder}`));
    if (quiz && quiz.questions) {
      console.log(`Creating ${quiz.questions.length} Questions for Day ${dayOrder}...`);
      
      const questionRefs = [];
      for (let i = 0; i < quiz.questions.length; i++) {
        const q = quiz.questions[i];
        const questionDoc = {
          _type: 'question',
          _id: `question-${dayOrder}-${i}`,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || 'No explanation provided.',
        };
        await client.createOrReplace(questionDoc);
        questionRefs.push({ _key: `ref-${i}`, _type: 'reference', _ref: questionDoc._id });
      }
      
      // Update Lesson with Questions
      await client.patch(lessonDoc._id)
        .set({ questions: questionRefs })
        .commit();
    }
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
