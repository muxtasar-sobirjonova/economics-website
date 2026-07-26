import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 2;
  const tag = "Week 1";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>You have ten minutes to pick one university out of a list of 100, with no time to research every school or compare every scholarship. So you scan for the requirements that matter most to you, pick something that clears the bar, and move on. You didn't choose the mathematically perfect school. You chose the one that was good enough.</p>

<p>This is <strong>bounded rationality</strong>: economist and Nobel laureate <strong>Herbert Simon's</strong> argument that people don't optimize the way traditional economic models assume, because real decisions are limited by three constraints — the information available, the time available, and the brain's capacity to process it all. Instead of searching for the single best option, people <strong>satisfice</strong> — a blend of "satisfy" and "suffice," settling for the first choice that clears their personal bar rather than the one that would win a full comparison.</p>

<p>Imagine scrolling through a delivery app with 200 menu items. Almost nobody reads all 200. Most people stop at the third or fourth dish that looks good and order it, fully aware better options might exist further down the list.</p>

<p>None of this makes people irrational. It makes them human — operating with a brain built for fast, workable answers rather than exhaustive ones.</p>

<p>The harder question is what happens when the stakes aren't a university or a dinner order, but a factory floor producing thousands of cars a day, where a single unnoticed mistake can cost lives. That's the problem Toyota inherited in the 1950s — and solved by redesigning around human limits instead of demanding perfection from them.</p>`;

  const conceptSummary = `Bounded rationality, developed by economist Herbert Simon, holds that people can't optimize every decision because time, information, and mental capacity are all limited. Instead of finding the single best option, people satisfice — choosing the first option that's good enough. This isn't irrationality; it's a realistic response to real constraints, and it shapes how businesses design systems for actual human decision-making.`;

  const conceptTakeaways = [
    "Bounded rationality, developed by economist Herbert Simon, holds that decisions are limited by available information, available time, and mental processing capacity.",
    "People satisfice rather than optimize — choosing the first option that's good enough instead of searching for the objectively best one.",
    "Bounded rationality doesn't mean people are irrational; it means human decision-making operates within real, unavoidable constraints.",
    "The concept applies to everyday choices (a menu, a university list) as well as high-stakes systems like manufacturing.",
    "Businesses that understand bounded rationality design systems assuming imperfect decisions, rather than expecting flawless judgment from every person."
  ];

  const articleTitle = "Bounded Rationality in Japan: How Toyota Designed a Factory That Expected People to Make Mistakes";
  
  const articleText = `<p>Most postwar factories ran on a simple assumption: workers should never make mistakes, and if they did, the fault was theirs. Toyota's engineers, rebuilding the company's manufacturing system in the 1950s under the guidance of industrial engineer <strong>Taiichi Ohno</strong>, rejected that assumption outright. Human beings have limited attention, limited energy, and limited information at any given moment — so instead of demanding flawless workers, Ohno asked how the factory itself could be redesigned to catch mistakes early and make them harder to repeat.</p>

<p><strong>What exactly is the andon cord, and why did Toyota hand that much power to line workers?</strong><br>
The andon cord is a physical cord running along the assembly line that any worker can pull the moment they notice a defect or something that looks wrong. Pulling it slows or stops the entire line until a supervisor addresses the issue. In most factories at the time, only managers could halt production. Toyota inverted that hierarchy, betting that the person closest to the problem — not the person furthest from it — was best positioned to catch it early.</p>

<p><strong>Why didn't giving every worker the ability to halt the entire production line destroy Toyota's output?</strong><br>
Because a small, deliberate delay caught early is far cheaper than thousands of defective cars discovered later. A worker pulling the cord might cost a factory a few minutes. A defect that reaches final assembly, or worse, a customer, costs vastly more to fix and damages Toyota's reputation instead of just its bumper. The short-term slowdown was the system working exactly as designed, not a failure of it.</p>

<p><strong>How did tools like poka-yoke and standardized work reduce the number of decisions a worker had to get right?</strong><br>
Poka-yoke devices — mistake-proofing tools like a part that physically can't be installed backward — remove entire categories of decisions rather than asking workers to remember not to make them. Standardized work procedures did something similar for tasks, breaking each job into a fixed sequence so a worker's limited attention was spent on doing the step correctly, not recalling what the step even was. Bounded rationality says people can't process everything; Toyota's response was to shrink how much they had to process at all.</p>

<p><strong>How did designing around human limits make Toyota both higher-quality and more efficient at the same time?</strong><br>
Fewer defects meant less rework, and less rework meant a faster overall production cycle, even with the occasional line stop. By the 1980s, the resulting Toyota Production System was producing vehicles with defect rates and per-vehicle labor hours that undercut competitors still relying on end-of-line inspection to catch what workers, exhausted and rushed, had already missed.</p>

<p><strong>Why have industries far outside manufacturing, like hospitals and tech firms, copied a system built around expecting human error?</strong><br>
Because the underlying problem — humans with limited attention operating under time pressure — exists everywhere, not just on a car assembly line. Hospitals have adapted andon-style stop authority into surgical checklists and code-alert systems. Software teams borrowed the same logic into automated test suites that halt a deployment the moment something looks wrong. None of these systems assume the professionals involved are careless. They assume the professionals are human, and design around that instead of around a fantasy of perfect attention.</p>

<p>Toyota's success was never built on hiring perfect workers. It was built on accepting that perfect workers don't exist — and building a factory that didn't need them to.</p>`;

  const articleSummary = `In the 1950s, Toyota rejected the assumption that workers should never make mistakes. Engineer Taiichi Ohno built a system — the andon cord, poka-yoke mistake-proofing, standardized work — that assumed human attention is limited and designed around it instead of demanding perfection. The result was higher quality and greater efficiency, a model later copied by hospitals and tech companies alike.`;

  const articleTakeaways = [
    "Toyota engineer Taiichi Ohno redesigned the company's factories in the 1950s around the assumption that workers, like all humans, have limited attention and will make mistakes.",
    "The andon cord let any line worker stop production the moment they spotted a defect, betting that the person closest to a problem catches it fastest.",
    "Poka-yoke mistake-proofing and standardized work reduced the number of decisions a worker had to get right, rather than demanding perfect memory and attention.",
    "Catching a defect early with a brief line stop is far cheaper than discovering it after thousands of cars have already been built.",
    "Hospitals and technology companies have since adapted Toyota's approach — assuming human error rather than expecting flawless performance — into checklists and automated safeguards."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Why Humans Don't Always Choose the Perfect Option",
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
        questionText: "What is bounded rationality?",
        options: [
          "A law requiring companies to disclose all decision-making data",
          "The idea that decisions are limited by available time, information, and mental processing capacity",
          "A rule that all decisions must be made within ten minutes",
          "A management style based on strict hierarchy"
        ],
        correctAnswer: "The idea that decisions are limited by available time, information, and mental processing capacity",
        explanation: "Bounded rationality is Herbert Simon's theory that cognitive limits, time, and available info prevent perfect optimization."
      },
      {
        questionText: "What does it mean to \"satisfice\" rather than optimize?",
        options: [
          "To choose the single mathematically best option every time",
          "To choose the first option that is good enough, rather than exhaustively comparing every alternative",
          "To refuse to make a decision until all information is available",
          "To let someone else make the decision instead"
        ],
        correctAnswer: "To choose the first option that is good enough, rather than exhaustively comparing every alternative",
        explanation: "Satisficing means settling for an option that meets your criteria instead of endlessly searching for the best possible choice."
      },
      {
        questionText: "Why did Taiichi Ohno redesign Toyota's factories around the assumption that workers would make mistakes?",
        options: [
          "Because he wanted to reduce worker pay",
          "Because human attention, energy, and information are naturally limited, so expecting flawless performance was unrealistic",
          "Because Japanese labor law required it",
          "Because competitors had already tried it and failed"
        ],
        correctAnswer: "Because human attention, energy, and information are naturally limited, so expecting flawless performance was unrealistic",
        explanation: "Toyota acknowledged human bounded rationality, so they built a system that caught mistakes rather than blaming workers."
      },
      {
        questionText: "How does poka-yoke relate to bounded rationality?",
        options: [
          "It has no connection to the concept",
          "It removes entire categories of possible mistakes, reducing how much a worker's limited attention has to manage",
          "It increases the number of decisions a worker must make",
          "It replaces workers with robots entirely"
        ],
        correctAnswer: "It removes entire categories of possible mistakes, reducing how much a worker's limited attention has to manage",
        explanation: "Mistake-proofing (poka-yoke) reduces the cognitive load, adapting to human limits by making wrong actions physically impossible."
      },
      {
        questionText: "You manage a customer support team and notice reps sometimes give inconsistent answers under time pressure. Based on bounded rationality, what's the most effective fix?",
        options: [
          "Tell reps to simply be more careful and pay closer attention",
          "Create a standardized script or decision tree that reduces the number of judgment calls reps have to make in the moment",
          "Extend every call to unlimited length so reps have more time to think",
          "Fire reps who give inconsistent answers"
        ],
        correctAnswer: "Create a standardized script or decision tree that reduces the number of judgment calls reps have to make in the moment",
        explanation: "Standardization reduces the burden on reps' mental processing capacity, lowering error rates."
      },
      {
        questionText: "You're a line worker at a factory that just installed an andon-style stop cord. You notice a part that doesn't look right, but you're not entirely sure it's a defect. What does the system intend for you to do?",
        options: [
          "Ignore it and let a supervisor catch it later during final inspection",
          "Pull the cord, since catching a possible defect early is cheaper than finding it after full assembly",
          "Quietly fix it yourself without telling anyone",
          "Wait until your shift ends to report it"
        ],
        correctAnswer: "Pull the cord, since catching a possible defect early is cheaper than finding it after full assembly",
        explanation: "The andon cord relies on catching potential problems at the source, saving massive downstream costs."
      },
      {
        questionText: "A food delivery app has 200 menu items. Data shows most users stop scrolling and order after seeing 6-8 options. What does this best illustrate?",
        options: [
          "Users are behaving irrationally by not comparing all 200 items",
          "Users are satisficing — choosing a good-enough option instead of the objectively optimal one, due to limited time and attention",
          "The app's menu is poorly designed and must be shortened",
          "Users always choose the cheapest item regardless of quality"
        ],
        correctAnswer: "Users are satisficing — choosing a good-enough option instead of the objectively optimal one, due to limited time and attention",
        explanation: "Stopping at the 6th option because it looks good is classic satisficing."
      },
      {
        questionText: "A hospital adopts a surgical checklist that requires staff to verbally confirm each step before proceeding. What concept does this most directly apply?",
        options: [
          "Overconfidence",
          "Bounded rationality — reducing the number of things a person must recall and decide under pressure",
          "Illusory correlation",
          "Anchoring"
        ],
        correctAnswer: "Bounded rationality — reducing the number of things a person must recall and decide under pressure",
        explanation: "Checklists mitigate bounded rationality by externally storing requirements instead of relying on flawed human memory."
      },
      {
        questionText: "If a company assumes its employees will always make perfect decisions given enough training, what is it most likely to overlook, based on bounded rationality?",
        options: [
          "That employees need more vacation time",
          "That even well-trained people operate with limited time, attention, and information, so errors will still occur",
          "That training should be eliminated since it doesn't help",
          "That employees should be paid more"
        ],
        correctAnswer: "That even well-trained people operate with limited time, attention, and information, so errors will still occur",
        explanation: "No amount of training can eliminate human bounded rationality."
      },
      {
        questionText: "A software team builds automated tests that block a deployment if certain errors are detected, without requiring an engineer to manually check every line of code. What Toyota-style principle does this reflect?",
        options: [
          "Hiring only perfect engineers",
          "Designing a system that catches likely mistakes automatically, rather than relying on flawless human attention",
          "Removing all human oversight entirely",
          "Increasing the number of manual decisions engineers must make"
        ],
        correctAnswer: "Designing a system that catches likely mistakes automatically, rather than relying on flawless human attention",
        explanation: "Automated tests act like poka-yoke or andon cords, catching defects automatically without depending on perfect human attention."
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
