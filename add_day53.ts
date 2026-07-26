import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 53;
  const tag = "Week 8";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>In 1980, Shenzhen was a fishing town. Today, a company founded there controls a majority of the world's consumer drone market — built almost entirely on a manufacturing supply chain the government decided, decades earlier, to concentrate in exactly that city.</p>

<p>A <strong>government-backed innovation zone</strong> is a geographically defined area where a government deliberately concentrates favorable regulatory, tax, infrastructure, or trade conditions specifically to attract manufacturing, technology, or investment activity that wouldn't cluster there naturally on its own. Shenzhen's designation as one of China's original Special Economic Zones in 1980 is a defining example: a policy decision made decades before any specific company or industry existed to benefit from it.</p>

<p>The mechanism here is <strong>supply chain density</strong> — over decades, the zone's initial manufacturing investment attracted component suppliers, assembly capacity, and skilled manufacturing labor, each new arrival making the area more attractive to the next one, until the region became an <em>extraordinarily dense concentration</em> of exactly the capabilities a hardware company needs. This is a manufactured, deliberately engineered version of the ecosystem density concept covered elsewhere in this unit — the difference is that it was built by government policy rather than emerging organically from a single earlier company's success.</p>

<p>This distinction matters for whether the advantage lasts. A zone that offers only temporary tax breaks or cheap land tends to <u>lose its advantage the moment those incentives expire</u> or a cheaper location appears elsewhere, because nothing about operating there was ever truly necessary. A zone that builds toward genuine supply chain density <u>creates a different kind of advantage entirely</u> — one where a company would put itself at a real competitive disadvantage by trying to build the same thing anywhere else, independent of any ongoing subsidy.</p>`;

  const conceptSummary = `A government-backed innovation zone concentrates favorable conditions in one location to attract activity that wouldn't cluster there naturally. Shenzhen's 1980 Special Economic Zone designation is a defining example, building supply chain density over decades — component suppliers, assembly capacity, skilled labor — that reinforced itself. Zones offering only temporary tax incentives lose their advantage once incentives expire; zones that build genuine supply chain density create a lasting advantage independent of any subsidy.`;

  const conceptTakeaways = [
    "A government-backed innovation zone deliberately concentrates favorable conditions in one location to attract activity that wouldn't form there naturally.",
    "Shenzhen's 1980 Special Economic Zone designation predated any specific company benefiting from it by decades.",
    "Supply chain density — suppliers, assembly capacity, skilled labor — reinforces itself over time once a zone reaches critical mass.",
    "Zones offering only temporary incentives tend to lose their advantage once those incentives expire.",
    "Zones that build genuine supply chain density create a lasting advantage independent of any ongoing subsidy."
  ];

  const articleTitle = "How a Fishing Town Became the Only Place on Earth to Build a Consumer Drone";
  
  const articleText = `<p><strong>How does a company end up controlling most of the world's consumer drone market from a single Chinese city?</strong></p>

<p>DJI was founded in 2006 in Shenzhen by Frank Wang (Wang Tao), building on the city's extraordinarily dense electronics manufacturing supply chain to design, prototype, and mass-produce consumer drones faster and more cheaply than competitors located elsewhere could manage.</p>

<p><strong>Why did that supply chain exist in Shenzhen specifically, rather than forming naturally somewhere else?</strong></p>

<p>Shenzhen was designated one of China's first Special Economic Zones in 1980 — a deliberate government policy decision that attracted manufacturing investment, infrastructure, and skilled labor to concentrate there over the following decades, well before DJI or the consumer drone market existed at all. <em>The advantage DJI eventually inherited was decades in the making</em> before the company itself was founded.</p>

<p><strong>What does having this supply chain nearby actually let DJI do that a company elsewhere couldn't easily replicate?</strong></p>

<p>Rapid iteration on hardware prototypes. Component suppliers and assembly capacity within a short distance mean a design change can be tested and refined in days, rather than requiring weeks of overseas shipping for each revision. <u>This lets DJI move through product development cycles faster</u> than competitors located in regions without comparable manufacturing density.</p>

<p><strong>If this advantage came from government policy decades earlier, does that mean any government can replicate it just by designating a similar zone today?</strong></p>

<p>Not automatically. Simply designating a zone with tax breaks doesn't produce the dense, self-reinforcing supply chain Shenzhen built over decades. <u>The density itself — not the initial policy alone — became the durable advantage</u>, and building that density requires sustained investment and time, not just a policy announcement.</p>

<p><strong>If you were launching a hardware startup requiring rapid prototyping and manufacturing today, would you locate near Shenzhen's dense supply chain even at higher local costs — or build in a region with lower costs but a thinner manufacturing base?</strong></p>

<p>Locating near the dense supply chain trades higher local costs for faster iteration speed and easier access to specialized component suppliers. A thinner manufacturing base elsewhere might look cheaper on paper, but could slow product development enough to offset any cost savings — <em>the right choice depends on how sensitive your specific hardware category is to iteration speed</em>.</p>

<p><strong>So was DJI's real advantage its drone technology — or the government-built manufacturing density surrounding the company decades before it existed?</strong></p>

<p>The technology mattered, but the surrounding manufacturing density — seeded by a government policy decision made in 1980, long before drones were a category at all — is what made building that specific technology, at that specific speed and cost, possible in Shenzhen in the first place.</p>`;

  const articleSummary = `DJI, founded in 2006 in Shenzhen, built its dominant position in the consumer drone market on a manufacturing supply chain that traces back to Shenzhen's 1980 designation as a Chinese Special Economic Zone. Decades of accumulated component suppliers, assembly capacity, and skilled labor let DJI iterate on hardware faster and more cheaply than competitors elsewhere. The advantage illustrates how a government policy decision, made long before any specific industry existed, can shape which companies later become possible.`;

  const articleTakeaways = [
    "DJI was founded in 2006 in Shenzhen by Frank Wang, building on the city's dense electronics manufacturing supply chain.",
    "Shenzhen was designated one of China's first Special Economic Zones in 1980, decades before DJI or the drone market existed.",
    "The city's dense supply chain enables faster hardware iteration than regions with thinner manufacturing capacity.",
    "Simply designating a new zone with incentives doesn't automatically replicate this decades-built supply chain density.",
    "DJI's advantage reflects government-built manufacturing density as much as its own drone technology."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Government-Backed Innovation Zones",
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
        questionText: "What is a \"government-backed innovation zone,\" as defined in this lesson?",
        options: [
          "A geographically defined area where a government deliberately concentrates favorable conditions to attract activity that wouldn't cluster there naturally",
          "A tax exemption available to any company regardless of location",
          "A private company's internal research and development department",
          "A university's technology transfer office"
        ],
        correctAnswer: "A geographically defined area where a government deliberately concentrates favorable conditions to attract activity that wouldn't cluster there naturally",
        explanation: "this is the exact definition given. B, C, and D are fabricated or unrelated claims."
      },
      {
        questionText: "What is \"supply chain density,\" per this lesson?",
        options: [
          "The total number of laws regulating a specific industry",
          "The concentration of component suppliers, assembly capacity, and skilled labor built up in a region over time, reinforcing itself as it grows",
          "A measure of how many countries a company exports to",
          "A government tax rate applied to manufacturing companies"
        ],
        correctAnswer: "The concentration of component suppliers, assembly capacity, and skilled labor built up in a region over time, reinforcing itself as it grows",
        explanation: "this is the exact definition given. A, C, and D are fabricated or unrelated claims."
      },
      {
        questionText: "According to this lesson, why did Shenzhen's advantage for a company like DJI take decades to build, rather than happening immediately?",
        options: [
          "Because Shenzhen's Special Economic Zone designation in 1980 predated DJI and the drone market by decades, and supply chain density accumulated gradually over that time",
          "Because Chinese law prohibited manufacturing companies from operating in Shenzhen until recently",
          "Because DJI itself built the entire supply chain single-handedly before founding the company",
          "Because supply chain density has no relationship to how long a region has been developing"
        ],
        correctAnswer: "Because Shenzhen's Special Economic Zone designation in 1980 predated DJI and the drone market by decades, and supply chain density accumulated gradually over that time",
        explanation: "this is the lesson's direct explanation. B, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "Why does this lesson argue that a zone offering only temporary tax incentives tends to lose its advantage once those incentives expire?",
        options: [
          "Because temporary incentives are always illegal under international law",
          "Because nothing about operating there was ever truly necessary if the underlying supply chain density was never built",
          "Because all government incentives are permanent by law",
          "Because tax incentives have no relationship to where companies choose to locate"
        ],
        correctAnswer: "Because nothing about operating there was ever truly necessary if the underlying supply chain density was never built",
        explanation: "this is the lesson's direct explanation. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "You're launching a hardware startup requiring rapid prototyping today. Based on this lesson, what is the central trade-off between locating near Shenzhen's dense supply chain versus a region with lower costs but thinner manufacturing capacity?",
        options: [
          "There is no trade-off — one location is always objectively superior regardless of the specific product",
          "Higher costs near the dense supply chain trade off against faster iteration speed, while lower costs elsewhere risk slower product development that could offset any savings",
          "Manufacturing location has no bearing on a hardware startup's product development speed",
          "Government regulation requires all hardware startups to locate in Shenzhen specifically"
        ],
        correctAnswer: "Higher costs near the dense supply chain trade off against faster iteration speed, while lower costs elsewhere risk slower product development that could offset any savings",
        explanation: "this reflects the lesson's honest framing of this trade-off. A, C, and D are fabricated or oversimplified claims."
      },
      {
        questionText: "You're a policymaker considering whether designating a new economic zone with tax incentives will replicate Shenzhen's manufacturing advantage within a few years. Based on this lesson, what should you understand about this expectation?",
        options: [
          "The incentives alone will replicate the advantage immediately, since Shenzhen's success was driven entirely by its tax policy",
          "Simply designating a zone with incentives doesn't automatically produce the dense, self-reinforcing supply chain that took decades to build — density itself, not the policy alone, is the durable advantage",
          "Economic zones have no relationship to manufacturing supply chain development",
          "Any zone will automatically dominate a global industry within five years of being designated"
        ],
        correctAnswer: "Simply designating a zone with incentives doesn't automatically produce the dense, self-reinforcing supply chain that took decades to build — density itself, not the policy alone, is the durable advantage",
        explanation: "this reflects the lesson's central warning about the limits of policy alone. A, C, and D all contradict or overstate this reasoning."
      },
      {
        questionText: "A region designates a new manufacturing zone with generous tax breaks, but after the incentives expire a few years later, most companies relocate elsewhere. Based on this lesson, what does this outcome most likely indicate?",
        options: [
          "That the zone successfully built genuine, self-reinforcing supply chain density",
          "That the zone's advantage depended primarily on the temporary incentives rather than genuine, self-reinforcing supply chain density",
          "That government-backed zones can never provide any real economic value",
          "That this outcome has no relationship to the concepts in this lesson"
        ],
        correctAnswer: "That the zone's advantage depended primarily on the temporary incentives rather than genuine, self-reinforcing supply chain density",
        explanation: "this is a direct application of the lesson's distinction between temporary incentives and genuine density. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A hardware company located in a region with an extremely dense concentration of component suppliers and assembly capacity can test and revise a product design within days. A competitor in a region with a thin manufacturing base takes several weeks for the same process. Based on this lesson, what explains this difference?",
        options: [
          "Random chance with no underlying economic explanation",
          "Supply chain density — the concentration of nearby suppliers and assembly capacity — directly enables faster iteration cycles",
          "The company with the thin manufacturing base is using inferior technology",
          "Supply chain density has no relationship to product development speed"
        ],
        correctAnswer: "Supply chain density — the concentration of nearby suppliers and assembly capacity — directly enables faster iteration cycles",
        explanation: "this is a direct application of the lesson's core mechanism, mirroring DJI's actual advantage. A, C, and D contradict this reasoning."
      },
      {
        questionText: "Two governments each designate a new innovation zone. Government A focuses on building genuine, long-term supply chain density through sustained investment over decades. Government B focuses primarily on offering short-term tax incentives with minimal infrastructure investment. Based on this lesson, which zone is more likely to produce a lasting competitive advantage?",
        options: [
          "Government B's zone, since tax incentives always outperform infrastructure investment",
          "Government A's zone, since genuine supply chain density creates an advantage independent of any ongoing subsidy, unlike temporary incentives alone",
          "Neither zone's approach has any bearing on its long-term success",
          "Both zones will produce identical outcomes regardless of their strategy"
        ],
        correctAnswer: "Government A's zone, since genuine supply chain density creates an advantage independent of any ongoing subsidy, unlike temporary incentives alone",
        explanation: "this is a direct application of the lesson's central distinction. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A company considers relocating its manufacturing away from a dense supply chain hub to cut costs, even though this would significantly slow its product iteration speed for a category where fast iteration is critical to competing effectively. Based on this lesson, what should this company weigh most carefully before making this decision?",
        options: [
          "Whether the cost savings from relocating are large enough to offset the competitive disadvantage of slower iteration in a category where speed matters significantly",
          "Nothing — manufacturing location never affects a company's competitiveness in any industry",
          "Whether the new location has cheaper land, regardless of any other factor",
          "Whether the government will object to the relocation"
        ],
        correctAnswer: "Whether the cost savings from relocating are large enough to offset the competitive disadvantage of slower iteration in a category where speed matters significantly",
        explanation: "this is a direct application of the lesson's reasoning about the real trade-offs of supply chain density. B, C, and D all ignore or contradict this reasoning."
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
