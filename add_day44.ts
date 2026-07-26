import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 44;
  const tag = "Week 7";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Walmart doesn't sell products cheaper because it cares more about saving customers money than any other retailer does. It sells cheaper because it buys, ships, and stores goods at a scale that makes each individual unit cost less to move than it does for almost anyone else in the business.</p>

<p><strong>Economies of scale</strong> describe the cost advantage a company gains as its production or purchasing volume increases, because certain costs — negotiating power, fixed infrastructure, specialized logistics systems — get spread across more units, lowering the average cost per unit. This is a cost structure advantage, not a marketing strategy.</p>

<p>At Walmart's specific scale, this shows up in several concrete ways: it can negotiate lower per-unit purchase prices directly from suppliers, since a supplier would rather offer meaningful volume discounts than lose access to that much distribution. It can build and operate a proprietary logistics and distribution network whose large fixed cost gets spread across an enormous sales volume, making the cost per unit shipped far lower than a smaller retailer's equivalent system. And it can justify investing in centralized systems — inventory management, purchasing software — that a smaller competitor's volume simply couldn't pay for efficiently.</p>

<p>This distinction matters: Walmart's low prices largely reflect genuinely lower <strong>costs</strong>, not simply a choice to accept thinner <strong>margins</strong>. That difference is what makes the advantage durable rather than a temporary promotional tactic. A thin-margin strategy is fragile and easy for a well-funded competitor to match for a while. A genuine cost advantage compounds and persists, because a smaller competitor spreading the same fixed logistics and negotiation investment across far fewer units simply cannot reach the same cost per unit, no matter how efficiently it's run.</p>`;

  const conceptSummary = `Economies of scale mean average cost per unit falls as purchasing or production volume rises, because fixed costs and negotiating leverage spread across more units. Walmart's scale lets it negotiate lower supplier prices and spread its logistics network's fixed costs across enormous volume. This reflects genuinely lower costs, not thinner margins — which is why the advantage compounds and persists, rather than being a temporary price-war tactic a competitor could simply match.`;

  const conceptTakeaways = [
    "Economies of scale mean average cost per unit falls as a company's purchasing or production volume rises.",
    "Larger purchasing volume gives a company real negotiating leverage to secure lower per-unit supplier prices.",
    "Fixed logistics infrastructure costs get spread across more units at scale, lowering the cost per unit shipped.",
    "Walmart's low prices reflect genuinely lower costs, not simply a choice to accept thinner profit margins.",
    "A genuine cost advantage compounds and persists, unlike a thin-margin strategy a well-funded rival could temporarily match."
  ];

  const articleTitle = "How Buying in Bulk Became the Most Durable Competitive Advantage in Retail History";
  
  const articleText = `<p><strong>How can one retailer consistently sell the same products cheaper than nearly every competitor, year after year, without ever seeming to run out of margin?</strong></p>

<p>Walmart's massive purchasing volume lets it negotiate lower per-unit costs directly from suppliers than smaller retailers can access, since suppliers value guaranteed, enormous distribution enough to offer meaningfully better pricing in exchange for it.</p>

<p><strong>Is this just about negotiating harder than competitors, or is something more structural going on?</strong></p>

<p>Walmart's proprietary logistics and distribution network — warehouses, trucking fleets, inventory systems — carries a large fixed cost to build and operate. That fixed cost gets spread across an enormous sales volume, making the cost per unit shipped dramatically lower than a smaller retailer's equivalent system, which spreads similar fixed costs across far fewer units.</p>

<p><strong>If a smaller retailer worked just as efficiently as Walmart, could it match Walmart's prices?</strong></p>

<p>Not through efficiency alone. Even an equally well-run smaller retailer is spreading comparable fixed logistics and negotiation costs across a much smaller unit volume, making its cost per unit structurally higher regardless of how skillfully it's operated.</p>

<p><strong>Isn't "everyday low prices" just Walmart accepting thinner margins to compete?</strong></p>

<p>Largely, no — the low prices mostly reflect genuinely lower costs, not simply a choice to earn less profit per item. This distinction matters because a real cost advantage compounds and persists over time, while a thin-margin strategy alone would be fragile and relatively easy for a well-funded competitor to match, at least temporarily.</p>

<p><strong>If you ran a mid-sized regional retailer and wanted to compete with Walmart on price alone, would you try to match its prices directly — or compete on a different dimension entirely?</strong></p>

<p>Matching prices directly means accepting a cost structure that is inherently worse than Walmart's at your smaller volume — a fight that's likely unsustainable regardless of how well you run your business. Competing on a different dimension — specialty selection, service, local relationships — sidesteps a battle your cost structure can't structurally win.</p>

<p><strong>So is Walmart's advantage really about low prices — or about being the one retailer whose actual costs are lower than everyone else's at the exact same task?</strong></p>

<p>The prices are the visible result. The durable advantage is the underlying cost structure created by scale itself — one that's far harder for a smaller competitor to erode than any temporary price promotion would be.</p>`;

  const articleSummary = `Walmart's consistently low prices come primarily from genuinely lower costs, not thinner profit margins — a distinction that makes the advantage durable rather than fragile. Its massive purchasing volume secures better supplier pricing, and its logistics network's fixed costs spread across enormous sales volume, lowering the cost per unit shipped. A smaller, equally efficient competitor still faces structurally higher per-unit costs simply due to lower volume, illustrating how economies of scale create a lasting, compounding advantage.`;

  const articleTakeaways = [
    "Walmart's massive purchasing volume secures meaningfully lower per-unit supplier prices than smaller retailers can access.",
    "Its proprietary logistics network's fixed costs spread across enormous sales volume, lowering the cost per unit shipped.",
    "An equally efficient but smaller competitor still faces structurally higher per-unit costs due to lower volume alone.",
    "Walmart's low prices largely reflect genuinely lower costs, not simply thinner accepted profit margins.",
    "This cost-based advantage compounds and persists, unlike a thin-margin strategy a rival could temporarily match."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Economies of Scale",
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
        questionText: "What are \"economies of scale,\" as defined in this lesson?",
        options: [
          "A company's total revenue in a given year",
          "The cost advantage a company gains as its production or purchasing volume increases, spreading certain costs across more units",
          "A government subsidy for large retailers",
          "A pricing strategy based purely on charging lower margins"
        ],
        correctAnswer: "The cost advantage a company gains as its production or purchasing volume increases, spreading certain costs across more units",
        explanation: "Economies of scale represent structural cost advantages due to higher production/purchasing volume, which spreads fixed costs across more units."
      },
      {
        questionText: "Why does this lesson argue that Walmart's low prices largely reflect lower costs rather than thinner margins?",
        options: [
          "Choose this: Because margins and costs are identical concepts with no meaningful distinction",
          "Because a genuine cost advantage compounds and persists over time, while a thin-margin strategy alone would be fragile and easier for a competitor to match",
          "Because Walmart never earns any profit on the products it sells",
          "Because thinner margins always produce a more durable competitive advantage than lower costs"
        ],
        correctAnswer: "Because a genuine cost advantage compounds and persists over time, while a thin-margin strategy alone would be fragile and easier for a competitor to match",
        explanation: "Walmart's advantage is durable because its scale allows it to operate at structurally lower costs, rather than just choosing to take thin profits on a high cost base."
      },
      {
        questionText: "According to this lesson, why can't an equally efficient but smaller retailer match Walmart's per-unit costs?",
        options: [
          "Because smaller retailers are legally prohibited from negotiating with suppliers",
          "Because the smaller retailer spreads similar fixed logistics and negotiation costs across a much smaller unit volume, making its cost per unit structurally higher",
          "Because efficiency has no relationship to a retailer's actual costs",
          "Because smaller retailers always pay higher taxes than large ones"
        ],
        correctAnswer: "Because the smaller retailer spreads similar fixed logistics and negotiation costs across a much smaller unit volume, making its cost per unit structurally higher",
        explanation: "Even with equal operational efficiency, the lower absolute volume means each unit bears a higher share of the company's fixed overhead and logistics cost."
      },
      {
        questionText: "Why does Walmart's large purchasing volume give it negotiating leverage with suppliers, according to this lesson?",
        options: [
          "Because suppliers are legally required to offer discounts to large retailers",
          "Because a supplier would rather offer meaningful volume discounts than lose access to that much distribution",
          "Because Walmart's suppliers are all owned by the same parent company",
          "Because purchasing volume has no relationship to supplier negotiations"
        ],
        correctAnswer: "Because a supplier would rather offer meaningful volume discounts than lose access to that much distribution",
        explanation: "Suppliers value massive, guaranteed volume so highly that they are willing to accept lower per-unit margins in exchange for access to Walmart's distribution power."
      },
      {
        questionText: "You run a mid-sized regional retailer trying to compete with Walmart on price. Based on this lesson, what is the strongest argument against trying to match Walmart's prices directly?",
        options: [
          "Matching prices is always the correct strategy regardless of underlying cost structure",
          "Your smaller volume means you're spreading similar fixed costs across far fewer units, making your cost structure inherently higher regardless of how efficiently you operate",
          "Price competition is illegal between retailers of different sizes",
          "Walmart's prices have no relationship to its actual costs"
        ],
        correctAnswer: "Your smaller volume means you're spreading similar fixed costs across far fewer units, making your cost structure inherently higher regardless of how efficiently you operate",
        explanation: "Trying to match prices directly ignores the structural cost difference, leading to unsustainably low or negative margins for the smaller retailer."
      },
      {
        questionText: "You're an executive at a smaller retailer considering how to compete against a much larger rival with significant economies of scale. Based on this lesson, what strategic approach makes more economic sense than attempting to match prices directly?",
        options: [
          "Competing on a different dimension — such as specialty selection, service, or local relationships — that sidesteps a cost-based fight you cannot structurally win",
          "Increasing your own purchasing volume overnight to match the larger rival's scale",
          "Ignoring cost structure entirely and focusing solely on marketing",
          "Lowering prices below cost indefinitely to force the larger rival out of the market"
        ],
        correctAnswer: "Competing on a different dimension — such as specialty selection, service, or local relationships — that sidesteps a cost-based fight you cannot structurally win",
        explanation: "By competing on non-price dimensions, a smaller retailer avoids the scale-dependent cost trap and builds a differentiated position."
      },
      {
        questionText: "A retailer builds a large, centralized distribution network at significant fixed cost, then grows its sales volume substantially over the following years without needing to expand that same network proportionally. Based on this lesson, what happens to its cost per unit shipped as volume grows?",
        options: [
          "It increases, since more volume always increases costs",
          "It decreases, since the fixed cost of the distribution network gets spread across a larger number of units",
          "It remains completely unchanged regardless of volume",
          "It has no relationship to the company's distribution network at all"
        ],
        correctAnswer: "It decreases, since the fixed cost of the distribution network gets spread across a larger number of units",
        explanation: "This describes the core mechanism of economies of scale: spreading a fixed overhead (the distribution network) across more volume, reducing the per-unit cost."
      },
      {
        questionText: "Two retailers negotiate with the same supplier for the same product. Retailer A purchases in far larger volume than Retailer B. Based on this lesson, which retailer is more likely to secure a lower per-unit price, and why?",
        options: [
          "Retailer B, since smaller retailers always receive better supplier terms",
          "Retailer A, since its larger purchasing volume gives it more negotiating leverage, as suppliers value guaranteed large-scale distribution",
          "Neither retailer's volume affects supplier pricing",
          "Both retailers will always receive identical pricing regardless of volume"
        ],
        correctAnswer: "Retailer A, since its larger purchasing volume gives it more negotiating leverage, as suppliers value guaranteed large-scale distribution",
        explanation: "Volume-based purchasing power lets larger retailers command volume discounts that are out of reach for smaller competitors."
      },
      {
        questionText: "A large retailer's prices remain consistently lower than competitors' over many years, even as competitors attempt various promotional pricing strategies to match them temporarily. Based on this lesson, what does this pattern most likely indicate?",
        options: [
          "The large retailer is simply willing to accept lower profits indefinitely",
          "Value: The large retailer's advantage is rooted in a genuine, structural cost advantage from scale, which is more durable than competitors' temporary promotional pricing",
          "This pattern has no relationship to the concepts in this lesson",
          "The large retailer's suppliers are charging it more than its competitors' suppliers"
        ],
        correctAnswer: "Value: The large retailer's advantage is rooted in a genuine, structural cost advantage from scale, which is more durable than competitors' temporary promotional pricing",
        explanation: "Temporary pricing promotions cannot match a structural, volume-driven cost advantage. The scale leader's prices remain sustainable while rivals lose money."
      },
      {
        questionText: "A new competitor enters a market and attempts to match an established, large-scale retailer's prices immediately, without having built comparable purchasing volume or logistics infrastructure. Based on this lesson, what is the most likely outcome?",
        options: [
          "The new competitor will sustainably match prices indefinitely with no financial strain",
          "The new competitor is likely to face an unsustainable cost disadvantage, since it lacks the volume needed to achieve comparable economies of scale",
          "Economies of scale have no bearing on a new competitor's ability to match prices",
          "The new competitor's prices will automatically become the new market standard"
        ],
        correctAnswer: "The new competitor is likely to face an unsustainable cost disadvantage, since it lacks the volume needed to achieve comparable economies of scale",
        explanation: "Without the volume to amortize fixed infrastructure and command supplier discounts, matching prices directly cuts straight into the new entrant's margins."
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
