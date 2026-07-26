import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 40;
  const tag = "Week 6";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Xiaomi didn't try to build a better iPhone. It built a phone with most of the meaningful features at a fraction of the price — and then made money almost entirely somewhere else.</p>

<p><strong>Sustaining innovation</strong> improves an existing product along the exact dimensions its current best, most profitable customers already value — faster processors, sleeker materials, better cameras, higher prices to match. <strong>Disruptive innovation</strong> does something different: it offers a product that's initially worse on those same premium dimensions, but good enough, and dramatically cheaper, for a segment the incumbent has overlooked or chosen not to prioritize — and then improves steadily until it threatens the incumbent's core market entirely.</p>

<p>This is why disruption is so easy for incumbents to dismiss at first, and so dangerous later. A premium smartphone maker chasing sustaining innovation is, quite reasonably, focused on its most profitable existing customers — the ones who already pay for the best camera, the best build quality, the fastest chip. A disruptive competitor's early product genuinely is worse on exactly those dimensions. <em>Dismissing it as inferior isn't a mistake in the moment</em>. The mistake is assuming that because it's worse for your current best customers, it isn't a threat to your business at all.</p>

<p>The overlooked segment a disruptor serves is often large enough, on its own, to build a real company around — and once that company has scale, revenue, and a foothold, <u>"good enough" keeps improving</u>, year after year, while the incumbent's most profitable customers slowly become a smaller and smaller share of the total market. The incumbent wasn't beaten by a better product. It was beaten by a <em>worse one that was aimed at a bigger group of people</em> the incumbent had decided weren't worth building for.</p>`;

  const conceptSummary = `Sustaining innovation improves a product along the dimensions current best customers value; disruptive innovation offers something initially worse on those dimensions, but good enough and far cheaper for an overlooked segment. Incumbents chasing sustaining innovation reasonably dismiss disruptors as inferior, since early disruptive products genuinely are worse for premium customers. The danger is that the overlooked segment can be large enough to build a real business around, one that improves steadily over time.`;

  const conceptTakeaways = [
    "Sustaining innovation improves a product along the dimensions its current best customers already value.",
    "Disruptive innovation offers a product that's initially worse on those dimensions, but good enough and far cheaper for an overlooked segment.",
    "Incumbents reasonably dismiss early disruptive products as inferior, since they genuinely are worse for the incumbent's best customers.",
    "The danger isn't a competitor building a better premium product — it's a \"good enough\" product aimed at a larger, overlooked segment.",
    "Disruptive products improve over time, while the incumbent's premium segment becomes a shrinking share of the total market."
  ];

  const articleTitle = "The Phone Company That Made Almost No Profit on Phones — On Purpose";
  
  const articleText = `<p><strong>How does a smartphone company undercut premium brands on price and still build a hugely valuable business?</strong></p>

<p>Xiaomi, founded in 2010 in China by Lei Jun, entered the smartphone market pricing its hardware close to cost, offering devices with strong specifications at a fraction of premium brands' prices. On paper, this looked like a company giving away margin. In practice, it was a deliberate structural choice about where the profit would actually come from.</p>

<p><strong>If the phones were priced near cost, where did the actual profit come from?</strong></p>

<p>Xiaomi built revenue through software and services, an ecosystem of internet-connected products, and high sales volume, rather than relying on hardware margin the way premium brands do. This is a <u>fundamentally different revenue structure</u> — low-margin hardware paired with volume and ecosystem revenue — not simply a cheaper version of the premium playbook.</p>

<p><strong>Why didn't premium smartphone brands see this as a serious threat right away?</strong></p>

<p>Because early Xiaomi devices were genuinely inferior to flagship premium phones on the exact dimensions premium buyers cared about most — build materials, brand cachet, camera refinement. Premium incumbents reasonably judged that their most profitable existing customers had no reason to switch to a device that was worse on the things those customers valued. <em>What they missed was that Xiaomi wasn't trying to win those customers at all</em>.</p>

<p><strong>Who was Xiaomi actually building its product for, if not premium smartphone buyers?</strong></p>

<p>Price-sensitive customers, particularly in emerging markets, who couldn't or wouldn't pay premium prices but still wanted a smartphone with most of the functionality that mattered to them. This was a segment premium brands' sustaining-innovation strategy had effectively left behind — not because it was small, but because serving it well would have meant <u>accepting margins premium brands weren't structured to accept</u>.</p>

<p><strong>If you ran a premium smartphone brand in the early 2010s and dismissed Xiaomi's cheaper, lower-margin phones as irrelevant to your business, would you have kept optimizing for your existing premium customers — or started worrying about the segment below you?</strong></p>

<p>Continuing to optimize for premium customers protects your most profitable near-term revenue, and is the entirely rational response to a competitor whose product is, by every metric your best customers care about, worse than yours. Worrying about the segment below requires taking seriously a competitor that looks weak exactly where you're strong — which is precisely why <em>disruption is so easy to dismiss</em> until the overlooked segment has grown too large to ignore.</p>

<p><strong>So was Xiaomi's real innovation a better phone — or a completely different idea about where the profit should come from?</strong></p>

<p>The phones themselves were good enough, not best-in-class. The real innovation was recognizing a large, underserved, price-sensitive segment and building an entirely different revenue structure around serving it — the textbook shape of disruption from below.</p>`;

  const articleSummary = `Xiaomi, founded in 2010 in China, priced its smartphone hardware near cost while building profit through software, services, and ecosystem products rather than hardware margin. Its early devices were genuinely inferior to premium flagships on the dimensions premium buyers valued most, which is exactly why incumbents dismissed it as no threat. Its real target was a large, price-sensitive segment premium brands' sustaining-innovation strategy had left underserved — a classic case of disruption from below.`;

  const articleTakeaways = [
    "Xiaomi was founded in 2010 in China by Lei Jun, pricing smartphone hardware close to cost.",
    "Its revenue model relied on software, services, and ecosystem products rather than hardware margin.",
    "Early Xiaomi devices were genuinely inferior to premium flagships on build quality, brand cachet, and camera refinement.",
    "Premium incumbents reasonably dismissed the threat, since their own best customers had no reason to switch to a \"worse\" device.",
    "Xiaomi's real target was a large, price-sensitive segment left underserved by premium brands' sustaining-innovation focus."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Disruptive vs. Sustaining Innovation",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
        tag // Sync the tag to Week 6
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
        questionText: "What is \"sustaining innovation,\" as defined in this lesson?",
        options: [
          "Improving a product along the exact dimensions its current best, most profitable customers already value",
          "Offering a product that is initially worse on premium dimensions but far cheaper for an overlooked segment",
          "A government subsidy for established technology companies",
          "A pricing strategy used only by new market entrants"
        ],
        correctAnswer: "Improving a product along the exact dimensions its current best, most profitable customers already value",
        explanation: "this is the exact definition given. B describes disruptive innovation, the contrasting concept. C and D are fabricated, unrelated claims."
      },
      {
        questionText: "What is \"disruptive innovation,\" per this lesson?",
        options: [
          "Improving a product along the dimensions premium customers already value",
          "Offering a product that is initially worse on premium dimensions, but good enough and far cheaper for an overlooked segment, which improves over time",
          "A legal strategy for eliminating a competitor through litigation",
          "A pricing method used exclusively by luxury goods companies"
        ],
        correctAnswer: "Offering a product that is initially worse on premium dimensions, but good enough and far cheaper for an overlooked segment, which improves over time",
        explanation: "this is the exact definition given. A describes sustaining innovation, the contrasting concept. C and D are fabricated claims."
      },
      {
        questionText: "According to this lesson, why do incumbents often dismiss disruptive competitors at first?",
        options: [
          "Because disruptive products are always technically impossible to manufacture",
          "Because early disruptive products genuinely are worse on the exact dimensions the incumbent's best, most profitable customers care about",
          "Because incumbents are legally required to ignore new competitors",
          "Because disruptive competitors never target any real customer segment"
        ],
        correctAnswer: "Because early disruptive products genuinely are worse on the exact dimensions the incumbent's best, most profitable customers care about",
        explanation: "this is the lesson's direct explanation. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "Why did Xiaomi's early smartphones fail to alarm premium competitors immediately, according to this lesson?",
        options: [
          "Because Xiaomi's phones were genuinely inferior on build quality, brand cachet, and camera refinement — the dimensions premium buyers valued most",
          "Because Xiaomi's phones were more expensive than premium competitors' devices",
          "Because Xiaomi refused to sell its phones in any market where premium competitors operated",
          "Because premium competitors were legally prohibited from analyzing Xiaomi's products"
        ],
        correctAnswer: "Because Xiaomi's phones were genuinely inferior on build quality, brand cachet, and camera refinement — the dimensions premium buyers valued most",
        explanation: "this is the lesson's direct explanation. B, C, and D are fabricated claims not supported by the lesson."
      },
      {
        questionText: "You run a premium smartphone brand in the early 2010s and dismiss a cheaper, lower-margin competitor as irrelevant, since your best customers show no interest in switching. Based on this lesson, what should give you pause about this conclusion?",
        options: [
          "Nothing — if your best customers aren't switching, the competitor poses no real threat under any circumstances",
          "The possibility that the competitor is targeting a different, large, overlooked segment entirely, which could grow into a serious threat over time even without ever winning your current best customers",
          "The competitor's lower prices always guarantee its eventual failure",
          "Premium customers are legally protected from ever considering cheaper alternatives"
        ],
        correctAnswer: "The possibility that the competitor is targeting a different, large, overlooked segment entirely, which could grow into a serious threat over time even without ever winning your current best customers",
        explanation: "this reflects the lesson's central warning about disruption from below."
      },
      {
        questionText: "You're a founder building a product that is deliberately worse than the market leader on the dimensions its best customers value most, but far cheaper and targeted at an overlooked segment. Based on this lesson, what should your long-term strategy focus on?",
        options: [
          "Immediately trying to match the market leader's premium features and pricing",
          "Steadily improving your \"good enough\" product over time while serving the overlooked segment the incumbent has left behind",
          "Abandoning the strategy immediately since your product is currently inferior",
          "Targeting the incumbent's best customers directly from day one"
        ],
        correctAnswer: "Steadily improving your \"good enough\" product over time while serving the overlooked segment the incumbent has left behind",
        explanation: "this directly mirrors Xiaomi's actual disruptive strategy as described in the lesson. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A new company enters a market with a product that is clearly inferior to the industry leader's on every dimension the leader's best customers value, but priced at a fraction of the cost and aimed at a much larger, price-sensitive segment. Based on this lesson, what pattern does this best illustrate?",
        options: [
          "Sustaining innovation",
          "Disruptive innovation",
          "A network effect",
          "A first-mover advantage"
        ],
        correctAnswer: "Disruptive innovation",
        explanation: "this is a textbook application of the lesson's definition of disruptive innovation. A, C, and D are unrelated concepts from other lessons."
      },
      {
        questionText: "An established company continues to improve its product's premium features and pricing to serve its most loyal, high-spending customers, while ignoring a much larger, price-sensitive segment being served by a cheaper competitor. Based on this lesson, what risk does this company face?",
        options: [
          "No risk at all, since serving your best customers is always the correct strategy",
          "The risk that the cheaper competitor's product improves over time and the overlooked segment grows large enough to threaten the company's overall market position",
          "A risk that only applies to the smartphone industry specifically",
          "A risk that can be eliminated simply by lowering prices slightly"
        ],
        correctAnswer: "The risk that the cheaper competitor's product improves over time and the overlooked segment grows large enough to threaten the company's overall market position",
        explanation: "this is a direct application of the lesson's core disruption-from-below warning. A, C, and D all contradict or oversimplify this reasoning."
      },
      {
        questionText: "Two companies both notice a large, price-sensitive customer segment that current premium products don't serve well. Company A builds a lower-cost product specifically designed for that segment, accepting thinner hardware margins in exchange for scale and ecosystem revenue. Company B ignores the segment and continues optimizing its premium product. Based on this lesson, which company is following a disruptive innovation strategy?",
        options: [
          "Company A, since it is deliberately serving an overlooked segment with a different revenue structure",
          "Company B, since continuing to optimize a premium product is always disruptive",
          "Neither company's strategy relates to disruptive innovation",
          "Both companies are following identical strategies"
        ],
        correctAnswer: "Company A, since it is deliberately serving an overlooked segment with a different revenue structure",
        explanation: "this is a direct application of the lesson's definition, mirroring Xiaomi's actual strategy. B, C, and D all contradict this reasoning."
      },
      {
        questionText: "A company's product is inferior to the market leader's on every metric current premium customers care about, but it steadily improves each year while remaining dramatically cheaper, gradually gaining share among a large, overlooked segment. Based on this lesson, what should the market leader conclude about this competitor over time?",
        options: [
          "That the competitor poses no threat, since its product remains inferior on the leader's key metrics indefinitely",
          "That the competitor's steady improvement, combined with its large overlooked customer base, could eventually threaten the leader's overall market position, even without ever beating the leader on its own premium dimensions",
          "That disruptive innovation always fails within its first few years",
          "That the competitor's strategy is economically identical to a sustaining innovation approach"
        ],
        correctAnswer: "That the competitor's steady improvement, combined with its large overlooked customer base, could eventually threaten the leader's overall market position, even without ever beating the leader on its own premium dimensions",
        explanation: "this is a direct application of the lesson's core warning about how disruption unfolds over time. A, C, and D all contradict this reasoning."
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
