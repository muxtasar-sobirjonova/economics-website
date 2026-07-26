import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 19;
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
    title: 'Why Where You Live Matters (Urban-Rural Poverty Gaps)',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `Two children can be born in the same Chinese province, months apart, one to parents who moved to Shanghai for factory work and one to parents who stayed on the family's registered rural land. One of them can attend Shanghai's public schools; the other, legally, often cannot. The difference has nothing to do with where either child currently lives. It has to do with a document their grandparents were issued in 1958.

An urban-rural poverty gap describes the persistent income and opportunity difference between a country's cities and its countryside — a gap that shows up almost everywhere in the world to some degree, since cities concentrate capital, skilled jobs, and infrastructure in ways farmland rarely does. What makes some gaps far wider and more durable than others is whether a government treats the divide as a natural byproduct of geography, or actively enforces it through the rules determining who gets access to what, regardless of where a person actually lives and works.

*A border doesn't have to run along a coastline. Sometimes it runs through a filing cabinet.*

China's hukou household registration system is the clearest available case of the second kind of gap — one built by policy rather than left to develop on its own. The article ahead follows what that policy has meant for the tens of millions of people caught on the wrong side of it.`,
    conceptSummary: `An urban-rural poverty gap describes the persistent income and opportunity difference between a country's cities and countryside. Gaps widen and persist for far longer when a government actively enforces the divide through rules determining access to services, rather than leaving it to develop naturally from geography, infrastructure, and market forces alone.`,
    conceptTakeaways: [
      "An urban-rural poverty gap is the persistent income and opportunity difference between cities and countryside, which widens and persists longer when actively enforced by policy rather than left to geography alone.",
      "China's hukou system, established in the late 1950s, classifies citizens as rural or urban based on family lineage, tying access to public services to that registration rather than actual residence.",
      "An estimated 61 million Chinese children live apart from at least one migrating parent, because rural-hukou status often blocks access to urban public education for children who move with their parents.",
      "Nearly a quarter of rural Chinese children live on less than 1.60 dollars a day, compared to about 9% of urban children, and left-behind children report lower confidence in their own futures.",
      "Among children living in the same major cities, only about 24% from low-skilled migrant families attend college, compared to roughly 96% from high-skilled urban-hukou families — showing hukou status, not geography, drives much of the gap."
    ],
    articleTitle: 'The Document That Decides Which City You\'re Allowed to Belong To',
    articleText: `**What exactly is the hukou system, and how old is it?**
Established in the late 1950s, hukou is China's household registration system, classifying every citizen at birth as either an "agricultural" (rural) or "non-agricultural" (urban) resident, tied to a specific locality determined through family lineage. For most of its history, changing that classification, even after physically relocating, was extraordinarily difficult — meaning a person's access to public services has depended less on where they live today than on where the system decided their family belonged nearly seven decades ago.

**Why does this classification matter so much in practice?**
Because access to public education, healthcare, and social insurance in China has historically been tied directly to registered hukou status rather than physical residence. A rural-hukou migrant who moves to Beijing for work can live and labor there for years without gaining the local public school enrollment, subsidized healthcare, or housing benefits that an urban-hukou resident of the same city receives automatically. The system doesn't just describe an urban-rural divide; it actively manufactures one inside the same city block.

**What happens to the children of migrant workers under this system?**
Often, they're left behind. Because rural-hukou parents frequently cannot secure urban public education for children who move with them, an estimated 61 million Chinese children live apart from at least one migrating parent, typically raised by grandparents or other relatives in the countryside instead. Roughly a quarter of all rural children fall into this "left-behind" category, and research has documented real consequences: nearly a quarter of rural children live on less than 1.60 U.S. dollars a day, compared to about 9% of urban children, and left-behind children report measurably lower confidence in their own futures than children raised alongside their parents.

**Does the gap persist even among children who do migrate with their parents?**
It does, and starkly. Research on migrant families in major cities like Beijing and Shanghai found that only about 24% of children from low-skilled migrant families with rural hukou go on to attend college, compared with roughly 96% of children from high-skilled urban-hukou families in the same cities. Living in the same metropolis, attending schools a few kilometers apart, these two groups of children face outcomes that diverge almost as sharply as the urban-rural gap itself — proof that the hukou line, not simple geography, is doing most of the work.

**Has China tried to close this gap, and with what success?**
Reforms since 2014 have relaxed some rigid rural-urban hukou distinctions, particularly in smaller cities, making it somewhat easier for migrants to convert their registration status. But researchers tracking educational outcomes still find that the wage and opportunity gap between hukou groups persists even after controlling for a worker's education and skills directly — evidence that the classification itself, not simply the human capital differences it correlates with, continues to shape labor-market outcomes on its own.

**So is China's urban-rural divide really about geography at all?**
Barely. Geography explains why cities pay more than farms almost everywhere on Earth; it doesn't explain why two children raised blocks apart in the same city, with comparable ambition and comparable effort from their parents, arrive at radically different college outcomes. The hukou system took a economic gap that exists to some degree in every country and turned it into an inherited legal status — one a family's grandchildren still carry, largely unchanged, from a registration decision made in 1958.`,
    articleSummary: `China's hukou system, established in the late 1950s, ties access to education, healthcare, and social insurance to a person's registered rural or urban status rather than where they actually live, leaving an estimated 61 million children separated from migrating parents. Even migrant children living in major cities see college attendance rates near 24%, versus 96% for local urban-hukou children — showing the divide is enforced by registration status, not simply geography.`,
    articleTakeaways: [
      "An urban-rural poverty gap is the persistent income and opportunity difference between cities and countryside, which widens and persists longer when actively enforced by policy rather than left to geography alone.",
      "China's hukou system, established in the late 1950s, classifies citizens as rural or urban based on family lineage, tying access to public services to that registration rather than actual residence.",
      "An estimated 61 million Chinese children live apart from at least one migrating parent, because rural-hukou status often blocks access to urban public education for children who move with their parents.",
      "Nearly a quarter of rural Chinese children live on less than 1.60 dollars a day, compared to about 9% of urban children, and left-behind children report lower confidence in their own futures.",
      "Among children living in the same major cities, only about 24% from low-skilled migrant families attend college, compared to roughly 96% from high-skilled urban-hukou families — showing hukou status, not geography, drives much of the gap."
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
        questionText: "What is China's hukou system?",
        options: [
          "A tax on rural-to-urban migration",
          "A household registration system classifying citizens as rural or urban, tied to family lineage rather than current residence",
          "A national identification card required only for international travel",
          "A voluntary program families can opt into at any age"
        ],
        correctAnswer: "A household registration system classifying citizens as rural or urban, tied to family lineage rather than current residence",
        explanation: "- A) Wrong — hukou is a registration classification system, not a direct tax on migration itself.\\n- B) Correct — this is the definition of the hukou system.\\n- C) Wrong — hukou governs domestic access to services, not international travel documentation.\\n- D) Wrong — hukou status has historically been assigned at birth through family lineage, not chosen voluntarily at any age."
      },
      {
        questionText: "When was China's hukou system established, according to the lesson?",
        options: [
          "The 1920s",
          "The late 1950s",
          "The 1990s",
          "2014"
        ],
        correctAnswer: "The late 1950s",
        explanation: "- A) Wrong — this predates the system's actual establishment described in the lesson.\\n- B) Correct — the system was established in the late 1950s (specifically 1958).\\n- C) Wrong — the 1990s is not identified as the founding period in the lesson.\\n- D) Wrong — 2014 is identified as a period of reform relaxing some hukou distinctions, not its founding."
      },
      {
        questionText: "According to the lesson, approximately how many Chinese children live apart from at least one migrating parent due to hukou-related barriers?",
        options: [
          "About 1 million",
          "About 61 million",
          "About 500 million",
          "Every child in China"
        ],
        correctAnswer: "About 61 million",
        explanation: "- A) Wrong — this drastically understates the figure given in the lesson.\\n- B) Correct — an estimated 61 million Chinese children live apart from migrating parents.\\n- C) Wrong — this drastically overstates the figure given in the lesson.\\n- D) Wrong — the lesson describes a specific subset of children affected, not the entire child population."
      },
      {
        questionText: "What share of rural Chinese children were found to live on less than 1.60 U.S. dollars a day, compared to urban children, according to the lesson?",
        options: [
          "Nearly a quarter of rural children, compared to about 9% of urban children",
          "About 9% of rural children, compared to nearly a quarter of urban children",
          "Both groups had identical rates",
          "No rural or urban children were found to live in this condition"
        ],
        correctAnswer: "Nearly a quarter of rural children, compared to about 9% of urban children",
        explanation: "- A) Correct — nearly 25% of rural children face this level of poverty compared to 9% of urban children.\\n- B) Wrong — this reverses the actual figures given in the lesson for rural versus urban children.\\n- C) Wrong — the lesson describes clearly differing rates between the two groups, not identical ones.\\n- D) Wrong — the lesson provides specific, nonzero figures for both groups."
      },
      {
        questionText: "According to research cited in the lesson, what share of children from low-skilled migrant families with rural hukou attended college in major cities like Beijing and Shanghai?",
        options: [
          "About 96%",
          "About 50%",
          "About 24%",
          "0%"
        ],
        correctAnswer: "About 24%",
        explanation: "- A) Wrong — 96% is the figure given for children of high-skilled urban-hukou families, not migrant families.\\n- B) Wrong — this figure does not match either group described in the lesson.\\n- C) Correct — only about 24% of children from these rural hukou families attend college.\\n- D) Wrong — the lesson describes a nonzero, if low, college attendance rate for this group."
      },
      {
        questionText: "What does the comparison between migrant children and urban-hukou children living in the same cities most directly demonstrate, according to the lesson?",
        options: [
          "That geography alone fully explains urban-rural gaps in outcomes",
          "That hukou status itself, not simply physical location, plays a major role in shaping educational outcomes",
          "That migrant children always outperform urban-hukou children academically",
          "That hukou status has no measurable effect on educational outcomes"
        ],
        correctAnswer: "That hukou status itself, not simply physical location, plays a major role in shaping educational outcomes",
        explanation: "- A) Wrong — the lesson uses this exact comparison to argue against geography alone as the explanation.\\n- B) Correct — because the children live in the same city, geography cannot explain the difference; hukou status does.\\n- C) Wrong — the lesson describes migrant children facing substantially lower college attendance rates, not higher.\\n- D) Wrong — the lesson presents this comparison specifically as evidence of hukou's measurable effect."
      },
      {
        questionText: "(Scenario) A researcher wants to determine whether a country's urban-rural income gap is driven mainly by geography or by government policy. Based on the lesson's reasoning, what kind of evidence would most strongly support the \"policy-driven\" explanation?",
        options: [
          "Finding that people living in the same city have very similar outcomes regardless of registration status",
          "Finding that people living in the same city have sharply different outcomes based on an inherited registration status, despite comparable current circumstances",
          "Finding that rural areas have less physical infrastructure than urban areas",
          "Finding that all countries have identical urban-rural income gaps"
        ],
        correctAnswer: "Finding that people living in the same city have sharply different outcomes based on an inherited registration status, despite comparable current circumstances",
        explanation: "- A) Wrong — similar outcomes despite differing status would suggest registration status has little independent effect, contradicting the policy-driven explanation.\\n- B) Correct — if people in the exact same location have different outcomes purely due to inherited status, it shows policy is creating the divide.\\n- C) Wrong — differing infrastructure is consistent with a geography-driven explanation, not specifically a policy-driven one.\\n- D) Wrong — identical gaps across all countries wouldn't help distinguish between geography- and policy-driven causes."
      },
      {
        questionText: "(Scenario) A city government is considering whether to extend local public school access to all resident children regardless of hukou status. Based on the lesson, what outcome would this change be most likely to affect directly?",
        options: [
          "The overall population of the country",
          "The gap in college attendance rates between migrant and local children living in the same city",
          "The total land area of the city",
          "The country's national currency exchange rate"
        ],
        correctAnswer: "The gap in college attendance rates between migrant and local children living in the same city",
        explanation: "- A) Wrong — a local school access policy wouldn't directly affect the country's total population.\\n- B) Correct — allowing all children access to public schools regardless of hukou status would most directly impact the educational outcomes and college attendance rates.\\n- C) Wrong — school access policy has no direct bearing on a city's physical land area.\\n- D) Wrong — currency exchange rates aren't tied to local school registration policy in the lesson's reasoning."
      },
      {
        questionText: "(Logical) Why does the lesson describe hukou-based restrictions as turning an economic gap into \"an inherited legal status\"?",
        options: [
          "Because hukou status is determined entirely by a person's own current income",
          "Because hukou classification is passed down through family lineage rather than reflecting a person's current residence or effort",
          "Because hukou status changes automatically every time a person moves",
          "Because hukou has no connection to family background at all"
        ],
        correctAnswer: "Because hukou classification is passed down through family lineage rather than reflecting a person's current residence or effort",
        explanation: "- A) Wrong — the lesson describes hukou as determined by family lineage, not directly by current income.\\n- B) Correct — it is \"inherited\" because it stems from family lineage (the 1958 document) and travels with you regardless of personal location or effort.\\n- C) Wrong — the lesson describes hukou status as historically very difficult to change even after relocation, not automatically updated.\\n- D) Wrong — the lesson explicitly ties hukou classification to family lineage."
      },
      {
        questionText: "(Hard/Logical, comparative) Based on the lesson, which best explains why reforms since 2014 relaxing some hukou distinctions have not fully closed the wage and opportunity gap between hukou groups?",
        options: [
          "The reforms eliminated the hukou system entirely with immediate full equality",
          "Researchers found the gap persists even after controlling for education and skills, suggesting the classification itself continues to shape outcomes beyond what reforms so far have addressed",
          "The reforms only applied to people who had never migrated at all",
          "No reforms of any kind have been attempted since the system's founding"
        ],
        correctAnswer: "Researchers found the gap persists even after controlling for education and skills, suggesting the classification itself continues to shape outcomes beyond what reforms so far have addressed",
        explanation: "- A) Wrong — the lesson describes partial relaxation of distinctions, not full elimination of the hukou system with immediate equality.\\n- B) Correct — researchers still find a gap tied to the classification itself after controlling for skills, indicating the label is still holding weight.\\n- C) Wrong — the lesson describes reforms aimed at easing conversion of registration status for migrants specifically.\\n- D) Wrong — the lesson explicitly describes reforms beginning in 2014, contradicting the claim that none were attempted."
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
