import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 43;
  const tag = "Week 7";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>The technology to list a spare room online existed years before Airbnb made doing so feel normal. The missing piece was never a website. It was millions of ordinary people no longer being afraid to let a stranger sleep in their home.</p>

<p><strong>Diffusion of innovation</strong>, a framework developed by Everett Rogers, describes how a new idea, product, or behavior spreads through a population over time, typically moving through distinct adopter categories: innovators, early adopters, early majority, late majority, and laggards. Adoption doesn't spread evenly or automatically — it requires crossing specific thresholds, and those thresholds are different for different kinds of innovations.</p>

<p>For a product like Airbnb, the barrier wasn't awareness, and it wasn't price. It was a specific psychological and social barrier researchers sometimes call "stranger danger" — genuine safety concerns about staying in, or hosting, a home with someone you'd never met. Innovators and early adopters tolerated that uncertainty for the novelty and savings. The much larger early and late majority, who make up most of any market, are far more risk-averse by definition, and won't adopt until that specific barrier is directly addressed.</p>

<p>This is where <strong>the chasm</strong> — a concept building on Rogers' work — becomes the critical idea: the gap between early adopters and the early majority is often the hardest one to cross, because the barrier changes in <em>kind</em>, not just in <em>degree</em>, between these groups. A company that keeps marketing harder to the same early-adopter audience, assuming demand alone will eventually pull the majority along, is solving the wrong problem. Crossing the chasm requires identifying the specific new barrier the next segment faces, and engineering a direct solution to it — not simply reaching more people with the same message that worked before.</p>`;

  const conceptSummary = `Diffusion of innovation describes how adoption spreads through distinct categories — innovators, early adopters, early majority, late majority, laggards — rather than evenly across a population. The gap between early adopters and the early majority, "the chasm," is hardest to cross because the adoption barrier changes in kind, not degree. Crossing it requires identifying the specific new barrier the next, more risk-averse segment faces, and engineering a direct solution to it.`;

  const conceptTakeaways = [
    "Diffusion of innovation describes adoption spreading through distinct categories: innovators, early adopters, early majority, late majority, laggards.",
    "Different adopter categories face different barriers — not just less awareness, but genuinely different concerns.",
    "The chasm between early adopters and the early majority is often the hardest gap to cross.",
    "Marketing harder to the same early-adopter audience doesn't automatically pull the more risk-averse majority along.",
    "Crossing the chasm requires engineering a direct solution to the next segment's specific barrier, not just wider reach."
  ];

  const articleTitle = "How Airbnb Convinced the World's Most Cautious Travelers to Sleep in a Stranger's Home";
  
  const articleText = `<p><strong>Why did it take years for an idea as simple as "rent your spare room" to reach mainstream adoption, when the core technology — a website, a booking system — was trivial to build?</strong></p>

<p>Airbnb's earliest users, in its first couple of years, were risk-tolerant, budget-conscious travelers and hosts willing to try something genuinely unproven. This early group was never the hard part of the adoption story. Getting them on board required little more than a working product and word of mouth among people already inclined to take a chance.</p>

<p><strong>What specifically stopped a much larger group of ordinary travelers and homeowners from trying it, even once they'd heard about it?</strong></p>

<p>The "stranger danger" barrier — real safety concerns about whether a guest might damage a home, or whether a host might not be trustworthy or safe to stay with. No amount of marketing aimed at the same early-adopter audience would resolve this, because the early majority's risk tolerance was fundamentally different from the group that had already signed up.</p>

<p><strong>How did Airbnb specifically engineer a solution to that exact barrier, rather than simply marketing harder to the same audience?</strong></p>

<p>Through dedicated trust infrastructure: identity verification, a public review system letting hosts rate guests and guests rate hosts, host protection programs covering property damage, and professional photography services that made listings look credible rather than amateur. Each of these was aimed specifically at reducing the stranger-danger barrier, not at increasing general awareness of the platform.</p>

<p><strong>Why does correctly diagnosing this barrier matter more than simply having a good product once you're past the earliest adopters?</strong></p>

<p>Because the early majority doesn't adopt due to hype or a marginally better product — they adopt once the specific concern that made them hesitate is directly and visibly addressed. Misreading this stage as "we just need more marketing" spends resources without touching the actual reason mainstream users were staying away.</p>

<p><strong>If you ran Airbnb in its early years with a marketing budget to spend, would you have spent it reaching more potential mainstream users through advertising — or building trust features that most current, already-satisfied early adopters weren't specifically asking for?</strong></p>

<p>Advertising reaches more people faster in the short term but does nothing to address the specific reason risk-averse mainstream users were hesitating in the first place. Building trust features costs more time and may look unnecessary to an already-satisfied early-adopter base, but is what actually converts a niche product into something the much larger mainstream population is willing to try.</p>

<p><strong>So was Airbnb's mainstream breakthrough really about marketing reach — or about correctly diagnosing the specific barrier stopping the next wave of adopters?</strong></p>

<p>Reach alone didn't create mainstream adoption. Specifically identifying and engineering around the stranger-danger barrier is what let adoption actually diffuse past the early adopters into the much larger population that had been waiting for exactly that reassurance.</p>`;

  const articleSummary = `Airbnb's early adopters embraced the platform readily, but the much larger mainstream population hesitated over a specific "stranger danger" barrier that no amount of marketing to the same early audience could resolve. Airbnb addressed this directly through identity verification, public reviews, host protection programs, and professional photography — trust infrastructure engineered specifically for that barrier. This illustrates how crossing from early adopters to the mainstream requires solving a new, specific concern, not simply expanding reach.`;

  const articleTakeaways = [
    "Airbnb's earliest adopters were risk-tolerant, budget-conscious users willing to try an unproven platform.",
    "The much larger mainstream population hesitated specifically over safety concerns — the \"stranger danger\" barrier.",
    "Airbnb addressed this directly through identity verification, public reviews, host protection programs, and professional photography.",
    "Marketing alone to the same early-adopter audience wouldn't have resolved the mainstream population's specific concern.",
    "Crossing from early adopters to mainstream adoption required solving a new, specific barrier, not just expanding reach."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Diffusion of Innovation",
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
        questionText: "What does \"diffusion of innovation\" describe, as defined in this lesson?",
        options: [
          "A single, uniform moment when an entire population adopts a new product simultaneously",
          "How a new idea, product, or behavior spreads through a population over time, typically through distinct adopter categories",
          "A government policy regulating how new products can be marketed",
          "The total revenue a company earns from a single product launch"
        ],
        correctAnswer: "How a new idea, product, or behavior spreads through a population over time, typically through distinct adopter categories",
        explanation: "This is the exact definition of diffusion of innovation based on Everett Rogers' framework. The other choices are fabricated or contradicted."
      },
      {
        questionText: "What is \"the chasm,\" as used in this lesson?",
        options: [
          "A physical barrier preventing international product sales",
          "The gap between early adopters and the early majority, often the hardest to cross because the adoption barrier changes in kind, not just degree",
          "A legal requirement separating different adopter categories",
          "A marketing budget threshold a company must reach before launching"
        ],
        correctAnswer: "The gap between early adopters and the early majority, often the hardest to cross because the adoption barrier changes in kind, not just degree",
        explanation: "The lesson defines the chasm as the gap between early adopters and the early majority, noting that the barrier changes in kind, not just degree."
      },
      {
        questionText: "According to this lesson, why couldn't Airbnb resolve mainstream hesitation simply by marketing more to its existing early-adopter audience?",
        options: [
          "Because marketing budgets are always fixed regardless of audience",
          "Because the early majority's specific concern (safety with strangers) was fundamentally different from what motivated the early adopters, requiring a different kind of solution",
          "Because marketing is illegal once a product has early adopters",
          "Because early adopters and the early majority are identical groups with no meaningful differences"
        ],
        correctAnswer: "Because the early majority's specific concern (safety with strangers) was fundamentally different from what motivated the early adopters, requiring a different kind of solution",
        explanation: "Mainstream users have different risk profiles and concerns than early adopters; marketing harder to early adopters won't address the safety barrier mainstream users feel."
      },
      {
        questionText: "What specific barrier does this lesson identify as blocking Airbnb's adoption by the mainstream population?",
        options: [
          "A lack of awareness that the platform existed",
          "The \"stranger danger\" barrier — safety concerns about hosting or staying with an unfamiliar person",
          "The platform's pricing being too expensive for most travelers",
          "A legal restriction preventing most people from using the platform"
        ],
        correctAnswer: "The \"stranger danger\" barrier — safety concerns about hosting or staying with an unfamiliar person",
        explanation: "The lesson explicitly defines the core barrier for the mainstream as the stranger-danger concern (safety of letting strangers stay or staying with strangers)."
      },
      {
        questionText: "You run Airbnb in its early years with a marketing budget to spend. Based on this lesson, what is the strongest argument for investing in trust features (reviews, verification, insurance) rather than broader advertising?",
        options: [
          "Advertising always produces a larger increase in adoption than any product feature",
          "Trust features directly address the specific barrier preventing the much larger, risk-averse mainstream population from adopting, while advertising alone doesn't resolve that concern",
          "Trust features are legally required before any marketing campaign can launch",
          "Early adopters specifically requested these trust features before anyone else considered using the platform"
        ],
        correctAnswer: "Trust features directly address the specific barrier preventing the much larger, risk-averse mainstream population from adopting, while advertising alone doesn't resolve that concern",
        explanation: "Mainstream users won't adopt until their specific safety fears are solved. Trust features do this, whereas ads just broadcast a product they are already too afraid to use."
      },
      {
        questionText: "You're launching a new product that has succeeded with early adopters but is struggling to reach the broader mainstream market. Based on this lesson, what should your next step be?",
        options: [
          "Repeat the same marketing message that worked with early adopters, but to a larger audience",
          "Identify the specific new barrier the mainstream, more risk-averse audience faces, which may be different from what early adopters cared about, and address it directly",
          "Assume the mainstream market will adopt automatically once enough time has passed",
          "Lower the price, since price is always the barrier preventing mainstream adoption"
        ],
        correctAnswer: "Identify the specific new barrier the mainstream, more risk-averse audience faces, which may be different from what early adopters cared about, and address it directly",
        explanation: "Crossing the chasm requires finding out what specifically holds back the next risk-averse segment and engineering a solution for it."
      },
      {
        questionText: "A new mobile payment app is adopted quickly by tech-savvy early users but stalls when trying to reach the broader population, who express concerns about the security of storing payment information on their phones. Based on this lesson, what should the company prioritize?",
        options: [
          "Increasing advertising spend targeted at the same tech-savvy audience that already adopted the app",
          "Directly addressing the security concern raised by the broader population, since this represents the specific barrier blocking their adoption",
          "Assuming the broader population will eventually adopt without any further action",
          "Lowering the app's price, regardless of whether price was ever the stated concern"
        ],
        correctAnswer: "Directly addressing the security concern raised by the broader population, since this represents the specific barrier blocking their adoption",
        explanation: "The payment app's situation mirrors Airbnb's: the mainstream's safety/security barrier must be solved directly before they will trust and adopt the system."
      },
      {
        questionText: "A company assumes that because its product succeeded with innovators and early adopters, the same marketing approach will naturally work with the broader, more risk-averse population. Based on this lesson, what is the flaw in this assumption?",
        options: [
          "There is no flaw — all adopter categories respond identically to the same marketing approach",
          "The flaw is assuming the adoption barrier is the same across categories, when it often changes in kind, not just degree, especially at the chasm between early adopters and the early majority",
          "Early adopters and the broader population are always identical in every market",
          "Marketing has no effect on adoption in any adopter category"
        ],
        correctAnswer: "The flaw is assuming the adoption barrier is the same across categories, when it often changes in kind, not just degree, especially at the chasm between early adopters and the early majority",
        explanation: "Mainstream users don't think like early adopters; they face different barriers in kind (e.g. risk/safety rather than curiosity/performance)."
      },
      {
        questionText: "Two companies both cross successfully from early adopters to mainstream adoption. Company A achieved this by identifying and directly addressing a specific concern unique to the mainstream audience. Company B achieved this simply by increasing marketing spend to the same message used for early adopters. Based on this lesson, which company's approach is more consistent with the mechanism described?",
        options: [
          "Company B's approach, since increased marketing spend always resolves the chasm",
          "Company A's approach, since correctly diagnosing and addressing the mainstream audience's specific new barrier is what the lesson identifies as the actual mechanism for crossing the chasm",
          "Neither approach relates to the concepts in this lesson",
          "Both approaches are equally consistent with the lesson's framework"
        ],
        correctAnswer: "Company A's approach, since correctly diagnosing and addressing the mainstream audience's specific new barrier is what the lesson identifies as the actual mechanism for crossing the chasm",
        explanation: "The lesson's core takeaway is that engineering solutions around the next segment's specific barrier is the actual driver of diffusion, not reach alone."
      },
      {
        questionText: "A new medical wearable device is adopted quickly by health-enthusiast early users but faces resistance from the broader population, who express distrust about a new, unfamiliar company handling their personal health data. Based on this lesson, what would be the most effective next step for this company?",
        options: [
          "Continue targeting health enthusiasts with the same messaging, since they represent the only relevant adopter category",
          "Directly address the data-trust concern raised by the broader population — for example, through transparent privacy practices or third-party certification — since this represents their specific barrier to adoption",
          "Assume the broader population's concerns are identical to those of the early health-enthusiast adopters",
          "Lower the device's price, regardless of whether cost was ever the stated concern"
        ],
        correctAnswer: "Directly address the data-trust concern raised by the broader population — for example, through transparent privacy practices or third-party certification — since this represents their specific barrier to adoption",
        explanation: "Solving the privacy trust issue directly unlocks the mainstream segment, exactly as Airbnb's reviews and guarantees unlocked cautious travelers."
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
