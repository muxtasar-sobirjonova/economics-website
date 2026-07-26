import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 23;
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
        title: 'Why Saving for the Future Is So Difficult',
        conceptText: `Hyperbolic discounting is a behavioral economics idea that explains why people value future outcomes in a highly uneven way. A reward that is far away often feels much less important than it should, while a reward that is close suddenly becomes much more attractive. This is why saving for retirement looks sensible in principle but difficult in practice. The future is not rejected; it is simply discounted too strongly when it is distant, and not strongly enough when it becomes immediate.

The economic importance of this concept is that it explains time inconsistency. A person may genuinely intend to save, invest, or avoid wasteful spending, but when the moment of choice arrives, the present pulls harder than the future. The next paycheck feels useful now. The retirement account feels important later. That difference creates a predictable gap between plans and actions. Behavioral economics studies this gap because standard models assume people value time in a much more stable and regular way than they actually do.

Hyperbolic discounting helps explain why people delay saving even when they understand the benefit. It is not only a matter of income. It is also a matter of self-control, attention, and the emotional distance of the reward. This is why automatic enrollment, payroll deductions, and default contribution plans matter so much. They do not make people suddenly wiser. They reduce the number of moments when a person must rely on willpower alone.`,
        conceptSummary: `Hyperbolic discounting means future rewards are undervalued when they are far away, which makes saving for long-term goals unusually difficult.`,
        conceptTakeaways: [
          "Future rewards lose value too quickly when they are distant.",
          "Immediate spending often beats future security in the mind.",
          "People may intend to save and still fail to act.",
          "Time inconsistency is central to the problem.",
          "Defaults and automation help protect long-term goals."
        ],
        articleTitle: 'Why does retirement saving feel easy to promise but hard to do?',
        articleText: `**Why does retirement saving feel easy to promise but hard to do?**
Retirement saving feels easy to promise because the benefit is abstract and the sacrifice is small in the imagination. It feels hard to do because the sacrifice is real and immediate. When a worker saves money today, current consumption falls right away. The retirement benefit, by contrast, arrives years later and is therefore easy to underweight. Hyperbolic discounting explains this mismatch: the farther away the benefit, the weaker it feels. That is why retirement plans often collapse not because people hate saving, but because the present keeps winning the argument.

**Why do people keep saying “next month” when they mean “never”?**
People keep saying “next month” because the future always looks easier before it arrives. In the current moment, saving seems like a reasonable plan. In the next moment, bills, entertainment, debt payments, and small comforts compete for the same money. Each delay makes the goal weaker, but each delay also feels harmless on its own. That is the trap. The person is not necessarily lying to themselves in a dramatic way. They are repeatedly giving the future a promise that the present refuses to honor.

**Why do many Americans save too little even when they know retirement is important?**
Many Americans save too little because knowing the correct answer is not the same as behaving consistently. A person can understand that retirement will be expensive and still spend the money now because current needs are more visible than future needs. Some households also face real budget pressure, which makes saving harder regardless of intention. But hyperbolic discounting explains the behavioral side of the problem: even when saving is possible, the distant reward is often mentally too weak to compete with today’s spending. The result is under-saving that looks irrational only if time is treated as neutral.

**Why do automatic enrollment systems work better than advice alone?**
Automatic enrollment works better because it changes the default path. If saving happens automatically unless the worker opts out, the person does not need to fight the same self-control battle every month. Advice depends on repeated action. Defaults depend on inertia. That difference matters because hyperbolic discounting is strongest when a decision must be made again and again. Automatic enrollment does not remove choice, but it makes the long-term option easier to keep.

**Why do small purchases often defeat large future benefits?**
Small purchases defeat large future benefits because immediate pleasure is emotionally louder than distant security. A coffee, a dinner, a new phone accessory, or a weekend expense produces an instant feeling of reward. Retirement savings produce no visible pleasure today. The reward is delayed, invisible, and mentally distant. Hyperbolic discounting gives the present purchase more weight than it deserves and gives the future benefit less weight than it deserves. That is why a small present gain can crowd out a much larger future gain.

**What is the deeper economic lesson from retirement saving?**
The deeper economic lesson is that long-run welfare depends on how choices are structured over time. If saving requires constant willpower, many people will fail even when they understand the goal. That is why good retirement systems use defaults, payroll deductions, reminders, and simplified enrollment. The real issue is not simply whether people know they should save. It is whether the environment helps them act on that knowledge when the future becomes the present. Behavioral economics matters because it shows that timing itself can distort economic behavior.`,
        articleSummary: `Many Americans save too little for retirement because future rewards feel too weak compared with immediate spending. Hyperbolic discounting, repeated postponement, and the weakness of self-control across time all help explain the gap between intention and action.`,
        articleTakeaways: [
          "Retirement saving is hard because the cost is immediate and the reward is delayed.",
          "“Next month” behavior is a classic sign of time inconsistency.",
          "Automatic enrollment reduces the need for repeated self-control.",
          "Under-saving can reflect both bias and real financial pressure.",
          "Better systems make long-term saving easier to sustain."
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
        questionText: "Which statement best defines hyperbolic discounting?",
        options: [
          "People always prefer risky options over safe ones.",
          "People value future outcomes too little when they are far away.",
          "People never care about the future.",
          "People make decisions only by habit, not by thought."
        ],
        correctAnswer: "People value future outcomes too little when they are far away.",
        explanation: "Hyperbolic discounting means distant outcomes are discounted too heavily. Risk preference is a different concept. People do care about the future; they just undervalue it when it is distant. Hyperbolic discounting is about time valuation, not the absence of thought."
      },
      {
        questionText: "Why does retirement saving often feel harder than spending today?",
        options: [
          "Because saving has no benefit at all.",
          "Because the reward from saving is immediate.",
          "Because the cost of saving is immediate while the benefit is delayed.",
          "Because retirement accounts always lose money."
        ],
        correctAnswer: "Because the cost of saving is immediate while the benefit is delayed.",
        explanation: "The sacrifice is now, but the reward arrives later. Saving does have a future benefit. The benefit is delayed, not immediate. Retirement accounts do not always lose money; that is not the point here."
      },
      {
        questionText: "What does “next month” behavior usually reveal?",
        options: [
          "Strong self-control.",
          "Time inconsistency.",
          "Perfect planning.",
          "No preference for saving."
        ],
        correctAnswer: "Time inconsistency.",
        explanation: "The person keeps changing the plan as time moves forward. Repeated delay is not strong self-control. Perfect planning would produce action, not endless delay. The person may value saving, but still postpone it."
      },
      {
        questionText: "Why do automatic enrollment systems increase saving?",
        options: [
          "They eliminate all financial pressure.",
          "They make saving the default option.",
          "They remove the need for any future planning.",
          "They guarantee high investment returns."
        ],
        correctAnswer: "They make saving the default option.",
        explanation: "Defaults shape behavior by reducing active resistance. They do not remove financial pressure. Planning still matters. Enrollment does not guarantee returns."
      },
      {
        questionText: "Why can small purchases beat large future gains in the mind?",
        options: [
          "Because the future is invisible and the present is vivid.",
          "Because future gains never matter.",
          "Because all purchases are equally important.",
          "Because retirement savings have no value."
        ],
        correctAnswer: "Because the future is invisible and the present is vivid.",
        explanation: "Immediate rewards are felt more strongly. Future gains do matter; they are just discounted too much. People do not treat all purchases equally. Retirement savings do have value; that is why the bias is costly."
      },
      {
        questionText: "Which factor can make under-saving partly non-behavioral?",
        options: [
          "Strong self-control.",
          "High income.",
          "Debt and budget pressure.",
          "Automatic enrollment."
        ],
        correctAnswer: "Debt and budget pressure.",
        explanation: "Real financial constraints can limit saving even when people want to save. Strong self-control would not cause under-saving. High income usually makes saving easier, not harder. Automatic enrollment helps saving instead of causing under-saving."
      },
      {
        questionText: "What is the main job of payroll deductions in retirement saving?",
        options: [
          "To increase temptation.",
          "To move saving out of the moment of choice.",
          "To make saving more complicated.",
          "To remove the need for any income."
        ],
        correctAnswer: "To move saving out of the moment of choice.",
        explanation: "Automatic deductions reduce the need to decide every month. They reduce temptation rather than increase it. They simplify saving. They do not remove the need for income."
      },
      {
        questionText: "Why is behavioral economics needed in this topic?",
        options: [
          "Because standard finance assumes perfect memory.",
          "Because people do not always act according to long-run logic.",
          "Because saving is unrelated to time.",
          "Because retirement is always fully automatic."
        ],
        correctAnswer: "Because people do not always act according to long-run logic.",
        explanation: "Behavioral economics explains actual human inconsistency. The issue here is not memory alone. Time is central to the whole problem. Retirement saving is not always automatic."
      },
      {
        questionText: "What is the best description of time inconsistency?",
        options: [
          "The same person always wants the same thing at every moment.",
          "Preferences change when the moment of choice changes.",
          "People never change their minds.",
          "Saving decisions are always stable."
        ],
        correctAnswer: "Preferences change when the moment of choice changes.",
        explanation: "That is exactly what time inconsistency means. The opposite of time inconsistency is wanting the same thing at every moment. People often do change their minds. Saving decisions are often unstable."
      },
      {
        questionText: "What is the central economic reason people save too little for retirement?",
        options: [
          "The future is discounted too heavily relative to the present.",
          "Retirement is always cheap.",
          "Saving has no trade-off.",
          "People never face competing needs."
        ],
        correctAnswer: "The future is discounted too heavily relative to the present.",
        explanation: "That is the core mechanism behind hyperbolic discounting. Retirement can be expensive. Saving always involves a trade-off with current spending. People often face many competing needs."
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
