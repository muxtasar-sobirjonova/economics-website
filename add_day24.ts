import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 24;
  const track = "BEHAVIORAL_ECONOMICS";
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
        title: 'Why We Delay Important Decisions',
        conceptText: `Imagine your bank owes you $900. No conditions. No favor. Just your own money, waiting for you to ask for it. Most people don't ask right away. Some wait months. Some wait years. This isn't stupidity. It's basic economics.

Every time you delay something, your brain compares two things. On one side: the effort of doing it right now — a form, a call, some paperwork. On the other side: a reward or cost that arrives later. Your brain judges these unfairly. Effort today feels heavy. A reward tomorrow feels light, even when it's guaranteed. Economists call this present bias: we overvalue today and undervalue tomorrow, even when the math says we shouldn't.

This bias is harmless when "later" holds a reward — delay a free gift, and nothing bad happens, you just enjoy it later. But the instant "later" holds a cost instead, the same habit turns dangerous. Delay quietly becomes a bill that grows every month.

Same brain. Same habit. Two very different price tags — and most people never notice the difference until it costs them.

**REAL-WORLD EXAMPLE: The Same Country, Two Very Different Deadlines**

In Germany, close to ten million people file a tax return every year without being legally required to — because they expect a refund. For them, the deadline to claim their own money is years away. No countdown, no reminder, no penalty for waiting.

But for people who are legally required to file — the self-employed, for instance — the deadline arrives fast, and missing it comes with a growing monthly fee.

Same country. Same tax office. Same human habit of putting things off. One version of waiting is completely free. The other quietly gets more expensive every month. The article ahead breaks down exactly why the same government built it that way — and what it says about who a deadline is really designed to protect.`,
        conceptSummary: `We delay tasks because today's effort feels bigger than tomorrow's reward, even when that reward is guaranteed — economists call this present bias. Delay costs nothing when the future holds a reward, like an unclaimed refund. But once the future holds a debt instead, the same exact habit quietly turns expensive, adding penalties and interest month after month.`,
        conceptTakeaways: [
          "Present bias makes people overvalue today's effort and undervalue tomorrow's reward — even when that reward is certain, guaranteed money.",
          "Delay is free when the future holds a reward (an unclaimed refund) and costly when the future holds a debt (unpaid tax) — same habit, opposite price tag.",
          "Germany's ELSTER portal processed a record 63 million tax returns in 2023, but the last-minute rush at the deadline didn't shrink — only the paperwork got easier.",
          "Refund-seekers get four years to file; people with a legal obligation get until July 31 — that one design difference explains most of the waiting behavior.",
          "Late tax payments cost 0.25% of the amount owed per month, minimum €25 — a real, growing bill for the exact same delay that's completely free on the refund side."
        ],
        articleTitle: 'Why Does the Taxman Let You Wait Four Years to Take Back Your Own Money?',
        articleText: `Somewhere in Germany right now, a stranger is holding onto your money, and nobody is telling you to come get it.

It's called a tax refund. Your employer paid slightly too much tax on your behalf, following the rules exactly. The tax office knows it. You could file one form, wait a few weeks, and get paid. Roughly ten million Germans are owed money exactly like this, every single year. And here's the part that should surprise you: most of them don't rush to collect it.

**Why does nobody rush to collect free money?**

Because the system doesn't ask them to. If all you're doing is claiming a refund, German law gives you four years to file. Four years. No reminder letters. No penalty. No red countdown clock. The money simply waits, untouched, for as long as you forget about it.

**So what happens when the roles reverse?**

A completely different story. If you're legally required to file — say you're self-employed — your deadline is July 31 of the following year. Miss it, and the tax office charges a Verspätungszuschlag: 0.25% of what you owe, for every month you're late, with a minimum of €25 a month, no matter how small your bill is. Owe €4,000 and file five months late, and you've already added at least €50 on top of the tax itself. The exact same habit — waiting — suddenly has a price tag.

**Why would a government design it this way on purpose?**

Because the government isn't punishing laziness. It's protecting its own cash flow. Money that citizens owe the state needs a deadline and a penalty attached, or it might never show up. Money the state owes to citizens threatens nobody's budget, so there's no urgency, no interest paid for the wait, and no letter reminding you to claim it. The system isn't lazy or unfair by accident. It's built to protect whoever is already holding the money. Right now, in the refund case, that's the government.

**Does the government even follow its own rules?**

Not always. Between 2020 and 2023, Germany passed law after law pushing its own tax deadlines back because of the pandemic. Take the 2022 tax year: the normal July 31 deadline was moved to October 2, 2023 for people filing on their own — and pushed even further, to June 2, 2024, for people using a tax advisor. The same government that fines ordinary people for lateness was, itself, asking for more time, year after year.

**Did going digital fix any of this?**

You'd expect so. ELSTER, Germany's official online tax portal, now has more than 22 million registered users and processed a record 63 million tax returns in 2023 — no paper, no printing, no trip to the post office. Filing now takes minutes from a phone. And yet the last-minute rush before every deadline never disappeared. People didn't start filing earlier just because it got easier. They simply used the extra convenience to relax further into the same old habit. The friction vanished. The procrastination stayed exactly where it was.

**So who's actually being irrational here?**

Nobody, really. Waiting to collect a refund costs you nothing but time, so waiting is, technically, the correct move — even though it looks lazy from the outside. Waiting to pay a debt costs real money every single month, so the same habit that was harmless a moment ago becomes an active mistake. Same brain. Same delay. Two totally different price tags, because one side of the system charges for waiting, and the other doesn't.

**What does this actually tell us?**

It tells us procrastination isn't a personal flaw you fix with willpower alone. It's often a rational reaction to an environment that makes waiting free in one direction and expensive in the other. Before you blame yourself for avoiding a form, a bill, or an email today, ask one honest question first: is delay actually costing me anything right now? If the answer is genuinely no, you're not procrastinating out of weakness — you're just responding correctly to a system that never bothered charging you for it. And if the answer is yes, the clock you've been ignoring has already started running.`,
        articleSummary: `Germany's tax system reveals procrastination at national scale: refund-seekers get four penalty-free years to claim their own money, while people who owe taxes face a monthly fee for the same delay. Even the government pushes back its own deadlines during crises. Digital filing got faster, but the last-minute rush never shrank — convenience didn't cure the habit, it just made waiting more comfortable.`,
        articleTakeaways: [
          "Present bias makes people overvalue today's effort and undervalue tomorrow's reward — even when that reward is certain, guaranteed money.",
          "Delay is free when the future holds a reward (an unclaimed refund) and costly when the future holds a debt (unpaid tax) — same habit, opposite price tag.",
          "Germany's ELSTER portal processed a record 63 million tax returns in 2023, but the last-minute rush at the deadline didn't shrink — only the paperwork got easier.",
          "Refund-seekers get four years to file; people with a legal obligation get until July 31 — that one design difference explains most of the waiting behavior.",
          "Late tax payments cost 0.25% of the amount owed per month, minimum €25 — a real, growing bill for the exact same delay that's completely free on the refund side."
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
        questionText: "If the German government started paying interest on delayed refunds, what would likely happen to filing behavior?",
        options: [
          "People would file faster to get the interest immediately.",
          "People would file slower because the delay now acts as a high-yield savings account.",
          "People would file exactly the same because interest doesn't matter.",
          "People would stop filing altogether because it becomes too complicated."
        ],
        correctAnswer: "People would file slower because the delay now acts as a high-yield savings account.",
        explanation: "If the government pays interest, delaying becomes financially rewarding. Instead of a free delay, it becomes a profitable delay, encouraging people to leave the money there longer as an investment."
      },
      {
        questionText: "Who usually faces strict, costly deadlines in a financial system like taxation?",
        options: [
          "The party that is owed a refund.",
          "The party that owes money to the central authority.",
          "Neither party, deadlines are applied equally.",
          "Only people using tax advisors."
        ],
        correctAnswer: "The party that owes money to the central authority.",
        explanation: "The person owing money loses money by waiting (paying penalties). Systems are designed to protect the cash flow of the entity holding the power, so they enforce penalties on those who owe them money, not on those they owe."
      },
      {
        questionText: "The Verspätungszuschlag is 0.25% per month, with a €25 minimum. At what unpaid tax amount does the 0.25% exactly equal the €25 minimum?",
        options: [
          "€2,500",
          "€5,000",
          "€10,000",
          "€1,000"
        ],
        correctAnswer: "€10,000",
        explanation: "0.25% of €10,000 is €25 (10,000 * 0.0025 = 25). For any debt below €10,000, the €25 minimum fee is actually much higher than 0.25%, heavily penalizing small debts."
      },
      {
        questionText: "What is the behavioral effect of a government repeatedly extending tax deadlines during a crisis?",
        options: [
          "Citizens become more anxious and file earlier.",
          "Citizens learn that deadlines are flexible and expect future extensions, increasing procrastination.",
          "Citizens completely forget how to file taxes.",
          "The government collects taxes faster."
        ],
        correctAnswer: "Citizens learn that deadlines are flexible and expect future extensions, increasing procrastination.",
        explanation: "If a deadline is constantly shifted, it loses its credibility. People learn that the 'hard deadline' is actually soft, which encourages further delay."
      },
      {
        questionText: "What does the persistent last-minute rush on the ELSTER portal demonstrate about procrastination?",
        options: [
          "Making a task easier and faster completely eliminates procrastination.",
          "People prefer paper forms over digital filing.",
          "Convenience alone does not cure the habit of waiting; it just makes the final rush easier.",
          "Digital systems are slower than manual systems."
        ],
        correctAnswer: "Convenience alone does not cure the habit of waiting; it just makes the final rush easier.",
        explanation: "Even though the friction vanished, the behavior stayed the same. People used the extra convenience to relax further into their habit, proving procrastination is about time-valuation, not just effort."
      },
      {
        questionText: "If a government wanted to encourage faster filing for refunds, which method aligns best with human psychology (present bias)?",
        options: [
          "Extend the refund window to ten years.",
          "Shorten the window and threaten them with losing the money entirely after one year.",
          "Offer a small immediate bonus for filing early.",
          "Charge a fee for claiming a refund."
        ],
        correctAnswer: "Offer a small immediate bonus for filing early.",
        explanation: "Present bias means people value immediate rewards. A small immediate bonus provides a strong present incentive to overcome the hurdle of effort today, rather than using distant threats."
      },
      {
        questionText: "What does the extended deadline for clients using a tax advisor primarily suggest about delay in this system?",
        options: [
          "People with advisors are inherently more responsible with deadlines.",
          "The system allows people with resources to effectively buy the right to procrastinate longer.",
          "Tax advisors always file on the first day possible.",
          "Extending the deadline makes taxes cheaper."
        ],
        correctAnswer: "The system allows people with resources to effectively buy the right to procrastinate longer.",
        explanation: "It shows that those who can afford an advisor are granted a systemic allowance to delay further, proving that procrastination can be purchased as a luxury in this structure."
      },
      {
        questionText: "Why might an easily extendable deadline cause more last-minute panic than having no deadline?",
        options: [
          "It provides a false sense of security until the last minute, turning action into merely asking for more time.",
          "People hate writing letters.",
          "Deadlines always reduce stress.",
          "No deadline makes people file immediately."
        ],
        correctAnswer: "It provides a false sense of security until the last minute, turning action into merely asking for more time.",
        explanation: "An easily extendable deadline shifts the immediate goal from 'doing the task' to 'delaying the task.' This reinforces present bias by providing a low-effort escape hatch today."
      },
      {
        questionText: "If procrastination is a rational response to free delays, who is most responsible for the massive backlog of unclaimed refunds?",
        options: [
          "The tax preparation software companies.",
          "The citizens, for lacking willpower.",
          "The system's design, which provides a four-year window with no cost for waiting.",
          "The banking system."
        ],
        correctAnswer: "The system's design, which provides a four-year window with no cost for waiting.",
        explanation: "Behavioral economics shows that systems shape behavior. If waiting has zero cost for four years, it is the system's choice architecture, not individual moral failing, that produces the backlog."
      },
      {
        questionText: "If a banking app showed a visually 'overdue' reminder for an unclaimed refund, but attached no financial penalty, would it increase filing rates?",
        options: [
          "No, because without a financial penalty, visual cues have zero effect on humans.",
          "Yes, because it increases the psychological friction and visibility of the 'loss' of not having the money yet.",
          "No, because people don't look at banking apps.",
          "Yes, because it legally forces them to file."
        ],
        correctAnswer: "Yes, because it increases the psychological friction and visibility of the 'loss' of not having the money yet.",
        explanation: "Present bias can be countered by making the abstract future cost feel present and emotionally vivid. A growing 'overdue' signal creates psychological discomfort (friction) right now, prompting action even without a financial penalty."
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
