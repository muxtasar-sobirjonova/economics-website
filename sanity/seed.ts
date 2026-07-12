import { Article } from '../lib/types';

export const seedArticle: Article = {
  _id: 'sample-article-1',
  title: 'How Airbnb Turned Air Mattresses into a Multi-Billion Dollar Business',
  slug: { current: 'airbnb-air-mattresses-success' },
  topic: {
    _id: 'topic-innovation',
    title: 'Innovation & Disruption',
    slug: { current: 'innovation-disruption' },
  },
  author: 'Jane Doe',
  publishedAt: new Date().toISOString(),
  excerpt: 'Learn the principles of supply and demand through the lens of Airbnb\'s early days and how they solved the "chicken and egg" problem in two-sided markets.',
  body: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'In 2007, designers Brian Chesky and Joe Gebbia couldn\'t afford the rent on their San Francisco apartment. To make ends meet, they decided to turn their loft into a lodging space...',
        },
      ],
    },
    // More portable text blocks would go here
  ],
  questions: [
    {
      _key: 'q1',
      questionText: 'What primary economic problem did Airbnb solve for its initial users in San Francisco?',
      type: 'multiple-choice',
      options: [
        'A lack of long-term housing options',
        'A shortage of hotel rooms during a major conference',
        'The high cost of commercial real estate',
        'An oversupply of cheap air mattresses'
      ],
      correctAnswer: 'A shortage of hotel rooms during a major conference',
      explanation: 'Airbnb launched during a design conference when all hotels in the city were booked, capitalizing on a temporary severe shortage in supply.'
    },
    {
      _key: 'q2',
      questionText: 'In economic terms, what kind of marketplace does Airbnb operate?',
      type: 'multiple-choice',
      options: [
        'A monopoly',
        'A two-sided market',
        'A traditional retail model',
        'A subscription service'
      ],
      correctAnswer: 'A two-sided market',
      explanation: 'Airbnb must attract both hosts (supply) and guests (demand) to make the platform valuable, which is characteristic of a two-sided market.'
    }
  ]
};
