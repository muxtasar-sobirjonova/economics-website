import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 21;
  const track = "DEVELOPMENT_ECONOMICS";
  console.log(`Starting update for Day \${dayOrder} (\${track})...`);

  // UPDATE OR CREATE QUIZ
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
        title: "Chapter 3 Review Quiz",
        tag: track,
        timeEstimate: 10
      }
    });
  } else {
      quiz = await prisma.quiz.update({
          where: { id: quiz.id },
          data: {
              title: "Chapter 3 Review Quiz",
              timeEstimate: 10
          }
      })
  }

  if (quiz) {
    // Delete existing questions
    await prisma.quizQuestion.deleteMany({
      where: { quizId: quiz.id }
    });

    const questions = [
      {
        questionText: "A country's Gini coefficient has remained between 0.63 and 0.68 for over two decades, despite several changes in government and continued fiscal transfers that reduce measured inequality by roughly 20 points. What does this combination most strongly suggest?",
        options: [
          "The underlying causes of inequality are temporary and will resolve on their own within a few more years",
          "The underlying causes are structural — likely tied to unequal land, education, and job access — since transfers are holding the level steady rather than driving it down",
          "The fiscal transfers are actually increasing inequality every year",
          "Gini coefficients cannot be affected by any government policy under any circumstances"
        ],
        correctAnswer: "The underlying causes are structural — likely tied to unequal land, education, and job access — since transfers are holding the level steady rather than driving it down",
        explanation: "- A) Wrong — two decades of stability across multiple governments is inconsistent with a temporary cause that would be expected to fade.\\n- B) Correct — it suggests structural factors are driving up the pre-transfer Gini continuously, forcing transfers to simply maintain a high baseline rather than lower it.\\n- C) Wrong — the transfers are described as reducing, not increasing, measured inequality relative to what it would otherwise be.\\n- D) Wrong — the scenario itself describes a measurable 20-point reduction from fiscal policy, contradicting this option."
      },
      {
        questionText: "Two countries begin at nearly identical income per person, then split under different economic systems for several decades. One ends up with income 50 times higher than the other. What is the most economically defensible explanation for a gap this large, given identical starting populations and geography?",
        options: [
          "Random chance alone, with no identifiable mechanism",
          "Differences in institutions — property rights, price signals, openness to trade — that determined whether investment compounded over time",
          "One country simply had access to better weather throughout the entire period",
          "The gap must be a measurement error, since starting conditions were identical"
        ],
        correctAnswer: "Differences in institutions — property rights, price signals, openness to trade — that determined whether investment compounded over time",
        explanation: "- A) Wrong — a sustained, compounding gap of this magnitude over decades is not well explained by random variation alone.\\n- B) Correct — differences in fundamental economic institutions are the most defensible explanation for how identical starting conditions can diverge so drastically over time.\\n- C) Wrong — weather differences aren't a plausible driver of a 50-fold income gap sustained across an entire national economy.\\n- D) Wrong — this kind of divergence, driven by institutional differences compounding over decades, is a well-documented pattern, not necessarily an error."
      },
      {
        questionText: "A country's income inequality rose sharply during the early decades of a growth boom, then declined only modestly in later decades even as several specific drivers of inequality showed partial reversal. What would be the most economically sound way to interpret the partial, rather than complete, decline?",
        options: [
          "The Kuznets-style reversal happened exactly as originally predicted, with nothing left to explain",
          "At least one driver of inequality — such as wealth concentration — likely continued rising even as income-based drivers eased, preventing a full reversal",
          "Inequality data collected after the initial rise should be considered unreliable and ignored",
          "A partial decline proves that growth has no relationship to inequality at any stage"
        ],
        correctAnswer: "At least one driver of inequality — such as wealth concentration — likely continued rising even as income-based drivers eased, preventing a full reversal",
        explanation: "- A) Wrong — a full, clean reversal would not leave a gap between what was predicted and what was actually observed.\\n- B) Correct — a partial reversal suggests some drivers (like income dispersion) fell while others (like wealth concentration) continued rising.\\n- C) Wrong — dismissing later data as unreliable isn't a sound analytical response to a partial rather than complete trend reversal.\\n- D) Wrong — the scenario explicitly describes inequality rising and then partially declining, which is itself evidence of some relationship between growth and inequality."
      },
      {
        questionText: "A conditional cash transfer program requires school attendance and health checkups in exchange for a modest monthly payment, costing under 0.5% of GDP while reaching a quarter of the population. What does the program's ability to reach this scale at this cost primarily depend on?",
        options: [
          "Extremely large payments made to a very small group of wealthy households",
          "A combination of broad eligibility and comparatively small individual payments per household",
          "A complete absence of any administrative or eligibility requirements",
          "Funding entirely from foreign governments rather than the country's own budget"
        ],
        correctAnswer: "A combination of broad eligibility and comparatively small individual payments per household",
        explanation: "- A) Wrong — large payments to a small wealthy group would not explain reaching a quarter of the population at a low fiscal cost.\\n- B) Correct — programs of this kind rely on reaching many households with individual payments small enough to keep total costs low.\\n- C) Wrong — the scenario explicitly describes specific eligibility and conditional requirements, not an absence of any requirements.\\n- D) Wrong — the scenario does not specify foreign funding as the basis for the program's affordability."
      },
      {
        questionText: "A conditional cash transfer program is found to improve school attendance and reduce child mortality among beneficiary households, based on administrative data comparing beneficiaries to similar non-beneficiary families. What would most strengthen confidence that the program itself, rather than some other factor, caused these outcomes?",
        options: [
          "Simply observing that beneficiary families are poorer than non-beneficiary families",
          "Comparing outcomes between beneficiary and closely matched non-beneficiary households with similar starting characteristics, isolating the program's effect",
          "Assuming any correlation automatically proves the program caused the outcome",
          "Ignoring non-beneficiary households entirely in the analysis"
        ],
        correctAnswer: "Comparing outcomes between beneficiary and closely matched non-beneficiary households with similar starting characteristics, isolating the program's effect",
        explanation: "- A) Wrong — simply noting a poverty difference doesn't isolate the program's specific causal effect from other confounding factors.\\n- B) Correct — comparing closely matched households (who differ mainly in whether they received the program) is the best way to isolate the program's specific causal effect.\\n- C) Wrong — correlation alone, without matching or comparison, does not establish that the program specifically caused the outcome.\\n- D) Wrong — excluding a comparison group entirely removes the basis for evaluating whether the program had any distinct effect."
      },
      {
        questionText: "In a country where access to public services depends on an inherited registration status rather than current residence, two children living in the same city show very different educational outcomes tied to that status. What does this pattern most directly demonstrate about the source of the gap?",
        options: [
          "The gap is driven primarily by differences in local geography between the two children",
          "The gap is driven substantially by policy — the registration-based restriction on service access — rather than by physical location alone",
          "The gap has no identifiable cause and cannot be studied",
          "The gap would disappear immediately if both children simply lived farther apart"
        ],
        correctAnswer: "The gap is driven substantially by policy — the registration-based restriction on service access — rather than by physical location alone",
        explanation: "- A) Wrong — both children live in the same city, ruling out a geography-based explanation for the difference in this specific comparison.\\n- B) Correct — because the children live in the same city, geography cannot explain the difference; the policy restricting service access does.\\n- C) Wrong — the scenario identifies a specific, traceable policy mechanism behind the differing outcomes.\\n- D) Wrong — the scenario's key finding is that shared location does not equalize outcomes when registration status differs, making increased distance an irrelevant factor."
      },
      {
        questionText: "A poverty measurement based only on household income shows a modest decline in poverty over a decade, while a broader measurement incorporating health, education, and living standards shows a much smaller improvement over the same period. What is the most economically sound explanation for this divergence?",
        options: [
          "The two measurements must be tracking two entirely unrelated countries",
          "Households may be crossing the income line while still lacking adequate schooling, sanitation, or health conditions that the broader measure also tracks",
          "Broader poverty measurements are always identical to income-based ones by definition",
          "The divergence proves that income poverty measurements are entirely meaningless"
        ],
        correctAnswer: "Households may be crossing the income line while still lacking adequate schooling, sanitation, or health conditions that the broader measure also tracks",
        explanation: "- A) Wrong — the scenario describes two measurements of the same population over the same period, not different countries.\\n- B) Correct — a household can rise above an income threshold while still suffering from multiple deprivations in services or health that the broader index catches.\\n- C) Wrong — the entire premise of the scenario is that the two measurements are diverging, contradicting an assumption of identical results.\\n- D) Wrong — the scenario doesn't support discarding income measurement entirely, only recognizing its limits relative to a broader measure."
      },
      {
        questionText: "A large share of a global poverty count is concentrated among children specifically, more than among adults, when poverty is measured using health, education, and living-standard indicators rather than income alone. What is the most defensible explanation for this concentration?",
        options: [
          "Children are excluded from all poverty measurements by definition",
          "Indicators like missed vaccinations, interrupted schooling, and malnutrition compound over a lifetime, making children more likely to register as deprived on a measure built around these conditions",
          "Children always have higher personal incomes than adults",
          "The measurement method has no logical connection to age at all"
        ],
        correctAnswer: "Indicators like missed vaccinations, interrupted schooling, and malnutrition compound over a lifetime, making children more likely to register as deprived on a measure built around these conditions",
        explanation: "- A) Wrong — the scenario explicitly describes children being counted within the measurement, not excluded from it.\\n- B) Correct — deprivations in health and schooling fall disproportionately on children, for whom these missed investments compound over a lifetime.\\n- C) Wrong — personal income is not the basis of a measure built around health, education, and living standards.\\n- D) Wrong — the scenario describes indicators specifically tied to childhood development, directly connecting the measure to age-related outcomes."
      },
      {
        questionText: "A large share of a country's poorest population, measured across health, education, and living standards, lives in rural rather than urban areas, even though income poverty lines alone show a smaller urban-rural gap. What would this discrepancy most likely indicate?",
        options: [
          "Rural areas have identical living standards to urban areas in every respect",
          "Rural households may clear an income poverty line while still lacking adequate infrastructure, schooling, or healthcare access that a broader measure captures",
          "Income-based poverty lines always overstate rural poverty relative to urban poverty",
          "There is no meaningful difference between rural and urban poverty under any measurement approach"
        ],
        correctAnswer: "Rural households may clear an income poverty line while still lacking adequate infrastructure, schooling, or healthcare access that a broader measure captures",
        explanation: "- A) Wrong — the scenario specifically describes a gap in living standards between rural and urban areas, contradicting a claim of identical conditions.\\n- B) Correct — rural areas often lack the public infrastructure (clinics, schools, sanitation) that urban areas have, meaning rural residents show higher poverty on a multidimensional measure even if their incomes are similar.\\n- C) Wrong — the scenario describes the income-based measure showing a smaller, not larger, gap than the broader measure, the opposite of overstatement.\\n- D) Wrong — the scenario explicitly documents a meaningful, measurable difference under the broader measurement approach."
      },
      {
        questionText: "A country experiencing ongoing violent conflict shows a disproportionately high share of multidimensional poverty relative to countries at peace with similar income levels. What is the most economically coherent explanation for this relationship?",
        options: [
          "Conflict has no effect on schools, clinics, or infrastructure, so the relationship must be coincidental",
          "Conflict destroys the schools, clinics, and infrastructure that underlie health, education, and living-standard indicators, while resulting deprivation makes recovery harder, reinforcing the pattern",
          "Multidimensional poverty measurement automatically excludes any country experiencing conflict",
          "Income levels alone fully determine multidimensional poverty with no role for conflict whatsoever"
        ],
        correctAnswer: "Conflict destroys the schools, clinics, and infrastructure that underlie health, education, and living-standard indicators, while resulting deprivation makes recovery harder, reinforcing the pattern",
        explanation: "- A) Wrong — the scenario's entire premise is a real, non-coincidental relationship between conflict and elevated poverty measures.\\n- B) Correct — conflict directly targets the infrastructure (health, education, living standards) that makes up the multidimensional index, creating a reinforcing cycle.\\n- C) Wrong — the scenario explicitly describes measuring and comparing conflict-affected countries, meaning they are included in the analysis.\\n- D) Wrong — the scenario presents conflict as an additional, meaningful factor beyond income level, not something income alone fully accounts for."
      },
      {
        questionText: "A country with abundant natural resources spends the twentieth century sliding from among the world's richest nations to a much lower relative ranking, marked by repeated currency collapses and sovereign defaults. Which explanation is more economically defensible: resource scarcity, or accumulated policy and institutional instability?",
        options: [
          "Resource scarcity, since the country clearly lacked valuable natural resources",
          "Accumulated policy and institutional instability, since the country had resource abundance but still experienced repeated disruptions undermining long-term investment",
          "Neither factor has any bearing on long-run national income rankings",
          "The decline must be a data recording error, since resource-rich countries always remain wealthy"
        ],
        correctAnswer: "Accumulated policy and institutional instability, since the country had resource abundance but still experienced repeated disruptions undermining long-term investment",
        explanation: "- A) Wrong — the scenario explicitly describes a resource-abundant country, ruling out resource scarcity as the explanation.\\n- B) Correct — resource wealth cannot guarantee sustained prosperity if policies repeatedly generate inflation, default, and instability that undermine long-term investment.\\n- C) Wrong — the scenario ties the decline directly to specific instability events with real economic consequences.\\n- D) Wrong — resource abundance does not guarantee sustained wealth if institutions and policy repeatedly disrupt long-term investment."
      },
      {
        questionText: "A country's incremental capital-output ratio more than triples over fifteen years while its investment share of GDP remains roughly constant. Based strictly on this pattern, what should happen to its GDP growth rate, holding all else equal?",
        options: [
          "Growth should accelerate, since investment share remained the same",
          "Growth should tend to slow, since the same investment now produces proportionally less additional output",
          "Growth would be entirely unrelated to this ratio",
          "Growth would immediately become negative in every case"
        ],
        correctAnswer: "Growth should tend to slow, since the same investment now produces proportionally less additional output",
        explanation: "- A) Wrong — a worsening capital-output ratio implies weaker, not stronger, growth from the same level of investment.\\n- B) Correct — a higher ratio means more capital is required to produce a single unit of new output, slowing growth if the overall investment rate doesn't rise.\\n- C) Wrong — the capital-output ratio is directly defined by its relationship to investment and growth outcomes.\\n- D) Wrong — a worsening ratio implies slower growth relative to before, not necessarily an outright contraction."
      },
      {
        questionText: "Two households receive identical monthly cash payments, but only one is required to keep children enrolled in school and attend regular health checkups. Based strictly on the logic behind conditional transfer design, which household is more likely to show measurable gains in children's long-term health and education outcomes?",
        options: [
          "The household with no conditions attached, since unconditional cash always outperforms conditional cash",
          "The household required to meet school and health conditions, since the conditions specifically target the investments the transfer is designed to encourage",
          "Neither household would show any difference, since the cash amount is identical",
          "Only the wealthier of the two households would show any measurable difference"
        ],
        correctAnswer: "The household required to meet school and health conditions, since the conditions specifically target the investments the transfer is designed to encourage",
        explanation: "- A) Wrong — this reverses the specific design logic described, which ties conditions directly to targeted human-capital investments.\\n- B) Correct — the conditions explicitly require the behaviors (schooling, health checks) that drive the intended human-capital gains.\\n- C) Wrong — the entire rationale for attaching conditions is that they produce a measurable difference beyond the cash amount alone.\\n- D) Wrong — relative wealth between the two households isn't the variable distinguishing them in this scenario; the condition itself is."
      },
      {
        questionText: "A researcher finds that in a developing economy's earlier decades, rising inequality coincided with faster local growth, but at the same economy's much higher current income level, rising inequality coincides with slower growth. What does this shift most likely reflect?",
        options: [
          "A measurement mistake that should be disregarded entirely",
          "A changing relationship between inequality and growth as an economy develops, consistent with early-stage transition gains giving way to inequality acting as a drag at higher income levels",
          "Proof that inequality and growth are always unrelated at every income level",
          "Evidence that the earlier data was fabricated"
        ],
        correctAnswer: "A changing relationship between inequality and growth as an economy develops, consistent with early-stage transition gains giving way to inequality acting as a drag at higher income levels",
        explanation: "- A) Wrong — a consistent, direction-specific shift across income levels is a substantive finding, not indicative of a simple measurement mistake.\\n- B) Correct — this matches the theory that inequality may facilitate early-stage transition growth but eventually act as a drag on aggregate demand or human capital accumulation later.\\n- C) Wrong — the scenario describes two distinct, measurable relationships at different income levels, not an absence of any relationship.\\n- D) Wrong — nothing in the scenario suggests fabrication; it describes a documented shift in a measured relationship over time."
      },
      {
        questionText: "A government relaxes some restrictions tying public service access to inherited registration status, but researchers still find a wage gap between registration groups even after controlling for education and skill levels. What does this residual gap most likely indicate?",
        options: [
          "The registration classification itself continues to affect outcomes independent of measurable skills and education",
          "Education and skill differences fully explain 100% of the gap, leaving nothing unexplained",
          "The reform completely eliminated any effect of registration status",
          "Wage gaps of this kind never have any connection to formal classification systems"
        ],
        correctAnswer: "The registration classification itself continues to affect outcomes independent of measurable skills and education",
        explanation: "- A) Correct — if a wage gap persists after controlling for skills, the registration status itself is still likely acting as an independent barrier in the labor market.\\n- B) Wrong — a residual gap remaining after controlling for these factors directly contradicts a claim that they fully explain it.\\n- C) Wrong — the persistence of a gap after the reform contradicts a claim of complete elimination.\\n- D) Wrong — the scenario specifically ties the wage gap to a formal classification system."
      },
      {
        questionText: "A country's fiscal transfers reduce its measured Gini coefficient substantially, yet the pre-transfer (market income) Gini remains among the highest in the world. What does this combination reveal about where the underlying inequality originates?",
        options: [
          "The inequality originates primarily in the tax-and-transfer system itself, not in market outcomes",
          "The inequality originates substantially in market-level outcomes — wages, land, and asset ownership — with fiscal policy only partially offsetting it",
          "There is no remaining inequality once transfers are accounted for",
          "Transfers and market outcomes are entirely unrelated to each other"
        ],
        correctAnswer: "The inequality originates substantially in market-level outcomes — wages, land, and asset ownership — with fiscal policy only partially offsetting it",
        explanation: "- A) Wrong — the transfer system is described as reducing, not creating, the measured inequality gap.\\n- B) Correct — a very high pre-transfer Gini shows the inequality is generated in the market (before government intervention), which the government then offsets to some degree.\\n- C) Wrong — the scenario explicitly states the post-transfer Gini remains among the highest in the world, meaning inequality persists.\\n- D) Wrong — the scenario directly relates the two by showing how much one offsets the other."
      },
      {
        questionText: "A wealthy household and a poor household in the same country experience an identical percentage income shock during a recession. Based purely on the concept of a poverty trap, which household is more likely to see that shock translate into a lasting reduction in future earning capacity?",
        options: [
          "The wealthy household, since percentage losses always matter more in absolute terms",
          "The poor household, since a poverty trap describes how low income constrains investment in health, education, or productive assets that would otherwise support recovery",
          "Neither household would be affected differently, since the percentage shock is identical",
          "Only the household located in an urban area would be affected"
        ],
        correctAnswer: "The poor household, since a poverty trap describes how low income constrains investment in health, education, or productive assets that would otherwise support recovery",
        explanation: "- A) Wrong — the poverty trap mechanism concerns the ability to invest and recover, not the absolute size of the loss.\\n- B) Correct — the poor household is more likely to respond to the shock by cutting essential investments (like children's schooling or healthcare), causing a lasting reduction in earning capacity.\\n- C) Wrong — an identical percentage shock can have very different consequences depending on each household's ability to absorb it without cutting essential investment.\\n- D) Wrong — urban versus rural location isn't the distinguishing factor in this specific comparison; income level and its effect on investment capacity is."
      },
      {
        questionText: "A poverty index reports that two-thirds of the people it counts as poor live in middle-income countries rather than the poorest, low-income countries. What does this finding suggest about the relationship between a country's average income and the poverty experienced within it?",
        options: [
          "A rising national average income automatically eliminates all forms of measured poverty",
          "A rising national average income does not automatically eliminate specific, overlapping deprivations in health, education, or living standards for a large population within that country",
          "Middle-income countries always have higher poverty rates than low-income countries",
          "This finding is impossible and must reflect a data error"
        ],
        correctAnswer: "A rising national average income does not automatically eliminate specific, overlapping deprivations in health, education, or living standards for a large population within that country",
        explanation: "- A) Wrong — the finding explicitly shows substantial poverty persisting in middle-income countries, contradicting a claim of automatic elimination.\\n- B) Correct — the persistence of millions of multidimensionally poor people in middle-income countries proves average national income growth doesn't guarantee the elimination of deprivations in health and education.\\n- C) Wrong — the finding concerns the absolute number of poor people located in middle-income countries, not necessarily their poverty rate compared to low-income countries.\\n- D) Wrong — this is a well-documented pattern in large, populous middle-income countries with substantial internal inequality, not evidence of error."
      },
      {
        questionText: "A comparison of two economies that started at similar income levels decades ago finds one grew steadily under stable institutions while the other cycled repeatedly through currency collapses and defaults. If asked to isolate the single most defensible explanatory variable for their diverging long-run income levels, which would an economist most likely choose?",
        options: [
          "The number of natural disasters each country experienced",
          "The consistency of each country's institutions and policies in allowing investment to compound over time",
          "The size of each country's population at the starting point",
          "The average temperature of each country's capital city"
        ],
        correctAnswer: "The consistency of each country's institutions and policies in allowing investment to compound over time",
        explanation: "- A) Wrong — natural disaster frequency is not the variable identified as central to this kind of long-run divergence.\\n- B) Correct — differing stability in institutions and policies determines whether investment can compound steadily or is repeatedly destroyed by crises.\\n- C) Wrong — starting population size is not the distinguishing factor between the two hypothetical economies described.\\n- D) Wrong — climate is not a plausible explanatory variable for institutionally driven economic divergence of this kind."
      },
      {
        questionText: "(Hardest, cross-topic synthesis) Considering income-based poverty lines, the Gini coefficient, poverty traps, and multidimensional poverty measurement together, what is the most defensible overall conclusion about measuring poverty and inequality?",
        options: [
          "A single income-based number is always sufficient to fully capture a population's economic wellbeing",
          "Different measures capture different aspects of deprivation and disadvantage — distribution, persistence, and multiple overlapping conditions — and a complete picture typically requires more than one of them together",
          "All poverty and inequality measures always produce identical rankings of which countries are worst off",
          "Measuring poverty and inequality serves no practical purpose for policy design"
        ],
        correctAnswer: "Different measures capture different aspects of deprivation and disadvantage — distribution, persistence, and multiple overlapping conditions — and a complete picture typically requires more than one of them together",
        explanation: "- A) Wrong — the multidimensional poverty case specifically demonstrates income-based measurement missing overlapping deprivations in health, education, and living standards.\\n- B) Correct — no single measure captures everything; Ginis capture distribution, poverty lines capture absolute income, and multidimensional indices capture overlapping material conditions.\\n- C) Wrong — the various cases show measures diverging in what they capture and rank, not producing identical results.\\n- D) Wrong — several cases directly link specific measurements to specific policy responses, such as targeted transfers and institutional reforms."
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
