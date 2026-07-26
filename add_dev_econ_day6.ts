import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 6;
  const track = Track.DEVELOPMENT_ECONOMICS;
  console.log(`Starting update for Day \${dayOrder} (\${track})...`);

  // UPDATE OR CREATE LESSON
  let lesson = await prisma.lesson.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  const lessonData = {
    title: 'How Countries Move from Poverty to Prosperity (Development Stages)',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `In the early 1960s, United States officials had to decide which poor countries were worth betting foreign aid on and they leaned on an idea that poverty follows a fixed, predictable order, one that any country could climb if it got the right push at the right moment.

That idea came from economist Walt Rostow, who argued in 1960 that every economy passes through the same five stages on its way to prosperity. A traditional society runs on farming and old technology, with output barely changing from one generation to the next. Slowly it builds the preconditions for take-off (roads, banks, a bit of industry) until investment suddenly jumps and a handful of leading industries grow fast enough to pull the rest of the economy along, the take-off itself. After that comes the drive to maturity, where growth spreads into new industries beyond the original leaders, and finally the age of high mass consumption, where factories that once built machinery start building cars, appliances, and everything else people buy once they're no longer worried about food and shelter.

Picture a foreign ministry official in 1962, choosing between two poor countries applying for the same aid package. One has just built its first paved roads and a handful of textile factories. The other has almost none of that. Rostow's model gave a clear answer: fund the first one, since it's closer to take-off, and a well-timed push there pays off faster than the same money spent on a country still at the starting line.

That's a tidy story, and it shaped real decisions about where American money went. Whether real countries actually climbed the ladder in that order, or whether the ladder was ever really there, is exactly what this lesson investigates next.`,
    conceptSummary: `Economist Walt Rostow argued in 1960 that every economy climbs the same five stages toward prosperity: traditional society, preconditions for take-off, take-off itself, drive to maturity, and high mass consumption. United States officials used this model to decide which poor countries were closest to take-off and worth funding, betting that a well-timed push could speed a country up the ladder.`,
    conceptTakeaways: [
      "Walt Rostow's 1960 model describes five stages every economy supposedly passes through on the way to prosperity.",
      "The five stages are: traditional society, preconditions for take-off, take-off, drive to maturity, and high mass consumption.",
      "\"Take-off\" describes the point when investment jumps and a handful of leading industries grow fast enough to pull the rest of the economy forward.",
      "The model implied that foreign aid works best when targeted at countries already close to take-off, not those still at the earliest stage.",
      "The idea that development follows one universal, predictable order shaped real decisions about where aid money went in the 1960s."
    ],
    articleTitle: 'The Five-Step Plan That Sent America into Vietnam',
    articleText: `**Why did an American professor write a "manifesto" answering Marx?**
In 1960, an economic historian at MIT published a book with the word "manifesto" in the title, aimed squarely at Karl Marx. Walt Rostow had spent years studying how economies industrialize, and he was troubled that newly independent countries across Asia and Africa found Marx's own stages-of-history story so persuasive. Rostow wanted to hand the non-communist world a rival story — one where every economy, capitalist or not, climbed the same five rungs toward prosperity without needing a revolution to get there. He called it The Stages of Economic Growth: A Non-Communist Manifesto.

**What convinced a future U.S. president that a professor's theory belonged in real foreign policy?**
The book reached a young senator running for president in 1960: John F. Kennedy. Kennedy found Rostow's argument persuasive enough to bring him onto his campaign, and once elected, appointed him deputy national security adviser in January 1961. A theory built in a Cambridge, Massachusetts classroom now had a direct line into the White House.

**How did Rostow's five stages turn into actual dollars flowing out of Washington?**
Rostow argued that a well-timed push of aid and investment could shove a struggling economy through his "take-off" stage before communism took root there instead. That thinking helped shape the Alliance for Progress, the Kennedy administration's aid program for Latin America, along with similar development efforts elsewhere in Asia. Foreign aid stopped being just charity and became, in Rostow's telling, a tool for winning the Cold War.

**Did Rostow's theory stay confined to peaceful aid programs, or did it reach further than that?**
Much further. By 1966, President Lyndon Johnson had named Rostow national security adviser, and he became one of the war's most consistent defenders inside the administration, at times pushing for bombing campaigns against North Vietnam. Rostow carried the same basic belief into the war room that he'd carried into the aid office: that enough pressure, applied correctly, could push a country's development onto the right track, whether the tool was a factory loan or a bombing run.

**What happened when economists actually checked whether real countries climbed Rostow's five stages in order?**
They mostly didn't. Countries skipped stages, industrialized around different leading sectors than Rostow expected, or grew rich through oil and resource exports without ever building the manufacturing base his model treated as essential. Rostow's own entry in Encyclopaedia Britannica today notes plainly that his six-stage model "did not gain general acceptance" among economists, even though it pushed the field to take long-run development history seriously.

**Is development still understood today as a fixed sequence of stages, the way Rostow described it?**
Not really. By the 1970s and 1980s, economists had largely moved on to other frameworks that treated each country's path as shaped by its own history, institutions, and place in the world economy, rather than one universal ladder. What survived wasn't the five stages themselves, but the language: economists and diplomats still talk about countries "taking off," decades after the man who coined the phrase had moved from writing about economic growth to arguing for a war.`,
    articleSummary: `Walt Rostow's 1960 book on the stages of growth impressed John F. Kennedy so much that Rostow ended up shaping real United States policy, from the Alliance for Progress to the Vietnam War, all built on the belief that a well-timed push could move any country toward prosperity. Economists later found real countries rarely climbed his five stages in order.`,
    articleTakeaways: [
      "Rostow published The Stages of Economic Growth: A Non-Communist Manifesto in 1960 as a direct alternative to Marx's stages of history.",
      "John F. Kennedy was influenced enough by the book to bring Rostow onto his 1960 campaign and later into his administration.",
      "Rostow's ideas helped shape the Alliance for Progress, the Kennedy administration's development aid program for Latin America.",
      "As national security adviser under Lyndon Johnson from 1966, Rostow became a leading defender of escalating the Vietnam War.",
      "Economists later found that real countries often skipped stages or developed differently than Rostow's model predicted, and the theory did not gain lasting acceptance in economics."
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

  // UPDATE OR CREATE QUIZ
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
        questionText: "What was the main idea behind Walt Rostow's 1960 model of economic development?",
        options: [
          "Every economy passes through the same five stages on its way to prosperity",
          "Only communist countries can develop economically",
          "Development is entirely random and cannot be predicted",
          "Countries must revolt against their governments before they can grow"
        ],
        correctAnswer: "Every economy passes through the same five stages on its way to prosperity",
        explanation: "- A) Correct — Rostow's core idea was a universal, five-stage ladder to prosperity.\\n- B) Wrong — his book was subtitled \"A Non-Communist Manifesto\" to argue the exact opposite.\\n- C) Wrong — his model was highly structured and deterministic, not random.\\n- D) Wrong — this was closer to the Marxist view his model was trying to counter."
      },
      {
        questionText: "What does the \"take-off\" stage in Rostow's model actually describe?",
        options: [
          "The point when investment jumps and a few leading industries grow fast enough to pull the rest of the economy forward",
          "A country's first free election",
          "The moment a country adopts a new currency",
          "A country's transition to a fully agricultural economy"
        ],
        correctAnswer: "The point when investment jumps and a few leading industries grow fast enough to pull the rest of the economy forward",
        explanation: "- A) Correct — this is the defining mechanism of the take-off stage in Rostow's theory.\\n- B) Wrong — the model focuses on economic transitions, not just elections.\\n- C) Wrong — currency changes aren't the defining feature of this stage.\\n- D) Wrong — take-off is the transition away from a purely agricultural economy toward industrialization."
      },
      {
        questionText: "Why did Rostow call his 1960 book a \"manifesto\"?",
        options: [
          "It was written as a direct alternative to Marx's stages of history",
          "It was a response to a United Nations resolution",
          "It was meant to promote communism in developing countries",
          "It was a legal document required by the U.S. government"
        ],
        correctAnswer: "It was written as a direct alternative to Marx's stages of history",
        explanation: "- A) Correct — he wanted to give the non-communist world a rival, capitalist story of inevitable development.\\n- B) Wrong — it was aimed at Marx, not a UN resolution.\\n- C) Wrong — it was explicitly an anti-communist argument.\\n- D) Wrong — it was an academic book, not a legal requirement."
      },
      {
        questionText: "How did Rostow's academic theory end up influencing real U.S. foreign aid programs?",
        options: [
          "It had no real influence outside of university classrooms",
          "It was rejected by every U.S. president who read it",
          "It led the U.S. to stop giving foreign aid altogether",
          "It convinced Kennedy that aid should target countries close to take-off, shaping programs like the Alliance for Progress"
        ],
        correctAnswer: "It convinced Kennedy that aid should target countries close to take-off, shaping programs like the Alliance for Progress",
        explanation: "- A) Wrong — the lesson details its heavy influence on real policy.\\n- B) Wrong — Kennedy enthusiastically adopted it.\\n- C) Wrong — it led to targeted aid programs, not an end to aid.\\n- D) Correct — Rostow's theory directly shaped Kennedy's aid strategies in Latin America and Asia."
      },
      {
        questionText: "What role did Rostow eventually take on under President Lyndon Johnson?",
        options: [
          "National security adviser, where he became a leading defender of the Vietnam War",
          "Secretary of the Treasury",
          "Ambassador to the Soviet Union",
          "Director of the World Bank"
        ],
        correctAnswer: "National security adviser, where he became a leading defender of the Vietnam War",
        explanation: "- A) Correct — he used his belief in \"applied pressure\" to advocate for bombing campaigns and escalation in Vietnam.\\n- B) Wrong — he was in national security, not the Treasury.\\n- C) Wrong — he wasn't ambassador to the Soviet Union.\\n- D) Wrong — he was in the White House, not the World Bank."
      },
      {
        questionText: "What did economists find when they checked whether real countries followed Rostow's five stages in order?",
        options: [
          "Every country followed the stages exactly as predicted",
          "Countries often skipped stages or developed differently than the model predicted",
          "No country in history has ever industrialized",
          "Only communist countries followed the stages correctly"
        ],
        correctAnswer: "Countries often skipped stages or developed differently than the model predicted",
        explanation: "- A) Wrong — the empirical evidence didn't support the fixed sequence.\\n- B) Correct — development proved to be much less uniform than Rostow argued, with countries taking various paths.\\n- C) Wrong — many have industrialized, just not always in Rostow's order.\\n- D) Wrong — the model didn't perfectly describe any bloc of countries."
      },
      {
        questionText: "(Scenario) A country grows rich almost entirely through oil exports, without ever building a large manufacturing sector. How would this challenge Rostow's model?",
        options: [
          "It wouldn't challenge the model at all, since oil counts as a leading industry",
          "It proves that Rostow's model applies only to oil-producing countries",
          "It challenges the model's assumption that manufacturing-led \"take-off\" is a necessary step toward prosperity",
          "It confirms that all countries must pass through a traditional society stage first"
        ],
        correctAnswer: "It challenges the model's assumption that manufacturing-led \"take-off\" is a necessary step toward prosperity",
        explanation: "- A) Wrong — Rostow specifically envisioned industrial manufacturing as the engine of take-off and maturity.\\n- B) Wrong — his model actually failed to predict this path.\\n- C) Correct — getting rich via resources without a broad manufacturing base contradicts Rostow's rigid stages.\\n- D) Wrong — this scenario is about skipping stages, not confirming them."
      },
      {
        questionText: "(Scenario) You're a 1962 foreign ministry official comparing two countries: one with new roads and a few factories, the other with almost no infrastructure. According to Rostow's model, which country should receive aid first, and why?",
        options: [
          "The country with almost no infrastructure, since it needs the most help",
          "The country with roads and factories, since it's closer to take-off and a push there pays off faster",
          "Neither, since Rostow's model says aid never works",
          "Both equally, since the model treats all countries the same regardless of stage"
        ],
        correctAnswer: "The country with roads and factories, since it's closer to take-off and a push there pays off faster",
        explanation: "- A) Wrong — Rostow's logic prioritized countries that were ready to \"take off,\" not just those in greatest need.\\n- B) Correct — his model advised targeting the \"preconditions\" stage where a push would launch the country into self-sustaining growth fastest.\\n- C) Wrong — the model explicitly supported targeted aid.\\n- D) Wrong — the model specifically differentiates countries by their stage."
      },
      {
        questionText: "Why do many economists today reject the idea that development follows one universal sequence of stages?",
        options: [
          "Because they believe no country has ever developed economically",
          "Because each country's path is shaped by its own history, institutions, and position in the world economy",
          "Because Rostow's model has since been proven true in every case",
          "Because economists no longer study economic development at all"
        ],
        correctAnswer: "Because each country's path is shaped by its own history, institutions, and position in the world economy",
        explanation: "- A) Wrong — many countries have developed, but in varied ways.\\n- B) Correct — modern development economics recognizes that context, institutions, and history make one universal ladder unrealistic.\\n- C) Wrong — it has not been proven true; it's mostly rejected as a rigid framework.\\n- D) Wrong — development is a major field; it just uses different frameworks now."
      },
      {
        questionText: "What is the clearest example from the article of Rostow applying the same basic belief to two very different situations?",
        options: [
          "Using the same economic model to justify both foreign aid programs and military escalation in Vietnam",
          "Using the same tax policy in both Latin America and Southeast Asia",
          "Applying his model only to communist countries",
          "Refusing to apply his theory to any real-world policy decisions"
        ],
        correctAnswer: "Using the same economic model to justify both foreign aid programs and military escalation in Vietnam",
        explanation: "- A) Correct — he believed that applying enough targeted pressure—whether through aid dollars or bombs—could force a country onto the \"right\" path.\\n- B) Wrong — the article describes aid and war, not tax policy.\\n- C) Wrong — he applied it to non-communist countries to prevent them from becoming communist.\\n- D) Wrong — he was highly influential in actual policy."
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
