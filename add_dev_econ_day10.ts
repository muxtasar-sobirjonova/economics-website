import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 10;
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
    title: 'Can Poor Countries Catch Up?',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `In 1953, South Korea's income per person stood at roughly 67 U.S. dollars a year. By 2019, it had reached 32,115 dollars — a nearly 480-fold increase in less than seventy years, in a country that had just finished fighting a war that leveled most of its cities.

The Solow growth model predicts something that sounds almost too convenient: poorer countries, with less capital already in place, should generally grow faster than rich ones, because each new factory or road adds more to a nearly empty economy than it would to a full one. Economists call this the convergence hypothesis — over time, poorer economies should close the gap with richer ones, assuming they save, invest, and adopt available technology at a reasonable rate. It isn't a promise that every poor country will catch up. It's a prediction about which ones have the arithmetic on their side if they do the rest of the work themselves.

*Catching up isn't a gift. It's unclaimed arithmetic.*

South Korea is the case economists reach for first, precisely because it did almost everything the model would ask of a country trying to close a decades-wide gap in under two generations. The article ahead follows that convergence from a per-capita income poorer than much of sub-Saharan Africa to a seat among the world's advanced economies.`,
    conceptSummary: `The convergence hypothesis predicts that poorer countries, starting with less capital, should generally grow faster than richer ones — each new factory or road adds more to an empty economy than a full one, echoing the Solow growth model's logic. Convergence describes an opportunity available to any country that saves, invests, and adopts technology consistently, not a guarantee that every poor country will close the gap.`,
    conceptTakeaways: [
      "The convergence hypothesis predicts poorer countries should generally grow faster than richer ones, since scarce existing capital means new investment produces larger output gains.",
      "South Korea's income per person rose from about 67 dollars (1953) to 32,115 dollars (2019), with real GDP reaching 25 times its 1960 level by 1996."
    ],
    articleTitle: 'Sixty-Seven Dollars to Thirty-Two Thousand',
    articleText: `**How poor was South Korea before its economic miracle began?**
At the end of the Korean War in 1953, South Korea's economy resembled one of the poorest in the world. Its gross national income per person that year was about 67 dollars, and by 1962 GNP per capita had only crept up to roughly 87 dollars — a level comparable to some of the least developed economies of the era. Exports totaled just 32.82 million dollars in 1960, a rounding error by the standards of any established trading nation.

**What triggered one of the fastest sustained growth episodes in recorded history?**
What followed, between the early 1960s and the mid-1990s, was one of the fastest sustained convergence episodes in recorded economic history. Under President Park Chung-hee, who took power in a 1961 coup, Korea abandoned import-substitution policies that had gone nowhere and committed instead to export-oriented industrialization. This meant channeling credit toward manufacturers who could sell competitively abroad, investing heavily in education and infrastructure, and coordinating closely with the family-owned conglomerates, or chaebols, that would eventually become Samsung, Hyundai, and LG. By 1996, Korea's real GDP stood at 25 times its 1960 level.

**Did South Korea's growth defy traditional economic models, or follow them perfectly?**
Every ingredient the convergence hypothesis calls for showed up in the data. Savings and investment rates climbed to some of the highest in the world, giving Korea's nearly empty capital base exactly the kind of high-return investment opportunities the Solow model predicts for a poor country starting from scratch. Exports, once a rounding error, crossed 10 billion dollars by 1977 and reached 542.2 billion dollars by 2019, as Korean firms moved from light manufacturing into steel, shipbuilding, and eventually semiconductors.

**Why is investing in people just as critical as investing in machines?**
The education piece deserves its own emphasis, because it is the part of convergence a country cannot simply import or purchase in bulk the way it can machinery. Korean households, even during the leanest years of the 1950s and 1960s, kept children in school at rates well above what the country's income level would have predicted. This reflected a cultural emphasis on education that gave Korea a workforce capable of absorbing new industrial techniques — not passively, but with the literacy and technical grounding to eventually improve on them.

**Was Korea's rapid growth a completely smooth and uninterrupted process?**
Convergence wasn't a smooth, uninterrupted line. The 1997 Asian Financial Crisis forced Korea into an IMF bailout, and the government pushed insolvent conglomerates out of the market through painful restructuring rather than propping them up indefinitely. But growth resumed afterward, and by 1996 — even before the crisis and recovery that followed — Korea's GDP per capita, while still roughly 30% below the OECD average, had already reached a level comparable to some European economies. 

**Is economic convergence an automatic guarantee for every poor country?**
Korea's convergence didn't happen because the arithmetic of catching up is automatic. It happened because Korea did the specific, unglamorous work the model assumes: it saved at extraordinary rates, invested in both machines and people, and kept doing both for over three decades without abandoning the strategy halfway through. Other countries had the same arithmetic available and never claimed it — proof that convergence describes an opportunity, not a guarantee.`,
    articleSummary: `South Korea's income per person rose from roughly 67 dollars in 1953 to 32,115 dollars by 2019, with GDP growing 25-fold between 1960 and 1996 alone. Sustained high savings, heavy investment in education, and an export-oriented strategy under Park Chung-hee turned one of the world's poorest economies into an OECD member within three decades — proof that convergence rewards countries that do the underlying work, rather than arriving automatically.`,
    articleTakeaways: [
      "Under Park Chung-hee, Korea shifted to export-oriented industrialization, coordinating state investment with conglomerates (chaebols) like Samsung and Hyundai rather than continuing failed import-substitution policies.",
      "Korea's exports grew from 32.82 million dollars (1960) to over 10 billion dollars (1977) and 542.2 billion dollars (2019), moving from light manufacturing into steel, shipbuilding, and eventually semiconductors.",
      "Convergence is an opportunity created by a country's own savings, investment, and education choices, not an automatic outcome — many countries with the same starting arithmetic never closed the gap."
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
        questionText: "What does the convergence hypothesis predict about poorer countries relative to richer ones?",
        options: [
          "Poorer countries should generally grow more slowly, since they lack capital",
          "Poorer countries should generally grow faster, since scarce existing capital means new investment produces larger output gains",
          "All countries grow at exactly the same rate regardless of starting capital",
          "Richer countries always grow faster because they have more resources"
        ],
        correctAnswer: "Poorer countries should generally grow faster, since scarce existing capital means new investment produces larger output gains",
        explanation: "- a) Wrong — this is the opposite of what the convergence hypothesis predicts.\\n- c) Wrong — the hypothesis specifically predicts different growth rates based on differing capital levels, not identical rates.\\n- d) Wrong — the hypothesis predicts the reverse pattern under typical conditions."
      },
      {
        questionText: "What was South Korea's approximate income per person around the end of the Korean War in 1953?",
        options: [
          "About 67 dollars",
          "About 6,700 dollars",
          "About 32,000 dollars",
          "About 500,000 dollars"
        ],
        correctAnswer: "About 67 dollars",
        explanation: "- b) Wrong — this overstates the figure by roughly a hundredfold.\\n- c) Wrong — 32,000 dollars is close to Korea's much later, 2019-era income level, not its 1953 level.\\n- d) Wrong — this vastly overstates Korea's income at the time."
      },
      {
        questionText: "What major economic policy shift did Park Chung-hee's government make in the early 1960s?",
        options: [
          "A shift from export-oriented industrialization to import substitution",
          "A shift from import-substitution policies to export-oriented industrialization",
          "Complete elimination of all government involvement in the economy",
          "A shift toward relying entirely on agricultural exports"
        ],
        correctAnswer: "A shift from import-substitution policies to export-oriented industrialization",
        explanation: "- a) Wrong — this reverses the actual direction of the policy shift described in the lesson.\\n- c) Wrong — the lesson describes close government coordination with conglomerates, not elimination of government involvement.\\n- d) Wrong — the lesson describes a shift toward manufacturing and industrial exports, not agriculture."
      },
      {
        questionText: "What role did chaebols play in Korea's growth, according to the lesson?",
        options: [
          "They were foreign-owned companies with no connection to the Korean government",
          "They were family-owned conglomerates that coordinated closely with state investment and became firms like Samsung and Hyundai",
          "They were small, informal family farms",
          "They opposed all government economic policy"
        ],
        correctAnswer: "They were family-owned conglomerates that coordinated closely with state investment and became firms like Samsung and Hyundai",
        explanation: "- a) Wrong — chaebols are described as Korean, not foreign-owned, entities closely coordinated with the government.\\n- c) Wrong — chaebols are described as large industrial conglomerates, not small farms.\\n- d) Wrong — the lesson describes close coordination with government policy, not opposition to it."
      },
      {
        questionText: "By 1996, how much larger was Korea's real GDP compared to its 1960 level?",
        options: [
          "About 2 times larger",
          "About 10 times larger",
          "About 25 times larger",
          "About 100 times larger"
        ],
        correctAnswer: "About 25 times larger",
        explanation: "- a) Wrong — this drastically understates the growth described in the lesson.\\n- b) Wrong — this also understates the actual multiple given in the lesson.\\n- d) Wrong — this overstates the figure; 25 times is the number specifically cited."
      },
      {
        questionText: "What happened to Korea's economy during the 1997 Asian Financial Crisis, according to the lesson?",
        options: [
          "Nothing changed; the crisis had no effect on Korea",
          "Korea required an IMF bailout and restructured insolvent conglomerates rather than propping them up indefinitely",
          "Korea's export industry was permanently destroyed",
          "Korea abandoned its education investment entirely"
        ],
        correctAnswer: "Korea required an IMF bailout and restructured insolvent conglomerates rather than propping them up indefinitely",
        explanation: "- a) Wrong — the lesson explicitly describes a significant disruption requiring an IMF bailout.\\n- c) Wrong — the lesson describes growth resuming after the crisis, not permanent destruction of exports.\\n- d) Wrong — no such abandonment of education investment is described in the lesson."
      },
      {
        questionText: "A country has very little existing capital and a government considering whether to invest heavily in both infrastructure and education over several decades. Based on the convergence hypothesis and Korea's case, what would be the most defensible prediction?",
        options: [
          "The country is guaranteed to catch up to rich countries regardless of its choices",
          "Sustained investment and education spending could position the country to grow faster than richer economies, but success is not automatic and depends on maintaining the strategy",
          "The country's low starting capital makes catching up impossible",
          "Only investment matters; education has no bearing on convergence"
        ],
        correctAnswer: "Sustained investment and education spending could position the country to grow faster than richer economies, but success is not automatic and depends on maintaining the strategy",
        explanation: "- a) Wrong — the lesson explicitly states convergence is an opportunity, not a guarantee.\\n- c) Wrong — low starting capital is precisely the condition the convergence hypothesis identifies as offering the largest growth opportunity.\\n- d) Wrong — the lesson explicitly credits education investment as a key part of Korea's growth strategy."
      },
      {
        questionText: "Two countries both start with low per-capita income in a given year. Country A sustains high savings and investment rates for three decades; Country B raises savings briefly but abandons the strategy after a few years. Based on the lesson, which country is more likely to resemble Korea's convergence pattern?",
        options: [
          "Country B, since shorter efforts are always more effective",
          "Country A, since Korea's convergence depended on sustaining high savings and investment for over three decades",
          "Neither, since savings rates have no bearing on convergence",
          "Both equally, since duration of the strategy doesn't matter"
        ],
        correctAnswer: "Country A, since Korea's convergence depended on sustaining high savings and investment for over three decades",
        explanation: "- a) Wrong — the lesson explicitly attributes Korea's convergence to sustained effort over decades, not a brief effort.\\n- c) Wrong — the lesson directly ties Korea's high, sustained savings and investment rates to its convergence outcome.\\n- d) Wrong — the lesson emphasizes that Korea \"kept doing both for over three decades,\" implying duration mattered."
      },
      {
        questionText: "Why does the lesson describe convergence as \"unclaimed arithmetic\" rather than something that happens automatically?",
        options: [
          "Because every poor country automatically converges with rich countries over time",
          "Because the growth advantage from starting with less capital is only realized if a country actually saves, invests, and sustains the strategy, as Korea did",
          "Because arithmetic has no relevance to economic growth",
          "Because only countries with abundant natural resources can converge"
        ],
        correctAnswer: "Because the growth advantage from starting with less capital is only realized if a country actually saves, invests, and sustains the strategy, as Korea did",
        explanation: "- a) Wrong — the lesson explicitly states convergence is not automatic, contradicting this option.\\n- c) Wrong — the lesson uses the capital-scarcity arithmetic from the Solow model as the basis for the convergence opportunity.\\n- d) Wrong — the lesson attributes Korea's convergence to savings, investment, and education, not natural resource abundance."
      },
      {
        questionText: "Based on this lesson and the previous lesson on capital accumulation and diminishing returns, what would you predict happens to a converging country's growth rate as its capital stock approaches levels similar to advanced economies?",
        options: [
          "Growth accelerates indefinitely with no limit",
          "Growth is likely to slow, as the same diminishing-returns pattern that applies to any economy with abundant capital begins to apply",
          "Growth stops completely and reverses",
          "Growth becomes entirely unrelated to capital levels at that point"
        ],
        correctAnswer: "Growth is likely to slow, as the same diminishing-returns pattern that applies to any economy with abundant capital begins to apply",
        explanation: "- a) Wrong — both lessons describe diminishing, not accelerating, returns as capital accumulates.\\n- c) Wrong — the lessons describe slower growth, not a complete reversal or economic collapse.\\n- d) Wrong — capital levels remain directly relevant to growth rates throughout both lessons' reasoning."
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
