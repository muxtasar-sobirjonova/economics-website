import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 4;
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
        title: 'Why Economics Started Studying Human Psychology',
        conceptText: `A stock that doubled in price last month keeps climbing. Your classmates are buying it. News headlines celebrate a "once-in-a-generation opportunity." You know prices cannot rise forever, yet you still feel pressure to join before it is "too late." That conflict sits at the heart of one of economics' biggest revolutions.

For decades, classical economics assumed that people consistently make rational choices by weighing costs, benefits, and available information. The model worked well for many situations, but it struggled to explain a stubborn pattern: financial bubbles, market crashes, and mass panic kept happening. If investors were truly rational, why would millions buy assets at unrealistic prices or sell them in fear when little had changed overnight? Behavioral economists, particularly Daniel Kahneman and Amos Tversky, argued that real decisions are shaped not only by information but also by emotion, mental shortcuts, and social influence.

The mechanism is straightforward. Markets are made of people, and people rarely think in isolation. Optimism spreads through conversations, headlines, and rising prices. Fear spreads just as quickly. As more individuals copy one another, emotions become collective behavior. Prices begin reflecting psychology as much as economic fundamentals. The market is no longer just measuring value; it is amplifying human emotion.

Imagine a school charity auction. One student offers an unexpectedly high bid for a signed football. Others assume the item must be worth even more and continue raising their bids. Minutes later, the winning student pays far beyond the football's real value—not because the object changed, but because the crowd changed how everyone judged it.

Behavioral economics does not reject logic. It explains why logic often competes with emotion when stakes are high. That insight becomes impossible to ignore when an entire financial system begins making the same mistake at the same time. The next story explores exactly how fear turned one market collapse into a lesson that reshaped modern economics.`,
        conceptSummary: `Classical economics assumed people usually make rational decisions, but repeated market bubbles and crashes exposed its limits. Behavioral economics explains that emotions, mental shortcuts, and social influence often shape choices alongside logic. Because markets are collections of human decisions, understanding psychology is essential for explaining how prices sometimes drift far from fundamental value.`,
        conceptTakeaways: [
          "Classical economics assumes decisions are largely rational.",
          "Behavioral economics explains how emotions and psychology influence economic choices.",
          "Markets reflect both economic information and human behavior.",
          "Herd behavior can cause prices to move away from fundamental value.",
          "Behavioral economics complements rather than replaces classical economics."
        ],
        articleTitle: 'The Stock Market Crash: When Fear Beats Rational Calculation',
        articleText: `**1. How did a single morning erase billions of dollars in confidence?**
October 19, 1987. Traders arrived expecting another difficult day on Wall Street. By the closing bell, the Dow Jones Industrial Average had fallen 22.6%—still the largest one-day percentage drop in its history. Companies had not suddenly lost a fifth of their factories or employees. Yet investors behaved as though the economy itself had collapsed. The most valuable thing that disappeared that day was not money. It was confidence.

**2. Why did thousands of experienced investors all reach the same frightening conclusion?**
A myth says markets are driven only by facts. The crash suggested something different. Investors watched prices fall, saw others rushing to sell, and interpreted those actions as new information. Fear became evidence. Instead of independently asking what companies were truly worth, many people assumed the crowd knew something they did not.

Behavioral economics calls this herd behavior. When uncertainty grows, copying others often feels safer than standing alone—even if everyone is making the same mistake.

**3. What made selling feel smarter than holding?**
Imagine opening your investment account every hour and watching your savings shrink. The pain feels immediate and personal. Holding the investment suddenly seems riskier than selling it.

This reaction reflects loss aversion, another insight from behavioral economics. Research by Kahneman and Tversky showed that people experience losses more intensely than equivalent gains. Losing $1,000 usually hurts more than gaining $1,000 feels good. During a crash, that emotional imbalance pushes many investors toward quick decisions designed to stop the pain rather than maximize long-term returns.

**4. How did fear spread faster than the actual economic news?**
The economy does not change by 22% in a single afternoon. Information travels gradually. Emotions do not.

Television broadcasts showed falling prices. News anchors repeated alarming headlines. Traders watched one another selling at record speed. Every new sale became another signal that danger was growing. Fear spread through observation long before anyone fully understood what was happening.

Behavioral economists argue that markets transmit psychology just as efficiently as they transmit information.

**5. Why couldn't classical economics fully explain what happened?**
Classical theory predicted that investors would calmly evaluate each company's future profits before buying or selling. Yet the 1987 crash showed widespread decisions driven by panic, imitation, and emotional reactions.

Behavioral economics did not replace classical economics. Instead, it expanded it. Prices are shaped by earnings, interest rates, and productivity—but they are also shaped by optimism, fear, overconfidence, and social pressure. Ignoring those forces leaves part of the story unexplained.

**6. What lesson does every investor still carry from Black Monday?**
Modern markets are faster than ever. Algorithms execute trades in milliseconds, and news reaches millions of phones instantly. Yet the human brain has changed very little.

Technology may accelerate decisions, but it does not eliminate emotion. Investors who recognize when fear is driving the crowd are better equipped to pause, examine evidence, and think independently. The greatest financial advantage is often not predicting the next market movement. It is recognizing when psychology, rather than value, is steering everyone else.`,
        articleSummary: `The 1987 Black Monday crash showed that markets can be driven by fear as much as by facts. Investors copied one another, reacted strongly to losses, and spread panic faster than economic information changed. Behavioral economics explains these patterns by recognizing that emotions and psychology influence financial decisions, especially during periods of uncertainty and extreme market stress.`,
        articleTakeaways: [
          "Black Monday (October 19, 1987) saw the Dow Jones fall 22.6% in one day.",
          "Investors often copied others instead of independently evaluating information.",
          "Loss aversion made selling emotionally attractive during the crash.",
          "Fear spread through observation faster than economic fundamentals changed.",
          "Successful investors recognize when crowd psychology is influencing decisions more than evidence."
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
        questionText: "Why did behavioral economics emerge as a separate field from classical economics?",
        options: [
          "Classical economics could not explain why emotions and psychology influence many economic decisions.",
          "Classical economics ignored mathematics.",
          "Behavioral economics focuses only on government policies.",
          "Classical economics assumes markets never change."
        ],
        correctAnswer: "Classical economics could not explain why emotions and psychology influence many economic decisions.",
        explanation: "Behavioral economics emerged because classical theory struggled to explain phenomena like financial bubbles and crashes, where emotion and social influence drive behavior."
      },
      {
        questionText: "Which situation best demonstrates the limitation of classical economic theory?",
        options: [
          "A consumer compares electricity prices before choosing a provider.",
          "Investors panic and sell stocks even though company fundamentals remain largely unchanged.",
          "A business lowers prices to increase sales.",
          "A factory improves productivity by buying new machinery."
        ],
        correctAnswer: "Investors panic and sell stocks even though company fundamentals remain largely unchanged.",
        explanation: "Classical theory assumes people buy/sell based on fundamentals; a panic-driven selloff contradicts this, highlighting the role of emotion."
      },
      {
        questionText: "Why does herd behavior make financial markets more volatile?",
        options: [
          "Investors always receive identical information.",
          "People begin copying others instead of making independent judgments.",
          "Governments force investors to buy the same stocks.",
          "Companies stop earning profits."
        ],
        correctAnswer: "People begin copying others instead of making independent judgments.",
        explanation: "When investors substitute independent evaluation for copying others (herd behavior), prices can quickly detach from fundamental reality."
      },
      {
        questionText: "Which statement best describes the relationship between classical and behavioral economics?",
        options: [
          "Behavioral economics completely replaces classical economics.",
          "Classical economics explains emotions better than behavioral economics.",
          "Behavioral economics expands classical theory by including psychological influences.",
          "The two fields study completely unrelated topics."
        ],
        correctAnswer: "Behavioral economics expands classical theory by including psychological influences.",
        explanation: "Behavioral economics doesn't reject logic; it simply adds emotion, mental shortcuts, and social influence to the classical model."
      },
      {
        questionText: "Role Scenario – You are an investment advisor. During a sudden market drop, your client wants to sell every investment immediately. What should you recommend first?",
        options: [
          "Sell everything immediately.",
          "Pause, review the client's long-term goals, and examine the underlying company fundamentals before deciding.",
          "Buy random stocks because prices are falling.",
          "Ignore all financial information."
        ],
        correctAnswer: "Pause, review the client's long-term goals, and examine the underlying company fundamentals before deciding.",
        explanation: "A behavioral approach acknowledges the panic (loss aversion) and counters it by pausing to evaluate actual fundamentals and goals."
      },
      {
        questionText: "A company's profits remain stable, but its share price falls sharply because investors panic after negative news headlines. Which concept best explains this?",
        options: [
          "Herd behavior and emotional decision-making.",
          "Perfect rationality.",
          "Opportunity cost.",
          "Comparative advantage."
        ],
        correctAnswer: "Herd behavior and emotional decision-making.",
        explanation: "Prices moving independently of stable profits due to panic is a classic example of herd behavior and emotion overriding fundamental value."
      },
      {
        questionText: "Imagine you are deciding whether to invest in a new company. Which action reflects System 2 thinking?",
        options: [
          "Buying because everyone on social media recommends it.",
          "Reading financial reports, comparing risks, and evaluating long-term performance.",
          "Purchasing immediately because the price increased yesterday.",
          "Following your friend's decision without research."
        ],
        correctAnswer: "Reading financial reports, comparing risks, and evaluating long-term performance.",
        explanation: "System 2 thinking is slow, deliberate, and logical, like reading reports and comparing risks, rather than making impulsive or herd-based choices."
      },
      {
        questionText: "During a financial bubble, why do many people continue buying overpriced assets?",
        options: [
          "The assets always become more valuable.",
          "They believe rising prices and other investors' actions prove the investment is safe.",
          "Governments require them to invest.",
          "Companies guarantee future profits."
        ],
        correctAnswer: "They believe rising prices and other investors' actions prove the investment is safe.",
        explanation: "Investors look to others' behavior (social proof) and rising prices as a signal of safety, fueling the bubble further."
      },
      {
        questionText: "Role Scenario – You manage a pension fund during a market crash. Which decision best reflects behavioral economics?",
        options: [
          "Ignore investor emotions completely.",
          "Recognize that fear may temporarily push prices below their true value before making decisions.",
          "Copy whatever competing funds are doing.",
          "Sell every investment immediately."
        ],
        correctAnswer: "Recognize that fear may temporarily push prices below their true value before making decisions.",
        explanation: "A behavioral economist understands that crowd psychology can drive prices away from real value, creating opportunities for those who stay rational."
      },
      {
        questionText: "A student refuses to sell a stock because they hope it will recover, even though new evidence suggests otherwise. Which psychological influence is most likely affecting the decision?",
        options: [
          "Loss aversion.",
          "Inflation.",
          "Opportunity cost.",
          "Supply and demand."
        ],
        correctAnswer: "Loss aversion.",
        explanation: "Loss aversion makes realizing a loss so painful that people often hold onto losing investments hoping for a rebound against the evidence."
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
