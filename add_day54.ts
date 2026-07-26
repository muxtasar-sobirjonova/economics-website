import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 54;
  const tag = "Week 8";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>For most of its post-Soviet history, Uzbekistan didn't have a single startup reaching billion-dollar scale. Then, within a relatively short span, it produced one — built almost entirely on serving its own domestic market first, rather than trying to expand abroad from day one.</p>

<p><strong>Regional ecosystem building</strong> describes the earlier-stage process a region goes through before it can produce companies at the scale seen in more mature ecosystems. This is different from the mature-ecosystem density covered elsewhere in this unit — it's about what has to happen first, in a region that doesn't yet have decades of prior successes to draw on.</p>

<p>Three ingredients tend to matter most at this stage: <strong>local investment</strong> willing to fund an early, unproven domestic company rather than requiring international validation first; <strong>digital infrastructure</strong> — mobile penetration, digital payments — reaching a threshold that makes a domestic digital business genuinely viable; and a <strong>large enough domestic consumer market</strong> to support real scale without needing to expand internationally immediately.</p>

<p>This is where the idea of an <strong>anchor company</strong> matters. A region's first major domestically-built success often matters less for its own specific outcome than for what it proves to everyone watching: that <em>domestic capital, domestic market conditions, and domestic infrastructure were viable</em> all along. That proof becomes the seed for the next generation's confidence, capital, and experienced talent — the beginning of the same recycling effect covered elsewhere in this unit, at its earliest possible stage.</p>

<p>A regional ecosystem doesn't start with density. It starts with <u>one company proving the domestic conditions were viable</u>, which then becomes the foundation the region's future density is built on.</p>`;

  const conceptSummary = `Regional ecosystem building describes the earlier-stage process a region without a prior major success goes through — requiring local investment willing to fund unproven domestic companies, sufficient digital infrastructure, and a large enough domestic market to support scale. A first major domestic success functions as an anchor company: its main value isn't its own outcome, but proving domestic conditions were viable, seeding confidence and talent for the region's next generation of founders.`;

  const conceptTakeaways = [
    "Regional ecosystem building describes the earlier-stage process before a region has accumulated the density seen in mature ecosystems.",
    "Local investment willing to fund unproven domestic companies is a key early-stage ingredient.",
    "Sufficient digital infrastructure — mobile penetration, digital payments — must reach a workable threshold first.",
    "A large enough domestic market allows a company to scale without needing international expansion immediately.",
    "An anchor company's main value is proving domestic conditions were viable, seeding the next generation's confidence and talent."
  ];

  const articleTitle = "How One Company Became Uzbekistan's Proof That Its Own Market Was Enough";
  
  const articleText = `<p><strong>How does a country with no prior billion-dollar startup suddenly produce one, seemingly out of nowhere?</strong></p>

<p>Uzum built its business around Uzbekistan's own domestic consumer market — e-commerce and fintech services — at a moment when rising mobile penetration, growing digital payments adoption, and a large domestic consumer base made a homegrown platform viable without needing international expansion first. The company has reportedly been described as <em>Uzbekistan's first outcome reaching unicorn-level scale</em>.</p>

<p><strong>Why did building for the domestic market first matter, rather than trying to expand internationally immediately?</strong></p>

<p>Proving a business model works domestically, with domestic capital and domestic infrastructure, <u>builds the proof-of-concept and investor confidence</u> a still-forming regional ecosystem needs before it can support riskier international expansion bets. Skipping straight to international ambition, without that domestic proof first, would have meant competing on unfamiliar ground before establishing any local track record at all.</p>

<p><strong>What specific ingredients had to be in place in Uzbekistan for a company like this to succeed now, rather than a decade earlier?</strong></p>

<p>Local investment willing to fund an unproven domestic company rather than requiring international validation first; digital infrastructure — mobile penetration and digital payments adoption — reaching a workable threshold; and a large enough, growing consumer market to support real scale entirely within the domestic economy.</p>

<p><strong>Why does a single anchor success like this matter more broadly than just its own outcome?</strong></p>

<p>A first major domestic success generates experienced local talent, <u>demonstrates to domestic investors that funding local companies can actually pay off</u>, and gives the next generation of local founders a genuine local reference point — rather than only distant international examples that may not reflect the specific conditions of building in Uzbekistan.</p>

<p><strong>If you were an investor in a region with no prior major domestic tech success, would you wait for international validation before funding a promising local founder — or take the earlier, riskier bet that domestic capital and domestic market conditions were already viable?</strong></p>

<p>Waiting for international validation is the safer choice, but it risks losing the founder to international capital and relocation entirely, delaying the region's own ecosystem formation indefinitely. Taking the earlier domestic bet is riskier, but is exactly the kind of decision that, if it succeeds, <em>becomes the anchor company seeding the region's future density</em>.</p>

<p><strong>So was this company's success really about e-commerce or fintech specifically — or about proving an entire region's market and capital were ready all along?</strong></p>

<p>The specific business mattered, but its larger significance was proving, for the first time, that Uzbekistan's own domestic conditions could support an outcome of this scale — a proof point the region's next generation of founders and investors can now build on directly.</p>`;

  const articleSummary = `Uzum built its business around Uzbekistan's domestic e-commerce and fintech market, reportedly becoming the country's first outcome reaching unicorn-level scale. Its success depended on local investment willing to fund an unproven domestic company, digital infrastructure reaching a workable threshold, and a large enough domestic market to support scale without international expansion. As an anchor company, its broader significance lies in proving domestic conditions were viable for the region's next generation of founders.`;

  const articleTakeaways = [
    "Uzum built its business around Uzbekistan's domestic e-commerce and fintech market, reportedly becoming the country's first unicorn-scale outcome.",
    "Its success depended on local investment, sufficient digital infrastructure, and a large enough domestic consumer market.",
    "Building domestically first established proof-of-concept before considering any international expansion.",
    "As an anchor company, its significance extends beyond its own outcome to what it proves about the region's viability.",
    "Its success gives the next generation of local founders and investors a genuine domestic reference point."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Regional Ecosystem Building",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
        tag // Sync the tag to Week 8
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
        questionText: "What is \"regional ecosystem building,\" as defined in this lesson?",
        options: [
          "The mature, dense state of an already well-established startup ecosystem",
          "The earlier-stage process a region without prior major successes goes through to build the conditions needed to produce a first significant company",
          "A government program that directly funds every new business in a region",
          "A university's technology transfer office"
        ],
        correctAnswer: "The earlier-stage process a region without prior major successes goes through to build the conditions needed to produce a first significant company",
        explanation: "this is the exact definition given. A describes the opposite, mature stage. C and D are fabricated, unrelated claims."
      },
      {
        questionText: "What are the three key ingredients this lesson identifies as mattering most at the regional ecosystem building stage?",
        options: [
          "Government subsidies, foreign aid, and international press coverage",
          "Local investment willing to fund unproven companies, sufficient digital infrastructure, and a large enough domestic market",
          "University research funding, patent law, and corporate tax rates",
          "Import tariffs, currency controls, and export quotas"
        ],
        correctAnswer: "Local investment willing to fund unproven companies, sufficient digital infrastructure, and a large enough domestic market",
        explanation: "this is the exact set of ingredients given. A, C, and D are fabricated or unrelated claims."
      },
      {
        questionText: "What is an \"anchor company,\" as used in this lesson?",
        options: [
          "A company that only operates within a single industry permanently",
          "A region's first major domestic success, whose main value lies in proving domestic conditions were viable and seeding confidence for the next generation",
          "A government-owned enterprise with no private investment",
          "A multinational corporation with no ties to the local region"
        ],
        correctAnswer: "A region's first major domestic success, whose main value lies in proving domestic conditions were viable and seeding confidence for the next generation",
        explanation: "this is the exact definition given. A, C, and D are fabricated or unrelated claims."
      },
      {
        questionText: "According to this lesson, why does building for the domestic market first matter for an early-stage regional ecosystem, rather than expanding internationally immediately?",
        options: [
          "Because international expansion is always illegal for early-stage companies",
          "Because proving a business model works domestically builds proof-of-concept and investor confidence that a still-forming ecosystem needs before supporting riskier international bets",
          "Because domestic markets are always larger than international ones",
          "Because international customers never purchase products from newly formed regional ecosystems"
        ],
        correctAnswer: "Because proving a business model works domestically builds proof-of-concept and investor confidence that a still-forming ecosystem needs before supporting riskier international bets",
        explanation: "this is the lesson's direct explanation. A, C, and D are fabricated or unsupported claims."
      },
      {
        questionText: "You're an investor in a region with no prior major domestic tech success, deciding whether to wait for international validation before funding a promising local founder. Based on this lesson, what is the trade-off in this decision?",
        options: [
          "There is no trade-off — waiting for international validation is always strictly better with no downside",
          "Waiting is safer but risks losing the founder to international capital and relocation, while taking the earlier domestic bet is riskier but could become the region's anchor company",
          "Domestic investment always guarantees a worse outcome than waiting for international validation",
          "This decision has no bearing on the region's future ecosystem development"
        ],
        correctAnswer: "Waiting is safer but risks losing the founder to international capital and relocation, while taking the earlier domestic bet is riskier but could become the region's anchor company",
        explanation: "this reflects the lesson's honest framing of this trade-off. A, C, and D all contradict or oversimplify this reasoning."
      },
      {
        questionText: "You're a founder in a region with no prior major domestic tech success, considering whether to expand internationally immediately or build for your domestic market first. Based on this lesson, what should guide your decision?",
        options: [
          "Always expand internationally immediately regardless of your region's ecosystem stage",
          "Consider building domestic proof-of-concept first, since this is what a still-forming regional ecosystem typically needs before it can support riskier international bets",
          "International expansion is always safer than building domestically, regardless of circumstances",
          "Your region's ecosystem stage has no bearing on this decision"
        ],
        correctAnswer: "Consider building domestic proof-of-concept first, since this is what a still-forming regional ecosystem typically needs before it can support riskier international bets",
        explanation: "this directly mirrors Uzum's actual strategic approach as described in the lesson. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A region's mobile penetration and digital payments adoption finally reach a level that makes a domestic e-commerce platform commercially viable for the first time. Based on this lesson, what does this development represent?",
        options: [
          "An irrelevant technical detail with no bearing on regional ecosystem building",
          "One of the key ingredients — sufficient digital infrastructure — needed for a region's first major domestic success to become possible",
          "Evidence that the region has already reached mature ecosystem density",
          "A factor that only matters for international, not domestic, businesses"
        ],
        correctAnswer: "One of the key ingredients — sufficient digital infrastructure — needed for a region's first major domestic success to become possible",
        explanation: "this is a direct application of the lesson's ingredient framework. A, C, and D contradict or misapply this reasoning."
      },
      {
        questionText: "A region produces its first major domestic tech success. Based on this lesson, what is this company's broader significance to the region, beyond its own specific business outcome?",
        options: [
          "None — an anchor company's success has no bearing on future founders in the region",
          "It proves domestic capital, market conditions, and infrastructure were viable, seeding confidence and providing a reference point for the next generation of local founders",
          "It guarantees every future company in the region will automatically succeed",
          "It has significance only for its own industry, with no broader ecosystem effect"
        ],
        correctAnswer: "It proves domestic capital, market conditions, and infrastructure were viable, seeding confidence and providing a reference point for the next generation of local founders",
        explanation: "this is a direct application of the lesson's anchor-company concept. A, C, and D contradict or overstate this reasoning."
      },
      {
        questionText: "Two regions each have promising early-stage founders. In Region A, local investors are willing to fund an unproven domestic company. In Region B, local investors require international validation first, and the promising founder relocates abroad as a result. Based on this lesson, which region is more likely to develop its own regional ecosystem, and why?",
        options: [
          "Region B, since requiring international validation always produces stronger local ecosystems",
          "Region A, since local investment willing to fund unproven companies is a key ingredient for regional ecosystem building, while Region B's approach risks losing its founders to relocation",
          "Neither region's outcome is affected by local investment willingness",
          "Both regions will develop identical ecosystems regardless of investment behavior"
        ],
        correctAnswer: "Region A, since local investment willing to fund unproven companies is a key ingredient for regional ecosystem building, while Region B's approach risks losing its founders to relocation",
        explanation: "this is a direct application of the lesson's central argument about local investment as a key ingredient. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A region has a large, growing domestic consumer market, but has never had a major locally-built company reach significant scale. Based on this lesson, what would be needed, beyond market size alone, for this region to produce its first anchor company?",
        options: [
          "Market size alone is always sufficient, with no other factors required",
          "Local investment willing to fund unproven companies and sufficient digital infrastructure, alongside the large domestic market, since all three ingredients matter together",
          "International expansion must happen before any domestic success is possible",
          "An anchor company can only emerge in regions with prior mature ecosystems"
        ],
        correctAnswer: "Local investment willing to fund unproven companies and sufficient digital infrastructure, alongside the large domestic market, since all three ingredients matter together",
        explanation: "this is a direct application of the lesson's three-ingredient framework. A, C, and D all contradict or oversimplify this reasoning."
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
