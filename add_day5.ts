import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 5;
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
        title: 'Why Our Minds Make Predictable Mistakes',
        conceptText: `A person opens an app to check one notification and surfaces forty minutes later, holding a phone that somehow made most of the decisions in between. The usual verdict is a lack of self-control. The more accurate verdict is a shortcut working exactly as designed.

The brain was never built to weigh every choice from first principles, so it leans on fast, repeatable rules of thumb instead — patterns psychologists Daniel Kahneman and Amos Tversky spent decades cataloguing under the name "heuristics and biases." Four of the most common show up constantly: confirmation bias, the pull toward information that already agrees with us; availability bias, judging something as common simply because it's memorable; social proof, trusting a choice because many others already made it; and anchoring, letting the first number or fact we see quietly set the scale for every comparison after it.

*The shortcut isn't the mistake. The shortcut is the point.*

None of this is a defect limited to distracted or unintelligent people — psychologists and economists fall for the same patterns in their own lives. What changed the stakes wasn't the biases themselves, which are thousands of years old, but who started paying very close attention to them. The article ahead follows one internal engineering document, built in about five weeks by a handful of people, that turned four ordinary mental shortcuts into a global business model.`,
        conceptSummary: `Cognitive biases are predictable mental shortcuts, not random errors, cataloged extensively by psychologists Daniel Kahneman and Amos Tversky. Confirmation bias favors belief-matching information, availability bias overweights memorable events, social proof trusts existing popularity, and anchoring lets an early number or fact quietly set the scale for every comparison that follows — patterns that are ancient, universal, and still shape choices no one notices making.`,
        conceptTakeaways: [
          "Cognitive biases are predictable, repeatable patterns in thinking, cataloged by psychologists Daniel Kahneman and Amos Tversky — not signs of low intelligence or carelessness.",
          "Confirmation bias, availability bias, social proof, and anchoring are ancient mental patterns — what changed is that companies can now test and refine which one moves behavior fastest, at a massive scale."
        ],
        articleTitle: 'The Formula That Learned to Enjoy Your Anger',
        articleText: `In December 2017, a small team inside Facebook finished a project it had been assembling since November: a single score, calculated for every post, meant to estimate how "meaningful" that post would be to the people about to see it. A like was worth one point. A comment, a reshare, or any of the five reaction emojis — love, haha, wow, sad, and angry — was worth five. An RSVP to an event was worth fifteen. The company called it Meaningful Social Interactions, or MSI, and it went live in early 2018.

The logic wasn't cynical on its face. A reaction takes more effort than a tap, so it should signal a stronger response, and a stronger response should mean better ranking. But a formula doesn't know the difference between a strong response born of delight and a strong response born of fury — it only knows that both produced five points instead of one. Confirmation bias meant people reacted fastest to content that already matched their views, so that content earned points quickly and got shown to more people who shared the same view, deepening the loop. Social proof meant a post already carrying a wave of reactions looked more worth reacting to, so it accumulated more, which pushed it further, which accumulated more still.

*The shortcut isn't the mistake. The shortcut is the point.*

By November 2019, Facebook's own data scientists had the answer to a question nobody had asked out loud in 2017: what kind of content actually earns five-point reactions at scale? Posts drawing a heavy share of angry reactions turned out to be disproportionately likely to carry misinformation, toxicity, and low-quality civic or health content — precisely the material availability bias makes memorable and social proof makes contagious. The company began walking the formula back, cutting the angry reaction's weight to 1.5 points, then, by 2020, to zero. The reversal only became public in 2021, after former employee Frances Haugen supplied the internal research to regulators and journalists.

Anchoring works through a related but distinct trick: not "this is popular" or "this confirms what I think," but "this is the number I'm comparing everything else to." Behavioral economist Dan Ariely demonstrated it with a real subscription page for The Economist. Offered a $59 web-only plan, a $125 print-only plan, and a $125 combined print-and-web plan, 84% of his MIT students chose the combined bundle and not one chose print-only alone. Remove that seemingly pointless print-only option, leaving just the $59 and $125 choices, and the result flipped: 68% now picked the cheaper option. The unwanted middle price hadn't been useless at all — it had quietly set the scale everyone else measured against. This is technically known as the decoy effect, a close cousin of anchoring: both work because people compare options to a reference point rather than judging any single option on its own.

Neither Facebook's engineers nor Ariely's publisher invented the underlying instinct. Confirmation bias, availability bias, social proof, and anchoring all predate every platform now measuring them; Kahneman and Tversky were cataloguing these same patterns in academic journals decades before a single line of the MSI formula was written. What changed is precision: a company can now test a ranking formula against billions of reactions and learn, within months, exactly which emotional lever moves the needle furthest, then adjust the dial in real time. The next time a headline triggers instant anger, a video feels trustworthy because millions already watched it, or a "limited-time" price feels impossible to pass up, the shortcut being triggered isn't new. Only the party running the experiment on the other end of it is.`,
        articleSummary: `Facebook's 2017 ranking formula gave reaction emojis five times the weight of a like, until 2019 research linked heavy "angry" reactions to misinformation and the weight was cut to zero by 2020. Dan Ariely's Economist pricing study showed the same comparison-driven mechanism at work: a decoy option flipped student choices by 52 percentage points without changing either real price on offer.`,
        articleTakeaways: [
          "Facebook's 2017 Meaningful Social Interactions formula weighted every reaction emoji at five times a like, and an event RSVP at fifteen times a like.",
          "By 2019, Facebook's own researchers found that posts drawing heavy angry reactions were disproportionately linked to misinformation and low-quality content, leading the company to cut the angry reaction's weight to zero by 2020.",
          "In Dan Ariely's Economist study, adding a deliberately unattractive $125 print-only option pushed 84% of students toward a $125 bundle; removing that option flipped the majority to the cheaper $59 plan."
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
        questionText: "What did Facebook's 2017 Meaningful Social Interactions formula assign to a reaction emoji (love, haha, wow, sad, or angry) compared to a plain 'like'?",
        options: [
          "The same value as a like",
          "Half the value of a like",
          "Five times the value of a like",
          "Fifteen times the value of a like"
        ],
        correctAnswer: "Five times the value of a like",
        explanation: "Reactions were given a fivefold increase in weight because they signaled more effort than a simple tap."
      },
      {
        questionText: "Why did Facebook eventually reduce, and then eliminate, the extra weight given to the 'angry' reaction?",
        options: [
          "Users complained the angry button was hard to find",
          "Internal research found posts drawing heavy angry reactions were disproportionately linked to misinformation and low-quality content",
          "A government regulation banned emoji-based ranking",
          "The angry reaction was the least-used of the five emojis"
        ],
        correctAnswer: "Internal research found posts drawing heavy angry reactions were disproportionately linked to misinformation and low-quality content",
        explanation: "Internal research showed that the heavy weighting of angry reactions was promoting toxicity and misinformation."
      },
      {
        questionText: "What best distinguishes a cognitive bias from a 'random mistake', according to the lesson?",
        options: [
          "A cognitive bias only happens to people with low intelligence",
          "A cognitive bias is a predictable, repeatable pattern in how people think, not an occasional accident",
          "A cognitive bias only occurs on social media platforms",
          "A cognitive bias is always intentional on the part of the person experiencing it"
        ],
        correctAnswer: "A cognitive bias is a predictable, repeatable pattern in how people think, not an occasional accident",
        explanation: "Cognitive biases are built-in evolutionary shortcuts that are predictable and repeatable across all human minds."
      },
      {
        questionText: "A user keeps getting recommended videos that agree with an opinion they already hold. Which bias is most directly responsible for the algorithm's behavior here?",
        options: [
          "Anchoring",
          "Confirmation bias",
          "Loss aversion",
          "The decoy effect"
        ],
        correctAnswer: "Confirmation bias",
        explanation: "Confirmation bias describes our pull toward information that already agrees with our existing views."
      },
      {
        questionText: "In Dan Ariely's Economist subscription study, what happened once the $125 print-only option was removed, leaving only the $59 web option and the $125 web-and-print option?",
        options: [
          "Preferences stayed exactly the same as before",
          "The majority now chose the cheaper web-only option, reversing the earlier majority preference for the bundle",
          "All students chose the $125 web-and-print option",
          "All students refused to subscribe at all"
        ],
        correctAnswer: "The majority now chose the cheaper web-only option, reversing the earlier majority preference for the bundle",
        explanation: "Removing the decoy (the $125 print-only option) removed the reference point that made the $125 bundle look like a steal."
      },
      {
        questionText: "Why is the Economist 'decoy' example useful for understanding anchoring-related biases, even though it's technically called the decoy effect?",
        options: [
          "Because it shows people evaluate options in comparison to a reference point, rather than in true isolation",
          "Because it proves people always choose the cheapest available option",
          "Because it shows pricing has no real influence on subscription choices",
          "Because it demonstrates that decoys are illegal in most countries"
        ],
        correctAnswer: "Because it shows people evaluate options in comparison to a reference point, rather than in true isolation",
        explanation: "The decoy effect and anchoring both rely on our brains using reference points or initial numbers to set the scale for evaluating other options."
      },
      {
        questionText: "A startup founder wants to design a three-tier pricing page that nudges most customers toward the premium plan. Based on the lesson, what design choice is most directly supported?",
        options: [
          "Make all three tiers identical in price and features",
          "Include a deliberately less attractive 'reference' tier that makes the target tier look like the obviously better deal",
          "Hide the pricing page entirely until checkout",
          "Offer only a single pricing tier with no comparison at all"
        ],
        correctAnswer: "Include a deliberately less attractive 'reference' tier that makes the target tier look like the obviously better deal",
        explanation: "Providing an asymmetric reference point uses the decoy effect to make the targeted option appear highly favorable in comparison."
      },
      {
        questionText: "A social media manager wants to increase engagement quickly, unaware of any long-term downside. Based on the Facebook case, which content type would the 2017-era algorithm have rewarded most heavily?",
        options: [
          "Neutral, purely informational posts with no emotional reaction",
          "Posts that provoke strong emotional reactions, since those reactions counted five times more than a like",
          "Posts with no reactions or comments at all",
          "Posts that are shared only through private messages"
        ],
        correctAnswer: "Posts that provoke strong emotional reactions, since those reactions counted five times more than a like",
        explanation: "Because reactions were given a heavy point multiplier (5x), content that sparked intense emotions (like anger) was highly rewarded by the algorithm."
      },
      {
        questionText: "Which of the following best explains why Facebook's own data scientists became concerned about the algorithm they had built?",
        options: [
          "The formula was too expensive to run on Facebook's servers",
          "The formula rewarded emotional engagement regardless of content quality, and angry-reaction-heavy posts turned out to correlate with misinformation",
          "Users stopped using the reaction emojis altogether",
          "Competing platforms copied the formula and Facebook lost its advantage"
        ],
        correctAnswer: "The formula rewarded emotional engagement regardless of content quality, and angry-reaction-heavy posts turned out to correlate with misinformation",
        explanation: "The algorithm couldn't differentiate between healthy engagement and toxic outrage; angry reactions heavily amplified low-quality civic content."
      },
      {
        questionText: "A viral post about a rare but dramatic event spreads widely because of the strong reactions it generates, then gets recommended to even more users because of how many reactions it has already collected. Which two biases are working together here, in the correct order?",
        options: [
          "Anchoring, then confirmation bias",
          "Availability bias (the event feels common because it's memorable), then social proof (its existing popularity drives further recommendation)",
          "Social proof, then anchoring",
          "Confirmation bias, then loss aversion"
        ],
        correctAnswer: "Availability bias (the event feels common because it's memorable), then social proof (its existing popularity drives further recommendation)",
        explanation: "First, the dramatic nature of the event triggers availability bias (memorability). Then, the massive accumulation of reactions serves as social proof, causing others to trust and amplify it further."
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
