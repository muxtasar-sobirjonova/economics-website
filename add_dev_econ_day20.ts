import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 20;
  const track = Track.DEVELOPMENT_ECONOMICS;
  console.log(`Starting update for Day \${dayOrder} (\${track})...`);

  // 1. UPDATE OR CREATE LESSON
  let lesson = await prisma.lesson.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  const lessonData = {
    title: 'Looking Beyond Income to Measure Poverty (Multidimensional Poverty)',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `A family can earn just enough to clear a country's official poverty line and still send their children to a school with no functioning toilets, cook over an open fire that damages their lungs, and walk two hours for water that isn't safe to drink. By income alone, that family isn't poor. By almost any other measure that matters to how they actually live, they clearly are.

For decades, poverty measurement meant drawing an income or consumption line and counting who fell beneath it — the World Bank's well-known international poverty line is exactly this kind of measure. Multidimensional poverty measurement starts from a different premise: that deprivation isn't one number but a bundle of them, spanning health, education, and living standards, and that a household can be severely deprived across several of these dimensions at once even while sitting just above a monetary poverty line. A person can be "not poor" by their bank balance and unmistakably poor by every condition actually shaping their household's day.

*A number that only counts money can only ever tell half of a life.*

The Global Multidimensional Poverty Index, built jointly by researchers at Oxford and the United Nations, is the most widely used attempt to count the other half. The article ahead follows what it counts, how it counts it, and what it finds when it's applied to the entire developing world at once.`,
    conceptSummary: `Multidimensional poverty measurement scores households across health, education, and living standards rather than income alone, capturing households severely deprived in several conditions at once even when they sit above a monetary poverty line. It complements traditional income poverty lines rather than replacing them, since the two measures overlap substantially but not completely.`,
    conceptTakeaways: [
      "Multidimensional poverty measurement scores households across health, education, and living standards, capturing overlapping deprivation that an income line alone can miss.",
      "The Global Multidimensional Poverty Index, built by Oxford's OPHI and the UNDP since 2010, uses ten indicators across three equally weighted dimensions to determine whether a household counts as poor.",
      "The most recent Global MPI reports find roughly 1.1 billion people, about 18.3% of the population across 112 countries, living in acute multidimensional poverty.",
      "Sub-Saharan Africa and South Asia together account for roughly 83% of the world's multidimensionally poor, and nearly two-thirds live in middle-income, not the poorest, countries.",
      "Children make up more than half (584 million) of the multidimensionally poor, rural residents make up roughly 84%, and about 40% live in countries facing violent conflict or fragility."
    ],
    articleTitle: 'The Index That Counts What a Bank Balance Can\'t',
    articleText: `**Who built the Global Multidimensional Poverty Index, and what does it actually measure?**
The Oxford Poverty and Human Development Initiative, working with the United Nations Development Programme, launched the Global MPI in 2010. It scores each household across ten specific indicators, grouped into three equally weighted dimensions: health (nutrition and child mortality), education (years of schooling and school attendance), and living standards (cooking fuel, sanitation, drinking water, electricity, housing, and assets). A household counted as multidimensionally poor isn't merely missing one of these; it's deprived across enough of them, weighted together, to cross a defined threshold — capturing overlapping hardship rather than any single missing item on its own.

**How many people does the index currently count as poor, and how does that compare to income-based counts?**
The most recent global MPI reports find that roughly 1.1 billion people — about 18.3% of the population across the 112 countries measured — live in acute multidimensional poverty. That figure sits alongside, but doesn't simply duplicate, the World Bank's income-based extreme poverty count; the two measures overlap substantially but not completely, since a household can clear a monetary poverty line while still lacking electricity, sanitation, or a child's full course of schooling, or fall below it while still meeting several of the index's other conditions.

**Who bears the largest share of this measured poverty, geographically?**
Overwhelmingly, two regions carry the weight: Sub-Saharan Africa and South Asia together account for roughly 83% of the world's multidimensionally poor, with 522 million people in Sub-Saharan Africa and 402 million in South Asia. Nearly two-thirds of all multidimensionally poor people, meanwhile, live in middle-income countries rather than the poorest, low-income ones — a reminder that a rising national average income doesn't automatically clear away the specific, overlapping deprivations the index is built to catch.

**Which age group carries a disproportionate share of this poverty?**
Children. More than half of the 1.1 billion people counted as multidimensionally poor — 584 million — are under the age of 18, and globally, close to 30% of all children live in poverty by this measure, compared with roughly 13.5% of adults. A poverty measure built around health, schooling, and living conditions inevitably concentrates on children, since missed vaccinations, interrupted schooling, and childhood malnutrition compound over an entire lifetime in ways an adult's temporary income shortfall often does not.

**Does this kind of poverty look different in rural areas than in cities?**
Sharply so. Across virtually every region measured, people in rural areas are poorer by this index than people in urban areas in the same country, and globally, roughly 84% of the multidimensionally poor live in rural communities. The gap echoes a pattern this course has already traced through China's hukou system: income poverty lines can sometimes mask how much a rural household's day-to-day deprivation in health, schooling, and basic services outpaces an income comparison alone.

**Does conflict change the picture, and if so, how much?**
Substantially. Roughly 40% of the world's multidimensionally poor — some 455 million people — live in countries experiencing violent conflict, war, or fragility, according to the most recent report pairing MPI data with independent conflict and peacefulness datasets. Poverty and conflict don't simply coexist in these places; they actively reinforce each other, since conflict destroys the schools, clinics, and infrastructure the index measures, while the resulting deprivation makes recovery and stability harder to sustain once fighting eventually stops.`,
    articleSummary: `The Global Multidimensional Poverty Index, built by Oxford's OPHI and the UNDP since 2010, finds roughly 1.1 billion people across 112 countries living in acute poverty, with Sub-Saharan Africa and South Asia accounting for 83% of that total. Children make up more than half of the poor, rural residents make up roughly 84%, and about 40% live in countries facing violent conflict.`,
    articleTakeaways: [
      "Multidimensional poverty measurement scores households across health, education, and living standards, capturing overlapping deprivation that an income line alone can miss.",
      "The Global Multidimensional Poverty Index, built by Oxford's OPHI and the UNDP since 2010, uses ten indicators across three equally weighted dimensions to determine whether a household counts as poor.",
      "The most recent Global MPI reports find roughly 1.1 billion people, about 18.3% of the population across 112 countries, living in acute multidimensional poverty.",
      "Sub-Saharan Africa and South Asia together account for roughly 83% of the world's multidimensionally poor, and nearly two-thirds live in middle-income, not the poorest, countries.",
      "Children make up more than half (584 million) of the multidimensionally poor, rural residents make up roughly 84%, and about 40% live in countries facing violent conflict or fragility."
    ]
  };

  if (lesson) {
    lesson = await prisma.lesson.update({
      where: { id: lesson.id },
      data: lessonData
    });
    console.log(`Successfully updated Lesson for Day \${dayOrder}: \${lesson.title}`);
  } else {
    lesson = await prisma.lesson.create({
      data: lessonData
    });
    console.log(`Successfully created Lesson for Day \${dayOrder}: \${lesson.title}`);
  }

  // 2. UPDATE OR CREATE QUIZ
  let quiz = await prisma.quiz.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  if (!quiz) {
    console.log(`Quiz for Day \${dayOrder} not found! Creating...`);
    quiz = await prisma.quiz.create({
      data: {
        track: track,
        dayOrder: dayOrder,
        title: "Quiz",
        tag: track,
        timeEstimate: 5
      }
    });
  }

  if (quiz) {
    // Delete existing questions
    await prisma.quizQuestion.deleteMany({
      where: { quizId: quiz.id }
    });

    const questions = [
      {
        questionText: "What does multidimensional poverty measurement assess, beyond income alone?",
        options: [
          "Only a household's total bank balance",
          "Health, education, and living standards indicators, in addition to income-based measures",
          "Only a country's total GDP",
          "Only a household's access to credit"
        ],
        correctAnswer: "Health, education, and living standards indicators, in addition to income-based measures",
        explanation: "- A) Wrong — the lesson explicitly contrasts multidimensional measurement with a sole focus on money-based measures like a bank balance.\\n- B) Correct — it assesses overlapping deprivations across health, education, and living standards.\\n- C) Wrong — GDP is a national aggregate figure, not the household-level indicators the index actually measures.\\n- D) Wrong — access to credit is not among the specific indicators described in the lesson."
      },
      {
        questionText: "Which two organizations jointly built the Global Multidimensional Poverty Index, according to the lesson?",
        options: [
          "The World Bank and the International Monetary Fund",
          "Oxford's Poverty and Human Development Initiative and the United Nations Development Programme",
          "The World Health Organization and UNESCO",
          "A single national government acting alone"
        ],
        correctAnswer: "Oxford's Poverty and Human Development Initiative and the United Nations Development Programme",
        explanation: "- A) Wrong — these organizations are not identified in the lesson as the index's creators.\\n- B) Correct — OPHI at Oxford and the UNDP partnered to create the MPI.\\n- C) Wrong — these organizations are not identified in the lesson as the index's creators.\\n- D) Wrong — the lesson explicitly describes a joint effort between two international organizations, not a single national government."
      },
      {
        questionText: "According to the lesson, approximately how many people does the most recent Global MPI report count as living in acute multidimensional poverty?",
        options: [
          "About 100 million",
          "About 1.1 billion",
          "About 6.3 billion",
          "The entire global population"
        ],
        correctAnswer: "About 1.1 billion",
        explanation: "- A) Wrong — this drastically understates the figure given in the lesson.\\n- B) Correct — the report found roughly 1.1 billion people living in acute multidimensional poverty.\\n- C) Wrong — 6.3 billion is the total population of the countries covered by the index, not the number counted as poor.\\n- D) Wrong — the lesson describes a specific subset of the global population, not everyone."
      },
      {
        questionText: "According to the lesson, what share of the world's multidimensionally poor live in Sub-Saharan Africa and South Asia combined?",
        options: [
          "About 10%",
          "About 50%",
          "About 83%",
          "100%"
        ],
        correctAnswer: "About 83%",
        explanation: "- A) Wrong — this drastically understates the concentration described in the lesson.\\n- B) Wrong — this also understates the combined share given in the lesson.\\n- C) Correct — the two regions combined account for approximately 83% of the multidimensionally poor.\\n- D) Wrong — the lesson describes other regions as accounting for the remaining share, not zero."
      },
      {
        questionText: "What share of the world's multidimensionally poor are children under 18, according to the lesson?",
        options: [
          "Less than 5%",
          "About 25%",
          "More than half",
          "None; the index only measures adults"
        ],
        correctAnswer: "More than half",
        explanation: "- A) Wrong — this drastically understates the share described in the lesson.\\n- B) Wrong — this also understates the figure given in the lesson.\\n- C) Correct — more than half (584 million) are children under 18.\\n- D) Wrong — the lesson explicitly states children make up more than half of those counted, contradicting this option."
      },
      {
        questionText: "According to the lesson, what share of the world's multidimensionally poor live in rural areas?",
        options: [
          "About 10%",
          "About 50%",
          "Roughly 84%",
          "0%, since the index only measures urban poverty"
        ],
        correctAnswer: "Roughly 84%",
        explanation: "- A) Wrong — this drastically understates the share described in the lesson.\\n- B) Wrong — this also understates the figure given in the lesson.\\n- C) Correct — roughly 84% of those in multidimensional poverty live in rural settings.\\n- D) Wrong — the lesson explicitly measures both rural and urban poverty, with rural residents making up the large majority."
      },
      {
        questionText: "(Scenario) A country's official statistics show declining income poverty rates, but a multidimensional poverty assessment shows only a small improvement over the same period. Based on the lesson, what is the most defensible explanation for this discrepancy?",
        options: [
          "The two measures always move in perfectly identical ways, so no discrepancy is possible",
          "Households may be crossing the income poverty line while still lacking adequate health, education, or living-standard conditions the multidimensional index also tracks",
          "The multidimensional index is measuring a completely unrelated country",
          "Income poverty and multidimensional poverty can never differ for any household"
        ],
        correctAnswer: "Households may be crossing the income poverty line while still lacking adequate health, education, or living-standard conditions the multidimensional index also tracks",
        explanation: "- A) Wrong — the lesson explicitly notes the two measures overlap substantially but not completely, allowing for exactly this kind of discrepancy.\\n- B) Correct — rising above a monetary line does not automatically provide access to electricity, sanitation, or schooling, allowing the two measures to diverge.\\n- C) Wrong — the scenario describes measurements of the same country, not an unrelated one.\\n- D) Wrong — the lesson's own example of a family clearing an income line while lacking sanitation and schooling directly contradicts this."
      },
      {
        questionText: "(Scenario) An aid organization has limited resources and must choose between funding programs in urban or rural regions of a country with patterns matching the lesson's global averages. Based on the lesson, which region is more likely to show a higher concentration of multidimensional poverty?",
        options: [
          "Urban regions, since cities always have higher poverty rates",
          "Rural regions, based on the lesson's finding that roughly 84% of the multidimensionally poor live in rural areas globally",
          "Both regions would show identical poverty concentrations",
          "Neither region would show any measurable poverty under this index"
        ],
        correctAnswer: "Rural regions, based on the lesson's finding that roughly 84% of the multidimensionally poor live in rural areas globally",
        explanation: "- A) Wrong — this contradicts the lesson's explicit finding that rural areas carry the much larger share of multidimensional poverty.\\n- B) Correct — the lesson emphasizes that poverty concentrates heavily in rural areas globally under this measure.\\n- C) Wrong — the lesson describes a sharp, not identical, difference between rural and urban poverty rates.\\n- D) Wrong — the lesson describes substantial measured poverty in both settings, with rural areas showing a larger share."
      },
      {
        questionText: "(Logical) Why does the lesson argue that children make up a disproportionate share of multidimensional poverty specifically, rather than income poverty generally?",
        options: [
          "Because children are never counted in any poverty measurement",
          "Because a measure built around health, schooling, and living conditions naturally concentrates on children, whose missed vaccinations and interrupted schooling compound over a lifetime",
          "Because children always earn less income than adults, which is the only factor the index measures",
          "Because the index specifically excludes all adults from its measurements"
        ],
        correctAnswer: "Because a measure built around health, schooling, and living conditions naturally concentrates on children, whose missed vaccinations and interrupted schooling compound over a lifetime",
        explanation: "- A) Wrong — the lesson explicitly provides specific figures for children counted within the index.\\n- B) Correct — children are especially vulnerable to deprivations in health and schooling because those missed investments compound early in their development.\\n- C) Wrong — the index measures health, education, and living standards, not personal income by age group.\\n- D) Wrong — the lesson explicitly compares child and adult poverty rates, showing adults are measured as well."
      },
      {
        questionText: "(Hard/Logical, cross-comparison) Based on the lesson, what is the most defensible explanation for why nearly 40% of the world's multidimensionally poor live in countries facing violent conflict, given the index's specific indicators?",
        options: [
          "Conflict has no measurable relationship to any of the index's ten indicators",
          "Conflict tends to destroy the schools, clinics, and infrastructure the index measures directly, while resulting deprivation makes recovery harder, reinforcing the relationship",
          "The index specifically excludes any country experiencing conflict from its measurements",
          "Conflict only affects a country's currency exchange rate, unrelated to poverty measurement"
        ],
        correctAnswer: "Conflict tends to destroy the schools, clinics, and infrastructure the index measures directly, while resulting deprivation makes recovery harder, reinforcing the relationship",
        explanation: "- A) Wrong — the lesson explicitly connects conflict's destruction of schools and clinics to the index's education and living-standard indicators.\\n- B) Correct — conflict directly destroys the assets and infrastructure the MPI measures, creating a reinforcing cycle of deprivation and fragility.\\n- C) Wrong — the lesson explicitly reports poverty figures specifically for countries experiencing conflict, meaning they are included, not excluded.\\n- D) Wrong — the lesson ties conflict to real deprivation in health, education, and living standards, not to currency markets."
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
  } else {
    console.log(`Quiz for Day \${dayOrder} failed to create or load!`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
