import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 49;
  const tag = "Week 7 Review";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Welcome to the Week 7 Review. This week we explored the critical economic principles behind scaling a business, managing growth, and expanding across supply chains and international borders.</p>

<p>We covered:</p>
<ul>
  <li><strong>Day 43 — Diffusion of Innovation (Airbnb)</strong>: How products spread through distinct adopter categories and how to cross the "chasm" between early adopters and the early majority by solving segment-specific barriers.</li>
  <li><strong>Day 44 — Economies of Scale (Walmart)</strong>: How cost structure advantages emerge from volume purchasing and operations, distinguishing between genuine cost advantages and thin-margin strategies.</li>
  <li><strong>Day 45 — Organizational Scaling (Samsung)</strong>: The trade-offs of vertical integration, balancing supply chain insulation and control against capital requirements and operational complexity.</li>
  <li><strong>Day 46 — Supply Chain Economics (Zara)</strong>: The trade-off between manufacturing efficiency and inventory carrying costs, using responsiveness to minimize markdown risk.</li>
  <li><strong>Day 47 — Growth vs. Profitability Tradeoff (Salesforce)</strong>: The economics of customer acquisition cost (CAC) versus customer lifetime value (LTV) in subscription-based recurring revenue models.</li>
  <li><strong>Day 48 — Internationalization Strategy (Coca-Cola)</strong>: Balancing standardization and localization ("glocalization") to preserve global brand power while aligning with local tastes and regulations.</li>
</ul>

<p>This review quiz contains 30 questions designed to test both your theoretical understanding and your practical ability to apply these scaling and growth frameworks to real-world business scenarios.</p>`;

  const conceptSummary = `This review covers Week 7 (Days 43–48) on Scaling, Growth & Systems, analyzing the strategic and operational mechanics of expanding a business. It synthesizes diffusion of innovation, economies of scale, vertical integration, supply chain economics, growth-vs-profitability math, and glocalization. The 30-question cumulative quiz tests theory and logical application across all six scaling disciplines.`;

  const conceptTakeaways = [
    "Adoption diffuses through distinct categories; crossing the chasm requires solving new, segment-specific barriers.",
    "Economies of scale yield durable cost advantages by spreading fixed overhead and command volume purchasing terms.",
    "Vertical integration insulates against supplier dependencies but introduces massive operational complexity.",
    "Supply chains balance unit production cost against the balance sheet drag of carrying unsold inventory.",
    "Growth-first strategies depend strictly on customer lifetime value (LTV) exceeding customer acquisition cost (CAC).",
    "Glocalization preserves global scale efficiencies while adapting product details to local taste, price, and regulatory demands."
  ];

  const articleTitle = "Week 7 Review: Capstone Analysis of Scaling, Growth & System Strategies";
  
  const articleText = `<p><strong>How do the various systems of a business interact as it scales from a successful niche product to a global mainstream leader?</strong></p>

<p>Scaling is not merely doing more of the same thing at a larger size; it is a fundamental restructuring of how a company creates, captures, and protects value. As a business expands, every system — from its customer adoption funnel and manufacturing plants to its organizational hierarchy, logistics supply chains, financial reinvestment logic, and geographic footprint — must undergo a deliberate transition.</p>

<p><strong>What are the core systems that define this transition?</strong></p>

<p>First is the <strong>Adoption System</strong>. Crossing from enthusiastic early adopters to the risk-averse early majority requires diagnosing the specific psychological or social barriers preventing mainstream users from trying the product, rather than relying on more of the same marketing.</p>

<p>Second is the <strong>Cost and Supply System</strong>. Achieving economies of scale allows a firm to lower its unit costs structurally, rather than simply cutting prices. To protect this scale, a firm must decide when to rely on external markets and when to vertically integrate upstream inputs, insulating itself from supply shocks at the cost of operational complexity.</p>

<p>Third is the <strong>Logistics and Allocation System</strong>. A firm must balance manufacturing efficiency against inventory carrying costs. Operating in smaller, responsive batches close to markets can minimize costly write-downs and markdowns, even if per-unit production costs are higher.</p>

<p>Fourth is the <strong>Capital Reinvestment System</strong>. In subscription-based models, near-term losses can represent rational capital allocation if customer lifetime value (LTV) exceeds acquisition costs (CAC). However, as markets mature and CAC rises, the highest-return allocation shifts toward optimizing margins on the existing base.</p>

<p>Finally, the <strong>Geographic Expansion System</strong>. Internationalization requires a continuous glocal calibration — standardizing core trust and brand elements for efficiency, while localizing taste, pricing, and compliance features to fit local realities.</p>

<p><strong>So what is the final synthesis of Week 7?</strong></p>

<p>The successful global enterprise is an interlocking system where scale-driven cost structures, supply chain flexibility, customer lifetime value, and glocal branding must directly reinforce one another. A failure in any single subsystem — whether a broken LTV/CAC calculation, a supply chain bottleneck, or a rigid standardization mismatch — can halt growth entirely, proving that scaling is a game of systemic balance, not raw volume alone.</p>`;

  const articleSummary = `Scaling requires transitioning the entire enterprise across several interlocking systems: adoption, cost, supply, logistics, capital, and geography. Each phase requires a different operational trade-off, such as shifting from marketing reach to trust features, standardizing brands while localizing flavors, or accepting higher production costs to eliminate inventory carrying risk. Sustainable growth is a system-balancing challenge where all disciplines must work in coordination.`;

  const articleTakeaways = [
    "Scaling is a structural redesign of a company's systems, not simply an increase in output volume.",
    "The transition involves aligning customer adoption, supply chains, logistics, capital, and international strategies.",
    "Each subsystem introduces specific trade-offs, such as safety trust vs. advertising reach, or carrying costs vs. unit costs.",
    "A failure in one subsystem can undermine the scale advantages of all other divisions.",
    "Durable global leadership requires maintaining a coordinated, systemic balance across all growth dimensions."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Week 7 Review — Scale & Growth",
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
        questionText: "What does \"diffusion of innovation\" describe, per Day 43?",
        options: [
          "A single, uniform moment when an entire population adopts a new product simultaneously",
          "How a new idea, product, or behavior spreads through a population over time, typically through distinct adopter categories",
          "A government policy regulating how new products can be marketed",
          "The total revenue a company earns from a single product launch"
        ],
        correctAnswer: "How a new idea, product, or behavior spreads through a population over time, typically through distinct adopter categories",
        explanation: "This is Day 43's exact definition based on Everett Rogers' framework."
      },
      {
        questionText: "What is \"the chasm,\" per Day 43?",
        options: [
          "A physical barrier preventing international product sales",
          "The gap between early adopters and the early majority, often hardest to cross because the adoption barrier changes in kind, not just degree",
          "A legal requirement separating different adopter categories",
          "A marketing budget threshold a company must reach before launching"
        ],
        correctAnswer: "The gap between early adopters and the early majority, often hardest to cross because the adoption barrier changes in kind, not just degree",
        explanation: "This is Day 43's exact definition of the chasm."
      },
      {
        questionText: "What are \"economies of scale,\" per Day 44?",
        options: [
          "A company's total revenue in a given year",
          "The cost advantage a company gains as its production or purchasing volume increases, spreading certain costs across more units",
          "A government subsidy for large retailers",
          "A pricing strategy based purely on charging lower margins"
        ],
        correctAnswer: "The cost advantage a company gains as its production or purchasing volume increases, spreading certain costs across more units",
        explanation: "This is Day 44's exact definition of economies of scale."
      },
      {
        questionText: "Why does Day 44 argue that Walmart's low prices largely reflect lower costs rather than thinner margins?",
        options: [
          "Because margins and costs are identical concepts with no meaningful distinction",
          "Because a genuine cost advantage compounds and persists over time, while a thin-margin strategy alone would be fragile and easier for a competitor to match",
          "Because Walmart never earns any profit on the products it sells",
          "Because thinner margins always produce a more durable advantage than lower costs"
        ],
        correctAnswer: "Because a genuine cost advantage compounds and persists over time, while a thin-margin strategy alone would be fragile and easier for a competitor to match",
        explanation: "This is Day 44's central distinction between pricing strategies and structural cost advantages."
      },
      {
        questionText: "What is \"vertical integration,\" per Day 45?",
        options: [
          "A company expanding its existing product line to more countries",
          "A company bringing critical upstream or downstream capabilities in-house, rather than relying on external suppliers",
          "A government requirement for large companies to diversify",
          "A pricing strategy based on charging different prices in different regions"
        ],
        correctAnswer: "A company bringing critical upstream or downstream capabilities in-house, rather than relying on external suppliers",
        explanation: "This is Day 45's exact framing of vertical integration."
      },
      {
        questionText: "Why does Day 45 argue vertical integration matters most during industry-wide scarcity?",
        options: [
          "Because scarcity always eliminates the need for any supply chain at all",
          "Because suppliers facing constrained capacity typically prioritize certain customers, and a company controlling its own inputs isn't dependent on that prioritization",
          "Because scarcity only affects companies that don't vertically integrate",
          "Because vertical integration is illegal during periods of scarcity"
        ],
        correctAnswer: "Because suppliers facing constrained capacity typically prioritize certain customers, and a company controlling its own inputs isn't dependent on that prioritization",
        explanation: "Controlling internal component production avoids dependence on third-party allocation decisions."
      },
      {
        questionText: "What is \"inventory carrying cost,\" per Day 46?",
        options: [
          "The price a customer pays for a finished product",
          "The real cost of goods sitting unsold — capital tied up, warehouse space, and markdowns needed to clear excess stock",
          "The cost of manufacturing a single unit of product",
          "A government tax applied to unsold retail inventory"
        ],
        correctAnswer: "The real cost of goods sitting unsold — capital tied up, warehouse space, and markdowns needed to clear excess stock",
        explanation: "This is Day 46's exact definition of inventory carrying cost."
      },
      {
        questionText: "What trade-off does Zara's supply chain accept, per Day 46?",
        options: [
          "A lower per-unit manufacturing cost in exchange for higher inventory carrying costs",
          "A higher per-unit manufacturing cost in exchange for dramatically lower inventory carrying and markdown costs",
          "No trade-off at all",
          "Zara's supply chain has no relationship to manufacturing or inventory carrying cost"
        ],
        correctAnswer: "A higher per-unit manufacturing cost in exchange for dramatically lower inventory carrying and markdown costs",
        explanation: "Zara accepts production penalties of small-batch manufacturing to eliminate write-downs and carrying costs."
      },
      {
        questionText: "What is \"lifetime value,\" per Day 47?",
        options: [
          "The total number of years a company has existed",
          "The total revenue a subscription customer generates over their entire time as a customer, not just at the moment of purchase",
          "The interest rate charged on a business loan",
          "The total value of a company's physical assets"
        ],
        correctAnswer: "The total revenue a subscription customer generates over their entire time as a customer, not just at the moment of purchase",
        explanation: "This is Day 47's exact definition of customer lifetime value (LTV)."
      },
      {
        questionText: "According to Day 47, why can heavy spending to acquire a new subscription customer be economically rational despite a near-term reported loss?",
        options: [
          "Because reported losses are always illegal but tolerated in the software industry",
          "Because the customer's lifetime value, accumulated over years, can eventually exceed the acquisition cost, even though the cost hits the books immediately",
          "Because acquisition costs never actually appear on a company's income statement",
          "Because subscription customers never generate any real revenue"
        ],
        correctAnswer: "Because the customer's lifetime value, accumulated over years, can eventually exceed the acquisition cost, even though the cost hits the books immediately",
        explanation: "This is Day 47's core explanation of the lifetime-value-to-customer-acquisition-cost math."
      },
      {
        questionText: "What is \"glocalization,\" per Day 48?",
        options: [
          "A legal requirement for multinational companies to incorporate in every country they operate in",
          "A deliberate, continuous calibration of which brand elements stay globally consistent and which adapt to local markets",
          "A pricing strategy based purely on currency exchange rates",
          "A marketing technique used exclusively in emerging markets"
        ],
        correctAnswer: "A deliberate, continuous calibration of which brand elements stay globally consistent and which adapt to local markets",
        explanation: "This is Day 48's exact definition of glocalization."
      },
      {
        questionText: "Why does Day 48 argue that standardizing too rigidly across all markets carries real risk?",
        options: [
          "Because rigid standardization is illegal in most countries",
          "Because it can miss local taste preferences, regulatory requirements, or purchasing-power differences that make an identical approach unprofitable or culturally out of step",
          "Because standardization always increases a company's costs regardless of market",
          "Because rigid standardization has no relationship to a company's performance in any market"
        ],
        correctAnswer: "Because it can miss local taste preferences, regulatory requirements, or purchasing-power differences that make an identical approach unprofitable or culturally out of step",
        explanation: "This is Day 48's explanation of the risks associated with rigid product or brand standardization."
      },
      {
        questionText: "Based on Days 44 and 45 together, how do economies of scale and vertical integration both relate to a company's cost structure as it grows?",
        options: [
          "They are unrelated concepts with no bearing on each other",
          "Both describe ways a company's cost structure can improve with size — economies of scale by spreading fixed costs across more units, vertical integration by controlling inputs rather than depending on external suppliers",
          "Vertical integration always eliminates the benefits of economies of scale",
          "Economies of scale only apply to retail companies, while vertical integration only applies to manufacturers"
        ],
        correctAnswer: "Both describe ways a company's cost structure can improve with size — economies of scale by spreading fixed costs across more units, vertical integration by controlling inputs rather than depending on external suppliers",
        explanation: "Both are key scaling mechanics: one deals with volume amortization, the other with supply chain control."
      },
      {
        questionText: "Based on Days 46 and 47 together, what do supply chain economics and the growth-vs-profitability tradeoff have in common as decision frameworks?",
        options: [
          "Nothing — they are entirely unrelated concepts",
          "Both require weighing a near-term cost or loss against a longer-term benefit — carrying cost savings in one case, customer lifetime value in the other — rather than judging a decision purely on its immediate financial appearance",
          "Both apply exclusively to subscription software companies",
          "Both require a company to always minimize near-term costs regardless of long-term value"
        ],
        correctAnswer: "Both require weighing a near-term cost or loss against a longer-term benefit — carrying cost savings in one case, customer lifetime value in the other — rather than judging a decision purely on its immediate financial appearance",
        explanation: "Both models require managing near-term capital expenditure to lock in structural advantages over time."
      },
      {
        questionText: "Based on Days 43 and 48 together, how might correctly diagnosing a specific adoption barrier (Day 43) relate to a company's internationalization strategy (Day 48)?",
        options: [
          "They are unrelated — adoption barriers only matter domestically, and internationalization only concerns brand consistency",
          "A company expanding internationally may need to identify and address a specific local adoption barrier (similar to the \"stranger danger\" barrier) unique to a new market, rather than assuming its home-market product and marketing will diffuse identically abroad",
          "Diffusion of innovation only applies to technology companies, while internationalization only applies to consumer goods companies",
          "International markets never have any adoption barriers unique to that specific culture or region"
        ],
        correctAnswer: "A company expanding internationally may need to identify and address a specific local adoption barrier (similar to the \"stranger danger\" barrier) unique to a new market, rather than assuming its home-market product and marketing will diffuse identically abroad",
        explanation: "Local cultural, financial, or regulatory adoption barriers require local adaptation (glocalization) to resolve."
      },
      {
        questionText: "A new mobile payment app is adopted quickly by tech-savvy early users but stalls when trying to reach the broader population, who express concerns about the security of storing payment information on their phones. Based on Day 43, what should the company prioritize?",
        options: [
          "Increasing advertising spend targeted at the same tech-savvy audience that already adopted the app",
          "Directly addressing the security concern raised by the broader population, since this represents the specific barrier blocking their adoption",
          "Assuming the broader population will eventually adopt without any further action",
          "Lowering the app's price, regardless of whether price was ever the stated concern"
        ],
        correctAnswer: "Directly addressing the security concern raised by the broader population, since this represents the specific barrier blocking their adoption",
        explanation: "Mainstream users have different safety constraints. Reassuring security concerns directly crosses the chasm."
      },
      {
        questionText: "A company assumes that because its product succeeded with innovators and early adopters, the same marketing approach will naturally work with the broader, more risk-averse population. Based on Day 43, what is the flaw in this assumption?",
        options: [
          "There is no flaw — all adopter categories respond identically to the same marketing approach",
          "The flaw is assuming the adoption barrier is the same across categories, when it often changes in kind, not just degree, at the chasm between early adopters and the early majority",
          "Early adopters and the broader population are always identical in every market",
          "Marketing has no effect on adoption in any adopter category"
        ],
        correctAnswer: "The flaw is assuming the adoption barrier is the same across categories, when it often changes in kind, not just degree, at the chasm between early adopters and the early majority",
        explanation: "Mainstream adopter segments face structurally different adoption criteria compared to early cohorts."
      },
      {
        questionText: "A retailer builds a large, centralized distribution network at significant fixed cost, then grows its sales volume substantially without expanding that network proportionally. Based on Day 44, what happens to its cost per unit shipped as volume grows?",
        options: [
          "It increases, since more volume always increases costs",
          "It decreases, since the fixed cost of the distribution network gets spread across a larger number of units",
          "It remains completely unchanged regardless of volume",
          "It has no relationship to the company's distribution network"
        ],
        correctAnswer: "It decreases, since the fixed cost of the distribution network gets spread across a larger number of units",
        explanation: "Growing sales volume amortizes the large fixed investment of the central network across more units, reducing average unit shipping costs."
      },
      {
        questionText: "A new competitor attempts to match an established, large-scale retailer's prices immediately, without having built comparable purchasing volume or logistics infrastructure. Based on Day 44, what is the most likely outcome?",
        options: [
          "The new competitor will sustainably match prices indefinitely with no financial strain",
          "The new competitor is likely to face an unsustainable cost disadvantage, since it lacks the volume needed to achieve comparable economies of scale",
          "Economies of scale have no bearing on a new competitor's ability to match prices",
          "The new competitor's prices will automatically become the new market standard"
        ],
        correctAnswer: "The new competitor is likely to face an unsustainable cost disadvantage, since it lacks the volume needed to achieve comparable economies of scale",
        explanation: "Entering a price war without comparable unit-cost scale leads to immediate cash bleed and structural insolvency."
      },
      {
        questionText: "A company relies entirely on a single external supplier for a critical component. During an industry-wide shortage, that supplier prioritizes a larger competitor. Based on Day 45, what vulnerability does this illustrate?",
        options: [
          "A vulnerability that vertical integration is specifically designed to insulate against",
          "A vulnerability entirely unrelated to the concepts in this lesson",
          "A vulnerability that only affects companies in the semiconductor industry",
          "A vulnerability with no realistic solution under any circumstances"
        ],
        correctAnswer: "A vulnerability that vertical integration is specifically designed to insulate against",
        explanation: "This is a classic supplier-dependency vulnerability. Vertical integration (making components in-house) bypasses third-party rationing."
      },
      {
        questionText: "Two companies produce similar final products. Company A vertically integrates its critical upstream components. Company B relies entirely on external suppliers for the same components. During an industry-wide supply shortage, which company is more likely to maintain stable production?",
        options: [
          "Company B, since relying on external suppliers always provides more stability during shortages",
          "Company A, since controlling its own upstream inputs insulates it from a supplier's prioritization decisions during constrained supply",
          "Neither company's production stability is affected by vertical integration",
          "Both companies will experience identical outcomes"
        ],
        correctAnswer: "Company A, since controlling its own upstream inputs insulates it from a supplier's prioritization decisions during constrained supply",
        explanation: "Internal upstream control secures capacity prioritization during global market shortages."
      },
      {
        questionText: "A retailer orders a large batch of seasonal inventory six months in advance based on a demand forecast that turns out to be significantly wrong, leaving substantial unsold stock. Based on Day 46, what costs does this retailer now bear?",
        options: [
          "No additional costs beyond the original manufacturing expense",
          "Tied-up capital, ongoing warehouse costs, and markdowns needed to clear the unsold inventory",
          "Only a minor administrative cost with no real financial impact",
          "Costs with no relationship to the concepts in this lesson"
        ],
        correctAnswer: "Tied-up capital, ongoing warehouse costs, and markdowns needed to clear the unsold inventory",
        explanation: "Unsold stock is a balance sheet liability that drains cash due to storage overhead and discounted margins."
      },
      {
        questionText: "Two retailers sell similar products. Retailer A uses large, infrequent batches produced far from its distribution centers. Retailer B uses small, frequent batches produced close to its distribution centers. Based on Day 46, which retailer is more likely to have lower inventory carrying costs?",
        options: [
          "Retailer A, since larger batches always reduce inventory carrying costs",
          "Retailer B, since smaller, more frequent batches based on closer, faster feedback reduce the capital tied up in unsold goods and the markdowns needed to clear them",
          "Neither retailer's batch size or production location affects inventory carrying costs",
          "Both retailers will have identical inventory carrying costs"
        ],
        correctAnswer: "Retailer B, since smaller, more frequent batches based on closer, faster feedback reduce the capital tied up in unsold goods and the markdowns needed to clear them",
        explanation: "Responsive, local production aligns supply closely with demand, minimizing safety stock and markdown risk."
      },
      {
        questionText: "A subscription company reports a significant net loss, but its customer retention rates are strong and its average customer remains subscribed for many years. Based on Day 47, what is the most useful additional information needed to evaluate whether this loss reflects a sound strategy?",
        options: [
          "Whether the company's logo has been recently redesigned",
          "Whether the lifetime value of acquired customers, summed over their subscription life, actually exceeds what it cost to acquire them",
          "Whether the company's competitors are also reporting losses",
          "Whether the company has ever been profitable in any previous year"
        ],
        correctAnswer: "Whether the lifetime value of acquired customers, summed over their subscription life, actually exceeds what it cost to acquire them",
        explanation: "If customer lifetime value (LTV) exceeds the acquisition cost (CAC), frontloaded acquisition costs reflect strategic asset creation."
      },
      {
        questionText: "A mature subscription company finds that acquiring new customers has become significantly more expensive than in its earlier growth years, while its existing customer base remains large and stable. Based on Day 47, what shift in strategy would this situation likely justify?",
        options: [
          "Continuing to prioritize new-customer acquisition exclusively, regardless of rising costs",
          "Shifting some reinvestment toward improving margins on the existing customer base, since the same dollar may now generate a better return there",
          "Abandoning the subscription model entirely",
          "This situation has no bearing on how the company should allocate reinvestment"
        ],
        correctAnswer: "Shifting some reinvestment toward improving margins on the existing customer base, since the same dollar may now generate a better return there",
        explanation: "Shifting resources to harvest and upsell the existing customer base yields better returns when CAC spikes."
      },
      {
        questionText: "A beverage company enters a new market with significantly lower average purchasing power than its home market but insists on selling the exact same package sizes and price points used at home. Based on Day 48, what risk does this create?",
        options: [
          "No risk at all — package size and pricing should always remain identical across every market",
          "A risk that the product will be unaffordable or poorly suited to local purchasing power, missing an opportunity that adapting package size and pricing could have captured",
          "A risk that only applies to companies operating in the beverage industry",
          "A risk with no relationship to the concepts in this lesson"
        ],
        correctAnswer: "A risk that the product will be unaffordable or poorly suited to local purchasing power, missing an opportunity that adapting package size and pricing could have captured",
        explanation: "Failing to localize packaging size (e.g. smaller singles) locked to local cash availability limits adoption."
      },
      {
        questionText: "A company allows each country's local team to fully redesign its logo, name, and core visual identity independently, with no shared global standard. Based on Day 48, what risk does this create?",
        options: [
          "No risk at all — full local customization always strengthens a global brand",
          "A risk of losing the global brand consistency and recognition that made the company valuable as a single global brand",
          "A risk that only applies to beverage companies specifically",
          "A risk with no relationship to a company's overall brand value"
        ],
        correctAnswer: "A risk of losing the global brand consistency and recognition that made the company valuable as a single global brand",
        explanation: "Brand fragmentation erodes the global trust and marketing efficiency that unified international scale provides."
      },
      {
        questionText: "A company achieves significant economies of scale (Day 44) and vertically integrates its supply chain (Day 45), but its distribution network isn't designed for the kind of responsive, small-batch replenishment described in Day 46. Based on all three lessons, what tension might this company face if it enters a fast-changing, trend-sensitive market?",
        options: [
          "None — economies of scale and vertical integration always eliminate any need for supply chain responsiveness",
          "A potential conflict between its large-batch, scale-optimized cost structure and the responsiveness a trend-sensitive market may require, since Day 46 shows these are often different, competing supply chain priorities",
          "Vertical integration and economies of scale are incompatible concepts that cannot coexist in the same company",
          "This scenario has no relationship to the concepts covered this week"
        ],
        correctAnswer: "A potential conflict between its large-batch, scale-optimized cost structure and the responsiveness a trend-sensitive market may require, since Day 46 shows these are often different, competing supply chain priorities",
        explanation: "High-volume manufacturing setups struggle to match the agility required to pivot production for rapidly shifting consumer trends."
      },
      {
        questionText: "A subscription software company (Day 47) expands internationally (Day 48) and finds that its home-market growth-first strategy doesn't translate directly, because new markets have different purchasing power affecting what customers are willing to pay and how long they remain subscribers. Based on both lessons together, what should this company reconsider?",
        options: [
          "Nothing — growth-first strategies and lifetime value calculations are always identical across every market and country",
          "Its lifetime-value-versus-acquisition-cost math for each new market specifically, since purchasing power and retention patterns — key inputs to that calculation — can differ meaningfully by country, similar to how Day 48 shows other business elements need local recalibration",
          "Whether to abandon international expansion entirely regardless of any market-specific analysis",
          "Whether to change its logo before making any further decisions"
        ],
        correctAnswer: "Its lifetime-value-versus-acquisition-cost math for each new market specifically, since purchasing power and retention patterns — key inputs to that calculation — can differ meaningfully by country, similar to how Day 48 shows other business elements need local recalibration",
        explanation: "Reinvestment limits and viability parameters are not global constants; they must be re-calibrated local-by-local."
      },
      {
        questionText: "A company has achieved genuine economies of scale (Day 44), correctly diagnosed and addressed a specific adoption barrier in a new market (Day 43), and calibrated which brand elements to standardize versus localize as it expanded internationally (Day 48). Based on everything covered this week, what would be the most important remaining question about this company's continued growth?",
        options: [
          "Whether its supply chain and organizational structure (Days 45 and 46) are set up to support this scale and reach without introducing new carrying-cost or supplier-dependency risks, and whether its growth-vs-profitability balance (Day 47) still reflects sound underlying reinvestment math at this stage",
          "Nothing further — achieving these three things guarantees indefinite future success with no further considerations",
          "Whether the company's logo is recognizable in every market it operates in, regardless of any other factor",
          "Whether the company should immediately abandon international markets despite its successful expansion"
        ],
        correctAnswer: "Whether its supply chain and organizational structure (Days 45 and 46) are set up to support this scale and reach without introducing new carrying-cost or supplier-dependency risks, and whether its growth-vs-profitability balance (Day 47) still reflects sound underlying reinvestment math at this stage",
        explanation: "Sustainable scaling requires matching outward sales and market growth with robust operational supply lines, carrying efficiencies, and profitable capital math."
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
