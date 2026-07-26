import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 6;
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
        title: 'When Real Decisions Differ From Economic Models',
        conceptText: `"I can resist everything except temptation," Oscar Wilde wrote in 1892, and handed economists a research problem two centuries early. Aristotle had already named the condition in the Nicomachean Ethics: akrasia, acting against your own better judgment, knowing the right course and walking the other way regardless. Traditional economics prefers to assume this doesn't happen — that a person who knows the better option will simply choose it. Real behavior keeps refusing to cooperate with that assumption.

In 1972, psychologist Walter Mischel offered children at a Stanford preschool a single marshmallow now or two marshmallows if they could wait fifteen minutes alone in a room with it sitting in front of them. Most couldn't wait. The children weren't confused about the math — two is more than one, and every one of them knew it. The gap wasn't in their knowledge. It was in the distance between knowing the better deal and living through the fifteen minutes required to collect it.

*Knowing was never the problem.*

Economists now call this mismatch the rationality-behavior gap: the space between what a person can tell you is the smarter choice and what that same person actually does once the choice is in front of them. It shows up in diets abandoned by Friday, retirement contributions delayed another year, essays started the night before they're due. The article ahead follows it into the one industry that has spent decades quietly measuring the width of that gap for profit.`,
        conceptSummary: `The rationality-behavior gap is the space between what someone knows is the better choice and what they actually do once the moment to choose arrives, rather than a failure to understand the options. Aristotle called this akrasia over two thousand years ago; Walter Mischel's 1972 marshmallow experiment showed children understood the better deal perfectly and still couldn't wait fifteen minutes to collect it.`,
        conceptTakeaways: [
          "The rationality-behavior gap is the space between knowing the better choice and actually making it, not a failure to understand which option is better.",
          "Aristotle named this pattern akrasia in the Nicomachean Ethics; Walter Mischel's 1972 marshmallow experiment showed children understood the better deal but still couldn't wait for it."
        ],
        articleTitle: 'The 76 Percent Problem',
        articleText: `Ask Americans about fast food and a clear majority will tell you exactly what they think of it. In a 2013 Gallup poll of just over 2,000 adults, 76% said the food served at fast-food restaurants is "not too good" or "not good at all" for you — a figure essentially unchanged from a decade earlier. Ask the same population whether they'll eat it again this month, and the answer flips entirely: eight in ten say yes, and almost half say they'll do it again within the week. Only 4% claim they never eat it at all.

This isn't a story about people being misled. Three-quarters of even the weekly fast-food eaters in that same poll still called the food bad for them. They are not confused about the verdict. They are simply living, meal by meal, through the gap between the verdict and the decision.

*Knowing was never the problem.*

The industry didn't create this gap, but it has spent decades quietly optimizing around its exact width. Every design choice at a fast-food chain — the drive-through lane, the mobile order-ahead app, the value-priced combo meal — exists to shrink the effort required to say yes to the immediate option. A grilled-chicken salad prepared at home after a ten-hour shift has to compete against a meal that's ready in under three minutes without the person leaving their car. The contest was never close, because it was never really a contest between two foods. It was a contest between effort now and reward now, against effort now and reward later — and reward now keeps winning the round that matters, which is the one happening at 6:47 p.m. on a Tuesday.

Economist George Loewenstein has a name for the force doing the winning: visceral influences — hunger, fatigue, craving — which don't just compete with rational planning, they actively shrink a person's ability to weigh the future at all while they're active. A person filling out a meal plan on a calm Sunday afternoon and the same person standing hungry in a drive-through line on Tuesday evening are, functionally, making decisions with two different brains. The Sunday version can see the whole month. The Tuesday version can barely see past the next ten minutes, and the entire fast-food business model is built to be waiting exactly there when it arrives.

*Knowing was never the problem.*

Governments tried the obvious countermeasure: more information. Since May 2018, U.S. federal rules have required chain restaurants with twenty or more locations to post calorie counts directly on their menus and menu boards, on the theory that an informed customer facing a number would order differently. The research since has found only modest shifts in what people actually put on their tray. The calorie count was never the missing piece. Diners already suspected, in general terms, that the double cheeseburger outweighed the salad — Gallup's numbers prove they knew the broad verdict decades before a single calorie label was printed. What the label couldn't do was change what happens between wanting to order the salad and standing at the counter, hungry, with a line building behind them.

None of this describes people failing at basic arithmetic. It describes a well-intentioned decision that has to survive contact with a much less patient version of the person who made the plan — the same contact test every commitment device, every default, and every locked account in this course has already been built to help someone pass. Fast food isn't winning because customers don't know better. It's winning because knowing better was never the hard part.`,
        articleSummary: `A 2013 Gallup poll found 76% of Americans call fast food bad for them, yet eight in ten eat it monthly and nearly half eat it weekly. Mandatory calorie labels since 2018 have shifted orders only modestly, because the gap was never about missing information — it was about effort, timing, and how little patience survives an actual hungry moment at the counter.`,
        articleTakeaways: [
          "A 2013 Gallup poll found 76% of Americans consider fast food bad for them, yet 80% eat it at least monthly and nearly half eat it weekly.",
          "Fast-food design — drive-throughs, apps, value meals — works by shrinking the effort required to choose the immediate option, not by hiding its downsides.",
          "Mandatory U.S. calorie labeling since 2018 produced only modest changes in what people order, showing that missing information was rarely the actual obstacle."
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
        questionText: "What did Aristotle's concept of 'akrasia' describe?",
        options: [
          "A lack of knowledge about which choice is correct",
          "Acting against your own better judgment, despite knowing the right course of action",
          "A legal punishment for poor decision-making",
          "A pricing strategy used by ancient merchants"
        ],
        correctAnswer: "Acting against your own better judgment, despite knowing the right course of action",
        explanation: "Akrasia specifically describes acting against your better judgment, showing the gap isn't about missing knowledge."
      },
      {
        questionText: "In Walter Mischel's 1972 marshmallow experiment, what was the actual source of most children's failure to wait?",
        options: [
          "They didn't understand that two marshmallows was more than one",
          "They understood the better deal but couldn't sustain the wait required to get it",
          "The researchers gave misleading instructions",
          "Most children disliked marshmallows"
        ],
        correctAnswer: "They understood the better deal but couldn't sustain the wait required to get it",
        explanation: "The children understood the math completely; their struggle was enduring the time delay."
      },
      {
        questionText: "According to the 2013 Gallup poll cited in the lesson, what percentage of Americans said fast food is 'not too good' or 'not good at all' for you?",
        options: [
          "36%",
          "50%",
          "76%",
          "100%"
        ],
        correctAnswer: "76%",
        explanation: "A clear majority, 76%, acknowledged that fast food is generally bad for them."
      },
      {
        questionText: "Based on the same Gallup poll, roughly what share of Americans said they eat fast food at least monthly?",
        options: [
          "About 4%",
          "About 50%",
          "About 8 in 10",
          "Nearly 100%, with no exceptions"
        ],
        correctAnswer: "About 8 in 10",
        explanation: "Despite the negative view of its health impact, 80% (8 in 10) still ate fast food at least monthly."
      },
      {
        questionText: "Why does the lesson argue that fast-food companies succeed despite widespread belief that their food is unhealthy?",
        options: [
          "Because customers are unaware that the food is unhealthy",
          "Because the companies reduce the effort required to choose the immediate option, which competes more directly with delayed rewards than health information does",
          "Because fast food is significantly cheaper than all other food options in every case",
          "Because health information is illegal to display in restaurants"
        ],
        correctAnswer: "Because the companies reduce the effort required to choose the immediate option, which competes more directly with delayed rewards than health information does",
        explanation: "Fast-food design minimizes friction and effort, ensuring immediate gratification outcompetes future health goals."
      },
      {
        questionText: "What did the lesson report about the effect of mandatory U.S. calorie labeling on restaurant menus since 2018?",
        options: [
          "It eliminated fast-food consumption entirely",
          "It produced only modest changes in what people actually ordered",
          "It had no effect on any customer's behavior whatsoever",
          "It caused all major chains to remove calorie-dense items from their menus"
        ],
        correctAnswer: "It produced only modest changes in what people actually ordered",
        explanation: "Adding information like calorie counts didn't dramatically change behavior because missing information wasn't the main obstacle."
      },
      {
        questionText: "Why does the lesson use calorie labeling as evidence against a purely 'lack of information' explanation for unhealthy eating?",
        options: [
          "Because customers said they had never seen a calorie count before 2018",
          "Because giving people the exact missing number still produced only a small shift in ordering behavior",
          "Because restaurants stopped serving unhealthy food once labeling began",
          "Because calorie labeling was proven scientifically inaccurate"
        ],
        correctAnswer: "Because giving people the exact missing number still produced only a small shift in ordering behavior",
        explanation: "If missing information was the root problem, providing it would have caused a massive shift; instead, the shift was only modest."
      },
      {
        questionText: "A public health official wants to reduce unhealthy snack purchases in workplace vending machines. Based on the lesson's core argument, what is most likely to be an insufficient solution on its own?",
        options: [
          "Simply adding more nutritional information stickers to each snack",
          "Changing which snacks are placed at the most convenient, eye-level, easiest-to-grab positions",
          "Reducing the number of steps needed to buy the healthy option compared to the unhealthy one",
          "Making the healthy option available at the same convenience and speed as the unhealthy one"
        ],
        correctAnswer: "Simply adding more nutritional information stickers to each snack",
        explanation: "Information alone rarely changes behavior in the face of temptation, whereas changing convenience or effort does."
      },
      {
        questionText: "A friend says, 'I know salad is better for me, I just always end up ordering fries.' Based on the lesson, what is the most accurate response?",
        options: [
          "They must not actually understand nutrition",
          "Their behavior reflects a well-documented gap between knowing the better choice and acting on it in the moment, not a knowledge problem",
          "They are lying about wanting to eat healthier",
          "There's no known explanation for this pattern"
        ],
        correctAnswer: "Their behavior reflects a well-documented gap between knowing the better choice and acting on it in the moment, not a knowledge problem",
        explanation: "This describes the classic rationality-behavior gap where intentions fail to survive the moment of choosing."
      },
      {
        questionText: "A company wants to help employees save more for retirement. Based on the reasoning used throughout this lesson about the rationality-behavior gap, which approach is most consistent with what actually closes the gap between intention and action?",
        options: [
          "Send more detailed retirement educational brochures explaining compound interest",
          "Reduce the effort required to take the beneficial action, rather than relying on employees to act on what they already know",
          "Wait for employees to feel fully ready and motivated before offering any plan",
          "Assume that employees who don't save simply don't understand the benefits of saving"
        ],
        correctAnswer: "Reduce the effort required to take the beneficial action, rather than relying on employees to act on what they already know",
        explanation: "Decreasing the friction to take a beneficial action bypasses the rationality-behavior gap much more effectively than just educating."
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
