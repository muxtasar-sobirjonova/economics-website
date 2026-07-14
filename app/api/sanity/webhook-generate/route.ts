import { NextResponse } from 'next/server';
import { generateText, generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { writeClient } from '@/sanity/client';
import { z } from 'zod';

// Configure this route to not be statically cached
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify it's a lesson document
    if (body._type !== 'lesson') {
      return NextResponse.json({ message: 'Skipped - Not a lesson document' });
    }

    const { _id, conceptText, articleContent, conceptSummary, conceptTakeaways, articleSummary, articleTakeaways } = body;

    const updates: Record<string, any> = {};

    // Generate Concept Content if missing and text exists
    if (conceptText && (!conceptSummary || !conceptTakeaways || conceptTakeaways.length === 0)) {
      try {
        const { object } = await generateObject({
          model: openai('gpt-4o-mini'),
          schema: z.object({
            summary: z.string().describe('A concise summary of 100-150 words focusing on essential ideas.'),
            takeaways: z.array(z.string()).length(5).describe('Exactly 5 actionable, distinct key takeaways, 1-2 sentences each.')
          }),
          system: 'You are an expert economics educator. Explain concepts in simple, natural language. Answer the question: What is the main idea the learner should understand? Do not use generic AI phrases.',
          prompt: `Read the following concept and generate a summary and 5 key takeaways.\n\nConcept Text:\n${conceptText}`,
        });
        
        updates.conceptSummary = object.summary;
        updates.conceptTakeaways = object.takeaways;
      } catch (error) {
        console.error('Failed to generate concept content:', error);
      }
    }

    // Generate Article Content if missing and text exists
    if (articleContent && (!articleSummary || !articleTakeaways || articleTakeaways.length === 0)) {
      try {
        const { object } = await generateObject({
          model: openai('gpt-4o-mini'),
          schema: z.object({
            summary: z.string().describe('A condensed version of the article in 120-180 words capturing the main argument.'),
            takeaways: z.array(z.string()).length(5).describe('Exactly 5 actionable, distinct key takeaways, 1-2 sentences each.')
          }),
          system: 'You are an expert economics educator. Summarize the article capturing the author\'s main argument. Preserve logical flow and rewrite in original wording.',
          prompt: `Read the following article and generate a summary and 5 key takeaways.\n\nArticle Text:\n${articleContent}`,
        });
        
        updates.articleSummary = object.summary;
        updates.articleTakeaways = object.takeaways;
      } catch (error) {
        console.error('Failed to generate article content:', error);
      }
    }

    if (Object.keys(updates).length > 0) {
      if (!process.env.SANITY_API_TOKEN) {
        console.error('SANITY_API_TOKEN is missing. Cannot write to Sanity.');
        return NextResponse.json({ message: 'SANITY_API_TOKEN missing' }, { status: 500 });
      }

      await writeClient
        .patch(_id)
        .set(updates)
        .commit();
        
      return NextResponse.json({ message: 'Successfully generated and updated content', updates: Object.keys(updates) });
    }

    return NextResponse.json({ message: 'No updates needed' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ message: 'Webhook failed', error: error.message }, { status: 500 });
  }
}
