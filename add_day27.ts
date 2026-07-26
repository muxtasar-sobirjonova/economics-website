import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 27;
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
        title: 'Why Our Future Plans Change Over Time',
        conceptText: `Every January, gym floors around the world fill with new faces on twelve-month contracts, each one certain that this year they will finally become the person who shows up. By March, the floor thins back out. The billing does not.

January says: every day, without exception. March says: maybe next week, work has been mad.

Same person, different month, contradictory plans — and both versions were completely sincere at the time they were spoken. Economist Robert Strotz described this in 1955 as time inconsistency: a preference that is perfectly rational the moment it's stated can flatly contradict what the same person prefers once the future actually arrives. Decades later, David Laibson refined the mathematics of it, showing that people don't discount the future evenly — they apply a sharp, extra penalty to anything that has to happen right now, and a much gentler one to identical effort scheduled for later. The plan always sounds reasonable in the planning. It's the doing that keeps losing the argument.

This isn't a flaw unique to gym-goers. It shows up anywhere a decision made in cold blood has to survive contact with a warmer, more tired, more distracted version of the same person. The article ahead follows that contradiction into the one industry built almost entirely around selling it.`,
        conceptSummary: `Time-inconsistent preferences mean the plan you make today can flatly contradict what you actually want once the future arrives — economist Robert Strotz first described this in 1955. David Laibson later showed people discount immediate effort far more harshly than identical effort scheduled for later, which is why plans always sound better in the planning than in the doing.`,
        conceptTakeaways: [
          "Time inconsistency means a decision that's rational when planned can directly contradict what the same person prefers once the moment to act actually arrives.",
          "Economist Robert Strotz named this pattern in 1955; David Laibson later showed people discount immediate effort more harshly than identical effort scheduled for later."
        ],
        articleTitle: 'The Business Model That Bets Against You',
        articleText: `Three American health clubs once handed over three years of billing and attendance records to two economists, Stefano DellaVigna and Ulrike Malmendier, covering 7,752 members. What the data showed became one of the most quoted findings in behavioral economics, and it explains a business model still running in gyms from Perth to Brisbane today.

Members who chose a flat monthly contract of more than $70 attended, on average, 4.3 times a month. Do the arithmetic, and each visit cost them over $17 — despite a pay-per-visit pass sitting on the same front desk for $10 a visit. Across a full membership, the average flat-fee member left roughly $600 on the table compared to what they would have paid simply showing up and paying per session. This is not a rounding error. It's people paying extra, every month, for a plan they use less than a pay-as-you-go option would have cost them.

January says: a locked-in annual plan proves I'm serious. March says: I haven't been in six weeks, but cancelling feels like admitting defeat.

Here is the finding that should unsettle anyone who assumes flexibility always helps: members on the flexible, cancel-any-month contract were 17% more likely to still be paying a year later than members locked into a rigid annual contract. The annual members had a fixed date circled on a calendar forcing a decision — renew or don't. The monthly members never got that forcing moment. There was always a version of next month in which they'd surely start going again, so there was never a month in which quitting felt urgent. Flexibility, which should have made it easier to walk away the moment the gym stopped serving them, instead removed the one deadline that might have made them stop and ask why they were still paying.

No gym owner is confused about any of this, and none of them consider it a flaw in the model. A club with more members than treadmills only works financially if a large share of those members pay and don't come — the business is not selling square footage of floor space, it's selling a membership card to the January version of a person while quietly pricing in the March version's absence. Nietzsche once asked whether a person could bear to relive an experience infinitely, exactly as it happened, as a test of whether it was truly wanted. Put the same test to a lapsed gym membership — would you choose, forever, to keep paying for a floor you no longer walk on — and the honest answer is usually the reason the card stays in a drawer instead of getting cancelled.

Australia's own gym industry runs on the identical engine, at industry scale rather than academic sample size: annual membership churn sits somewhere between 25% and 35%, which means roughly a third of any gym's paying members will be gone within twelve months — and the operators know this going in, price around it, and build entire retention departments to slow it, not eliminate it. Nobody in the industry is confused about why. A membership isn't really a promise to exercise. It's a bet, placed by the gym, that the version of you who signs the contract in a moment of resolve will keep outvoting the version of you who has to actually put on the shoes.

Warren Buffett has one durable answer to this trap, borrowed from an entirely different arena: remove the decision from the moment it would be weakest. He has said the hardest investment discipline is refusing to act on daily impulse — building rules in advance so the version of yourself reading tomorrow's headlines never gets a vote. Applied to a gym membership, the lesson is uncomfortable but simple: the contract you need isn't the one that's easiest to sign in January. It's the one that makes March, not January, the version of you who's actually in charge.`,
        articleSummary: `A study of three U.S. gyms found flat-fee members paid over $17 per visit when a $10 pass sat at the same desk, losing roughly $600 across a membership — and flexible monthly members stayed enrolled 17% longer than annual members, because they never faced a forced renewal date. Australia's 25-35% annual churn runs on the same engine: a membership is a bet against your future self, priced in advance.`,
        articleTakeaways: [
          "In DellaVigna and Malmendier's study, flat-fee gym members paid over $17 per visit on average, versus a $10 pay-per-visit option at the same clubs, losing roughly $600 across a membership.",
          "Counterintuitively, members on flexible monthly contracts stayed enrolled 17% longer than members locked into rigid annual contracts, because they never hit a forced renewal decision.",
          "Australia's real-world gym churn rate of 25-35% annually shows the same pattern at industry scale: a membership functions as a bet against the member's future follow-through, priced in from the start."
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
        questionText: "What does 'time inconsistency' mean in behavioral economics?",
        options: [
          "A plan that takes too long to execute.",
          "A preference that is rational when stated but contradicts what the person prefers when the future arrives.",
          "A schedule that changes randomly every week.",
          "A tendency to arrive late to appointments."
        ],
        correctAnswer: "A preference that is rational when stated but contradicts what the person prefers when the future arrives.",
        explanation: "Time inconsistency describes a person whose plans made today flatly contradict their actual preferences when the moment of action arrives."
      },
      {
        questionText: "Which economist first described time inconsistency in 1955?",
        options: [
          "David Laibson",
          "Richard Thaler",
          "Robert Strotz",
          "Cass Sunstein"
        ],
        correctAnswer: "Robert Strotz",
        explanation: "Robert Strotz first described the concept of time inconsistency in 1955."
      },
      {
        questionText: "How did David Laibson refine the mathematics of time inconsistency?",
        options: [
          "By proving that people do not value time at all.",
          "By showing that people apply a sharp, extra penalty to immediate effort compared to identical effort scheduled for later.",
          "By demonstrating that people are perfectly rational actors.",
          "By calculating the exact monetary cost of a gym membership."
        ],
        correctAnswer: "By showing that people apply a sharp, extra penalty to immediate effort compared to identical effort scheduled for later.",
        explanation: "Laibson showed that people discount the future unevenly, punishing immediate effort heavily while viewing future effort much more gently."
      },
      {
        questionText: "In DellaVigna and Malmendier's study, what was the average cost per visit for members who chose a flat monthly contract of over $70?",
        options: [
          "Under $5",
          "Exactly $10",
          "Over $17",
          "$70"
        ],
        correctAnswer: "Over $17",
        explanation: "The average flat-fee member attended 4.3 times a month, meaning each visit cost them over $17, despite a $10 pay-per-visit option being available."
      },
      {
        questionText: "What was the financial result for the average flat-fee member across a full membership, compared to a pay-as-you-go option?",
        options: [
          "They saved roughly $600.",
          "They broke even.",
          "They lost roughly $600 on the table.",
          "They earned a rebate from the gym."
        ],
        correctAnswer: "They lost roughly $600 on the table.",
        explanation: "Members paid extra every month for a plan they used less frequently than expected, leaving roughly $600 on the table."
      },
      {
        questionText: "According to the study, which type of contract resulted in members staying enrolled 17% longer?",
        options: [
          "The rigid annual contract.",
          "The flexible, cancel-any-month contract.",
          "The pay-per-visit pass.",
          "The lifetime membership."
        ],
        correctAnswer: "The flexible, cancel-any-month contract.",
        explanation: "Counterintuitively, members on the flexible contract stayed 17% longer because they never faced a forced renewal date that would compel them to re-evaluate their attendance."
      },
      {
        questionText: "Why do gym operators financially rely on members who pay but don't attend?",
        options: [
          "Because the government subsidizes empty gyms.",
          "Because a club with more members than treadmills only works if a large share of members pay without using the facility.",
          "Because insurance requires gyms to remain mostly empty.",
          "Because they want to avoid wear and tear on the equipment."
        ],
        correctAnswer: "Because a club with more members than treadmills only works if a large share of members pay without using the facility.",
        explanation: "The business model prices in the absence of the 'March version' of the member. If everyone showed up, the gym couldn't sustain its membership levels physically."
      },
      {
        questionText: "What is the typical annual membership churn rate in Australia's gym industry?",
        options: [
          "1% to 5%",
          "10% to 15%",
          "25% to 35%",
          "50% to 60%"
        ],
        correctAnswer: "25% to 35%",
        explanation: "The article notes that annual membership churn in Australia sits between 25% and 35%, which operators expect and build retention departments to slow down."
      },
      {
        questionText: "What is the primary psychological reason the flexible monthly members didn't cancel when they stopped going?",
        options: [
          "They forgot they had a membership.",
          "There was always a version of 'next month' where they would surely start going again, removing any urgency to quit.",
          "The cancellation fees were too high.",
          "They were locked into a multi-year agreement."
        ],
        correctAnswer: "There was always a version of 'next month' where they would surely start going again, removing any urgency to quit.",
        explanation: "Without a forcing moment (like a fixed renewal date), members kept telling themselves they would return 'next month,' delaying the decision to cancel indefinitely."
      },
      {
        questionText: "How does Warren Buffett's investment discipline relate to the gym membership trap?",
        options: [
          "He advises buying gym stocks instead of memberships.",
          "He recommends building rules in advance so the weaker, impulsive version of yourself doesn't get a vote when the moment arrives.",
          "He suggests negotiating cheaper gym rates in January.",
          "He believes flexibility is the key to all financial success."
        ],
        correctAnswer: "He recommends building rules in advance so the weaker, impulsive version of yourself doesn't get a vote when the moment arrives.",
        explanation: "Buffett removes the decision from the moment it would be weakest. Applied to a gym, it means choosing a contract that makes your future self (March), not your overly optimistic self (January), in charge."
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
