import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 16;
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
    title: 'Why Some People Stay Poor For Generations',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `In 1970, a person born in North Korea was, on average, richer than a person born in South Korea. The North's GDP per capita stood at roughly 325 dollars against the South's 260. By 2023, that relationship had inverted almost beyond recognition: North Korea's GDP per capita sat near 640 dollars, while South Korea's had reached 35,538 dollars — a gap of more than 50 times, between two populations that share a language, a peninsula, and, until 1948, a single economic history.

A poverty trap describes a situation where being poor itself makes it harder to stop being poor — not simply bad luck repeating, but a self-reinforcing cycle. Low income prevents investment in health, education, or infrastructure; the resulting low productivity then locks income in at the same low level the next year, and the year after that. Traps can operate on individual households, but they can also operate on entire economies, when institutions themselves — property rights, markets, the rules governing who gets to invest in what — actively prevent the accumulation that would otherwise break the cycle.

*The same soil grew two different harvests.*

Korea's division offers something close to a controlled experiment: identical starting geography, culture, and population split by a political border in 1948, then left to run for three-quarters of a century under two opposing economic systems. The article ahead follows what that experiment actually produced.`,
    conceptSummary: `A poverty trap describes a self-reinforcing cycle in which low income prevents the investment needed to raise future income, locking a household or an entire economy at the same low level year after year. At a national scale, poverty traps often stem from institutions — property rights, markets, price signals — that prevent productive investment from compounding rather than from any shortage of effort or ability.`,
    conceptTakeaways: [
      "A poverty trap is a self-reinforcing cycle where low income prevents the investment needed to raise future income, locking income at the same level repeatedly.",
      "In 1970, North Korea's GDP per capita (roughly $325) exceeded South Korea's ($260); by 2023, South Korea's GDP per capita ($35,538) exceeded North Korea's (roughly $640) by more than 50 times.",
      "South Korea and North Korea shared the same language, culture, and starting population after their 1948 division, isolating institutional choices as the primary driver of their diverging outcomes."
    ],
    articleTitle: 'The Line That Split One People Into Two Economies',
    articleText: `**How did two nations starting with the exact same advantages end up so completely unequal?**
For roughly the first two and a half decades after Korea's division, the standard economic accounts show North Korea holding a real, if modest, income advantage. Both economies rebuilt from the same 1950-53 war; both worked with a comparably wrecked industrial base; both drew on similar population and resource endowments. By some estimates, North Korea's early industrial sector may even have outpaced the South's growth into the 1970s, before that lead collapsed entirely.

**What happens when one country opens up and its neighbor slams the door shut?**
What followed the mid-1970s was not a gradual divergence but something closer to a hard fork. South Korea pursued export-oriented industrialization, private property rights, and integration with global markets and capital. This allowed firms like Samsung and Hyundai to compete for customers who owed the government nothing for the privilege. North Korea pursued near-total central planning, closed borders, and a self-reliance doctrine that cut the country off from the trade, foreign investment, and technology transfer fueling growth just across the border.

**Why does a bad economic system compound over time rather than just resetting?**
Each choice, year after year, compounded rather than reset. Capital that flowed into South Korean factories built infrastructure that attracted more capital the following year. In contrast, capital that North Korea's planners misallocated produced no comparable feedback loop. Prices, profits, and competition — the crucial signals that would normally redirect investment toward its most productive use — had been suppressed by design, meaning bad investments were repeated endlessly.

**Can a rigidly planned economy survive a real-world crisis?**
The consequences of a closed, centrally planned system compounded in ways that a single bad harvest never could. North Korea's Great Famine of the mid-to-late 1990s struck an urbanized, literate society during peacetime — a combination with almost no precedent in modern economic history. This tragedy reflected not a natural disaster alone, but a food-distribution and agricultural system that had completely lost the capacity to adjust when environmental conditions turned. By 1991, South Korea's GNP had already reached 237.9 billion dollars against North Korea's small fraction of that figure, a gap that kept widening.

**How does a factory without market prices destroy an entire nation's wealth?**
The mechanism worked the same way at every scale, from a single factory to an entire national ledger. In South Korea, a firm that built a competitive product could sell it abroad, reinvest the profit, and outcompete a less efficient domestic rival because prices carried real information about what the market actually valued. In North Korea, a factory's output was allocated by planners rather than sold at a market-clearing price. A poorly run plant and a well-run one could draw similar resources, distorting the entire economy over decades. Compounded across fifty years, it is the entire difference between a $640 economy and a $35,538 one.

**Is national poverty a failure of effort or a failure of the rules?**
None of this reflects a difference in the underlying people, culture, or starting resources — the whole point of the comparison is that those were held constant. What diverged were the institutions governing whether new investment could compound or would simply evaporate: functioning markets, secure property, and open trade in the South; centralized control, closed borders, and suppressed price signals in the North. A poverty trap, at the scale of an entire nation, isn't a country failing to try. It's a set of rules that keeps converting effort back into the same low output, year after year, until an external shock forces those rules to finally change.`,
    articleSummary: `North Korea held a real income edge over South Korea into the 1970s, but the gap reversed and widened until North Korea's 2023 GDP per capita of roughly 640 dollars stood against South Korea's 35,538 — a 50-fold gap between populations sharing one language, history, and peninsula. The divergence traces to institutions: open markets let investment compound in the South, while central planning suppressed the price signals that would have redirected it in the North.`,
    articleTakeaways: [
      "South Korea pursued export-oriented industrialization and secure property rights; North Korea pursued central planning, closed borders, and self-reliance, suppressing the price signals that redirect investment toward productive use.",
      "North Korea's famine in the 1990s struck an urbanized, literate society during peacetime — reflecting a food-distribution and planning system that had lost the capacity to adjust, not merely a natural disaster."
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
        questionText: "What does a \"poverty trap\" describe?",
        options: [
          "A one-time, temporary drop in income that quickly reverses on its own",
          "A self-reinforcing cycle in which low income prevents the investment needed to raise future income",
          "A government policy that guarantees permanent economic growth",
          "A natural disaster with no lasting economic effects"
        ],
        correctAnswer: "A self-reinforcing cycle in which low income prevents the investment needed to raise future income",
        explanation: "- a) Wrong — a poverty trap is specifically a persistent, self-reinforcing cycle, not a temporary dip that reverses naturally.\\n- c) Wrong — this describes the opposite of a poverty trap, a mechanism guaranteeing growth rather than stagnation.\\n- d) Wrong — a poverty trap concerns ongoing economic dynamics, not an isolated natural event."
      },
      {
        questionText: "According to the lesson, which country had the higher GDP per capita in 1970?",
        options: [
          "South Korea",
          "North Korea",
          "Both countries had identical GDP per capita",
          "Neither country had any measurable GDP at the time"
        ],
        correctAnswer: "North Korea",
        explanation: "- a) Wrong — the lesson describes North Korea, not South Korea, holding the income advantage in 1970.\\n- c) Wrong — the lesson gives specific, differing figures for each country in 1970, not identical values.\\n- d) Wrong — the lesson provides specific GDP per capita estimates for both countries in this period."
      },
      {
        questionText: "By 2023, approximately how many times larger was South Korea's GDP per capita compared to North Korea's, according to the lesson?",
        options: [
          "About 2 times",
          "About 10 times",
          "More than 50 times",
          "Exactly equal"
        ],
        correctAnswer: "More than 50 times",
        explanation: "- a) Wrong — this drastically understates the gap described in the lesson.\\n- b) Wrong — this also understates the scale of the divergence described.\\n- d) Wrong — the lesson describes an extreme and growing gap, not equality."
      },
      {
        questionText: "Why does the lesson describe Korea's division as offering something close to a \"controlled experiment\"?",
        options: [
          "Because the two countries had completely different starting populations, cultures, and geography",
          "Because the two countries shared language, culture, and starting economic conditions, but adopted different institutions after 1948",
          "Because both countries adopted identical economic policies after division",
          "Because neither country experienced any economic development after 1948"
        ],
        correctAnswer: "Because the two countries shared language, culture, and starting economic conditions, but adopted different institutions after 1948",
        explanation: "- a) Wrong — the lesson explicitly emphasizes shared starting conditions, not differing ones, as what makes the comparison useful.\\n- c) Wrong — the lesson describes sharply diverging institutional choices, not identical policies.\\n- d) Wrong — the lesson describes substantial economic development in South Korea and initial development in North Korea as well."
      },
      {
        questionText: "What institutional approach did South Korea pursue that the lesson credits with enabling investment to compound over time?",
        options: [
          "Central planning with closed borders",
          "Export-oriented industrialization, secure property rights, and integration with global markets",
          "Complete isolation from all foreign trade",
          "A self-reliance doctrine rejecting foreign investment"
        ],
        correctAnswer: "Export-oriented industrialization, secure property rights, and integration with global markets",
        explanation: "- a) Wrong — this describes North Korea's approach, not South Korea's, according to the lesson.\\n- c) Wrong — the lesson credits South Korea's global market integration, not isolation, for its growth.\\n- d) Wrong — this describes North Korea's self-reliance doctrine, the opposite of South Korea's approach."
      },
      {
        questionText: "What does the lesson identify as a key reason North Korea's investment failed to compound the way South Korea's did?",
        options: [
          "North Korea had no natural resources of any kind",
          "Suppressed prices, profits, and competition prevented investment from being redirected toward its most productive use",
          "North Korea invested more money overall than South Korea did",
          "South Korea received significantly more foreign aid than North Korea in every decade"
        ],
        correctAnswer: "Suppressed prices, profits, and competition prevented investment from being redirected toward its most productive use",
        explanation: "- a) Wrong — natural resource absence is not identified as the mechanism in the lesson's analysis.\\n- c) Wrong — the lesson doesn't claim North Korea out-invested South Korea in absolute terms.\\n- d) Wrong — comparative foreign aid levels across every decade are not the mechanism the lesson identifies."
      },
      {
        questionText: "An economist is evaluating why a small country's economy has stagnated for decades despite steady levels of investment. Based on the lesson's reasoning about poverty traps, what should the economist investigate first?",
        options: [
          "Whether the country's population enjoys the same culture as its neighbors",
          "Whether the country's institutions — property rights, price signals, market competition — allow investment to be redirected toward its most productive uses",
          "Whether the country has ever experienced any war in its history",
          "Whether the country's climate has changed in the past decade"
        ],
        correctAnswer: "Whether the country's institutions — property rights, price signals, market competition — allow investment to be redirected toward its most productive uses",
        explanation: "- a) Wrong — shared culture with neighbors is not identified as a determinant of whether investment compounds effectively.\\n- c) Wrong — the lesson attributes stagnation to institutional suppression of price signals, not historical war exposure alone.\\n- d) Wrong — climate change is not discussed as a mechanism behind poverty traps in this lesson."
      },
      {
        questionText: "A policymaker in a centrally planned economy wants to understand why new factories haven't led to rising living standards over several decades. Based on the North Korea case, what is the most directly supported explanation?",
        options: [
          "Central planning always produces more efficient outcomes than market competition",
          "Without price signals and competition to guide investment, new capital may be misallocated in ways that fail to generate compounding growth",
          "Factories in centrally planned economies never produce any output at all",
          "Population size is the only factor that determines whether factories succeed"
        ],
        correctAnswer: "Without price signals and competition to guide investment, new capital may be misallocated in ways that fail to generate compounding growth",
        explanation: "- a) Wrong — this contradicts the lesson's central argument, which attributes North Korea's stagnation partly to central planning's suppression of price signals.\\n- c) Wrong — the lesson doesn't claim North Korean factories produced zero output, only that investment failed to compound into rising living standards.\\n- d) Wrong — population size is not identified as the determining factor in this comparison."
      },
      {
        questionText: "Why does the lesson describe North Korea's 1990s famine as reflecting \"not a natural disaster alone\"?",
        options: [
          "Because no famine actually occurred in North Korea during this period",
          "Because the famine struck an urbanized, literate society during peacetime — a combination suggesting a food-distribution and planning system that had lost the capacity to adjust, not simply bad weather",
          "Because famines never have any connection to a country's economic or political system",
          "Because South Korea experienced an identical famine at the same time"
        ],
        correctAnswer: "Because the famine struck an urbanized, literate society during peacetime — a combination suggesting a food-distribution and planning system that had lost the capacity to adjust, not simply bad weather",
        explanation: "- a) Wrong — the lesson explicitly describes a real, severe famine occurring during this period.\\n- c) Wrong — the lesson directly ties the famine's severity to the underlying planning and distribution system, not treating it as unrelated to economic structure.\\n- d) Wrong — the lesson describes this famine as specific to North Korea, not a shared event across both countries."
      },
      {
        questionText: "Given that both North and South Korea started from comparable conditions in 1948 and both experienced significant shocks along the way (war, and later famine or financial crisis), what is the more defensible explanation for their dramatically different long-run outcomes: the shocks themselves, or the institutions each country used to respond to and recover from them?",
        options: [
          "The shocks alone fully explain the divergence, regardless of each country's institutions",
          "The institutional responses — market-oriented recovery in the South, continued central planning and isolation in the North — better explain the diverging long-run trajectories than the shocks themselves",
          "Neither shocks nor institutions have any bearing on long-run economic outcomes",
          "Both countries responded to shocks in identical ways, making institutions irrelevant to the comparison"
        ],
        correctAnswer: "The institutional responses — market-oriented recovery in the South, continued central planning and isolation in the North — better explain the diverging long-run trajectories than the shocks themselves",
        explanation: "- a) Wrong — both countries faced serious shocks, yet their outcomes differed enormously, suggesting shocks alone are an incomplete explanation.\\n- c) Wrong — the lesson directly attributes the outcome to specific institutional choices and their effects over time.\\n- d) Wrong — the lesson describes sharply different institutional responses between the two countries, not identical ones."
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
