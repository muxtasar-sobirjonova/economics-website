import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 5;
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
    title: 'How the Modern World Became Rich (Historical Growth Since 1800)',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `Ask why a farmer in England in 1750 earned barely more than a farmer in England in 1500, then ask why that same country's income has roughly doubled every few decades since — and you've landed on the central puzzle of modern economic history.

For most of human history, any gain in how much people could produce got swallowed up almost immediately. A good harvest meant more food, more food meant more children survived, and more children meant more mouths to feed off the same land. Living standards per person barely moved for centuries, a pattern economists call the Malthusian trap, after Thomas Malthus. Sustained growth only becomes possible once output can outrun population growth, year after year and once that happens, even a small growth rate compounds into something enormous over a few generations.

Imagine a family farming that same English land in 1750. A better harvest doesn't make them richer for long: more of their children survive, and by the time those children have families of their own, the land has to feed more people than before, pushing income right back down. Now picture that same family two hundred years later. Machines now do work that used to take dozens of laborers, output grows faster than the population ever could, and each generation ends up ahead of the last one not just fed, but genuinely wealthier.

That shift, from flat income across every generation to rising income across every generation, is a change so recent that economists only proved it happened within the last few decades. The article that follows is about how they proved it and what the proof revealed about which countries made the jump, and when.`,
    conceptSummary: `For most of history, any gain in production got absorbed by population growth, so income per person barely moved for centuries, economists call this the Malthusian trap. Around 1800, that pattern broke: output began growing faster than population, and small yearly gains compounded into massive increases in living standards within a few generations, something that had never happened before.`,
    conceptTakeaways: [
      "The Malthusian trap describes how, before roughly 1800, gains in production got absorbed by population growth instead of raising living standards.",
      "Sustained per-capita growth requires output to keep outrunning population growth, not just beat it once.",
      "Even a small annual growth rate compounds into enormous gains over several generations.",
      "The shift from flat to rising income per generation is historically very recent, not a permanent feature of human life.",
      "The same land and the same labor force can produce very different outcomes depending on whether technology is advancing faster than population."
    ],
    articleTitle: 'The 2000-Year Chart That Changed How We See History',
    articleText: `**Why did an economist spend decades reconstructing incomes from a time before anyone kept economic records?**
In 2001, an economist working in the Netherlands published a number nobody had ever seriously calculated before: what an average person living in the Roman Empire actually earned, converted into dollars anyone today could understand. Angus Maddison, based at the University of Groningen, believed nobody could really understand modern economic growth without knowing what came before it. In 1995 he published GDP estimates for 56 countries stretching back to 1820. Other economists called the project ambitious, some called it reckless. Maddison kept going anyway.

**How do you calculate a country's income from a period with no tax records, no censuses, and no GDP data at all?**
He pieced together whatever fragments survived — tithe records, wage receipts, harvest yields, population counts and checked them against later, better-documented periods to estimate backward from there. By 2001, he had pushed his estimates all the way back to year 1 of the Christian Era, covering roughly two thousand years in a single dataset.

**What did his numbers say about someone living in Egypt around the time of Jesus, compared to entire countries today?**
Maddison estimated Egypt's income per person at the time was worth roughly $1,100 a year in today's comparable dollars, higher than some countries manage right now. It was an uncomfortable finding: it meant a handful of modern countries hadn't yet caught up to income levels the ancient world had already reached.

**Was 1800 really some kind of magic turning point that hit every country on Earth at the same time?**
No. When Maddison's successors plotted the same chart country by country, the bend in the line landed in different centuries depending on where you looked. Britain's incomes started climbing around 1650, well over a century before most of Europe. Japan's bend came far later, around 1870, only after the country opened up and began industrializing. 1800 is really an average of many separate takeoffs, not one single moment.

**Why do economists still argue over numbers calculated from a period with barely any surviving records?**
Because the underlying sources really are thin, nobody was running a statistics office in the first century. Critics called Maddison's estimates "educated guesses" at best. His response was to publish anyway and let other researchers do better if they could. That's exactly what happened: after Maddison died in 2010, a group of his colleagues launched the Maddison Project to keep testing and revising his numbers.

**Does the story change at all today, decades after Maddison first drew that line?**
Not much. Researchers at Groningen still maintain the Maddison Project Database, and the latest version extends the same chart through 2022 across 169 countries. The shape hasn't changed: flat for most of recorded history, then a sharp bend starting somewhere around 1800. What has changed is the question people argue about, not whether the bend is real anymore, but why it took that long to arrive, and why a number of countries are still waiting for their own version of it.`,
    articleSummary: `Economist Angus Maddison spent decades reconstructing GDP per person going back to year 1, revealing that incomes stayed roughly flat for most of history before bending sharply upward around 1800, earlier in Britain, later in Japan. Critics doubted numbers built from so little data, so after Maddison died in 2010, colleagues launched the Maddison Project to keep testing and improving them.`,
    articleTakeaways: [
      "Economist Angus Maddison published GDP estimates for 56 countries back to 1820 in 1995, then extended them to year 1 CE in 2001.",
      "Maddison estimated Egypt's income per person around year 1 CE at roughly $1,100 a year in today's comparable dollars.",
      "The \"hockey stick\" bend in global income didn't happen everywhere at once: Britain's began around 1650, Japan's around 1870.",
      "Maddison's estimates were criticized as guesswork due to thin historical data, which he accepted as a starting point for others to improve.",
      "The Maddison Project, launched in 2010 after his death, still maintains and updates his data today, covering 169 countries through 2022."
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
        questionText: "What is the Malthusian trap?",
        options: [
          "A tax policy that punished farmers for producing too much food",
          "The pattern where gains in production get absorbed by population growth, keeping income per person flat",
          "A trade barrier between European countries before 1800",
          "A method economists use to measure GDP today"
        ],
        correctAnswer: "The pattern where gains in production get absorbed by population growth, keeping income per person flat",
        explanation: "- A) Wrong — the trap is a demographic and economic phenomenon, not a tax policy.\\n- B) Correct — higher output led to more surviving children, spreading the gain over more people and returning per-capita income to its previous level.\\n- C) Wrong — it is not a trade barrier.\\n- D) Wrong — it is a historical phenomenon, not a modern measurement method."
      },
      {
        questionText: "Why does even a small annual growth rate matter so much over time?",
        options: [
          "It doesn't — only large, sudden jumps in income matter",
          "Small growth rates compound, turning modest yearly gains into very large increases over generations",
          "Growth rates are only meaningful for one year at a time",
          "Small growth rates always shrink over time"
        ],
        correctAnswer: "Small growth rates compound, turning modest yearly gains into very large increases over generations",
        explanation: "- A) Wrong — large jumps are not required if growth is sustained.\\n- B) Correct — because growth compounds, a small advantage year after year results in massive gains across multiple generations.\\n- C) Wrong — the significance of growth is exactly its cumulative effect.\\n- D) Wrong — if sustained, they compound and multiply, rather than shrink."
      },
      {
        questionText: "Why did Angus Maddison extend his GDP estimates all the way back to year 1 CE?",
        options: [
          "He believed understanding modern growth required knowing what came before it",
          "A government agency required him to do so",
          "He wanted to prove that ancient economies were richer than modern ones",
          "He was only interested in Roman history"
        ],
        correctAnswer: "He believed understanding modern growth required knowing what came before it",
        explanation: "- A) Correct — Maddison recognized that measuring the modern takeoff required establishing the baseline that preceded it.\\n- B) Wrong — he did it independently, and many found it recklessly ambitious.\\n- C) Wrong — this wasn't his intent, though he did find some surprising historical highs.\\n- D) Wrong — he tracked many civilizations, not just Rome."
      },
      {
        questionText: "How did Maddison estimate income for periods with no GDP data or census records?",
        options: [
          "He assumed every country grew at the same fixed rate",
          "He pieced together fragments like tithe records, wages, and harvest yields, and checked them against better-documented later periods",
          "He relied only on estimates from modern economists",
          "He used satellite data to measure historical land use"
        ],
        correctAnswer: "He pieced together fragments like tithe records, wages, and harvest yields, and checked them against better-documented later periods",
        explanation: "- A) Wrong — he looked for specific historical variations, not fixed rates.\\n- B) Correct — he used historical proxies like tithes and yields, working backward from known data.\\n- C) Wrong — modern economists didn't have data for this period before he did the work.\\n- D) Wrong — satellite data does not exist for historical periods like year 1 CE."
      },
      {
        questionText: "What did Maddison's estimate for Egypt around year 1 CE reveal?",
        options: [
          "Egypt at that time had a lower income than any country has today",
          "Egypt's income was identical to Britain's in 1750",
          "Egypt's income could not be estimated at all",
          "Egypt at that time had a higher income per person than some countries manage today"
        ],
        correctAnswer: "Egypt at that time had a higher income per person than some countries manage today",
        explanation: "- A) Wrong — it was actually higher than some modern nations.\\n- B) Wrong — the article specifically contrasts it with modern struggling nations, not 1750s Britain.\\n- C) Wrong — he did estimate it, at roughly $1,100 per year.\\n- D) Correct — his $1,100 estimate was uncomfortably higher than what a handful of modern nations currently achieve."
      },
      {
        questionText: "Why didn't the \"hockey stick\" bend in income happen in every country at the same time?",
        options: [
          "Because different countries began sustained growth at different points, Britain around 1650, Japan around 1870",
          "Because the bend never actually happened outside of Britain",
          "Because Maddison only studied European countries",
          "Because population growth stopped everywhere in 1800 at once"
        ],
        correctAnswer: "Because different countries began sustained growth at different points, Britain around 1650, Japan around 1870",
        explanation: "- A) Correct — \"1800\" is just an average; the takeoff happened across a span of centuries depending on the country's specific history.\\n- B) Wrong — it happened in many nations, including Japan and others.\\n- C) Wrong — he eventually studied 169 countries globally.\\n- D) Wrong — population growth actually accelerated, but output finally grew faster."
      },
      {
        questionText: "Why did critics call Maddison's early estimates \"educated guesses\"?",
        options: [
          "Because he refused to share his data with other researchers",
          "Because he only used modern data and ignored history entirely",
          "Because there is very little surviving economic data from ancient and medieval periods",
          "Because his numbers were later proven completely wrong"
        ],
        correctAnswer: "Because there is very little surviving economic data from ancient and medieval periods",
        explanation: "- A) Wrong — he published his data specifically so others could test it.\\n- B) Wrong — his entire project was about historical data.\\n- C) Correct — since no one kept modern economic records in year 1, he had to extrapolate from very thin sources.\\n- D) Wrong — his numbers were debated and refined, but the core \"hockey stick\" shape held up."
      },
      {
        questionText: "(Scenario) You're an economic historian studying a country whose population and output both grew at the same pace for centuries, with income per person staying flat. What term would best describe this situation?",
        options: [
          "The Malthusian trap",
          "The hockey stick effect",
          "The Maddison Project",
          "Purchasing power parity"
        ],
        correctAnswer: "The Malthusian trap",
        explanation: "- A) Correct — this is the classic definition of the trap, where output growth just feeds more people without raising average living standards.\\n- B) Wrong — the hockey stick refers to escaping the trap.\\n- C) Wrong — this is the group measuring the data, not the phenomenon itself.\\n- D) Wrong — this is an exchange rate adjustment mechanism."
      },
      {
        questionText: "(Scenario) You're comparing two countries: one industrialized in the 1700s, the other in the late 1800s. Based on the article, what would you expect their historical income charts to look like?",
        options: [
          "Identical charts, since both eventually became rich",
          "The bend in each chart would appear at a different point in time, matching when each country's growth took off",
          "Neither chart would show any bend at all",
          "The chart of the earlier-industrializing country would show no growth at all"
        ],
        correctAnswer: "The bend in each chart would appear at a different point in time, matching when each country's growth took off",
        explanation: "- A) Wrong — they wouldn't be identical because the timing of the takeoff differs.\\n- B) Correct — the \"hockey stick\" bend happens locally depending on when a specific country began sustained growth.\\n- C) Wrong — they would both show a bend once growth took hold.\\n- D) Wrong — the earlier industrializer would show the bend earlier."
      },
      {
        questionText: "Why did the Maddison Project continue after Angus Maddison's death in 2010?",
        options: [
          "Because the University of Groningen closed its economics department",
          "Because his original data was later found to be entirely accurate and needed no changes",
          "Because a new law required continued GDP tracking",
          "Because his colleagues wanted to keep testing, revising, and extending his original estimates"
        ],
        correctAnswer: "Because his colleagues wanted to keep testing, revising, and extending his original estimates",
        explanation: "- A) Wrong — the department did not close; researchers there maintain the database.\\n- B) Wrong — the estimates were always meant to be revised and improved as more data surfaced.\\n- C) Wrong — it's an academic project, not a legal requirement.\\n- D) Correct — Maddison invited scrutiny, and his colleagues formed the project to continually update and improve the dataset."
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
