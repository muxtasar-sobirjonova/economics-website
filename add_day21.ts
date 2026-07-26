import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 21;

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p><strong>Covering Loss Aversion, Reference Points, Diminishing Sensitivity, Framing Effects, Risk-Attitude Reversal, and the Endowment Effect</strong></p>
<p>This review draws on all six lessons from Week 3. Questions mix recall, application, and comparisons across concepts — some require weighing two ideas against each other, not just naming one.</p>`;

  const conceptSummary = `Chapter Review focusing on how we think about gains and losses, drawing on all lessons from the week.`;

  const conceptTakeaways: string[] = [];
  const articleTitle = "";
  const articleText = "";
  const articleSummary = "";
  const articleTakeaways: string[] = [];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Chapter Review: How We Think About Gains and Losses",
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
        questionText: "A company loses $10,000 in one quarter and gains $10,000 the next. According to loss aversion, what is the most accurate description of the owner's average emotional experience across both quarters?",
        options: [
          "Net negative, since the pain of the loss outweighs the pleasure of the equal-sized gain",
          "Net positive, since gains always outweigh losses of the same size",
          "Perfectly neutral, since the amounts cancel out exactly",
          "Impossible to predict, since loss aversion doesn't apply to businesses"
        ],
        correctAnswer: "Net negative, since the pain of the loss outweighs the pleasure of the equal-sized gain",
        explanation: "Because losses are felt more intensely than gains of the same size, equal financial amounts result in a net emotional loss."
      },
      {
        questionText: "Two employees earn identical salaries. One recently moved from a lower-paying job; the other recently moved from a higher-paying one. What concept best explains why they report different satisfaction with the identical salary?",
        options: [
          "Diminishing sensitivity",
          "Reference points",
          "The endowment effect",
          "Risk-attitude reversal"
        ],
        correctAnswer: "Reference points",
        explanation: "They evaluate the same salary against different historical benchmarks, making it feel like a gain for one and a loss for the other."
      },
      {
        questionText: "Why does a $200 gain feel more significant to someone moving from $0 to $200 than to someone moving from $50,000 to $50,200?",
        options: [
          "Because $200 is objectively worth more in the first case",
          "Because diminishing sensitivity shrinks the felt impact of a fixed dollar amount as the base amount grows",
          "Because larger sums are always taxed more heavily",
          "Because the second person is being irrational"
        ],
        correctAnswer: "Because diminishing sensitivity shrinks the felt impact of a fixed dollar amount as the base amount grows",
        explanation: "The psychological impact of money changes depending on the starting amount—a core tenet of diminishing sensitivity."
      },
      {
        questionText: "A hospital reports a treatment's \"90% survival rate\" instead of its mathematically identical \"10% mortality rate,\" and patient uptake changes as a result. This is best explained by which concept?",
        options: [
          "Loss aversion",
          "The endowment effect",
          "A framing effect",
          "Diminishing sensitivity"
        ],
        correctAnswer: "A framing effect",
        explanation: "Framing identical odds in terms of gains (survival) rather than losses (mortality) predictably alters behavior."
      },
      {
        questionText: "According to the reflection effect in prospect theory, how does risk preference typically change between a gain frame and a loss frame, given identical expected values?",
        options: [
          "People are risk-seeking for both gains and losses equally",
          "People are risk-averse for losses but risk-seeking for gains",
          "Risk preference is unaffected by whether an outcome is framed as a gain or loss",
          "People tend to be risk-averse for gains but risk-seeking for losses"
        ],
        correctAnswer: "People tend to be risk-averse for gains but risk-seeking for losses",
        explanation: "People generally prefer sure things when winning, but take risks to avoid taking a loss."
      },
      {
        questionText: "In the classic mug experiments, randomly assigned \"owners\" and \"buyers\" valued an identical object very differently. What did this demonstrate?",
        options: [
          "Buyers always value objects more than owners",
          "Ownership itself, not the object's actual qualities, shifted the perceived value",
          "Mugs are an unusually emotional product category",
          "Ownership has no measurable effect on valuation"
        ],
        correctAnswer: "Ownership itself, not the object's actual qualities, shifted the perceived value",
        explanation: "The endowment effect shows that simply possessing an item artificially inflates its value to the owner."
      },
      {
        questionText: "How are loss aversion and the endowment effect related to each other?",
        options: [
          "They are unrelated concepts from entirely different fields",
          "The endowment effect arises partly because giving up an owned item is processed as a loss, and losses are felt more intensely due to loss aversion",
          "Loss aversion only applies to money, while the endowment effect only applies to objects, with no overlap between them",
          "The endowment effect causes loss aversion, rather than the reverse"
        ],
        correctAnswer: "The endowment effect arises partly because giving up an owned item is processed as a loss, and losses are felt more intensely due to loss aversion",
        explanation: "Because giving something up feels like a loss, and losses hurt more, people demand more money to part with an owned item."
      },
      {
        questionText: "In the organ donation comparison between opt-in and opt-out countries, what role do reference points play alongside framing?",
        options: [
          "They play no role — the gap is explained by framing alone",
          "The default option (opt-in vs. opt-out) both frames the decision and establishes the reference point of \"what happens if I do nothing\"",
          "Reference points apply only to salary decisions, never to policy",
          "Framing only affects countries with opt-in systems"
        ],
        correctAnswer: "The default option (opt-in vs. opt-out) both frames the decision and establishes the reference point of \"what happens if I do nothing\"",
        explanation: "The default essentially sets the baseline state (the reference point), meaning changing the default changes whether donating is an active choice or a deviation."
      },
      {
        questionText: "Why does a lottery jackpot resist the compression effect that diminishing sensitivity applies to ordinary financial gains?",
        options: [
          "Because lottery winnings are legally exempt from psychological effects",
          "Because diminishing sensitivity never applies to gains, only losses",
          "Because there is no comparable, nearby reference point large enough to make an enormous, life-changing sum feel smaller by comparison",
          "Because lottery jackpots are always taxed differently than ordinary income"
        ],
        correctAnswer: "Because there is no comparable, nearby reference point large enough to make an enormous, life-changing sum feel smaller by comparison",
        explanation: "An unimaginably huge amount escapes the standard sensitivity curve because our brains lack a frame of reference to make it feel \"small.\""
      },
      {
        questionText: "Why are defaults considered one of the most powerful types of framing available to policymakers?",
        options: [
          "Because defaults are always mandatory and legally cannot be changed",
          "Because defaults only affect financial decisions, never health or civic ones",
          "Because defaults are outlawed in most countries, making the few that exist highly visible",
          "Because most people never actively act to change a pre-set default, so the default effectively determines the outcome for the majority"
        ],
        correctAnswer: "Because most people never actively act to change a pre-set default, so the default effectively determines the outcome for the majority",
        explanation: "Defaults harness human inertia. The option requiring the least effort is overwhelmingly likely to be the one chosen."
      },
      {
        questionText: "Why does a certain loss often feel worse to accept than a gamble of equal expected value that could avoid the loss entirely?",
        options: [
          "Because gambles always have a mathematically better expected value than certain losses",
          "Because a certain loss guarantees the intensified pain predicted by loss aversion, while the gamble offers a chance, however small, of avoiding that pain",
          "Because certain losses are illegal in most financial contexts",
          "Because people become fully rational once a loss is certain"
        ],
        correctAnswer: "Because a certain loss guarantees the intensified pain predicted by loss aversion, while the gamble offers a chance, however small, of avoiding that pain",
        explanation: "People are driven to seek risk when facing losses purely to avoid the definitive sting of locking in a loss."
      },
      {
        questionText: "Two employees earn the same salary, but one feels satisfied and the other feels underpaid. What does this best illustrate?",
        options: [
          "Reference points are irrelevant once the salary is fixed",
          "Satisfaction is purely a function of salary size, with no room for comparison",
          "Identical objective outcomes can produce different subjective reactions depending on each person's individual reference point",
          "Only the higher-paid employee's reference point matters"
        ],
        correctAnswer: "Identical objective outcomes can produce different subjective reactions depending on each person's individual reference point",
        explanation: "Our brains evaluate numbers relatively, not absolutely, leading to completely different feelings about the same outcome."
      },
      {
        questionText: "Why might an item owned for several years produce a larger valuation gap (endowment effect) than an item owned for only a few weeks?",
        options: [
          "Older items are always objectively worth more in the resale market",
          "The endowment effect legally only applies to items owned for over a year",
          "Newer items are always priced higher by sellers regardless of ownership duration",
          "Longer ownership, especially with personal history attached, tends to intensify how much giving up the item feels like a genuine loss"
        ],
        correctAnswer: "Longer ownership, especially with personal history attached, tends to intensify how much giving up the item feels like a genuine loss",
        explanation: "Psychological attachment deepens the \"pain\" of parting with an object, leading to higher asking prices."
      },
      {
        questionText: "Why might removing a long-standing free perk create more backlash than never having offered that perk at all, even at identical final prices?",
        options: [
          "Because removing a perk is always illegal under consumer protection law",
          "Because removal converts an existing reference point into a felt loss, while never offering the perk creates no reference point to violate",
          "Because customers of companies with longer histories are inherently less loyal",
          "Because price changes are only ever noticed by long-term customers"
        ],
        correctAnswer: "Because removal converts an existing reference point into a felt loss, while never offering the perk creates no reference point to violate",
        explanation: "Taking something away triggers loss aversion; if they never had it, there's no loss to react to."
      },
      {
        questionText: "How do diminishing sensitivity and risk-attitude reversal both stem from the same underlying idea in prospect theory — that the psychological impact of money is not a straight line?",
        options: [
          "They don't — they come from entirely separate, unconnected theories",
          "Diminishing sensitivity applies only to time, while risk-attitude reversal applies only to money, with no shared basis",
          "Both concepts only apply to lottery-style decisions, not everyday ones",
          "Diminishing sensitivity describes shrinking psychological impact as amounts grow, while risk-attitude reversal describes how that same curve produces opposite risk preferences for gains versus losses"
        ],
        correctAnswer: "Diminishing sensitivity describes shrinking psychological impact as amounts grow, while risk-attitude reversal describes how that same curve produces opposite risk preferences for gains versus losses",
        explanation: "Both reflect the S-shape of the value function: sensitivity to changes decreases further from the reference point, shifting risk behavior depending on whether you are up or down."
      },
      {
        questionText: "You're an HR director for a firm that has offered free daily lunch for 8 years. Budget cuts require action. Based on loss aversion, which change is likely least damaging to morale?",
        options: [
          "Removing free lunch entirely with no replacement",
          "Charging employees the full cost of lunch with no explanation",
          "Replacing free lunch with a $5/day stipend framed as a new benefit, softening the sense of pure removal",
          "Removing lunch only for new hires while telling existing employees nothing"
        ],
        correctAnswer: "Replacing free lunch with a $5/day stipend framed as a new benefit, softening the sense of pure removal",
        explanation: "Replacing the benefit rather than completely stripping it cushions the blow of loss aversion by providing a \"gain\" in the form of a stipend."
      },
      {
        questionText: "You're an employee who just received a 7% raise — higher than any raise you've gotten in the past five years. Assuming you don't learn what colleagues received, and based purely on your own reference point, how are you likely to feel?",
        options: [
          "Disappointed, since 7% is objectively too low",
          "Satisfied, since the raise significantly exceeds your personal historical reference point",
          "Indifferent, since salary doesn't affect satisfaction",
          "Angry, since all raises should be identical across a company"
        ],
        correctAnswer: "Satisfied, since the raise significantly exceeds your personal historical reference point",
        explanation: "Evaluated against your own history, 7% represents a strong gain over expectations."
      },
      {
        questionText: "You're a marketer designing a rewards program and must choose between promoting \"$10 off every purchase\" or \"a 1-in-500 chance to win $5,000,\" both with similar expected value. Based on diminishing sensitivity, which is more likely to generate stronger excitement per dollar spent?",
        options: [
          "The guaranteed $10 discount, since certainty is always more exciting",
          "Both will generate identical excitement regardless of framing",
          "Neither will generate any measurable excitement among customers",
          "The rare $5,000 prize, since a large, life-changing sum resists the psychological compression that a small guaranteed discount would experience"
        ],
        correctAnswer: "The rare $5,000 prize, since a large, life-changing sum resists the psychological compression that a small guaranteed discount would experience",
        explanation: "A jackpot skips past the normal limits of diminishing sensitivity, offering outsized psychological excitement."
      },
      {
        questionText: "You're a policymaker who wants to increase retirement savings participation without changing any actual plan terms or restricting choice. Based on the organ donation case, what is your most effective lever?",
        options: [
          "Running an advertising campaign explaining the benefits of saving",
          "Increasing the paperwork required to enroll, to filter for serious savers",
          "Changing the default from opt-in to opt-out enrollment, while preserving the right to withdraw",
          "Reducing the employer match to save costs"
        ],
        correctAnswer: "Changing the default from opt-in to opt-out enrollment, while preserving the right to withdraw",
        explanation: "Opt-out defaults leverage human inertia and dramatically increase participation without restricting freedom of choice."
      },
      {
        questionText: "You're an investor holding a stock down 25% from your purchase price. Based on the reflection effect, what behavior are you statistically more likely to exhibit compared to how you'd behave with a stock up 25%?",
        options: [
          "Selling immediately to lock in the loss",
          "Behaving identically regardless of gain or loss",
          "Feeling no emotional difference between the two situations",
          "Holding or adding to the losing position, hoping for a risky recovery, rather than accepting the certain loss by selling"
        ],
        correctAnswer: "Holding or adding to the losing position, hoping for a risky recovery, rather than accepting the certain loss by selling",
        explanation: "People typically hold on to losers (risk-seeking) to avoid the certain pain of selling at a loss."
      },
      {
        questionText: "You run an online resale platform and notice sellers consistently overprice items relative to what buyers offer. Based on the endowment effect, what feature addresses the root psychological cause rather than just the symptom?",
        options: [
          "Charging sellers a fee for every listing, regardless of price",
          "Showing sellers real recent sold prices at the moment of listing, providing a competing reference point to their ownership-driven valuation",
          "Hiding buyer offers from sellers entirely",
          "Requiring buyers to pay full asking price with no negotiation allowed"
        ],
        correctAnswer: "Showing sellers real recent sold prices at the moment of listing, providing a competing reference point to their ownership-driven valuation",
        explanation: "Objective recent data gives a new reference point that challenges the seller's inflated emotional valuation."
      },
      {
        questionText: "You're an airline executive deciding how to introduce a new baggage fee. Based on the British Airways case, which approach is likely to generate the least backlash?",
        options: [
          "Removing a long-standing free baggage allowance for existing routes",
          "Announcing the fee removal on existing routes with no advance notice",
          "Framing the change on existing routes as \"in line with competitors\" with no other adjustment",
          "Launching the new fee only on brand-new routes that never had free baggage, avoiding any reference point being violated"
        ],
        correctAnswer: "Launching the new fee only on brand-new routes that never had free baggage, avoiding any reference point being violated",
        explanation: "Without a historical \"free\" baseline on the new routes, travelers won't experience the fee as a harsh loss."
      },
      {
        questionText: "A government wants to reduce dissatisfaction after introducing salary transparency laws similar to Norway's. Based on this lesson, what approach is most consistent with the concept covered?",
        options: [
          "Publish raw salary numbers with absolutely no additional context",
          "Ban all salary comparisons among coworkers entirely",
          "Publish salaries alongside context like experience and tenure, reducing the likelihood that raw comparisons feel like unfair losses",
          "Require every employee in the country to earn an identical salary"
        ],
        correctAnswer: "Publish salaries alongside context like experience and tenure, reducing the likelihood that raw comparisons feel like unfair losses",
        explanation: "Providing context shifts the reference points so employees are less likely to mistakenly compare themselves to fundamentally different roles."
      },
      {
        questionText: "You operate a national lottery and are deciding whether to reduce the top prize from €2 billion to €200 million, still a life-changing sum for almost anyone. Based on diminishing sensitivity, what should you predict about ticket sales?",
        options: [
          "Ticket sales will collapse to nearly zero, since €200 million is \"not enough\"",
          "Ticket sales will likely remain strong, since both amounts are processed as similarly life-changing relative to an ordinary income reference point",
          "Ticket sales will only be affected in the wealthiest regions of the country",
          "Diminishing sensitivity predicts no relationship between prize size and ticket sales at all"
        ],
        correctAnswer: "Ticket sales will likely remain strong, since both amounts are processed as similarly life-changing relative to an ordinary income reference point",
        explanation: "Both prize values completely bypass typical, everyday sensitivity boundaries; they both simply register as \"vastly more than enough.\""
      },
      {
        questionText: "A hospital wants more patients to enroll in a beneficial but underused preventive care program. Based on the Austria organ donation case, what change would most directly increase enrollment without restricting patient choice?",
        options: [
          "Requiring patients to actively opt in, as is currently done",
          "Making the opt-in form longer to filter for genuinely committed patients",
          "Increasing advertising for the program with no change to enrollment mechanics",
          "Automatically enrolling patients by default, while preserving an easy opt-out option"
        ],
        correctAnswer: "Automatically enrolling patients by default, while preserving an easy opt-out option",
        explanation: "An opt-out structure leverages the natural tendency toward inaction, reliably increasing participation."
      },
      {
        questionText: "You're a financial counselor working with a client who wants to place a large risky bet to recover a recent gambling loss. Based on this lesson, what is the most effective first step?",
        options: [
          "Encourage an even larger bet to resolve the situation faster",
          "Explain that all gambling odds are inherently fair",
          "Help the client formally accept the loss as final, removing the \"open loss\" driving their risk-seeking behavior",
          "Avoid discussing the loss with the client entirely"
        ],
        correctAnswer: "Help the client formally accept the loss as final, removing the \"open loss\" driving their risk-seeking behavior",
        explanation: "Only by acknowledging the loss and 'closing the account' can the risk-seeking drive to recover it be defused."
      },
      {
        questionText: "You bought a concert ticket for $80 but can no longer attend. Comparable resale tickets are currently selling for $60. Based on the endowment effect, what price are you likely to list your ticket at, and why?",
        options: [
          "Below $60, since you no longer want the ticket at all",
          "At or above $80, since giving up the ticket for less than your reference point feels like a loss, regardless of the current resale market",
          "Exactly $60, matching the market with no personal bias",
          "Free, since the ticket has already been paid for and holds no further value to you"
        ],
        correctAnswer: "At or above $80, since giving up the ticket for less than your reference point feels like a loss, regardless of the current resale market",
        explanation: "You value it based on your sunk cost and ownership status, refusing to accept the objective loss implied by the $60 market price."
      },
      {
        questionText: "A retailer discontinues \"free shipping over $50\" and lowers all prices by 3% to roughly offset the change for the average customer. Based on both loss aversion and reference points, what should the retailer expect?",
        options: [
          "No customer reaction at all, since the total cost is roughly unchanged",
          "Universal appreciation for the added pricing transparency",
          "A guaranteed increase in overall sales from the pricing change",
          "Many customers will perceive the loss of free shipping more strongly than the offsetting discount, since the shipping fee is a visible new charge relative to their prior reference point of \"free\""
        ],
        correctAnswer: "Many customers will perceive the loss of free shipping more strongly than the offsetting discount, since the shipping fee is a visible new charge relative to their prior reference point of \"free\"",
        explanation: "The pain of losing \"free\" shipping is felt more acutely than the dispersed benefit of a subtle 3% discount."
      },
      {
        questionText: "An HR department is designing severance packages during layoffs and can offer either a certain payout or a risky payout with the same expected value. Based on this chapter, how might employees' choices differ if the situation is framed as \"losing your job\" (a loss) versus \"a bonus opportunity\" (a gain)?",
        options: [
          "Framing has no effect on employee choice in either direction",
          "Employees are more likely to choose the risky option when the situation is framed as a loss, and the safer certain option when it's framed as a gain",
          "Employees will always choose the safer option regardless of framing",
          "Employees will always choose the risky option regardless of framing"
        ],
        correctAnswer: "Employees are more likely to choose the risky option when the situation is framed as a loss, and the safer certain option when it's framed as a gain",
        explanation: "This directly demonstrates the reflection effect—the shift between risk-aversion for gains and risk-seeking for losses."
      },
      {
        questionText: "A subscription company wants customers to feel a price increase is minor. Based on diminishing sensitivity, would this strategy work better on customers with a high-priced, longstanding plan, or on new customers with no prior subscription and no owned \"reference\" plan?",
        options: [
          "It works equally well regardless of customer type or plan history",
          "It only works on customers who have never subscribed before",
          "It's more likely to work on customers with a high-priced, longstanding plan, since diminishing sensitivity blunts the felt impact of a fixed dollar increase against a large existing base",
          "Diminishing sensitivity has no relevance to subscription pricing decisions"
        ],
        correctAnswer: "It's more likely to work on customers with a high-priced, longstanding plan, since diminishing sensitivity blunts the felt impact of a fixed dollar increase against a large existing base",
        explanation: "A small fixed dollar increase feels like a much smaller percentage bump to a customer already paying a high rate."
      }
    ];

    for (let i = 0; i < questions.length; i++) {
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          questionText: questions[i].questionText,
          options: questions[i].options,
          correctAnswer: questions[i].correctAnswer,
          explanation: questions[i].explanation || "Correct answer.",
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
