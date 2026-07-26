import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 11;
  const track = Track.DEVELOPMENT_ECONOMICS;
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
    title: 'Why Some Countries Never Catch Up',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `Until the 1930s, the French had a phrase for describing someone foolishly, extravagantly rich: "riche comme un Argentin" — rich as an Argentine. In 1913, Argentina's income per person surpassed France's and Germany's, placing it among the ten wealthiest countries on Earth.

The convergence hypothesis predicts that poorer countries should generally catch up to richer ones over time, since scarce capital produces outsized returns on new investment. Argentina's story is the reason economists never treat that prediction as a guarantee. The convergence hypothesis describes an opportunity created by scarce capital — it says nothing about whether a country's institutions, politics, and policy choices will let that opportunity actually convert into sustained growth. A country can have every arithmetic advantage the model assumes and still fail to claim it, if the surrounding conditions keep interrupting the process before it compounds.

*Rich once is not the same as rich twice.*

Argentina is the case economists reach for precisely because it moved in the opposite direction from Japan and South Korea: a country that started near the top of the world income ladder and spent the following century sliding down it, not up. The article ahead follows that century-long slide, and the recurring interruptions that kept a genuinely wealthy nation from staying that way.`,
    conceptSummary: `The convergence hypothesis predicts poorer countries should generally catch up to richer ones, but this describes an opportunity created by scarce capital, not a guarantee. Whether that opportunity converts into sustained growth depends on institutions, politics, and policy stability — conditions Argentina's history shows can repeatedly interrupt convergence even when a country starts from genuine wealth.`,
    conceptTakeaways: [
      "The convergence hypothesis describes an opportunity created by scarce capital, not a guarantee — institutions and policy stability determine whether that opportunity is actually realized.",
      "Argentina's 1913 per capita income surpassed France's and Germany's, placing it among the world's ten richest countries, reflected in the French phrase \"riche comme un Argentin.\""
    ],
    articleTitle: 'The Country That Went Down Instead of Up',
    articleText: `**How did a South American agricultural powerhouse become one of the ten richest nations on Earth?**
By 1913, Argentina's per capita income was estimated at roughly 3,797 dollars in 1990 international currency — ahead of France's 3,452 and Germany's 3,134, and within reach of Canada's and Switzerland's. Vast agricultural exports of grain, meat, wool, and leather, financed by large inflows of foreign capital, had turned the country into one of the ten richest in the world. Buenos Aires built opera houses and boulevards to match Paris. For close to sixty years, from the 1853 constitution onward, Argentina had converged upward, exactly the way the model predicts a resource-rich, capital-scarce economy should.

**Why did a nation richer than France and Germany spend the next century sliding backward?**
Then convergence reversed, and it never fully resumed. By 1929, Argentina still clung to the edge of the world's richest club, but the ground was already shifting beneath it. Historians dispute the exact turning point — some point to the Great Depression, others to a slower unraveling that began even earlier — but there is little dispute about the destination. By 1975, Argentina's income had slipped to roughly 60% of France's, a country it had outearned just over sixty years before. While the rich nations that stayed in the "convergence club" roughly quadrupled their incomes across the twentieth century, Argentina took until the year 2000 to simply return to a relative position it had already surpassed decades earlier.

**Can a single bad leader destroy a century of economic advantage?**
The pattern repeats in a way no single policy failure fully explains, which is exactly what makes Argentina's case so instructive. Juan Perón's rise to power brought populist redistribution policies, expanded state control over production and pricing, and a steady erosion of the institutional checks that might otherwise have disciplined the spending that followed. Many economists point to this shift as accelerating the decline, even if it didn't originate it, proving that reversing a nation's trajectory is often the result of systemic institutional erosion rather than one isolated mistake.

**What happens when a country rewrites its economic rules faster than investors can adapt?**
What followed over the ensuing decades was a country whose economic policy rarely stayed consistent for long. Nationalizations were followed by privatizations, and fixed exchange rates were followed by currency collapses. A hyperinflation crisis in 1989 saw prices rise by roughly 3,000% in a single year, paired with sovereign debt defaults in 1982, 2001, 2014, and 2020. This pattern of constant interruption gave capital and businesses little reason to plan on a multi-decade horizon, no matter how favorable the underlying arithmetic of catching up might have looked on paper.

**Why did South Korea succeed with fewer natural resources while Argentina stumbled with abundance?**
Contrast this with the arithmetic South Korea followed in the same decades: a currency that held its value long enough for savers to trust it, an export strategy that survived multiple changes in government essentially intact, and creditors willing to keep lending because the previous decade's debts had actually been honored. Argentina had more fertile land, a smaller population to support, and a head start measured in decades. What Korea had that Argentina's investors couldn't rely on was continuity: the reasonable expectation that the rules governing an investment in year one would still resemble the rules in year twenty.

**Is the economic promise of catching up a guarantee, or just a fragile opportunity?**
This is the missing half of the convergence story. The Solow model's prediction that capital-scarce economies should grow quickly assumes that savings get invested, that investment gets protected long enough to compound, and that policy stays stable enough for both to happen repeatedly across decades. Convergence isn't canceled by a single bad year or a single bad president. It's canceled by the accumulated effect of a country's institutions rewriting the rules faster than any investment can outlast them.`,
    articleSummary: `Argentina ranked among the world's ten richest countries by 1913, ahead of France and Germany, then spent the following century sliding down the income ladder instead of up it, falling to 60% of France's income by 1975. Recurring instability — Perón-era populism, hyperinflation reaching roughly 3,000% in 1989, and sovereign defaults in 1982, 2001, 2014, and 2020 — repeatedly interrupted the investment convergence requires to compound over time.`,
    articleTakeaways: [
      "By 1975, Argentina's income had fallen to roughly 60% of France's, a country it had outearned six decades earlier, and it took until 2000 to recover a relative position it had already held before.",
      "Argentina experienced a hyperinflation crisis in 1989 with prices rising roughly 3,000% in a single year, alongside sovereign debt defaults in 1982, 2001, 2014, and 2020.",
      "Convergence requires savings to be invested and that investment to be protected long enough to compound across decades — repeated policy instability can cancel the arithmetic advantage a capital-scarce economy would otherwise have."
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
        questionText: "What does Argentina's economic history demonstrate about the convergence hypothesis?",
        options: [
          "That convergence always happens automatically for any country, regardless of policy",
          "That convergence describes an opportunity created by scarce capital, which institutions and policy stability can prevent from being realized",
          "That only countries with no natural resources can converge",
          "That convergence is impossible for any country that starts out wealthy"
        ],
        correctAnswer: "That convergence describes an opportunity created by scarce capital, which institutions and policy stability can prevent from being realized",
        explanation: "- a) Wrong — Argentina's case is used specifically to show convergence is not automatic.\\n- c) Wrong — Argentina had abundant agricultural resources; resource scarcity isn't the lesson's point.\\n- d) Wrong — the lesson describes divergence (falling behind), not an inherent inability of wealthy countries to converge further."
      },
      {
        questionText: "What was notable about Argentina's per capita income in 1913?",
        options: [
          "It was among the lowest in the world",
          "It surpassed France's and Germany's, placing Argentina among the world's ten richest countries",
          "It was roughly equal to the poorest countries in Africa at the time",
          "It had no meaningful international ranking data available"
        ],
        correctAnswer: "It surpassed France's and Germany's, placing Argentina among the world's ten richest countries",
        explanation: "- a) Wrong — this is the opposite of what the lesson describes for 1913.\\n- c) Wrong — the lesson describes Argentina's income as comparable to or exceeding several European nations, not among the poorest.\\n- d) Wrong — the lesson cites specific comparative income figures for this period."
      },
      {
        questionText: "What happened to Argentina's income relative to France's by 1975?",
        options: [
          "It had grown to double France's income",
          "It had fallen to roughly 60% of France's income",
          "It remained exactly equal to France's income",
          "France's economy had collapsed entirely"
        ],
        correctAnswer: "It had fallen to roughly 60% of France's income",
        explanation: "- a) Wrong — this is the opposite of the described decline.\\n- c) Wrong — the lesson explicitly describes a significant relative decline, not equality.\\n- d) Wrong — the lesson describes Argentina's relative decline, not a French economic collapse."
      },
      {
        questionText: "According to the lesson, what role did Juan Perón's rise to power play in Argentina's decline?",
        options: [
          "It had no economic effect of any kind",
          "It brought populist redistribution and expanded state control that many economists point to as accelerating the decline, even though it didn't originate it",
          "It single-handedly caused the entire hundred-year decline with no other contributing factors",
          "It immediately reversed Argentina's economic troubles"
        ],
        correctAnswer: "It brought populist redistribution and expanded state control that many economists point to as accelerating the decline, even though it didn't originate it",
        explanation: "- a) Wrong — the lesson describes specific economic policy changes under Perón with real consequences.\\n- c) Wrong — the lesson explicitly frames Perón's policies as accelerating, not solely causing, a longer decline.\\n- d) Wrong — the lesson describes Perón-era policies as contributing to instability, not resolving it."
      },
      {
        questionText: "What happened during Argentina's 1989 hyperinflation crisis?",
        options: [
          "Prices fell by roughly 3,000% in a single year",
          "Prices rose by roughly 3,000% in a single year",
          "Prices remained completely stable",
          "The currency was replaced by a foreign currency permanently with no further issues"
        ],
        correctAnswer: "Prices rose by roughly 3,000% in a single year",
        explanation: "- a) Wrong — hyperinflation means a sharp price increase, not a decrease.\\n- c) Wrong — the lesson describes an extreme instance of price instability, not stability.\\n- d) Wrong — the lesson doesn't describe a single permanent currency replacement resolving the issue at this point."
      },
      {
        questionText: "How many sovereign debt defaults does the lesson attribute to Argentina across the described period?",
        options: [
          "None",
          "Exactly one, in 1982 only",
          "Multiple defaults, including 1982, 2001, 2014, and 2020",
          "Defaults occurring every single year without exception"
        ],
        correctAnswer: "Multiple defaults, including 1982, 2001, 2014, and 2020",
        explanation: "- a) Wrong — the lesson explicitly lists multiple specific default years.\\n- b) Wrong — the lesson lists additional defaults beyond 1982.\\n- d) Wrong — the lesson lists specific years, not an unbroken annual pattern."
      },
      {
        questionText: "An investor is deciding whether to make a decade-long infrastructure investment in a country with a history of repeated currency collapses and sovereign defaults, similar to Argentina's pattern. Based on the lesson, what is the most directly supported concern?",
        options: [
          "The investment is guaranteed to succeed regardless of policy history",
          "Repeated instability could interrupt the investment before it has time to compound, similar to how Argentina's cycles undermined its own convergence",
          "Policy history has no bearing on long-term investment outcomes",
          "Only agricultural investments are affected by currency instability"
        ],
        correctAnswer: "Repeated instability could interrupt the investment before it has time to compound, similar to how Argentina's cycles undermined its own convergence",
        explanation: "- a) Wrong — the lesson explicitly shows how repeated instability undermined long-term investment outcomes in Argentina's case.\\n- c) Wrong — the lesson directly connects policy instability to Argentina's failure to sustain convergence.\\n- d) Wrong — the lesson describes instability affecting the broader economy, not agriculture exclusively."
      },
      {
        questionText: "A economist is comparing South Korea's convergence success to Argentina's divergence and is asked to identify the single most important shared factor distinguishing the two cases. Based on the lessons, what is the most defensible answer?",
        options: [
          "Natural resource abundance, since Korea had more resources than Argentina",
          "Policy and institutional stability sustained over decades, allowing investment to compound in Korea's case while repeated instability interrupted it in Argentina's",
          "Population size, since larger populations always converge faster",
          "Climate, since warmer countries always experience more divergence"
        ],
        correctAnswer: "Policy and institutional stability sustained over decades, allowing investment to compound in Korea's case while repeated instability interrupted it in Argentina's",
        explanation: "- a) Wrong — the lesson on Korea does not attribute its success to superior natural resources; if anything, Argentina had greater agricultural resource wealth.\\n- c) Wrong — population size is not identified as the distinguishing factor in either lesson.\\n- d) Wrong — climate is not discussed as a factor in either lesson."
      },
      {
        questionText: "Why does the lesson state that convergence is \"canceled by the accumulated effect\" of unstable institutions, rather than by any single bad year or policy?",
        options: [
          "Because a single bad year always permanently ends convergence for any country",
          "Because the damage to sustained investment comes from repeated interruptions over time, not from any one isolated event",
          "Because institutions have no real effect on economic outcomes",
          "Because convergence, once achieved, can never be reversed by any cause"
        ],
        correctAnswer: "Because the damage to sustained investment comes from repeated interruptions over time, not from any one isolated event",
        explanation: "- a) Wrong — the lesson specifically argues against attributing the decline to a single event.\\n- c) Wrong — the lesson directly attributes Argentina's divergence to institutional and policy instability.\\n- d) Wrong — the lesson's entire point is that convergence can, in fact, be reversed, as Argentina's case shows."
      },
      {
        questionText: "Based on this lesson and the earlier lesson on South Korea, which factor would most likely determine whether a capital-scarce country experiences convergence or divergence over several decades?",
        options: [
          "Whether the country has agricultural exports available",
          "Whether the country can sustain stable savings, investment, and policy conditions long enough for capital to compound, regardless of its starting wealth",
          "Whether the country's population exceeds a certain fixed threshold",
          "Whether the country's currency has a fixed exchange rate at all times"
        ],
        correctAnswer: "Whether the country can sustain stable savings, investment, and policy conditions long enough for capital to compound, regardless of its starting wealth",
        explanation: "- a) Wrong — Argentina had abundant agricultural exports and still diverged, showing this alone isn't decisive.\\n- c) Wrong — neither lesson identifies a population threshold as the determining factor.\\n- d) Wrong — Argentina cycled through multiple exchange rate regimes; a fixed rate alone isn't shown as the determining factor."
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
