import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 30;
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
    title: 'Why Trust Can Create Economic Value (Reciprocity)',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `Traditional economic models operate on the assumption that strangers are purely opportunistic, driven only by legally binding contracts or physical collateral. Under this view, lending money without a legal safety net or valuable asset is irrational, as rational self-interest would dictate defaulting on the debt. However, behavioral economics reveals that human interaction is heavily governed by reciprocity—the psychological drive to respond to positive actions with cooperation, and to breaches of trust with social sanctions.

This principle is frequently illustrated in experimental economics through the Trust Game. In this game, an Investor is given a sum of money and can choose to transfer a portion to a Trustee. Any transferred amount is multiplied (e.g., tripled) by the experimenter. The Trustee then decides how much of that enlarged sum to send back to the Investor.

Standard economic theory predicts the Trustee will keep all the money, so the Investor should transfer nothing. In reality, Investors regularly send money, and Trustees consistently return a fair share. People view trust not as a foolish vulnerability, but as an invitation to cooperate.

Imagine you are a rural villager in Bangladesh with no steady paycheck, no land titles, and no formal credit history. A traditional commercial bank will refuse your loan application because you lack collateral.

Now imagine a financial model that replaces land deeds with social trust. A lender gives small capital directly to you and a group of your peers, trusting that the collective sense of responsibility and mutual support will ensure repayment. Instead of relying on legal threats or repossession, the model relies on the power of peer accountability and social reciprocity—turning trust itself into a powerful economic asset.`,
    conceptSummary: `Standard economics assumes financial transactions require formal contracts or physical collateral to manage risk. Behavioral economics proves that human beings are deeply driven by reciprocity—the tendency to match trust with cooperation. As shown in experimental games like the Trust Game, trusting others creates an economic surplus by unlocking mutual goodwill and self-enforcing cooperative behavior.`,
    conceptTakeaways: [
      "Reciprocity vs. Self-Interest: People naturally respond to cooperative gestures with trust and cooperation, rather than purely exploiting the interaction.",
      "The Trust Game: An economic experiment showing that individuals willingly risk capital on strangers, and recipients regularly honor that trust by returning a fair portion.",
      "Social Capital as Wealth: Trust, mutual reputation, and social ties are tangible economic assets that reduce transaction costs.",
      "Informal Enforcement: Social norms and community relationships can enforce economic commitments as effectively as legal courts.",
      "Value Creation: Trust enables economic activity, such as lending and investment, in environments where formal systems do not exist."
    ],
    articleTitle: 'Grameen Bank and the Economics of Trust',
    articleText: `**Why were billions of low-income people historically excluded from formal banking systems?**
For centuries, commercial banking built its entire framework around a simple rule: no collateral, no loan. Financial institutions viewed poor borrowers as high-risk investments because they lacked formal assets—like real estate, cars, or verified bank deposits—that could be seized in the event of a default. Assessing individual creditworthiness in rural or informal economies was also prohibitively expensive for large banks. As a result, hundreds of millions of low-income individuals, particularly women in developing nations, were completely cut off from formal credit, leaving them reliant on predatory local moneylenders charging extortionate interest rates.

**How did Muhammad Yunus use behavioral reciprocity to build the Grameen Bank?**
In the late 1970s, Bangladeshi economist Muhammad Yunus challenged the fundamental assumptions of classical banking. He hypothesized that low-income borrowers did not lack financial discipline; they simply lacked access to fair capital. Rather than demanding physical collateral, Yunus designed a credit system built entirely on social capital and positive reciprocity. Founded formally in 1983, Grameen Bank introduced a microfinance model centered around "solidarity groups"—small clusters of five borrowers, predominantly women from the same village, who applied for individual loans together.

**What mechanism ensured high repayment rates without court enforcement or security deposits?**
The brilliant behavioral insight behind Grameen Bank's model was its reliance on peer support and social accountability. While each group member received an individual loan for their small business, the entire group’s access to future, larger loans depended on every member maintaining a reliable repayment schedule. This structure transformed the loan process from an isolated financial contract into a community commitment.

**How did the psychological impulse of strong reciprocity impact repayment rates?**
Group members met weekly to offer advice, troubleshoot business challenges, and support struggling peers. Because their success was tied together, the psychological impulse of strong reciprocity—wanting to honor the trust placed in them by their peers and avoid letting the group down—took over. This dynamic achieved repayment rates exceeding 95%, far outperforming traditional commercial banks and proving that trust can enforce economic contracts as effectively as a court of law.

**How does social collateral function as an economic substitute for physical assets?**
Grameen Bank proved that social collateral—the network of trust, reputation, and mutual obligation within a community—can replace physical collateral in credit markets. When a borrower receives trust, they feel a psychological drive to reciprocate that trust through reliability. Conversely, the threat of losing social standing or letting down close peers acts as a powerful deterrent against default. By using community trust as a financial foundation, Grameen Bank reduced default rates, lowered administrative tracking costs, and created an economic engine out of social relationships that classical models treated as economically worthless.

**What are the limits of trust-based financial models in modern markets?**
While Grameen Bank won the Nobel Peace Prize in 2006 and inspired microfinance models worldwide, trust-based lending is not without challenges. As microfinance scaled globally, some commercialized lenders aggressively expanded group borrowing, turning peer support into high-pressure social coercion. Furthermore, while social collateral works exceptionally well in tight-knit, rural communities where social bonds are deep, it is harder to maintain in urban environments with high population mobility and weaker community ties. Modern behavioral financial design continues to refine these systems, combining digital credit tracking with peer networks to preserve trust while scaling access.`,
    articleSummary: `Grameen Bank in Bangladesh revolutionized global microfinance by replacing physical collateral with social trust and peer reciprocity. By forming small solidarity groups, founder Muhammad Yunus enabled low-income borrowers to access credit without traditional assets. Relying on social collateral rather than legal threats, Grameen achieved repayment rates higher than traditional banks, demonstrating that trust can function as an efficient and powerful economic tool.`,
    articleTakeaways: [
      "Traditional banks excluded low-income populations due to a strict reliance on physical collateral and formal credit histories.",
      "Grameen Bank replaced physical assets with \"social collateral\" through small, five-person peer solidarity groups.",
      "Peer support and mutual obligation leveraged positive reciprocity, producing repayment rates over 95%.",
      "Trust-based systems dramatically lower administrative enforcement costs by shifting accountability to the community level.",
      "Scaling trust-based financial systems requires protecting social networks from becoming high-pressure coercive environments."
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
        questionText: "What is the fundamental concept of \"reciprocity\" in behavioral economics?",
        options: [
          "Calculating exact compound interest rates over a multi-year period",
          "Buying stocks only when market indices show positive upward trends",
          "Responding to a positive or cooperative action with cooperation, and to harmful actions with punishment",
          "Substituting physical goods with digital transactions in international trade"
        ],
        correctAnswer: "Responding to a positive or cooperative action with cooperation, and to harmful actions with punishment",
        explanation: "- A) Wrong — this is financial mathematics.\\n- B) Wrong — this is momentum trading.\\n- C) Correct — reciprocity is the behavioral instinct to match the intentions of others, answering trust with trust.\\n- D) Wrong — this is digital commerce."
      },
      {
        questionText: "In the economic Trust Game, what does standard classical economic theory (Homo economicus) predict the Trustee will do after receiving tripled funds from the Investor?",
        options: [
          "Return 100% of the funds to the Investor",
          "Keep all the funds and return $0 to the Investor",
          "Split the funds equally with the Investor",
          "Donate the funds to a third party"
        ],
        correctAnswer: "Keep all the funds and return $0 to the Investor",
        explanation: "- A) Wrong — standard theory predicts pure selfishness, not complete altruism.\\n- B) Correct — Homo economicus acts to maximize their own immediate payout, meaning they would keep all the multiplied money.\\n- C) Wrong — while common in reality due to behavioral reciprocity, classical theory does not predict fair splits.\\n- D) Wrong — irrational given classical wealth-maximizing assumptions."
      },
      {
        questionText: "Why did traditional commercial banks historically refuse to offer loans to low-income villagers in developing nations?",
        options: [
          "Because national laws prohibited poor citizens from owning currency",
          "Because low-income communities refused to use modern money",
          "Because commercial banks were legally required to lend only to foreign corporations",
          "Because banks lacked physical collateral to secure loans against default and viewed processing costs as too high"
        ],
        correctAnswer: "Because banks lacked physical collateral to secure loans against default and viewed processing costs as too high",
        explanation: "- A) Wrong — no such laws existed.\\n- B) Wrong — low-income populations used money but lacked credit.\\n- C) Wrong — banks could lend domestically, but chose not to for informal borrowers.\\n- D) Correct — traditional banks demanded hard assets (houses, cars) as collateral, which poor borrowers lacked."
      },
      {
        questionText: "What replaces physical property or real estate as security in Grameen Bank's microfinance model?",
        options: [
          "Social collateral and peer group accountability",
          "Sovereign government guarantees",
          "International gold reserves",
          "High-value personal electronics"
        ],
        correctAnswer: "Social collateral and peer group accountability",
        explanation: "- A) Correct — Grameen relies on the trust and mutual obligations within a community (social collateral) instead of seizing physical assets.\\n- B) Wrong — the loans are not backed by government debt.\\n- C) Wrong — Grameen does not use gold reserves for its microloans.\\n- D) Wrong — borrowers generally lack high-value electronics to pledge."
      },
      {
        questionText: "(Scenario) A village woman receives a microloan from Grameen Bank to purchase a milk cow. When her business faces a temporary slump, her peer group members help her make the weekly micro-payment. What behavioral dynamic is at work?",
        options: [
          "Unilateral profit maximization",
          "Regulatory tax evasion",
          "Reciprocal peer support and shared group accountability",
          "Exponential risk arbitrage"
        ],
        correctAnswer: "Reciprocal peer support and shared group accountability",
        explanation: "- A) Wrong — helping someone else doesn't immediately maximize the peers' short-term individual profit.\\n- B) Wrong — this has nothing to do with taxes.\\n- C) Correct — the members support each other to maintain their collective creditworthiness, driven by mutual trust and social accountability.\\n- D) Wrong — this is not financial arbitrage."
      },
      {
        questionText: "(Scenario) An online seller ships products to customers before receiving payment, trusting that buyers will transfer the money upon delivery. Most customers pay immediately. What economic benefit is generated by this trust?",
        options: [
          "Transaction friction is reduced, enabling faster and cheaper trade without expensive legal escrow systems",
          "The seller is guaranteed tax-free earnings on all shipments",
          "The government pays the seller a subsidy for taking risks",
          "Customers are forced to pay double the product price"
        ],
        correctAnswer: "Transaction friction is reduced, enabling faster and cheaper trade without expensive legal escrow systems",
        explanation: "- A) Correct — trust operates as an economic lubricant; when people reliably reciprocate trust, markets move faster and transaction costs drop.\\n- B) Wrong — trust does not eliminate taxes.\\n- C) Wrong — governments do not generally subsidize this private risk.\\n- D) Wrong — the price does not double; trust simply makes the standard transaction smoother."
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
