import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 9;
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
    title: 'Why More Investment Isn\'t Always Enough',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `In 2008, China needed about 2.84 yuan of new investment to generate one additional yuan of GDP growth. By 2023, that figure had climbed to 9.44 yuan for the same single yuan of growth — more than triple the capital required to produce an identical result, in the same economy, fifteen years apart.

This ratio is called the incremental capital-output ratio, and it measures exactly what the name suggests: how much new investment it takes to generate one more unit of output. A rising ratio is the numeric fingerprint of diminishing returns to capital — the same idea at the center of the Solow growth model, showing up not as an abstract curve on a chalkboard but as a real, worsening exchange rate between money spent and growth received.

*The tenth bridge doesn't carry the traffic the first one did.*

China's investment share of GDP rose from roughly 35% in 1980 to 47% by 2010, one of the highest sustained rates in modern economic history, and it built the country an extraordinary amount of real infrastructure: highways, high-speed rail, ports, and housing on a scale with almost no historical precedent. The mechanism that made the first decades of that investment so productive is the same mechanism now working in reverse. The article ahead follows that reversal into the country's own skylines.`,
    conceptSummary: `The incremental capital-output ratio measures how much new investment it takes to produce one additional unit of GDP growth. A rising ratio is the real-world signature of diminishing returns to capital: the same idea behind the Solow growth model, showing up as an increasingly expensive exchange rate between money invested and the growth that money actually delivers in return.`,
    conceptTakeaways: [
      "The incremental capital-output ratio measures how much new investment is required to produce one additional unit of GDP growth — a rising ratio signals diminishing returns to capital.",
      "China's incremental capital-output ratio rose from 2.84 in 2008 to 9.44 in 2023, meaning the same growth now requires more than triple the investment it once did."
    ],
    articleTitle: 'The Nine-Yuan Problem',
    articleText: `**How did China manage to build more infrastructure in a few decades than most countries build in a century?**
Real estate and infrastructure construction made up 31.7% of China's entire GDP in 2021, down only slightly from a peak of 34% in 2015. This was a share large enough that it exceeded the property-sector peaks reached in Spain and Ireland just before their own economies buckled in the 2008 financial crisis. Floor space per person more than doubled since 2010, reaching 49 square meters, putting it on par with France and the United Kingdom. Driven by massive state backing and local incentives, China built its way into modern infrastructure faster than almost any country in history had ever done it.

**Why did pouring money into concrete produce such spectacular economic growth in the beginning?**
For a long stretch, this construction boom was exactly the kind of investment the early Solow growth story predicts. A developing economy with relatively little existing capital gets an outsized return on each new factory, road, and apartment block. Because there is so little existing infrastructure already there to compete with it, every new project immediately satisfies a massive, pent-up demand, translating into massive, rapid economic growth and soaring productivity.

**Why does spending the exact same amount of money today generate less than a third of the growth it used to?**
Capital accumulation eventually runs into the same arithmetic everywhere it happens, and China's own government statisticians now track the proof. The incremental capital-output ratio — how many yuan of investment it takes to produce one additional yuan of GDP — rose from 2.84 in 2008 to 9.44 in 2023. This is the reality of diminishing returns: the easiest and most profitable projects are done first. Today, roughly the same growth that once cost under three yuan of investment now costs more than nine, as new projects struggle to find the same level of utility.

**What happens when local governments are forced to build cities for populations that aren't actually there?**
Much of this lost efficiency shows up geographically in a very specific place: China's smaller, less wealthy "tier 3" cities, home to hundreds of metro areas outside the wealthy coastal centers. Nearly 80% of the country's housing stock has been built in these cities, even though their populations have often grown slowly or shrunk, and their local governments still depend on land sales for close to half their revenue. The visible result is the widely nicknamed "ghost cities" — entire districts of finished apartment towers and malls with strikingly few residents to fill them, built to keep the construction growth engine running rather than to meet real demand.

**Are there historical precedents for a real estate boom dominating such a massive share of a country's economy?**
Economists studying the pattern point to a useful comparison: by 2021, real estate and infrastructure's 31.7% share of China's GDP already exceeded the property-sector peaks that preceded the 2008 financial crashes in Spain and Ireland. Those two economies had built housing stock well beyond what their populations could absorb before their own construction booms turned into construction busts. While China differs enormously in scale, financing structure, and state involvement, the comparison illustrates the same underlying arithmetic: an economy built on constructing more of the same asset eventually runs out of buyers before it runs out of capacity to build.

**Does a falling return on investment mean all those new roads and apartments were a complete waste of money?**
None of this means the investment produced nothing of value — roads, rail lines, and apartments are real physical assets, not accounting fictions. It simply means the same yuan of spending buys less additional growth than it used to, because every new project competes for demand, land, and financing against everything already standing. Recognizing this limit, China's leadership has responded by shifting emphasis toward investment in people — education, healthcare, and skills — precisely because the old formula of pure capital accumulation has already delivered its most generous returns.`,
    articleSummary: `China's incremental capital-output ratio rose from 2.84 in 2008 to 9.44 in 2023, even as investment reached 47% of GDP and real estate and infrastructure made up nearly a third of the entire economy. Much of the excess building landed in smaller "tier 3" cities, producing the widely reported "ghost city" phenomenon — proof that capital accumulation alone eventually runs into its own arithmetic.`,
    articleTakeaways: [
      "China's investment share of GDP rose from roughly 35% (1980) to 47% (2010), one of the highest sustained investment rates in modern economic history.",
      "Nearly 80% of China's housing stock has been built in smaller \"tier 3\" cities, many of which saw slow population growth or population loss, producing the widely reported \"ghost city\" phenomenon.",
      "Diminishing returns to capital don't mean investment produces nothing of value — it means each additional yuan of investment buys progressively less additional growth than earlier investment did."
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
        questionText: "What does the incremental capital-output ratio measure?",
        options: [
          "The total amount of GDP a country produces in a year",
          "How much new investment is required to generate one additional unit of GDP growth",
          "The percentage of a country's population employed in manufacturing",
          "The interest rate charged on government bonds"
        ],
        correctAnswer: "How much new investment is required to generate one additional unit of GDP growth",
        explanation: "- a) Wrong — this describes total GDP, not the ratio of investment needed per unit of additional growth.\\n- c) Wrong — the ratio concerns investment and output, not employment composition.\\n- d) Wrong — interest rates on government debt are a separate economic measure, unrelated to this ratio."
      },
      {
        questionText: "What happened to China's incremental capital-output ratio between 2008 and 2023?",
        options: [
          "It fell from 9.44 to 2.84",
          "It rose from 2.84 to 9.44",
          "It stayed exactly the same",
          "It became negative"
        ],
        correctAnswer: "It rose from 2.84 to 9.44",
        explanation: "- a) Wrong — this reverses the actual direction of change described in the lesson.\\n- c) Wrong — the lesson describes more than a threefold increase, not stability.\\n- d) Wrong — the ratio rose to a higher positive value; it did not become negative."
      },
      {
        questionText: "Why did early Chinese infrastructure investment produce especially large output gains, according to the lesson?",
        options: [
          "Because China had almost no existing capital, so each new project faced little competition for land, workers, or financing",
          "Because the government banned all private investment during this period",
          "Because interest rates were negative throughout the 2000s",
          "Because population growth had stopped entirely"
        ],
        correctAnswer: "Because China had almost no existing capital, so each new project faced little competition for land, workers, or financing",
        explanation: "- b) Wrong — no such ban on private investment is described in the lesson.\\n- c) Wrong — no claim about negative interest rates appears in the lesson.\\n- d) Wrong — population trends are discussed in relation to specific cities, not as a blanket national stoppage."
      },
      {
        questionText: "What is the \"ghost city\" phenomenon described in the lesson?",
        options: [
          "Cities that were completely abandoned and demolished",
          "Newly built districts with substantial finished housing and infrastructure but comparatively few residents",
          "Historic cities preserved for tourism purposes",
          "Cities where construction is legally prohibited"
        ],
        correctAnswer: "Newly built districts with substantial finished housing and infrastructure but comparatively few residents",
        explanation: "- a) Wrong — the lesson describes underused new construction, not abandonment followed by demolition.\\n- c) Wrong — this describes heritage preservation, unrelated to the overbuilt new districts described.\\n- d) Wrong — the phenomenon concerns excess construction, not a prohibition on building."
      },
      {
        questionText: "According to the lesson, what share of China's housing stock has been built in smaller \"tier 3\" cities?",
        options: [
          "Less than 10%",
          "About 50%",
          "Nearly 80%",
          "100%, with no housing built anywhere else"
        ],
        correctAnswer: "Nearly 80%",
        explanation: "- a) Wrong — this drastically understates the concentration described in the lesson.\\n- b) Wrong — this also understates the figure given in the lesson.\\n- d) Wrong — the lesson describes coastal and larger cities as having their own construction as well, just a smaller share."
      },
      {
        questionText: "Why does a rising incremental capital-output ratio NOT mean that investment \"produced nothing of value,\" according to the lesson?",
        options: [
          "Because the ratio is purely theoretical and has no connection to real construction",
          "Because real physical assets like roads and apartments are still built; the ratio simply reflects that each additional yuan buys progressively less additional growth",
          "Because the ratio only applies to countries with shrinking populations",
          "Because diminishing returns only affect government spending, not private investment"
        ],
        correctAnswer: "Because real physical assets like roads and apartments are still built; the ratio simply reflects that each additional yuan buys progressively less additional growth",
        explanation: "- a) Wrong — the lesson explicitly ties the ratio to real, physical construction outcomes, not an abstract theory alone.\\n- c) Wrong — population change is discussed as one contributing factor in specific cities, not a defining condition for the ratio to apply.\\n- d) Wrong — the lesson doesn't restrict diminishing returns to government spending specifically."
      },
      {
        questionText: "A local government official in a smaller Chinese city wants to boost GDP growth quickly and relies primarily on land sales revenue. Based on the lesson, what risk does this strategy carry?",
        options: [
          "No risk, since more construction always produces proportional additional growth",
          "The risk of continuing to build housing and infrastructure beyond what population and demand can absorb, worsening the capital-output ratio further",
          "The risk that construction will become illegal",
          "The risk that population growth will immediately reverse the trend"
        ],
        correctAnswer: "The risk of continuing to build housing and infrastructure beyond what population and demand can absorb, worsening the capital-output ratio further",
        explanation: "- a) Wrong — the lesson explicitly shows that additional construction has produced progressively smaller growth gains, not proportional ones.\\n- c) Wrong — no legal prohibition on construction is described in the lesson.\\n- d) Wrong — the lesson doesn't suggest population growth would reverse on its own in response to this strategy."
      },
      {
        questionText: "An economist comparing Country X (35% of GDP invested, high growth per yuan invested) to Country Y (47% of GDP invested, declining growth per yuan invested) is asked which country is more likely further along the diminishing-returns curve. What is the most defensible answer?",
        options: [
          "Country X, since it invests less overall",
          "Country Y, since a higher investment share paired with declining output per unit of investment matches the diminishing-returns pattern described in the lesson",
          "Neither, since investment share has no relationship to diminishing returns",
          "Both countries equally, regardless of their specific investment and output patterns"
        ],
        correctAnswer: "Country Y, since a higher investment share paired with declining output per unit of investment matches the diminishing-returns pattern described in the lesson",
        explanation: "- a) Wrong — lower investment share alone doesn't indicate a country is further along the diminishing-returns curve.\\n- c) Wrong — the lesson directly ties a high investment share combined with a rising capital-output ratio to diminishing returns.\\n- d) Wrong — the two countries described have clearly different patterns, which the lesson treats as meaningfully different stages."
      },
      {
        questionText: "Why might a shift toward investing in \"human capital\" — education, healthcare, skills — rather than physical construction make sense for an economy with a high incremental capital-output ratio?",
        options: [
          "Because human capital investment is described as producing potentially better returns once physical capital investment has become less efficient",
          "Because human capital investment always costs exactly the same as physical capital investment",
          "Because education spending has no connection to economic growth",
          "Because it eliminates the need for any further physical infrastructure ever again"
        ],
        correctAnswer: "Because human capital investment is described as producing potentially better returns once physical capital investment has become less efficient",
        explanation: "- b) Wrong — the lesson doesn't claim the two types of investment cost the same; it discusses a strategic shift in emphasis, not equal costs.\\n- c) Wrong — the lesson frames human capital investment as a growth strategy, directly connecting it to economic outcomes.\\n- d) Wrong — the lesson doesn't claim physical infrastructure investment stops entirely, only that emphasis is shifting."
      },
      {
        questionText: "Based on both this lesson and the Solow growth model lesson, what would be the most defensible prediction about a country that continues raising its investment share of GDP well beyond the point where its incremental capital-output ratio has already tripled?",
        options: [
          "Growth will accelerate indefinitely as investment share rises further",
          "Each additional round of investment is likely to produce progressively smaller growth gains, consistent with diminishing returns to capital",
          "The capital-output ratio will automatically reverse itself with no policy change",
          "Investment share and growth have no relationship at any stage"
        ],
        correctAnswer: "Each additional round of investment is likely to produce progressively smaller growth gains, consistent with diminishing returns to capital",
        explanation: "- a) Wrong — both lessons describe diminishing, not accelerating, returns as capital accumulates further.\\n- c) Wrong — no automatic reversal is described; the lessons suggest a change in strategy, such as shifting toward productivity or human capital, is what addresses the pattern.\\n- d) Wrong — both lessons directly link investment share to growth outcomes, showing a clear, if weakening, relationship."
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
