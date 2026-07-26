import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 17;
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
    title: 'Can Growth Make Inequality Worse?',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `In 1980, urban China's Gini coefficient stood at just 0.16 — among the most equal income distributions ever recorded for a major economy. By 2008, the nationwide figure had climbed to roughly 0.49, before easing slightly to around 0.46 by 2015. In under three decades, one of the most equal societies on Earth became one of its more unequal ones, at precisely the moment its economy began growing fastest.

In 1955, economist Simon Kuznets proposed that this pattern wasn't a coincidence but a predictable stage of development: as a poor, largely agricultural economy industrializes, inequality should rise first, as some workers move into higher-paying urban and industrial jobs while others remain in lower-paying agriculture, and then fall later, once education spreads and enough of the workforce has made the same transition. Plotted on a graph, this produces an inverted U — inequality rising, peaking, and eventually declining as growth matures. Economists still call it the Kuznets curve.

*Growth doesn't distribute itself. Something has to do that job on purpose.*

China's boom offers one of the largest live tests of the Kuznets hypothesis ever run, precisely because its rise from poverty to the world's second-largest economy happened fast enough, and was measured carefully enough, to watch the predicted curve unfold — or fail to. The article ahead follows both the rise and the disputed turn.`,
    conceptSummary: `Economist Simon Kuznets proposed in 1955 that inequality rises in the early stages of industrialization, as workers shift from agriculture into higher-paying urban jobs, then falls once education spreads and the transition matures — a pattern plotted as an inverted U and known as the Kuznets curve. China's rapid post-1978 growth offers one of the clearest large-scale tests of whether that predicted pattern actually holds.`,
    conceptTakeaways: [
      "Economist Simon Kuznets proposed in 1955 that inequality rises early in industrialization and falls later, forming an inverted-U pattern now called the Kuznets curve.",
      "China's rapid post-1978 growth offers one of the clearest large-scale tests of whether that predicted pattern actually holds."
    ],
    articleTitle: 'The Curve China Was Supposed to Follow',
    articleText: `**How did opening up to the world transform China's economic divide?**
China's post-1978 reforms opened markets, dismantled collective agriculture, and exposed the economy to global trade at a pace with few precedents; the country's trade-to-GDP ratio alone jumped from roughly 20% to more than 60% by 2008. Growth on that scale reliably produces exactly what Kuznets predicted in its early stages: workers who could move from subsistence farming into export-oriented factories and cities earned dramatically more than those who couldn't or didn't. This meant the income gap between those two groups widened every year growth continued.

**Just how fast can inequality rise in a booming economy?**
The resulting explosion in wealth was profoundly uneven. China's Gini coefficient rose from 28.3 in 1983 to 49.1 in 2008 — a climb of more than 20 points in twenty-five years. This marks one of the fastest sustained increases in inequality any large economy has recorded. In under three decades, one of the most equal societies on Earth became one of its more unequal ones, at precisely the moment its economy began growing fastest.

**Does a rapidly growing economy eventually fix its own inequality?**
The theory's harder test came next. Kuznets predicted a turning point, not a permanent plateau: once a large enough share of the workforce had completed the shift into industry and cities, and once education spread widely enough, inequality was supposed to start falling back down the other side of the curve. China's Gini coefficient did dip slightly after 2008, down to roughly 46.2 by 2015 — a modest decline, and one researchers still actively debate rather than confidently attribute to the Kuznets mechanism completing itself.

**Why doesn't the Kuznets curve always complete a perfect arc?**
Economists who traced the specific drivers behind China's rising inequality identified four forces: a rising premium paid for skilled labor, labor's shrinking share of total income, growing spatial inequality between regions, and widening wealth gaps. Of those four, three showed signs of partial reversal after 2008, which should have driven inequality down further. However, wealth inequality kept climbing regardless, complicating any tidy story of the curve completing its arc on schedule.

**Can rising inequality actually help an economy grow faster?**
The more provocative finding sits inside the mechanism itself. Researchers studying China at the county level found that the relationship between inequality and growth wasn't fixed — it depended on how rich a place already was. In the 1980s and 1990s, when average incomes were still very low, rising inequality was actually associated with faster subsequent growth in the same locality. This roughly matches Kuznets's original story of unequal transition fueling development during the early stages of industrialization.

**What happens when inequality stops fueling growth and starts dragging it down?**
But the same researchers estimated that at China's current, much higher income levels, a one-percentage-point rise in the Gini coefficient now predicts a roughly one-percentage-point reduction in the annual growth rate going forward. Inequality has flipped from something the growth process temporarily tolerates into something that actively drags on it. China's own post-2008 policy shifts toward rural investment, minimum wage increases, and rebalancing away from pure export manufacturing coincided with whatever decline in inequality did occur. This suggests the down-slope of the curve, if it's real, gets built by deliberate policy rather than arriving on its own.`,
    articleSummary: `China's Gini coefficient rose from 0.16 in urban areas in 1980 to a nationwide peak near 0.49 by 2008, before easing slightly to about 0.46 by 2015. County-level research found rising inequality once helped fuel growth at China's earlier, lower income levels, but now predicts slower growth at its current income level — suggesting any decline in inequality reflects deliberate policy shifts rather than an automatic completion of the Kuznets curve.`,
    articleTakeaways: [
      "China's Gini coefficient rose from 28.3 in 1983 to a peak of 49.1 in 2008, one of the fastest sustained increases in inequality recorded for any major economy.",
      "China's Gini coefficient eased only modestly after 2008, to around 46.2 by 2015, with wealth inequality continuing to rise even as some other drivers of inequality partially reversed.",
      "County-level research found that rising inequality once coincided with faster growth at China's earlier, lower income levels, but a one-point rise in the Gini coefficient now predicts roughly a one-point reduction in future growth at its current income level.",
      "Any decline in China's inequality after 2008 coincided with deliberate policy shifts — rural investment, minimum wage increases, rebalancing away from export manufacturing — rather than occurring automatically as growth matured."
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
        questionText: "What did economist Simon Kuznets propose in 1955 about the relationship between growth and inequality?",
        options: [
          "Inequality should fall continuously throughout all stages of economic development",
          "Inequality should rise in the early stages of industrialization and fall later, forming an inverted-U pattern",
          "Inequality has no relationship to economic development at any stage",
          "Inequality should rise continuously and never fall at any stage of development"
        ],
        correctAnswer: "Inequality should rise in the early stages of industrialization and fall later, forming an inverted-U pattern",
        explanation: "- a) Wrong — this describes only the later half of Kuznets's predicted pattern, omitting the initial rise.\\n- c) Wrong — Kuznets's entire hypothesis is built around a specific relationship between development stage and inequality.\\n- d) Wrong — this describes only the first half of the predicted pattern, omitting the later predicted decline."
      },
      {
        questionText: "According to the lesson, approximately what was China's nationwide Gini coefficient in 1983, and what had it become by 2008?",
        options: [
          "It rose from 28.3 to 49.1",
          "It fell from 49.1 to 28.3",
          "It remained exactly the same throughout this period",
          "It rose from 0 to 100"
        ],
        correctAnswer: "It rose from 28.3 to 49.1",
        explanation: "- b) Wrong — this reverses the actual direction of change described in the lesson.\\n- c) Wrong — the lesson describes a dramatic rise, not stability, over this period.\\n- d) Wrong — Gini coefficients are typically expressed on a 0-to-1 or 0-to-100 scale, and the lesson gives specific intermediate figures, not the theoretical extremes."
      },
      {
        questionText: "What happened to China's Gini coefficient between 2008 and 2015, according to the lesson?",
        options: [
          "It rose sharply to over 70",
          "It eased only modestly, down to around 46.2",
          "It fell all the way back to its 1980 level",
          "It became impossible to measure after 2008"
        ],
        correctAnswer: "It eased only modestly, down to around 46.2",
        explanation: "- a) Wrong — the lesson describes a modest decline after 2008, not a sharp further rise.\\n- c) Wrong — a decline to roughly 46.2 is far above the 1980 urban figure of 0.16 cited in the lesson.\\n- d) Wrong — the lesson cites specific measured figures for this period, indicating continued measurement."
      },
      {
        questionText: "According to the lesson, which of the four identified drivers of China's rising inequality continued climbing even after 2008, complicating a tidy \"Kuznets curve completed\" story?",
        options: [
          "The skill premium paid to educated workers",
          "Wealth inequality",
          "Spatial inequality between regions",
          "Labor's declining share of income"
        ],
        correctAnswer: "Wealth inequality",
        explanation: "- a) Wrong — the lesson describes this and two other drivers as showing signs of partial reversal after 2008.\\n- c) Wrong — spatial inequality is grouped among the drivers showing partial reversal, not continued unchecked rise.\\n- d) Wrong — labor's declining income share is also grouped among the drivers showing partial reversal after 2008."
      },
      {
        questionText: "What did county-level research find about the relationship between rising inequality and subsequent growth at China's earlier, lower income levels (1980s-1990s)?",
        options: [
          "Rising inequality predicted slower subsequent growth, exactly as at higher income levels",
          "Rising inequality was associated with faster subsequent growth in the same locality",
          "Inequality had no measurable relationship to growth at any income level",
          "Falling inequality was associated with faster subsequent growth during this period"
        ],
        correctAnswer: "Rising inequality was associated with faster subsequent growth in the same locality",
        explanation: "- a) Wrong — the lesson explicitly contrasts this earlier pattern with the different relationship found at higher income levels.\\n- c) Wrong — the lesson describes a specific, measured relationship between inequality and growth during this period.\\n- d) Wrong — the lesson attributes the growth association to rising, not falling, inequality during this earlier period."
      },
      {
        questionText: "According to the lesson, what does a one-percentage-point rise in the Gini coefficient predict for annual growth at China's current, much higher income level?",
        options: [
          "Roughly a one-percentage-point increase in future growth",
          "Roughly a one-percentage-point reduction in future growth",
          "No effect on growth whatsoever",
          "A guaranteed economic collapse within one year"
        ],
        correctAnswer: "Roughly a one-percentage-point reduction in future growth",
        explanation: "- a) Wrong — this describes the relationship found at China's earlier, lower income levels, not its current one.\\n- c) Wrong — the lesson describes a specific, measurable negative relationship at current income levels.\\n- d) Wrong — the lesson describes a reduction in the growth rate, not a guaranteed collapse."
      },
      {
        questionText: "An economist observes a country's inequality rising sharply during its early industrialization, then hears a policymaker confidently predict this will \"naturally reverse once growth continues, with no policy action needed.\" Based on the lesson's analysis of China, how should the economist respond?",
        options: [
          "Agree completely, since inequality always reverses automatically once a country grows rich enough",
          "Note that China's own modest post-2008 decline coincided with deliberate policy shifts, suggesting the \"down-slope\" may need to be built rather than arriving automatically",
          "Argue that inequality never declines under any circumstances, regardless of policy",
          "Argue that growth and inequality have no relationship whatsoever"
        ],
        correctAnswer: "Note that China's own modest post-2008 decline coincided with deliberate policy shifts, suggesting the \"down-slope\" may need to be built rather than arriving automatically",
        explanation: "- a) Wrong — the lesson explicitly questions this passive, automatic version of the Kuznets story using China's own case.\\n- c) Wrong — the lesson describes a real, if modest, decline in China's measured inequality after 2008.\\n- d) Wrong — the lesson's entire analysis rests on a measurable relationship between growth stages and inequality."
      },
      {
        questionText: "A country at a relatively low income level is experiencing rising inequality alongside rapid industrialization. Based on the county-level findings described in the lesson, what would be the most defensible short-term expectation for growth?",
        options: [
          "Rising inequality at this stage is likely to coincide with continued strong growth in the near term, based on the pattern found at similarly low income levels",
          "Growth should collapse immediately due to rising inequality",
          "Growth and inequality can never coexist at any income level",
          "Rising inequality guarantees a permanent, irreversible increase in poverty"
        ],
        correctAnswer: "Rising inequality at this stage is likely to coincide with continued strong growth in the near term, based on the pattern found at similarly low income levels",
        explanation: "- b) Wrong — the lesson found rising inequality associated with faster, not collapsing, growth at comparably low income levels.\\n- c) Wrong — the lesson's own China data shows both rising simultaneously for an extended period.\\n- d) Wrong — the lesson doesn't tie rising inequality directly to a permanent rise in poverty; it addresses income distribution and growth rates."
      },
      {
        questionText: "Why does the lesson treat China's case as a stronger test of the Kuznets hypothesis than a slower-growing economy would provide?",
        options: [
          "Because China's growth and inequality changes happened fast enough and were measured carefully enough to observe the predicted pattern unfold within a few decades",
          "Because China is the only country ever measured for inequality",
          "Because Kuznets specifically designed his theory only to apply to China",
          "Because slow-growing economies cannot experience any inequality at all"
        ],
        correctAnswer: "Because China's growth and inequality changes happened fast enough and were measured carefully enough to observe the predicted pattern unfold within a few decades",
        explanation: "- b) Wrong — the lesson references Gini measurements and debates across many countries, not China exclusively.\\n- c) Wrong — Kuznets proposed a general theory of industrialization and inequality, not one designed specifically around China.\\n- d) Wrong — the lesson does not claim slow-growing economies are immune to inequality."
      },
      {
        questionText: "Considering both the early (1980s-1990s) and later (post-2008) periods in China, what is the most defensible overall conclusion about the relationship between inequality and growth?",
        options: [
          "Inequality has an identical effect on growth at every stage of development, with no variation over time",
          "The relationship between inequality and growth can change as an economy develops — aiding growth at low income levels in China's case, then dragging on it at higher income levels",
          "Inequality has no measurable relationship to growth at any stage in China's history",
          "Growth in China has been completely unaffected by any changes in inequality at any point"
        ],
        correctAnswer: "The relationship between inequality and growth can change as an economy develops — aiding growth at low income levels in China's case, then dragging on it at higher income levels",
        explanation: "- a) Wrong — the lesson explicitly documents a reversal in this relationship between China's earlier and later development stages.\\n- c) Wrong — the lesson describes specific, measured relationships between inequality and growth at different stages.\\n- d) Wrong — the lesson directly ties measurable growth effects to inequality levels at both stages discussed."
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
