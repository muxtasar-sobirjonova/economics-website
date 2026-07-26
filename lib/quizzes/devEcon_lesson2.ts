import { Question } from '../types';

export const DEV_ECON_LESSON2_QUESTIONS: Question[] = [
  {
    _key: 'q1',
    questionText: 'What does "GDP" measure, as defined in this lesson?',
    type: 'multiple-choice',
    options: [
      'The income earned by a country\'s residents, wherever in the world it was earned',
      'The total value of goods and services produced within a country\'s borders, regardless of who owns that production',
      'The total savings held by a country\'s citizens',
      'A country\'s total government spending'
    ],
    correctAnswer: 'The total value of goods and services produced within a country\'s borders, regardless of who owns that production',
    explanation: 'GDP strictly measures output within geographical borders.'
  },
  {
    _key: 'q2',
    questionText: 'What does "GNI" measure, per this lesson?',
    type: 'multiple-choice',
    options: [
      'The total value of goods produced within a country\'s borders regardless of ownership',
      'The income earned by a country\'s own residents and companies, wherever in the world it was actually earned',
      'A country\'s total tax revenue',
      'The total number of multinational companies operating in a country'
    ],
    correctAnswer: 'The income earned by a country\'s own residents and companies, wherever in the world it was actually earned',
    explanation: 'GNI accounts for who actually receives the income, making it a better proxy for resident wealth.'
  },
  {
    _key: 'q3',
    questionText: 'According to this lesson, why can Singapore\'s GDP per capita appear inflated relative to typical resident living standards?',
    type: 'multiple-choice',
    options: [
      'Because Singapore\'s government fabricates its economic statistics',
      'Because multinational companies can legally book significant profits there for tax and business reasons, even if little of that profit reaches ordinary residents',
      'Because GDP always overstates every country\'s living standards equally',
      'Because Singapore has no residents at all'
    ],
    correctAnswer: 'Because multinational companies can legally book significant profits there for tax and business reasons, even if little of that profit reaches ordinary residents',
    explanation: 'Multinational profit booking significantly inflates GDP for corporate hubs without proportionate increases in local resident income.'
  },
  {
    _key: 'q4',
    questionText: 'Why does this lesson argue that GDP remains widely used despite its limitations?',
    type: 'multiple-choice',
    options: [
      'Because it is illegal to use any other economic measure',
      'Because it\'s easier to measure consistently across countries and has decades of standardized data behind it, even though it answers a narrower question than "living standards"',
      'Because GDP and GNI always produce identical results',
      'Because GDP has no real economic meaning at all'
    ],
    correctAnswer: 'Because it\'s easier to measure consistently across countries and has decades of standardized data behind it, even though it answers a narrower question than "living standards"',
    explanation: 'GDP is practical, well-standardized, and easy to compare, even if it has shortcomings as a welfare indicator.'
  },
  {
    _key: 'q5',
    questionText: 'You\'re a journalist preparing a "richest countries in the world" ranking using only GDP per capita, and Singapore lands near the top. Based on this lesson, what is the strongest argument for digging deeper before publishing?',
    type: 'multiple-choice',
    options: [
      'GDP per capita rankings are always completely fabricated and should never be reported',
      'A high GDP per capita in a small, open economy like Singapore may partly reflect multinational profit-booking rather than resident income, so GNI and other resident-focused data would give a more accurate picture',
      'Digging deeper is unnecessary, since GDP always perfectly reflects resident living standards',
      'Singapore\'s ranking should be excluded from any list for being too small'
    ],
    correctAnswer: 'A high GDP per capita in a small, open economy like Singapore may partly reflect multinational profit-booking rather than resident income, so GNI and other resident-focused data would give a more accurate picture',
    explanation: 'A responsible ranking must recognize that GDP per capita can misrepresent actual resident wealth in these specific types of economies.'
  },
  {
    _key: 'q6',
    questionText: 'You\'re an economic analyst comparing two countries with similar GDP per capita: one a small financial hub with heavy multinational corporate presence, the other a country with a more typical domestic economic structure. Based on this lesson, what additional data would help clarify which country\'s residents are actually better off?',
    type: 'multiple-choice',
    options: [
      'No additional data is needed — identical GDP per capita always means identical resident living standards',
      'GNI data and resident-focused welfare measures, since these more directly capture income and living standards reaching the country\'s own residents',
      'The total number of buildings constructed in each country',
      'Each country\'s population size alone'
    ],
    correctAnswer: 'GNI data and resident-focused welfare measures, since these more directly capture income and living standards reaching the country\'s own residents',
    explanation: 'To compare actual resident welfare, you must look past border-level output (GDP) to resident-level income (GNI).'
  },
  {
    _key: 'q7',
    questionText: 'A small country reports extremely high GDP per capita, driven substantially by profits multinational companies book there for favorable tax treatment. Based on this lesson, what would GNI likely reveal that GDP alone does not?',
    type: 'multiple-choice',
    options: [
      'GNI would show an identical figure to GDP in every case',
      'GNI would likely show a meaningfully lower figure, since it focuses on income actually earned by residents rather than output produced within the country\'s borders',
      'GNI has no relationship to a country\'s resident income',
      'GNI would always show a higher figure than GDP in this scenario'
    ],
    correctAnswer: 'GNI would likely show a meaningfully lower figure, since it focuses on income actually earned by residents rather than output produced within the country\'s borders',
    explanation: 'If output is artificially inflated by corporate profit shifting, GNI will strip those out and reveal a lower (but more accurate) resident income.'
  },
  {
    _key: 'q8',
    questionText: 'Two countries have identical GDP per capita. Country A\'s GDP largely reflects income earned by and distributed to its own residents. Country B\'s GDP is substantially inflated by multinational profit-booking with little reaching residents. Based on this lesson, which country\'s residents are likely better off on average, and why?',
    type: 'multiple-choice',
    options: [
      'Country B\'s residents, since a higher GDP always means better resident living standards regardless of its source',
      'Country A\'s residents, since their GDP more closely reflects income actually reaching residents, unlike Country B\'s inflated figure',
      'Neither country\'s resident living standards can be evaluated using GDP or GNI',
      'Both countries\' residents are equally well off, since their GDP figures are identical'
    ],
    correctAnswer: 'Country A\'s residents, since their GDP more closely reflects income actually reaching residents, unlike Country B\'s inflated figure',
    explanation: 'Country A\'s output actually stays within the country, directly improving its residents\' lives.'
  },
  {
    _key: 'q9',
    questionText: 'A government wants to accurately assess whether its citizens\' living standards are rising, rather than simply tracking total economic activity within its borders. Based on this lesson, which measure would be more directly relevant to this specific goal?',
    type: 'multiple-choice',
    options: [
      'GDP, since it captures every relevant aspect of resident living standards',
      'GNI and resident-focused welfare data, since these track income and outcomes actually reaching the country\'s own residents',
      'Neither GDP nor GNI has any relationship to living standards',
      'The total number of multinational companies registered in the country'
    ],
    correctAnswer: 'GNI and resident-focused welfare data, since these track income and outcomes actually reaching the country\'s own residents',
    explanation: 'GNI focuses specifically on the economic returns to the people rather than just the geographic area.'
  },
  {
    _key: 'q10',
    questionText: 'A researcher notices a country\'s GDP has grown significantly, largely due to increased foreign corporate activity, while median resident income has remained flat. Based on this lesson, what does this pattern most likely illustrate?',
    type: 'multiple-choice',
    options: [
      'A contradiction that could not actually occur in a real economy',
      'The gap between GDP and actual resident income that this lesson identifies — output growing within a country\'s borders without a corresponding rise in income reaching residents',
      'Proof that the country\'s GDP statistics are fraudulent',
      'Evidence that GDP and GNI are always identical measurements'
    ],
    correctAnswer: 'The gap between GDP and actual resident income that this lesson identifies — output growing within a country\'s borders without a corresponding rise in income reaching residents',
    explanation: 'This illustrates the classic divergence where economic activity increases without translating into broader domestic development.'
  }
];
