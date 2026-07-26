import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 15;
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
    title: 'How Unequal Is Too Unequal?',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `The top 20% of South African households control close to 70% of the country's income. The bottom 10% share a fraction of a single percentage point between them. In 2015, the World Bank measured South Africa's Gini coefficient at 0.63 — the highest figure recorded for any of the 164 countries in its global database.

Italian statistician Corrado Gini devised the measure in 1912 to compress an entire nation's income distribution into a single number between 0 and 1. Zero means everyone earns exactly the same; 1 means one person holds all the income and everyone else holds none. In practice, most countries land somewhere between 0.25 and 0.45 — Scandinavian countries cluster near the bottom of that range, the United States sits around 0.41, and a shrinking handful of countries, almost all in southern Africa and Latin America, sit well above 0.5.

*A number that low means nothing bought it. A number that high means something enforced it.*

A Gini coefficient rarely climbs to South African levels by accident. It requires a structural cause holding the distribution in place year after year, decade after decade — not a temporary shock a good year of growth might undo on its own. The article ahead follows that number back to its source.`,
    conceptSummary: `The Gini coefficient, devised by Italian statistician Corrado Gini in 1912, compresses a country's entire income distribution into one number between 0 (perfect equality) and 1 (total inequality). Most countries fall between 0.25 and 0.45; a small number of countries, led by South Africa, sit well above 0.5 — a level that typically signals a deep structural cause rather than a temporary economic shock.`,
    conceptTakeaways: [
      "The Gini coefficient, created by Corrado Gini in 1912, measures income distribution on a scale from 0 (perfect equality) to 1 (total inequality).",
      "South Africa's Gini coefficient of roughly 0.63-0.68 is the highest recorded in the World Bank's global database of over 160 countries."
    ],
    articleTitle: 'The Highest Number in the World Bank\'s Database',
    articleText: `**Why hasn't the end of apartheid erased South Africa's extreme inequality?**
South Africa's Gini coefficient hasn't just been high for one measurement cycle — it has stayed high for as long as anyone has tracked it, and it has barely moved even as the political system built around it changed entirely. Between 2008 and 2018, more than two decades after the end of apartheid, the coefficient fell only from 0.68 to 0.67, a decline of roughly two-hundredths of a point per year. At that pace, closing even a third of the remaining gap to an average upper-middle-income country would take generations.

**How does a historical system continue to dictate modern economic outcomes?**
The mechanism behind the number is not mysterious, even if reversing it has proven difficult. Apartheid, the system of legal racial segregation that governed South Africa until 1994, systematically restricted where Black South Africans could live, own land, receive an education, and hold skilled jobs. Three decades of land restitution and redistribution programs since then have made only limited progress against that starting position, and access to skilled employment and land ownership remains severely uneven along largely the same lines apartheid drew.

**Why is it so hard to break the cycle of inequality across generations?**
Inequality specialists studying the country point to two separate but reinforcing causes: unequal opportunity from birth — the schools, neighborhoods, and networks a person is born into — and unequal outcomes in the labor and land markets that opportunity feeds into. A person born into an under-resourced school system is mathematically far less likely to reach the highest-paying tiers of the formal labor market. This means the inequality of one generation automatically becomes the starting baseline for the next.

**Can government spending alone fix the world's most unequal region?**
South Africa is not an isolated case regionally; it sits inside the Southern African Customs Union alongside Namibia, Botswana, and Eswatini, making the bloc the most unequal region measured anywhere in the world. But South Africa still tops even that company. Government transfers and social spending do real, measurable work against this baseline. Without them, South Africa's inequality would run roughly 20 Gini points higher still, which is one of the largest redistributive effects any tax-and-transfer system produces anywhere. That fiscal effort holds the line, but it hasn't yet moved it.

**What can a country like Brazil teach us about deliberate inequality reduction?**
The comparison to Brazil is instructive precisely because Brazil shows the alternative is possible. Both countries carry a heavy legacy of racial and colonial history bearing on land and opportunity, and both post Gini coefficients well above the global norm. But Brazil's coefficient fell from 59.3 in 2001 to 53.1 in 2011 — a meaningfully faster pace of decline than South Africa managed over a comparable stretch. The difference isn't that Brazil solved inequality; rather, its number moved deliberately through sustained policy choices, while South Africa's stayed essentially fixed in place despite comparable political attention.

**Are economic snapshots enough to distinguish between a bad year and a broken system?**
The persistence itself is the lesson. A Gini coefficient this high, sustained across a full generation and multiple changes in government, cannot be explained by a bad decade of growth or a single failed policy. It reflects inequality built into who owns land, who reaches skilled jobs, and who inherits which starting position at birth — structural features that a single election, or even three decades of elections, have so far proven far harder to unwind than they were to build in the first place. Measuring the number precisely, year after year, is what makes that structural distinction visible.`,
    articleSummary: `South Africa's Gini coefficient has held near 0.63-0.68 for decades, barely moving even after apartheid's end in 1994, with the top 20% of households holding nearly 70% of income. Government transfers reduce inequality by roughly 20 Gini points, yet unequal land ownership, education, and job access rooted in apartheid-era restrictions have kept the underlying number essentially unchanged across a full generation.`,
    articleTakeaways: [
      "South Africa's top 20% of households hold close to 70% of national income, while the bottom 10% hold less than 1%.",
      "Government transfers and social spending reduce South Africa's inequality by an estimated 20 Gini points, one of the largest redistributive effects of any country's tax-and-transfer system.",
      "A Gini coefficient this high and this persistent typically reflects structural causes — unequal land ownership, education, and job access — rather than a temporary economic downturn."
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
        questionText: "What does a Gini coefficient of 0 represent?",
        options: [
          "One person holds all of a country's income",
          "Perfect equality, where everyone earns exactly the same",
          "A country with no income at all",
          "A country with the world's highest inequality"
        ],
        correctAnswer: "Perfect equality, where everyone earns exactly the same",
        explanation: "- a) Wrong — this describes a Gini coefficient of 1, the opposite extreme.\\n- c) Wrong — the Gini coefficient measures distribution, not the total amount of income in an economy.\\n- d) Wrong — this describes a very high, not a zero, Gini coefficient."
      },
      {
        questionText: "According to the lesson, approximately what was South Africa's Gini coefficient in 2015, as measured by the World Bank?",
        options: [
          "0.25",
          "0.41",
          "0.63",
          "1.00"
        ],
        correctAnswer: "0.63",
        explanation: "- a) Wrong — this figure is closer to some of the world's most equal countries, not South Africa.\\n- b) Wrong — 0.41 is the figure the lesson attributes to the United States, not South Africa.\\n- d) Wrong — a Gini coefficient of 1.00 would mean one person holds all income, more extreme than any real recorded figure."
      },
      {
        questionText: "What share of South Africa's income does the top 20% of households hold, according to the lesson?",
        options: [
          "About 20%",
          "About 47%",
          "Close to 70%",
          "100%"
        ],
        correctAnswer: "Close to 70%",
        explanation: "- a) Wrong — this would reflect a proportional, equal share, not the concentration described in the lesson.\\n- b) Wrong — 47% is described in the lesson as the median share held by the top 20% in most other countries, not South Africa.\\n- d) Wrong — the lesson describes a very high concentration, but not the complete absence of income for everyone else."
      },
      {
        questionText: "How much did South Africa's Gini coefficient change between 2008 and 2018, according to the lesson?",
        options: [
          "It fell sharply, from 0.68 to below 0.40",
          "It fell only slightly, from 0.68 to 0.67",
          "It rose sharply during this period",
          "It remained at exactly 1.00 throughout"
        ],
        correctAnswer: "It fell only slightly, from 0.68 to 0.67",
        explanation: "- a) Wrong — this drastically overstates the small decline the lesson actually describes.\\n- c) Wrong — the lesson describes a slight decline, not a rise, over this period.\\n- d) Wrong — a Gini coefficient of 1.00 would represent total inequality, far more extreme than the figures given."
      },
      {
        questionText: "According to the lesson, roughly how much would South Africa's inequality be higher without government transfers and social spending?",
        options: [
          "About 2 Gini points higher",
          "About 20 Gini points higher",
          "It would be completely unaffected either way",
          "It would actually be lower without transfers"
        ],
        correctAnswer: "About 20 Gini points higher",
        explanation: "- a) Wrong — this understates the redistributive effect the lesson attributes to fiscal transfers.\\n- c) Wrong — the lesson explicitly credits transfers with a substantial, measurable effect on inequality.\\n- d) Wrong — this reverses the direction of the effect; transfers reduce, rather than increase, measured inequality."
      },
      {
        questionText: "Which historical system does the lesson identify as a major structural cause of South Africa's persistent inequality?",
        options: [
          "A recent global financial crisis",
          "Apartheid-era restrictions on land ownership, education, and employment",
          "A sudden currency collapse in the 2010s",
          "A temporary drought affecting agricultural output"
        ],
        correctAnswer: "Apartheid-era restrictions on land ownership, education, and employment",
        explanation: "- a) Wrong — the lesson attributes the pattern to a decades-long structural legacy, not a recent financial shock.\\n- c) Wrong — no currency collapse is described as the cause of South Africa's inequality in the lesson.\\n- d) Wrong — a temporary drought would not explain the multi-decade persistence the lesson describes."
      },
      {
        questionText: "An analyst observes that Country X has a Gini coefficient of 0.66 that has remained essentially unchanged for 25 years, despite several changes in government. Based on the lesson's reasoning, what would be the most defensible interpretation?",
        options: [
          "The number is likely a temporary statistical error that will self-correct",
          "Such persistence usually points to a deep structural cause — such as unequal access to land, education, or jobs — rather than a short-term economic shock",
          "Gini coefficients cannot remain stable for more than a few years under any circumstances",
          "Government changes always resolve high inequality within a decade"
        ],
        correctAnswer: "Such persistence usually points to a deep structural cause — such as unequal access to land, education, or jobs — rather than a short-term economic shock",
        explanation: "- a) Wrong — the lesson treats sustained high inequality as a real, structurally rooted pattern, not a data artifact.\\n- c) Wrong — the lesson's own South African example directly demonstrates multi-decade persistence.\\n- d) Wrong — the lesson explicitly shows multiple government changes in South Africa without a corresponding sharp decline in inequality."
      },
      {
        questionText: "A policymaker wants to reduce a country's Gini coefficient meaningfully within a single decade. Based on the lesson, which approach is most directly supported as necessary, beyond fiscal transfers alone?",
        options: [
          "Relying solely on tax-and-transfer programs, since these are described as sufficient on their own to close a large inequality gap",
          "Addressing underlying structural barriers to land, education, and job access, since transfers alone held South Africa's inequality steady rather than substantially reducing it",
          "Waiting for economic growth alone to resolve inequality with no policy intervention",
          "Reducing the country's population size"
        ],
        correctAnswer: "Addressing underlying structural barriers to land, education, and job access, since transfers alone held South Africa's inequality steady rather than substantially reducing it",
        explanation: "- a) Wrong — the lesson explicitly shows transfers held inequality roughly steady rather than substantially reducing it over decades.\\n- c) Wrong — the lesson does not attribute inequality reduction to growth alone, absent structural change.\\n- d) Wrong — population size is not identified as a relevant lever in the lesson's analysis."
      },
      {
        questionText: "Why does the lesson describe a persistently high Gini coefficient as different from a \"temporary shock\" a good year of growth might undo?",
        options: [
          "Because temporary shocks always produce higher Gini coefficients than structural causes",
          "Because a shock-driven spike in inequality would be expected to fade as conditions normalize, while a structural cause continues reproducing the same distribution regardless of yearly conditions",
          "Because Gini coefficients cannot be affected by economic growth under any circumstances",
          "Because temporary shocks and structural causes always produce identical statistical patterns"
        ],
        correctAnswer: "Because a shock-driven spike in inequality would be expected to fade as conditions normalize, while a structural cause continues reproducing the same distribution regardless of yearly conditions",
        explanation: "- a) Wrong — the lesson doesn't compare the relative size of shocks versus structural effects, only their persistence over time.\\n- c) Wrong — the lesson explicitly discusses growth and fiscal policy as forces that interact with the Gini coefficient.\\n- d) Wrong — the lesson's central point is that these two causes produce different patterns over time — persistence versus fading — not identical ones."
      },
      {
        questionText: "South Africa's Gini coefficient exceeds every other country in the Southern African Customs Union, a bloc already identified as the most unequal region in the world. What does this comparison suggest about the specific factors behind South Africa's inequality, beyond whatever regional factors it shares with its neighbors?",
        options: [
          "South Africa's inequality is fully explained by regional factors common to the entire customs union, with nothing distinct about its own history",
          "South Africa likely has additional country-specific causes on top of shared regional factors, since it exceeds even its highly unequal neighbors",
          "South Africa's inequality figure must be a measurement error, since no country should exceed its regional peers",
          "The customs union membership itself is the sole cause of inequality in all five member countries equally"
        ],
        correctAnswer: "South Africa likely has additional country-specific causes on top of shared regional factors, since it exceeds even its highly unequal neighbors",
        explanation: "- a) Wrong — if regional factors alone explained the pattern, South Africa would be expected to resemble its neighbors' Gini levels more closely, not consistently exceed them.\\n- c) Wrong — the lesson presents this as a real, well-documented figure, not a data anomaly.\\n- d) Wrong — the lesson shows meaningful variation among customs union members, contradicting the idea that membership alone produces identical inequality levels."
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
