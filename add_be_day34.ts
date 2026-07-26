import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 34;
  const track = Track.BEHAVIORAL_ECONOMICS;
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
    title: 'Why Inequality Feels Unfair (Inequity Aversion)',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `Classical economics assumes that individuals measure their financial well-being in absolute terms. If your annual income increases from $40,000 to $50,000, standard models predict that your overall utility and happiness must increase, regardless of what happens to anyone else's paycheck. But human psychology does not evaluate satisfaction in isolation. We process financial outcomes through social comparison, measuring our worth and fairness relative to those around us.

In behavioral economics, this phenomenon is captured by inequity aversion—the fundamental human preference for fairness and equal distributions, alongside a natural resistance to unequal outcomes. Behavioral economists Ernst Fehr and Klaus Schmidt demonstrated that people experience two distinct forms of inequity aversion:

Disadvantageous Inequity Aversion: The psychological distress experienced when you receive less than others in your reference group (often generating feelings of envy, resentment, or injustice).
Advantageous Inequity Aversion: The psychological discomfort experienced when you receive significantly more than others (often triggering guilt or concern over social stability).

Imagine two employees, Person A and Person B, who perform the exact same job duties at different companies, and both earn an identical salary of $60,000 per year. Person A works in an office where every colleague earns $60,000. Person B works in an office where every colleague doing identical work earns $90,000.

In absolute financial terms, Person A and Person B have identical purchasing power. Yet, Person A feels valued and satisfied, while Person B feels underpaid, disrespected, and demotivated. Inequity aversion explains why relative standing often matters far more than absolute earnings: human beings judge fairness by comparing their efforts and rewards against the outcomes of others.`,
    conceptSummary: `Classical economics views wealth in absolute terms, but human psychology is deeply governed by inequity aversion—the preference for fair distribution and the psychological distress caused by unequal outcomes. People experience discomfort when earning less than peers (disadvantageous inequity) or significantly more (advantageous inequity), proving that social comparison dictates financial satisfaction as much as purchasing power.`,
    conceptTakeaways: [
      "Inequity Aversion: The psychological preference for equitable distribution and the distress triggered by unfair economic splits.",
      "Two Dimensions: Humans suffer from both disadvantageous inequity (feeling under-rewarded) and advantageous inequity (feeling over-rewarded at others' expense).",
      "Relative vs. Absolute: Financial satisfaction depends heavily on comparative social standing rather than absolute dollar figures.",
      "Social Comparison: People continuously measure their efforts and payouts against relevant reference groups.",
      "Behavioral Reality: Ignoring relative fairness leads to demotivation, envy, and social conflict even in growing economies."
    ],
    articleTitle: 'South Africa and the Problem of Relative Pay',
    articleText: `**Why does absolute income fail to measure human economic satisfaction?**
For decades, traditional economic growth models equated higher national gross domestic product (GDP) or rising individual wages with increasing overall well-being. Economists assumed that as long as a worker’s personal purchasing power expanded, their financial satisfaction would follow. However, real-world data continuously shows that people living in growing economies often report rising dissatisfaction if wealth gains are distributed unequally. Satisfaction is not driven solely by what is on our paychecks, but by how that compensation compares to our peers, neighbors, and historical reference points.

**How did wage disparities in post-apartheid South Africa spark deep economic friction?**
When South Africa transitioned to democracy in 1994 following the fall of Apartheid, the nation faced complex economic reconciliation. While the end of formal segregation opened legal and political avenues for Black South Africans, deep structural income disparities persisted across racial lines. In many industries, workers performing identical manual or technical tasks earned wildly disparate wages based on historical classifications. Even as absolute wages for low-income workers began to rise in post-apartheid trade negotiations, widespread dissatisfaction and industrial strikes erupted across mining and manufacturing sectors.

**Why did wage increases fail to calm labor unrest after political transition?**
From a purely classical perspective, rising real wages should have satisfied labor unions. But behavioral economists studying South Africa's post-apartheid labor market point directly to disadvantageous inequity aversion. Workers were not evaluating their lives against their poverty under apartheid; they were evaluating their compensation against corporate management and higher-paid colleagues in the same facilities. Seeing executive compensation and high-tier salaries soar while frontline workers received minor incremental gains created a intense perception of unfairness. The absolute wage increase felt like an insult when contrasted against the widening relative gap.

**How do social reference groups dictate our perception of fairness?**
Inequity aversion relies heavily on the concept of reference groups—the specific peer sets individuals choose for comparison. A worker rarely compares their salary to a billionaire living in another country; instead, they compare themselves to people in similar roles, workplaces, or communities.

**What happens when workers change who they compare themselves against?**
In post-apartheid South Africa, trade union negotiations made income disparities transparent, shifting workers' reference groups from local communities to national industry standards. Once disparities within the same firm became visible, workers demanded structural wage compression—reducing the ratio between the highest and lowest earners—rather than just nominal pay raises.

**What lessons does inequity aversion hold for modern corporate and public policy design?**
The lessons of post-apartheid wage negotiations apply globally to modern workplaces and national policies. When leaders attempt to solve morale or labor disputes by offering small across-the-board raises while allowing executive pay ratios to explode, they often exacerbate dissatisfaction rather than fixing it. True institutional stability requires addressing relative disparities alongside absolute gains. Transparent compensation structures, profit-sharing models, and narrowed wage ratios satisfy the human need for equity, building cooperative economic environments where growth is experienced as fair by all participants.`,
    articleSummary: `Following the end of Apartheid in South Africa, rising absolute wages failed to prevent widespread labor strikes because workers evaluated their well-being through relative comparison. Disadvantageous inequity aversion caused workers to focus on the widening gap between frontline pay and executive compensation. The South African experience demonstrates that long-term economic stability and worker satisfaction depend on addressing relative income disparities and establishing fair reference standards rather than simply increasing nominal wages.`,
    articleTakeaways: [
      "Post-apartheid South African wage negotiations struggled because nominal wage growth did not eliminate deep relative inequality.",
      "Frontline workers evaluated their pay against corporate executives and industry peers rather than past baseline conditions.",
      "Disadvantageous inequity aversion drove labor walkouts, proving that absolute wage increases cannot mask systemic unfairness.",
      "Shifting social reference groups alters worker expectations and fairness demands in wage bargaining.",
      "Sustainable workplace and public policy requires managing pay ratios and transparent compensation structures to maintain trust."
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
        questionText: "What is the core definition of \"disadvantageous inequity aversion\" in behavioral economics?",
        options: [
          "The desire to avoid paying taxes on high investment earnings",
          "The psychological distress or resentment experienced when an individual receives less than their comparative peers",
          "The financial penalty imposed by governments on corporations with low profit margins",
          "The preference for taking high-risk investments during economic recessions"
        ],
        correctAnswer: "The psychological distress or resentment experienced when an individual receives less than their comparative peers",
        explanation: "- A) Wrong — this describes tax avoidance.\\n- B) Correct — disadvantageous inequity occurs when one feels unfairly under-rewarded compared to a reference group.\\n- C) Wrong — this involves tax policy, not human psychology.\\n- D) Wrong — this describes risk preferences, not social comparison."
      },
      {
        questionText: "Two employees, Maya and Leo, earn $55,000 per year doing the exact same job. Maya is surrounded by peers earning $55,000, while Leo learns his team members earn $80,000. According to inequity aversion, how will Leo most likely feel?",
        options: [
          "Highly satisfied because his absolute purchasing power matches Maya's",
          "Completely indifferent because relative comparisons do not affect economic utility",
          "Dissatisfied and demotivated due to disadvantageous inequity relative to his immediate reference group",
          "Grateful that his company generates enough revenue to pay others higher wages"
        ],
        correctAnswer: "Dissatisfied and demotivated due to disadvantageous inequity relative to his immediate reference group",
        explanation: "- A) Wrong — inequity aversion dictates that Leo will not focus solely on absolute purchasing power.\\n- B) Wrong — relative comparisons heavily impact utility.\\n- C) Correct — Leo will experience distress because his peers earn significantly more for the exact same work.\\n- D) Wrong — very few people respond to severe wage inequality with gratitude."
      },
      {
        questionText: "Why did rising absolute wages in post-apartheid South Africa fail to prevent ongoing labor strikes in major industries?",
        options: [
          "Because workers were legally prohibited from accepting pay raises",
          "Because international inflation converted all wage gains into negative real income",
          "Because workers evaluated their pay relative to high-earning executives and historic systemic gaps, causing disadvantageous inequity distress",
          "Because commercial banks refused to open accounts for trade union members"
        ],
        correctAnswer: "Because workers evaluated their pay relative to high-earning executives and historic systemic gaps, causing disadvantageous inequity distress",
        explanation: "- A) Wrong — workers were not prohibited from taking raises.\\n- B) Wrong — although inflation mattered, the primary social trigger was inequality.\\n- C) Correct — absolute gains could not offset the psychological friction caused by massive relative disparities within the firms.\\n- D) Wrong — banking access was not the driving force of these specific labor strikes."
      },
      {
        questionText: "What is a \"reference group\" in the context of economic social comparison?",
        options: [
          "The group of international central banks that set global interest rates",
          "The specific set of peers, colleagues, or neighbors an individual uses as a benchmark for comparison",
          "A collection of stocks used to calculate national inflation metrics",
          "The legal team hired by a corporation during wage arbitrations"
        ],
        correctAnswer: "The specific set of peers, colleagues, or neighbors an individual uses as a benchmark for comparison",
        explanation: "- A) Wrong — this describes monetary authorities.\\n- B) Correct — reference groups are the specific people we compare our own outcomes against to determine if we are treated fairly.\\n- C) Wrong — this describes a consumer price index basket.\\n- D) Wrong — this is an arbitration team, unrelated to psychological metrics."
      },
      {
        questionText: "(Scenario) A company gives all frontline staff a 5% raise, but simultaneously grants corporate executives a 100% bonus increase. Frontline employee morale drops sharply, and turnover rises. What concept best explains the employees' reaction?",
        options: [
          "Exponential time discounting",
          "Inequity aversion driven by widening relative pay ratios",
          "Arbitrage maximization",
          "The crowding-out effect of intrinsic motivation"
        ],
        correctAnswer: "Inequity aversion driven by widening relative pay ratios",
        explanation: "- A) Wrong — this deals with how people value future versus present money.\\n- B) Correct — despite receiving an absolute gain (5%), the frontline staff reacted negatively to the massive disparity in relative gains.\\n- C) Wrong — arbitrage is risk-free financial trading.\\n- D) Wrong — crowding out involves replacing intrinsic motivation with extrinsic rewards, not relative pay gaps."
      },
      {
        questionText: "How can corporate leaders effectively apply behavioral insights on fairness to improve long-term workforce retention?",
        options: [
          "By keeping all compensation metrics secret and forbidding employees from speaking to each other",
          "By focusing exclusively on small annual pay raises while expanding executive bonuses",
          "By establishing transparent compensation structures and narrowing extreme wage gaps between top and bottom earners",
          "By replacing human staff with automated systems whenever labor disputes arise"
        ],
        correctAnswer: "By establishing transparent compensation structures and narrowing extreme wage gaps between top and bottom earners",
        explanation: "- A) Wrong — keeping metrics secret often breeds paranoia and is sometimes illegal.\\n- B) Wrong — expanding gaps worsens inequity aversion.\\n- C) Correct — narrowing wage gaps and operating transparently directly addresses inequity aversion and builds organizational trust.\\n- D) Wrong — this does not apply behavioral insights to manage human fairness."
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
