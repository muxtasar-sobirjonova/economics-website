import { Question } from '../types';

export const DEV_ECON_LESSON3_QUESTIONS: Question[] = [
  {
    _key: 'q1',
    questionText: 'What does the Human Development Index (HDI) combine into a single score, per this lesson?',
    type: 'multiple-choice',
    options: [
      'GDP growth rate and stock market performance',
      'Life expectancy, education, and income per person',
      'Military spending and population size',
      'Export volume and import volume'
    ],
    correctAnswer: 'Life expectancy, education, and income per person',
    explanation: 'The HDI explicitly aggregates these three dimensions to provide a broader measure of development than income alone.'
  },
  {
    _key: 'q2',
    questionText: 'Who created the HDI, and why, according to this lesson?',
    type: 'multiple-choice',
    options: [
      'The World Bank, to replace GDP entirely with a single new currency measure',
      'Mahbub ul Haq and Amartya Sen, because similar-income countries were producing very different real health and education outcomes',
      'A private corporation, to help investors rank countries by profitability',
      'The government of Norway, to showcase its own oil wealth'
    ],
    correctAnswer: 'Mahbub ul Haq and Amartya Sen, because similar-income countries were producing very different real health and education outcomes',
    explanation: 'Haq and Sen designed the index to highlight that income does not automatically translate to equivalent human development outcomes.'
  },
  {
    _key: 'q3',
    questionText: 'What is Amartya Sen\'s "capability approach," as connected to HDI in this lesson?',
    type: 'multiple-choice',
    options: [
      'The idea that development means eliminating all forms of government spending',
      'The idea that development means expanding people\'s genuine freedom to live lives they have reason to value, not just growing income',
      'The idea that only countries with oil wealth can achieve real development',
      'The idea that GDP is the only measure that matters for development'
    ],
    correctAnswer: 'The idea that development means expanding people\'s genuine freedom to live lives they have reason to value, not just growing income',
    explanation: 'The capability approach views income as a means to an end, with the true goal of development being the expansion of human freedoms and capabilities.'
  },
  {
    _key: 'q4',
    questionText: 'According to this lesson, what is a real limitation of the HDI?',
    type: 'multiple-choice',
    options: [
      'It cannot be calculated for any country outside Europe',
      'It is a national average, so it says nothing about inequality within a country, environmental sustainability, or political freedom',
      'It only measures a country\'s military strength',
      'It has never been used by any international organization'
    ],
    correctAnswer: 'It is a national average, so it says nothing about inequality within a country, environmental sustainability, or political freedom',
    explanation: 'HDI improves upon GDP, but as a national average, it obscures domestic disparities and misses other critical dimensions of wellbeing.'
  },
  {
    _key: 'q5',
    questionText: 'You\'re comparing two countries with identical GDP per capita — one investing heavily in public health and education, the other spending similarly heavily on military infrastructure. Based on this lesson, would you expect their HDI scores to be identical?',
    type: 'multiple-choice',
    options: [
      'Yes, since identical income always produces identical HDI scores',
      'No, since HDI\'s education and life-expectancy components depend on how income actually gets used, not just how much income exists',
      'Yes, since HDI only measures income, not how it\'s spent',
      'No, since HDI scores are determined randomly regardless of national spending'
    ],
    correctAnswer: 'No, since HDI\'s education and life-expectancy components depend on how income actually gets used, not just how much income exists',
    explanation: 'This is the exact distinction HDI was built for: demonstrating how similar incomes can result in vastly different health and education outcomes based on policy choices.'
  },
  {
    _key: 'q6',
    questionText: 'You\'re an economist advising a resource-rich country on how to convert its oil wealth into a strong HDI ranking, similar to Norway\'s. Based on this lesson, what would you recommend prioritizing?',
    type: 'multiple-choice',
    options: [
      'Spending all oil revenue on immediate consumption with no long-term investment plan',
      'Directing revenue into sustained public investment in healthcare and education, similar to Norway\'s approach with its sovereign wealth fund',
      'Ignoring health and education entirely, since income alone determines HDI',
      'Reducing the country\'s income as much as possible to improve its HDI score'
    ],
    correctAnswer: 'Directing revenue into sustained public investment in healthcare and education, similar to Norway\'s approach with its sovereign wealth fund',
    explanation: 'Norway’s success stems from intentionally converting its resource wealth into long-term human capabilities through public investment.'
  },
  {
    _key: 'q7',
    questionText: 'Two countries have identical GDP per capita. Country A has significantly higher life expectancy and average years of schooling than Country B. Based on this lesson, which country is likely to have a higher HDI score, and why?',
    type: 'multiple-choice',
    options: [
      'Country B, since lower education and life expectancy always produce higher HDI scores',
      'Country A, since HDI directly incorporates life expectancy and education alongside income, not income alone',
      'Neither — HDI only measures GDP and ignores health and education entirely',
      'Both countries will have identical HDI scores since their income is identical'
    ],
    correctAnswer: 'Country A, since HDI directly incorporates life expectancy and education alongside income, not income alone',
    explanation: 'Because HDI weights income, life expectancy, and education equally, Country A will score higher due to its superior non-income outcomes.'
  },
  {
    _key: 'q8',
    questionText: 'A country has high oil-driven income but chooses to spend most of its revenue on luxury infrastructure projects rather than healthcare or education. Based on this lesson, what would you expect regarding its HDI ranking compared to a country with similar income that invests heavily in both?',
    type: 'multiple-choice',
    options: [
      'Its HDI ranking would likely be lower than the country investing in health and education, since HDI depends on more than income alone',
      'Its HDI ranking would automatically be higher, since more spending on any infrastructure always improves HDI',
      'HDI rankings are entirely unrelated to how a country spends its income',
      'Both countries would have identical HDI rankings regardless of spending choices'
    ],
    correctAnswer: 'Its HDI ranking would likely be lower than the country investing in health and education, since HDI depends on more than income alone',
    explanation: 'Without converting income into health and education, the country will lag in two of the three HDI components.'
  },
  {
    _key: 'q9',
    questionText: 'A researcher wants to know whether a country\'s economic growth has genuinely translated into a better quality of life for its citizens, not just a higher income figure. Based on this lesson, which measure would give the researcher a more complete picture than GDP alone?',
    type: 'multiple-choice',
    options: [
      'The country\'s stock market index',
      'The Human Development Index, since it incorporates life expectancy and education alongside income',
      'The country\'s total population size',
      'The number of billionaires residing in the country'
    ],
    correctAnswer: 'The Human Development Index, since it incorporates life expectancy and education alongside income',
    explanation: 'HDI was specifically designed to provide a more holistic snapshot of development than raw economic output.'
  },
  {
    _key: 'q10',
    questionText: 'A country ranks extremely high on the HDI, but a closer look reveals significant income inequality between its wealthiest and poorest regions. Based on this lesson, is this scenario consistent with how HDI actually works?',
    type: 'multiple-choice',
    options: [
      'No — a high HDI score means every region of the country must have identical outcomes',
      'Yes — HDI is a national average, so a high overall score can still coexist with significant internal inequality that the index doesn\'t directly capture',
      'No — HDI cannot be calculated for any country with any internal inequality',
      'Yes, but only for countries with oil wealth specifically'
    ],
    correctAnswer: 'Yes — HDI is a national average, so a high overall score can still coexist with significant internal inequality that the index doesn\'t directly capture',
    explanation: 'HDI relies on national averages and does not automatically penalize or reflect unequal distributions of its three components.'
  }
];
