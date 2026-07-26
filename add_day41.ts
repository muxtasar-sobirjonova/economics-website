import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 41;
  const tag = "Week 6";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Nobody designed Silicon Valley. No government agency drew up a master plan for the most valuable concentration of technology companies in human history to form across a stretch of California that, within living memory, was mostly orchards. It happened because a specific handful of ingredients kept reinforcing each other, for decades, until leaving the region became a real economic cost rather than a minor inconvenience.</p>

<p>An <strong>innovation ecosystem</strong> is a geographic or institutional concentration of interconnected elements — research institutions, capital, skilled talent, and prior successful companies — that together make new company formation faster, cheaper, and more likely to succeed than any single element could produce alone. The key word is <em>interconnected</em>. A university alone produces graduates. A venture fund alone provides capital. Neither, by itself, produces an ecosystem.</p>

<p>The mechanism is a <strong>reinforcing loop</strong>: university research and graduates seed early companies; those companies' successes create experienced operators and, eventually, wealth; that wealth becomes the region's venture capital, funding the next generation of startups staffed by talent that stays local because <u>opportunity density is highest there</u>; those startups' successes and failures alike recycle experienced people back into new ventures, deepening the loop further with each cycle.</p>

<p>This is why regions that try to replicate this success by funding a single ingredient — a research park, a tax incentive, an imported venture fund — routinely underperform. <strong>Agglomeration effects</strong>, the extra value that comes purely from proximity itself, don't show up in any one ingredient. They show up in the informal knowledge-sharing, the ease of poaching talent between nearby companies, and the speed of deals that happen because everyone involved already knows each other from a previous company, a previous fund, a previous failure. <em>That density can't be funded directly</em>. It can only be grown, slowly, through enough successful cycles that it becomes self-sustaining.</p>`;

  const conceptSummary = `An innovation ecosystem is an interconnected concentration of research, capital, and talent that makes new companies more likely to succeed than any single ingredient could alone. A reinforcing loop connects them: research produces talent and startups, successes produce wealth and experienced operators, that wealth becomes venture capital funding the next generation. Agglomeration effects — the value of proximity itself — explain why regions funding just one ingredient rarely replicate the whole ecosystem.`;

  const conceptTakeaways = [
    "An innovation ecosystem is an interconnected concentration of research, capital, and talent, not any single ingredient alone.",
    "A reinforcing loop connects them: research and talent seed companies, whose successes create capital and experienced operators for the next generation.",
    "Regions that fund only one ingredient (a research park, tax incentives, imported capital) tend to underperform.",
    "Agglomeration effects — the extra value from proximity itself — come from informal knowledge-sharing and easier talent movement between nearby companies.",
    "Ecosystem density can't be funded directly; it grows slowly, through enough successful cycles to become self-sustaining."
  ];

  const articleTitle = "How a Few Orchards Outside San Francisco Became the Most Valuable Square Miles on Earth";
  
  const articleText = `<p><strong>How did a region best known, generations ago, for its fruit orchards become the densest concentration of valuable technology companies in the world?</strong></p>

<p>Stanford University played an outsized early role, particularly through engineering dean Frederick Terman's encouragement of graduates to start companies locally rather than move elsewhere for careers — advice that helped lead to Hewlett-Packard's founding in 1939 with Stanford's backing. Decades later, Fairchild Semiconductor was founded in 1957 by a group of engineers, later nicknamed the "traitorous eight," who left Shockley Semiconductor Laboratory. Fairchild itself went on to spin out numerous chip and technology companies over subsequent decades.</p>

<p><strong>Why did this specific region keep compounding, rather than producing just one or two successful companies and stopping there?</strong></p>

<p>Each generation of successful founders and early employees became a pool of experienced operators and, eventually, investors — funding and mentoring the next wave of startups, which in turn produced more successful outcomes feeding directly back into the cycle. <em>This wasn't one lucky company</em>. It was the same small group of interconnected people and institutions producing successive generations of new ventures.</p>

<p><strong>What does venture capital actually add to this loop that talent and research alone couldn't provide?</strong></p>

<p>A concentration of investors specifically experienced in evaluating early-stage technology risk, willing to fund ventures that other, more conventional capital sources wouldn't touch. As this specialized capital pool grew alongside the region's talent base, <u>it compounded the loop further</u> — more funded startups meant more successful exits, meant more experienced operators and wealth flowing back into the next generation of investing and founding.</p>

<p><strong>If the ingredients are known — research, capital, talent — why haven't other regions simply replicated Silicon Valley by funding the same ingredients?</strong></p>

<p>Because proximity itself matters beyond any single ingredient. Informal information-sharing between people at different companies, the ease of hiring and talent movement across firms, and the speed of deal-making built on personal networks accumulated over decades don't show up in a research park's blueprint or a tax incentive program's budget. Regions that fund isolated pieces of the ecosystem, without the <u>dense, reinforcing social fabric</u> built over time, tend to underperform relative to expectations.</p>

<p><strong>If you were a policymaker trying to replicate Silicon Valley's success by funding a new research park and offering startup tax incentives, would you expect similar results within a few years — or recognize that you were missing something the ingredient list alone can't capture?</strong></p>

<p>Expecting similar results quickly underestimates how much of the value comes from decades of reinforcing density, not simply the presence of the individual ingredients on a policy checklist. Recognizing the gap means understanding that <em>ecosystems compound through repeated cycles of success</em>, failure, and talent recycling sustained over a long period — not through funding the visible pieces alone.</p>

<p><strong>So is Silicon Valley really about any single company, university, or fund — or about the compounding interaction between all of them, sustained over decades?</strong></p>

<p>No single ingredient explains it. The actual "innovation" was the accumulated, self-reinforcing density of research, capital, and talent recycling repeatedly into new ventures over a long enough period that the whole became far more valuable than any sum of its individual parts.</p>`;

  const articleSummary = `Silicon Valley emerged from a reinforcing loop beginning with Stanford's early encouragement of local company formation, Hewlett-Packard's 1939 founding, and Fairchild Semiconductor's 1957 founding, which itself spun out numerous later companies. Each generation of successful founders became the next generation's investors and mentors, compounding the region's talent and capital density over decades. Regions attempting to replicate this by funding isolated ingredients — a research park, tax incentives — have generally underperformed, missing the value that comes purely from sustained proximity.`;

  const articleTakeaways = [
    "Stanford's early encouragement of local company formation contributed to Hewlett-Packard's 1939 founding.",
    "Fairchild Semiconductor, founded in 1957 by engineers who left Shockley Semiconductor, spun out numerous later technology companies.",
    "Each generation of successful founders became the next generation's experienced operators, mentors, and investors.",
    "Specialized venture capital experienced in early-stage technology risk compounded the region's reinforcing loop over decades.",
    "Agglomeration effects from sustained proximity — not any single ingredient — explain why other regions have struggled to replicate the ecosystem."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Innovation Ecosystems",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
        tag // Sync the tag to Week 6
      }
    });
    console.log(`Updated lesson content for day ${dayOrder}`);
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
        questionText: "What is an \"innovation ecosystem,\" as defined in this lesson?",
        options: [
          "A single university's research department",
          "An interconnected concentration of research, capital, and talent that makes new company formation more likely to succeed than any single element could alone",
          "A government agency responsible for approving new startups",
          "A tax incentive program for technology companies"
        ],
        correctAnswer: "An interconnected concentration of research, capital, and talent that makes new company formation more likely to succeed than any single element could alone",
        explanation: "this is the exact definition given. A, C, and D each describe a single ingredient, not the interconnected whole the lesson defines."
      },
      {
        questionText: "What is the \"reinforcing loop\" described in this lesson?",
        options: [
          "A cycle where research and talent seed companies, whose successes create capital and experienced operators that fund and mentor the next generation of startups",
          "A legal requirement for universities to fund startups directly",
          "A one-time event that produces a single successful company",
          "A government subsidy program that repeats annually"
        ],
        correctAnswer: "A cycle where research and talent seed companies, whose successes create capital and experienced operators that fund and mentor the next generation of startups",
        explanation: "this is the lesson's exact description of the mechanism. B, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "What are \"agglomeration effects,\" according to this lesson?",
        options: [
          "The extra value that comes purely from proximity itself — informal knowledge-sharing, easier talent movement, and faster deal-making",
          "A government tax imposed specifically on technology companies",
          "A legal restriction preventing companies from relocating",
          "The total revenue generated by a single company in an ecosystem"
        ],
        correctAnswer: "The extra value that comes purely from proximity itself — informal knowledge-sharing, easier talent movement, and faster deal-making",
        explanation: "this is the exact definition given. B, C, and D are fabricated, unrelated claims."
      },
      {
        questionText: "Why does this lesson argue that regions funding only a single ingredient (a research park, tax incentives, imported capital) tend to underperform when trying to replicate Silicon Valley?",
        options: [
          "Because a single ingredient can never legally be funded by any government",
          "Because the ecosystem's real value comes from the interconnected, reinforcing loop and proximity effects, which a single funded ingredient cannot replicate on its own",
          "Because research parks and tax incentives are always more expensive than the value they create",
          "Because only Californian universities are capable of producing successful technology companies"
        ],
        correctAnswer: "Because the ecosystem's real value comes from the interconnected, reinforcing loop and proximity effects, which a single funded ingredient cannot replicate on its own",
        explanation: "this is the lesson's central argument. A, C, and D are fabricated or unsupported claims."
      },
      {
        questionText: "You're a policymaker funding a new research park and startup tax incentives, hoping to replicate Silicon Valley's success within a few years. Based on this lesson, what should you recognize about this expectation?",
        options: [
          "That similar results are guaranteed within a few years, since the correct ingredients are now in place",
          "That the value Silicon Valley built came from decades of reinforcing density and compounding cycles, which funding the visible ingredients alone is unlikely to replicate quickly",
          "That research parks and tax incentives have no relationship whatsoever to innovation ecosystems",
          "That only Stanford University specifically can produce this kind of ecosystem"
        ],
        correctAnswer: "That the value Silicon Valley built came from decades of reinforcing density and compounding cycles, which funding the visible ingredients alone is unlikely to replicate quickly",
        explanation: "this reflects the lesson's central warning about timeline and complexity. A, C, and D all contradict or oversimplify this reasoning."
      },
      {
        questionText: "You're an investor in an emerging tech hub trying to understand why it hasn't yet produced the same density of successful companies as more established ecosystems. Based on this lesson, what should you look for that a simple checklist of research institutions and available capital might miss?",
        options: [
          "Whether informal knowledge-sharing, talent movement between companies, and personal networks built over time already exist in the region",
          "Whether the region has a research park with an impressive building design",
          "Whether local tax rates are lower than in other regions",
          "Whether the government has issued an official press release about the ecosystem"
        ],
        correctAnswer: "Whether informal knowledge-sharing, talent movement between companies, and personal networks built over time already exist in the region",
        explanation: "this is a direct application of the lesson's agglomeration-effects argument. B, C, and D are superficial or irrelevant considerations the lesson does not support."
      },
      {
        questionText: "A region builds a well-funded research park and attracts a major venture capital fund to open a local office, but after five years has produced very few successful startups. Based on this lesson, what is the most likely explanation?",
        options: [
          "The region lacks any possible path to building an innovation ecosystem",
          "The region may be missing the reinforcing loop and proximity-based effects that connect research, capital, and talent into a compounding cycle, rather than isolated ingredients",
          "Research parks and venture capital offices always guarantee ecosystem success within five years",
          "The failure indicates that ecosystems cannot exist outside of California"
        ],
        correctAnswer: "The region may be missing the reinforcing loop and proximity-based effects that connect research, capital, and talent into a compounding cycle, rather than isolated ingredients",
        explanation: "this is a direct application of the lesson's core argument about interconnection versus isolated ingredients. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "In a specific region, several successful founders from an earlier generation of startups now mentor and personally invest in newer founders, who in turn produce more successful companies over time. Based on this lesson, what does this pattern best illustrate?",
        options: [
          "A one-time, isolated success with no broader significance",
          "The reinforcing loop central to how an innovation ecosystem compounds over multiple generations",
          "A legal requirement for successful founders to invest in new companies",
          "A pattern unrelated to the concepts covered in this lesson"
        ],
        correctAnswer: "The reinforcing loop central to how an innovation ecosystem compounds over multiple generations",
        explanation: "this is a direct application of the lesson's reinforcing-loop concept. A, C, and D all contradict or ignore this reasoning."
      },
      {
        questionText: "Two regions both have strong local universities producing skilled engineering graduates. Region A also has an established, specialized venture capital community and decades of successful company formation; Region B has neither. Based on this lesson, which region is more likely to function as a complete innovation ecosystem?",
        options: [
          "Region B, since having fewer existing companies leaves more room for new ones",
          "Region A, since the interconnection between research, specialized capital, and a track record of successful companies is what constitutes a complete ecosystem, not talent alone",
          "Neither region can be evaluated using the concepts in this lesson",
          "Both regions are functionally identical ecosystems"
        ],
        correctAnswer: "Region A, since the interconnection between research, specialized capital, and a track record of successful companies is what constitutes a complete ecosystem, not talent alone",
        explanation: "this is a direct application of the lesson's central argument about interconnected ingredients. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A region has excellent research institutions and available capital, but very little informal interaction, talent movement, or personal network density between people at different companies. Based on this lesson, what is this region most likely missing?",
        options: [
          "Agglomeration effects — the extra value that comes specifically from proximity and interconnection, not from research and capital alone",
          "Any possible path to ever building an innovation ecosystem",
          "A government mandate requiring companies to interact with each other",
          "A factor that has no bearing on whether an innovation ecosystem can form"
        ],
        correctAnswer: "Agglomeration effects — the extra value that comes specifically from proximity and interconnection, not from research and capital alone",
        explanation: "this is a direct application of the lesson's core agglomeration-effects argument. B, C, and D all contradict or oversimplify this reasoning."
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
    console.log(`Updated quiz questions for day ${dayOrder}`);
  }
  console.log("Done.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
