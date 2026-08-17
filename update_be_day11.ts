import { PrismaClient, Track } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const track = Track.BEHAVIORAL_ECONOMICS;
  const dayOrder = 11;
  const title = "Why People Misunderstand Risk";

  // Check if Day 11 already exists to avoid duplication
  await prisma.lesson.deleteMany({
    where: { track, dayOrder }
  });
  await prisma.quiz.deleteMany({
    where: { track, dayOrder }
  });

  const lessonData = {
    title,
    tag: "ECON",
    timeEstimate: 10,
    dayOrder,
    track: track,
    conceptText: `You take a test for a rare disease. The test is described as highly accurate. The result comes back positive. How worried should you be? Most people, including many doctors, would say very worried, around 95 percent sure they are sick. The real answer is closer to 2 percent. The gap between those two numbers is one of the most important mistakes in human judgment.

This mistake is called base rate neglect. A base rate is the background frequency of something: how common a disease is in the whole population before any test is run. When we focus on a single piece of evidence, like a test result, we tend to forget the base rate completely. We judge the case in front of us and ignore the numbers behind it.

The reason this matters is mathematical. If a disease is very rare, then even a good test produces many false alarms, simply because there are so many healthy people to test. A small error rate applied to a huge healthy group can create more false positives than there are true cases. The positive result is real, but it is far more likely to be a mistake than a discovery.

This is not a trap only for the untrained. When researchers put this exact problem to doctors at one of the world's best medical schools, most of them got it badly wrong, and their answers reveal just how deep the blind spot goes.`,
    conceptSummary: `Base rate neglect is forgetting the background frequency of something when judging a single case. A base rate is how common an event is in the whole population. When a disease is rare, even an accurate test produces many false alarms, because a small error rate applied to a huge healthy group creates more false positives than true cases. A positive result can be more likely wrong than right.`,
    conceptTakeaways: [
      "Base rate neglect is ignoring how common something is in the population when judging a single case or test result.",
      "When a disease is rare, even an accurate test produces many false positives, because the healthy group is so large."
    ],
    articleTitle: "The 1978 Harvard Study on False-Positive Test Results",
    articleText: `You are a doctor at one of Harvard's teaching hospitals. A colleague stops you in the hallway with a quick question. A disease affects one in a thousand people. A test for it has a false-positive rate of five percent. A patient tests positive. What is the chance the patient actually has the disease? Take a moment. Most of the doctors asked this said 95 percent.

**Where does this question come from?**
From a real study. In 1978, researchers named Casscells, Schoenberger, and Graboys stopped 60 people at four Harvard Medical School teaching hospitals — students, junior doctors, and senior physicians — and asked them exactly this question. It was published in the New England Journal of Medicine. The goal was to see how well trained medical minds handle a simple problem about interpreting a test result.

**What answer did most of the doctors give?**
The most common answer was 95 percent. Nearly half of the 60 people said the patient was almost certainly sick. Only about 18 percent gave the correct answer. These were not careless people; they were doctors and students at a top medical school. The problem was not their knowledge of medicine. It was the way they handled the numbers hidden inside the question.

**So what is the correct answer, and why?**
The correct answer is about 2 percent. Picture 1,000 people. One of them truly has the disease and tests positive. Of the other 999, five percent — about 50 people — test positive by mistake. So around 51 people receive a positive result, but only 1 of them is actually sick. That means a positive result is correct only about 1 time in 51, which is roughly 2 percent.

**What did the doctors forget?**
They forgot the base rate. The disease affects only one in a thousand people, so it is rare before any test is run. That rarity is the whole story. When almost no one has the disease, the false positives from the huge healthy group swamp the single true case. The doctors focused on the test's accuracy and ignored how uncommon the disease actually was.

**Why is this mistake so easy to make?**
Because a five-percent error rate sounds small and reassuring, so the mind treats a positive result as almost certain proof. It feels obvious that a rare error means a reliable answer. But the size of the healthy group changes everything. The mind sees the vivid test result in front of it and never stops to ask how many healthy people were tested to produce it.

**Why does base rate neglect matter beyond one quiz question?**
Because the same error shapes real decisions. When later researchers repeated the study in 2014, most doctors still got it wrong. The mistake affects how we read medical screenings, security alarms, and any rare event flagged by a test. Whenever something rare is being detected, ignoring the base rate can turn a useful test into a source of needless fear.`,
    articleSummary: `In 1978, researchers asked 60 people at Harvard's teaching hospitals about a positive test for a rare disease. Most said the patient was 95 percent likely to be sick; the real answer is about 2 percent. They forgot the base rate: because the disease is rare, false positives from the huge healthy group swamp the one true case. A 2014 repeat found the same mistake.`,
    articleTakeaways: [
      "In the 1978 Harvard study, most doctors said a positive result meant 95 percent likely sick, when the true answer was about 2 percent.",
      "Picturing 1,000 people shows why: one true case is swamped by about 50 false positives, so a positive is right only about 1 time in 51.",
      "The same error affects medical screenings, alarms, and any test for a rare event, and a 2014 repeat found most doctors still got it wrong."
    ]
  };

  await prisma.lesson.create({ data: lessonData });
  console.log("Created Lesson Day 11");

  const quizTitle = "Quiz: " + title;
  await prisma.quiz.create({
    data: {
      title: quizTitle,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder,
      track: track,
      questions: {
        create: [
          {
            questionText: "What is a base rate?",
            options: [
              "The share of tests that give a wrong answer at the moment they are run",
              "The price a hospital charges each patient for running just a single test",
              "How common something is in the whole population before any test is run",
              "The speed at which a disease spreads from one person on to another"
            ],
            correctAnswer: "How common something is in the whole population before any test is run",
            explanation: "That describes an error rate, not a base rate.",
            order: 0
          },
          {
            questionText: "What is base rate neglect?",
            options: [
              "Ignoring how common something is when judging a single piece of evidence",
              "Refusing to trust any medical test because tests can sometimes be wrong",
              "Counting the base rate twice so that it affects the final answer too strongly",
              "Believing that a disease is far rarer than it truly is in the population"
            ],
            correctAnswer: "Ignoring how common something is when judging a single piece of evidence",
            explanation: "It is not a refusal to trust tests; it is ignoring background frequency.",
            order: 1
          },
          {
            questionText: "In the study, what did most of the doctors answer?",
            options: [
              "That the patient had almost no chance at all of actually being sick",
              "That the patient was about 95 percent likely to actually be sick",
              "That the test result gave no useful information about the patient at all",
              "That many more tests were needed before any answer was even possible"
            ],
            correctAnswer: "That the patient was about 95 percent likely to actually be sick",
            explanation: "They gave a very high chance, not a very low one.",
            order: 2
          },
          {
            questionText: "Why is the true chance of being sick so low after a positive result?",
            options: [
              "The test used in the study was of a very poor and unusual quality",
              "The doctors had made an error when they first designed the test itself",
              "The disease had already been cured in almost all of the population",
              "The disease is rare, so false positives outnumber the true cases"
            ],
            correctAnswer: "The disease is rare, so false positives outnumber the true cases",
            explanation: "The test was fine; the rarity of the disease drives the result.",
            order: 3
          },
          {
            questionText: "What did the doctors focus on instead of the base rate?",
            options: [
              "The age and full medical history of the specific patient being tested",
              "The total cost of running the test across the whole hospital system",
              "The test's accuracy, treating a positive result as almost certain proof",
              "The opinions of the other doctors who were standing nearby in the hallway"
            ],
            correctAnswer: "The test's accuracy, treating a positive result as almost certain proof",
            explanation: "They were told to assume no symptoms, so history was not it.",
            order: 4
          },
          {
            questionText: "Why does a small error rate cause so many false alarms here?",
            options: [
              "A small error rate applied to a huge healthy group makes many false positives",
              "A small error rate keeps growing larger every time the same test is repeated",
              "A small error rate actually means that the test is broken and unreliable",
              "A small error rate only ever matters when a disease is extremely common"
            ],
            correctAnswer: "A small error rate applied to a huge healthy group makes many false positives",
            explanation: "The error rate does not grow with repetition; the group size matters.",
            order: 5
          },
          {
            questionText: "Why does a five-percent error rate feel so reassuring?",
            options: [
              "Because five percent is the smallest error rate that any test can ever have",
              "Because a small-sounding error makes a positive feel like near-certain proof",
              "Because doctors are trained to ignore any error rate that is below ten percent",
              "Because five percent of a small group is always going to be a very tiny number"
            ],
            correctAnswer: "Because a small-sounding error makes a positive feel like near-certain proof",
            explanation: "Five percent is not the smallest possible error rate.",
            order: 6
          },
          {
            questionText: "What happened when researchers repeated the study years later?",
            options: [
              "Almost every doctor answered the question correctly on the second attempt",
              "The study could not be repeated because the original question had changed",
              "The doctors refused to take part in the repeated version of the study",
              "Most doctors still got the answer wrong, just as they had before"
            ],
            correctAnswer: "Most doctors still got the answer wrong, just as they had before",
            explanation: "Most still got it wrong, not right.",
            order: 7
          },
          {
            questionText: "Beyond medicine, where else does base rate neglect appear?",
            options: [
              "In security alarms and any other test that flags a genuinely rare event",
              "Only in questions that are written specifically for medical students",
              "In situations where an event happens to almost everybody in a group",
              "Only when a test has no false positives at all anywhere in its results"
            ],
            correctAnswer: "In security alarms and any other test that flags a genuinely rare event",
            explanation: "It appears far beyond medical-student questions.",
            order: 8
          },
          {
            questionText: "What is the key habit that helps avoid base rate neglect?",
            options: [
              "Trusting a positive test result as strong proof without any further question",
              "Focusing only on how accurate the test is said to be by its makers",
              "Asking how common the event actually is before trusting a single result",
              "Assuming that any rare disease has already disappeared from the population"
            ],
            correctAnswer: "Asking how common the event actually is before trusting a single result",
            explanation: "Trusting the result blindly is the mistake itself.",
            order: 9
          }
        ]
      }
    }
  });

  console.log("Created Quiz for Day 11.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
