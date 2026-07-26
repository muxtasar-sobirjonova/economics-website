import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 8;
  const track = "DEVELOPMENT_ECONOMICS";
  console.log(`Starting quiz update for Day \${dayOrder} (\${track})...`);

  // 1. UPDATE OR CREATE QUIZ
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
        questionText: "According to the Solow growth model, what are the three sources of economic output?",
        options: [
          "Exports, imports, and government spending",
          "Capital, labor, and a residual called total factor productivity",
          "Interest rates, inflation, and unemployment",
          "Population size, land area, and natural resources"
        ],
        correctAnswer: "Capital, labor, and a residual called total factor productivity",
        explanation: "- a) Wrong — these are components of trade and fiscal policy, not the Solow model's core growth inputs.\\n- c) Wrong — these are macroeconomic indicators, not the specific inputs Solow's model attributes output to.\\n- d) Wrong — the Solow model centers on capital, labor, and productivity, not fixed physical endowments."
      },
      {
        questionText: "What does \"diminishing returns to capital\" mean in the context of the Solow model?",
        options: [
          "Each additional unit of capital produces more output than the last",
          "Each additional unit of capital tends to produce less additional output than the units before it, as capital accumulates",
          "Capital investment always produces exactly the same output gain, regardless of how much already exists",
          "Capital has no effect on economic output at any level"
        ],
        correctAnswer: "Each additional unit of capital tends to produce less additional output than the units before it, as capital accumulates",
        explanation: "- a) Wrong — this reverses the concept; returns diminish rather than increase as capital accumulates.\\n- c) Wrong — the model specifically predicts a changing, declining marginal gain, not a constant one.\\n- d) Wrong — the model treats capital as a major driver of output, especially early in an economy's development."
      },
      {
        questionText: "Why did Japan's investment rate reaching 30–35% of GNP by 1970 fuel such rapid growth?",
        options: [
          "Because Japan had almost no capital to begin with after wartime destruction, so early investment produced outsized returns",
          "Because the investment was entirely funded by foreign governments",
          "Because Japan's population was shrinking rapidly at the time",
          "Because interest rates in Japan were negative throughout this period"
        ],
        correctAnswer: "Because Japan had almost no capital to begin with after wartime destruction, so early investment produced outsized returns",
        explanation: "- b) Wrong — the lesson describes this investment as funded primarily by Japanese households' own savings, not foreign governments.\\n- c) Wrong — the lesson describes labor force growth of 1.8% annually during this period, not a shrinking population.\\n- d) Wrong — no claim about negative interest rates appears in the lesson."
      },
      {
        questionText: "What role did the Korean War (1950-1953) play in Japan's early postwar recovery, according to the lesson?",
        options: [
          "It devastated Japan's remaining industrial base further",
          "U.S. military procurement of supplies from Japanese industry provided an early paying customer before Japan's domestic market fully recovered",
          "It caused Japan's labor force to decline sharply",
          "It ended American occupation of Japan immediately"
        ],
        correctAnswer: "U.S. military procurement of supplies from Japanese industry provided an early paying customer before Japan's domestic market fully recovered",
        explanation: "- a) Wrong — the lesson describes the war as providing an economic boost to Japanese industry, not further devastation.\\n- c) Wrong — no claim about labor force decline during this period is made; the lesson describes labor force growth in this era.\\n- d) Wrong — the war's economic role, not the end of occupation, is the point made in the lesson."
      },
      {
        questionText: "According to the lesson, what happened to Japan's investment rate between 1970 and 1985?",
        options: [
          "It rose steadily from 35% to over 50% of GDP",
          "It fell from a peak of 35% of GDP to 27%",
          "It remained completely unchanged",
          "It dropped to zero"
        ],
        correctAnswer: "It fell from a peak of 35% of GDP to 27%",
        explanation: "- a) Wrong — this reverses the actual trend described, which was a decline, not a rise.\\n- c) Wrong — the lesson explicitly describes a substantial decline, not stability.\\n- d) Wrong — a drop to 27% is a decline, but far from zero."
      },
      {
        questionText: "Why does the lesson describe Japan's slowing investment and labor force growth after 1970 as confirming the Solow model, rather than contradicting it?",
        options: [
          "Because the model predicts investment should always keep rising indefinitely",
          "Because the model predicts that returns to capital and labor diminish as an economy accumulates more of each, which matches the observed slowdown",
          "Because the model has nothing to say about labor force growth",
          "Because the slowdown was entirely unrelated to capital or labor"
        ],
        correctAnswer: "Because the model predicts that returns to capital and labor diminish as an economy accumulates more of each, which matches the observed slowdown",
        explanation: "- a) Wrong — the model does not predict indefinite, ever-rising investment; it predicts diminishing returns as capital accumulates.\\n- c) Wrong — labor is one of the model's three core inputs, directly relevant to its predictions.\\n- d) Wrong — the lesson directly attributes the slowdown to changes in capital and labor growth rates."
      },
      {
        questionText: "A country with almost no existing factories or infrastructure receives a large influx of foreign investment. Based on the Solow model, what would you most expect in the short term?",
        options: [
          "Little to no change in output, since capital doesn't affect growth",
          "A relatively large boost to output, since capital is scarce and each new unit adds significant value",
          "An immediate decline in output",
          "A change only in labor force size, with no effect on capital-driven output"
        ],
        correctAnswer: "A relatively large boost to output, since capital is scarce and each new unit adds significant value",
        explanation: "- a) Wrong — the model treats capital as a major growth driver, especially when capital is initially scarce.\\n- c) Wrong — the model predicts a boost to output from new capital, not a decline.\\n- d) Wrong — the scenario specifically concerns capital investment, which the model treats as directly affecting output."
      },
      {
        questionText: "A well-developed economy with abundant existing factories and infrastructure adds the same dollar amount of new investment as a much less developed economy. Based on the Solow model, what would you expect?",
        options: [
          "Both economies see identical output gains",
          "The less developed economy sees a smaller output gain, since it already lacks capital",
          "The more developed economy sees a smaller additional output gain, due to diminishing returns on its already-large capital base",
          "Neither economy's output changes at all"
        ],
        correctAnswer: "The more developed economy sees a smaller additional output gain, due to diminishing returns on its already-large capital base",
        explanation: "- a) Wrong — the model predicts different gains depending on how much capital already exists, not identical gains.\\n- b) Wrong — this reverses the model's prediction; the less developed economy, with less existing capital, should see the larger gain.\\n- d) Wrong — the model treats new capital investment as affecting output in both cases, just to different degrees."
      },
      {
        questionText: "Based on the lesson, why couldn't Japan's high-growth strategy of the 1950s and 1960s simply continue indefinitely at the same pace?",
        options: [
          "Because Japan ran out of workers entirely by 1960",
          "Because capital and labor growth eventually slow as an economy fills up with factories and workers, triggering diminishing returns on further accumulation",
          "Because the Korean War never ended",
          "Because Japan's government banned further industrial investment after 1970"
        ],
        correctAnswer: "Because capital and labor growth eventually slow as an economy fills up with factories and workers, triggering diminishing returns on further accumulation",
        explanation: "- a) Wrong — the lesson describes a gradual slowdown in labor force growth over decades, not a sudden halt by 1960.\\n- c) Wrong — the Korean War ended in 1953, well before the growth slowdown described in the lesson.\\n- d) Wrong — no such investment ban is described in the lesson; investment declined gradually due to diminishing returns, not policy prohibition."
      },
      {
        questionText: "An economist wants to predict which of two countries will sustain rapid growth longer: Country A, which has very little existing capital and a young, growing workforce, or Country B, which already has extensive infrastructure and a stable workforce. Based on the Solow model, what is the most defensible prediction?",
        options: [
          "Country B will grow faster, since existing infrastructure guarantees continued high returns",
          "Country A is likely to see faster growth from capital investment in the near term, since it starts from a lower capital base with more room before diminishing returns set in",
          "Both countries will grow at identical rates regardless of their starting capital levels",
          "Growth rates depend entirely on population size and nothing else"
        ],
        correctAnswer: "Country A is likely to see faster growth from capital investment in the near term, since it starts from a lower capital base with more room before diminishing returns set in",
        explanation: "- a) Wrong — the model predicts the opposite; abundant existing capital means new investment faces steeper diminishing returns, not guaranteed high returns.\\n- c) Wrong — the model predicts different growth trajectories specifically based on differing starting levels of capital.\\n- d) Wrong — the model attributes growth to capital and productivity as well as labor, not population size alone."
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
