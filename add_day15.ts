import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 15;
  const tag = "Week 3"; // Or whatever tag is appropriate, we will just use the current tag or default

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Your paycheck stays exactly the same this year, but your health insurance premium quietly rises by $50 a month. That $50 loss will bother you far more than a $50 raise would have pleased you — even though the dollar amounts are identical.</p>

<p>This asymmetry is <strong>loss aversion</strong>, a core finding of prospect theory developed by psychologists <strong>Daniel Kahneman and Amos Tversky</strong> in 1979. Their research found that losses register roughly twice as strongly, psychologically, as equivalent gains. Losing $20 doesn't just feel like the opposite of finding $20 — it feels considerably worse, even though the objective value lost or gained is exactly the same.</p>

<p>The mechanism isn't really about money at all. It's about reference points. People don't evaluate their situation in isolation; they compare it to whatever they already had, and any move below that reference point registers as a loss, activating a stronger emotional response than an equivalent move upward.</p>

<p>Imagine a store offering a "loyalty discount" of $5 off a $50 item versus a store that simply prices the item at $45 with no visible discount at all. Both charge the same amount. But the second framing never makes the customer feel like they're losing something they briefly had.</p>

<p>Companies that ignore loss aversion often discover, the hard way, that removing a benefit — even a small one — creates far more anger than the benefit ever created goodwill. That's exactly the mistake several UK airlines made when they started charging for things that used to be free.</p>`;

  const conceptSummary = `Loss aversion means losses feel roughly twice as painful as equivalent gains feel pleasurable, a finding central to Kahneman and Tversky's 1979 prospect theory. People judge outcomes against a reference point — what they already have — so removing a benefit registers as a loss, triggering a stronger reaction than an equivalent gain would have produced in the first place.`;

  const conceptTakeaways = [
    "Loss aversion describes how losses are felt roughly twice as intensely as equivalent gains, according to Kahneman and Tversky's prospect theory.",
    "People evaluate outcomes relative to a reference point (what they already have), not in absolute terms.",
    "Removing an existing benefit creates a stronger negative reaction than never offering that benefit would have.",
    "The size of a loss and the size of an equivalent gain are objectively identical, yet they are not felt as equal.",
    "Businesses that ignore loss aversion often underestimate how angry customers become when a \"free\" perk turns into a fee."
  ];

  const articleTitle = "Why Airline Customers Became Angry When \"Free\" Services Became Paid Fees (United Kingdom)";
  
  const articleText = `<p>Two travelers pay the exact same £180 fare for a British Airways short-haul flight to Madrid — one in 2016, one in 2017. <strong>Why did only the second traveler feel cheated?</strong><br>
Because in between those two flights, British Airways took something away. The airline hadn't raised the fare. It had removed the free snacks and drinks that used to come with it, and a fare that felt identical on paper suddenly felt like a worse deal in the traveler's mind.</p>

<p><strong>What exactly did British Airways change in November 2017, and why did it provoke so much public anger?</strong><br>
British Airways ended complimentary food and drinks on short-haul European economy flights, requiring passengers to pay for snacks, sandwiches, and drinks that had been free for decades. Media coverage widely described the airline as adopting a "Ryanair-style" model, and the backlash was immediate — passengers and commentators criticized a full-service, premium-priced carrier for behaving like a budget airline while still charging premium fares.</p>

<p><strong>If BA had simply launched a brand-new low-cost airline with paid snacks from day one, would it have faced the same backlash?</strong><br>
Almost certainly not, and that's the heart of loss aversion. A new airline that never offered free food has no reference point to violate — passengers judge its prices as they are. British Airways, by contrast, was taking something away from an existing baseline. The identical £3 sandwich charge felt like a loss when it followed decades of "free," and would have felt like nothing at all if it had simply been the starting price all along.</p>

<p><strong>Why does loss aversion make removing a £2 bag of pretzels feel worse than a £2 fare increase?</strong><br>
A £2 fare increase is absorbed into one number passengers barely notice on a booking page. A removed free snack is a visible, repeated reminder on every single flight that something they used to get is now gone. Loss aversion research suggests the emotional weight of a loss is felt roughly twice as strongly as an equivalent gain — so even a small, symbolic loss like a snack can generate outsized resentment compared to its tiny cash value.</p>

<p><strong>How did British Airways try to reframe the change, and did it work?</strong><br>
British Airways described the change as bringing the airline "in line with the rest of the short-haul market" and introduced new buy-on-board food options alongside some lower headline fares. The reframing softened some criticism over time, but the initial backlash still made international headlines, and the airline's premium reputation absorbed real damage that a same-priced but never-free competitor would never have risked.</p>

<p><strong>What should airlines learn about the order in which they introduce new fees?</strong><br>
That taking something away is far riskier than never offering it. A budget carrier can charge for everything from day one and rarely face outrage, because there's no reference point to violate. A legacy carrier removing a decades-old perk is choosing to convert every affected customer's neutral expectation into an active loss — and loss aversion guarantees that reaction will be louder, and last longer, than the airline's own price sheet would predict.</p>`;

  const articleSummary = `In 2017, British Airways ended free food and drinks on short-haul European flights, and passengers reacted with anger far out of proportion to the small cost involved. A brand-new budget airline charging the same amount from day one would have faced no such backlash. Loss aversion explains the gap: removing an existing benefit converts a neutral expectation into a felt loss, and losses are felt roughly twice as strongly as equivalent gains.`;

  const articleTakeaways = [
    "In November 2017, British Airways ended free food and drinks on short-haul European economy flights, triggering major public backlash.",
    "Identical prices can feel completely different depending on whether they represent a new cost or the removal of an existing benefit.",
    "A budget airline charging for snacks from day one has no reference point to violate, unlike a carrier removing a decades-old perk.",
    "Loss aversion means small, symbolic losses (like a free snack) can generate resentment out of proportion to their actual cash value.",
    "Companies that reframe a fee change (e.g., \"in line with the market\") can soften but rarely eliminate the backlash caused by taking something away."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Why Losing Feels Worse Than Winning Feels Good",
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
        questionText: "According to prospect theory, if a person gains $100 and separately loses $100 in the same week, which best describes their net psychological experience?",
        options: [
          "The gain and loss cancel out, leaving them emotionally neutral",
          "The pain of the $100 loss is felt more intensely than the pleasure of the $100 gain, producing a net negative feeling despite the equal dollar amounts",
          "The gain is felt more intensely because gains are always weighted more heavily than losses",
          "Neither the gain nor loss produces any measurable emotional reaction"
        ],
        correctAnswer: "The pain of the $100 loss is felt more intensely than the pleasure of the $100 gain, producing a net negative feeling despite the equal dollar amounts",
        explanation: "Loss aversion dictates that losses loom larger than equivalent gains, producing a net negative emotional impact."
      },
      {
        questionText: "A subscription service begins charging $3/month for a feature that used to be free, while simultaneously lowering the base subscription price by $3/month, keeping the total cost unchanged. Based on loss aversion, what is the most likely customer reaction?",
        options: [
          "Total indifference, since the total price is mathematically identical",
          "A negative reaction, because customers evaluate the newly-charged feature against their prior reference point of \"free,\" even though total spending hasn't changed",
          "Universal appreciation, since customers now have more pricing transparency",
          "Customers will only react if the price change exceeds 10% of their income"
        ],
        correctAnswer: "A negative reaction, because customers evaluate the newly-charged feature against their prior reference point of \"free,\" even though total spending hasn't changed",
        explanation: "Customers react to the removal of the free perk relative to their existing reference point."
      },
      {
        questionText: "Which scenario best demonstrates that loss aversion is about reference points rather than absolute value?",
        options: [
          "A person who has never owned a car is unaffected by a $500 car repair bill",
          "A person feels worse losing $50 they already had than they would feel happy finding an unexpected $50, even though both involve the same $50",
          "A person values $1,000 more than $100 in every situation",
          "A person's happiness is determined solely by their total net worth"
        ],
        correctAnswer: "A person feels worse losing $50 they already had than they would feel happy finding an unexpected $50, even though both involve the same $50",
        explanation: "This directly illustrates how gaining vs. losing the identical objective value leads to asymmetric emotional responses based on current reference point."
      },
      {
        questionText: "Why might a company that removes a long-standing free perk face more backlash than a competitor who never offered that perk, even if both charge identical final prices?",
        options: [
          "Because removing a perk is always illegal",
          "Because the first company converts customers' existing reference point into a felt loss, while the second company never created that reference point to violate",
          "Because customers of the first company are inherently less loyal",
          "Because price changes are only noticed by new customers, not existing ones"
        ],
        correctAnswer: "Because the first company converts customers' existing reference point into a felt loss, while the second company never created that reference point to violate",
        explanation: "The company that never offered the perk has a different reference point, so customers don't feel they've 'lost' anything."
      },
      {
        questionText: "You run a gym that has offered free towel service for 10 years. Revenue pressures require you to either (a) start charging $2 for towels while keeping membership fees the same, or (b) raise membership fees by $2/month and keep towels free. Based on loss aversion, which option is likely to generate less member backlash, and why?",
        options: [
          "Option (a), because members will appreciate the transparency of itemized costs",
          "Option (b), because a broad membership fee increase is absorbed into one number, while removing a specific \"free\" perk creates a visible, repeated reminder of loss",
          "Both options will generate identical backlash since the dollar amount is the same",
          "Option (a), because $2 is a trivial amount regardless of framing"
        ],
        correctAnswer: "Option (b), because a broad membership fee increase is absorbed into one number, while removing a specific \"free\" perk creates a visible, repeated reminder of loss",
        explanation: "A direct price increase often avoids the visceral feeling of having a specific existing benefit taken away."
      },
      {
        questionText: "You're a product manager at a software company. Your team wants to remove a feature used by only 5% of users to cut costs, but that 5% is vocal and influential. Based on loss aversion, what is the most strategically sound approach?",
        options: [
          "Remove the feature immediately with no communication, since only a small percentage is affected",
          "Consider grandfathering existing users into keeping the feature, or bundling its removal with a new benefit, since a small affected group experiencing a pure loss can generate disproportionate backlash relative to its size",
          "Ignore the group entirely since they represent a minority of total users",
          "Charge all users for the feature instead of removing it, regardless of usage rate"
        ],
        correctAnswer: "Consider grandfathering existing users into keeping the feature, or bundling its removal with a new benefit, since a small affected group experiencing a pure loss can generate disproportionate backlash relative to its size",
        explanation: "Grandfathering preserves the reference point for existing users, eliminating the feeling of loss."
      },
      {
        questionText: "An airline raises its base fare by £5 but reinstates a free snack it had previously removed. A separate airline lowers its base fare by £5 but starts charging £2 for a snack that used to be free. Assuming all other costs are equal, which airline is more likely to generate positive customer sentiment despite arguably worse economics for the airline itself?",
        options: [
          "The airline that lowered fares but charges for snacks, since the total cost to the customer is lower",
          "The airline that raised fares but reinstated the free snack, since customers respond more to reference-point changes (regaining something) than to net dollar totals",
          "Neither airline's customers will notice any difference",
          "The airline offering the lowest total price will always win, regardless of framing"
        ],
        correctAnswer: "The airline that raised fares but reinstated the free snack, since customers respond more to reference-point changes (regaining something) than to net dollar totals",
        explanation: "Reinstating the snack avoids the sting of loss and frames it as a regain, even if total cost is technically higher."
      },
      {
        questionText: "A retailer discontinues a long-running \"free shipping over $50\" policy and instead lowers all prices by 3% to offset the change. Based on loss aversion, what is the most likely outcome even though the average customer's total spending may end up roughly the same?",
        options: [
          "Customers will not notice any change in their shopping experience",
          "Many customers will perceive the loss of free shipping more strongly than the roughly offsetting 3% price reduction, since the shipping fee is a visible new charge tied to a specific past benefit",
          "Customers will only complain if the 3% discount is removed as well",
          "The change will be received identically to a straightforward price increase with no prior \"free\" policy"
        ],
        correctAnswer: "Many customers will perceive the loss of free shipping more strongly than the roughly offsetting 3% price reduction, since the shipping fee is a visible new charge tied to a specific past benefit",
        explanation: "The removal of \"free\" shipping is a highly visible violation of a reference point."
      },
      {
        questionText: "A company wants to introduce a new $10 monthly fee for a previously free service. Which rollout strategy best minimizes loss-aversion-driven backlash, based on the concept covered in this lesson?",
        options: [
          "Announce the fee suddenly with no prior communication or added value",
          "Pair the fee with a new, visible improvement to the service, so the change is perceived as a value exchange rather than a pure removal of something customers already had",
          "Charge existing customers double what new customers pay, to offset expected complaints",
          "Remove the service entirely instead of charging for it"
        ],
        correctAnswer: "Pair the fee with a new, visible improvement to the service, so the change is perceived as a value exchange rather than a pure removal of something customers already had",
        explanation: "Bundling the fee with a new benefit attempts to reframe the \"loss\" into an exchange of value."
      },
      {
        questionText: "Two companies raise their prices by the exact same percentage. Company A frames it as \"a $10 increase,\" while Company B frames it as \"removing your $10 loyalty discount.\" Based on loss aversion, which framing is more likely to provoke a stronger negative reaction, and why?",
        options: [
          "Company A's framing, since round numbers are always perceived as larger",
          "Company B's framing, since explicitly naming a lost benefit activates a clearer reference point violation than a generic price increase",
          "Both framings will be received identically since the dollar impact is the same",
          "Neither framing matters because customers only respond to the final price, never the description"
        ],
        correctAnswer: "Company B's framing, since explicitly naming a lost benefit activates a clearer reference point violation than a generic price increase",
        explanation: "Losing a \"discount\" is felt more acutely because it takes away a specific benefit the customer felt they \"owned\"."
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
