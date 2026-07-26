import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 17;
  const tag = "Week 4"; // Or whichever week, we'll leave it as is or default

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>A candle in a dark room transforms the space completely. That same candle, lit in a stadium already blazing with floodlights, changes almost nothing. Human perception doesn't respond to absolute amounts of light — it responds to proportional change relative to the existing level. Money works the same way inside our heads.</p>

<p>This is <strong>diminishing sensitivity</strong>, another pillar of Kahneman and Tversky's prospect theory: the psychological impact of a gain or loss shrinks as the starting amount grows larger. The jump from $0 to $100 feels enormous. The jump from $10,000 to $10,100 — the same $100 — barely registers, even though the actual value added is identical in both cases.</p>

<p>Imagine two job offers: one raises your $20,000 salary to $20,100, the other raises your $200,000 salary to $200,100. Both are $100 raises. Neither will change your life. But the first will likely register as noticeably more meaningful than the second — not because the money is worth more, but because it represents a larger proportional shift against a smaller starting reference point.</p>

<p>This same shrinking sensitivity to fixed dollar amounts helps explain a much stranger phenomenon: why people will pay real, meaningful money for a lottery ticket with astronomically poor odds, chasing a jackpot that, mathematically, they will almost certainly never see.</p>`;

  const conceptSummary = `Diminishing sensitivity means the psychological impact of a gain or loss shrinks as the base amount grows. A $100 change feels large moving from $0 to $100, but nearly unnoticeable moving from $10,000 to $10,100, even though the dollar value is identical. This principle, part of Kahneman and Tversky's prospect theory, shapes decisions from salary raises to why enormous, unlikely jackpots feel more thrilling than their odds justify.`;

  const conceptTakeaways = [
    "Diminishing sensitivity means equal dollar changes feel smaller as the starting amount increases.",
    "The jump from $0 to $100 feels far larger than the jump from $10,000 to $10,100, despite being the same $100.",
    "This principle is a core part of Kahneman and Tversky's prospect theory value function.",
    "Diminishing sensitivity applies to both gains and losses — large existing amounts blunt the felt impact of additional change.",
    "It helps explain why people chase disproportionately large, low-probability rewards, since a huge jackpot doesn't feel proportionally \"blunted\" the way ordinary income changes do."
  ];

  const articleTitle = "Why Millions Buy Lottery Tickets in Spain's \"El Gordo\" Lottery (Spain)";
  
  const articleText = `<p>Spain's Christmas lottery, El Gordo, distributes more prize money than any other lottery on Earth. <strong>So why do millions of Spaniards buy tickets with such long odds every single year?</strong><br>
Because the value of an enormous jackpot doesn't shrink in people's minds the way ordinary money does. Diminishing sensitivity blunts how much an extra $100 matters once you already have $10,000 — but a jump from ordinary life to several million euros doesn't get blunted the same way, because there's no comparable reference point sitting nearby to shrink it down.</p>

<p><strong>How big is El Gordo actually, and how long has it been running?</strong><br>
El Gordo de Navidad has run continuously since 1812, making it one of the oldest lotteries in the world, and its total prize pool regularly exceeds €2 billion, distributed across thousands of smaller prizes in addition to the top jackpot. The drawing, broadcast live every December 22nd, is a genuine national tradition rather than a niche gambling event.</p>

<p><strong>Why do so many Spaniards buy a "décimo" (a tenth-share ticket) instead of a whole ticket?</strong><br>
A décimo costs a fraction of a full ticket's price, letting friends, families, and entire workplaces pool money and split a potential win. This spreads the cost thin enough that even a losing ticket represents a trivial, forgettable amount, while a winning share still delivers a life-changing sum split among a group — the low individual cost keeps the "starting point" for the bet small, which matters for how the potential gain gets processed psychologically.</p>

<p><strong>Why does the jump from winning nothing to winning even a modest prize feel more significant than the jump from an already-large win to an even larger one?</strong><br>
Diminishing sensitivity predicts exactly this pattern: the difference between €0 and a modest four-figure prize feels enormous, while the difference between, say, a €2 million prize and a €4 million prize barely registers emotionally, even though it's a far larger absolute sum. That's why lottery marketing leans so heavily on the emotional jump from "ordinary life" to "any win at all," rather than on the mathematics of the top prize's exact size.</p>

<p><strong>If the odds of the top prize are roughly 1 in 100,000, why doesn't that discourage ticket sales?</strong><br>
Because people don't process tiny probabilities the way they process money. A near-impossible chance of an enormous, life-altering sum doesn't get judged the same way as a near-certain chance of an ordinary sum — the emotional weight of "this could change everything" overwhelms the cold calculation of how unlikely that change actually is. Spaniards buying décimos aren't miscalculating the odds so much as responding to a payoff that feels qualitatively different from ordinary income.</p>

<p><strong>What does El Gordo reveal about how humans value extreme, unlikely amounts of money?</strong><br>
That the value function isn't a straight line. Ordinary raises and ordinary losses get compressed by diminishing sensitivity the larger they get — but jackpots operate almost outside that compression, because there's no larger existing sum nearby to make them feel smaller. El Gordo's genius isn't its odds. It's that it sells a jump too large for diminishing sensitivity to blunt.</p>`;

  const articleSummary = `Spain's El Gordo lottery, running since 1812 with prize pools regularly exceeding €2 billion, sells millions of shared "décimo" tickets despite roughly 1-in-100,000 odds for the top prize. Diminishing sensitivity explains part of the appeal: ordinary gains get psychologically compressed as amounts grow, but a life-changing jackpot has no nearby reference point to shrink it, so it keeps feeling enormous no matter how unlikely it is.`;

  const articleTakeaways = [
    "El Gordo de Navidad has run since 1812 and regularly distributes more than €2 billion in prizes, broadcast live every December 22nd.",
    "Spaniards commonly buy a décimo (a tenth-share ticket), spreading cost and prize money across groups.",
    "Diminishing sensitivity means ordinary financial changes feel smaller as the base amount grows, but this compression doesn't apply the same way to life-changing jackpots.",
    "The felt difference between winning nothing and winning something is far larger than the felt difference between two large prize amounts.",
    "People often respond more to the emotional size of a potential jackpot than to the mathematical unlikelihood of winning it."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Why Small Changes Feel Different Depending on the Situation",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
      }
    });
    console.log(`Updated lesson content for day \${dayOrder}`);
  }

  // Quizzes
  const quiz = await prisma.quiz.findFirst({ where: { dayOrder } });
  
  if (quiz) {
    // Delete existing questions
    await prisma.quizQuestion.deleteMany({
      where: { quizId: quiz.id }
    });

    const questions = [
      {
        questionText: "What does diminishing sensitivity predict about the felt difference between a $0-to-$100 gain and a $10,000-to-$10,100 gain?",
        options: [
          "Both gains feel identical since the dollar amount is the same",
          "The $0-to-$100 gain feels psychologically larger, even though both represent an identical $100 increase",
          "The $10,000-to-$10,100 gain always feels larger due to the bigger base amount",
          "Diminishing sensitivity only applies to losses, not gains"
        ],
        correctAnswer: "The $0-to-$100 gain feels psychologically larger, even though both represent an identical $100 increase",
        explanation: "As the starting base grows ($0 vs $10,000), the psychological impact of the exact same absolute change ($100) diminishes."
      },
      {
        questionText: "Why does a lottery jackpot resist the usual compression effect of diminishing sensitivity?",
        options: [
          "Because jackpots are always taxed differently",
          "Because there is no comparable, nearby reference point that would make an enormous, life-changing sum feel smaller by comparison",
          "Because lottery winnings are not considered money by the brain",
          "Because diminishing sensitivity never applies to any gain above $1,000"
        ],
        correctAnswer: "Because there is no comparable, nearby reference point that would make an enormous, life-changing sum feel smaller by comparison",
        explanation: "A massive jump to millions of dollars has no nearby baseline to blunt its impact, so it feels overwhelmingly huge compared to ordinary marginal gains."
      },
      {
        questionText: "What is a \"décimo\" in the context of El Gordo, and why is it psychologically relevant to this lesson?",
        options: [
          "A décimo is the full-price ticket, and it has no psychological relevance",
          "A décimo is a tenth-share ticket that keeps individual cost low, which matters because it keeps the \"starting point\" small relative to a potential enormous win",
          "A décimo guarantees a win for every buyer",
          "A décimo is a special prize awarded only to first-time buyers"
        ],
        correctAnswer: "A décimo is a tenth-share ticket that keeps individual cost low, which matters because it keeps the \"starting point\" small relative to a potential enormous win",
        explanation: "By keeping the cost trivial, buyers focus entirely on the outsized potential gain rather than feeling a meaningful \"loss\" if the ticket doesn't win."
      },
      {
        questionText: "Based on diminishing sensitivity, why might a $500 loss feel more painful to someone with $1,000 in savings than to someone with $100,000 in savings?",
        options: [
          "Because the $500 loss is objectively worth more to the wealthier person",
          "Because the same absolute loss represents a much larger proportional change relative to a smaller reference point, making it feel more significant",
          "Because wealthy people are incapable of feeling losses",
          "Because diminishing sensitivity only applies to gains"
        ],
        correctAnswer: "Because the same absolute loss represents a much larger proportional change relative to a smaller reference point, making it feel more significant",
        explanation: "The larger the starting reference point ($100k vs $1k), the smaller the psychological blow of losing $500."
      },
      {
        questionText: "A charity is deciding how to frame a fundraising ask. Based on diminishing sensitivity, which is likely to generate a stronger reaction: asking a donor who has already given $10,000 this year for an additional $50, or asking a brand-new donor who has given $0 for their first $50?",
        options: [
          "Both asks will feel identical to each donor",
          "The new donor's first $50 is likely to feel more significant, since it represents a jump from a $0 reference point rather than a marginal addition to an already-large total",
          "The existing donor's additional $50 will always feel larger due to their giving history",
          "Neither donor will notice a $50 request"
        ],
        correctAnswer: "The new donor's first $50 is likely to feel more significant, since it represents a jump from a $0 reference point rather than a marginal addition to an already-large total",
        explanation: "A new donation is a jump from zero, whereas an extra $50 on top of $10,000 feels negligible due to diminishing sensitivity."
      },
      {
        questionText: "You're designing a rewards program and can offer either (a) a guaranteed $20 discount to every customer, or (b) a small chance of winning a $50,000 prize with the same expected value. Based on diminishing sensitivity and this lesson's concepts, which is more likely to generate stronger excitement, even if the expected payout is mathematically similar?",
        options: [
          "The guaranteed $20 discount, since certainty is always preferred",
          "The lottery-style $50,000 prize chance, since an enormous, rare sum resists the psychological compression that a small guaranteed gain would experience",
          "Both options will generate identical excitement",
          "Customers will ignore both offers equally"
        ],
        correctAnswer: "The lottery-style $50,000 prize chance, since an enormous, rare sum resists the psychological compression that a small guaranteed gain would experience",
        explanation: "The outsized potential prize captures attention precisely because it dwarfs everyday amounts, circumventing normal sensitivity limits."
      },
      {
        questionText: "A company gives a $100 year-end bonus to two employees: one who earns $30,000/year, and one who earns $300,000/year. Based on diminishing sensitivity, which employee is likely to react more strongly to the identical $100 bonus?",
        options: [
          "The $300,000 earner, since larger salaries always produce larger reactions",
          "The $30,000 earner, since the same $100 represents a larger proportional change against a smaller reference point",
          "Both employees will react with exactly equal intensity",
          "Neither employee will notice a $100 bonus"
        ],
        correctAnswer: "The $30,000 earner, since the same $100 represents a larger proportional change against a smaller reference point",
        explanation: "The $100 is a much smaller proportional increase for the person with the $300k reference point, blunting its impact."
      },
      {
        questionText: "If a national lottery reduced its top prize from €2 billion to €200 million (still an enormous, life-changing sum for almost anyone), what would diminishing sensitivity predict about ticket sales?",
        options: [
          "Ticket sales would collapse to zero, since €200 million is not \"enough\"",
          "Ticket sales would likely remain strong, since both amounts vastly exceed any nearby reference point and are processed as similarly life-changing, despite the tenfold difference in actual value",
          "Ticket sales would increase, since smaller jackpots are always more appealing",
          "Diminishing sensitivity predicts no relationship between prize size and ticket sales"
        ],
        correctAnswer: "Ticket sales would likely remain strong, since both amounts vastly exceed any nearby reference point and are processed as similarly life-changing, despite the tenfold difference in actual value",
        explanation: "Above a certain extreme threshold, the difference between millions and billions becomes less meaningful to our brain because both simply mean \"more money than I can imagine.\""
      },
      {
        questionText: "A financial advisor tells a client who just lost $200 out of a $500 emergency fund that \"it's not a big deal, you still have plenty of savings elsewhere.\" Why might this reasoning fail to reduce the client's distress, based on diminishing sensitivity?",
        options: [
          "Because the advisor's math is objectively wrong",
          "Because diminishing sensitivity is judged relative to the specific account or mental category (the emergency fund) the loss came from, not the client's total net worth elsewhere",
          "Because losses always feel identical regardless of context",
          "Because clients never trust financial advisors"
        ],
        correctAnswer: "Because diminishing sensitivity is judged relative to the specific account or mental category (the emergency fund) the loss came from, not the client's total net worth elsewhere",
        explanation: "People evaluate gains and losses locally against specific mental accounts. Losing nearly half of one account feels drastic, even if total net worth is high."
      },
      {
        questionText: "Why might offering someone a small, guaranteed prize of $10 feel almost as motivating to design as a marketing incentive as offering a 1-in-1,000 chance at $10,000, even though the expected value is identical?",
        options: [
          "Because guaranteed and probabilistic rewards are always processed identically by the brain",
          "Because diminishing sensitivity and the emotional weight of rare, large sums mean both a certain small prize and a rare enormous one can feel disproportionately motivating compared to their strict expected value",
          "Because $10 and $10,000 are mathematically equivalent",
          "Because customers always prefer guaranteed rewards over probabilistic ones"
        ],
        correctAnswer: "Because diminishing sensitivity and the emotional weight of rare, large sums mean both a certain small prize and a rare enormous one can feel disproportionately motivating compared to their strict expected value",
        explanation: "The emotional pull of a giant jackpot outweighs cold expected-value calculations, making lottery-style rewards uniquely motivating."
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
    console.log(`Updated quiz questions for day \${dayOrder}`);
  }
  console.log("Done.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
