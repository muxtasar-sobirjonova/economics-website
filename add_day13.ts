import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 13;
  const tag = "Week 2";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>A basketball commentator says a player is "heating up" after three straight makes, and the point guard immediately feeds him the ball again, ignoring a wide-open teammate under the rim. That pass, made on instinct, is a bet on a pattern that statisticians have spent decades trying to find — and mostly failing to.</p>

<p>This is illusory correlation: the tendency to perceive a relationship between two events — like consecutive makes and the next shot's likelihood of going in — when no such relationship reliably exists in the data. Psychologists Thomas Gilovich, Robert Vallone, and Amos Tversky studied this directly in professional basketball and found that a player's chance of scoring after a hit was statistically almost identical to their chance after a miss.</p>

<p>Imagine flipping a coin and getting four heads in a row. Something in your gut says the streak means something — that the coin, or the flipper, is somehow "on." It isn't. Random sequences naturally produce streaks more often than intuition expects, and human pattern-recognition, built for spotting real threats and food sources, treats those streaks as signal instead of noise.</p>

<p>The hot hand feels obviously true to players, coaches, and fans who've watched thousands of games. So why does the actual data tell such a different story — and does that mean the hot hand is entirely a myth, or something more complicated?</p>`;

  const conceptSummary = `Illusory correlation is the tendency to see a meaningful pattern between two events — like consecutive basketball makes and the next shot's odds — when the underlying data shows no reliable relationship. Landmark research on the "hot hand" found a player's chance of scoring after a hit was nearly identical to their chance after a miss, even though players and fans were convinced streaks predicted future success.`;

  const conceptTakeaways = [
    "Illusory correlation is perceiving a meaningful relationship between events when the actual data shows no reliable connection.",
    "The original hot hand study (Gilovich, Vallone, and Tversky) found shooting percentages after a hit were nearly identical to shooting percentages after a miss.",
    "Random sequences naturally produce streaks more often than human intuition expects, making randomness look like a pattern.",
    "Human pattern-recognition evolved to spot real threats and resources, which makes it prone to over-detecting patterns in genuinely random data.",
    "Illusory correlation persists even among experts — players, coaches, and fans who've watched thousands of real games still believe in the pattern."
  ];

  const articleTitle = "The \"Hot Hand\" Myth in Basketball";
  
  const articleText = `<p><strong>"Why do humans see patterns even in randomness?"</strong></p>

<p>"There's no such thing as the hot hand." That sentence, published in 1985, made professional basketball players furious. What did the data actually show? Psychologists Thomas Gilovich, Robert Vallone, and Amos Tversky analyzed the shooting records of the Philadelphia 76ers across the 1980-81 season and found something players refused to believe: a player's field-goal percentage immediately after making a shot was statistically indistinguishable from his percentage immediately after missing one. The pattern fans and commentators saw on television — a shooter "getting hot" — wasn't showing up in the box score.</p>

<p>How did Gilovich, Vallone, and Tversky test the hot hand using real Philadelphia 76ers shooting records? They broke down every player's sequence of hits and misses across the season and calculated the probability of a make following one, two, or three consecutive makes, versus following one, two, or three consecutive misses. If the hot hand were real, makes should have clustered — strings of hits followed by more hits at a higher rate than average. Instead, the researchers found streak length barely moved shooting percentage at all, within the range expected from ordinary statistical chance.</p>

<p>Why did the researchers also run a controlled free-throw experiment at Cornell, and what did it add? Game shots involve variables the researchers couldn't control — shot difficulty, defensive pressure, shot selection. So they had Cornell University's varsity basketball players shoot free throws in a controlled gym setting, removing defenders and shot variety entirely. The result matched the 76ers data: free-throw success after a streak of makes was no higher than after a streak of misses, even in players who strongly believed they could feel when they were "in a groove."</p>

<p>If the hot hand isn't statistically real, why do players and coaches still believe in it so strongly? Because random sequences produce streaks far more often than intuition expects. In a genuinely random string of hits and misses, clusters of three or four makes in a row happen regularly by chance alone — but human pattern-recognition, tuned by evolution to catch real signals quickly, reads that cluster as meaningful. The player who makes four shots in a row doesn't feel like he got lucky in sequence; he feels like something changed. That feeling is the illusion, not the data.</p>

<p>Have later studies overturned the original 1985 findings? Partially. Follow-up research using more sophisticated statistical methods — including a widely discussed 2014 reanalysis — found small, real hot-hand effects that the original 1985 methodology may have underestimated, particularly around shot selection and defensive adjustments. The consensus shifted from "the hot hand is a complete myth" to "the hot hand may exist, but it's far smaller than players and fans believe, and much smaller than the confidence people place in it."</p>

<p>Why do humans see patterns even in randomness — what's actually happening in the brain? The same cognitive machinery that lets you notice a predator's rustle in tall grass, or recognize a friend's voice in a crowded room, doesn't turn off when the input is genuinely random. Streak detection was useful when patterns in nature usually meant something real. On a basketball court, where four makes in a row can be pure chance, that same wiring still fires — turning a coin flip into a story.</p>`;

  const articleSummary = `The famous 1985 hot hand study found that Philadelphia 76ers players' shooting percentages after a streak of makes were statistically no different from after a streak of misses, a result confirmed in controlled free-throw testing at Cornell. Later research found the effect might be real but far smaller than believed. The core lesson: human brains are wired to detect patterns, even inside genuinely random sequences.`;

  const articleTakeaways = [
    "The 1985 study by Gilovich, Vallone, and Tversky found Philadelphia 76ers shooting percentages were nearly identical after streaks of makes versus streaks of misses.",
    "A controlled Cornell free-throw experiment confirmed the same result, ruling out variables like shot difficulty and defensive pressure.",
    "Randomness naturally produces streaks more often than intuition expects, which is why chance sequences get mistaken for meaningful patterns.",
    "A 2014 reanalysis and later studies suggest small real hot-hand effects may exist, smaller than the belief in them.",
    "Pattern-recognition wiring, evolved for spotting real threats and signals, doesn't distinguish between genuine patterns and random noise."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Why We Believe Random Events Are Connected",
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
        questionText: "A commentator says a player “feels hot” after several makes in a row. What is the most careful response?",
        options: [
          "Assume the streak guarantees the next shot will go in.",
          "Treat the streak as interesting, but not automatically predictive.",
          "Ignore all past shots completely.",
          "Conclude the player has no skill."
        ],
        correctAnswer: "Treat the streak as interesting, but not automatically predictive.",
        explanation: "This avoids illusory correlation by acknowledging the streak without falsely assuming it dictates the next outcome."
      },
      {
        questionText: "What is the main lesson from the original hot-hand research?",
        options: [
          "Streaks never happen in sports.",
          "People often see more pattern in streaks than the data supports.",
          "Basketball outcomes are fully random.",
          "Shooters never improve during games."
        ],
        correctAnswer: "People often see more pattern in streaks than the data supports.",
        explanation: "The original 1985 study found no reliable relationship between streaks and the next shot's success, highlighting our tendency to over-detect patterns."
      },
      {
        questionText: "Why are streaks so easy to misread?",
        options: [
          "Random sequences can naturally produce runs that look meaningful.",
          "Streaks only happen when someone is cheating.",
          "Fans are always wrong about everything.",
          "Pattern recognition is useless in daily life."
        ],
        correctAnswer: "Random sequences can naturally produce runs that look meaningful.",
        explanation: "Because our brains are wired to spot patterns, we often misinterpret clusters that arise from pure chance as meaningful signals."
      },
      {
        questionText: "Why did later researchers re-examine the hot-hand effect?",
        options: [
          "To test whether earlier methods may have missed something small or context-dependent.",
          "To prove that all streaks are false.",
          "To remove basketball from statistical analysis.",
          "To show that intuition is always superior to data."
        ],
        correctAnswer: "To test whether earlier methods may have missed something small or context-dependent.",
        explanation: "Later research using more advanced methods (like in 2014) found that small hot-hand effects might exist, prompting a reevaluation."
      },
      {
        questionText: "If a player has made three shots in a row, what is the safest coaching decision?",
        options: [
          "Feed that player every time, regardless of matchup.",
          "Base the next possession on the actual game situation, not the streak alone.",
          "Never pass to that player again.",
          "Assume the next shot is predetermined."
        ],
        correctAnswer: "Base the next possession on the actual game situation, not the streak alone.",
        explanation: "Relying purely on a perceived hot hand (illusory correlation) is less effective than analyzing the objective strategic situation."
      },
      {
        questionText: "A roulette wheel lands on red four times in a row. What should a careful observer remember?",
        options: [
          "The wheel is definitely biased.",
          "A random process can still produce streaks.",
          "Red is now more likely because it has been absent.",
          "The streak proves the next outcome."
        ],
        correctAnswer: "A random process can still produce streaks.",
        explanation: "Just like the hot hand illusion, a streak of the same outcome can happen entirely by chance in a random process."
      },
      {
        questionText: "Why can expert players still believe in the hot hand?",
        options: [
          "Experience guarantees immunity from bias.",
          "Repeated exposure to streaks can make patterns feel real even when they are not reliable.",
          "They never see enough shots to judge.",
          "Coaches teach them to ignore all statistics."
        ],
        correctAnswer: "Repeated exposure to streaks can make patterns feel real even when they are not reliable.",
        explanation: "Our deeply ingrained pattern-recognition systems can create strong feelings of illusory correlation, even for experts observing thousands of events."
      },
      {
        questionText: "What is the most reasonable way to think about a short streak of success?",
        options: [
          "As proof that a hidden force has changed the outcome.",
          "As something that may reflect skill, chance, or both, depending on context.",
          "As a meaningless event that should always be ignored.",
          "As a guarantee of future performance."
        ],
        correctAnswer: "As something that may reflect skill, chance, or both, depending on context.",
        explanation: "It avoids jumping to absolute conclusions, recognizing that streaks can arise from randomness or minor skill fluctuations."
      },
      {
        questionText: "A broadcaster wants to talk about a player who has made several shots in a row. Which framing is best?",
        options: [
          "“This player is unstoppable now.”",
          "“The streak is notable, but it does not necessarily predict the next shot.”",
          "“The data proves the next shot will miss.”",
          "“The streak tells us everything we need to know.”"
        ],
        correctAnswer: "“The streak is notable, but it does not necessarily predict the next shot.”",
        explanation: "This correctly acknowledges the event without falling prey to illusory correlation."
      },
      {
        questionText: "What is the core idea behind illusory correlation?",
        options: [
          "People always prefer statistics over observation.",
          "People can see a connection between events even when the connection is weak or absent in the data.",
          "All correlations are fake.",
          "Randomness cannot produce patterns."
        ],
        correctAnswer: "People can see a connection between events even when the connection is weak or absent in the data.",
        explanation: "This defines illusory correlation: perceiving a meaningful relationship where the data shows none."
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
