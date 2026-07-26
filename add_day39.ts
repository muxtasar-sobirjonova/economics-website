import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 39;
  const tag = "Week 6";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Amazon didn't set out to build one of the most important pieces of internet infrastructure in the world. It set out to solve its own internal server problem — and only later noticed what it had actually built.</p>

<p><strong>Staged investment</strong> means committing capital and resources in small, testable increments rather than all at once, specifically to preserve the ability to change course cheaply if early evidence turns out to be unfavorable. This connects directly to <strong>reversibility</strong> — how expensive it would be to undo a decision if it turns out to be wrong.</p>

<p>Amazon's own internal framework, often described as <strong>"one-way door" versus "two-way door"</strong> decisions, captures this precisely. A <em>two-way door decision is cheap to reverse</em> if it doesn't work out, so it's worth moving on quickly, testing it directly, and learning from real results rather than lengthy deliberation. A <u>one-way door decision is difficult or costly to reverse</u>, and deserves far more careful consideration before committing, because getting it wrong is expensive in a way a two-way door mistake simply isn't.</p>

<p>This reframes what "big" opportunities actually deserve. The size of an opportunity doesn't tell you how much staging or caution it needs — its reversibility does. A modest internal experiment that costs little to reverse can be entered quickly, even with limited information, because being wrong is cheap. A massive, publicly announced commitment that would be expensive and embarrassing to unwind deserves real deliberation first, regardless of how exciting the opportunity looks.</p>

<p>Understanding this means a founder isn't asking "should we move fast or move carefully" as a general personality trait. They're asking, decision by decision: <u>how reversible is this specific choice</u>, and does that reversibility justify moving quickly, or does its irreversibility demand slowing down first?</p>`;

  const conceptSummary = `Staged investment means committing resources in small, testable increments to preserve the ability to cheaply reverse course if early evidence is unfavorable. Amazon's "one-way door" versus "two-way door" framework captures this: reversible decisions merit fast experimentation, while hard-to-reverse decisions deserve careful deliberation first. The right amount of caution isn't determined by how big an opportunity looks — it's determined by how expensive it would be to undo if it turns out to be wrong.`;

  const conceptTakeaways = [
    "Expected value means multiplying probability by payoff across every possible outcome, not just comparing certainty to risk.",
    "A company's most profitable current business isn't always its highest expected-value future path.",
    "\"Two-way door\" decisions are cheap to reverse and merit fast experimentation rather than lengthy deliberation.",
    "\"One-way door\" decisions are costly to reverse and deserve careful consideration before committing.",
    "The right pace for a decision depends on its specific reversibility, not a general preference for speed or caution."
  ];

  const articleTitle = "How Amazon Accidentally Built One of the Internet's Most Important Businesses While Solving Its Own Problem";
  
  const articleText = `<p><strong>How does a company become one of the most important infrastructure providers on the internet without ever setting out to do so?</strong></p>

<p>Amazon Web Services originated from Amazon's own need to manage its internal computing infrastructure efficiently, particularly to handle unpredictable traffic spikes such as holiday shopping surges, without permanently overbuilding capacity for demand that only occurred a few weeks a year. The tools built to solve this internal problem eventually became the foundation of one of the most significant cloud computing businesses in the world.</p>

<p><strong>Why build this internally first instead of launching a cloud computing product for other companies right away?</strong></p>

<p>Testing and refining the infrastructure on Amazon's own workloads was a <em>low-cost, reversible way to validate the technology</em> and operating model before committing to build and market it as a stand-alone external product. If the approach hadn't worked internally, Amazon could have quietly adjusted or abandoned the effort without any public failure or wasted external-facing investment — exactly the advantage a <u>two-way door decision</u> provides.</p>

<p><strong>What is a "two-way door" decision, and why does it matter here?</strong></p>

<p>A two-way door decision can be entered quickly and exited cheaply if it turns out to be wrong, which means it merits fast experimentation rather than lengthy deliberation. Building internal infrastructure tools was relatively reversible — limited cost, contained entirely within internal use — unlike, for example, committing immediately to a massive, publicly announced new external product line before the underlying technology had been proven anywhere at all.</p>

<p><strong>Once the internal tool clearly worked, why didn't Amazon just quietly keep it in-house instead of offering it externally?</strong></p>

<p>Only after internal validation did Amazon take the larger, harder-to-reverse step of launching cloud services publicly, beginning around 2006. By that point, much of the technical and operational risk had already been retired through the internal stage — <em>the external launch was a much lower-risk decision</em> than it would have been without that earlier, quieter groundwork.</p>

<p><strong>If you ran Amazon's infrastructure team and realized your internal server-management tool might be valuable to other companies, would you have pushed to launch it externally immediately — or continued refining it internally first?</strong></p>

<p>Launching immediately risks committing significant public-facing resources and reputation to something not yet proven outside your own specific use case. Continuing to refine internally costs time, but keeps the decision in reversible territory a while longer, <u>reducing the real cost of being wrong</u> before making a much harder-to-undo public commitment.</p>

<p><strong>So was AWS really a new business Amazon deliberately decided to build — or a byproduct of solving its own problem carefully enough that scaling it externally became a low-risk next step?</strong></p>

<p>The eventual business became enormously significant, but it was reached through a <u>sequence of small, reversible steps</u> rather than one large, irreversible bet made all at once — the actual discipline this lesson is built around, more than any single decision to "enter cloud computing."</p>`;

  const articleSummary = `AWS began as Amazon's internal solution to its own unpredictable infrastructure demands, tested and refined on Amazon's own workloads before any external launch. This staged approach kept the decision reversible and low-risk in its early stages, consistent with Amazon's "two-way door" framework for decisions that are cheap to undo. Only once the internal tool had proven itself did Amazon take the larger, harder-to-reverse step of launching it publicly, beginning around 2006.`;

  const articleTakeaways = [
    "AWS originated as Amazon's internal solution for managing unpredictable infrastructure demand, such as holiday traffic spikes.",
    "Testing the infrastructure internally first kept the decision reversible and low-cost if it hadn't worked.",
    "Amazon's \"two-way door\" framework treats easily reversible decisions as worth fast experimentation, unlike costly, hard-to-reverse ones.",
    "Public cloud services launched around 2006, only after internal validation had already reduced much of the technical and operational risk.",
    "The eventual business emerged through staged, reversible steps rather than one large, irreversible commitment made all at once."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Staged Investment & Reversibility",
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
        questionText: "What is \"staged investment,\" as defined in this lesson?",
        options: [
          "Committing all available capital to a decision immediately, with no testing phase",
          "Committing capital and resources in small, testable increments to preserve the ability to reverse course cheaply if needed",
          "A government-regulated funding schedule for new companies",
          "A method for permanently eliminating all risk from a business decision"
        ],
        correctAnswer: "Committing capital and resources in small, testable increments to preserve the ability to reverse course cheaply if needed",
        explanation: "this is the exact definition given. A contradicts the concept entirely. C and D are fabricated, unrelated claims."
      },
      {
        questionText: "What is a \"two-way door\" decision, per this lesson?",
        options: [
          "A decision that is expensive and difficult to reverse once made",
          "A decision that can be entered quickly and exited cheaply if it turns out to be wrong",
          "A legal term describing a company's exit from bankruptcy",
          "A decision that requires government approval before proceeding"
        ],
        correctAnswer: "A decision that can be entered quickly and exited cheaply if it turns out to be wrong",
        explanation: "this is the exact definition given. A describes a \"one-way door\" decision, the contrasting concept. C and D are fabricated claims."
      },
      {
        questionText: "According to this lesson, what actually determines how much caution or staging a decision deserves?",
        options: [
          "The total size of the potential opportunity alone",
          "How expensive or difficult the decision would be to reverse if it turns out to be wrong",
          "How much media attention the decision is likely to attract",
          "The number of competitors currently operating in the same market"
        ],
        correctAnswer: "How expensive or difficult the decision would be to reverse if it turns out to be wrong",
        explanation: "this is the lesson's central argument. A, C, and D are fabricated or unsupported claims."
      },
      {
        questionText: "Why did building AWS's infrastructure internally first, rather than launching it externally immediately, reflect sound staged-investment logic, according to this lesson?",
        options: [
          "Because internal testing kept the decision reversible and low-cost if the approach hadn't worked",
          "Because internal use is always more profitable than external sales",
          "Because government regulation required internal testing before any external launch",
          "Because external customers are legally prohibited from using new cloud technology"
        ],
        correctAnswer: "Because internal testing kept the decision reversible and low-cost if the approach hadn't worked",
        explanation: "this is the lesson's direct explanation. B, C, and D are fabricated or unsupported claims."
      },
      {
        questionText: "You run Amazon's infrastructure team and realize your internal server-management tool might be valuable to other companies. Based on this lesson, what is the strongest argument for continuing to refine it internally before launching it externally?",
        options: [
          "Internal refinement guarantees the external product will never fail",
          "Continuing to refine internally keeps the decision in reversible, lower-risk territory a while longer, before making a much harder-to-undo public commitment",
          "External customers are legally required to wait for extended internal testing",
          "There is no real difference between launching immediately and refining internally first"
        ],
        correctAnswer: "Continuing to refine internally keeps the decision in reversible, lower-risk territory a while longer, before making a much harder-to-undo public commitment",
        explanation: "this reflects the lesson's core reasoning about managing reversibility. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "You're evaluating two decisions: one that is cheap and easy to reverse if wrong, and one that would be extremely costly and public to undo. Based on this lesson, how should your approach to each decision differ?",
        options: [
          "Treat both decisions identically regardless of their reversibility",
          "Move quickly and experiment with the easily reversible decision, while deliberating more carefully before committing to the costly, hard-to-reverse one",
          "Always move slowly on every decision regardless of its reversibility",
          "Always move quickly on every decision regardless of its reversibility"
        ],
        correctAnswer: "Move quickly and experiment with the easily reversible decision, while deliberating more carefully before committing to the costly, hard-to-reverse one",
        explanation: "this is a direct application of the lesson's central \"one-way door vs. two-way door\" framework. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A company tests a new internal process on a small team before rolling it out company-wide, allowing it to easily reverse the change if it doesn't work. Based on this lesson, what does this approach best illustrate?",
        options: [
          "A one-way door decision requiring extensive deliberation",
          "A staged, reversible approach consistent with a two-way door decision",
          "A decision with no relationship to reversibility at all",
          "A permanent, irreversible commitment made without testing"
        ],
        correctAnswer: "A staged, reversible approach consistent with a two-way door decision",
        explanation: "this is a direct application of the lesson's staged-investment framework. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A company is deciding whether to sign a ten-year, non-cancellable contract committing significant capital to a new, unproven market. Based on this lesson, how should this decision be approached compared to a small, easily reversible internal pilot program?",
        options: [
          "With identical speed and minimal deliberation, since all decisions should be treated the same way",
          "With much more careful deliberation, since this is a costly, hard-to-reverse \"one-way door\" decision, unlike an easily reversible pilot program",
          "With less caution than the pilot program, since larger opportunities always deserve faster action",
          "With no consideration of reversibility, since contract length has no bearing on decision-making"
        ],
        correctAnswer: "With much more careful deliberation, since this is a costly, hard-to-reverse \"one-way door\" decision, unlike an easily reversible pilot program",
        explanation: "this is a direct application of the lesson's core reversibility framework. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A company builds and tests a new capability entirely for its own internal use before ever considering selling it externally. Based on this lesson, what advantage does this sequence provide?",
        options: [
          "It guarantees the capability will become a wildly successful external product",
          "It allows technical and operational risk to be substantially reduced before a larger, harder-to-reverse external commitment is made",
          "It has no bearing on the eventual external launch's risk level",
          "It is a legally required step before launching any new technology product"
        ],
        correctAnswer: "It allows technical and operational risk to be substantially reduced before a larger, harder-to-reverse external commitment is made",
        explanation: "this directly mirrors AWS's actual development sequence as described in the lesson. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "Two companies pursue the same new opportunity. Company A commits immediately to a large, public, difficult-to-reverse investment. Company B tests the same idea internally first, in a low-cost, reversible way, before committing further. Based on this lesson, which company is following the more sound staged-investment approach?",
        options: [
          "Company A, since committing fully and immediately is always the superior strategy",
          "Company B, since testing internally first preserves reversibility and reduces the cost of being wrong before a larger commitment is made",
          "Neither company's approach relates to the concepts in this lesson",
          "Both companies are following economically identical strategies"
        ],
        correctAnswer: "Company B, since testing internally first preserves reversibility and reduces the cost of being wrong before a larger commitment is made",
        explanation: "this is a direct application of the lesson's central staged-investment and reversibility argument. A, C, and D all contradict this reasoning."
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
