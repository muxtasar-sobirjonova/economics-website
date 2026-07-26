import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 26;
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
        title: 'Why Default Choices Change Our Behavior',
        conceptText: `In 2012, Britain ran an experiment on itself. It changed one box on a form from unchecked to checked, and pension saving among working people rose more in five years than decades of tax breaks, financial literacy campaigns, and stern advice from parents had ever managed to achieve.

The box was the default. Left alone, most people simply do whatever requires the least effort, not whatever serves them best — economists call this status quo bias. It isn't stupidity; it's a reasonable shortcut for a species that cannot re-examine every decision from scratch every day. But shortcuts have consequences. If joining a pension scheme requires paperwork, and skipping it requires nothing, most people will skip it — not because they've decided saving is a bad idea, but because they never decided anything at all.

*Nobody chose. That was the point.*

Richard Thaler and Cass Sunstein named this design trick "the nudge": build the default so that doing nothing produces the outcome you'd want people to choose anyway, while still leaving the exit door unlocked for anyone who disagrees. The power isn't in removing freedom. It's in recognizing that freedom, in practice, is mostly spent on the first option in front of you. The article ahead follows that single checked box across an entire country's paychecks.`,
        conceptSummary: `Most people, most of the time, keep whatever option requires no action — economists call this status quo bias. A default is powerful because it turns inaction into an outcome. Richard Thaler and Cass Sunstein's "nudge" idea uses this deliberately: design the default to match what people would likely choose anyway, while still leaving a clear way to opt out.`,
        conceptTakeaways: [
          "Status quo bias means people overwhelmingly stick with whatever requires no action, regardless of whether it's the best option available to them.",
          "A default doesn't remove choice — it just decides what happens to everyone who never actively chooses anything, while leaving an exit door open."
        ],
        articleTitle: 'The Checkbox That Out-Earned a Thousand Advertisements',
        articleText: `Before October 2012, fewer than half of Britain's private-sector employees were saving into a workplace pension, and only 17% held a defined contribution scheme — the modern kind employees and employers both pay into over a working life. Governments had tried the obvious levers for decades: tax relief on contributions, matching incentives, endless public information campaigns explaining compound interest. None of it moved the needle much. People agreed, in surveys, that saving for retirement mattered. Then they went back to not doing it.

The UK's Behavioural Insights Team, a small unit inside the Cabinet Office nicknamed the "Nudge Unit" and shaped directly by Thaler and Sunstein's work, proposed something almost embarrassingly modest: stop asking people to opt in to a pension. Automatically enrol them instead, and let anyone who truly didn't want to save do the paperwork to leave.

Starting with the largest employers in October 2012 and phasing down to the smallest by 2018, every eligible worker aged 22 to State Pension age, earning above roughly £10,000 a year, was placed into a workplace pension the moment they took a job — no form, no decision, no meeting with an advisor. A new low-cost scheme called NEST was built to receive anyone whose employer didn't already offer a plan. Minimum contributions started small and climbed on a schedule, reaching a combined 8% of qualifying earnings — split between employee, employer, and a small government top-up — by 2019.

*Nobody chose. That was the point.*

The results embarrassed almost every earlier assumption about British saving habits. Economists inside government had modeled a pessimistic scenario in which half of newly enrolled workers would opt straight back out. The actual opt-out rate settled at around 10% — roughly one in ten. Private-sector pension participation climbed from 42% in 2011 to 86% by 2022. Among defined contribution savers specifically, participation nearly tripled, from 17% in 2012 to 43% in 2017. The starkest shift showed up among young workers aged 22 to 29, the group least likely to think about retirement at all: their participation rate rose from just 16% to 63% in the same five years.

Jeff Bezos built an empire on a strikingly similar insight, aimed the opposite direction. Amazon's 1-Click ordering, patented in 1999, didn't improve the product being sold or the price being charged. It simply removed every remaining decision point between "I want this" and "I own this" — no cart to review, no shipping form to re-enter. Where Britain's pension reform made saving the path of least resistance, Amazon made spending the path of least resistance. Same lever. Opposite direction. Both moved billions.

None of this means people are gullible, or that defaults are a trick played on the unwitting. It means most decisions are never really decisions — they're inherited from whatever was already selected before the person showed up to choose. Change what's already selected, and you've changed the outcome for millions of people who never noticed they'd been asked a question at all.`,
        articleSummary: `When Britain automatically enrolled workers into pensions in 2012 instead of asking them to opt in, participation jumped from 42% to 86% within a decade, and opt-outs stayed near 10% instead of the 50% economists feared. Amazon's 1-Click ordering used the identical lever toward spending instead of saving — proof that removing a decision point shapes behavior more than persuasion ever does.`,
        articleTakeaways: [
          "The UK's 2012 pension auto-enrolment, shaped by Thaler and Sunstein's 'nudge' thinking, lifted private-sector pension participation from 42% (2011) to 86% (2022).",
          "The feared mass opt-out never happened — actual opt-out rates settled around 10%, far below the 50% some economists had modeled in advance.",
          "The same design lever works in either direction: Amazon's 1-Click ordering removed friction from spending the same way UK auto-enrolment removed friction from saving."
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
        questionText: "What does 'status quo bias' primarily describe?",
        options: [
          "People always choose the oldest available option.",
          "People overwhelmingly stick with whatever requires no action.",
          "People actively reject any change suggested by a government.",
          "People carefully weigh all options before deciding to do nothing."
        ],
        correctAnswer: "People overwhelmingly stick with whatever requires no action.",
        explanation: "Status quo bias means people tend to stick to the default or current state of affairs because taking action requires effort. It's a preference for inaction over action."
      },
      {
        questionText: "What is a 'nudge' in the context of behavioral economics?",
        options: [
          "Removing all choices so people are forced into the best outcome.",
          "A financial penalty applied to bad decisions.",
          "Designing the default choice to match the desired outcome, while leaving the exit door open.",
          "An advertising campaign designed to make people feel guilty."
        ],
        correctAnswer: "Designing the default choice to match the desired outcome, while leaving the exit door open.",
        explanation: "A nudge doesn't restrict freedom; it just structures the choice architecture so that the path of least resistance (doing nothing) leads to a beneficial outcome."
      },
      {
        questionText: "Why did the UK government switch to automatic enrollment for pensions in 2012?",
        options: [
          "Because tax breaks and information campaigns had failed to significantly increase participation.",
          "Because it was illegal to ask people to opt-in.",
          "Because defined contribution schemes were being phased out.",
          "Because they wanted to force all citizens to invest in the stock market."
        ],
        correctAnswer: "Because tax breaks and information campaigns had failed to significantly increase participation.",
        explanation: "For decades, the UK tried traditional economic levers (tax relief, financial literacy), but these didn't work. Nudging through defaults solved the participation problem."
      },
      {
        questionText: "What was the actual opt-out rate for the UK pension automatic enrollment?",
        options: [
          "Roughly 50%",
          "Roughly 10%",
          "Exactly 0%",
          "Roughly 86%"
        ],
        correctAnswer: "Roughly 10%",
        explanation: "Economists feared a 50% opt-out rate, but in reality, only about 1 in 10 workers (10%) did the paperwork to leave the pension scheme, showing the massive power of the default."
      },
      {
        questionText: "How does Amazon's 1-Click ordering rely on the same behavioral principle as the UK pension reform?",
        options: [
          "Both rely on people reading detailed terms and conditions before acting.",
          "Both make the desired action the path of least resistance by removing decision points.",
          "Both involve a government mandate to increase financial security.",
          "Both offer cash bonuses for participation."
        ],
        correctAnswer: "Both make the desired action the path of least resistance by removing decision points.",
        explanation: "Amazon removed the friction from spending, just as the UK government removed friction from saving. Both use defaults and ease of action to guide behavior."
      },
      {
        questionText: "Does a default choice restrict a person's freedom?",
        options: [
          "Yes, because it legally prevents them from making an alternative choice.",
          "No, because it simply assigns an outcome if they do nothing, but still allows them to actively choose otherwise.",
          "Yes, because people are entirely unaware that a choice is being made for them.",
          "No, because defaults never actually change behavior."
        ],
        correctAnswer: "No, because it simply assigns an outcome if they do nothing, but still allows them to actively choose otherwise.",
        explanation: "A default preserves freedom of choice. The exit door remains unlocked for anyone who wishes to actively select a different option."
      },
      {
        questionText: "Why did pension participation among 22 to 29-year-olds see the starkest shift (from 16% to 63%)?",
        options: [
          "Young workers suddenly became highly interested in retirement planning in 2012.",
          "They were given a special tax break not available to older workers.",
          "Because retirement is furthest away for them, they had the highest friction to actively opting in, making the new default extraordinarily powerful.",
          "Employers forced them to stay in the program under threat of termination."
        ],
        correctAnswer: "Because retirement is furthest away for them, they had the highest friction to actively opting in, making the new default extraordinarily powerful.",
        explanation: "Young workers are typically the least likely to actively think about or plan for retirement. Removing the need for them to take action had the most dramatic effect on their participation."
      },
      {
        questionText: "According to the text, why do people often stick with the default option?",
        options: [
          "Because they are universally gullible.",
          "Because re-examining every decision from scratch every day is impossible, making shortcuts necessary.",
          "Because governments make it a crime to opt out.",
          "Because humans inherently love rules."
        ],
        correctAnswer: "Because re-examining every decision from scratch every day is impossible, making shortcuts necessary.",
        explanation: "Relying on defaults isn't stupidity; it's a necessary cognitive shortcut for a species that cannot afford the time and energy to analyze every single choice in life."
      },
      {
        questionText: "What would likely happen if the UK government suddenly reversed the policy back to 'opt-in' tomorrow?",
        options: [
          "Participation would stay exactly the same because people now know the value of saving.",
          "Participation would drop drastically for new hires, as the friction of opting in returns.",
          "Participation would reach 100%.",
          "People would protest in the streets demanding to be opted out."
        ],
        correctAnswer: "Participation would drop drastically for new hires, as the friction of opting in returns.",
        explanation: "Because behavior is driven largely by the choice architecture rather than pure education or conviction, reinstating the friction of an opt-in system would cause participation to plummet again."
      },
      {
        questionText: "Which of the following is the clearest example of using a default to improve public health?",
        options: [
          "Running a television ad about the dangers of smoking.",
          "Giving a tax rebate to people who buy gym memberships.",
          "Making organ donation the automatic choice on driver's licenses, requiring a signature to opt out.",
          "Banning the sale of sugary drinks entirely."
        ],
        correctAnswer: "Making organ donation the automatic choice on driver's licenses, requiring a signature to opt out.",
        explanation: "Making organ donation automatic with an opt-out option is a classic 'nudge' that relies on status quo bias to increase donation rates without removing freedom (unlike a ban)."
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
