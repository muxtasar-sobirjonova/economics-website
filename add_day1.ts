import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 1;
  const tag = "Week 1";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Rational Choice Theory is the idea that people compare costs and benefits before choosing the option that gives them the greatest benefit. It is one of the basic models in economics because it gives a simple way to explain how people make decisions.</p>

<p>Imagine you are buying a new phone. One model has a better camera, another has a longer battery life, and a third is the cheapest. If you carefully compare the options and choose the one that gives you the most value, you are acting in the way Rational Choice Theory predicts.</p>

<p>This theory assumes that people have enough information, enough time, and enough self-control to make the best possible choice. In many everyday situations, that works reasonably well. A business comparing suppliers or a student choosing a university may act this way.</p>

<p>But real life often adds pressure. A flash sale, a countdown timer, or fear of missing out can push people toward quick decisions instead of careful comparison. That raises an important question: do people always choose rationally, or do emotions and social pressure sometimes take over?</p>`;

  const conceptSummary = `Rational Choice Theory is the idea that people compare costs and benefits before choosing the option that gives them the greatest benefit. It assumes that people have enough information, time, and self-control to make the best choice. While useful as a basic model, real-life pressures like flash sales or social influence often push people toward quick, emotional decisions rather than careful calculation.`;

  const conceptTakeaways = [
    "Rational Choice Theory assumes people compare costs and benefits before choosing the best option.",
    "The theory assumes people have enough information, time, and self-control to make optimal choices.",
    "It works reasonably well in many everyday situations, like comparing suppliers or choosing a university.",
    "Real-life pressures, such as flash sales or fear of missing out, can weaken careful comparison.",
    "Emotions and social pressure often override rational calculation in real-world decisions."
  ];

  const articleTitle = "The Dot-Com Bubble and Rational Choice";
  
  const articleText = `<p><strong>Why investors kept buying</strong></p>
<p>In late 1999, excitement filled the American stock market. Internet companies were appearing almost every day, and investors believed the internet would change the world. Some firms had little revenue or clear long-term strategy, yet their stock prices kept climbing. For many people, the market seemed to promise easy money simply because technology was popular.</p>

<p><strong>Why the crowd mattered</strong></p>
<p>Many investors knew these companies were expensive. Still, they kept buying because other people were making money. Stories of overnight success spread through newspapers, television, and conversations with friends. The fear of missing out became stronger than the habit of careful comparison.</p>

<p><strong>Why the theory fell short</strong></p>
<p>According to Rational Choice Theory, investors should have compared profits, risks, and future earnings before buying. If a stock price rose far above its true value, rational investors should have stopped. In theory, the decision should have depended on evidence, not excitement.</p>

<p><strong>What really drove decisions</strong></p>
<p>Instead, many people focused on optimism, social pressure, and the possibility of getting rich quickly. They were not acting like perfectly rational calculators. They were reacting to emotion, crowd behavior, and the belief that the next buyer would pay even more. That is very different from the clean decision-making process economists often assume.</p>

<p><strong>What happened next</strong></p>
<p>The bubble eventually burst. Between 2000 and 2002, the NASDAQ index lost almost 80% of its value. Hundreds of internet companies disappeared, and billions of dollars were wiped out. People who had believed they were making smart investments discovered that popularity was not the same as value.</p>

<p><strong>What the crash taught</strong></p>
<p>The dot-com crash showed that Rational Choice Theory is useful, but incomplete. It helps explain how people should decide, but it does not fully explain how people actually decide under pressure. Real choices are shaped by limited information, emotion, and the influence of others. That is why behavioral economics became so important.</p>`;

  const articleSummary = `Rational Choice Theory assumes people compare options and choose the one that gives them the greatest benefit. The dot-com boom showed that real investors often do not behave that way, especially when excitement and social pressure are strong. The crash helped show why economists needed a broader model of human decision-making.`;

  const articleTakeaways = [
    "Rational Choice Theory assumes people make decisions by comparing costs and benefits.",
    "The theory works well as a basic model, especially when people have time and information.",
    "Real decisions are often shaped by emotion, pressure, and fear of missing out.",
    "The dot-com bubble showed how crowd behavior can override careful analysis.",
    "Behavioral economics grew because rational choice alone could not explain many real-world decisions."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Do People Always Make Rational Choices?",
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
    console.log(`Updated lesson content for day \${dayOrder}`);
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
        questionText: "A shopper compares three phones and chooses the one that seems to offer the best overall trade-off. Which idea does this most closely reflect?",
        options: [
          "Impulse buying",
          "Rational choice",
          "Social proof",
          "Anchoring"
        ],
        correctAnswer: "Rational choice",
        explanation: "Carefully comparing options and choosing the one with the best value is the core of Rational Choice Theory."
      },
      {
        questionText: "A person buys a stock simply because friends are buying it and prices are rising fast. What does this most clearly show?",
        options: [
          "Careful utility maximization",
          "Following the crowd",
          "Perfect information",
          "Delayed decision-making"
        ],
        correctAnswer: "Following the crowd",
        explanation: "The person is reacting to social pressure and excitement rather than making a carefully calculated decision."
      },
      {
        questionText: "Which assumption is most important for Rational Choice Theory to work well?",
        options: [
          "People always ignore prices",
          "People have enough information and time to compare options",
          "People never change their minds",
          "People always choose the cheapest option"
        ],
        correctAnswer: "People have enough information and time to compare options",
        explanation: "Rational Choice Theory assumes individuals are fully informed and able to objectively evaluate costs and benefits."
      },
      {
        questionText: "Why does a flash sale often lead to rushed purchases?",
        options: [
          "Because people naturally calculate value more carefully under pressure",
          "Because time pressure can weaken careful comparison",
          "Because discounts remove all uncertainty",
          "Because everyone responds the same way to all prices"
        ],
        correctAnswer: "Because time pressure can weaken careful comparison",
        explanation: "Time limits add pressure that often bypasses the slow, careful analysis assumed by rational choice models."
      },
      {
        questionText: "Which situation is the weakest fit for standard Rational Choice Theory?",
        options: [
          "A firm comparing supplier prices",
          "A student comparing tuition and scholarships",
          "An investor buying because everyone else seems to be profiting",
          "A buyer weighing features before purchase"
        ],
        correctAnswer: "An investor buying because everyone else seems to be profiting",
        explanation: "Buying based purely on social influence and excitement contradicts the rational calculation of expected returns."
      },
      {
        questionText: "What does the dot-com bubble suggest about human decision-making?",
        options: [
          "People always choose the best available option",
          "Emotions and social influence can override careful calculation",
          "Markets do not react to expectations",
          "Rational choice explains every investment equally well"
        ],
        correctAnswer: "Emotions and social influence can override careful calculation",
        explanation: "The bubble demonstrated that even when financial stakes are high, psychological factors can overwhelm rational decision-making."
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
    console.log(`Updated quiz questions for day \${dayOrder}`);
  }
  console.log("Done.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
