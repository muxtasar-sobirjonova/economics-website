import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 31;
  const track = Track.BEHAVIORAL_ECONOMICS;
  console.log(`Starting update for Day \${dayOrder} (\${track})...`);

  // 1. UPDATE OR CREATE LESSON
  let lesson = await prisma.lesson.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  const lessonData = {
    title: 'Why People Care About Fairness Even in Experiments (The Ultimatum Game)',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `Classical economics long built its foundational theories on a convenient fiction: Homo economicus, an entirely self-interested agent who treats every decision as a purely financial calculation. Under this classical lens, money is money—getting a single dollar is objectively better than getting zero dollars. Therefore, a rational person should accept any positive sum offered to them, regardless of the circumstances or how much the other party receives.

To test whether real human beings actually behave this way, behavioral economists created The Ultimatum Game. The setup is deceptively simple: two anonymous participants are given a sum of money (for instance, $100). The "Proposer" offers a split of the cash to the "Responder." If the Responder accepts the split, both walk away with their agreed shares. But if the Responder rejects the offer, neither person gets a single cent, and the $100 disappears back into the researcher's budget.

Standard economic logic dictates that the Proposer should offer $1 and keep $99, and the Responder should instantly accept because $1 is strictly greater than $0.

Yet when researchers run this experiment in laboratory conditions, that theoretical prediction collapses completely. Responders routinely reject offers under 30% of the total pool. By choosing $0 over $20 or $30, people actively sacrifice real cash to punish what they perceive as greed. This shows that human beings do not treat economic decisions as isolated balance sheets; we evaluate transactions through a lens of equity, respect, and social norms.`,
    conceptSummary: `The Ultimatum Game is a classic experiment in behavioral economics designed to test human rationality and fairness. Standard economics predicts people will accept any positive financial offer, but in practice, individuals frequently reject unfair offers—proving that humans prioritize social equity, emotional self-respect, and norm enforcement over pure monetary gain.`,
    conceptTakeaways: [
      "The Ultimatum Game Setup: A Proposer suggests how to split a sum of money, and a Responder accepts (split happens) or rejects (both get zero).",
      "Failure of Homo Economicus: Traditional theory predicts Responders accept $1 splits, but real participants routinely reject offers below 30%.",
      "Costly Punishment: Rejection is a form of altruistic punishment—sacrificing one's own immediate payout to punish unfair behavior.",
      "Perceived Respect: People evaluate economic offers not just by their absolute value, but by what the division implies about their relative worth and standing.",
      "Emotional Primacy: Financial choices are continuously filtered through psychological judgments of equity and fairness."
    ],
    articleTitle: 'The Global Test of Fairness',
    articleText: `**Why did behavioral economists design a game where rejecting money is the central surprise?**
In the late twentieth century, mainstream economic models assumed that markets functioned efficiently because individuals strictly maximized personal wealth. In 1982, German economists Werner Güth, Rolf Schmittberger, and Bernd Schwarze wanted to put this assumption to an empirical test. They designed the Ultimatum Game to isolate financial self-interest from complex market variables like reputation, long-term negotiation, or legal enforcement. If humans were purely rational wealth-maximizers, the game's outcome would be immediate and predictable: Proposers would make minimal offers, and Responders would accept them every single time. Instead, the experiment yielded a result that stunned classical theorists: people consistently chose financial loss over humiliation.

**What happens when the Ultimatum Game is taken out of Western universities and tested globally?**
For years, critics argued that the rejection of small offers was a peculiarity of affluent Western college students who could afford to turn down $20. To see if fairness was a universal human trait or a cultural artifact, anthropologist Joseph Henrich and a team of researchers conducted a massive cross-cultural study across 15 small-scale societies worldwide—including Amazonian hunter-gatherers, African pastoralists, and Indonesian fishermen. The results published in the early 2000s were striking: while people in every society cared about fairness, their definitions of an "acceptable offer" varied drastically depending on how their communities organized daily life and trade.

**How does daily trade with strangers change our definition of a fair deal?**
Henrich’s cross-cultural research revealed that societies with higher levels of market integration—where people rely on daily trade with strangers—offered much higher splits, often close to 50/50. In communities where survival depends on collective cooperation (such as the Lamalera whale hunters of Indonesia), Proposers made exceptionally generous offers, recognizing that group survival relies on equal sharing.

**Is fairness a genetic baseline or a cultural technology?**
Conversely, in hyper-isolated groups with little trade, average offers were lower, and tolerance for unequal offers was higher. Fairness, it turned out, is not a fixed genetic baseline; it is a cultural technology developed to make large-scale social and economic cooperation possible among non-relatives. This explains why different communities, based on their unique economic structures, display completely different baselines for what constitutes an acceptable offer.

**Why does the human brain react to an unfair offer as if it were a physical insult?**
Neuroeconomists studying the brain during the Ultimatum Game have discovered that economic choices are deeply tied to emotional circuitry. When a Responder receives an offer like $10 out of $100, functional MRI scans reveal a surge of activity in the anterior insula—the brain region responsible for processing anger, physical pain, and visceral disgust (such as smelling rotten food). Simultaneously, the prefrontal cortex attempts to calculate the financial gain. When the offer is insultingly low, the emotional disgust from the insula overrides the cold calculations of the prefrontal cortex, driving the individual to slam the door on the deal, even at a personal financial cost.

**What does global research on fairness teach us about modern workplace and policy design?**
The enduring lesson of the Ultimatum Game is that ignoring human feelings about fairness leads to costly economic friction. Whether designing employee compensation schemes, tax policies, or international trade agreements, leaders cannot simply offer a net-positive gain and expect people to accept it quietly if the division feels exploitative. When people feel that a deal violates basic social reciprocity, they will strike, boycott, or disrupt systems—forfeiting personal income just to punish the unfair actor. Sustainable economic design requires satisfying the human demand for equitable treatment as much as the demand for financial efficiency.`,
    articleSummary: `First designed in 1982, the Ultimatum Game challenged classical economic assumptions by demonstrating that people sacrifice money to punish greed. Cross-cultural research across 15 small-scale societies showed that while concern for fairness is universal, what constitutes a "fair offer" depends on a society's degree of market integration and cooperative needs. Brain scans reveal that unfair offers trigger visceral disgust in the anterior insula, highlighting that policy and workplace systems must respect fairness to remain stable.`,
    articleTakeaways: [
      "Universal Feature, Culturally Tuned: Concern for fairness exists globally, but baseline expectations vary depending on local economic structures.",
      "Market Integration Effect: Societies accustomed to trading with strangers and working in large cooperative groups tend to offer higher, more equal splits.",
      "Neural Disgust: Receiving an unfair offer activates the anterior insula—the same region triggered by physical disgust or pain.",
      "Rejection as Norm Enforcement: Rejecting low offers acts as a social mechanism that deters greed and preserves cooperation over time.",
      "Policy Implications: System design fails when it assumes people will accept exploitative terms simply because they offer minor financial gains."
    ]
  };

  if (lesson) {
    lesson = await prisma.lesson.update({
      where: { id: lesson.id },
      data: lessonData
    });
    console.log(`Successfully updated Lesson for Day \${dayOrder}: \${lesson.title}`);
  } else {
    lesson = await prisma.lesson.create({
      data: lessonData
    });
    console.log(`Successfully created Lesson for Day \${dayOrder}: \${lesson.title}`);
  }

  // 2. UPDATE OR CREATE QUIZ
  let quiz = await prisma.quiz.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  if (!quiz) {
    console.log(`Quiz for Day \${dayOrder} not found! Creating...`);
    quiz = await prisma.quiz.create({
      data: {
        track: track,
        dayOrder: dayOrder,
        title: "Quiz",
        tag: track,
        timeEstimate: 5
      }
    });
  }

  if (quiz) {
    // Delete existing questions
    await prisma.quizQuestion.deleteMany({
      where: { quizId: quiz.id }
    });

    const questions = [
      {
        questionText: "What does traditional classical economic theory (Homo economicus) predict a Responder will do when offered $1 out of a $100 total pool in the Ultimatum Game?",
        options: [
          "Reject the $1 because it violates social equality",
          "Demand that the Proposer give up the entire $100",
          "Accept the $1 because receiving $1 provides more utility than receiving $0",
          "Walk away without making a choice"
        ],
        correctAnswer: "Accept the $1 because receiving $1 provides more utility than receiving $0",
        explanation: "- A) Wrong — rejection based on equality is a behavioral finding, not the classical prediction.\\n- B) Wrong — demanding the full amount is not an option within the game rules, nor the classical prediction.\\n- C) Correct — standard theory assumes people maximize personal wealth and will accept any positive sum.\\n- D) Wrong — walking away (rejecting) results in $0, which classical theory says is irrational compared to $1."
      },
      {
        questionText: "What happens in the Ultimatum Game if the Responder chooses to REJECT the Proposer's offer?",
        options: [
          "The Proposer keeps the full amount of money, and the Responder gets nothing.",
          "The money is split equally (50/50) by default.",
          "The game is automatically repeated until an agreement is reached.",
          "Both the Proposer and the Responder receive $0."
        ],
        correctAnswer: "Both the Proposer and the Responder receive $0.",
        explanation: "- A) Wrong — rejection destroys the entire pool of money; the Proposer does not keep it.\\n- B) Wrong — rejection does not trigger a default 50/50 split.\\n- C) Wrong — the standard Ultimatum Game is a one-shot interaction, not repeated.\\n- D) Correct — if the Responder rejects, neither party gets any money."
      },
      {
        questionText: "What did Joseph Henrich’s cross-cultural research across 15 small-scale societies reveal about the Ultimatum Game?",
        options: [
          "Concerns about fairness are universal, but what counts as a \"fair offer\" varies based on market integration and community cooperation.",
          "Only Western university students care about fairness in economic games.",
          "All human societies make identical 50/50 offers regardless of culture.",
          "Isolated hunter-gatherer groups always offer 100% of the money to the Responder."
        ],
        correctAnswer: "Concerns about fairness are universal, but what counts as a \"fair offer\" varies based on market integration and community cooperation.",
        explanation: "- A) Correct — the research found fairness is universal, but its definition shifts depending on cultural and economic structures.\\n- B) Wrong — the research explicitly disproved that fairness was only a Western phenomenon.\\n- C) Wrong — offers varied significantly between societies based on market integration.\\n- D) Wrong — isolated groups actually offered less, not 100%."
      },
      {
        questionText: "Brain imaging studies show that receiving an insultingly low offer in the Ultimatum Game activates the anterior insula. What emotion or sensation is this area primarily linked to?",
        options: [
          "Deep sleep and physical relaxation",
          "Visceral disgust, anger, and physical pain",
          "Mathematical calculation and memory retention",
          "Joy and visual processing"
        ],
        correctAnswer: "Visceral disgust, anger, and physical pain",
        explanation: "- A) Wrong — the anterior insula is associated with arousal and emotional distress, not sleep.\\n- B) Correct — it activates during experiences of physical disgust (like bad smells) and social/economic unfairness.\\n- C) Wrong — calculation is primarily handled by the prefrontal cortex.\\n- D) Wrong — the insula processes negative visceral emotions, not joy."
      },
      {
        questionText: "(Scenario) A tech startup offers a new hire a compensation package that is slightly higher than their previous job's salary, but the new hire discovers that peers in the exact same role with identical experience are making twice as much. The candidate turns down the job offer. What concept best explains this decision?",
        options: [
          "Pure income maximization",
          "Exponential time discounting",
          "Arbitrage execution",
          "Rejection of an offer perceived as unfair, prioritizing relative equity over absolute gain"
        ],
        correctAnswer: "Rejection of an offer perceived as unfair, prioritizing relative equity over absolute gain",
        explanation: "- A) Wrong — if they were maximizing absolute income, they would accept the higher salary.\\n- B) Wrong — this involves fairness, not the time value of money.\\n- C) Wrong — arbitrage refers to risk-free profit from price differences.\\n- D) Correct — the candidate rejects a net gain because the relative inequality feels exploitative and unfair."
      },
      {
        questionText: "Why is the decision to reject a small offer in the Ultimatum Game described as \"costly punishment\"?",
        options: [
          "Because the experimenter fines the Responder for making a decision",
          "Because the Proposer takes money directly out of the Responder's personal bank account",
          "Because the Responder voluntarily gives up cash they could have kept, solely to punish the Proposer's greed",
          "Because law enforcement penalizes players who reject offers"
        ],
        correctAnswer: "Because the Responder voluntarily gives up cash they could have kept, solely to punish the Proposer's greed",
        explanation: "- A) Wrong — there are no experimenter fines; the loss is just the foregone offer.\\n- B) Wrong — the Proposer doesn't take the Responder's own money.\\n- C) Correct — the Responder sacrifices real financial gain in order to enforce fairness and punish the Proposer.\\n- D) Wrong — this is an economic experiment, not a legal issue."
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
    console.log(`Successfully updated \${questions.length} Quiz Questions for Day \${dayOrder}`);
  } else {
    console.log(`Quiz for Day \${dayOrder} failed to create or load!`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
