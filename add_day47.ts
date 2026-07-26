import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 47;
  const tag = "Week 7";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>For years, one of the most valuable software companies in the world deliberately chose to report losses — not because it had no other option, but because reinvesting every available dollar into growth was, by its own internal math, worth more than reporting a profit that year.</p>

<p>The <strong>growth vs. profitability tradeoff</strong> describes a company's decision, especially common in subscription-based software businesses, about whether to reinvest available cash into acquiring new customers and market share, accepting near-term losses, or to slow spending and report near-term profit instead.</p>

<p>The underlying logic rests on a simple but powerful idea: a subscription customer generates recurring revenue over years, not just at the moment of purchase — their <strong>lifetime value</strong>. Spending heavily to acquire a new customer today can be economically rational if that customer's revenue, summed across their entire time as a subscriber, eventually exceeds what it cost to acquire them — even though the acquisition cost hits the income statement immediately, while the revenue arrives gradually over years. Judging a growth-first company purely on its current-year profit misreads what's actually happening: a reported loss may simply reflect heavy investment in future revenue that hasn't been realized yet.</p>

<p>This distinguishes a genuine growth strategy from simply spending recklessly. The strategy only makes sense if acquisition cost genuinely comes in below eventual lifetime value — a company reinvesting aggressively without that math actually holding isn't executing a strategy, it's burning cash. And the right balance isn't fixed forever: once the highest-return new-customer opportunities become scarcer, the same reinvested dollar may generate a better return by improving margins on an already-large existing customer base instead of chasing incrementally more expensive new growth.</p>`;

  const conceptSummary = `The growth vs. profitability tradeoff weighs reinvesting cash into new customer acquisition against reporting near-term profit. In subscription businesses, this depends on lifetime value — whether a customer's revenue over their full subscription life exceeds what it cost to acquire them, even if the acquisition cost hits the books immediately. A reported loss can reflect sound reinvestment, not failure — but only if the underlying acquisition-cost-versus-lifetime-value math genuinely holds.`;

  const conceptTakeaways = [
    "The growth vs. profitability tradeoff weighs reinvesting in new customer acquisition against reporting near-term profit.",
    "Lifetime value means a subscription customer's revenue accumulates over years, not just at the moment of purchase.",
    "Reinvesting in acquisition can be rational if lifetime value eventually exceeds acquisition cost, even with a near-term reported loss.",
    "This strategy only makes sense if the acquisition-cost-versus-lifetime-value math genuinely holds, not merely assumed.",
    "The optimal balance shifts over time as the highest-return new-customer opportunities become scarcer or more expensive."
  ];

  const articleTitle = "The Software Giant That Chose to Lose Money for Years — On Purpose";
  
  const articleText = `<p><strong>Why would a company already selling a genuinely valuable product deliberately choose to report a loss instead of a profit for years?</strong></p>

<p>Salesforce, founded in 1999, pioneered a cloud-based, subscription "software-as-a-service" model for business software. For an extended period, the company prioritized aggressive reinvestment into acquiring new customers and expanding its market presence over reporting near-term profit.</p>

<p><strong>What made this a rational bet rather than simply poor financial discipline?</strong></p>

<p>A subscription customer generates recurring revenue for as long as they remain a customer. Spending heavily to acquire a new customer today can be worth it if that customer's revenue over their full subscription lifetime eventually exceeds what it cost to acquire them — even though the acquisition cost hits the income statement immediately, while the revenue arrives gradually over years.</p>

<p><strong>How is this different from a company simply spending recklessly and calling it a strategy?</strong></p>

<p>The strategy depends on the actual math working out: acquisition cost genuinely needs to be lower than eventual lifetime value for this to be economically rational, not simply assumed. A company that reinvests aggressively without this math actually holding is just burning cash — it isn't executing a sound growth-first strategy at all.</p>

<p><strong>Once a company has captured significant market share this way, why would it ever shift toward prioritizing profitability instead?</strong></p>

<p>Once the highest-return new-customer acquisition opportunities become scarcer — the market matures, or the cost of acquiring each additional customer rises — the same reinvested dollar may generate a better return by improving margins on the existing customer base rather than chasing incrementally more expensive new growth.</p>

<p><strong>If you ran a subscription software company and watched a rival report a large loss while rapidly gaining market share, would you copy their reinvestment-heavy strategy immediately — or wait to see whether their acquired customers' lifetime value actually justified the spending?</strong></p>

<p>Copying immediately risks committing to the same spending pattern without verifying that your own company's acquisition costs and customer retention actually support the same math. Waiting to verify is more cautious, but risks losing market share to a rival who guessed correctly and moved first.</p>

<p><strong>So was this growth-first strategy really about ignoring profit — or about correctly calculating that reinvesting in growth was, for a specific period, the higher-return use of every available dollar?</strong></p>

<p>The reported losses were the visible signal. The underlying logic was a specific, calculable bet about lifetime value versus acquisition cost — not an indifference to profitability itself.</p>`;

  const articleSummary = `Salesforce pioneered a subscription-based, cloud software model and, for an extended period, prioritized aggressive customer acquisition and reinvestment over reporting near-term profit. This reflected a calculated bet that each acquired customer's lifetime subscription revenue would eventually exceed its acquisition cost, even though the cost appears immediately while the revenue arrives gradually. As acquisition opportunities matured, prioritizing profitability over new growth became the higher-return use of each reinvested dollar instead.`;

  const articleTakeaways = [
    "Salesforce, founded in 1999, pioneered a cloud-based, subscription software-as-a-service business model.",
    "For an extended period, it prioritized reinvestment in customer acquisition and growth over reporting near-term profit.",
    "This reflected a bet that customer lifetime value would eventually exceed acquisition cost, despite near-term reported losses.",
    "The strategy is only rational if the underlying lifetime-value-versus-acquisition-cost math genuinely holds, not merely assumed.",
    "The optimal balance between growth and profitability shifts as new-customer acquisition opportunities become scarcer over time."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Growth vs. Profitability Tradeoff",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
        tag
      }
    });
    console.log(`Updated lesson content for day ${dayOrder}`);
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
        questionText: "What is the \"growth vs. profitability tradeoff,\" as defined in this lesson?",
        options: [
          "A company's decision to reinvest cash into new customer acquisition, accepting near-term losses, versus slowing spending to report near-term profit",
          "A government regulation requiring companies to report profit every year",
          "A legal requirement that all subscription businesses must be profitable within one year",
          "A pricing strategy used exclusively by non-subscription businesses"
        ],
        correctAnswer: "A company's decision to reinvest cash into new customer acquisition, accepting near-term losses, versus slowing spending to report near-term profit",
        explanation: "This tradeoff represents the decision between aggressive expansion today (tolerating losses) vs. profit taking and consolidation."
      },
      {
        questionText: "What is \"lifetime value,\" per this lesson?",
        options: [
          "The total number of years a company has existed",
          "The total revenue a subscription customer generates over their entire time as a customer, not just at the moment of purchase",
          "The interest rate charged on a business loan",
          "The total value of a company's physical assets"
        ],
        correctAnswer: "The total revenue a subscription customer generates over their entire time as a customer, not just at the moment of purchase",
        explanation: "Lifetime value (LTV) measures the cumulative financial value of a customer over their entire lifetime as a subscriber."
      },
      {
        questionText: "According to this lesson, why can heavy spending to acquire a new subscription customer be economically rational, despite creating a near-term reported loss?",
        options: [
          "Because reported losses are always illegal but tolerated in the software industry",
          "Because the customer's lifetime value, accumulated over years, can eventually exceed the acquisition cost, even though the cost hits the books immediately",
          "Because acquisition costs never actually appear on a company's income statement",
          "Because subscription customers never generate any real revenue"
        ],
        correctAnswer: "Because the customer's lifetime value, accumulated over years, can eventually exceed the acquisition cost, even though the cost hits the books immediately",
        explanation: "Acquisition expenses occur upfront (Year 0), whereas the recurring revenue flows in gradually over Years 1, 2, 3, etc. If total revenue > acquisition cost, the upfront loss is a rational investment."
      },
      {
        questionText: "Why does this lesson distinguish a genuine growth-first strategy from simply \"spending recklessly\"?",
        options: [
          "There is no meaningful distinction between the two",
          "Because a genuine growth strategy depends on acquisition cost actually being lower than eventual lifetime value, not simply assumed; without that, reinvestment is just burning cash",
          "Reckless spending always produces higher lifetime value than a calculated strategy",
          "Growth-first strategies are always identical to reckless spending by definition"
        ],
        correctAnswer: "Because a genuine growth strategy depends on acquisition cost actually being lower than eventual lifetime value, not simply assumed; without that, reinvestment is just burning cash",
        explanation: "Reinvestment is only productive if customer unit economics are positive (LTV > Customer Acquisition Cost). Otherwise, growth just increases the rate of cash burn."
      },
      {
        questionText: "You run a subscription software company and observe a rival reporting large losses while rapidly gaining market share. Based on this lesson, what is the strongest argument for verifying your own numbers before copying their strategy immediately?",
        options: [
          "Copying a rival's strategy is always guaranteed to succeed regardless of your own numbers",
          "Committing to the same spending pattern without confirming that your own acquisition costs and retention actually support the same lifetime-value math risks burning cash rather than executing a sound strategy",
          "Verifying your own numbers is illegal once a competitor has already adopted a strategy",
          "Rival companies' strategies have no bearing on your own company's decisions"
        ],
        correctAnswer: "Committing to the same spending pattern without confirming that your own acquisition costs and retention actually support the same lifetime-value math risks burning cash rather than executing a sound strategy",
        explanation: "Your rival may have different customer acquisition costs (CAC) or retention profiles; copying them blindly could destroy capital if your underlying LTV/CAC math doesn't hold."
      },
      {
        questionText: "You're an executive at a subscription company that has been prioritizing aggressive growth for years, and you notice new-customer acquisition costs are rising while retention rates remain strong. Based on this lesson, what should this trend prompt you to consider?",
        options: [
          "Continuing to prioritize new-customer acquisition at any cost, regardless of the rising acquisition costs",
          "Whether shifting some reinvestment toward improving margins on your existing customer base might now offer a better return than increasingly expensive new-customer acquisition",
          "Ignoring the trend entirely, since acquisition costs have no bearing on strategy",
          "Immediately halting all growth spending regardless of retention rates"
        ],
        correctAnswer: "Whether shifting some reinvestment toward improving margins on your existing customer base might now offer a better return than increasingly expensive new-customer acquisition",
        explanation: "As CAC rises, the marginal return on acquisition dollars drops. Allocating capital to optimize and monetize the existing base yields better ROI."
      },
      {
        questionText: "A subscription company reports a significant net loss for the year, but its customer retention rates are strong and its average customer remains subscribed for many years. Based on this lesson, what is the most useful additional information needed to evaluate whether this loss reflects a sound strategy?",
        options: [
          "Whether the company's logo has been recently redesigned",
          "Whether the lifetime value of acquired customers, summed over their subscription life, actually exceeds what it cost to acquire them",
          "Whether the company's competitors are also reporting losses",
          "Whether the company has ever been profitable in any previous year"
        ],
        correctAnswer: "Whether the lifetime value of acquired customers, summed over their subscription life, actually exceeds what it cost to acquire them",
        explanation: "High retention implies high lifetime value (LTV). Knowing if LTV exceeds Customer Acquisition Cost is the key metric for validating the current net loss."
      },
      {
        questionText: "Two subscription companies both report net losses. Company A's losses stem from customer acquisition costs that are lower than the eventual lifetime value of acquired customers. Company B's losses stem from acquisition costs that consistently exceed the lifetime value of its customers. Based on this lesson, which company is executing a sound growth strategy?",
        options: [
          "Company B, since any company reporting a loss while growing quickly is automatically executing a sound strategy",
          "Company A, since its acquisition costs are genuinely lower than the resulting lifetime value, the specific condition this lesson identifies as necessary for a sound growth strategy",
          "Neither company's losses have any relationship to their underlying strategy",
          "Both companies are executing identical, equally sound strategies"
        ],
        correctAnswer: "Company A, since its acquisition costs are genuinely lower than the resulting lifetime value, the specific condition this lesson identifies as necessary for a sound growth strategy",
        explanation: "Company A is making profitable long-term customer investments, while Company B's unit economics are structurally broken."
      },
      {
        questionText: "A mature subscription company finds that acquiring new customers has become significantly more expensive than in its earlier growth years, while its existing customer base remains large and stable. Based on this lesson, what shift in strategy would this situation likely justify?",
        options: [
          "Continuing to prioritize new-customer acquisition exclusively, regardless of rising costs",
          "Shifting some reinvestment toward improving margins on the existing customer base, since the same dollar may now generate a better return there than on increasingly expensive new acquisition",
          "Abandoning the subscription model entirely",
          "This situation has no bearing on how the company should allocate reinvestment"
        ],
        correctAnswer: "Shifting some reinvestment toward improving margins on the existing customer base, since the same dollar may now generate a better return there than on increasingly expensive new acquisition",
        explanation: "Strategic capital allocation shifts focus when the marginal return of one channel (CAC) diminishes relative to another (optimizing retention/margins of the existing base)."
      },
      {
        questionText: "An investor is evaluating a subscription company reporting consistent losses and is trying to determine whether this reflects sound strategic reinvestment or genuine financial distress. Based on this lesson, what specific comparison should the investor prioritize?",
        options: [
          "The company's total number of employees compared to competitors",
          "The relationship between customer acquisition cost and the lifetime value generated by those same acquired customers",
          "The company's office location compared to its competitors",
          "The number of years since the company's founding, regardless of its financial metrics"
        ],
        correctAnswer: "The relationship between customer acquisition cost and the lifetime value generated by those same acquired customers",
        explanation: "Comparing CAC against LTV reveals if the business model is inherently profitable beneath the surface growth investment."
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
    console.log(`Updated quiz questions for day ${dayOrder}`);
  }
  console.log("Done.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
