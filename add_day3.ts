import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 3;
  const track = "BEHAVIORAL_ECONOMICS";
  console.log(`Starting update for Day \${dayOrder} (\${track})...`);

  // 1. UPDATE LESSON
  const lesson = await prisma.lesson.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  if (lesson) {
    const updatedLesson = await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: 'Two Different Ways Our Brain Makes Decisions',
        conceptText: `You walk into a supermarket planning to buy milk. Ten minutes later, you leave with chocolate, chips, and a new water bottle that was displayed beside the checkout. You never planned to buy them. What changed? The answer lies in how your brain makes decisions.

Psychologist Daniel Kahneman described decision-making as the interaction between System 1 and System 2 thinking. System 1 is fast, automatic, and effortless. It constantly looks for shortcuts so you can react quickly without carefully analyzing every choice. It recognizes faces, finishes familiar phrases, and forms instant impressions. System 2, by contrast, is slower, deliberate, and mentally demanding. It becomes active when solving a difficult math problem, comparing university offers, or deciding whether a large purchase is worth the money.

The brain prefers System 1 because careful thinking requires energy. If every decision demanded deep analysis, even ordinary daily tasks would become exhausting. As a result, people often accept the easiest option, especially when they are busy, distracted, or under time pressure.

Imagine choosing between two online stores selling the same headphones at the same price. One requires several forms, repeated password confirmations, and multiple payment screens. The other asks for a single confirmation before completing the purchase. Even if you intended to compare both carefully, the simpler process nudges your brain toward the easier choice before your analytical thinking fully engages.

Businesses understand this difference remarkably well. They design websites, stores, and apps to reduce friction, encouraging customers to rely on quick, intuitive judgments instead of slow evaluation. The question is not whether System 1 exists—it clearly does. The real question is how companies intentionally shape environments that make fast thinking drive billions of purchasing decisions.`,
        conceptSummary: `The brain relies on two decision systems. System 1 produces fast, automatic judgments with little mental effort, while System 2 performs slower, deliberate analysis when choices require careful reasoning. Because people naturally conserve mental energy, environments that reduce friction often encourage System 1 thinking, making decisions feel easier but sometimes less deliberate.`,
        conceptTakeaways: [
          "System 1 makes quick, automatic decisions using mental shortcuts.",
          "System 2 performs slow, deliberate thinking for complex choices.",
          "The brain naturally prefers System 1 because it conserves mental energy.",
          "Reducing friction makes people more likely to rely on System 1.",
          "Knowing which thinking system is active helps improve important decisions."
        ],
        articleTitle: 'Amazon: How One-Click Buying Uses the Fast Thinking Brain',
        articleText: `**1. Why did one missing click become worth billions of dollars?**
In September 1999, Amazon received a patent for One-Click Ordering, allowing returning customers to complete purchases with a single button press instead of moving through several checkout pages. The feature sounded almost trivial. It removed only a few seconds from the shopping process. Yet Amazon considered it valuable enough to defend legally because those seconds represented something much larger: fewer moments for customers to stop and reconsider.

Every additional step gives the brain another chance to ask, "Do I really need this?" Eliminating those pauses changes how decisions are made.

**2. What happens inside your brain during those extra seconds?**
When you see a product you like, System 1 reacts almost instantly. It imagines owning the item, remembers positive experiences, and creates excitement. This reaction happens automatically.

If the checkout process becomes long or complicated, System 2 has time to take over. It compares prices, remembers your budget, and questions whether the purchase is necessary. Sometimes that leads to a better decision. Other times, it simply delays the purchase.

Amazon realized that shortening the path between desire and payment keeps more decisions inside System 1, where buying feels easier and requires less mental effort.

**3. Why does reducing effort increase spending?**
People naturally avoid unnecessary mental work. Economists call these small obstacles friction costs. Although they may not involve money, they consume attention and effort.

Amazon steadily removed friction by storing customer addresses, payment information, and shipping preferences. Returning customers no longer needed to repeat the same information every time they bought something.

None of these changes altered the products themselves. Instead, they changed how difficult the buying process felt. Lower effort often translated into higher sales because customers reached the finish line before hesitation appeared.

**4. If one click is powerful, why don't all companies copy it exactly?**
Many retailers simplified checkout after seeing Amazon's success, but Amazon's advantage extended beyond a single button.

Customers already trusted the platform, knew delivery would be reliable, and expected consistent service. One-click purchasing worked because it was supported by years of investment in logistics, secure payments, customer reviews, and fast shipping.

Removing friction without building trust can actually discourage customers. Speed helps only when people already believe the transaction is safe.

**5. What does this teach us about our own decisions?**
Fast decisions are not automatically bad. If you buy the same household supplies every month, quick purchasing saves time without causing much harm.

Problems appear when expensive or emotionally charged purchases rely entirely on System 1. Limited-time offers, countdown timers, and personalized recommendations can encourage action before careful thinking begins.

Recognizing these situations allows you to pause deliberately and invite System 2 into the decision. Sometimes one extra minute of reflection saves far more money than one extra click ever could.

**6. As technology becomes smarter, who controls the final decision?**
Artificial intelligence now predicts what customers may want before they even search for it. Recommendation systems learn preferences, suggest products, and make shopping increasingly effortless.

Yet the final choice still belongs to the customer. Technology can reduce friction, but it cannot eliminate responsibility. Understanding how System 1 and System 2 work gives consumers an important advantage: they recognize when convenience is helping them and when convenience is quietly making the decision on their behalf.

The companies that succeed will continue making choices feel effortless. The consumers who thrive will know exactly when effortless decisions deserve a second thought.`,
        articleSummary: `Amazon's One-Click Ordering demonstrates how reducing even tiny amounts of friction changes consumer behavior. By shortening the path between wanting a product and buying it, Amazon encourages customers to rely more on fast, intuitive thinking than slow analysis. The lesson extends beyond online shopping: understanding when convenience shapes decisions helps consumers recognize when careful reflection is worth the extra effort.`,
        articleTakeaways: [
          "Amazon's One-Click Ordering reduced friction rather than changing the product.",
          "Every additional checkout step creates another opportunity for customers to reconsider.",
          "Convenience increases purchases by reducing mental effort.",
          "Trust and reliable service make friction-reducing features more effective.",
          "Consumers can make better decisions by intentionally activating System 2 for important purchases."
        ],
      }
    });
    console.log(`Successfully updated Lesson for Day \${dayOrder}: \${updatedLesson.title}`);
  } else {
    console.log(`Lesson for Day \${dayOrder} not found!`);
  }

  // 2. UPDATE QUIZ
  const quiz = await prisma.quiz.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  if (quiz) {
    // Delete existing questions
    await prisma.quizQuestion.deleteMany({
      where: { quizId: quiz.id }
    });

    const questions = [
      {
        questionText: "Why does the brain rely on System 1 for many everyday decisions instead of using System 2 every time?",
        options: [
          "Because System 1 always makes more accurate decisions.",
          "Because System 1 requires less mental effort and conserves cognitive resources.",
          "Because System 2 only works during emergencies.",
          "Because System 1 processes more information than System 2."
        ],
        correctAnswer: "Because System 1 requires less mental effort and conserves cognitive resources.",
        explanation: "System 1 is fast and effortless, saving the brain energy for tasks that truly require deep thought."
      },
      {
        questionText: "A decision is most likely to shift from System 1 to System 2 when:",
        options: [
          "The task becomes more familiar.",
          "The decision requires careful comparison or problem-solving.",
          "A website removes unnecessary checkout steps.",
          "Someone acts on instinct."
        ],
        correctAnswer: "The decision requires careful comparison or problem-solving.",
        explanation: "System 2 engages when a task is complex, unfamiliar, or requires deliberate logic and comparison."
      },
      {
        questionText: "Why can reducing friction influence consumer behavior even when the product stays the same?",
        options: [
          "It lowers the product's manufacturing cost.",
          "It reduces the mental effort needed to complete the purchase.",
          "It guarantees higher product quality.",
          "It increases advertising spending."
        ],
        correctAnswer: "It reduces the mental effort needed to complete the purchase.",
        explanation: "By making purchasing effortless, companies keep customers in System 1, preventing hesitation."
      },
      {
        questionText: "Which statement best describes the relationship between System 1 and System 2?",
        options: [
          "Only one system exists in healthy decision-making.",
          "System 2 completely replaces System 1 in adults.",
          "The two systems work together, with System 2 stepping in when deeper thinking is needed.",
          "System 1 is only used during childhood."
        ],
        correctAnswer: "The two systems work together, with System 2 stepping in when deeper thinking is needed.",
        explanation: "The systems operate in tandem: System 1 runs continuously in the background, while System 2 is called upon for harder tasks."
      },
      {
        questionText: "You are buying a laptop for university. Which action is most likely to activate System 2?",
        options: [
          "Buying the first laptop with a 'Best Seller' label.",
          "Reading detailed reviews and comparing specifications before purchasing.",
          "Choosing the brightest advertisement.",
          "Buying it because a friend bought one."
        ],
        correctAnswer: "Reading detailed reviews and comparing specifications before purchasing.",
        explanation: "Detailed reading and specification comparison are slow, deliberate activities that require System 2."
      },
      {
        questionText: "Role Scenario – You are an e-commerce designer. Sales drop because many customers abandon their carts. Which change is most likely to increase completed purchases?",
        options: [
          "Add another confirmation page.",
          "Require customers to create two passwords.",
          "Reduce the number of checkout steps.",
          "Ask customers to re-enter their address every time."
        ],
        correctAnswer: "Reduce the number of checkout steps.",
        explanation: "Reducing checkout steps eliminates friction, keeping customers in the fast, intuitive System 1 mindset."
      },
      {
        questionText: "Amazon removes one checkout page from its purchasing process. Which outcome is most consistent with System 1 thinking?",
        options: [
          "Customers spend more time comparing prices.",
          "More customers complete purchases before reconsidering.",
          "Customers stop trusting the platform.",
          "Product prices automatically decrease."
        ],
        correctAnswer: "More customers complete purchases before reconsidering.",
        explanation: "Fewer pages mean fewer pauses for System 2 to activate and question the purchase."
      },
      {
        questionText: "A supermarket places candy next to the checkout counter. Which principle is being used?",
        options: [
          "Encouraging careful analytical thinking.",
          "Increasing friction costs.",
          "Triggering quick, automatic purchasing decisions.",
          "Raising product quality."
        ],
        correctAnswer: "Triggering quick, automatic purchasing decisions.",
        explanation: "Checkout candy targets tired, distracted shoppers using System 1, capitalizing on a low-friction impulse buy."
      },
      {
        questionText: "Role Scenario – You manage your monthly budget. Before buying an expensive gaming console online, what is the best way to activate System 2?",
        options: [
          "Buy immediately before the sale ends.",
          "Compare prices, review your budget, and wait until the next day before deciding.",
          "Ignore reviews completely.",
          "Purchase it because it appears on the homepage."
        ],
        correctAnswer: "Compare prices, review your budget, and wait until the next day before deciding.",
        explanation: "Pausing and running calculations (budgeting) forces the slower System 2 to take control from the impulsive System 1."
      },
      {
        questionText: "A company asks customers to enter their payment details only once and securely saves them for future purchases. Which economic idea is being applied?",
        options: [
          "Increasing opportunity cost.",
          "Reducing friction to encourage faster decisions.",
          "Raising production efficiency.",
          "Limiting consumer choice."
        ],
        correctAnswer: "Reducing friction to encourage faster decisions.",
        explanation: "Saving payment details removes a major friction point (typing out numbers), speeding up future purchases."
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
    console.log(`Quiz for Day \${dayOrder} not found!`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
