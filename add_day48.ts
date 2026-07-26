import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 48;
  const tag = "Week 7";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Coca-Cola sells what is, chemically, a very similar core product in over 200 countries and territories. And yet its marketing, packaging, and even some formulation details quietly differ from country to country — sometimes dramatically.</p>

<p><strong>Internationalization strategy</strong> describes how a company balances <strong>standardization</strong> — keeping a consistent global brand, product, and operating model everywhere — against <strong>localization</strong>, adapting product, marketing, or operations to fit specific local markets' tastes, regulations, or purchasing conditions, as it expands beyond its home market.</p>

<p>Coca-Cola's approach is neither pure standardization nor pure localization. It maintains extremely consistent global brand elements — the logo, core brand identity, the recognizable bottle and can design — while adapting specific product formulations, flavor variants, package sizes, and marketing campaigns to local tastes and purchasing power in different markets. This is sometimes called <strong>glocalization</strong>: a deliberate, continuous calibration of which elements must stay globally consistent and which should adapt locally, rather than a single fixed choice made once.</p>

<p>Companies that standardize too rigidly risk missing local taste preferences, regulatory requirements, or purchasing-power differences that make an identical global approach unprofitable, or culturally out of step, in specific markets. Companies that localize too aggressively risk losing the brand consistency and operational efficiency that made international scale valuable in the first place — becoming, in effect, a loose collection of independent local businesses rather than one coherent global brand.</p>

<p>Successful internationalization isn't about choosing between "be the same everywhere" and "be different everywhere." It's about correctly identifying which specific elements of the business actually need to stay consistent to preserve the brand's core value, and which can, or must, adapt to succeed in each specific local market.</p>`;

  const conceptSummary = `Internationalization strategy balances standardization (a consistent global brand and operating model) against localization (adapting to local tastes, regulation, and purchasing power). Coca-Cola keeps brand identity globally consistent while adapting formulation, packaging, and marketing locally — a "glocalization" approach. Standardizing too rigidly misses local fit; localizing too aggressively loses the brand consistency that made scale valuable. The skill lies in knowing precisely which elements must stay consistent and which should adapt.`;

  const conceptTakeaways = [
    "Internationalization strategy balances standardization (global consistency) against localization (adapting to specific markets).",
    "Coca-Cola keeps core brand identity globally consistent while adapting formulation, packaging, and marketing by market.",
    "Standardizing too rigidly risks missing local taste, regulatory, or purchasing-power differences.",
    "Localizing too aggressively risks losing the brand consistency and efficiency that made international scale valuable.",
    "The core skill is correctly identifying which specific elements must stay consistent and which should adapt locally."
  ];

  const articleTitle = "How the Same Red Can Means Something Slightly Different in Every Country It's Sold";
  
  const articleText = `<p><strong>How does one beverage company sell what looks like the same product in over 200 countries while actually varying meaningfully market to market?</strong></p>

<p>Coca-Cola maintains a highly consistent global brand identity — its logo, core visual identity, and bottle and can recognition — across virtually every market it operates in, while adjusting specific product formulations, flavor variants, package sizes, and marketing campaigns to match local tastes, purchasing power, and cultural context.</p>

<p><strong>Why not just sell the exact same product with the exact same marketing everywhere, if the brand is this strong globally?</strong></p>

<p>Local taste preferences, purchasing power — which affects ideal package sizes and price points — and regulatory requirements differ enough between markets that an identical approach everywhere would leave real value on the table, or in some cases be commercially unworkable in a specific market entirely.</p>

<p><strong>Why not just let each country's local team fully customize everything, if local adaptation matters this much?</strong></p>

<p>Fully independent local customization would risk losing the global brand consistency, quality assurance, and operational efficiencies — shared supplier relationships, unified marketing infrastructure, consistent brand trust — that make Coca-Cola valuable as a single global company rather than a loose collection of independent local beverage brands.</p>

<p><strong>How does a company actually decide which specific elements should stay globally consistent versus which should adapt locally?</strong></p>

<p>Core brand identity and quality standards typically stay globally consistent because they're what makes the brand recognizable and trustworthy everywhere. Product formulation details, package sizing, pricing, and marketing imagery adapt locally because these are the elements most sensitive to specific local tastes, purchasing power, and cultural context.</p>

<p><strong>If you were leading Coca-Cola's expansion into a new market with meaningfully different taste preferences and purchasing power than your home market, would you insist on an identical product and marketing approach to preserve brand consistency — or adapt significantly to fit local conditions, even if it meant the product looked noticeably different from market to market?</strong></p>

<p>Insisting on an identical approach protects brand consistency but risks underperforming, or failing outright, if local tastes or purchasing power genuinely don't fit the standard offering. Adapting significantly fits local conditions better but requires carefully preserving whichever core brand elements actually matter for global trust and recognition, rather than losing the brand's identity entirely in the process.</p>

<p><strong>So is Coca-Cola really one single global product — or hundreds of locally adapted products united by one carefully preserved brand identity?</strong></p>

<p>The brand is genuinely global and consistent where it matters most for trust and recognition. Much of what's actually inside the can, and how it's marketed, is quietly local — the real internationalization skill is knowing exactly which is which.</p>`;

  const articleSummary = `Coca-Cola maintains a highly consistent global brand identity across more than 200 countries while adapting product formulations, package sizes, and marketing to local tastes, purchasing power, and cultural context. This "glocalization" approach avoids both the risk of a too-rigid global standard missing local fit, and the risk of fully independent local customization losing the brand consistency and efficiency that made global scale valuable. The core skill is knowing which specific elements to keep consistent.`;

  const articleTakeaways = [
    "Coca-Cola maintains a highly consistent global brand identity — logo, visual identity, bottle and can recognition — worldwide.",
    "Product formulations, flavor variants, package sizes, and marketing adapt to local tastes and purchasing power by market.",
    "An identical global approach everywhere risks missing local taste, regulatory, or purchasing-power differences.",
    "Fully independent local customization risks losing the brand consistency and efficiency that made global scale valuable.",
    "The core internationalization skill is identifying which specific elements must stay consistent and which should adapt locally."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Internationalization Strategy",
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
        questionText: "What does \"internationalization strategy\" describe, per this lesson?",
        options: [
          "A company's decision to only ever sell in its home market",
          "How a company balances standardization (global consistency) against localization (adapting to specific local markets)",
          "A government policy regulating cross-border trade tariffs",
          "A pricing strategy used only by beverage companies"
        ],
        correctAnswer: "How a company balances standardization (global consistency) against localization (adapting to specific local markets)",
        explanation: "Internationalization strategy addresses how companies manage expansion by calibrating global consistency vs. local adaptation."
      },
      {
        questionText: "What is \"glocalization,\" as used in this lesson?",
        options: [
          "A legal requirement for multinational companies to incorporate in every country they operate in",
          "A deliberate, continuous calibration of which brand elements stay globally consistent and which adapt to local markets",
          "A pricing strategy based purely on currency exchange rates",
          "A marketing technique used exclusively in emerging markets"
        ],
        correctAnswer: "A deliberate, continuous calibration of which brand elements stay globally consistent and which adapt to local markets",
        explanation: "Glocalization is the practice of conducting business according to both local and global considerations (acting local, thinking global)."
      },
      {
        questionText: "According to this lesson, why does Coca-Cola keep its core brand identity — logo, visual identity, packaging recognition — globally consistent?",
        options: [
          "Because global consistency is legally required for beverage companies",
          "Because it's what makes the brand recognizable and trustworthy across every market it operates in",
          "Because local adaptation is more expensive than global consistency in every case",
          "Because Coca-Cola's formula is identical in every country"
        ],
        correctAnswer: "Because it's what makes the brand recognizable and trustworthy across every market it operates in",
        explanation: "A unified brand presence preserves international trust and allows marketing efficiency at scale."
      },
      {
        questionText: "Why does this lesson argue that standardizing too rigidly across all markets carries real risk?",
        options: [
          "Because rigid standardization is illegal in most countries",
          "Because it can miss local taste preferences, regulatory requirements, or purchasing-power differences that make an identical approach unprofitable or culturally out of step in specific markets",
          "Because standardization always increases a company's costs regardless of market",
          "Because rigid standardization has no relationship to a company's performance in any market"
        ],
        correctAnswer: "Because it can miss local taste preferences, regulatory requirements, or purchasing-power differences that make an identical approach unprofitable or culturally out of step in specific markets",
        explanation: "Rigid standardization ignores localized market realities such as consumer tastes, local laws, and economic purchasing parameters."
      },
      {
        questionText: "You're leading a company's expansion into a new market with meaningfully different taste preferences and purchasing power than your home market. Based on this lesson, what is the central trade-off between insisting on an identical approach versus adapting significantly?",
        options: [
          "There is no trade-off — one approach is always objectively correct regardless of market conditions",
          "An identical approach protects brand consistency but risks underperforming if local conditions don't fit, while significant adaptation fits local conditions better but risks losing core brand elements if not carefully managed",
          "Adapting significantly always destroys a brand's global value with no exceptions",
          "Insisting on an identical approach always guarantees success regardless of local market conditions"
        ],
        correctAnswer: "An identical approach protects brand consistency but risks underperforming if local conditions don't fit, while significant adaptation fits local conditions better but risks losing core brand elements if not carefully managed",
        explanation: "This highlights the core trade-off: absolute brand protection vs. commercial suitability to local tastes and contexts."
      },
      {
        questionText: "You're a brand executive deciding which specific elements of your company's global brand should remain consistent as you expand internationally. Based on this lesson, what principle should guide this decision?",
        options: [
          "Every element of the business should be standardized identically across all markets with no exceptions",
          "Core brand identity and quality standards — what makes the brand recognizable and trustworthy — should generally stay consistent, while formulation, pricing, and marketing details should be more open to local adaptation",
          "Every element of the business should be fully localized with no global consistency at all",
          "This decision should be made randomly, since brand elements have no relationship to market performance"
        ],
        correctAnswer: "Core brand identity and quality standards — what makes the brand recognizable and trustworthy — should generally stay consistent, while formulation, pricing, and marketing details should be more open to local adaptation",
        explanation: "Keep the core promise and identity identical to retain scale advantages; customize execution and delivery elements to capture local margins."
      },
      {
        questionText: "A beverage company enters a new market with a significantly lower average purchasing power than its home market, but insists on selling the exact same package sizes and price points used at home. Based on this lesson, what risk does this decision create?",
        options: [
          "No risk at all — package size and pricing should always remain identical across every market",
          "A risk that the product will be unaffordable or poorly suited to local purchasing power, missing an opportunity that adapting package size and pricing could have captured",
          "A risk that only applies to companies operating in the beverage industry",
          "A risk that has no relationship to the concepts in this lesson"
        ],
        correctAnswer: "A risk that the product will be unaffordable or poorly suited to local purchasing power, missing an opportunity that adapting package size and pricing could have captured",
        explanation: "Failing to adjust pricing formats and volumes risks locking the product out of the local mass consumer tier entirely."
      },
      {
        questionText: "A company allows each country's local team to fully redesign its logo, name, and core visual identity independently, with no shared global standard. Based on this lesson, what risk does this approach create?",
        options: [
          "No risk at all — full local customization always strengthens a global brand",
          "A risk of losing the global brand consistency and recognition that made the company valuable as a single global brand, rather than a loose collection of independent local businesses",
          "A risk that only applies to beverage companies specifically",
          "A risk that has no relationship to a company's overall brand value"
        ],
        correctAnswer: "A risk of losing the global brand consistency and recognition that made the company valuable as a single global brand, rather than a loose collection of independent local businesses",
        explanation: "Without a unified brand anchor, the company fragments into independent subsidiaries and loses its global scale advantage."
      },
      {
        questionText: "Two companies expand internationally. Company A keeps its core brand identity consistent everywhere while adapting product details and marketing to local conditions. Company B either standardizes everything rigidly or localizes everything completely, with no calibration between the two. Based on this lesson, which company's approach better reflects sound internationalization strategy?",
        options: [
          "Company B, since extreme approaches in either direction are always superior to a calibrated balance",
          "Company A, since correctly calibrating which elements stay consistent and which adapt locally is the core skill this lesson identifies",
          "Neither company's approach relates to the concepts in this lesson",
          "Both companies are using functionally identical strategies"
        ],
        correctAnswer: "Company A, since correctly calibrating which elements stay consistent and which adapt locally is the core skill this lesson identifies",
        explanation: "Good internationalization requires deliberate glocal calibration of specific variables, not all-or-nothing extremes."
      },
      {
        questionText: "A company expanding into a market with different regulatory requirements than its home country insists on using its home-market product formulation, ignoring the local regulatory differences. Based on this lesson, what is the most likely consequence?",
        options: [
          "No consequence at all — regulatory differences never affect a company's product strategy",
          "A risk that the product becomes commercially unworkable or non-compliant in that specific market, since regulatory requirements are one of the factors this lesson identifies as driving the need for local adaptation",
          "A guarantee that the company will succeed regardless of local regulations",
          "A consequence that only applies to companies operating in the beverage industry specifically"
        ],
        correctAnswer: "A risk that the product becomes commercially unworkable or non-compliant in that specific market, since regulatory requirements are one of the factors this lesson identifies as driving the need for local adaptation",
        explanation: "Ignoring local laws (ingredients, labelling, testing) creates immediate operational blockage or product bans."
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
