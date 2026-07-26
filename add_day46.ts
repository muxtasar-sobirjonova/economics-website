import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 46;
  const tag = "Week 7";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Most clothing retailers order a season's inventory once, then spend months hoping they guessed right. Zara's supply chain is built around a different idea entirely: rather than betting heavily on a forecast, find out quickly what's actually selling, and react within days.</p>

<p><strong>Supply chain economics</strong> studies how the cost, speed, and flexibility of moving goods from raw material to customer affects a company's profitability — particularly the tension between <strong>inventory carrying cost</strong> (the real, measurable cost of goods sitting unsold: capital tied up, warehouse space, and the eventual markdowns needed to clear stock that didn't sell as forecasted) and responsiveness to actual demand.</p>

<p>A traditional retailer ordering large batches far in advance, based on a seasonal forecast, bears the full cost of guessing wrong — unsold inventory tying up capital for months, warehouse costs on goods that may never sell at full price, and steep markdowns when the season ends regardless. Zara's supply chain, by contrast, keeps much of its production close to its distribution centers, runs smaller and more frequent batches, and ships to stores multiple times a week rather than once or twice a season.</p>

<p>This is a genuinely different economic trade-off, not simply a faster version of the same one. Smaller batches are less efficient to manufacture per unit — Zara accepts a higher production cost per garment in exchange for dramatically lower inventory carrying costs and far fewer markdown losses. The total cost calculation, not manufacturing efficiency alone, is what favors this model whenever the cost of carrying and marking down unsold inventory is large enough to outweigh the extra cost of smaller-batch production.</p>`;

  const conceptSummary = `Supply chain economics weighs inventory carrying cost — capital tied up, warehouse space, and markdowns on unsold goods — against the cost of production efficiency. Traditional retailers bear the full cost of forecasting wrong through large, infrequent batches. Zara's smaller, more frequent, closer-to-market production accepts a higher per-unit manufacturing cost in exchange for dramatically lower carrying and markdown costs — a different total-cost trade-off, not simply a faster version of the same model.`;

  const conceptTakeaways = [
    "Inventory carrying cost includes capital tied up in unsold goods, warehouse space, and markdowns needed to clear excess stock.",
    "Traditional retailers ordering large, infrequent batches bear the full cost of getting a forecast wrong.",
    "Zara's supply chain uses smaller, more frequent batches produced closer to distribution centers.",
    "This trades higher per-unit manufacturing cost for dramatically lower inventory carrying and markdown costs.",
    "The total cost calculation, not manufacturing efficiency alone, determines which model is more profitable."
  ];

  const articleTitle = "The Real Reason Zara Rarely Has a Warehouse Full of Clothes Nobody Wants";
  
  const articleText = `<p><strong>How does a major clothing retailer avoid ending up with warehouses full of unsold inventory the way so many competitors do?</strong></p>

<p>Zara, owned by parent company Inditex, built its supply chain around small, frequent production batches and centralized logistics hubs shipping to stores multiple times a week, rather than one or two large seasonal shipments planned months in advance.</p>

<p><strong>What is actually costly about a traditional retailer's large, infrequent batch approach, beyond simply looking inefficient?</strong></p>

<p>Capital tied up in unsold goods sitting in a warehouse for months, ongoing warehouse space costs, and the eventual markdowns required to clear stock that didn't sell as forecasted — all real costs that show up directly on a company's balance sheet and cash flow, not just abstract inefficiency.</p>

<p><strong>If Zara's smaller batches are less efficient to manufacture per unit, how does the company come out ahead overall?</strong></p>

<p>By accepting a higher per-unit production cost from smaller batches in exchange for dramatically lower inventory carrying costs and fewer markdown losses. The total cost calculation — not manufacturing efficiency alone — favors the responsive model whenever carrying and markdown costs are large enough to outweigh the extra manufacturing expense.</p>

<p><strong>Why don't more retailers simply copy this exact supply chain structure if the total economics are actually favorable?</strong></p>

<p>Building this kind of responsive supply chain requires production capacity located close to distribution centers, often at higher labor cost than distant, low-cost manufacturing regions, along with a logistics network built for frequent small shipments rather than efficient large ones — a genuinely different infrastructure investment than most retailers have already built and are reluctant to unwind.</p>

<p><strong>If you ran a traditional retailer with an already-built, efficient large-batch supply chain, would you tear it down to rebuild a more responsive one — or accept the inventory and markdown costs as simply the price of doing business your current way?</strong></p>

<p>Rebuilding means abandoning a genuinely efficient existing system for a different one with its own cost trade-offs — a significant capital and organizational undertaking. Accepting the current costs avoids that disruption, but means permanently carrying the inventory risk a more responsive competitor has largely designed away.</p>

<p><strong>So is Zara's advantage really about fashion, design, or speed alone — or about a fundamentally different answer to a basic supply chain economics question: how much should we bet on a forecast before finding out if we're right?</strong></p>

<p>The fashion and speed are visible. The underlying economic choice is about minimizing the cost of being wrong about demand, rather than optimizing purely for the lowest possible cost per unit produced.</p>`;

  const articleSummary = `Zara's supply chain uses small, frequent production batches shipped from centralized hubs multiple times a week, rather than large seasonal shipments planned months in advance. This accepts a higher per-unit manufacturing cost in exchange for dramatically lower inventory carrying costs and markdown losses. Building this kind of responsive supply chain requires production capacity near distribution centers, a different infrastructure investment most competitors already built differently and are reluctant to unwind.`;

  const articleTakeaways = [
    "Zara's supply chain uses small, frequent production batches rather than large, infrequent seasonal shipments.",
    "Traditional large-batch retailers bear real costs from unsold inventory: tied-up capital, warehouse space, and markdowns.",
    "Zara accepts a higher per-unit manufacturing cost in exchange for lower inventory carrying and markdown costs.",
    "This requires production located closer to distribution centers, often at higher labor cost than distant manufacturing.",
    "The advantage reflects a different total-cost trade-off, not simply faster manufacturing or better fashion sense."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Supply Chain Economics at Scale",
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
        questionText: "What is \"inventory carrying cost,\" as defined in this lesson?",
        options: [
          "The price a customer pays for a finished product",
          "The real cost of goods sitting unsold — capital tied up, warehouse space, and markdowns needed to clear excess stock",
          "The cost of manufacturing a single unit of product",
          "A government tax applied to unsold retail inventory"
        ],
        correctAnswer: "The real cost of goods sitting unsold — capital tied up, warehouse space, and markdowns needed to clear excess stock",
        explanation: "Carrying cost comprises storage, insurance, capital costs, and markdown exposure for unsold goods."
      },
      {
        questionText: "According to this lesson, what trade-off does Zara's supply chain accept compared to a traditional large-batch retailer?",
        options: [
          "A lower per-unit manufacturing cost in exchange for higher inventory carrying costs",
          "A higher per-unit manufacturing cost in exchange for dramatically lower inventory carrying and markdown costs",
          "No trade-off at all — Zara's model is strictly better in every cost category",
          "Zara's supply chain has no relationship to manufacturing cost or inventory carrying cost"
        ],
        correctAnswer: "A higher per-unit manufacturing cost in exchange for dramatically lower inventory carrying and markdown costs",
        explanation: "Zara pays more per unit to run small batches and transport them quickly, but saves even more money by avoiding markdowns and excess stock."
      },
      {
        questionText: "Why does this lesson argue that a traditional retailer's large, infrequent batch approach is costly, beyond simply looking inefficient?",
        options: [
          "Choose this: Because large batches are always illegal in the retail industry",
          "Because capital gets tied up in unsold goods for months, incurring warehouse costs and eventual markdowns to clear stock that didn't sell as forecasted",
          "Because large batches always produce lower-quality products",
          "Because large batches have no relationship to a company's balance sheet or cash flow"
        ],
        correctAnswer: "Because capital gets tied up in unsold goods for months, incurring warehouse costs and eventual markdowns to clear stock that didn't sell as forecasted",
        explanation: "Traditional systems require betting early on forecasts, tying up cash and incurring storage and discount penalties when demand misses expectations."
      },
      {
        questionText: "Why haven't more retailers copied Zara's exact supply chain structure, according to this lesson?",
        options: [
          "Because Zara's supply chain structure is protected by a permanent, unbreakable patent",
          "Because building this kind of responsive supply chain requires production capacity near distribution centers and a different logistics network than most retailers have already built",
          "Because responsive supply chains are illegal outside of Spain",
          "Because Zara's supply chain has no cost advantage over traditional models"
        ],
        correctAnswer: "Because building this kind of responsive supply chain requires production capacity near distribution centers and a different logistics network than most retailers have already built",
        explanation: "Competitors already have massive capital sunk in low-labor far-shore hubs and long-haul shipping routes, which are hard and expensive to restructure."
      },
      {
        questionText: "You run a traditional retailer with an already-built, efficient large-batch supply chain. Based on this lesson, what is the central trade-off in deciding whether to rebuild it into a more responsive model?",
        options: [
          "There is no trade-off — rebuilding is always the objectively correct choice regardless of cost",
          "Rebuilding means abandoning a genuinely efficient existing system for a different one with its own costs, while keeping the current system means permanently carrying the inventory risk a more responsive competitor has designed away",
          "Keeping the current system always produces better financial outcomes than any responsive alternative",
          "This decision has no bearing on a retailer's actual profitability"
        ],
        correctAnswer: "Rebuilding means abandoning a genuinely efficient existing system for a different one with its own costs, while keeping the current system means permanently carrying the inventory risk a more responsive competitor has designed away",
        explanation: "Rebuilding is a major capital task that trades off high upfront costs and execution risk against long-term markdown/inventory reductions."
      },
      {
        questionText: "You're a supply chain executive deciding whether to prioritize manufacturing efficiency (larger batches, lower per-unit cost) or responsiveness (smaller batches, higher per-unit cost but lower carrying and markdown costs). Based on this lesson, what should determine your decision?",
        options: [
          "Manufacturing efficiency should always be the sole priority regardless of carrying or markdown costs",
          "The total cost calculation — weighing the higher per-unit manufacturing cost of smaller batches against the carrying and markdown costs saved — should determine which model is more profitable overall",
          "Responsiveness should always be prioritized regardless of manufacturing cost",
          "This decision has no measurable financial impact either way"
        ],
        correctAnswer: "The total cost calculation — weighing the higher per-unit manufacturing cost of smaller batches against the carrying and markdown costs saved — should determine which model is more profitable overall",
        explanation: "Profitability is driven by total cost (production + inventory + markdown costs), not just the isolated unit cost of production."
      },
      {
        questionText: "A retailer orders a large batch of seasonal inventory six months in advance based on a demand forecast. The forecast turns out to be significantly wrong, leaving substantial unsold stock. Based on this lesson, what costs does this retailer now bear?",
        options: [
          "No additional costs beyond the original manufacturing expense",
          "Tied-up capital, ongoing warehouse costs, and markdowns needed to clear the unsold inventory",
          "Only a minor administrative cost with no real financial impact",
          "Costs that have no relationship to the concepts in this lesson"
        ],
        correctAnswer: "Tied-up capital, ongoing warehouse costs, and markdowns needed to clear the unsold inventory",
        explanation: "Unsold stock is a major drain on cash flow because of capital lockup, storage overhead, and the loss of gross margin via discount clearing."
      },
      {
        questionText: "A company redesigns its supply chain to produce smaller batches more frequently, located closer to its distribution centers, accepting a higher cost per unit manufactured. Based on this lesson, what is this company most likely trying to achieve?",
        options: [
          "Lower inventory carrying costs and reduced markdown losses, even at the cost of higher per-unit manufacturing expense",
          "A reduction in product quality to save money elsewhere",
          "An increase in inventory carrying costs on purpose",
          "No specific economic goal — the change is purely cosmetic"
        ],
        correctAnswer: "Lower inventory carrying costs and reduced markdown losses, even at the cost of higher per-unit manufacturing expense",
        explanation: "The company is optimizing for responsiveness to actual sales, accepting minor production penalties to avoid major inventory write-downs."
      },
      {
        questionText: "Two retailers sell similar products. Retailer A uses large, infrequent batches produced far from its distribution centers. Retailer B uses small, frequent batches produced close to its distribution centers. Based on this lesson, which retailer is more likely to have lower inventory carrying costs, and why?",
        options: [
          "Retailer A, since larger batches always reduce inventory carrying costs",
          "Retailer B, since smaller, more frequent batches based on closer, faster feedback reduce the amount of capital tied up in unsold goods and the markdowns needed to clear them",
          "Neither retailer's batch size or production location affects inventory carrying costs",
          "Both retailers will have identical inventory carrying costs regardless of their supply chain structure"
        ],
        correctAnswer: "Retailer B, since smaller, more frequent batches based on closer, faster feedback reduce the amount of capital tied up in unsold goods and the markdowns needed to clear them",
        explanation: "Retailer B keeps absolute inventory lower at any given moment, aligning production closely with real-time customer purchasing."
      },
      {
        questionText: "A retailer's supply chain is optimized purely for the lowest possible manufacturing cost per unit, with no consideration for inventory carrying costs or markdown risk. Based on this lesson, what risk does this retailer face if its demand forecasts are frequently inaccurate?",
        options: [
          "No risk at all, since manufacturing cost is the only relevant factor in supply chain economics",
          "A risk of significant unsold inventory, tied-up capital, and markdown losses that could offset or exceed the manufacturing cost savings",
          "A risk that only applies to companies operating outside the fashion industry",
          "A risk that is entirely eliminated simply by producing goods more cheaply"
        ],
        correctAnswer: "A risk of significant unsold inventory, tied-up capital, and markdown losses that could offset or exceed the manufacturing cost savings",
        explanation: "Over-focusing on production cost per unit ignores the cost of writing off inventory that fails to find buyers at full retail price."
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
