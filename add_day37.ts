import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 37;
  const tag = "Week 6";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Before it became one of the most widely used workplace communication tools in the world, the company behind Slack spent years building a video game that almost nobody ever played.</p>

<p><strong>Pivoting</strong> means fundamentally changing a company's strategy or product direction while retaining some core asset — a team, a technical capability, an insight — learned from the original attempt, rather than starting over completely from scratch. This distinguishes a pivot from a simple failure. A failure discards everything and walks away. A pivot recognizes that something built along the way, often something built to solve the original product's own internal problems, is <em>more valuable than the original product itself turned out to be</em>.</p>

<p>The hardest part of a pivot isn't identifying that the original idea isn't working — that part is often painfully obvious well before anyone admits it. The hard part is <u>honestly separating what actually failed</u> from what quietly succeeded inside the wreckage. Most failed products contain at least one component, tool, or insight the team built along the way that solved a real problem, even if the overall vision around it didn't.</p>

<p>This is why refusing to pivot is often more dangerous than the original idea failing. Founders who keep defending a failing vision, treating every sign of trouble as a temporary setback, tend to <u>run out of resources protecting a sunk cost</u> rather than asking a more useful question: is there a smaller, different thing buried inside this failed attempt that's actually worth keeping? The founders who pivot successfully aren't the ones who gave up easily. They're the ones disciplined enough to let go of everything except the one piece that genuinely worked.</p>`;

  const conceptSummary = `Pivoting means changing a company's direction while keeping some real asset — a tool, a capability, an insight — from the original attempt, rather than discarding everything. The hard part isn't noticing the original idea is failing; it's honestly identifying which specific piece, often built to solve the original product's own problems, is actually worth keeping. Refusing to pivot means defending a sunk cost rather than recognizing real, unplanned value hidden inside a failure.`;

  const conceptTakeaways = [
    "Pivoting means retaining a core asset from a failed attempt while fundamentally changing strategic direction, rather than starting over completely.",
    "The hardest part of pivoting is honestly separating what actually failed from what quietly succeeded within it.",
    "Many failed products contain a component built to solve the original product's own internal problems, which can become genuinely valuable on its own.",
    "Refusing to pivot often means defending a sunk cost rather than recognizing real value hidden inside a failure.",
    "Successful pivots require the discipline to discard everything except the one piece that genuinely worked."
  ];

  const articleTitle = "The Failed Video Game That Accidentally Built One of the World's Most-Used Work Tools";
  
  const articleText = `<p><strong>How does a company spend years building a video game and end up creating one of the most widely used workplace communication tools instead?</strong></p>

<p>Stewart Butterfield and his team built Tiny Speck, developing an online game called Glitch, launched around 2011. Despite genuine effort and funding, the game failed to attract a sustainable player base and was shut down in 2012 — the kind of outcome that ends most startups entirely.</p>

<p><strong>If the game failed, what was actually left to build a new company around?</strong></p>

<p>During Glitch's development, the team had built an internal chat and communication tool simply to coordinate their own distributed team while building the game. That internal tool — never intended as a product to sell — turned out to be the <em>actual foundation for what was released publicly as Slack in 2013</em>.</p>

<p><strong>Why didn't the team just shut down entirely once the game failed, the way most failed startups do?</strong></p>

<p>Because they recognized that the internal communication tool solved a real, valuable problem — team coordination — completely independent of whether the game itself ever succeeded. That recognition required a specific kind of honesty: <u>separating what had clearly failed</u> (the game) from what had quietly worked the entire time (the tool nobody had built to sell).</p>

<p><strong>How is this different from simply refusing to give up on a failing idea?</strong></p>

<p>Stubbornly continuing to fund Glitch despite clear signs of failure would have been the sunk-cost trap — defending an original vision the team was emotionally invested in, regardless of the evidence. Pivoting meant something harder: honestly admitting the original vision had failed, while still recognizing that <em>something genuinely valuable had been built alongside it, almost by accident</em>.</p>

<p><strong>If you were on the Tiny Speck team in 2012, having spent years and real funding on a game about to shut down, would you have pushed to keep trying to save the game — or turned your attention to the internal tool nobody had built to sell?</strong></p>

<p>Pushing to save the game protects the vision the team originally set out to build and had already invested years into. Turning to the internal tool required admitting that vision had failed completely, while trusting that a byproduct nobody had planned to sell might actually be the more valuable thing the whole effort had produced.</p>

<p><strong>So was Slack really a new idea — or the one piece of a failed idea that turned out to be worth keeping?</strong></p>

<p>Slack wasn't invented as a standalone insight arrived at through market research. It was salvaged, deliberately and honestly, from inside a product that otherwise failed completely — a reminder that <u>the real skill in a pivot is recognizing which single asset survives a failure</u>, not inventing something entirely new from nothing.</p>`;

  const articleSummary = `Slack began inside Tiny Speck, a company that spent years building an online game called Glitch, which shut down in 2012 after failing to attract a sustainable audience. The internal chat tool the team had built to coordinate its own work, not the game itself, became the foundation for Slack, launched in 2013. The pivot required honestly separating what had failed from the one internal asset that had quietly worked the entire time.`;

  const articleTakeaways = [
    "Slack originated inside Tiny Speck, a company built around an online game called Glitch, launched around 2011.",
    "Glitch failed to attract a sustainable player base and was shut down in 2012.",
    "The team's internal communication tool, built to coordinate their own work, became the actual foundation for Slack, launched in 2013.",
    "The pivot required honestly recognizing which specific asset had succeeded, separate from the game's overall failure.",
    "Slack wasn't a new idea invented from scratch — it was salvaged deliberately from inside a failed product."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Pivoting",
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
        questionText: "What is \"pivoting,\" as defined in this lesson?",
        options: [
          "Abandoning a company entirely and starting a completely unrelated business",
          "Fundamentally changing a company's strategy or product direction while retaining some core asset learned from the original attempt",
          "A legal process for restructuring a company's debt",
          "A marketing technique used to rebrand a failing product without changing it"
        ],
        correctAnswer: "Fundamentally changing a company's strategy or product direction while retaining some core asset learned from the original attempt",
        explanation: "this is the exact definition given. A describes starting over completely, the contrasting concept. C and D are fabricated, unrelated claims."
      },
      {
        questionText: "According to this lesson, what is the hardest part of executing a successful pivot?",
        options: [
          "Announcing the change to investors and the public",
          "Honestly separating what actually failed from what quietly succeeded within the original attempt",
          "Raising additional funding immediately after a failure",
          "Rehiring the exact same team that built the original failed product"
        ],
        correctAnswer: "Honestly separating what actually failed from what quietly succeeded within the original attempt",
        explanation: "this is the lesson's direct explanation. A, C, and D are fabricated or unsupported claims."
      },
      {
        questionText: "Why does this lesson argue that refusing to pivot is often more dangerous than an original idea failing?",
        options: [
          "Because refusing to pivot is illegal in most jurisdictions",
          "Because founders who keep defending a failing vision often run out of resources protecting a sunk cost rather than recognizing real value hidden inside the failure",
          "Because pivoting always guarantees a company's eventual success",
          "Because failing ideas always contain no valuable components whatsoever"
        ],
        correctAnswer: "Because founders who keep defending a failing vision often run out of resources protecting a sunk cost rather than recognizing real value hidden inside the failure",
        explanation: "this is the lesson's central warning. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "What specifically became the foundation for Slack, according to this lesson?",
        options: [
          "A completely new product idea developed after Glitch's shutdown, unrelated to anything built during the game's development",
          "An internal chat and communication tool the Tiny Speck team had built to coordinate their own work while developing Glitch",
          "A licensing deal purchased from an unrelated technology company",
          "A government grant awarded specifically for workplace software development"
        ],
        correctAnswer: "An internal chat and communication tool the Tiny Speck team had built to coordinate their own work while developing Glitch",
        explanation: "this is the lesson's direct account. A, C, and D are fabricated claims not supported by the lesson."
      },
      {
        questionText: "You're on a team whose original product has clearly failed, but you built an internal tool along the way that solved a real problem for your own team. Based on this lesson, what does a successful pivot require you to do?",
        options: [
          "Continue defending the original failed product regardless of the evidence against it",
          "Honestly recognize that the internal tool may be more valuable than the original product, and redirect your effort toward it",
          "Shut down the company entirely without considering any assets built along the way",
          "Ignore the internal tool since it wasn't originally intended to be sold"
        ],
        correctAnswer: "Honestly recognize that the internal tool may be more valuable than the original product, and redirect your effort toward it",
        explanation: "this reflects the lesson's core argument, illustrated directly by Slack's origin. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "You've spent years and significant funding building a product that is now clearly failing to gain traction. Based on this lesson, what should guide your decision about whether to keep pushing forward or pivot?",
        options: [
          "Continue funding the original product indefinitely, regardless of the evidence, to avoid admitting failure",
          "Honestly assess whether any specific component or capability built along the way solves a real problem independent of the original product's failure",
          "Immediately shut down the company with no further evaluation",
          "Assume that failure always means nothing of value was created"
        ],
        correctAnswer: "Honestly assess whether any specific component or capability built along the way solves a real problem independent of the original product's failure",
        explanation: "this is a direct application of the lesson's central pivot framework. A, C, and D all contradict or oversimplify this reasoning."
      },
      {
        questionText: "A company builds an internal tool to solve its own operational problem while developing an unrelated primary product. The primary product later fails, but the internal tool proves genuinely useful. Based on this lesson, what should this company consider?",
        options: [
          "Discarding both the failed product and the internal tool entirely",
          "Considering a pivot toward the internal tool, since it may represent real, independent value separate from the original product's failure",
          "Continuing to invest exclusively in the original failed product",
          "Assuming the internal tool has no value since the original product failed"
        ],
        correctAnswer: "Considering a pivot toward the internal tool, since it may represent real, independent value separate from the original product's failure",
        explanation: "this is a direct application of the lesson's central pivot logic. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "Two companies experience product failures. Company A shuts down completely, discarding everything built along the way. Company B identifies a specific internal tool that solved a real problem and redirects its efforts toward it. Based on this lesson, which company is executing a pivot, and which is simply failing?",
        options: [
          "Company A is pivoting; Company B is failing",
          "Company B is pivoting; Company A is simply failing and starting over from nothing",
          "Both companies are executing identical pivots",
          "Neither company's actions relate to the concept of pivoting"
        ],
        correctAnswer: "Company B is pivoting; Company A is simply failing and starting over from nothing",
        explanation: "this matches the lesson's exact distinction between pivoting and simple failure. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A founder recognizes that their original product idea is failing but continues pouring resources into it because of the time and money already invested. Based on this lesson, what economic trap does this behavior best illustrate?",
        options: [
          "A successful pivot strategy",
          "The sunk-cost trap — defending a failing vision rather than recognizing real value elsewhere",
          "A disruptive innovation strategy",
          "A network effect"
        ],
        correctAnswer: "The sunk-cost trap — defending a failing vision rather than recognizing real value elsewhere",
        explanation: "this is a direct application of the lesson's warning about refusing to pivot. A, C, and D are unrelated or contradicted concepts."
      },
      {
        questionText: "A team's original product fails, but during its development they built a specific technical capability that solves a real, separate problem for other potential customers. Based on this lesson, what is the most economically sound next step for this team?",
        options: [
          "Abandon the technical capability along with the failed product, since both were part of the same effort",
          "Evaluate whether the technical capability could become the foundation for a new, pivoted direction, since it may hold value independent of the original product's failure",
          "Continue marketing the original failed product exclusively",
          "Assume the technical capability has no value since it wasn't the team's original goal"
        ],
        correctAnswer: "Evaluate whether the technical capability could become the foundation for a new, pivoted direction, since it may hold value independent of the original product's failure",
        explanation: "this directly mirrors the lesson's central example of Slack's origin. A, C, and D all contradict this reasoning."
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
