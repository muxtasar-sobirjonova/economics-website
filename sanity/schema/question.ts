export default {
  name: 'question',
  title: 'Question',
  type: 'object',
  fields: [
    {
      name: 'questionText',
      title: 'Question Text',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Multiple Choice', value: 'multiple-choice' },
          { title: 'Open Ended', value: 'open-ended' },
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ parent }: { parent: { type: string } }) => parent?.type !== 'multiple-choice',
    },
    {
      name: 'correctAnswer',
      title: 'Correct Answer',
      type: 'string',
      description: 'For multiple choice, this should exactly match one of the options.',
    },
    {
      name: 'explanation',
      title: 'Explanation',
      type: 'text',
      description: 'Shown after the user submits their answer.',
    },
  ],
};
