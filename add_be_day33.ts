import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 33;
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
    title: 'Why Society Changes Our Choices (Social Norms & Compliance)',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `Classical economics assumes that individuals make decisions in a vacuum, calculating their choices based solely on personal preferences, financial costs, and immediate utility. Under this traditional view, if you want someone to change their behavior, you simply change the price tag or introduce a financial penalty. But human beings are inherently social creatures. We continuously look to those around us to determine what is acceptable, desirable, or appropriate.

In behavioral economics, this drive is governed by social norms and compliance. Social norms are the unwritten rules that dictate acceptable behavior within a group or society. These are broken down into two main types:

Descriptive Norms: What people actually do in a given situation (e.g., "90% of your neighbors recycle").
Injunctive Norms: What people believe they ought to do based on societal approval or disapproval (e.g., "Littering is wrong and frowned upon").

When an action aligns with a prevailing social norm, compliance happens almost effortlessly because human beings experience psychological comfort when fitting in. Conversely, breaking a strong social norm triggers social shame, guilt, and fear of ostracization.

Imagine walking through a public park holding a piece of trash. If the park is spotless and everyone around you carefully carries their waste to a recycling bin, the social cost of dropping your trash on the ground becomes immense—not because a police officer is watching, but because breaking the visible social norm feels deeply uncomfortable.

Behavioral change often happens fastest not when laws impose heavy financial fines, but when society shifts what it considers "normal." By altering the social baseline, communities can reshape individual choices without relying on constant enforcement.`,
    conceptSummary: `Standard economics assumes choices are made independently based on personal costs, but behavioral economics shows that human choices are heavily dictated by social norms and compliance. People naturally look to others to guide their behavior, adopting habits to fit in, earn community approval, and avoid the psychological discomfort of social disapproval.`,
    conceptTakeaways: [
      "Descriptive vs. Injunctive Norms: Descriptive norms reflect what people actually do, while injunctive norms reflect what society morally expects people to do.",
      "Social Compliance: Humans naturally align their behavior with group standards to maintain social connection and avoid ostracization.",
      "Beyond Price Signals: Social norms can drive widespread behavioral change without relying solely on financial incentives or price adjustments.",
      "The Cost of Disapproval: The psychological discomfort of breaking a social norm acts as an internal regulator on personal choices.",
      "Framing Norms: Highlighting that a majority of peers perform a positive behavior significantly increases individual compliance."
    ],
    articleTitle: 'Rwanda and the Power of Social Norms',
    articleText: `**How do traditional policy tools struggle to enforce widespread behavioral change?**
When governments want to curb harmful environmental habits—like littering, excessive energy consumption, or plastic waste—their default playbook usually relies on taxation, legal bans, or financial subsidies. While financial incentives can shift behavior at the margins, they often require constant, expensive enforcement. If citizens perceive a law as an annoying top-down mandate rather than a shared moral commitment, they frequently look for loopholes or comply only when authorities are actively watching. Classical policy tools often underestimate the most powerful regulator of human behavior: the desire to fit into one's community.

**How did Rwanda achieve one of the world's most successful bans on single-use plastics?**
In 2008, long before many Western nations took action, Rwanda implemented a strict national ban on the importation, manufacture, sale, and use of non-biodegradable plastic bags. Today, visitors arriving at Kigali International Airport are routinely checked, and plastic bags are confiscated on the spot. Capital cities worldwide struggle with urban waste, but Kigali is widely celebrated as one of Africa's cleanest cities. The secret to Rwanda’s success was not just the legal policy itself, but how the nation embedded environmental stewardship into its cultural identity and collective social obligations.

**What behavioral mechanism transformed a legal policy into a deeply rooted cultural norm?**
Rwanda mobilized compliance by tapping into a long-standing traditional practice called Umuganda—a monthly community work day where citizens across the country come together to clean streets, clear drainage ditches, and build public infrastructure. By linking the plastic bag ban directly to Umuganda, the government transformed clean streets from a bureaucratic mandate into a visible descriptive and injunctive norm.

**How did the perception of plastic bags change within the community?**
Because of Umuganda, caring for the environment became synonymous with civic duty and community pride. Carrying a plastic bag was no longer seen as a minor legal infraction or an acceptable convenience. Instead, it became a highly visible signal that a person was actively disrespecting their neighbors and the collective community effort to maintain a clean nation.

**Why does peer enforcement often work better than formal police enforcement?**
Behavioral scientists note that peer-led compliance relies on social friction rather than legal prosecution. In Rwanda, shopkeepers, street vendors, and ordinary citizens quickly began policing one another—not through formal arrests, but through subtle social disapproval. If a vendor offered a plastic bag, customers would refuse it or remind them of community standards. When an entire group adopts a shared expectation, the psychological cost of non-compliance—feeling shame or public embarrassment—becomes an immediate personal cost that people actively work to avoid.

**What lessons does Rwanda offer for global behavioral interventions?**
The Rwandan plastic ban demonstrates that lasting behavioral change occurs when policies align with and reshape social norms. Financial penalties can stop a behavior temporarily, but shifting the underlying baseline of what society considers acceptable creates self-sustaining compliance. Whether encouraging energy conservation, public health habits, or waste reduction, policymakers around the world are learning that the most effective strategy is not simply passing a law, but making the desired behavior feel like the clear, socially respected choice.`,
    articleSummary: `In 2008, Rwanda successfully eliminated single-use plastic bags by pairing a national ban with deep-rooted social norms, particularly the traditional community cleaning day known as Umuganda. By framing environmental cleanliness as a collective civic duty, Rwanda created a powerful descriptive and injunctive norm. Peer-led compliance and social expectations transformed the country's public spaces, proving that shifting societal standards can enforce behavior far more effectively than formal laws alone.`,
    articleTakeaways: [
      "Top-down legal bans often fail or require expensive enforcement if they do not align with community social norms.",
      "Rwanda’s plastic bag ban succeeded by leveraging Umuganda, a traditional practice of community work and collective responsibility.",
      "Cleanliness shifted from a legal requirement to a visible point of national and local pride.",
      "Peer enforcement—driven by social disapproval—replaced the need for constant, aggressive police oversight.",
      "Effective behavioral policies use social structures to make desirable choices feel like the natural, community-approved baseline."
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
        questionText: "According to behavioral economics, why do people often comply with social norms even when no authority figure is watching?",
        options: [
          "Because internalizing social expectations prevents the psychological discomfort of shame or social disapproval",
          "Because social norms reduce the overall cost of international trade",
          "Because financial rewards are automatically deposited into their bank accounts",
          "Because people are legally required to sign compliance agreements"
        ],
        correctAnswer: "Because internalizing social expectations prevents the psychological discomfort of shame or social disapproval",
        explanation: "- A) Correct — humans naturally want to fit in, and violating social norms causes internal guilt and psychological discomfort.\\n- B) Wrong — social norms are typically about community behavior, not macro trade economics.\\n- C) Wrong — compliance with social norms is usually intrinsically motivated, not financially rewarded.\\n- D) Wrong — social norms are unwritten rules, not signed legal agreements."
      },
      {
        questionText: "What traditional cultural practice did Rwanda leverage to build widespread social compliance for its plastic bag ban?",
        options: [
          "Kintsugi, the practice of repairing broken pottery with gold",
          "Fiesta, a seasonal festival encouraging public celebration",
          "Umuganda, a monthly community work day focused on public cleanups and civic projects",
          "Potlatch, a ceremonial distribution of wealth"
        ],
        correctAnswer: "Umuganda, a monthly community work day focused on public cleanups and civic projects",
        explanation: "- A) Wrong — Kintsugi is a Japanese art.\\n- B) Wrong — Fiesta is a broad term for festivals.\\n- C) Correct — Rwanda leveraged Umuganda, embedding the plastic ban into a pre-existing cultural norm of civic duty.\\n- D) Wrong — Potlatch is an indigenous North American tradition."
      },
      {
        questionText: "What is the key distinction between a \"descriptive norm\" and an \"injunctive norm\"?",
        options: [
          "Descriptive norms involve legal written contracts, while injunctive norms are strictly unwritten rules.",
          "Descriptive norms only apply to financial markets, while injunctive norms apply to environmental policies.",
          "Descriptive norms are enforced by police, while injunctive norms are enforced by central banks.",
          "Descriptive norms describe what people actually do, while injunctive norms describe what society believes people ought to do."
        ],
        correctAnswer: "Descriptive norms describe what people actually do, while injunctive norms describe what society believes people ought to do.",
        explanation: "- A) Wrong — neither are legal written contracts.\\n- B) Wrong — both concepts apply broadly to human behavior.\\n- C) Wrong — social norms are typically enforced by peers, not police or central banks.\\n- D) Correct — descriptive (what is done) vs. injunctive (what should be done) is the standard behavioral distinction."
      },
      {
        questionText: "Why is peer-led social enforcement often more effective than traditional top-down police enforcement?",
        options: [
          "Because peers can issue official government tax penalties directly",
          "Because social expectations create immediate, continuous psychological pressure to maintain community respect",
          "Because citizen enforcement requires complex formal court trials for every single violation",
          "Because citizens are paid wages by their neighbors to monitor each other"
        ],
        correctAnswer: "Because social expectations create immediate, continuous psychological pressure to maintain community respect",
        explanation: "- A) Wrong — peers do not issue official taxes.\\n- B) Correct — peer enforcement relies on social friction, shame, and immediate community feedback, which is harder to escape than intermittent police patrols.\\n- C) Wrong — peer enforcement works through social disapproval, avoiding courts.\\n- D) Wrong — peer enforcement is uncompensated social behavior."
      },
      {
        questionText: "(Scenario) A hotel places a sign in bathrooms stating: \"75% of guests in this room reuse their towels to help protect the environment.\" Towel reuse increases dramatically. What behavioral mechanism explains this result?",
        options: [
          "Financial price discrimination across room tiers",
          "The threat of legal eviction by hotel management",
          "The activation of a descriptive social norm showing what peers actually do",
          "Exponential discount rate optimization"
        ],
        correctAnswer: "The activation of a descriptive social norm showing what peers actually do",
        explanation: "- A) Wrong — no prices were changed in this scenario.\\n- B) Wrong — the sign offers a statistic, not a legal threat.\\n- C) Correct — providing data on what most people do (75% reuse) creates a descriptive norm that encourages guests to match their peers.\\n- D) Wrong — this involves time preference, not social behavior."
      },
      {
        questionText: "What is a primary lesson for policymakers from Rwanda's successful plastic reduction policy?",
        options: [
          "Shifting societal standards and aligning policy with cultural values creates self-sustaining compliance",
          "Policies succeed best when relying strictly on heavy financial fines without public messaging",
          "Environmental policies only work in small island nations",
          "Plastic bans always fail unless corporate taxes are eliminated"
        ],
        correctAnswer: "Shifting societal standards and aligning policy with cultural values creates self-sustaining compliance",
        explanation: "- A) Correct — when policies tap into existing social norms, compliance becomes peer-enforced and sustainable.\\n- B) Wrong — heavy fines alone often lead to evasion and resentment.\\n- C) Wrong — Rwanda is landlocked, and the principle applies globally.\\n- D) Wrong — the success was driven by social norms, not corporate tax changes."
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
