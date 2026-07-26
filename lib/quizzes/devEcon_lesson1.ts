import { Question } from '../types';

export const DEV_ECON_LESSON1_QUESTIONS: Question[] = [
  {
    _key: 'q1',
    questionText: 'What is the key difference between "economic growth" and "economic development," as defined in this lesson?',
    type: 'multiple-choice',
    options: [
      'They are two names for the exact same economic measurement',
      'Growth means a rise in total output; development means broader improvements in health, education, equality, and freedom',
      'Growth only applies to rich countries, while development only applies to poor ones',
      'Development is measured in dollars, while growth is measured in percentages'
    ],
    correctAnswer: 'Growth means a rise in total output; development means broader improvements in health, education, equality, and freedom',
    explanation: 'Growth refers to quantitative increases in output (GDP), while development encompasses broader qualitative improvements in living standards, health, and freedom.'
  },
  {
    _key: 'q2',
    questionText: 'According to this lesson, why is growth "necessary but not sufficient" for development?',
    type: 'multiple-choice',
    options: [
      'Because growth expands the total resources available but doesn\'t automatically decide how they\'re distributed or clean up damage caused along the way',
      'Because growth is illegal without a corresponding development plan',
      'Because development always happens automatically once growth reaches a certain threshold',
      'Because growth and development have no relationship to each other at all'
    ],
    correctAnswer: 'Because growth expands the total resources available but doesn\'t automatically decide how they\'re distributed or clean up damage caused along the way',
    explanation: 'Growth creates resources, but policies and choices determine whether those resources actually improve people\'s lives broadly.'
  },
  {
    _key: 'q3',
    questionText: 'What does Amartya Sen\'s idea of "development as freedom" argue, per this lesson?',
    type: 'multiple-choice',
    options: [
      'That development means eliminating all government regulation',
      'That real development means expanding people\'s actual freedom to live lives they have reason to value, not just growing national income',
      'That freedom and income are always perfectly correlated',
      'That development is impossible to define or measure in any way'
    ],
    correctAnswer: 'That real development means expanding people\'s actual freedom to live lives they have reason to value, not just growing national income',
    explanation: 'Sen shifted the focus from mere income to capabilities and freedoms—what people are actually able to do and be.'
  },
  {
    _key: 'q4',
    questionText: 'Why does this lesson argue that China\'s rising Gini coefficient during its growth era matters?',
    type: 'multiple-choice',
    options: [
      'Because it proves China\'s growth statistics were fabricated',
      'Because it shows income inequality widened even as average income grew, meaning the benefits of growth weren\'t shared evenly',
      'Because the Gini coefficient measures a country\'s total GDP',
      'Because a rising Gini coefficient always means a country\'s economy is shrinking'
    ],
    correctAnswer: 'Because it shows income inequality widened even as average income grew, meaning the benefits of growth weren\'t shared evenly',
    explanation: 'A rising Gini coefficient indicates increasing inequality, showing that aggregate growth was not distributed equally.'
  },
  {
    _key: 'q5',
    questionText: 'You\'re a policymaker overseeing a period of extremely fast GDP growth, and you must choose between continuing to maximize growth or redirecting investment toward environmental cleanup and rural healthcare. Based on this lesson, what is the real trade-off in this decision?',
    type: 'multiple-choice',
    options: [
      'There is no trade-off — maximizing growth always improves every dimension of life simultaneously',
      'Continuing to maximize growth keeps income and revenue rising but risks locking in environmental and inequality costs, while redirecting investment slows headline growth but may improve actual quality of life',
      'Redirecting investment toward healthcare always causes GDP to fall to zero',
      'This decision has no bearing on a country\'s long-term development'
    ],
    correctAnswer: 'Continuing to maximize growth keeps income and revenue rising but risks locking in environmental and inequality costs, while redirecting investment slows headline growth but may improve actual quality of life',
    explanation: 'This highlights the core tension: optimizing for pure output often neglects externalities like pollution and inequality, whereas addressing them requires diverting resources from pure output growth.'
  },
  {
    _key: 'q6',
    questionText: 'You\'re an economic advisor reviewing a country\'s impressive 10% annual GDP growth rate, and a colleague argues this alone proves the country is "developing successfully." Based on this lesson, what follow-up question should you raise?',
    type: 'multiple-choice',
    options: [
      'None — a high growth rate is definitive proof of successful development on every dimension',
      'Whether that growth has translated into improvements in health, environmental quality, and equality for the typical citizen, or whether specific groups and dimensions of life have been left behind',
      'Whether the growth rate is mathematically possible at all',
      'Whether the country\'s currency has a favorable exchange rate'
    ],
    correctAnswer: 'Whether that growth has translated into improvements in health, environmental quality, and equality for the typical citizen, or whether specific groups and dimensions of life have been left behind',
    explanation: 'As the lesson states, the key question is "growth for whom, and at what cost?"'
  },
  {
    _key: 'q7',
    questionText: 'A country reports strong, sustained GDP growth for two decades, but independent researchers find that life expectancy in its poorest regions has barely improved and air quality has worsened significantly. Based on this lesson, what does this scenario best illustrate?',
    type: 'multiple-choice',
    options: [
      'That the GDP growth figures must be fraudulent',
      'The gap between economic growth and economic development — rising output without a corresponding rise in broader quality-of-life measures',
      'That GDP and development are always identical measurements',
      'That life expectancy has no relationship to a country\'s economic policies'
    ],
    correctAnswer: 'The gap between economic growth and economic development — rising output without a corresponding rise in broader quality-of-life measures',
    explanation: 'This is the exact distinction made: output can grow while quality of life stagnates or degrades in key areas.'
  },
  {
    _key: 'q8',
    questionText: 'Two countries have identical GDP growth rates over the same ten-year period. Country A\'s income gains are spread broadly, with rising life expectancy and stable inequality. Country B\'s income gains are concentrated in a few regions, with worsening inequality and pollution. Based on this lesson, which country is more likely to be experiencing genuine development, not just growth?',
    type: 'multiple-choice',
    options: [
      'Country B, since any GDP growth automatically counts as development',
      'Country A, since its growth has translated into broader improvements across health and equality, matching this lesson\'s definition of development',
      'Neither country\'s experience relates to the concepts in this lesson',
      'Both countries are experiencing identical development outcomes'
    ],
    correctAnswer: 'Country A, since its growth has translated into broader improvements across health and equality, matching this lesson\'s definition of development',
    explanation: 'Country A meets the broader criteria for development, whereas Country B is experiencing uneven growth with negative externalities.'
  },
  {
    _key: 'q9',
    questionText: 'A government shifts its official economic policy language from "maximize GDP growth" to "high-quality growth," explicitly citing environmental and inequality concerns. Based on this lesson, what does this shift represent?',
    type: 'multiple-choice',
    options: [
      'A meaningless rebranding with no real economic significance',
      'An implicit acknowledgment of the growth-development gap this lesson describes — recognizing that raw output growth alone doesn\'t guarantee broader improvements in living standards',
      'Proof that the country\'s GDP growth was fabricated all along',
      'A policy that has no relationship to the concepts covered in this lesson'
    ],
    correctAnswer: 'An implicit acknowledgment of the growth-development gap this lesson describes — recognizing that raw output growth alone doesn\'t guarantee broader improvements in living standards',
    explanation: 'This shift reflects an understanding that growth must also be sustainable and equitable to count as true development.'
  },
  {
    _key: 'q10',
    questionText: 'A researcher wants to evaluate whether a country\'s recent economic growth has translated into genuine development. Based on this lesson, which combination of evidence would be most relevant to examine?',
    type: 'multiple-choice',
    options: [
      'GDP growth rate alone, since it fully captures every relevant outcome',
      'GDP growth rate alongside measures of health, environmental quality, and the distribution of income across regions and groups',
      'Only the country\'s currency exchange rate',
      'Only the total number of new factories built during the period'
    ],
    correctAnswer: 'GDP growth rate alongside measures of health, environmental quality, and the distribution of income across regions and groups',
    explanation: 'A comprehensive evaluation of development requires looking at both total output (growth) and how that output affects living standards and equality (development).'
  }
];
