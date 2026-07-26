import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 32;
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
    title: 'Why People Give Without Expecting Rewards (The Dictator Game & Altruism)',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `Classical economic theory rests heavily on the assumption that human behavior is guided by pure rational self-interest. Under this view, an individual will only part with resources if they expect something in return—whether that is a physical good, a future favor, or a boost to their public reputation. When no external rewards or social pressures exist, standard economic models predict that people will default to keeping everything for themselves.

To strip away all social pressure, potential for retaliation, and strategic reciprocity, behavioral economists designed The Dictator Game. In this experiment, a "Dictator" is given a sum of money (e.g., $100) and told they can split it however they wish with an anonymous "Receiver." Unlike the Ultimatum Game, the Receiver has no power to reject the offer; they must accept whatever amount the Dictator decides to give, even if it is $0.

Standard economic theory predicts the Dictator will keep $100 and give $0, since there are no immediate consequences or strategic benefits to sharing.

Yet when researchers run the Dictator Game under double-blind conditions—where neither the Receiver nor the experimenter knows who gave what—a significant portion of Dictators still give away money. On average, people voluntarily share 20% to 30% of their endowment with complete strangers. This persistent behavior reveals the existence of pure altruism and "warm-glow" motivation: humans routinely make choices driven by empathy, social responsibility, and an intrinsic desire to help others, even when nobody is watching.`,
    conceptSummary: `Classical economics views human behavior through the lens of strict self-interest, but behavioral economics uses the Dictator Game to prove that genuine altruism exists. Because the Dictator holds absolute power and faces no retaliation or reputational reward, any voluntary transfer of money demonstrates that humans derive intrinsic value from generosity, fairness, and helping others.`,
    conceptTakeaways: [
      "The Dictator Game Setup: A Dictator decides how to split a sum of money with a passive Receiver who cannot reject the choice.",
      "Pure Altruism: Giving money in a double-blind Dictator Game proves that people help others even when there is zero chance of financial gain or social credit.",
      "Warm-Glow Motivation: The internal psychological satisfaction experienced when performing a generous act.",
      "Absence of Strategy: Unlike the Ultimatum Game, the Dictator Game contains no strategic bargaining—giving is driven purely by social preferences.",
      "Intrinsic Utility: Human decision-making incorporates the well-being of others as a genuine factor in personal satisfaction."
    ],
    articleTitle: 'The Purest Measure of Generosity',
    articleText: `**How does the Dictator Game isolate genuine generosity from strategic cooperation?**
In everyday life, acts of kindness often carry indirect benefits. Giving to charity can enhance a person's social standing, while helping a neighbor might build a safety net for future favors. To determine whether humans are capable of giving without any expectation of return, behavioral economists created the Dictator Game. By removing the Receiver's ability to reject the offer and ensuring absolute anonymity, the game eliminates strategic calculations. If people give money in a double-blind Dictator Game, it cannot be attributed to fear of rejection, legal obligation, or reputational gain—it serves as direct evidence of intrinsic altruistic motivation.

**Why do citizens in high-trust societies like Sweden donate money and blood anonymously?**
Sweden consistently ranks among the top nations for civic engagement, charitable giving, and voluntary organ and blood donation. Standard economic logic struggles to explain why an individual would take time out of their day to donate blood, incurring minor physical discomfort and zero financial compensation. Yet in Sweden, voluntary blood donation programs thrive without monetary incentives. Rather than relying on external rewards, Swedish civic institutions successfully leverage deep-rooted social responsibility and civic duty.

**Can paying someone to do a good deed actually make them less likely to do it?**
When policymakers try to apply classical economics to civic duty, the results can be counterproductive. Behavioral studies show that offering cash payments for blood donations in Sweden actually decreased female donations—a phenomenon known as "crowding out." In this scenario, monetary rewards replace intrinsic moral motivation with a commercial transaction, cheapening the act. The introduction of money tells the brain this is a paid job rather than a moral duty, which paradoxically makes people less willing to participate.

**How does the concept of "warm-glow" utility explain non-strategic giving?**
In 1990, economist James Andreoni proposed the concept of warm-glow altruism to bridge the gap between economic theory and human generosity. Andreoni argued that people do not give solely to improve the recipient's well-being; they also derive direct psychological utility—a sense of personal satisfaction and moral fulfillment—from the act of giving itself. This internal "warm glow" operates as a real economic benefit. In functional MRI brain scans, making a voluntary donation lights up the brain's reward centers (the caudate nucleus and nucleus accumbens) in the same way that receiving a monetary reward does, demonstrating that altruism carries its own intrinsic psychological payoff.

**How do social context and empathy alter the level of giving in experimental settings?**
While people demonstrate baseline altruism in dictator games, the exact amount given varies depending on contextual cues. When researchers reframe the Receiver not as an abstract participant, but as a recognized charity or a person in visible distress, giving increases dramatically—often exceeding 50% of the total pool. Conversely, if Dictators are allowed to take money from the Receiver's initial pool rather than just give, overall generosity drops. These variations show that while humans possess a natural capacity for altruism, our willingness to give is deeply tied to empathy, social framing, and perceived deservingness.

**What are the implications of intrinsic altruism for public policy and organizational design?**
Understanding that humans are not motivated solely by self-interest transforms how societies handle public goods and civic services. When governments or non-profit organizations design policies, relying exclusively on financial incentives can backfire by undermining civic duty and intrinsic goodwill. By building systems that honor social responsibility, express gratitude, and make the positive impact of giving transparent, institutions can unlock deep reservoirs of voluntary cooperation. Human society functions not just through financial transactions and legal contracts, but through the genuine desire to support the well-being of others.`,
    articleSummary: `By stripping away reputational incentives and strategic counter-moves, the Dictator Game reveals that people voluntarily share wealth with strangers out of intrinsic motivation. Real-world examples, such as anonymous charitable giving and Sweden's voluntary blood donation system, demonstrate that financial rewards can sometimes undermine moral drives. Through psychological concepts like "warm-glow" utility and neural reward activation, behavioral economics proves that human choices are guided by empathy as well as self-interest.`,
    articleTakeaways: [
      "Crowding-Out Effect: Introducing financial compensation for civic acts (like blood donation) can diminish intrinsic moral motivation.",
      "Neural Rewards: Voluntary giving activates the brain's reward pathways in a manner similar to receiving a personal reward.",
      "Framing and Empathy: Generosity in experiments increases significantly when the recipient is framed as deserving or in need.",
      "Policy Design: Institutions function more effectively when they support civic duty rather than relying solely on financial carrots and sticks.",
      "Beyond Self-Interest: Human societies thrive because citizens regularly act out of moral responsibility rather than pure financial calculation."
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
        questionText: "What is the fundamental difference between the Ultimatum Game and the Dictator Game?",
        options: [
          "The Dictator Game is played only with digital currencies, while the Ultimatum Game uses physical cash.",
          "In the Dictator Game, the Receiver can reject the offer, whereas in the Ultimatum Game they cannot.",
          "In the Dictator Game, the Receiver has no power to reject the offer, removing all strategic bargaining.",
          "The Dictator Game allows players to trade assets over multiple years, while the Ultimatum Game lasts one round."
        ],
        correctAnswer: "In the Dictator Game, the Receiver has no power to reject the offer, removing all strategic bargaining.",
        explanation: "- A) Wrong — both games can be played with any medium of exchange.\\n- B) Wrong — this perfectly reverses the rules of the two games.\\n- C) Correct — by removing the Receiver's ability to reject, the Dictator Game isolates pure generosity from the fear of rejection.\\n- D) Wrong — both are typically single-round experiments."
      },
      {
        questionText: "What does classical economic theory (Homo economicus) predict a Dictator will give to an anonymous Receiver in a double-blind experiment?",
        options: [
          "$0, because keeping all the money maximizes personal payout without any financial penalty",
          "Exactly 50% of the total money pool",
          "100% of the pool to ensure maximum social utility",
          "A random amount determined by rolling a die"
        ],
        correctAnswer: "$0, because keeping all the money maximizes personal payout without any financial penalty",
        explanation: "- A) Correct — a pure profit maximizer will keep everything since there are no consequences for doing so.\\n- B) Wrong — standard theory predicts self-interest, not a fair split.\\n- C) Wrong — giving 100% directly contradicts self-interest maximization.\\n- D) Wrong — random chance is not predicted by strict utility maximization."
      },
      {
        questionText: "What phenomenon occurs when offering monetary payments for a voluntary civic act (such as blood donation) causes overall participation to drop?",
        options: [
          "The Substitution Arbitrage",
          "Hyperbolic Discounting",
          "The Framing Fallacy",
          "The Crowding-Out Effect"
        ],
        correctAnswer: "The Crowding-Out Effect",
        explanation: "- A) Wrong — substitution arbitrage involves risk-free trading.\\n- B) Wrong — hyperbolic discounting relates to timing of rewards.\\n- C) Wrong — this isn't a recognized behavioral term for this phenomenon.\\n- D) Correct — monetary rewards \"crowd out\" intrinsic moral motivation by turning a civic duty into a cheap commercial transaction."
      },
      {
        questionText: "According to economist James Andreoni, what is \"warm-glow\" altruism?",
        options: [
          "The personal psychological satisfaction and moral fulfillment experienced directly from the act of giving",
          "The desire to receive tax write-offs for public charitable donations",
          "The expectation that a recipient will return a favor in the future",
          "The financial interest earned on long-term institutional endowments"
        ],
        correctAnswer: "The personal psychological satisfaction and moral fulfillment experienced directly from the act of giving",
        explanation: "- A) Correct — people derive direct utility (a \"warm glow\") simply from knowing they did something good.\\n- B) Wrong — this describes an extrinsic financial incentive, not a warm glow.\\n- C) Wrong — this is strategic reciprocity, which Andreoni sought to distinguish from warm-glow altruism.\\n- D) Wrong — this describes compounding financial interest."
      },
      {
        questionText: "(Scenario) An anonymous donor drops a $100 bill into a disaster relief box in a dark building where no cameras or witnesses are present. Which behavioral concept best explains this action?",
        options: [
          "External reputation management",
          "Strategic reciprocity expecting future financial compensation",
          "Intrinsic altruism driven by internal moral values and warm-glow utility",
          "Inequity aversion driven by fear of immediate public punishment"
        ],
        correctAnswer: "Intrinsic altruism driven by internal moral values and warm-glow utility",
        explanation: "- A) Wrong — reputation management requires witnesses, which are absent here.\\n- B) Wrong — an anonymous donation yields no future strategic payout.\\n- C) Correct — the action is entirely anonymous and one-sided, perfectly matching intrinsic altruism.\\n- D) Wrong — there is no public present to punish the donor."
      },
      {
        questionText: "What do functional MRI brain scans show when an individual makes a voluntary donation to a charitable cause?",
        options: [
          "The brain's visual cortex shuts down completely to conserve mental energy",
          "Reward centers in the brain light up similarly to when receiving a personal financial reward",
          "The brain's pain processing regions activate at maximum intensity",
          "No measurable neural activity occurs during economic decisions"
        ],
        correctAnswer: "Reward centers in the brain light up similarly to when receiving a personal financial reward",
        explanation: "- A) Wrong — the visual cortex remains active and doesn't shut down for this reason.\\n- B) Correct — making a generous donation activates the caudate nucleus and nucleus accumbens, showing giving is intrinsically rewarding.\\n- C) Wrong — while giving up money might theoretically seem \"painful,\" voluntary altruism triggers reward, not pain regions.\\n- D) Wrong — modern neuroeconomics relies on measuring exactly this type of neural activity."
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
