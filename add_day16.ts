import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 16;
  const tag = "Week 3"; // Or whichever week, we'll leave it as is or default

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>You get a 5% raise this year — more than inflation, more than last year's raise — and still feel disappointed. Then you learn a coworker with the same job got 8%. That number, not your own raise, is now the only one that matters to you.</p>

<p>This is the power of <strong>reference points</strong>: economic outcomes aren't judged in isolation, they're judged against whatever comparison feels most relevant — a past salary, a peer's salary, an expectation set by a promise, or an industry average. Kahneman and Tversky's prospect theory built this reference-dependence into the core of how people evaluate outcomes: the same $70,000 salary can feel like a triumph or a failure depending entirely on what number sits next to it in someone's head.</p>

<p>Imagine two employees, both earning $70,000. One previously earned $50,000 and expected to stay there for years. The other previously earned $90,000 and just took what feels like a demotion in pay. Same salary, same job, opposite emotional reactions — because each person's reference point sits in a completely different place.</p>

<p>Reference points aren't fixed. They shift with expectations, past experience, and the visibility of what other people are earning. That shift is exactly the tension Norwegian employers ran into once salary transparency made peer comparison unavoidable for an entire country at once.</p>`;

  const conceptSummary = `Reference points are the comparison points people use to judge whether an outcome feels good or bad — a past salary, a peer's salary, or an expectation. The same absolute number can feel like a win or a loss depending entirely on what it's compared against. This reference-dependence is central to prospect theory and explains why raises, prices, and results are judged relative to a benchmark, not in isolation.`;

  const conceptTakeaways = [
    "Reference points are the benchmarks — past experience, peer outcomes, expectations — against which people judge whether an outcome feels good or bad.",
    "The same absolute number (like a salary) can feel completely different depending on which reference point it's compared against.",
    "Reference points can be a person's own past outcome, a peer's outcome, or a stated expectation.",
    "Prospect theory treats reference-dependence as central to how people evaluate gains and losses, not just the final number itself.",
    "Making comparisons more visible (such as salary transparency) can change how satisfied people feel with an identical outcome."
  ];

  const articleTitle = "Why Employees React Differently to Salaries When They Compare Themselves to Others (Norway)";
  
  const articleText = `<p>Norway publishes almost every citizen's income and tax records for anyone to search online. <strong>So why do Norwegian employees still report similar, or even lower, salary satisfaction compared to countries with total pay secrecy?</strong><br>
Because transparency doesn't remove reference points — it multiplies them. Once every coworker's exact salary is one search away, an employee's own raise stops being judged against last year's paycheck and starts being judged against everyone else's this year.</p>

<p><strong>What exactly does Norway's public tax registry (skatteliste) show, and how long has some version of it existed?</strong><br>
Norway's tax authority publishes an online, searchable registry showing each taxpayer's declared income, wealth, and tax paid, a tradition rooted in Nordic norms of public accountability that predates the modern internet-era database launched in the early 2000s. Anyone with a name can look up almost anyone else's official numbers within seconds.</p>

<p><strong>Why did Norway add a notification feature in 2014 telling people who had searched their income, and what happened to search volume afterward?</strong><br>
In 2014, Norway changed the system so that anyone searching another person's tax records would be logged, and the person searched could see who had looked them up. Search volume reportedly dropped sharply almost immediately, even though the underlying income data remained just as public as before. People weren't necessarily less curious about salaries — they were less willing to be seen comparing themselves to a colleague.</p>

<p><strong>If two Norwegian teachers earn identical salaries, why might one feel content and the other feel underpaid?</strong><br>
Because their reference points differ. A teacher who recently moved from a lower-paying region, or who expected teaching to pay less than it does, judges the same salary as generous. A teacher who compares themselves to a friend in the private sector, or to a colleague with slightly more seniority earning marginally more, judges the identical number as a shortfall. Norway's transparency doesn't change the salary. It changes which comparison feels unavoidable.</p>

<p><strong>Does salary transparency make people happier with fair pay, or more aware of unfair pay?</strong><br>
Evidence from transparency research, including studies following Norway's registry, suggests transparency tends to increase dissatisfaction among people who earn less than visible peers by a larger margin than it increases satisfaction among people who earn more. The pain of an unfavorable comparison outweighs the pleasure of a favorable one — the same asymmetry that shows up in loss aversion more broadly.</p>

<p><strong>What does Norway's experience suggest about a raise that looks generous on paper?</strong><br>
That a raise's size alone doesn't determine how it feels. A 5% raise announced in isolation might satisfy an employee completely — until they learn, in a system where that information is one search away, that a peer with the same title received 8%. The number on the paycheck didn't get smaller. The reference point next to it just moved.</p>`;

  const articleSummary = `Norway's public tax registry lets anyone search a colleague's exact salary, yet employees don't report proportionally higher pay satisfaction. Transparency doesn't remove reference points — it multiplies them, letting people compare their own raise against a specific peer's number instead of their own past salary. The 2014 search-log feature caused lookups to drop sharply, even though the underlying data stayed public, showing people cared less about knowing than about being seen comparing.`;

  const articleTakeaways = [
    "Norway's public tax registry lets anyone search another citizen's declared income, a system rooted in Nordic transparency norms.",
    "In 2014, Norway began logging who searched whose records, and search volume dropped sharply even though the data itself remained public.",
    "Identical salaries can produce different satisfaction levels depending entirely on each person's individual reference point.",
    "Research suggests unfavorable pay comparisons hurt satisfaction more than favorable comparisons help it — the same asymmetry seen in loss aversion.",
    "A raise's absolute size doesn't determine satisfaction; the visibility of a relevant comparison point does."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Why We Judge Results Compared to a Starting Point",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
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
        questionText: "What does it mean for an outcome to be \"reference-dependent\"?",
        options: [
          "The outcome's value is fixed regardless of comparison",
          "The perceived value of an outcome depends on the benchmark it's compared against, not on its absolute size alone",
          "Only wealthy people experience reference-dependent judgments",
          "Reference points never change over a person's lifetime"
        ],
        correctAnswer: "The perceived value of an outcome depends on the benchmark it's compared against, not on its absolute size alone",
        explanation: "Outcomes are evaluated based on where they stand relative to a reference point, not just their standalone magnitude."
      },
      {
        questionText: "Based on the Norway case, what does the sharp drop in salary searches after the 2014 notification change suggest about people's motivation for looking up others' income?",
        options: [
          "People stopped caring about salary comparisons entirely",
          "People were less willing to be seen making the comparison, even though their underlying curiosity about relative pay likely remained",
          "The tax registry was shut down in 2014",
          "Norwegian salaries became equal after 2014"
        ],
        correctAnswer: "People were less willing to be seen making the comparison, even though their underlying curiosity about relative pay likely remained",
        explanation: "The data was still there, but the social cost of being seen checking others' salaries discouraged people from doing it."
      },
      {
        questionText: "Why can salary transparency increase dissatisfaction among lower earners more than it increases satisfaction among higher earners?",
        options: [
          "Because transparency always benefits high earners",
          "Because unfavorable comparisons tend to produce a stronger negative reaction than favorable comparisons produce positive ones, mirroring the general asymmetry between losses and gains",
          "Because lower earners are less rational than higher earners",
          "Because transparency laws specifically target low earners"
        ],
        correctAnswer: "Because unfavorable comparisons tend to produce a stronger negative reaction than favorable comparisons produce positive ones, mirroring the general asymmetry between losses and gains",
        explanation: "Loss aversion indicates that negative deviations from a reference point (e.g., finding out you earn less) hurt more than positive deviations feel good."
      },
      {
        questionText: "Two people receive the same raise, but only one feels satisfied. What does this best illustrate about reference points?",
        options: [
          "Reference points are irrelevant once the raise amount is fixed",
          "Reference points vary between individuals, so identical objective outcomes can produce different subjective reactions",
          "Satisfaction is purely a function of raise size, with no room for other comparisons",
          "Only the size of the company affects satisfaction with a raise"
        ],
        correctAnswer: "Reference points vary between individuals, so identical objective outcomes can produce different subjective reactions",
        explanation: "One person's reference point could be their past salary, while another's could be a coworker's larger raise."
      },
      {
        questionText: "You're an HR manager introducing pay transparency at your company. Based on the concept of reference points, what should you anticipate as the most likely challenge?",
        options: [
          "All employees will become equally satisfied once they see everyone's pay",
          "Employees earning less than visible peers in similar roles are likely to become more dissatisfied, even if their own pay hasn't changed",
          "Transparency will have no measurable effect on morale",
          "Only executives will be affected by the new policy"
        ],
        correctAnswer: "Employees earning less than visible peers in similar roles are likely to become more dissatisfied, even if their own pay hasn't changed",
        explanation: "Exposing pay data changes employees' reference points from their past salary to their peers' salaries, often leading to dissatisfaction."
      },
      {
        questionText: "You're negotiating your own salary and your manager offers a 6% raise, calling it \"well above the company average of 3%.\" Based on reference points, why might this framing increase your satisfaction compared to simply hearing \"you'll now earn $53,000\"?",
        options: [
          "Because $53,000 is always a less meaningful number than a percentage",
          "Because comparing your raise to the company average gives you a favorable reference point, making the same raise feel more generous",
          "Because percentages are mathematically larger than dollar amounts",
          "Because your manager is legally required to disclose the average"
        ],
        correctAnswer: "Because comparing your raise to the company average gives you a favorable reference point, making the same raise feel more generous",
        explanation: "The 3% average acts as a reference point; beating it feels like a \"gain\" in relative terms."
      },
      {
        questionText: "A company gives every employee an identical 4% raise. Based on the concept of reference points, why might reactions to this raise still vary widely across the company?",
        options: [
          "Because 4% is mathematically ambiguous",
          "Because employees compare the raise to different reference points — their own expectations, past raises, or specific peers — not to the raise in isolation",
          "Because only senior employees notice raises",
          "Because 4% raises are illegal in some industries"
        ],
        correctAnswer: "Because employees compare the raise to different reference points — their own expectations, past raises, or specific peers — not to the raise in isolation",
        explanation: "People don't evaluate the 4% in a vacuum; they evaluate it against what they expected or what others got."
      },
      {
        questionText: "A country moves from a system with no salary transparency to one with full public salary disclosure, similar to Norway's. Based on the research described in this lesson, what is the most likely net effect on average reported job satisfaction, all else being equal?",
        options: [
          "A large, uniform increase in satisfaction across all income levels",
          "A modest negative or neutral shift in average satisfaction, since unfavorable comparisons tend to weigh more heavily than favorable ones",
          "No possible effect, since salary and satisfaction are unrelated",
          "A guaranteed doubling of reported satisfaction"
        ],
        correctAnswer: "A modest negative or neutral shift in average satisfaction, since unfavorable comparisons tend to weigh more heavily than favorable ones",
        explanation: "Because negative comparisons hurt more than positive ones help, the net effect of widespread transparency is often a decrease in overall satisfaction."
      },
      {
        questionText: "An employee who moved from a low-paying nonprofit job to a mid-level corporate role feels thrilled with their new salary, while a colleague hired at the identical salary from a higher-paying competitor feels shortchanged. What single factor best explains the difference?",
        options: [
          "The nonprofit employee is simply more grateful by nature",
          "Each employee is comparing the identical salary to a different personal reference point (their prior pay)",
          "The corporate role must actually pay each employee a different amount",
          "Reference points do not apply to salary comparisons, only to prices"
        ],
        correctAnswer: "Each employee is comparing the identical salary to a different personal reference point (their prior pay)",
        explanation: "Their prior salaries set vastly different reference points, making the new absolute salary feel like a gain for one and a loss for the other."
      },
      {
        questionText: "If a government wanted to reduce reference-point-driven dissatisfaction after introducing salary transparency, which approach is most consistent with the concept covered in this lesson?",
        options: [
          "Publish salaries but provide context (e.g., experience, tenure, role differences) so raw number comparisons are less likely to feel like unfair losses",
          "Publish salaries with no context at all, to maximize direct comparison",
          "Remove salary transparency entirely, since no other approach could help",
          "Require all salaries in the country to be identical"
        ],
        correctAnswer: "Publish salaries but provide context (e.g., experience, tenure, role differences) so raw number comparisons are less likely to feel like unfair losses",
        explanation: "Providing context helps adjust the reference points so employees are less likely to make apples-to-oranges comparisons that lead to dissatisfaction."
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
