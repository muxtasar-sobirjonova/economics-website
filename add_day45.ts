import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 45;
  const tag = "Week 7";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Samsung doesn't just make phones. It makes many of the chips and display screens inside its own phones — and often inside its competitors' phones too.</p>

<p><strong>Organizational scaling</strong> describes how a company structures itself as it grows: it can buy critical components and services from external suppliers, relying on the open market for coordination, or it can bring those capabilities in-house through <strong>vertical integration</strong>, controlling more of its own supply chain directly. Each path carries different trade-offs as a company gets larger.</p>

<p>Samsung's specific scaling strategy vertically integrated across semiconductor manufacturing — memory chips, processors — display panel production, and consumer electronics assembly, meaning it controls, and profits from, many of the critical inputs into its own final products, rather than depending entirely on external suppliers whose costs, availability, or priorities it can't control.</p>

<p>This matters most during scarcity. A company that scales its final-product business without controlling critical upstream inputs remains vulnerable to supplier shortages, sudden price increases, or a supplier choosing to prioritize a larger or more strategically important customer during a constrained supply period, such as an industry-wide chip shortage. Vertical integration insulates growth from exactly that vulnerability — at the real cost of the enormous capital investment and organizational complexity required to build and manage genuinely different kinds of businesses under one roof.</p>

<p>This is why organizational scaling isn't only about doing more of the same thing at greater volume. Sometimes it means strategically absorbing the businesses upstream or downstream of your core product, so that growth and resilience in one division directly reinforce another — changing what kind of company you are, not just how big your existing business has become.</p>`;

  const conceptSummary = `Organizational scaling involves choosing between relying on external suppliers or vertically integrating critical inputs in-house as a company grows. Vertical integration — controlling upstream components like chips or displays — insulates a company from supplier shortages, price shocks, and rationing during scarcity, at the cost of significant capital and organizational complexity. This kind of scaling changes what kind of company you are, not just how large your existing business becomes.`;

  const conceptTakeaways = [
    "Organizational scaling includes a choice between relying on external suppliers and vertically integrating critical inputs in-house.",
    "Vertical integration means controlling and profiting from upstream inputs that go into your own final products.",
    "This insulates a company from supplier shortages, price increases, and rationing during industry-wide scarcity.",
    "Vertical integration requires significant capital investment and organizational complexity to manage genuinely different businesses.",
    "This kind of scaling changes what kind of company you are, not simply how much bigger your existing business becomes."
  ];

  const articleTitle = "The Company That Sells Phones — and Also Makes the Chips Inside Its Rivals' Phones";
  
  const articleText = `<p><strong>How does one company end up simultaneously building consumer phones and manufacturing critical chips sold to its own competitors?</strong></p>

<p>Samsung Electronics operates across semiconductor manufacturing — memory chips, processors — display panel manufacturing, and consumer electronics, including smartphones, TVs, and appliances, as interlocking divisions within the same broader company, rather than as a single product line surrounded by external suppliers.</p>

<p><strong>Why would a phone company want to also be in the business of manufacturing chips, rather than simply buying them from a specialized supplier?</strong></p>

<p>Controlling critical upstream components means Samsung's own consumer electronics division isn't purely dependent on an external supplier's pricing, availability, or priorities — especially valuable during industry-wide shortages, when a supplier facing constrained capacity typically rations supply toward whichever customers it prioritizes most.</p>

<p><strong>Doesn't selling chips to competing phone makers undermine Samsung's own consumer electronics business?</strong></p>

<p>The semiconductor division functions as its own profit center regardless of who buys from it, and the additional manufacturing volume gained by supplying external customers — including competitors — can lower the division's own unit costs further, benefiting Samsung's internal use of those same components as well.</p>

<p><strong>What's the actual risk of scaling this way, compared to simply staying focused on one core product line?</strong></p>

<p>Vertical integration requires enormous capital investment and organizational complexity to build and manage genuinely different kinds of businesses — semiconductor fabrication is an operationally different challenge from consumer electronics assembly and retail — a cost and complexity a company narrowly focused on one product line never has to bear.</p>

<p><strong>If you ran a smartphone company entirely dependent on external chip suppliers, and a global chip shortage hit, forcing suppliers to prioritize their biggest customers first, would you consider vertically integrating into chip manufacturing yourself — or seek alternative supply arrangements instead?</strong></p>

<p>Vertical integration removes the vulnerability permanently, but requires an enormous capital commitment and years to build genuine manufacturing capability. Seeking alternative supply arrangements is faster to establish, but leaves the same structural vulnerability in place the next time a shortage hits.</p>

<p><strong>So is Samsung's real scale advantage its phones — or the fact that it doesn't have to depend on anyone else for what goes inside them?</strong></p>

<p>The phones are the visible product. The deeper scaling strategy is control over the inputs that make phones — and many competitors' phones — possible at all, insulating the company's growth from vulnerabilities a less-integrated competitor still faces.</p>`;

  const articleSummary = `Samsung Electronics scaled by vertically integrating across semiconductor manufacturing, display panels, and consumer electronics, rather than relying entirely on external suppliers for critical components. This insulates its consumer electronics business from supplier shortages and price shocks, particularly valuable during industry-wide chip scarcity, while the semiconductor division profits independently, including from sales to competitors. This kind of organizational scaling requires significant capital and complexity, but changes what kind of company Samsung actually is.`;

  const articleTakeaways = [
    "Samsung Electronics operates interlocking divisions across semiconductors, display panels, and consumer electronics.",
    "Vertical integration means it isn't fully dependent on external suppliers for critical components used in its own products.",
    "This insulates its consumer electronics business from shortages and price shocks during industry-wide supply constraints.",
    "The semiconductor division profits as its own business, including through sales to competing phone makers.",
    "Vertical integration requires significant capital investment and organizational complexity that a single-product-line company avoids."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Organizational Scaling & Hiring Economics",
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
        questionText: "What is \"vertical integration,\" as used in this lesson?",
        options: [
          "A company expanding its existing product line to more countries",
          "A company bringing critical upstream or downstream capabilities in-house, rather than relying on external suppliers",
          "A government requirement for large companies to diversify",
          "A pricing strategy based on charging different prices in different regions"
        ],
        correctAnswer: "A company bringing critical upstream or downstream capabilities in-house, rather than relying on external suppliers",
        explanation: "Vertical integration is the bringing in-house of upstream (inputs/supply) or downstream (distribution/sales) operations."
      },
      {
        questionText: "According to this lesson, why does vertical integration matter most during industry-wide scarcity, such as a chip shortage?",
        options: [
          "Because scarcity always eliminates the need for any supply chain at all",
          "Because suppliers facing constrained capacity typically prioritize certain customers, and a company that controls its own inputs isn't dependent on that prioritization",
          "Because scarcity only affects companies that don't vertically integrate",
          "Because vertical integration is illegal during periods of scarcity"
        ],
        correctAnswer: "Because suppliers facing constrained capacity typically prioritize certain customers, and a company that controls its own inputs isn't dependent on that prioritization",
        explanation: "Controlling components upstream means you don't have to wait in line or face rationing by external suppliers during global shortages."
      },
      {
        questionText: "What is the real cost of vertical integration, according to this lesson?",
        options: [
          "Vertical integration has no real costs or trade-offs",
          "Significant capital investment and organizational complexity required to build and manage genuinely different kinds of businesses",
          "A legal fine imposed on companies that vertically integrate",
          "A guaranteed reduction in a company's overall profitability"
        ],
        correctAnswer: "Significant capital investment and organizational complexity required to build and manage genuinely different kinds of businesses",
        explanation: "Operating semiconductor fabs is operationally very different from retailing phones; vertical integration introduces massive capital requirements and management complexity."
      },
      {
        questionText: "Why does this lesson argue that Samsung's semiconductor division selling chips to competing phone makers doesn't necessarily undermine its own consumer electronics business?",
        options: [
          "Because Samsung is legally required to sell chips to its competitors",
          "Because the semiconductor division functions as its own profit center, and additional external sales volume can lower unit costs that benefit Samsung's internal use of the same components",
          "Because Samsung's competitors are not actually real competitors in the smartphone market",
          "Because selling chips to competitors has no relationship to Samsung's own cost structure"
        ],
        correctAnswer: "Because the semiconductor division functions as its own profit center, and additional external sales volume can lower unit costs that benefit Samsung's internal use of the same components",
        explanation: "The semiconductor business profits on its own merit, and external scale drives down production unit costs for Samsung's internal phone division."
      },
      {
        questionText: "You run a smartphone company entirely dependent on external chip suppliers, and a global chip shortage forces suppliers to prioritize their largest customers. Based on this lesson, what is the central trade-off between vertically integrating into chip manufacturing versus seeking alternative supply arrangements?",
        options: [
          "There is no trade-off — vertical integration is always the faster and cheaper solution",
          "Vertical integration removes the vulnerability permanently but requires enormous capital and years to build real capability, while alternative arrangements are faster but leave the same structural vulnerability in place",
          "Alternative supply arrangements always eliminate the vulnerability just as effectively as vertical integration",
          "This decision has no bearing on a company's long-term supply chain resilience"
        ],
        correctAnswer: "Vertical integration removes the vulnerability permanently but requires enormous capital and years to build real capability, while alternative arrangements are faster but leave the same structural vulnerability in place",
        explanation: "Vertical integration solves the problem permanently at huge cost/time; alternative contracts are quick fixes that don't change the underlying supplier dependency."
      },
      {
        questionText: "You're an executive considering whether to vertically integrate a critical upstream component into your company's operations. Based on this lesson, what should weigh most heavily in this decision?",
        options: [
          "Whether the potential insulation from supply shortages and pricing risk justifies the significant capital investment and added organizational complexity required",
          "Whether your competitors have already vertically integrated the exact same component",
          "Whether vertical integration is currently a popular business trend",
          "Whether the upstream supplier is a publicly traded company"
        ],
        correctAnswer: "Whether the potential insulation from supply shortages and pricing risk justifies the significant capital investment and added organizational complexity required",
        explanation: "Vertical integration is a structural cost-benefit decision: balancing supply security against massive organizational and capital overhead."
      },
      {
        questionText: "A company relies entirely on a single external supplier for a critical component. During an industry-wide shortage, that supplier prioritizes a larger competitor, leaving the company unable to secure enough supply. Based on this lesson, what vulnerability does this scenario illustrate?",
        options: [
          "A vulnerability that vertical integration is specifically designed to insulate against",
          "A vulnerability entirely unrelated to the concepts in this lesson",
          "A vulnerability that only affects companies in the semiconductor industry",
          "A vulnerability that has no realistic solution under any circumstances"
        ],
        correctAnswer: "A vulnerability that vertical integration is specifically designed to insulate against",
        explanation: "Relying on external suppliers creates vulnerability to rationing and priority decisions. Vertical integration avoids this dependency."
      },
      {
        questionText: "A company vertically integrates a critical component into its operations, requiring significant upfront capital investment and new organizational capabilities it didn't previously need to manage. Based on this lesson, what trade-off does this decision represent?",
        options: [
          "No trade-off — vertical integration only produces benefits with no real costs",
          "Trading significant capital investment and organizational complexity for insulation from supplier dependency and shortage risk",
          "A trade-off that only applies to consumer electronics companies specifically",
          "A decision unrelated to a company's overall scaling strategy"
        ],
        correctAnswer: "Trading significant capital investment and organizational complexity for insulation from supplier dependency and shortage risk",
        explanation: "This represents the exact core trade-off: security and control vs. high capital allocation and management complexity."
      },
      {
        questionText: "Two companies both produce similar final products. Company A vertically integrates its critical upstream components. Company B relies entirely on external suppliers for the same components. During an industry-wide supply shortage, which company is more likely to maintain stable production, and why?",
        options: [
          "Company B, since relying on external suppliers always provides more stability during shortages",
          "Company A, since controlling its own upstream inputs insulates it from a supplier's prioritization decisions during constrained supply",
          "Neither company's production stability is affected by vertical integration",
          "Both companies will experience identical outcomes regardless of their supply chain structure"
        ],
        correctAnswer: "Company A, since controlling its own upstream inputs insulates it from a supplier's prioritization decisions during constrained supply",
        explanation: "Company A controls its own supply destination, whereas Company B is subject to the capacity allocation rules of third-party vendors."
      },
      {
        questionText: "Company considers vertically integrating a component but recognizes that doing so would require entering an operationally very different type of business, requiring new expertise and significant capital. Based on this lesson, what should this company weigh before proceeding?",
        options: [
          "Nothing — vertical integration should always be pursued regardless of operational differences or cost",
          "Whether the benefits of insulation from supplier dependency justify the real costs of building and managing a genuinely different kind of business",
          "Vertical integration is only possible for companies already operating in the same industry as the component",
          "The decision has no bearing on the company's future organizational structure"
        ],
        correctAnswer: "Whether the benefits of insulation from supplier dependency justify the real costs of building and managing a genuinely different kind of business",
        explanation: "Entering an operationally foreign business requires a careful ROI assessment: balancing supply protection against the risk of executing poorly in a new sector."
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
