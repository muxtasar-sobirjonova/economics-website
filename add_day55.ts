import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 55;
  const tag = "Week 8";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Two regions from very different points in their own development can each produce a genuinely impressive flagship company — and comparing those two companies as if they're competing on the same scale usually misses the more useful question entirely.</p>

<p><strong>Comparing ecosystems</strong> means evaluating two different regional startup environments not by which is "better" in some absolute sense, but by what <strong>stage of ecosystem development</strong> each represents, and what kind of company that stage naturally tends to produce. A mature, already-dense ecosystem — one with prior successes, experienced local capital, and a recycling network of mentors and investors — tends to produce companies that compete globally almost from day one, because international ambition is already the local default. An earlier-stage ecosystem, still building its foundational capital, infrastructure, and domestic proof-of-concept, tends to first produce companies solving large, obvious, local infrastructure gaps, because that's where the clearest, most immediately capturable value sits.</p>

<p>This is why comparing two ecosystems purely by company valuation or global reach, without accounting for how many decades of accumulated density one has versus the other, produces a <em>misleading judgment about which ecosystem is executing "better"</em> — when it may really just be measuring which ecosystem is further along its own development curve.</p>

<p>The more useful comparison asks a different question: <u>what does each ecosystem's flagship company reveal</u> about the specific stage that ecosystem is at, and what similar or different challenges will its next generation of founders likely face? A mature ecosystem's SaaS company and an earlier-stage ecosystem's infrastructure company aren't really in competition with each other. They're each the <em>natural product of very different starting conditions</em>.</p>`;

  const conceptSummary = `Comparing ecosystems means evaluating what stage of development each represents, not which produced the "better" company. Mature, dense ecosystems tend to produce globally-ambitious companies from day one; earlier-stage ecosystems tend to first produce companies solving local infrastructure gaps, where the clearest value sits. Comparing purely by valuation or global reach, without accounting for each ecosystem's accumulated density, misleadingly measures development stage rather than genuine execution quality.`;

  const conceptTakeaways = [
    "Comparing ecosystems means evaluating each one's stage of development, not simply which produced a \"better\" company.",
    "Mature, dense ecosystems tend to produce companies with global ambition from day one.",
    "Earlier-stage ecosystems tend to first produce companies solving large, obvious local infrastructure gaps.",
    "Comparing purely by valuation or global reach can mislead by measuring development stage rather than execution quality.",
    "The useful question is what each flagship company reveals about its ecosystem's stage and its next generation's likely path."
  ];

  const articleTitle = "Same Region of the World, Two Completely Different Kinds of Success";
  
  const articleText = `<p><strong>How can two countries produce two completely different kinds of flagship startups?</strong></p>

<p>Pipedrive, founded in 2010 in Tallinn, Estonia, by five Estonian founders, built a sales CRM software product aimed at a global customer base from early on, going through Y Combinator and later taking majority investment from U.S.-based Vista Equity Partners in 2020. Click, an Uzbek fintech and payments platform, built its core business around a specific local infrastructure gap: enabling digital payments and bill-pay services within Uzbekistan's own developing digital economy.</p>

<p><strong>Why did Pipedrive aim globally from day one, while Click focused on solving a problem specifically inside Uzbekistan?</strong></p>

<p>Estonia's ecosystem, already dense with prior successes like Skype, Wise, and Bolt, and capital used to funding globally-ambitious software bets, made a global-from-day-one SaaS strategy the natural default. Uzbekistan's ecosystem, still building its foundational domestic digital infrastructure and investor base, made <u>solving an obvious, large, local infrastructure gap</u> the more natural and immediately valuable opportunity available at that specific point in its development.</p>

<p><strong>Does this mean Estonia's ecosystem is simply \"ahead\" of Uzbekistan's in some absolute sense?</strong></p>

<p>It's less that one is \"ahead\" and more that each ecosystem's flagship company reflects the actual opportunity available at its specific stage. Estonia had already solved many of its own domestic infrastructure gaps years earlier, freeing its founders to target global markets directly. Uzbekistan's largest immediate opportunities are still domestic infrastructure gaps precisely because they haven't been fully solved yet — <em>not because its founders are any less capable</em>.</p>

<p><strong>What should Uzbekistan's next generation of founders actually expect, based on how Estonia's ecosystem evolved?</strong></p>

<p>Estonia's own earlier flagship companies also first solved specific local or regional problems before later ecosystem density allowed founders to target global markets by default. Wise's original currency-conversion frustration was a specific, personal problem before it became a global product. <u>Uzbekistan's local-infrastructure-first companies</u>, like Click and Didox, may be playing a similar earlier role — seeding the density and capital confidence a later generation could use to go global more readily.</p>

<p><strong>If you were an investor deciding whether to back a domestic-infrastructure company in an earlier-stage ecosystem or a global-ambition SaaS company in a mature one, would you judge them by the same standard, or by different ones entirely?</strong></p>

<p>Judging both by the same standard — for instance, \"which will become a global SaaS giant fastest\" — misunderstands what each ecosystem's stage actually calls for. The domestic-infrastructure company's success is <em>better measured by how much of a foundational, still-missing local gap it closes</em>, a different but equally legitimate kind of value than global SaaS scale.</p>

<p><strong>So which ecosystem actually produced the \"better\" company — Estonia's or Uzbekistan's?</strong></p>

<p>The question itself assumes a single scale both should be measured against. A mature, digital-first ecosystem and an earlier-stage, infrastructure-building one aren't competing on the same axis. Comparing them usefully means <u>asking what each company reveals about its own ecosystem's specific stage</u>, not which produced the bigger valuation.</p>`;

  const articleSummary = `Pipedrive, founded in Estonia in 2010, built a globally-ambitious SaaS company from early on, reflecting its ecosystem's already-dense capital and prior successes. Click, an Uzbek fintech platform, focused on solving a specific domestic payments infrastructure gap, reflecting an earlier-stage ecosystem still building its foundational conditions. Rather than one being "better," each company reflects the natural opportunity available at its ecosystem's specific stage of development.`;

  const articleTakeaways = [
    "Pipedrive, founded in Estonia in 2010, built a globally-ambitious SaaS product from early on.",
    "Click, an Uzbek fintech platform, focused on solving a domestic payments infrastructure gap.",
    "Each company's strategy reflects its ecosystem's stage of development, not a difference in founder capability.",
    "Estonia's own earlier flagship companies, like Wise, also first solved local problems before later global ambition became the default.",
    "Comparing ecosystems usefully means asking what each flagship company reveals about its ecosystem's stage, not which is objectively \"better\"."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Comparing Entrepreneurial Ecosystems",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
        tag // Sync the tag to Week 8
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
        questionText: "What does \"comparing ecosystems\" mean, as defined in this lesson?",
        options: [
          "Evaluating which ecosystem produced the objectively better company regardless of context",
          "Evaluating what stage of development each ecosystem represents, and what kind of company that stage naturally tends to produce",
          "Ranking countries purely by total startup funding raised",
          "A government-administered scoring system for national economies"
        ],
        correctAnswer: "Evaluating what stage of development each ecosystem represents, and what kind of company that stage naturally tends to produce",
        explanation: "this is the exact definition given. A, C, and D are fabricated or oversimplified claims."
      },
      {
        questionText: "According to this lesson, why do mature, dense ecosystems tend to produce companies with global ambition from day one?",
        options: [
          "Private equity firms require them to do so",
          "Because international ambition is already the local default, supported by prior successes and experienced capital",
          "Because mature ecosystems have no domestic market opportunities remaining at all",
          "Because founders in mature ecosystems are inherently more talented"
        ],
        correctAnswer: "Because international ambition is already the local default, supported by prior successes and experienced capital",
        explanation: "this is the lesson's direct explanation. A, C, and D are fabricated or unsupported claims."
      },
      {
        questionText: "Why do earlier-stage ecosystems tend to first produce companies solving local infrastructure gaps, per this lesson?",
        options: [
          "Because international expansion is illegal for companies in earlier-stage ecosystems",
          "Because the clearest, most immediately capturable value sits in solving large, obvious local gaps that haven't been addressed yet",
          "Because earlier-stage ecosystems have no domestic consumers at all",
          "Because founders in earlier-stage ecosystems lack the ability to build global products"
        ],
        correctAnswer: "Because the clearest, most immediately capturable value sits in solving large, obvious local gaps that haven't been addressed yet",
        explanation: "this is the lesson's direct explanation. A, C, and D are fabricated or unsupported claims."
      },
      {
        questionText: "Why does this lesson argue that comparing two ecosystems purely by company valuation can be misleading?",
        options: [
          "Because valuation is always calculated incorrectly for companies outside the United States",
          "Because it can measure which ecosystem has accumulated more decades of density, rather than which is executing better at its own specific stage",
          "Because valuation has no relationship to any economic concept whatsoever",
          "Because only earlier-stage ecosystems can produce accurately valued companies"
        ],
        correctAnswer: "Because it can measure which ecosystem has accumulated more decades of density, rather than which is executing better at its own specific stage",
        explanation: "this is the lesson's central warning. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "You're an investor deciding whether to judge a domestic-infrastructure company in an earlier-stage ecosystem by the same standard as a global-ambition SaaS company in a mature ecosystem. Based on this lesson, what should guide your evaluation?",
        options: [
          "Apply an identical standard to both, since ecosystem stage has no bearing on appropriate evaluation criteria",
          "Recognize that each company's success should be measured against what its own ecosystem's stage actually calls for, not a single shared standard like global SaaS scale",
          "Always favor the domestic-infrastructure company, since local problems are inherently more valuable",
          "Always favor the global-ambition company, since global reach is inherently more valuable"
        ],
        correctAnswer: "Recognize that each company's success should be measured against what its own ecosystem's stage actually calls for, not a single shared standard like global SaaS scale",
        explanation: "this reflects the lesson's central argument about stage-appropriate evaluation. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "You're advising a founder in an earlier-stage ecosystem who wants to build a globally-ambitious SaaS product immediately, skipping any domestic-market-focused stage. Based on this lesson, what should this founder consider?",
        options: [
          "Nothing — skipping straight to global ambition is always the correct strategy regardless of ecosystem stage",
          "Whether their ecosystem has already built the domestic proof-of-concept, capital confidence, and infrastructure that a mature ecosystem's founders could rely on, or whether solving a domestic gap first might be the more natural path given their specific stage",
          "Global ambition is illegal for founders in earlier-stage ecosystems",
          "Ecosystem stage has no bearing on what kind of company a founder should build"
        ],
        correctAnswer: "Whether their ecosystem has already built the domestic proof-of-concept, capital confidence, and infrastructure that a mature ecosystem's founders could rely on, or whether solving a domestic gap first might be the more natural path given their specific stage",
        explanation: "this reflects the lesson's core argument about matching strategy to ecosystem stage. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A mature ecosystem's flagship company targets global markets from inception, while an earlier-stage ecosystem's flagship company focuses on a specific domestic infrastructure gap. Based on this lesson, what does this difference most likely reflect?",
        options: [
          "A difference in founder talent between the two ecosystems",
          "A difference in each ecosystem's stage of development and the type of opportunity most immediately available at that stage",
          "A random, unexplainable variation with no underlying pattern",
          "Evidence that one ecosystem's founders are fundamentally more ambitious than the other's"
        ],
        correctAnswer: "A difference in each ecosystem's stage of development and the type of opportunity most immediately available at that stage",
        explanation: "this is a direct application of the lesson's central argument. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "An earlier-stage ecosystem's flagship company successfully solves a major domestic infrastructure gap, seeding capital confidence and experienced talent for the region. Based on this lesson, what might this company's role resemble from an ecosystem earlier in Estonia's own development?",
        options: [
          "No comparable pattern exists — every ecosystem's development is entirely unique with no similar parallel",
          "A role similar to Estonia's own earlier flagship companies, which also first solved specific local problems before later ecosystem density allowed global ambition to become the default",
          "A pattern that only applies to Uzbekistan specifically and cannot be compared to any other region",
          "Evidence that the ecosystem has already reached full maturity"
        ],
        correctAnswer: "A role similar to Estonia's own earlier flagship companies, which also first solved specific local problems before later ecosystem density allowed global ambition to become the default",
        explanation: "this is a direct application of the lesson's comparison between Wise's origin and Uzbekistan's current infrastructure-focused companies. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "Two analysts compare a mature ecosystem's globally-focused SaaS company and an earlier-stage ecosystem's domestic-infrastructure company using identical valuation-based criteria, concluding the mature ecosystem is simply \"better\" at producing startups. Based on this lesson, what is the flaw in this comparison?",
        options: [
          "There is no flaw — valuation is always the correct, sole basis for comparing ecosystems",
          "The comparison fails to account for each ecosystem's accumulated density and stage of development, potentially measuring which ecosystem is further along rather than which is executing better",
          "Valuation-based comparisons are illegal under international economic standards",
          "The flaw is that the mature ecosystem should have been judged as objectively worse instead"
        ],
        correctAnswer: "The comparison fails to account for each ecosystem's accumulated density and stage of development, potentially measuring which ecosystem is further along rather than which is executing better",
        explanation: "this is a direct application of the lesson's central warning about misleading comparisons. A, C, and D all contradict or misapply this reasoning."
      },
      {
        questionText: "A region's earlier-stage flagship company focuses on solving a domestic infrastructure gap rather than pursuing immediate global expansion. Based on this lesson, what would be the most useful question to ask about this company's broader significance?",
        options: [
          "Whether it has achieved a higher valuation than a mature ecosystem's flagship company",
          "What this company reveals about its ecosystem's current stage of development and what its success might mean for the region's next generation of founders",
          "Whether it should be judged by the exact same standard as a mature ecosystem's global SaaS company",
          "Whether the company should immediately abandon its domestic focus to compete globally"
        ],
        correctAnswer: "What this company reveals about its ecosystem's current stage of development and what its success might mean for the region's next generation of founders",
        explanation: "this is a direct application of the lesson's core reframing of what a useful ecosystem comparison actually asks. A, C, and D all contradict this reasoning."
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
