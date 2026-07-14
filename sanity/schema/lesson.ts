export default {
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  fields: [
    { name: 'lessonId', title: 'Lesson ID', type: 'number' },
    { name: 'lessonNumber', title: 'Lesson Number', type: 'number' },
    { name: 'title', title: 'Lesson Name', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'conceptText', title: 'Concept Text', type: 'text' },
    { name: 'conceptSummary', title: 'Concept Summary', type: 'text' },
    { name: 'conceptTakeaways', title: 'Concept Key Takeaways', type: 'array', of: [{ type: 'string' }] },
    { name: 'exampleText', title: 'Example Text', type: 'text' },
    { name: 'articleContent', title: 'Article Content', type: 'text' },
    { name: 'articleSummary', title: 'Article Summary', type: 'text' },
    { name: 'articleTakeaways', title: 'Article Key Takeaways', type: 'array', of: [{ type: 'string' }] },
    { name: 'questions', title: 'Questions', type: 'array', of: [{ type: 'question' }] }
  ]
};
