import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 8;
  const track = "DEVELOPMENT_ECONOMICS";
  console.log(`Starting update for Day \${dayOrder} (\${track})...`);

  // 1. UPDATE LESSON
  const lesson = await prisma.lesson.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  if (lesson) {
    const updatedLesson = await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: 'How Economies Grow Over Time',
        conceptText: `By 1968, Japan's economy had overtaken every country in the world except the United States, becoming the second largest on Earth. Twenty-three years earlier, the same country had surrendered amid rubble, with most of its industrial base bombed into wreckage and its currency nearly worthless.

Economist Robert Solow, whose work later earned a Nobel Memorial Prize in 1987, built a model to explain exactly this kind of transformation. Output, Solow argued, comes from three sources: capital, meaning machines, factories, and infrastructure; labor, meaning the size and hours of the workforce; and a residual — everything growth cannot be traced back to capital or labor alone, which economists now call total factor productivity. Pour enough capital into an economy with few machines already in place, and output surges, because each new factory adds enormous value against a nearly empty backdrop.

*A country can't build its way past its own arithmetic.*

But Solow's model carries a warning inside its logic: capital runs into diminishing returns. The tenth factory in a country doesn't add as much output as the first one did, because the first one had no competition for workers, land, or existing infrastructure to slot into. Eventually, a growth model built purely on adding capital has to slow down, unless something else — productivity, ideas, technology — starts carrying more of the weight. The article ahead follows Japan through both halves of that story: the astonishing climb, and the arithmetic catching up.`,
        conceptSummary: `Robert Solow's growth model, which contributed to a 1987 Nobel Memorial Prize, explains output through capital, labor, and a residual called total factor productivity. Capital investment drives rapid early growth when factories and infrastructure are scarce, but runs into diminishing returns as an economy fills up — meaning long-run growth eventually depends on productivity gains, not just adding more machines.`,
        conceptTakeaways: [
          "The Solow growth model attributes output to three sources: capital, labor, and a residual economists call total factor productivity.",
          "Capital investment produces its largest gains when an economy has relatively little capital to begin with, and smaller gains as more capital accumulates — diminishing returns."
        ],
        articleTitle: 'Twenty-Three Years From Rubble to Runner-Up',
        articleText: `From 1955 to 1973, Japan's real economy grew at close to 10% a year, a pace so sustained that GNP roughly quadrupled between 1958 and 1973 alone. Historians call it the Japanese economic miracle, but the mechanics behind it were less mysterious than the name suggests, and they map almost exactly onto Solow's three ingredients.

Capital came first, and it came fast. Gross investment climbed to roughly 30–35% of GNP by 1970 — nearly double the investment rate of the United States at the time — funded overwhelmingly by Japanese households themselves, who saved an average of 18% or more of their disposable income through the 1960s, channeling it through banks and postal savings accounts into corporate borrowing with little need for foreign capital. Labor supplied the second ingredient: the workforce grew at 1.8% a year between 1955 and 1970, nearly twice the pace of labor growth in the U.S. at the time, as workers streamed out of agriculture and into factories.

*A country can't build its way past its own arithmetic.*

The third ingredient, productivity, had an unusual head start. Japan wasn't inventing new frontier technology in these decades so much as importing and refining it — licensing foreign processes, adapting them with relentless incremental improvement, and squeezing more output from every yen of capital and every hour of labor than a purely mechanical capital count would predict. The Korean War, from 1950 to 1953, added an early jolt: the U.S. military procured enormous volumes of supplies from Japanese industry, giving manufacturers a paying customer before their own domestic market had fully recovered.

None of this defied Solow's model. It confirmed it, and then confirmed its warning too. By 1970, Japan's investment rate peaked; by 1985, it had fallen to 27% of GDP as the easy, high-return opportunities for new capital thinned out, exactly as diminishing returns would predict once a country's factories and infrastructure stop being scarce. Labor force growth told the same story: nearly 2% a year through the 1960s, falling to about a third of that by 1985, and shrinking outright by 1996. Growth held up reasonably well through the 1970s and 1980s regardless, cushioned partly by continued productivity gains — but the double-digit years were over the moment capital and labor stopped expanding at their old astonishing pace.

There is a broader implication buried in Japan's numbers, one Solow's model makes explicit: a poor country with little capital can often grow faster than a rich one, for a while, simply because it has more room to fill before diminishing returns bite. That implication would later get its own name in economic theory — convergence — and its own long list of exceptions, some of which grew rich exactly as Japan did, and some of which never caught up at all. Japan's own case sits closer to the successful end of that spectrum, but even its success ran on a clock the model had already written out in advance.

The final chapter arrived on schedule, in the model's own terms if not its timing. Japan's finance-fueled bubble collapsed at the end of 1990, and real GDP growth fell to roughly 1% a year from 1991 to 2002 — a stall so severe that economists still call it Japan's Lost Decade. The country that once quadrupled its output in fifteen years spent the next decade barely growing at all, not because Solow's model had failed, but because it had finished doing exactly what it predicted: an economy can accumulate its way to astonishing growth for a while, but it cannot accumulate its way out of the arithmetic waiting on the other side.`,
        articleSummary: `Japan's economy grew near 10% annually from 1955 to 1973, fueled by investment reaching 30–35% of GNP, an 18%+ household savings rate, and 1.8% annual labor force growth. By the 1980s, investment and labor growth had both slowed, exactly as diminishing returns would predict, and growth fell to roughly 1% a year after the 1990s bubble collapsed.`,
        articleTakeaways: [
          "Japan's real GNP grew close to 10% annually from 1955 to 1973, with investment reaching 30–35% of GNP and household savings rates above 18%.",
          "Japan's labor force grew 1.8% annually between 1955 and 1970, nearly double the U.S. rate at the time, before slowing sharply by the mid-1980s and shrinking by 1996.",
          "Japan's investment rate fell from a peak of 35% of GDP (1970) to 27% (1985), and growth slowed to roughly 1% annually after the 1990s bubble collapse — consistent with the diminishing returns Solow's model predicts."
        ],
      }
    });
    console.log(`Successfully updated Lesson for Day \${dayOrder}: \${updatedLesson.title}`);
  } else {
    console.log(`Lesson for Day \${dayOrder} not found!`);
  }

  // 2. UPDATE QUIZ
  const quiz = await prisma.quiz.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

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
    console.log(`Quiz for Day \${dayOrder} not found!`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
