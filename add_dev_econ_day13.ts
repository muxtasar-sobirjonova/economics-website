import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 13;
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
    title: 'The Hidden Engine of Economic Growth',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `In 1994, Paul Krugman published an essay arguing that Singapore's economic miracle was, in his own words, entirely "explained by increases in measured inputs." He meant this as an insult, not a compliment, and he compared the city-state's growth model directly to the Soviet Union's — a comparison meant to predict eventual collapse.

Total factor productivity, or TFP, is the part of economic growth left over after accounting for how much capital and labor an economy has added. If a country doubles its factories and doubles its workforce and output exactly doubles too, TFP growth is zero — all the growth came from bigger inputs, not from getting more out of each one. If output more than doubles, the extra comes from TFP: better organization, better technology, smarter allocation of resources, the same workers and machines simply producing more than they used to. Economists treat a country's TFP growth as the best evidence of genuine, durable improvement, as opposed to an economy that is simply getting bigger by adding more of the same ingredients.

*Bigger isn't the same as better.*

Krugman's claim, built on research by economist Alwyn Young, was that Singapore had almost none of this second kind of growth — that its entire "miracle" was a Soviet-style accumulation story wearing a capitalist costume. The article ahead follows what happened to that prediction, and to Singapore, in the decades since.`,
    conceptSummary: `Total factor productivity measures the part of economic growth left over after accounting for increases in capital and labor — the improvement that comes from using existing resources more efficiently, rather than simply adding more of them. Economists treat TFP growth as the clearest evidence of durable, self-sustaining improvement, distinct from growth driven purely by expanding inputs.`,
    conceptTakeaways: [
      "Total factor productivity is the share of economic growth not explained by increases in capital or labor — the part attributable to using existing resources more efficiently.",
      "Economist Alwyn Young found that virtually all of Singapore's growth between 1966 and 1990 came from increased capital and labor inputs, not productivity gains."
    ],
    articleTitle: 'The Miracle Krugman Called a Myth',
    articleText: `**Did Singapore's economic miracle come from productivity or brute force?**
Alwyn Young's research, published in the early 1990s, produced a genuinely startling number: virtually all of Singapore's economic growth between 1966 and 1990 could be traced to increases in labor and capital, not to productivity gains. Singaporeans had moved from farms and informal work into factories in enormous numbers, and the country poured investment into physical capital at some of the highest rates in the world.

**Can an economy grow explosively without actually becoming more efficient?**
According to Young's growth accounting, the output produced per unit of input barely improved across nearly a quarter century of supposedly miraculous growth. Singapore was getting bigger simply by adding more ingredients to the pot, rather than discovering a better recipe. This meant its incredible expansion was driven almost entirely by input accumulation rather than true productivity gains.

**Why did a Nobel-winning economist compare Singapore's growth to the Soviet Union's?**
Paul Krugman took this finding and ran with it. Singapore's growth, he argued, looked less like Japan's productivity-driven ascent and more like the Soviet Union's mid-century expansion. It was an economy that grew explosively for decades by throwing more people and more machines at the problem, which he argued would eventually stall hard once there were no more idle farmers to move into factories and no more room to raise investment rates further.

**What happens to an economy when it runs out of idle inputs?**
Once the inputs stopped growing, in Krugman's framing, the growth would stop too — and unlike a productivity-driven economy, Singapore would have no second engine to fall back on. That prediction had a specific implied deadline attached to it, since input-driven growth runs out precisely when the inputs run out. Krugman predicted an inevitable stall, a warning that bigger isn't always the same as better.

**Did Singapore's economy collapse when the inputs stopped expanding?**
Instead, Singapore kept growing — and in 1997, just three years after Krugman's article, Singapore's income per person overtook the United States' by some measures, becoming one of the highest-income places on Earth. Singapore's policymakers had already built government bodies — a National Productivity Board established in 1972, followed by a Productivity Standards Board in 1981 — specifically to chase efficiency gains directly, rather than simply adding more capital and calling it growth.

**Are economic snapshots a reliable way to predict a country's long-term trajectory?**
None of this makes Krugman's original accounting wrong on its own narrow terms; Young's numbers for 1966-1990 were not seriously disputed as arithmetic. However, an economy can post genuinely low measured TFP growth during its input-accumulation phase and still avoid the Soviet-style collapse Krugman predicted, if it keeps redirecting policy toward efficiency gains. Singapore's real lesson is that a country's TFP trajectory is still being written after the economists have already published their verdict.`,
    articleSummary: `Economist Alwyn Young found that nearly all of Singapore's growth from 1966 to 1990 came from added capital and labor rather than productivity gains, leading Paul Krugman to predict a Soviet-style stall once those inputs stopped expanding. Instead, Singapore's income per person overtook the United States' by 1997, and its long-standing productivity institutions suggest the "input-driven" verdict captured a phase of Singapore's growth, not its full trajectory.`,
    articleTakeaways: [
      "Paul Krugman's 1994 essay used Young's findings to compare Singapore's growth model to the Soviet Union's, predicting a stall once input growth ran out.",
      "Singapore's income per person overtook the United States' by some measures in 1997, just three years after Krugman's prediction, contradicting the Soviet-style stagnation forecast.",
      "Singapore established productivity-focused institutions — a National Productivity Board (1972) and Productivity Standards Board (1981) — reflecting a deliberate policy focus on efficiency gains that a pure input-accounting snapshot might not fully capture."
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
        questionText: "What does total factor productivity (TFP) measure?",
        options: [
          "The total number of workers employed in an economy",
          "The share of economic growth not explained by increases in capital or labor",
          "The total amount of capital investment in a country",
          "The exchange rate between two currencies"
        ],
        correctAnswer: "The share of economic growth not explained by increases in capital or labor",
        explanation: "- a) Wrong — this describes labor input directly, which TFP explicitly excludes from its measurement.\\n- c) Wrong — this describes capital input directly, which is also excluded from the TFP residual.\\n- d) Wrong — exchange rates are unrelated to the growth-accounting concept described in the lesson."
      },
      {
        questionText: "What did economist Alwyn Young's research find about Singapore's growth between 1966 and 1990?",
        options: [
          "Virtually all of it came from productivity gains, with little contribution from capital or labor",
          "Virtually all of it came from increases in capital and labor, with little measured productivity gain",
          "Singapore's economy did not grow at all during this period",
          "Singapore's growth was entirely driven by foreign aid"
        ],
        correctAnswer: "Virtually all of it came from increases in capital and labor, with little measured productivity gain",
        explanation: "- a) Wrong — this is the opposite of Young's actual finding, which attributed growth mainly to inputs, not productivity.\\n- c) Wrong — the lesson describes explosive growth during this period, not stagnation.\\n- d) Wrong — foreign aid is not identified as the driver in Young's research as described in the lesson."
      },
      {
        questionText: "What comparison did Paul Krugman draw in his 1994 essay about Singapore's growth model?",
        options: [
          "He compared it favorably to Japan's technology-driven growth",
          "He compared it to the Soviet Union's input-driven growth, predicting a similar eventual stall",
          "He compared it to Argentina's early-20th-century wealth",
          "He argued Singapore's growth was identical to South Korea's in every respect"
        ],
        correctAnswer: "He compared it to the Soviet Union's input-driven growth, predicting a similar eventual stall",
        explanation: "- a) Wrong — the lesson explicitly contrasts Singapore's growth pattern with Japan's, not equates them.\\n- c) Wrong — Argentina's case is not part of Krugman's comparison as described in this lesson.\\n- d) Wrong — the lesson doesn't describe Krugman treating Singapore and Korea as identical."
      },
      {
        questionText: "What happened to Singapore's income per person in 1997, several years after Krugman's essay?",
        options: [
          "It collapsed, matching Krugman's prediction",
          "It overtook the United States' income per person by some measures",
          "It remained exactly the same as in 1990",
          "Singapore's economy was dissolved entirely"
        ],
        correctAnswer: "It overtook the United States' income per person by some measures",
        explanation: "- a) Wrong — this is the opposite of what the lesson describes happening.\\n- c) Wrong — the lesson describes continued significant growth, not stagnation.\\n- d) Wrong — no such dissolution of Singapore's economy is described in the lesson."
      },
      {
        questionText: "According to the lesson, what specific institutions did Singapore establish to pursue productivity gains directly?",
        options: [
          "A stock exchange and a central bank only",
          "A National Productivity Board (1972) and a Productivity Standards Board (1981)",
          "A ministry focused exclusively on agriculture",
          "No such institutions were ever established"
        ],
        correctAnswer: "A National Productivity Board (1972) and a Productivity Standards Board (1981)",
        explanation: "- a) Wrong — the lesson specifically names productivity-focused institutions, not general financial institutions.\\n- c) Wrong — the lesson does not describe an agriculture-focused ministry as Singapore's productivity strategy.\\n- d) Wrong — the lesson explicitly names two specific institutions established for this purpose."
      },
      {
        questionText: "Why does the lesson argue that Krugman's prediction, rather than Young's original accounting, was the part later disputed?",
        options: [
          "Because Young's 1966-1990 arithmetic was itself proven completely wrong",
          "Because the growth-accounting numbers for that period were not seriously disputed, but the forecast of an inevitable stall built on top of them did not hold up",
          "Because Singapore's economy stopped existing before any further data could be collected",
          "Because Krugman never made any specific prediction about the future"
        ],
        correctAnswer: "Because the growth-accounting numbers for that period were not seriously disputed, but the forecast of an inevitable stall built on top of them did not hold up",
        explanation: "- a) Wrong — the lesson states Young's numbers for the specific period were \"not seriously disputed as arithmetic.\"\\n- c) Wrong — the lesson describes Singapore's continued, successful growth, not economic dissolution.\\n- d) Wrong — the lesson explicitly describes Krugman's Soviet-style stall prediction as a specific forecast."
      },
      {
        questionText: "An economist observes that Country Z has grown rapidly by adding large amounts of capital and labor, with little measured TFP growth so far. Based on the lesson, what would be the most defensible conclusion?",
        options: [
          "Country Z's growth is guaranteed to collapse imminently, with no possible exception",
          "Low measured TFP growth during an input-accumulation phase doesn't guarantee a future stall, especially if the country actively pursues efficiency gains afterward",
          "TFP has no bearing on whether a country's growth is sustainable",
          "Country Z's growth figures must be fraudulent if TFP growth is low"
        ],
        correctAnswer: "Low measured TFP growth during an input-accumulation phase doesn't guarantee a future stall, especially if the country actively pursues efficiency gains afterward",
        explanation: "- a) Wrong — the lesson uses Singapore's case specifically to show this \"guaranteed collapse\" prediction did not hold up.\\n- c) Wrong — the lesson treats TFP as a meaningful, if not solely determinative, measure of growth quality.\\n- d) Wrong — the lesson does not suggest low TFP growth implies fraudulent reporting."
      },
      {
        questionText: "A policymaker in a rapidly growing but low-TFP economy is deciding whether to keep expanding capital and labor inputs or shift focus toward efficiency-boosting institutions. Based on Singapore's case, what approach is most directly supported?",
        options: [
          "Abandon all further capital investment immediately",
          "Pursue efficiency and productivity-focused institutions in parallel with continued investment, similar to Singapore's National Productivity Board approach",
          "Ignore productivity entirely and focus only on population growth",
          "Assume that low TFP growth makes further policy action pointless"
        ],
        correctAnswer: "Pursue efficiency and productivity-focused institutions in parallel with continued investment, similar to Singapore's National Productivity Board approach",
        explanation: "- a) Wrong — the lesson doesn't suggest ending capital investment; Singapore continued growing through capital deepening alongside productivity efforts.\\n- c) Wrong — the lesson emphasizes deliberate productivity-focused institutions, not a sole focus on population.\\n- d) Wrong — the lesson explicitly credits Singapore's proactive productivity institutions as relevant to its continued success."
      },
      {
        questionText: "Why does the lesson state that \"a country's TFP trajectory... is still being written after the economists have already published their verdict\"?",
        options: [
          "Because TFP measurements from any single period are a snapshot, and future policy and behavior can shift a country's trajectory afterward",
          "Because TFP calculations are always permanently fixed the moment they are published",
          "Because TFP has no relevance to any time period other than the one originally measured",
          "Because economists never revise growth-accounting estimates"
        ],
        correctAnswer: "Because TFP measurements from any single period are a snapshot, and future policy and behavior can shift a country's trajectory afterward",
        explanation: "- b) Wrong — this contradicts the lesson's explicit point that Singapore's later growth diverged from the earlier accounting-based prediction.\\n- c) Wrong — the lesson treats the earlier TFP finding as directly relevant to interpreting Singapore's subsequent growth.\\n- d) Wrong — the lesson describes later economists revisiting and debating Young's original methodology."
      },
      {
        questionText: "Based on this lesson and the earlier lesson on Taiwan's TSMC, which best describes the relationship between capital accumulation, TFP, and long-run growth across both cases?",
        options: [
          "Capital accumulation alone always produces the same long-run outcome regardless of productivity trends",
          "An economy can grow substantially through capital and labor accumulation for a period, but sustained long-run growth depends on eventually generating genuine productivity or innovation gains, as TSMC's know-how and Singapore's productivity institutions both illustrate",
          "TFP and capital accumulation are entirely unrelated concepts with no bearing on one another",
          "Only capital-poor countries can ever achieve meaningful TFP growth"
        ],
        correctAnswer: "An economy can grow substantially through capital and labor accumulation for a period, but sustained long-run growth depends on eventually generating genuine productivity or innovation gains, as TSMC's know-how and Singapore's productivity institutions both illustrate",
        explanation: "- a) Wrong — both lessons show accumulation-driven growth eventually requires a productivity or innovation contribution to avoid slowing.\\n- c) Wrong — both lessons directly connect capital accumulation patterns to productivity outcomes and predictions.\\n- d) Wrong — neither lesson restricts TFP growth to capital-poor countries specifically."
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
