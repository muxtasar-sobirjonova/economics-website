import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 11;
  const tag = "Week 2";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>A patient tests positive for a rare disease on a screening that is 99% accurate. Doctor and patient both assume the odds of actually having the disease must be close to 99%. In most real-world screening scenarios, the true probability is closer to 10% — sometimes far lower, even though the test performed exactly as advertised.</p>

<p>This gap exists because of base rate neglect: the tendency to ignore how rare or common something is in the overall population and focus only on the accuracy of the test in front of you. Psychologist Amos Tversky, working alongside Daniel Kahneman, showed that people routinely substitute a vivid, specific number (test accuracy) for a boring, structural one (how common the condition actually is) — even though the boring number often matters more to the final answer.</p>

<p>Imagine a disease that affects 1 in 1,000 people, tested with a tool that's 99% accurate. Out of 1,000 people, roughly 1 person has the disease and tests positive. But the test also produces false positives on about 10 of the 999 healthy people. Suddenly, 10 of the 11 positive results are wrong — even though the test itself is excellent by any normal standard.</p>

<p>The accuracy of a test and the reliability of a positive result are two completely different numbers, and only one of them depends on how rare the disease actually is. Which one should a frightened patient actually trust?</p>`;

  const conceptSummary = `Base rate neglect happens when people ignore how common or rare something is and focus only on a test's accuracy. A 99%-accurate test can still produce mostly false positives if the underlying disease is rare, because the small pool of true cases gets swamped by false alarms from the much larger healthy population. Accuracy and reliability are not the same number.`;

  const conceptTakeaways = [
    "Base rate neglect is the tendency to ignore how common a condition is in the population when judging the meaning of a test result.",
    "A test can be 99% accurate and still be wrong most of the time when applied to a rare condition.",
    "False positives accumulate from the large healthy population, even when the false-positive rate itself is low.",
    "Test accuracy and result reliability are different numbers — one measures the test, the other measures what a specific result actually tells you.",
    "Ignoring base rates leads to systematically overestimating risk after a single positive result."
  ];

  const articleTitle = "The False Positive Problem in Medical Testing";
  
  const articleText = `<p><strong>"Why can a highly accurate test still produce wrong conclusions?"</strong></p>

<p>A test is 90% accurate — so why did a major U.S. health task force say a positive mammogram is right far less often than that number suggests? In November 2009, the U.S. Preventive Services Task Force (USPSTF) recommended that women without unusual risk factors delay routine mammograms until age 50 instead of 40. The backlash was immediate — cancer charities, doctors, and patients accused the task force of downplaying early detection. But buried in the task force's reasoning was a statistical problem most critics never addressed: the accuracy of a mammogram and the reliability of a single positive result are two different numbers entirely.</p>

<p>What did the guideline change actually say, and why did it outrage so many people? The task force wasn't arguing mammograms don't work. It was arguing that starting routine screening at 40 produced too many false alarms relative to lives saved, because breast cancer is far less common in a woman's 40s than in her 50s and beyond. Critics heard "delay screening" and assumed the task force was gambling with lives. Few noticed the argument rested on base rates, not on doubting the test itself.</p>

<p>How does base rate neglect explain why a 90%-accurate test can still be wrong most of the time? Picture 1,000 women in their 40s getting screened, in a population where roughly 1 in 100 has undetected breast cancer. A mammogram with 90% sensitivity correctly flags about 9 of those 10 true cases. But the test also carries a false-positive rate of roughly 9%, meaning it wrongly flags around 89 of the 990 healthy women. That's 89 false alarms against 9 real catches — meaning a random positive result is wrong far more often than it's right, even though the test performed exactly as advertised.</p>

<p>Why do even trained doctors fall for this same mistake? Researcher Gerd Gigerenzer tested this exact scenario on practicing physicians and found most badly overestimated the odds that a positive mammogram meant cancer — some guessing well above the true figure. Doctors weren't ignoring their training; they were doing what everyone does, treating the test's accuracy as if it were the whole answer, instead of one ingredient in a longer calculation that also needs prevalence.</p>

<p>What would have to change about a disease's prevalence for a positive test to become genuinely trustworthy? As prevalence rises, so does the reliability of a positive result — which is exactly why the same mammogram becomes far more trustworthy for a 60-year-old patient than a 40-year-old one. The test doesn't change. The population being tested does. That single shift in prevalence is a core reason the USPSTF drew the age line where it did.</p>

<p>If accurate tests can still mislead, why do we keep testing at all? Because screening isn't meant to deliver a verdict on its own — it's meant to narrow down who needs a second, more precise test. A positive mammogram isn't a diagnosis. It's an invitation to look closer, in a population where most of those invitations, statistically, will turn out to be false alarms.</p>`;

  const articleSummary = `A test can be highly accurate and still produce mostly false results when applied to a rare condition. The 2009 mammography guideline debate showed that a 90%-accurate test, used on a low-prevalence population, generates far more false alarms than true detections. Reliability of a single result depends on prevalence, not just accuracy — a distinction even trained doctors often miss.`;

  const articleTakeaways = [
    "In 2009, the USPSTF cited base-rate-driven false alarms as a reason to delay routine mammograms from age 40 to 50.",
    "A test's sensitivity (accuracy) and the reliability of a positive result are different numbers driven by different factors.",
    "When a condition is rare, false positives from the much larger healthy population can outnumber true positives even with a highly accurate test.",
    "Researcher Gerd Gigerenzer found that practicing physicians routinely overestimated the odds a positive test meant disease.",
    "A positive screening result should trigger further testing, not immediate certainty, because prevalence — not just test accuracy — determines how much to trust it."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Why People Misunderstand Risk",
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
        questionText: "A test result comes back positive for a rare condition. What is the most useful next question to ask?",
        options: [
          "How accurate is the test in general?",
          "How common is the condition in this population?",
          "How expensive was the test?",
          "Who created the test?"
        ],
        correctAnswer: "How common is the condition in this population?",
        explanation: "Because of base rate neglect, the rarity of the condition often has a greater impact on the reliability of the result than the test's accuracy."
      },
      {
        questionText: "Why can a very good test still produce misleading results?",
        options: [
          "Because no test can be used more than once",
          "Because the number of healthy people can be much larger than the number of sick people",
          "Because patients always misunderstand medical language",
          "Because all tests are equally unreliable"
        ],
        correctAnswer: "Because the number of healthy people can be much larger than the number of sick people",
        explanation: "When a condition is rare, the small false-positive rate applies to a huge population of healthy people, generating many false alarms."
      },
      {
        questionText: "What does a positive result really tell you on its own?",
        options: [
          "The person definitely has the condition",
          "The person may need more testing, depending on how common the condition is",
          "The test must be wrong",
          "The diagnosis is already complete"
        ],
        correctAnswer: "The person may need more testing, depending on how common the condition is",
        explanation: "A positive screening test isn't a final diagnosis; it is an indication to investigate further, especially if the condition is rare."
      },
      {
        questionText: "A doctor sees a positive screen and immediately assumes the disease is likely. What important factor may have been overlooked?",
        options: [
          "The patient’s favorite treatment",
          "The disease’s prevalence in the tested group",
          "The name of the hospital",
          "The cost of follow-up care"
        ],
        correctAnswer: "The disease’s prevalence in the tested group",
        explanation: "Doctors often suffer from base rate neglect, overlooking how rare the disease is, which drastically affects the reliability of a positive result."
      },
      {
        questionText: "Why do false positives become a bigger issue when a condition is rare?",
        options: [
          "Because rare conditions are harder to name",
          "Because even a small error rate can affect many healthy people",
          "Because rare conditions cannot be tested",
          "Because the test changes for different patients"
        ],
        correctAnswer: "Because even a small error rate can affect many healthy people",
        explanation: "A small false positive percentage (e.g., 1%) of a very large healthy population will yield a high number of false positives."
      },
      {
        questionText: "If two groups take the same test, but one group has a much higher rate of the disease, what is likely true?",
        options: [
          "A positive result is more believable in the higher-risk group",
          "A positive result means the same thing in both groups",
          "The test stops working in the higher-risk group",
          "The lower-risk group will always have fewer positives overall"
        ],
        correctAnswer: "A positive result is more believable in the higher-risk group",
        explanation: "Higher prevalence (base rate) means the pool of true positives is larger compared to the false positives, making the result more reliable."
      },
      {
        questionText: "Which interpretation is the safest after a single positive screening result?",
        options: [
          "Treat it as final proof",
          "Consider it an early warning, not the whole answer",
          "Ignore it completely",
          "Assume the test provider made a mistake"
        ],
        correctAnswer: "Consider it an early warning, not the whole answer",
        explanation: "Screenings are designed to narrow down who needs more precise testing, not to provide definitive answers."
      },
      {
        questionText: "A company uses a “98% accurate” fraud filter on millions of transactions, but fraud is very rare. What is a likely outcome?",
        options: [
          "Most flagged cases may still be false alarms",
          "Almost every flagged case will be fraud",
          "The system will stop flagging transactions",
          "Accuracy will become 100%"
        ],
        correctAnswer: "Most flagged cases may still be false alarms",
        explanation: "Just like in medical testing, a rare event (fraud) means the 2% false positive rate applies to millions of legitimate transactions, leading to many false alarms."
      },
      {
        questionText: "Why do people sometimes overreact to a positive result?",
        options: [
          "They focus on the test’s success rate and forget the background rate",
          "They always dislike uncertainty",
          "They assume all tests are random",
          "They believe every result is caused by the same thing"
        ],
        correctAnswer: "They focus on the test’s success rate and forget the background rate",
        explanation: "This is the essence of base rate neglect: people substitute the vivid test accuracy for the underlying prevalence."
      },
      {
        questionText: "What is the main lesson from base rate neglect?",
        options: [
          "A good test always gives a trustworthy answer",
          "The meaning of a result depends on both the test and how common the condition is",
          "Rare conditions should never be tested for",
          "Doctors should ignore test results"
        ],
        correctAnswer: "The meaning of a result depends on both the test and how common the condition is",
        explanation: "To interpret a test correctly, you must account for both the test's accuracy and the base rate of the condition in the population."
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
