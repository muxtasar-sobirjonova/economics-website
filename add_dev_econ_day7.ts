import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 7;
  const track = Track.DEVELOPMENT_ECONOMICS;
  console.log(`Starting update for Day \${dayOrder} (\${track}) Chapter Review Quiz...`);

  // UPDATE OR CREATE QUIZ (Day 7 is just a Quiz, no Lesson entry typically, but wait, the database schema requires a Quiz to exist. We might need a Lesson entry if the UI expects it, but let's check Day 21).
  // Actually, Day 21 had a Lesson entry with 'Chapter 3 Review Quiz' as title. Let's create a Lesson entry just in case to be safe, because the UI might pull from Lesson.
  let lesson = await prisma.lesson.findUnique({
    where: { track_dayOrder: { track: track, dayOrder: dayOrder } }
  });

  const lessonData = {
    title: 'Week 1 Review Quiz: Growth, Measurement, and Historical Development',
    tag: track,
    timeEstimate: 15,
    track: track,
    dayOrder: dayOrder,
    conceptText: 'This is the end-of-week review quiz covering Days 1 through 6. There is no new reading for today. Use this quiz to test your understanding of the concepts covered so far: economic growth vs. development, GDP and GNI, the Human Development Index (HDI), absolute vs. relative poverty, the Malthusian trap, and Rostow’s stages of economic growth.',
    conceptSummary: 'Review Quiz for Week 1.',
    conceptTakeaways: ['Review and synthesize concepts from Week 1.'],
    articleTitle: 'Week 1 Review',
    articleText: 'Proceed to the quiz to test your knowledge on the distinction between growth and development, the mechanics of poverty measurement, and the historical trajectory of global wealth.',
    articleSummary: 'Week 1 Review Quiz.',
    articleTakeaways: ['Test your understanding of Week 1 concepts.']
  };

  if (lesson) {
    lesson = await prisma.lesson.update({
      where: { id: lesson.id },
      data: lessonData
    });
  } else {
    lesson = await prisma.lesson.create({
      data: lessonData
    });
  }

  let quiz = await prisma.quiz.findUnique({
    where: { track_dayOrder: { track: track, dayOrder: dayOrder } }
  });

  if (!quiz) {
    quiz = await prisma.quiz.create({
      data: {
        track: track,
        dayOrder: dayOrder,
        title: "Week 1 Review Quiz",
        tag: track,
        timeEstimate: 15
      }
    });
  }

  // Clear old questions
  await prisma.quizQuestion.deleteMany({
    where: { quizId: quiz.id }
  });

  const questions = [
    {
      questionText: "Scenario: A developing country's GDP grows by 10% for a decade. During the same period, water pollution worsens significantly, lowering life expectancy in rural areas, while urban incomes soar. How would Amartya Sen's \"capability approach\" evaluate this decade of growth?",
      options: [
        "It would consider it an unqualified success because total output expanded rapidly.",
        "It would consider it a mixed outcome, because while some gained income, the environmental damage reduced the real freedom of rural residents to live long, healthy lives.",
        "It would classify the growth as purely negative, since Sen's approach ignores income entirely.",
        "It would defer judgment until the country's GNI can be calculated alongside GDP."
      ],
      correctAnswer: "It would consider it a mixed outcome, because while some gained income, the environmental damage reduced the real freedom of rural residents to live long, healthy lives.",
      explanation: "- A) Wrong — Sen's approach explicitly looks beyond raw output to human outcomes.\\n- B) Correct — development is about expanding capabilities (freedoms like health and longevity). The growth helped some but actively restricted the capabilities of others.\\n- C) Wrong — Sen doesn't ignore income; he views it as a means to an end, not the end itself.\\n- D) Wrong — swapping GDP for GNI doesn't address the environmental or health aspects of capabilities."
    },
    {
      questionText: "Why did the Chinese government eventually shift its rhetoric toward \"high-quality growth\" after decades of 9-10% annual GDP increases?",
      options: [
        "Because their GDP calculations were proven mathematically incorrect by international auditors.",
        "Because they achieved 100% income equality and no longer needed to focus on raw output.",
        "Because rapid economic expansion brought severe, unmeasured costs like pollution and uneven regional development that raw growth numbers failed to capture.",
        "Because foreign investors demanded a new phrase before committing more capital."
      ],
      correctAnswer: "Because rapid economic expansion brought severe, unmeasured costs like pollution and uneven regional development that raw growth numbers failed to capture.",
      explanation: "- A) Wrong — the sheer scale of the growth was real, not a mathematical error.\\n- B) Wrong — inequality actually rose sharply during this period.\\n- C) Correct — the shift acknowledged the gap between raw economic growth and holistic development.\\n- D) Wrong — this was an internal policy shift, not a foreign marketing slogan."
    },
    {
      questionText: "Imagine a small island nation that becomes a major tax haven and financial hub. Hundreds of multinational corporations register their headquarters there, generating massive profits on paper, but employing very few locals. Which of the following is the most likely statistical result?",
      options: [
        "Its GNI per capita will appear artificially high, while its GDP per capita will drop.",
        "Both its GDP and GNI will be identical since the corporations are legally registered there.",
        "Its GDP per capita will soar due to the corporate profits generated within its borders, but its GNI per capita will be noticeably lower since those profits belong to foreign shareholders.",
        "The UN will refuse to calculate either metric because the economy is too open."
      ],
      correctAnswer: "Its GDP per capita will soar due to the corporate profits generated within its borders, but its GNI per capita will be noticeably lower since those profits belong to foreign shareholders.",
      explanation: "- A) Wrong — it's the reverse. GDP captures domestic production, GNI captures resident income.\\n- B) Wrong — they diverge heavily when foreign capital produces output locally.\\n- C) Correct — GDP captures the output within the borders, while GNI excludes profits that are ultimately sent back to foreign residents/owners.\\n- D) Wrong — both metrics are calculated and used exactly for cases like this."
    },
    {
      questionText: "Why is comparing two countries solely by their raw GDP per capita sometimes a quietly misleading way to measure the well-being of their typical residents?",
      options: [
        "GDP per capita only includes agricultural output and ignores manufacturing.",
        "GDP measures total output produced within borders, meaning a country with heavy foreign corporate presence can look statistically richer than what actually reaches its citizens' pockets.",
        "GDP per capita is usually calculated in different, incompatible currencies that cannot be adjusted.",
        "GDP figures deliberately hide government spending."
      ],
      correctAnswer: "GDP measures total output produced within borders, meaning a country with heavy foreign corporate presence can look statistically richer than what actually reaches its citizens' pockets.",
      explanation: "- A) Wrong — GDP measures all sectors.\\n- B) Correct — it answers \"how much is produced here,\" not \"how much income stays here.\\\"\\n- C) Wrong — currencies are routinely adjusted via exchange rates or PPP.\\n- D) Wrong — government spending is a core component of GDP calculation."
    },
    {
      questionText: "If a country discovers a massive oil reserve and its income per person doubles overnight, but it fails to build any new schools or hospitals, what will happen to its Human Development Index (HDI) score?",
      options: [
        "It will double immediately, mirroring the income growth.",
        "It will drop, because oil revenue is excluded from HDI calculations.",
        "It will increase, but not as dramatically as the income, because HDI also equally weighs life expectancy and education levels, which haven't changed.",
        "It will stay exactly the same, because HDI entirely ignores income."
      ],
      correctAnswer: "It will increase, but not as dramatically as the income, because HDI also equally weighs life expectancy and education levels, which haven't changed.",
      explanation: "- A) Wrong — HDI is a composite, so an increase in only one of three factors dilutes the overall gain.\\n- B) Wrong — oil revenue boosts GNI per capita, which is part of HDI.\\n- C) Correct — HDI is an average of income, health, and education indices; the stagnant metrics act as an anchor on the overall score.\\n- D) Wrong — income (GNI per capita) is one of the three core pillars of HDI."
    },
    {
      questionText: "Norway has consistently ranked at or near the top of the HDI for years. What separates Norway's development trajectory from other countries that also possess massive oil wealth but rank much lower on the HDI?",
      options: [
        "Norway exports all of its oil, whereas other countries consume it domestically.",
        "Norway successfully converted its resource wealth into sustained public investments in health and education, rather than just enriching a small elite.",
        "Norway's HDI score is artificially boosted by a special UN exemption for Scandinavian countries.",
        "Norway's population is so small that any income mathematically guarantees a top HDI spot."
      ],
      correctAnswer: "Norway successfully converted its resource wealth into sustained public investments in health and education, rather than just enriching a small elite.",
      explanation: "- A) Wrong — domestic consumption doesn't inherently lower HDI.\\n- B) Correct — high HDI requires deliberate investment in the non-income pillars (health and education), which Norway achieved through mechanisms like its sovereign wealth fund.\\n- C) Wrong — the UN uses the same formula for all nations.\\n- D) Wrong — the metric is per capita; a small population doesn't guarantee high health or education outcomes."
    },
    {
      questionText: "Country X experiences a rapid economic boom. The incomes of the poorest 10% of citizens increase enough that they can all comfortably afford a basic survival basket of food, clothing, and shelter. However, the incomes of the top 90% grow ten times faster. What is the statistical outcome?",
      options: [
        "Both absolute poverty and relative poverty will fall to zero.",
        "Absolute poverty will fall sharply, but relative poverty might actually increase or stay flat, since the poorest are falling further behind the country's median income.",
        "Relative poverty will fall, but absolute poverty will stay exactly the same.",
        "The World Bank will classify the entire country as living in extreme poverty."
      ],
      correctAnswer: "Absolute poverty will fall sharply, but relative poverty might actually increase or stay flat, since the poorest are falling further behind the country's median income.",
      explanation: "- A) Wrong — relative poverty depends on the gap between the bottom and the middle.\\n- B) Correct — absolute poverty measures physical survival (which was met), while relative poverty measures social inclusion relative to the median (which worsened).\\n- C) Wrong — it's the exact opposite.\\n- D) Wrong — they are crossing the absolute survival threshold."
    },
    {
      questionText: "Why does the European Union use a relative poverty line (typically 60% of the median income) rather than an absolute line like the World Bank's $3 a day?",
      options: [
        "Because $3 a day is too much money for the average European to earn.",
        "Because European governments want to exaggerate their poverty statistics to secure more UN funding.",
        "Because in wealthy nations, the challenge is not usually raw physical survival, but whether citizens have enough resources to participate normally in their own society without falling drastically behind their neighbors.",
        "Because absolute poverty lines are illegal under EU law."
      ],
      correctAnswer: "Because in wealthy nations, the challenge is not usually raw physical survival, but whether citizens have enough resources to participate normally in their own society without falling drastically behind their neighbors.",
      explanation: "- A) Wrong — $3 a day is extremely low compared to European incomes.\\n- B) Wrong — they aren't trying to game UN funding.\\n- C) Correct — relative poverty captures the social reality of falling behind in a rich society, where absolute physical starvation is rare.\\n- D) Wrong — it's an economic consensus, not a legal ban."
    },
    {
      questionText: "According to the logic of the Malthusian trap, what was the typical long-term result of a technological improvement in farming in England in the year 1500?",
      options: [
        "A permanent increase in the average farmer's standard of living that compounded every generation.",
        "The immediate industrialization of the surrounding countryside.",
        "A temporary surplus of food that led to more children surviving, eventually increasing the population until there were more mouths to feed, pushing living standards back down to subsistence levels.",
        "A massive decrease in population as people abandoned farming for factory work."
      ],
      correctAnswer: "A temporary surplus of food that led to more children surviving, eventually increasing the population until there were more mouths to feed, pushing living standards back down to subsistence levels.",
      explanation: "- A) Wrong — this is what modern growth looks like, not pre-1800 growth.\\n- B) Wrong — industrialization did not occur immediately from 1500s farming gains.\\n- C) Correct — this is the defining mechanism of the Malthusian trap: gains are eaten up by population growth.\\n- D) Wrong — population increased, it didn't decrease."
    },
    {
      questionText: "When Angus Maddison and his successors plotted historical income per person over the last two thousand years, they found a \"hockey stick\" shape—flat for centuries, then bending sharply upward. Why didn't this bend happen everywhere at the same time?",
      options: [
        "Because the bend represents when each individual country successfully caused its output to permanently outpace its population growth, which occurred in Britain around 1650 and Japan around 1870.",
        "Because Maddison randomly assigned different years to different countries to make the chart look more interesting.",
        "Because the Roman Empire deliberately suppressed growth in certain regions until the 20th century.",
        "Because the bend only occurred when a country adopted the US dollar as its currency."
      ],
      correctAnswer: "Because the bend represents when each individual country successfully caused its output to permanently outpace its population growth, which occurred in Britain around 1650 and Japan around 1870.",
      explanation: "- A) Correct — \"1800\" is just a global average. The escape from the Malthusian trap happened locally at different times in history depending on local conditions.\\n- B) Wrong — the data was painstakingly reconstructed from historical records.\\n- C) Wrong — the Roman Empire did not exist in the 20th century.\\n- D) Wrong — currency adoption had nothing to do with it."
    },
    {
      questionText: "In Walt Rostow's five-stage model of economic growth, what is the critical mechanism that defines the \"take-off\" stage?",
      options: [
        "A sudden, nationwide transition to 100% renewable energy.",
        "The moment a traditional agricultural society abolishes all forms of currency.",
        "A sharp jump in investment and the rapid growth of a handful of leading industrial sectors that pull the rest of the economy forward.",
        "The final stage where factories transition from building heavy machinery to building consumer goods like cars and appliances."
      ],
      correctAnswer: "A sharp jump in investment and the rapid growth of a handful of leading industrial sectors that pull the rest of the economy forward.",
      explanation: "- A) Wrong — energy sources were not Rostow's focus.\\n- B) Wrong — Rostow was describing capitalist industrialization, which heavily relies on currency.\\n- C) Correct — take-off is defined by a surge in productive investment and the emergence of leading manufacturing sectors.\\n- D) Wrong — this describes the final stage, \"High Mass Consumption.\""
    },
    {
      questionText: "How did Walt Rostow's academic model directly shape real United States foreign policy in the 1960s?",
      options: [
        "It convinced President Kennedy that foreign aid was useless and should be completely abolished.",
        "It provided the intellectual justification for the Alliance for Progress, arguing that targeted American aid could push struggling nations through \"take-off\" before they succumbed to communism.",
        "It argued that the U.S. should only trade with countries that were already in the \"high mass consumption\" stage.",
        "It proved mathematically that Marxist revolutions were inevitable, leading the U.S. to retreat from global affairs."
      ],
      correctAnswer: "It provided the intellectual justification for the Alliance for Progress, arguing that targeted American aid could push struggling nations through \"take-off\" before they succumbed to communism.",
      explanation: "- A) Wrong — he advocated for highly strategic foreign aid, not abolition.\\n- B) Correct — his theory was operationalized as a Cold War tool to jumpstart development and pre-empt Marxist revolution.\\n- C) Wrong — he wanted to engage with countries in earlier stages.\\n- D) Wrong — his book was literally subtitled \"A Non-Communist Manifesto\" to argue against Marxist inevitability."
    },
    {
      questionText: "Amartya Sen co-created the Human Development Index (HDI) in 1990. How does the structure of the HDI directly reflect Sen's core philosophy of \"development as freedom\"?",
      options: [
        "By explicitly tracking how many free elections a country holds per year.",
        "By completely ignoring a country's income and only measuring its environmental laws.",
        "By combining income with health and education, acknowledging that a long life and the ability to read are fundamental \"capabilities\" required for a person to exercise real freedom, not just having money.",
        "By proving that economic growth is actually harmful to human freedom in the long run."
      ],
      correctAnswer: "By combining income with health and education, acknowledging that a long life and the ability to read are fundamental \"capabilities\" required for a person to exercise real freedom, not just having money.",
      explanation: "- A) Wrong — HDI does not measure political freedom or elections.\\n- B) Wrong — it includes GNI per capita.\\n- C) Correct — Sen argued that income alone is insufficient; true freedom requires the physical capability (health) and intellectual capability (education) to use that income.\\n- D) Wrong — he views growth as necessary, just not sufficient."
    },
    {
      questionText: "If you were to apply the World Bank's current absolute poverty line (adjusted for purchasing power parity) to an average citizen of the Roman Empire based on Angus Maddison's estimates (roughly $1,100 a year), what conclusion would you reach?",
      options: [
        "The average Roman lived far below the modern extreme poverty line.",
        "The average Roman lived right at the modern EU relative poverty line.",
        "The average Roman's income was completely mathematically incomparable to modern currency.",
        "The average Roman lived above the modern absolute poverty line of $3 a day (roughly $1,095 a year), showing that ancient peaks sometimes matched or exceeded the living standards of today's poorest nations."
      ],
      correctAnswer: "The average Roman lived above the modern absolute poverty line of $3 a day (roughly $1,095 a year), showing that ancient peaks sometimes matched or exceeded the living standards of today's poorest nations.",
      explanation: "- A) Wrong — $1,100 a year is roughly $3 a day, which clears the extreme poverty threshold.\\n- B) Wrong — the EU relative line is much, much higher.\\n- C) Wrong — Maddison's entire project was converting it to comparable modern PPP dollars.\\n- D) Correct — the uncomfortable truth of Maddison's data is that parts of the ancient world had higher average incomes than some of today's poorest developing nations."
    },
    {
      questionText: "Imagine a country currently in Rostow's \"drive to maturity\" stage, characterized by heavy foreign investment and multinational factories expanding into new industries. Why might a development economist prefer to look at this country's GNI rather than its GDP to assess its true progress?",
      options: [
        "Because GNI automatically measures the environmental damage caused by the new factories.",
        "Because the heavy presence of foreign-owned factories might inflate GDP with profits that are sent back to foreign investors, whereas GNI would better capture the income actually retained by the country's own residents.",
        "Because Rostow's model explicitly requires GNI to be used for the drive to maturity stage.",
        "Because GDP cannot be calculated for countries with heavy manufacturing sectors."
      ],
      correctAnswer: "Because the heavy presence of foreign-owned factories might inflate GDP with profits that are sent back to foreign investors, whereas GNI would better capture the income actually retained by the country's own residents.",
      explanation: "- A) Wrong — neither metric measures environmental damage natively.\\n- B) Correct — GNI adjusts for international income flows, making it a more accurate reflection of what the local population actually earns when foreign capital dominates production.\\n- C) Wrong — Rostow didn't mandate a specific statistical transition.\\n- D) Wrong — GDP easily measures manufacturing."
    },
    {
      questionText: "What was a major reason that modern economists eventually rejected Rostow's five-stage model as a universal law of development?",
      options: [
        "They discovered that Rostow had plagiarized the model from Karl Marx.",
        "Empirical history showed that countries frequently skipped stages, developed through natural resource exports without industrializing, or followed unique paths dictated by their specific institutions rather than a single rigid ladder.",
        "They realized that the \"traditional society\" stage never actually existed anywhere in human history.",
        "The model only worked for countries in Latin America but failed entirely in Europe."
      ],
      correctAnswer: "Empirical history showed that countries frequently skipped stages, developed through natural resource exports without industrializing, or followed unique paths dictated by their specific institutions rather than a single rigid ladder.",
      explanation: "- A) Wrong — he explicitly wrote it as an alternative to Marx.\\n- B) Correct — development proved to be highly context-dependent, not a fixed five-step recipe.\\n- C) Wrong — pre-industrial societies certainly existed.\\n- D) Wrong — it wasn't a perfect fit anywhere, but it didn't solely work in Latin America."
    },
    {
      questionText: "A nation passes a sweeping law that forces all its citizens to work 80 hours a week in factories, completely banning leisure time and weekends. Total industrial output skyrockets. How would this event be reflected in GDP versus a broader measure of economic development?",
      options: [
        "Both GDP and broad economic development metrics would show massive improvement.",
        "GDP would rise significantly, but broad development metrics (like Sen's capability approach) would likely judge it a severe failure due to the loss of freedom, health, and well-being.",
        "GDP would fall because the workers would be too tired, but development would rise because of the discipline.",
        "Neither metric would change, as labor hours are not counted in any economic statistics."
      ],
      correctAnswer: "GDP would rise significantly, but broad development metrics (like Sen's capability approach) would likely judge it a severe failure due to the loss of freedom, health, and well-being.",
      explanation: "- A) Wrong — broad development metrics account for quality of life, which is destroyed here.\\n- B) Correct — GDP blindly measures output without judging the human cost, while Sen's capability approach prioritizes the freedom to choose how to live.\\n- C) Wrong — if output skyrockets, GDP rises by definition.\\n- D) Wrong — the output produced during those hours is counted."
    },
    {
      questionText: "A country boasts a remarkably high HDI score, ranking in the global top 10. However, upon closer inspection, the indigenous population within that country has a life expectancy 15 years shorter than the national average, and significantly lower literacy rates. Why didn't the HDI capture this disparity?",
      options: [
        "Because HDI only measures urban populations.",
        "Because HDI is a national average that aggregates data across the entire population, meaning extreme internal inequalities can be masked by high overall averages.",
        "Because indigenous populations are legally excluded from UN statistics.",
        "Because the HDI deliberately weighs income much heavier than health or education."
      ],
      correctAnswer: "Because HDI is a national average that aggregates data across the entire population, meaning extreme internal inequalities can be masked by high overall averages.",
      explanation: "- A) Wrong — HDI uses national data.\\n- B) Correct — like GDP per capita, standard HDI is an aggregate average and does not inherently reflect distributional inequality within the borders.\\n- C) Wrong — they are included in the national statistics.\\n- D) Wrong — the three pillars are equally weighted."
    },
    {
      questionText: "In the context of escaping the Malthusian trap, why is a sustained economic growth rate of just 2% per year considered revolutionary over the course of a century?",
      options: [
        "Because 2% growth is enough to trigger hyperinflation, wiping out the national debt.",
        "Because through the mathematical power of compounding, a 2% annual advantage over population growth will multiply an economy's living standards many times over across a few generations.",
        "Because 2% is the exact legal threshold the World Bank uses to declare a country \"developed.\"",
        "It isn't revolutionary; a 2% growth rate is considered stagnant by economic historians."
      ],
      correctAnswer: "Because through the mathematical power of compounding, a 2% annual advantage over population growth will multiply an economy's living standards many times over across a few generations.",
      explanation: "- A) Wrong — real growth is separate from inflation.\\n- B) Correct — compounding growth turns small, seemingly mundane annual gains into exponential transformations of living standards over long horizons.\\n- C) Wrong — there is no such legal threshold.\\n- D) Wrong — compared to centuries of 0% growth, 2% compounding is explosive."
    },
    {
      questionText: "When researchers set the global absolute poverty line (currently $3 a day), they adjust the currencies using Purchasing Power Parity (PPP). If they instead simply used raw market exchange rates to convert local currencies into US dollars, what major error would occur in counting the global poor?",
      options: [
        "It would perfectly count the poor, as exchange rates always reflect true living costs.",
        "It would vastly undercount the poor, because dollars are worthless outside the United States.",
        "It would distort reality by failing to account for the fact that basic non-traded goods (like local food or haircuts) are usually much cheaper in developing countries, making the dollar amount seem artificially weak.",
        "It would instantly move everyone above the poverty line on paper."
      ],
      correctAnswer: "It would distort reality by failing to account for the fact that basic non-traded goods (like local food or haircuts) are usually much cheaper in developing countries, making the dollar amount seem artificially weak.",
      explanation: "- A) Wrong — exchange rates fluctuate based on international trade and capital flows, not local costs of living.\\n- B) Wrong — the US dollar is heavily used internationally.\\n- C) Correct — PPP ensures that \"$3\" buys the same basket of survival goods in Malawi as it would in the US, correcting for the cheaper cost of living in developing nations.\\n- D) Wrong — it would likely falsely increase the poverty count by making their incomes look smaller than their real purchasing power dictates."
    }
  ];

  for (let i = 0; i < questions.length; i++) {
    await prisma.quizQuestion.create({
      data: {
        quizId: quiz.id,
        questionText: questions[i].questionText,
        options: questions[i].options,
        correctAnswer: questions[i].correctAnswer,
        explanation: questions[i].explanation,
        order: i + 1,
      }
    });
  }
  console.log(`Successfully updated \${questions.length} Quiz Questions for Day \${dayOrder}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
