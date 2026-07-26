const { createClient } = require('next-sanity');
const { generateObject } = require('ai');
const { openai } = require('@ai-sdk/openai');
const { z } = require('zod');
require('dotenv').config({ path: '.env' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  const lessons = await client.fetch(`*[_type == "lesson"]`);
  console.log(`Found ${lessons.length} lessons`);
  for (const lesson of lessons) {
    const updates = {};
    
    if (lesson.conceptText) {
      console.log(`Generating concept for lesson ${lesson.lessonId}...`);
      try {
        const { object } = await generateObject({
          model: openai('gpt-4o-mini'),
          schema: z.object({
            summary: z.string(),
            takeaways: z.array(z.string()).length(5)
          }),
          system: 'You are an expert economics educator. Explain the concept in simple, natural language. Focus only on the essential ideas. Do not include unnecessary details or examples unless critical. Maintain a professional educational tone, be clear, concise, and engaging. Avoid generic AI phrases and repetition.',
          prompt: `Read the following concept and generate a summary (100-150 words answering: What is the main idea the learner should understand after reading this concept?) and exactly 5 key takeaways (numbered 1 to 5, each being one short paragraph or 1-2 sentences focusing on actionable insights or memorable conclusions without repeating the summary).\n\nConcept Text:\n${lesson.conceptText}`,
        });
        updates.conceptSummary = object.summary;
        updates.conceptTakeaways = object.takeaways;
      } catch (err) {
        console.error('Error generating concept:', err.message);
      }
    }
    
    if (lesson.articleContent) {
      console.log(`Generating article for lesson ${lesson.lessonId}...`);
      try {
        const { object } = await generateObject({
          model: openai('gpt-4o-mini'),
          schema: z.object({
            summary: z.string(),
            takeaways: z.array(z.string()).length(5)
          }),
          system: 'You are an expert economics educator. Summarize the article capturing the author\'s main argument. Preserve logical flow and rewrite in original wording. The reader should understand the article without reading every paragraph. Maintain a professional educational tone, be clear, concise, and engaging. Avoid generic AI phrases and repetition.',
          prompt: `Read the following article and generate a summary (120-180 words) and exactly 5 key takeaways (numbered 1 to 5, each being one short paragraph or 1-2 sentences capturing the most important lessons without repeating the summary).\n\nArticle Text:\n${lesson.articleContent}`,
        });
        updates.articleSummary = object.summary;
        updates.articleTakeaways = object.takeaways;
      } catch (err) {
        console.error('Error generating article:', err.message);
      }
    }
    
    if (Object.keys(updates).length > 0) {
      await client.patch(lesson._id).set(updates).commit();
      console.log(`Updated lesson ${lesson.lessonId}`);
    }
  }
}

main().catch(console.error);
