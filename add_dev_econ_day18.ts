import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 18;
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
    title: 'Can Cash Really Reduce Poverty? (Conditional Cash Transfers)',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `Twenty-five million Brazilians receive a small monthly deposit from their government, on one condition: their children have to show up. Not perform, not excel — simply attend school regularly and get their vaccinations. That single administrative requirement is the entire hinge on which one of the largest anti-poverty programs on Earth turns.

A conditional cash transfer gives money to poor households, but only if they take specific actions that build their children's long-term human capital — school attendance, health checkups, vaccinations. The logic sits between two older approaches economists had already tried and found wanting. Handing out cash with no strings attached respects a family's own judgment about its needs, but does nothing to guarantee investment in a child who won't feel the payoff from schooling for another decade. Building schools and clinics respects that long-term case, but does nothing to guarantee a hungry family can afford to send a child there instead of to work. A conditional transfer tries to buy both at once: today's income relief, tied contractually to tomorrow's human capital.

*Money alone buys today. A condition attached to it tries to buy tomorrow as well.*

Brazil's Bolsa Família is the program most economists reach for first, not because it was the earliest conditional cash transfer — Mexico's Progresa preceded it by several years — but because of its sheer scale: the largest conditional cash transfer program ever run, covering roughly a quarter of an entire country's population. The article ahead follows what that scale actually bought.`,
    conceptSummary: `A conditional cash transfer gives poor households direct income support, tied to specific actions — school attendance, health checkups, vaccinations — that build children's long-term human capital. It sits between unconditional cash aid, which guarantees no specific investment, and public services alone, which don't guarantee a family can afford to use them in the first place.`,
    conceptTakeaways: [
      "A conditional cash transfer provides direct income support to poor households, conditional on actions like school attendance and health checkups that build long-term human capital.",
      "Brazil's Bolsa Família, created in 2003 under President Lula, grew to cover roughly 14 million families and over 50 million people, about a quarter of Brazil's population.",
      "The program cost only about 0.4-0.5% of Brazil's GDP in most years, reaching roughly 8.2 billion dollars in 2018, despite its massive scale.",
      "Studies tied to Brazil's administrative records found measurable gains in education, reduced child mortality, and increased use of preventive health care among beneficiary families.",
      "About 75% of beneficiaries are Afro-Brazilian and 54% are women, reflecting a deliberate design choice to direct payments to mothers, whose spending is more reliably directed toward children's needs."
    ],
    articleTitle: 'The Program That Pays Parents to Keep Kids in School',
    articleText: `**How did a program this large come to exist in the first place?**
Bolsa Família was created by Brazil's federal government in 2003, under President Luiz Inácio Lula da Silva, by merging four smaller and less coordinated cash-transfer programs into a single national system. It inherited roughly 8 million beneficiaries from those earlier programs and expanded rapidly from there: 6.6 million families by 2004, climbing to a peak of roughly 14 million families — more than 50 million people, close to a quarter of Brazil's entire population — by the mid-2010s.

**What exactly do families have to do to keep receiving payments?**
Households must register in Brazil's Cadastro Único, a national registry confirming they fall under the poverty or extreme poverty income threshold, and then meet ongoing conditions: children aged 6 to 15 must maintain regular school attendance, children under seven must be monitored for vaccination and nutritional status, and pregnant women must attend prenatal and postpartum checkups. Compliance is tracked locally and reported through Brazil's public health system, turning a cash program into a standing incentive for exactly the human-capital investments a poor household might otherwise defer.

**How much money does a typical family actually receive?**
Not much by rich-country standards, and that's part of the design. Average monthly payments have run around 169 Brazilian reais, roughly 74 U.S. dollars, per family — enough to matter to a household living near the poverty line, not enough to function as anyone's primary income. The entire program has cost between 0.4% and 0.5% of Brazil's GDP in most years, reaching about 30 billion reais, or roughly 8.2 billion dollars, in 2018 — a modest fiscal footprint for a program reaching a quarter of the national population.

**Did the conditions actually change how families behaved, or did the cash alone do the work?**
Evidence points toward both mattering, with the conditions doing real, separate work. Studies using Brazil's own administrative records found measurable, if modest, gains in children's educational attainment tied specifically to program participation, alongside documented reductions in child mortality and increases in the use of primary health care. A study following the "100 Million Brazilian Cohort" even linked the program to reduced rates of preterm birth and lower incidence of leprosy — diseases and outcomes closely tied to poverty and access to prenatal and preventive care, moving in the direction the conditions were designed to push.

**Who actually receives these payments, and does that composition matter?**
The program's demographic footprint says as much about its intent as its dollar figures do: roughly 75% of beneficiaries are Afro-Brazilian, and 54% are women, who receive the payments directly rather than routing them through a male household head. Directing the transfer to mothers specifically reflects a deliberate design choice common across conditional cash transfer programs worldwide, built on evidence that money controlled by mothers is more reliably spent on children's food, health, and schooling than money that passes through other household channels first.

**Has the program survived changes in Brazil's own government?**
Not without disruption. In October 2021, under a different administration, Bolsa Família was replaced by a rebranded program, Auxílio Brasil, promising larger payments and wider coverage. When Lula returned to the presidency, the Bolsa Família name and structure were restored. The repeated rebranding reflects something conditional cash transfers rarely escape anywhere in the world: a genuinely effective anti-poverty tool still has to survive being treated as a political symbol, renamed and reclaimed by whichever government currently holds it.`,
    articleSummary: `Brazil's Bolsa Família, created in 2003, grew to cover roughly 14 million families and over 50 million people, costing only about 0.4-0.5% of GDP, while tying modest monthly payments to school attendance, vaccinations, and prenatal care. Administrative studies link the program to real gains in education, child mortality, and preventive health care, even as it has been renamed and restored across changing political administrations.`,
    articleTakeaways: [
      "A conditional cash transfer provides direct income support to poor households, conditional on actions like school attendance and health checkups that build long-term human capital.",
      "Brazil's Bolsa Família, created in 2003 under President Lula, grew to cover roughly 14 million families and over 50 million people, about a quarter of Brazil's population.",
      "The program cost only about 0.4-0.5% of Brazil's GDP in most years, reaching roughly 8.2 billion dollars in 2018, despite its massive scale.",
      "Studies tied to Brazil's administrative records found measurable gains in education, reduced child mortality, and increased use of preventive health care among beneficiary families.",
      "About 75% of beneficiaries are Afro-Brazilian and 54% are women, reflecting a deliberate design choice to direct payments to mothers, whose spending is more reliably directed toward children's needs."
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
        questionText: "What is a conditional cash transfer?",
        options: [
          "Cash given to households with no requirements attached",
          "Direct income support to poor households, conditional on actions like school attendance or health checkups",
          "A loan that must be repaid with interest",
          "A tax credit available only to high-income households"
        ],
        correctAnswer: "Direct income support to poor households, conditional on actions like school attendance or health checkups",
        explanation: "- A) Wrong — this describes an unconditional cash transfer, the alternative approach the lesson explicitly contrasts with conditional transfers.\\n- B) Correct — this is the exact definition of a conditional cash transfer.\\n- C) Wrong — the lesson describes a direct transfer, not a loan requiring repayment.\\n- D) Wrong — the lesson describes a program targeted at poor households, not high-income ones."
      },
      {
        questionText: "In what year was Brazil's Bolsa Família created, and under which president?",
        options: [
          "1994, under Fernando Henrique Cardoso",
          "2003, under Luiz Inácio Lula da Silva",
          "2010, under Dilma Rousseff",
          "2021, under Jair Bolsonaro"
        ],
        correctAnswer: "2003, under Luiz Inácio Lula da Silva",
        explanation: "- A) Wrong — this is not the year or president the lesson associates with the program's creation.\\n- B) Correct — Bolsa Família was created in 2003 under President Lula.\\n- C) Wrong — 2010 is not identified in the lesson as the founding year.\\n- D) Wrong — 2021 is the year the lesson associates with the program's temporary rebranding as Auxílio Brasil, not its creation."
      },
      {
        questionText: "At its peak, roughly how many people did Bolsa Família reach, according to the lesson?",
        options: [
          "About 1 million",
          "About 10 million",
          "Over 50 million",
          "The entire population of Brazil"
        ],
        correctAnswer: "Over 50 million",
        explanation: "- A) Wrong — this drastically understates the scale described in the lesson.\\n- B) Wrong — this also understates the figure given in the lesson.\\n- C) Correct — at its peak, it reached over 50 million people (close to a quarter of Brazil's population).\\n- D) Wrong — the lesson describes coverage of roughly a quarter of Brazil's population, not the entire population."
      },
      {
        questionText: "What specific conditions must families meet to continue receiving Bolsa Família payments, according to the lesson?",
        options: [
          "No conditions are required once a family is enrolled",
          "School attendance for children aged 6-15, vaccination and nutritional monitoring for children under 7, and prenatal/postpartum checkups for pregnant women",
          "Families must own a registered business",
          "Families must relocate to an urban area"
        ],
        correctAnswer: "School attendance for children aged 6-15, vaccination and nutritional monitoring for children under 7, and prenatal/postpartum checkups for pregnant women",
        explanation: "- A) Wrong — the lesson explicitly identifies specific, ongoing conditions tied to continued eligibility.\\n- B) Correct — these are the precise conditions stated in the article.\\n- C) Wrong — business ownership is not among the conditions described in the lesson.\\n- D) Wrong — relocation is not a condition described anywhere in the lesson."
      },
      {
        questionText: "Approximately what share of Brazil's GDP has Bolsa Família cost in most years, according to the lesson?",
        options: [
          "About 0.4-0.5%",
          "About 15%",
          "About 50%",
          "About 90%"
        ],
        correctAnswer: "About 0.4-0.5%",
        explanation: "- A) Correct — despite reaching a quarter of the population, the program's fiscal footprint was modest, around 0.4-0.5% of GDP.\\n- B) Wrong — this drastically overstates the fiscal footprint described in the lesson.\\n- C) Wrong — this also vastly overstates the cost described in the lesson.\\n- D) Wrong — no program of this kind approaches this scale of a country's GDP."
      },
      {
        questionText: "What did studies using Brazil's administrative records find regarding the program's effects, according to the lesson?",
        options: [
          "No measurable effects of any kind",
          "Measurable gains in education, reduced child mortality, and increased use of preventive health care",
          "A significant increase in child labor",
          "A significant decrease in school attendance"
        ],
        correctAnswer: "Measurable gains in education, reduced child mortality, and increased use of preventive health care",
        explanation: "- A) Wrong — the lesson describes specific, documented effects tied to program participation.\\n- B) Correct — studies showed actual gains aligned with the program's conditional incentives.\\n- C) Wrong — the lesson describes outcomes moving in the opposite direction, toward greater investment in children's health and education.\\n- D) Wrong — the lesson explicitly ties the program to improved school attendance and educational attainment, not a decrease."
      },
      {
        questionText: "(Scenario) A policymaker is designing a new anti-poverty program and is deciding between unconditional cash transfers and conditional cash transfers modeled on Bolsa Família. Based on the lesson, what is the key trade-off to weigh?",
        options: [
          "Unconditional transfers guarantee investment in children's long-term human capital, while conditional transfers do not",
          "Conditional transfers attempt to combine income relief with specific incentives for long-term human capital investment, while unconditional transfers offer more flexibility but no such guarantee",
          "There is no meaningful difference between the two approaches",
          "Conditional transfers always cost significantly more than unconditional transfers of equal size"
        ],
        correctAnswer: "Conditional transfers attempt to combine income relief with specific incentives for long-term human capital investment, while unconditional transfers offer more flexibility but no such guarantee",
        explanation: "- A) Wrong — this reverses the lesson's description; conditional transfers, not unconditional ones, specifically tie aid to human-capital-building actions.\\n- B) Correct — this accurately captures the logic described in the text: conditioning cash tries to buy both present relief and future human capital.\\n- C) Wrong — the lesson explicitly distinguishes between the two approaches and their respective trade-offs.\\n- D) Wrong — cost differences between the two approaches aren't the trade-off the lesson focuses on; the design logic is."
      },
      {
        questionText: "(Scenario) An economist notes that Bolsa Família directs the majority of its payments to mothers rather than fathers. Based on the lesson, what is the most directly supported reason for this design choice?",
        options: [
          "It has no bearing on how the money is ultimately spent",
          "Evidence suggests money controlled by mothers is more reliably spent on children's food, health, and schooling",
          "It was required by Brazilian law with no connection to spending outcomes",
          "Fathers are ineligible to receive any government payments in Brazil"
        ],
        correctAnswer: "Evidence suggests money controlled by mothers is more reliably spent on children's food, health, and schooling",
        explanation: "- A) Wrong — the lesson explicitly attributes this design choice to differences in spending patterns based on who controls the funds.\\n- B) Correct — directing funds to women is a deliberate choice because it yields higher investments in children.\\n- C) Wrong — the lesson frames this as a deliberate design choice based on evidence, not merely a legal requirement disconnected from outcomes.\\n- D) Wrong — the lesson doesn't describe fathers as categorically ineligible; the design choice concerns which household member typically receives the payment."
      },
      {
        questionText: "(Logical) Why does the lesson describe the program's renaming to Auxílio Brasil and subsequent restoration as reflecting something conditional cash transfers \"rarely escape\"?",
        options: [
          "Because cash transfer programs are always cancelled entirely once a new government takes power",
          "Because even effective anti-poverty programs can become political symbols, subject to rebranding or restructuring as political administrations change",
          "Because Bolsa Família was proven ineffective and had to be discontinued",
          "Because Auxílio Brasil was an entirely unrelated program with no connection to Bolsa Família"
        ],
        correctAnswer: "Because even effective anti-poverty programs can become political symbols, subject to rebranding or restructuring as political administrations change",
        explanation: "- A) Wrong — the lesson describes rebranding and restoration, not full, permanent cancellation of the underlying program.\\n- B) Correct — the text highlights that effective tools are often rebranded as political symbols by shifting governments.\\n- C) Wrong — the lesson cites documented positive effects, not evidence of ineffectiveness leading to cancellation.\\n- D) Wrong — the lesson explicitly frames Auxílio Brasil as a rebranded and restructured version of the same underlying program."
      },
      {
        questionText: "(Hard/Logical) Based on the lesson, which factor most directly explains why Bolsa Família's fiscal cost (0.4-0.5% of GDP) remained relatively modest despite reaching roughly a quarter of Brazil's population?",
        options: [
          "The program relied on very large payments to a very small number of households",
          "The program combined broad reach with relatively small individual payments, averaging roughly 74 U.S. dollars per family per month",
          "The program only operated for a single year before being discontinued",
          "The program excluded the vast majority of Brazil's poor population from eligibility"
        ],
        correctAnswer: "The program combined broad reach with relatively small individual payments, averaging roughly 74 U.S. dollars per family per month",
        explanation: "- A) Wrong — the lesson describes broad reach across a large population, not concentration among a small number of households.\\n- B) Correct — the modest cost relative to GDP is explained by the combination of wide coverage and intentionally small per-household payments.\\n- C) Wrong — the lesson describes a program that has operated continuously for two decades, not a single year.\\n- D) Wrong — the lesson explicitly describes the program reaching roughly a quarter of Brazil's total population, not excluding most of the poor."
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
