import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 4;
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
    title: 'What Does It Mean to Be Poor? (Absolute vs. Relative Poverty Lines)',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `A family living on $3 a day in Malawi and a family living on $30 a day in Denmark can both be counted as poor in their own country. That sounds odd until you realize there are two very different ways to draw a poverty line, and each one answers a different question.

An absolute poverty line sets a fixed cost for basic needs: food, shelter, clothing and anyone below that line is poor, no matter what's happening in the rest of the country. The World Bank's current line works this way: it's set at $3 a day, adjusted so that amount buys roughly the same basket of goods anywhere in the world. A relative poverty line works differently. It compares people to their own neighbors. In the European Union, you count as poor if you earn less than 60% of your country's median income, even if your actual income has gone up you can still fall into "relative poverty" if everyone around you got richer faster.

Take South Korea in the 1990s, growing faster than almost any economy on earth at the time. Under the World Bank's line, extreme poverty was disappearing year after year. Under a relative measure, the poverty rate barely moved, because incomes at the very bottom weren't keeping pace with incomes in the middle. Both numbers were true at the same time, describing the same country.

That's the real disagreement behind these two lines: does poverty mean not having enough to survive, or not having enough compared to everyone else? This lesson follows the people who built both measures, and an argument that still hasn't been settled.`,
    conceptSummary: `A poverty line can mean two different things. An absolute line, like the World Bank's $3 a day, checks whether someone can afford basic needs, no matter what's happening around them. A relative line, like the EU's 60%-of-median-income measure, checks how far someone has fallen behind their own neighbors. A country can improve on one measure while barely moving on the other.`,
    conceptTakeaways: [
      "An absolute poverty line is a fixed cost of basic needs; anyone below it is poor regardless of what's happening around them.",
      "A relative poverty line compares people to their own country's median income, commonly set at 60% of the median in the EU.",
      "The World Bank's absolute poverty line is currently $3 a day, adjusted for purchasing power across countries.",
      "A country's economy can grow while its relative poverty rate stays flat, if income gains aren't shared across the income scale.",
      "Absolute and relative poverty lines can move in different directions in the same country at the same time."
    ],
    articleTitle: 'The Story of "A Dollar a Day"',
    articleText: `**Why was Conable using a phrase that wasn't even in his own bank's report?**
In the summer of 1990, the president of the World Bank, Barber Conable, stood in front of reporters and used a phrase that didn't appear anywhere in the report he was presenting. Days before the press conference, Tim Cullen, the Bank's press secretary, was briefing Conable on the numbers. The new poverty line the researchers had settled on worked out to $370 a year. Cullen realized that translated neatly into a dollar a day, a much easier number for reporters and the public to picture. Conable liked it, used it in his opening remarks on July 5, 1990, and the phrase "dollar a day" spread from there, even though it was never written in the World Development Report itself.

**How did a team of researchers land on $370 a year as the number that would define poverty for the entire world?**
Lyn Squire, who directed that year's report, wanted a poverty line that couldn't be dismissed as something the Bank invented on its own. So economists Martin Ravallion, Gaurav Datt, and Dominique van de Walle collected the official poverty lines already used inside individual poor countries and converted them into one currency. Across a set of the world's poorest countries, those national lines clustered around the same figure: about $370 a year, or roughly a dollar a day.

**Why does the same "$3 a day" line count someone as poor in Malawi but say nothing about poverty in the United States?**
The line is adjusted using purchasing power parity, so a dollar is worth what it can actually buy in each country, not what it converts to at the currency exchange rate. That makes it useful for comparing the poorest people across poor countries. It was never built to describe poverty inside a rich country, where $3 a day wouldn't cover rent anywhere. The line has also moved over the decades, from $1 a day in 1985 prices to $1.25, then $1.90, then $2.15, and now $3.00 as of 2025, as prices around the world have changed.

**Why does a government in Europe define poverty in a completely different way than the World Bank does?**
The European Union tracks something else entirely: the share of people earning less than 60% of their own country's median income. This is a relative measure, built to capture how far someone has fallen behind their own neighbors, not whether they can afford food. A country can raise everyone's income and still see this number stay flat, because it only measures the gap between the bottom and the middle.

**What happens to a country's poverty numbers when its whole economy grows rich almost overnight?**
South Korea is the clearest case. Between the 1960s and 1990s, its economy grew fast enough that the World Bank's absolute poverty line all but disappeared there. But relative poverty didn't fall nearly as fast, because incomes at the bottom didn't rise as quickly as incomes in the middle and top. Two different lines, applied to the same country, told two different stories about the same growth.

**So which line is the "real" poverty line, has that argument ever actually been settled?**
No. The United Nations still tracks its Sustainable Development Goal on ending extreme poverty using the World Bank's absolute line, currently $3 a day. The European Union and most rich-country governments track relative poverty alongside it, because a family can clear the absolute line and still be falling behind everyone around them. Thirty-five years after Conable's press conference, both numbers are still published side by side, because neither one answers the whole question on its own.`,
    articleSummary: `In 1990, World Bank president Barber Conable used the phrase "dollar a day" for the first time, based on researchers finding poverty lines in poor countries clustered around $370 a year. That line has since risen to $3 a day, while the EU tracks a completely different measure, income relative to the middle. South Korea's growth shows why both numbers still matter, decades later.`,
    articleTakeaways: [
      "The phrase \"dollar a day\" was first used publicly by World Bank president Barber Conable on July 5, 1990.",
      "The original poverty line was based on national poverty lines from poor countries clustering around $370 a year.",
      "Economists Martin Ravallion, Gaurav Datt, and Dominique van de Walle built the research behind the original line, under Lyn Squire's direction.",
      "The World Bank's line has risen over time: from $1 a day in 1985 prices to $1.25, $1.90, $2.15, and now $3.00 as of 2025.",
      "South Korea's fast growth cut its absolute poverty rate sharply while its relative poverty rate moved far more slowly."
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
        questionText: "Why did Barber Conable use the phrase \"dollar a day\" even though it wasn't in the World Bank's own report?",
        options: [
          "The report's authors asked him to say it",
          "His press secretary suggested it as an easier way to present $370 a year",
          "He misread the report by mistake",
          "It was the official title of the report"
        ],
        correctAnswer: "His press secretary suggested it as an easier way to present $370 a year",
        explanation: "- A) Wrong — the researchers used $370, not a dollar a day.\\n- B) Correct — Tim Cullen realized $370 translated neatly to a dollar a day and suggested it.\\n- C) Wrong — he didn't misread it; it was a deliberate choice to simplify the number.\\n- D) Wrong — the phrase did not appear anywhere in the report."
      },
      {
        questionText: "How did researchers arrive at the original $370-a-year poverty line?",
        options: [
          "They asked people in rich countries what they thought poverty meant",
          "They averaged the incomes of every country in the world",
          "They collected national poverty lines from poor countries and found they clustered around that figure",
          "They picked a round number for simplicity"
        ],
        correctAnswer: "They collected national poverty lines from poor countries and found they clustered around that figure",
        explanation: "- A) Wrong — they looked at poor countries, not rich ones.\\n- B) Wrong — they looked at poverty lines, not average incomes.\\n- C) Correct — they converted national poverty lines into one currency and found they clustered around $370.\\n- D) Wrong — they derived it from actual data."
      },
      {
        questionText: "Why is the World Bank's poverty line adjusted using purchasing power parity?",
        options: [
          "So that a dollar reflects what it can actually buy in each country, not the exchange rate",
          "So richer countries pay more into the World Bank",
          "So the line can be compared to stock market prices",
          "So it matches the U.S. dollar exactly everywhere"
        ],
        correctAnswer: "So that a dollar reflects what it can actually buy in each country, not the exchange rate",
        explanation: "- A) Correct — this ensures the line measures the ability to afford a comparable basket of basic goods.\\n- B) Wrong — this is about measuring poverty, not World Bank funding.\\n- C) Wrong — it has nothing to do with stock prices.\\n- D) Wrong — PPP adjustments specifically account for differences in purchasing power, not just exchange rates."
      },
      {
        questionText: "Why doesn't the World Bank's absolute poverty line say much about poverty in a rich country like the United States?",
        options: [
          "The line was never designed to reflect living costs in a rich country",
          "Rich countries don't allow the World Bank to measure poverty there",
          "The line only applies to countries in Europe",
          "Rich countries don't have any poor people"
        ],
        correctAnswer: "The line was never designed to reflect living costs in a rich country",
        explanation: "- A) Correct — the absolute line measures extreme poverty in developing nations; $3 a day wouldn't cover basic rent in a rich country.\\n- B) Wrong — this is an economic limit of the measure, not a political ban.\\n- C) Wrong — it actually applies mostly to developing nations, not Europe.\\n- D) Wrong — rich countries do have poverty, but it is better measured by relative lines."
      },
      {
        questionText: "What does the EU's relative poverty measure actually track?",
        options: [
          "The number of people earning less than 60% of their country's median income",
          "The number of people earning less than $3 a day",
          "The total number of unemployed people in a country",
          "The average income across the entire European Union"
        ],
        correctAnswer: "The number of people earning less than 60% of their country's median income",
        explanation: "- A) Correct — the EU tracks this relative measure to see how far people fall behind their neighbors.\\n- B) Wrong — this is the World Bank's absolute measure.\\n- C) Wrong — unemployment is different from relative poverty.\\n- D) Wrong — it tracks poverty within individual countries based on their own medians."
      },
      {
        questionText: "(Scenario) A country's average income doubles over ten years, but the gains mostly go to people already in the middle and top of the income scale. What is most likely to happen to its relative poverty rate?",
        options: [
          "It will fall sharply, since everyone is richer",
          "It will stay roughly flat, since the bottom hasn't caught up to the middle",
          "It will become impossible to measure",
          "It will automatically match the absolute poverty rate"
        ],
        correctAnswer: "It will stay roughly flat, since the bottom hasn't caught up to the middle",
        explanation: "- A) Wrong — relative poverty measures the gap, not absolute wealth.\\n- B) Correct — if the bottom doesn't grow as fast as the median, the relative poverty rate won't fall.\\n- C) Wrong — it can still be measured.\\n- D) Wrong — the absolute poverty rate would likely fall, but the relative rate would not."
      },
      {
        questionText: "(Scenario) You're a government official deciding how to report your country's progress after a decade of strong economic growth. The absolute poverty rate has fallen sharply, but the relative poverty rate hasn't moved much. What does this combination suggest?",
        options: [
          "The data must be wrong, since both numbers should move together",
          "Growth has lifted people above basic survival needs, but income gaps within the country haven't closed",
          "The country has stopped being poor by every possible measure",
          "The relative poverty line must be miscalculated"
        ],
        correctAnswer: "Growth has lifted people above basic survival needs, but income gaps within the country haven't closed",
        explanation: "- A) Wrong — the two lines measure different things and can move independently.\\n- B) Correct — the absolute drop means basic needs are met, but the flat relative rate means inequality persists.\\n- C) Wrong — the high relative poverty rate means poverty still exists by that measure.\\n- D) Wrong — this is a common and accurately calculated scenario."
      },
      {
        questionText: "Why can South Korea's experience in the 1990s show two very different poverty stories at once?",
        options: [
          "Because one measure counts absolute survival needs and the other measures the gap to the country's own middle income",
          "Because the two measures use different currencies",
          "Because South Korea manipulated its own statistics",
          "Because relative poverty only applies to European countries"
        ],
        correctAnswer: "Because one measure counts absolute survival needs and the other measures the gap to the country's own middle income",
        explanation: "- A) Correct — fast growth wiped out absolute poverty but didn't close the gap with the median as quickly.\\n- B) Wrong — it's about the methodology, not the currency.\\n- C) Wrong — this is a real phenomenon, not manipulation.\\n- D) Wrong — relative poverty can be measured anywhere."
      },
      {
        questionText: "Why do the UN and the EU track two different kinds of poverty side by side instead of picking just one?",
        options: [
          "Because international organizations are required to publish multiple statistics",
          "Because each measure answers a different question, and neither one covers everything on its own",
          "Because the World Bank and the EU have never agreed on a single currency",
          "Because relative poverty is simply an older version of absolute poverty"
        ],
        correctAnswer: "Because each measure answers a different question, and neither one covers everything on its own",
        explanation: "- A) Wrong — they publish them because they are useful, not just required.\\n- B) Correct — absolute poverty measures basic survival, while relative poverty measures social inclusion.\\n- C) Wrong — it has nothing to do with agreeing on a currency.\\n- D) Wrong — they are conceptually different measures."
      },
      {
        questionText: "If a family's income rises above the World Bank's $3-a-day line but stays below 60% of their own country's median income, how would you describe their situation?",
        options: [
          "Not poor by either measure",
          "Poor by both measures equally",
          "Above the absolute poverty line, but still counted as poor by the relative measure",
          "This situation is impossible under either definition"
        ],
        correctAnswer: "Above the absolute poverty line, but still counted as poor by the relative measure",
        explanation: "- A) Wrong — they are still poor by the relative measure.\\n- B) Wrong — they are no longer poor by the absolute measure.\\n- C) Correct — they have cleared the basic survival threshold but are still falling behind their neighbors.\\n- D) Wrong — this is a very common situation."
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
