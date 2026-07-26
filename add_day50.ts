import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 50;
  const tag = "Week 8";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Estonia has a population smaller than Los Angeles's, yet it has produced more billion-dollar startups per capita than almost any country on Earth. That isn't a coincidence of unusually talented people being born there. It's substantially a policy choice, made deliberately over decades.</p>

<p><strong>Institutions</strong> are the formal and informal rules governing economic activity — property rights, contract enforcement, regulatory processes, and increasingly, the digital infrastructure a government provides for its own citizens and businesses. The <strong>entrepreneurship rate</strong> — how frequently new businesses actually get started in an economy — correlates strongly with the quality of these institutions, often more than with a population's raw talent or ambition.</p>

<p>Estonia's specific institutional lever is digital governance: online company registration that takes minutes rather than weeks, digital signatures with full legal standing, automated tax filing, and its well-known e-Residency program allowing even non-citizens to establish and run an Estonian company remotely. None of this guarantees a good business idea. What it does is <em>remove the fixed administrative cost</em> that, in many countries, quietly prevents a real fraction of good ideas from ever being attempted at all.</p>

<p>This is a <strong>transaction cost</strong> effect: every hour, delay, and uncertain bureaucratic step required just to legally start operating is a cost paid before a founder has sold a single unit of anything. <u>Lower that cost enough</u>, and some meaningful share of ideas that would have died in the registration process — not from bad economics, but from bureaucratic friction — actually get tried.</p>

<p>The lesson isn't that Estonia has better entrepreneurs than other countries. It's that a country doesn't need to manufacture entrepreneurial spirit through subsidies or slogans. It needs to <u>remove the institutional friction</u> that silently prevents attempts which would otherwise already be happening.</p>`;

  const conceptSummary = `Institutions — property rights, regulation, digital governance — shape how easy or hard it is to start a business, and entrepreneurship rates correlate strongly with institutional quality. Estonia's digital governance (fast online registration, digital signatures, e-Residency) lowers the transaction cost of starting a company to near zero. This doesn't create better ideas — it prevents good ideas from dying in bureaucratic friction before they're ever attempted.`;

  const conceptTakeaways = [
    "Institutions are the formal and informal rules — property rights, regulation, digital infrastructure — that shape economic activity.",
    "Entrepreneurship rates correlate strongly with institutional quality, often more than with raw talent or ambition alone.",
    "Estonia's digital governance lowers the administrative transaction cost of starting a business to near zero.",
    "Lower transaction costs convert some fraction of never-attempted ideas into ideas that actually get tried.",
    "A country doesn't need to manufacture entrepreneurial spirit — it needs to remove the friction silently preventing attempts."
  ];

  const articleTitle = "How a Country the Size of a Small U.S. City Became a Fintech Powerhouse";
  
  const articleText = `<p><strong>How does a country with fewer people than a mid-sized American city end up producing a multi-billion-dollar global fintech company?</strong></p>

<p>Wise, originally founded as TransferWise in 2011 by Taavet Hinrikus and Kristo Käärmann, began with a personal frustration: both Estonian, working between Estonia and the UK, they were losing significant money to poor exchange rates and high fees every time they needed to move currency between the two countries. They built a peer-to-peer system to solve their own problem first.</p>

<p><strong>What did Estonia's institutions specifically provide that made starting this company easier than it might have been elsewhere?</strong></p>

<p>Estonia's digital governance infrastructure — online company registration, digital signatures, automated tax filing, and its e-Residency program — meant the administrative side of forming and operating a company could happen in a fraction of the time and effort required in many other countries. <em>The founders' energy could go toward the actual product problem</em>, not toward navigating slow bureaucratic registration processes.</p>

<p><strong>How does lowering registration friction actually change how many companies get started, rather than just how comfortable founders feel while doing it?</strong></p>

<p>Many would-be founders abandon an idea not because the underlying economics are bad, but because the process of legally starting a business feels slow, costly, or uncertain enough that the idea quietly dies before a single customer is ever contacted. <u>Removing that friction doesn't improve any specific business idea</u> — it changes how many ideas actually make it past the starting line at all.</p>

<p><strong>If Estonia's institutions are this favorable, why hasn't every founder in the world simply relocated there?</strong></p>

<p>Institutions are necessary, but not sufficient. Talent, capital, market access, and a founder's specific circumstances still matter enormously. Estonia's real advantage is narrower than it might sound: it specifically <u>lowers the administrative and bureaucratic floor</u> a founder has to clear, without eliminating every other real constraint — market fit, competition, funding — involved in building a company.</p>

<p><strong>If you were a founder in a country with slow, unpredictable business registration and were offered Estonian e-Residency granting fast digital company formation, would you relocate your legal entity there while keeping your team local — or stay put and accept the friction?</strong></p>

<p>Relocating the legal entity captures a real institutional advantage at relatively low switching cost, since the team and target market don't need to move at all — but it requires navigating cross-border tax and regulatory complexity that comes with operating a company registered in one country while working from another. Staying put avoids that added complexity but keeps the original friction fully in place.</p>

<p><strong>So was Wise's success really about its product — or about being built inside institutions engineered specifically to make building it easier?</strong></p>

<p>The product solved a real, widely shared problem. But the institutional environment specifically lowered the cost of attempting that solution at all — a reminder that <em>entrepreneurship rates respond directly to institutional design</em>, not simply to how much talent or ambition a population happens to have.</p>`;

  const articleSummary = `Wise began in 2011 as TransferWise, founded by two Estonians frustrated by high currency-conversion fees between Estonia and the UK. Estonia's digital governance — fast online registration, digital signatures, e-Residency — lowered the administrative cost of starting the company, letting the founders focus on the product itself. The company's growth illustrates how institutional design, not just talent, shapes how many good ideas actually make it past the starting line.`;

  const articleTakeaways = [
    "Wise was founded in 2011 as TransferWise, by two Estonian founders solving their own currency-conversion frustration.",
    "Estonia's digital governance infrastructure lowered the administrative cost and time required to legally start the company.",
    "Institutions don't improve a specific business idea — they change how many ideas actually make it past the starting line.",
    "Estonia's institutional advantage is narrow but real: it lowers the bureaucratic floor without eliminating other business constraints.",
    "Wise's growth illustrates how entrepreneurship rates respond to institutional design as much as to founder talent."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Institutions & Entrepreneurship Rates",
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
        questionText: "What are \"institutions,\" as defined in this lesson?",
        options: [
          "Universities and research centers exclusively",
          "The formal and informal rules governing economic activity, including property rights, regulation, and digital infrastructure",
          "A country's total population size",
          "A specific company's internal management structure"
        ],
        correctAnswer: "The formal and informal rules governing economic activity, including property rights, regulation, and digital infrastructure",
        explanation: "this is the exact definition given. A, C, and D are fabricated or overly narrow claims."
      },
      {
        questionText: "What does \"entrepreneurship rate\" refer to in this lesson?",
        options: [
          "The interest rate charged on small business loans",
          "How frequently new businesses actually get started in an economy",
          "The percentage of startups that eventually become profitable",
          "The total tax rate imposed on new companies"
        ],
        correctAnswer: "How frequently new businesses actually get started in an economy",
        explanation: "this is the exact definition given. A, C, and D are fabricated or unrelated claims."
      },
      {
        questionText: "What is a \"transaction cost,\" as used in this lesson?",
        options: [
          "The price a customer pays for a product",
          "The time, delay, and administrative effort required before a founder can even begin operating, paid before any product is sold",
          "A government tax applied only to international transactions",
          "The interest rate on a business loan"
        ],
        correctAnswer: "The time, delay, and administrative effort required before a founder can even begin operating, paid before any product is sold",
        explanation: "this is the lesson's exact framing. A, C, and D are fabricated or unrelated claims."
      },
      {
        questionText: "According to this lesson, why does lowering the transaction cost of starting a business increase the actual entrepreneurship rate?",
        options: [
          "Because it makes every business idea automatically profitable",
          "Because some ideas that would otherwise die from bureaucratic friction, rather than from bad economics, actually get attempted once that friction is removed",
          "Because lower transaction costs are illegal to avoid in most countries",
          "Because transaction costs have no relationship to whether a business gets started"
        ],
        correctAnswer: "Because some ideas that would otherwise die from bureaucratic friction, rather than from bad economics, actually get attempted once that friction is removed",
        explanation: "this is the lesson's direct explanation. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "You're a founder in a country with slow, unpredictable business registration, and you're offered Estonian e-Residency allowing fast digital company formation while keeping your team local. Based on this lesson, what is the central trade-off in this decision?",
        options: [
          "There is no trade-off — relocating the legal entity is always strictly better with no added complexity",
          "Relocating captures a real institutional advantage at relatively low switching cost, but adds cross-border tax and regulatory complexity to manage",
          "Staying put always produces a better outcome regardless of the added friction",
          "E-Residency is only available to Estonian citizens"
        ],
        correctAnswer: "Relocating captures a real institutional advantage at relatively low switching cost, but adds cross-border tax and regulatory complexity to manage",
        explanation: "this reflects the lesson's honest framing of this decision. A, C, and D are fabricated or oversimplified claims."
      },
      {
        questionText: "You're a policymaker trying to raise your country's entrepreneurship rate. Based on this lesson, what should you prioritize before considering direct subsidies for new businesses?",
        options: [
          "Reducing the institutional and administrative friction involved in legally starting and operating a business",
          "Requiring all citizens to start a business by a certain age",
          "Banning all foreign competition to protect domestic startups",
          "Increasing tax rates on new companies to fund larger subsidies"
        ],
        correctAnswer: "Reducing the institutional and administrative friction involved in legally starting and operating a business",
        explanation: "this reflects the lesson's central policy argument. B, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "A country simplifies its business registration process from a six-week manual procedure to a same-day online one. Based on this lesson, what is the most likely effect on the country's entrepreneurship rate?",
        options: [
          "No effect, since registration speed has no bearing on whether businesses get started",
          "An increase, since some ideas that would have died in the slower bureaucratic process are now more likely to actually be attempted",
          "A decrease, since faster registration always leads to lower-quality businesses",
          "An effect that only applies to companies with over 100 employees"
        ],
        correctAnswer: "An increase, since some ideas that would have died in the slower bureaucratic process are now more likely to actually be attempted",
        explanation: "this is a direct application of the lesson's transaction-cost argument. A, C, and D contradict or misapply this reasoning."
      },
      {
        questionText: "Two countries have similarly talented populations and similar market opportunities, but Country A has fast, predictable business registration while Country B has slow, uncertain registration. Based on this lesson, which country is more likely to have a higher entrepreneurship rate, and why?",
        options: [
          "Country B, since more bureaucratic friction always produces more resilient founders",
          "Country A, since lower institutional friction increases the number of ideas that actually get attempted, independent of raw talent",
          "Neither country's entrepreneurship rate is affected by registration speed",
          "Both countries will have identical entrepreneurship rates regardless of institutional differences"
        ],
        correctAnswer: "Country A, since lower institutional friction increases the number of ideas that actually get attempted, independent of raw talent",
        explanation: "this is a direct application of the lesson's central argument. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A founder abandons a promising business idea specifically because navigating the required government paperwork and permits felt too slow and uncertain, even though the underlying business model was sound. Based on this lesson, what does this scenario illustrate?",
        options: [
          "A failure of the business idea itself",
          "A transaction-cost failure — a good idea prevented from being attempted by institutional friction rather than by any flaw in the idea",
          "Evidence that entrepreneurship rates have no relationship to institutional quality",
          "A situation that has no bearing on the concepts in this lesson"
        ],
        correctAnswer: "A transaction-cost failure — a good idea prevented from being attempted by institutional friction rather than by any flaw in the idea",
        explanation: "this is a direct application of the lesson's core transaction-cost concept. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A country improves its digital government infrastructure significantly but does little to improve access to capital, talent development, or market opportunities for new founders. Based on this lesson, what would you expect regarding this country's entrepreneurship outcomes?",
        options: [
          "A complete and immediate transformation into a leading global startup hub",
          "Some increase in the rate at which ideas are attempted, since institutional friction is reduced, but other real constraints — capital, talent, market access — would still matter for outcomes beyond just the attempt rate",
          "No change whatsoever, since institutions have no bearing on entrepreneurship",
          "A guaranteed decrease in entrepreneurship rates"
        ],
        correctAnswer: "Some increase in the rate at which ideas are attempted, since institutional friction is reduced, but other real constraints — capital, talent, market access — would still matter for outcomes beyond just the attempt rate",
        explanation: "this reflects the lesson's honest acknowledgment that institutions are necessary but not sufficient on their own. A, C, and D all contradict or overstate this reasoning."
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
