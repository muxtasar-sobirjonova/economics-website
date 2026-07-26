import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 51;
  const tag = "Week 8";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Filling out a single mandatory government form used to require a physical trip, a stamp, and often another trip back to fix a mistake on the first one. Multiply that by hundreds of thousands of organizations, all required to do the same kind of paperwork repeatedly, and an economy is quietly losing an enormous amount of time to a process nobody actually wanted to spend time on.</p>

<p><strong>Ease of doing business</strong> describes how simple, fast, and predictable it is to complete the standard regulatory processes a company is required to go through — registering, filing taxes, submitting documents, obtaining permits. This is narrower than the broader concept of "institutions" covered elsewhere in this unit — it focuses specifically on the day-to-day friction of regulatory compliance itself, not the wider legal and property-rights environment.</p>

<p>That friction has a name: <strong>compliance cost</strong> — the hidden cost paid not in currency, but in staff-hours, delay, and error-correction, every time an organization interacts with a mandatory process. It doesn't show up on an invoice, but it's real, and it scales directly with how many organizations are required to comply and how often.</p>

<p>This is why digitizing an existing, mandatory bureaucratic process can <em>create enormous economic value without inventing anything</em> customers didn't already need. The process — filing a document, submitting an invoice — was never optional in the first place. A company that makes an already-necessary task fast instead of slow isn't creating new demand out of nothing; it's <u>returning time and resources</u> that were previously being silently absorbed by paperwork, redirecting them toward the actual work an organization exists to do.</p>`;

  const conceptSummary = `Ease of doing business measures how simple and fast standard regulatory processes are — registration, tax filing, permits. The hidden cost of friction here is compliance cost, paid in staff time and delay rather than money, scaling with how many organizations must comply. Digitizing a mandatory process creates real economic value without inventing new demand — it returns time previously lost to paperwork back to an organization's actual core work.`;

  const conceptTakeaways = [
    "Ease of doing business measures the speed and simplicity of standard regulatory processes, distinct from the broader institutional environment.",
    "Compliance cost is the hidden cost of regulatory friction, paid in staff time and delay rather than currency.",
    "Compliance cost scales with the number of organizations required to interact with a given process.",
    "Digitizing a mandatory bureaucratic process creates real value by returning time to an organization's core work, not by inventing new demand.",
    "The value created is measured in aggregate hours and friction removed, not in any new product feature."
  ];

  const articleTitle = "The Company That Got Rich by Making Paperwork Disappear";
  
  const articleText = `<p><strong>How does a company build a large business purely by making government-required paperwork faster?</strong></p>

<p>Didox operates as an electronic document management and e-invoicing platform in Uzbekistan, reportedly used by more than 250,000 organizations, digitizing document workflows that previously required manual, paper-based processes — signatures, stamps, physical filing, and the delays that came with each step.</p>

<p><strong>What was the actual hidden cost these organizations were paying before a platform like this existed?</strong></p>

<p>Staff time spent completing, verifying, correcting, and resubmitting physical documents; delays in transactions that sat waiting for manual approval; and the <em>accumulated inefficiency of this same process repeating</em> across hundreds of thousands of organizations, each independently required to comply with similar documentation requirements.</p>

<p><strong>Why does digitizing a mandatory process create real economic value, rather than just added convenience?</strong></p>

<p>Because the value here isn't invented — it's recovered. Every hour an organization no longer spends manually processing a document it was always required to submit is an <u>hour redirected toward its actual core business</u>. The process itself wasn't optional before, and it isn't optional now; what changed is how much time and effort it consumes.</p>

<p><strong>If the value here is this large, why wasn't a platform like this built sooner?</strong></p>

<p>Digitizing a government-facing compliance process typically requires cooperation with, or at least accommodation from, the same regulatory bodies imposing the original requirement. The platform's timing reflects <em>when digital documentation was actually supported and accepted</em> as legally valid, not simply when the underlying technology first became possible to build.</p>

<p><strong>If you were building a company in this space, would you try to cover as many organizations and document types as broadly as possible immediately — or start narrowly with the single highest-friction process, then expand?</strong></p>

<p>Broad immediate coverage risks spreading effort thin across many different document types, each with its own regulatory nuance, before proving the model works well on any single one. Starting narrowly with the highest-friction process lets a company <u>demonstrate real, measurable time and cost savings</u> first, then expand its scope with that proof already established — an approach many platforms in this space have taken.</p>

<p><strong>So is this company's real product document management software — or the removal of an economy-wide hidden tax nobody had gotten around to eliminating?</strong></p>

<p>The software is the visible product. The actual value created is measured in the aggregate hours and friction removed from a process that every one of those 250,000-plus organizations was already required to complete anyway, whether or not a faster way to do it existed.</p>`;

  const articleSummary = `Didox, an electronic document management and e-invoicing platform, is reportedly used by more than 250,000 organizations in Uzbekistan, digitizing document processes that previously required manual, paper-based handling. Rather than inventing new demand, the platform recovers time and cost previously lost to compliance friction — a hidden cost paid in staff-hours rather than currency. Its value illustrates how digitizing an already-mandatory process can create large-scale economic value across an entire economy.`;

  const articleTakeaways = [
    "Didox is an electronic document management and e-invoicing platform reportedly used by over 250,000 organizations in Uzbekistan.",
    "It digitizes document workflows that previously required manual, paper-based processing.",
    "The value it creates comes from recovering time lost to compliance friction, not from inventing new demand.",
    "Digitizing government-facing compliance processes depends partly on regulatory cooperation, not just available technology.",
    "Its economic value is measured in aggregate hours and friction removed across a large number of organizations."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Ease of Doing Business & Regulation",
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
        questionText: "What does \"ease of doing business\" measure, per this lesson?",
        options: [
          "The total profit margin of companies in a given country",
          "How simple, fast, and predictable it is to complete standard regulatory processes like registration, tax filing, and permits",
          "The number of competitors operating in a specific market",
          "A country's total population size"
        ],
        correctAnswer: "How simple, fast, and predictable it is to complete standard regulatory processes like registration, tax filing, and permits",
        explanation: "this is the exact definition given. A, C, and D are fabricated or unrelated claims."
      },
      {
        questionText: "What is \"compliance cost,\" as defined in this lesson?",
        options: [
          "A government tax charged specifically for regulatory filings",
          "The hidden cost of regulatory friction, paid in staff time and delay rather than currency",
          "The interest rate charged on a business loan",
          "A fee charged by document management software companies"
        ],
        correctAnswer: "The hidden cost of regulatory friction, paid in staff time and delay rather than currency",
        explanation: "this is the exact definition given. A, C, and D are fabricated or unrelated claims."
      },
      {
        questionText: "According to this lesson, why does digitizing a mandatory bureaucratic process create real economic value?",
        options: [
          "Because it invents an entirely new product customers didn't need before",
          "Because it returns previously wasted time and effort back to an organization's actual core work, rather than inventing new demand",
          "Because digitization automatically eliminates all regulatory requirements",
          "Because compliance costs have no real economic effect on organizations"
        ],
        correctAnswer: "Because it returns previously wasted time and effort back to an organization's actual core work, rather than inventing new demand",
        explanation: "this is the lesson's direct explanation. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "Why does this lesson argue that a platform like Didox wasn't built sooner, despite the clear potential value?",
        options: [
          "Because the underlying technology for document digitization didn't exist until recently",
          "Because digitizing a government-facing compliance process typically requires cooperation or accommodation from the regulatory bodies imposing the original requirement",
          "Because compliance costs are a recent phenomenon that didn't exist before",
          "Because organizations were legally prohibited from using digital documents until very recently everywhere in the world"
        ],
        correctAnswer: "Because digitizing a government-facing compliance process typically requires cooperation or accommodation from the regulatory bodies imposing the original requirement",
        explanation: "this is the lesson's direct explanation. A, C, and D are fabricated or unsupported claims."
      },
      {
        questionText: "You're building a document digitization platform and can choose to cover many different document types broadly and immediately, or start narrowly with the single highest-friction process first. Based on this lesson, what is the strongest argument for starting narrowly?",
        options: [
          "Broad coverage always produces faster growth regardless of proof of value",
          "Starting narrowly lets you demonstrate real, measurable time and cost savings on the highest-friction process before expanding scope",
          "Regulatory bodies require companies to start with the least useful document type first",
          "Narrow coverage guarantees higher revenue than broad coverage in every case"
        ],
        correctAnswer: "Starting narrowly lets you demonstrate real, measurable time and cost savings on the highest-friction process before expanding scope",
        explanation: "this reflects the lesson's reasoning about proving value before expanding. A, C, and D are fabricated or unsupported claims."
      },
      {
        questionText: "You're a policymaker deciding whether to support digitizing a specific mandatory government process used by hundreds of thousands of organizations. Based on this lesson, what economic argument best supports this investment?",
        options: [
          "Digitization always eliminates the need for any regulation whatsoever",
          "The aggregate compliance cost — staff time and delay — currently being paid across all those organizations represents real, recoverable economic value once the process is made faster",
          "Digitizing government processes has no measurable economic effect",
          "Only private companies should ever be involved in regulatory processes"
        ],
        correctAnswer: "The aggregate compliance cost — staff time and delay — currently being paid across all those organizations represents real, recoverable economic value once the process is made faster",
        explanation: "this reflects the lesson's core economic argument. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "An organization spends significant staff time each month manually completing and resubmitting a government-required form due to frequent errors in the paper-based process. Based on this lesson, what economic concept does this situation best illustrate?",
        options: [
          "A network effect",
          "Compliance cost — a hidden cost paid in staff time rather than currency",
          "A first-mover advantage",
          "Direct marketing"
        ],
        correctAnswer: "Compliance cost — a hidden cost paid in staff time rather than currency",
        explanation: "this is a direct application of the lesson's core concept. A, C, and D are unrelated concepts from other lessons."
      },
      {
        questionText: "A company creates a platform that reduces the average time an organization spends on a mandatory compliance process from several days to a few minutes, without changing any of the underlying legal requirements. Based on this lesson, what has this company actually created?",
        options: [
          "A new legal requirement that didn't exist before",
          "Recovered economic value by removing friction from an already-mandatory process, redirecting that time toward organizations' core work",
          "A reduction in the total number of organizations required to comply",
          "A product with no measurable economic value"
        ],
        correctAnswer: "Recovered economic value by removing friction from an already-mandatory process, redirecting that time toward organizations' core work",
        explanation: "this is a direct application of the lesson's core argument. A, C, and D contradict or misstate this reasoning."
      },
      {
        questionText: "Two platforms both aim to digitize government compliance processes. Platform A tries to cover ten different document types simultaneously from launch. Platform B focuses exclusively on the single highest-friction document type first, then expands after proving value. Based on this lesson, which platform's approach is more likely to succeed initially, and why?",
        options: [
          "Platform A, since broader coverage always produces faster adoption",
          "Platform B, since proving real value on the highest-friction process first is a more effective way to establish the platform before expanding scope",
          "Neither platform's approach has any bearing on its likelihood of success",
          "Both platforms are using functionally identical strategies"
        ],
        correctAnswer: "Platform B, since proving real value on the highest-friction process first is a more effective way to establish the platform before expanding scope",
        explanation: "this reflects the lesson's reasoning about focused proof-of-value before expansion. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A country has a large number of organizations spending significant aggregate time on a manual, paper-based compliance process. Based on this lesson, what would digitizing this specific process most directly improve?",
        options: [
          "The country's total population size",
          "The country's aggregate compliance cost, freeing up staff time across all affected organizations for their actual core work",
          "The number of competitors in unrelated industries",
          "The interest rate on business loans nationwide"
        ],
        correctAnswer: "The country's aggregate compliance cost, freeing up staff time across all affected organizations for their actual core work",
        explanation: "this is a direct application of the lesson's core economic argument. A, C, and D are unrelated or fabricated claims."
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
