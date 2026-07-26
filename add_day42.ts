import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 42;
  console.log(`Starting update for Day ${dayOrder} Cumulative Quiz...`);

  // Quizzes
  const quiz = await prisma.quiz.findFirst({ where: { dayOrder } });
  
  if (quiz) {
    // Update quiz title to match Day 42 Review
    await prisma.quiz.update({
      where: { id: quiz.id },
      data: {
        title: "Week 6 Review — Uncertainty, Pivots & Failure",
        tag: "Week 6 Review"
      }
    });

    // Delete existing questions
    await prisma.quizQuestion.deleteMany({
      where: { quizId: quiz.id }
    });

    const questions = [
      {
        questionText: "What is \"expected value,\" per Day 36?",
        options: [
          "The current market price of a company's stock",
          "The sum of each possible outcome's probability multiplied by its value, used to compare choices beyond just their certain current payoff",
          "A guaranteed future profit figure",
          "The total revenue a company earned in its most recent fiscal year"
        ],
        correctAnswer: "The sum of each possible outcome's probability multiplied by its value, used to compare choices beyond just their certain current payoff",
        explanation: "this is Day 36's exact definition. A, C, and D are fabricated or unrelated claims."
      },
      {
        questionText: "What is \"cannibalization,\" as used in Day 36?",
        options: [
          "A company illegally copying a competitor's product",
          "Deliberately building a product that competes with, and may replace, your own existing profitable business, because its expected value is higher",
          "A government policy limiting market share",
          "A pricing strategy used only by unprofitable companies"
        ],
        correctAnswer: "Deliberately building a product that competes with, and may replace, your own existing profitable business, because its expected value is higher",
        explanation: "this is Day 36's exact definition. A, C, and D are fabricated claims."
      },
      {
        questionText: "What is \"pivoting,\" per Day 37?",
        options: [
          "Abandoning a company entirely and starting a completely unrelated business",
          "Fundamentally changing a company's strategy or product direction while retaining some core asset learned from the original attempt",
          "A legal process for restructuring a company's debt",
          "A marketing technique used to rebrand a failing product without changing it"
        ],
        correctAnswer: "Fundamentally changing a company's strategy or product direction while retaining some core asset learned from the original attempt",
        explanation: "this is Day 37's exact definition. A, C, and D are fabricated claims."
      },
      {
        questionText: "According to Day 37, what is the hardest part of executing a successful pivot?",
        options: [
          "Announcing the change to investors and the public",
          "Honestly separating what actually failed from what quietly succeeded within the original attempt",
          "Raising additional funding immediately after a failure",
          "Rehiring the exact same team that built the original failed product"
        ],
        correctAnswer: "Honestly separating what actually failed from what quietly succeeded within the original attempt",
        explanation: "this is Day 37's direct explanation. A, C, and D are fabricated claims."
      },
      {
        questionText: "What is a \"diagnosis error,\" per Day 38?",
        options: [
          "A medical mistake made by a company's healthcare provider",
          "A situation where a company sees the market changing but misidentifies which specific customer preference is actually shifting",
          "A legal error made during a company's incorporation process",
          "A technical bug in a company's product"
        ],
        correctAnswer: "A situation where a company sees the market changing but misidentifies which specific customer preference is actually shifting",
        explanation: "this is Day 38's exact definition. A, C, and D are fabricated claims."
      },
      {
        questionText: "Why is \"seeing change coming\" not the same as learning something useful from a failure, per Day 38?",
        options: [
          "Because seeing change and correctly diagnosing which specific preference is shifting are two separate, distinct skills",
          "Because companies that see change coming always succeed regardless of their response",
          "Because market changes are always impossible to detect in advance",
          "Because failure only teaches lessons to companies that ignore the market entirely"
        ],
        correctAnswer: "Because seeing change and correctly diagnosing which specific preference is shifting are two separate, distinct skills",
        explanation: "this is Day 38's central distinction, illustrated by BlackBerry. B, C, and D are fabricated claims."
      },
      {
        questionText: "What is a \"two-way door\" decision, per Day 39?",
        options: [
          "A decision that is expensive and difficult to reverse once made",
          "A decision that can be entered quickly and exited cheaply if it turns out to be wrong",
          "A legal term describing a company's exit from bankruptcy",
          "A decision that requires government approval before proceeding"
        ],
        correctAnswer: "A decision that can be entered quickly and exited cheaply if it turns out to be wrong",
        explanation: "this is Day 39's exact definition. A describes a \"one-way door\" decision. C and D are fabricated claims."
      },
      {
        questionText: "According to Day 39, what actually determines how much caution or staging a decision deserves?",
        options: [
          "The total size of the potential opportunity alone",
          "How expensive or difficult the decision would be to reverse if it turns out to be wrong",
          "How much media attention the decision is likely to attract",
          "The number of competitors currently operating in the same market"
        ],
        correctAnswer: "How expensive or difficult the decision would be to reverse if it turns out to be wrong",
        explanation: "this is Day 39's central argument. A, C, and D are fabricated claims."
      },
      {
        questionText: "What is \"sustaining innovation,\" per Day 40?",
        options: [
          "Improving a product along the exact dimensions its current best, most profitable customers already value",
          "Offering a product that is initially worse on premium dimensions but far cheaper for an overlooked segment",
          "A government subsidy for established technology companies",
          "A pricing strategy used only by new market entrants"
        ],
        correctAnswer: "Improving a product along the exact dimensions its current best, most profitable customers already value",
        explanation: "this is Day 40's exact definition. B describes disruptive innovation. C and D are fabricated claims."
      },
      {
        questionText: "According to Day 40, why do incumbents often dismiss disruptive competitors at first?",
        options: [
          "Because disruptive products are always technically impossible to manufacture",
          "Because early disruptive products genuinely are worse on the exact dimensions the incumbent's best, most profitable customers care about",
          "Because incumbents are legally required to ignore new competitors",
          "Because disruptive competitors never target any real customer segment"
        ],
        correctAnswer: "Because early disruptive products genuinely are worse on the exact dimensions the incumbent's best, most profitable customers care about",
        explanation: "this is Day 40's direct explanation. A, C, and D are fabricated claims."
      },
      {
        questionText: "What is an \"innovation ecosystem,\" per Day 41?",
        options: [
          "A single university's research department",
          "An interconnected concentration of research, capital, and talent that makes new company formation more likely to succeed than any single element could alone",
          "A government agency responsible for approving new startups",
          "A tax incentive program for technology companies"
        ],
        correctAnswer: "An interconnected concentration of research, capital, and talent that makes new company formation more likely to succeed than any single element could alone",
        explanation: "this is Day 41's exact definition. A, C, and D each describe a single ingredient, not the interconnected whole."
      },
      {
        questionText: "What are \"agglomeration effects,\" according to Day 41?",
        options: [
          "The extra value that comes purely from proximity itself — informal knowledge-sharing, easier talent movement, and faster deal-making",
          "A government tax imposed specifically on technology companies",
          "A legal restriction preventing companies from relocating",
          "The total revenue generated by a single company in an ecosystem"
        ],
        correctAnswer: "The extra value that comes purely from proximity itself — informal knowledge-sharing, easier talent movement, and faster deal-making",
        explanation: "this is Day 41's exact definition. B, C, and D are fabricated claims."
      },
      {
        questionText: "Based on Days 37 and 38 together, what is the key difference between pivoting and simply failing to learn from a mistake?",
        options: [
          "There is no meaningful difference between the two",
          "A pivot involves honestly extracting a specific, valuable asset from a failed attempt, while failing to learn often means drawing a vague or comfortable lesson that avoids the real cause",
          "Pivoting always requires shutting a company down completely",
          "Learning from failure only applies to large corporations, while pivoting only applies to startups"
        ],
        correctAnswer: "A pivot involves honestly extracting a specific, valuable asset from a failed attempt, while failing to learn often means drawing a vague or comfortable lesson that avoids the real cause",
        explanation: "this connects Day 37's and Day 38's shared theme of honest, specific diagnosis after a setback. A, C, and D contradict or misstate this connection."
      },
      {
        questionText: "Based on Days 36 and 39 together, what do expected value and staged investment have in common as decision-making tools?",
        options: [
          "Nothing — they are entirely unrelated concepts",
          "Both involve weighing uncertain future outcomes carefully rather than defaulting to whichever option feels safest or most familiar right now",
          "Both require a company to always choose the cheapest available option",
          "Both apply only to publicly traded companies"
        ],
        correctAnswer: "Both involve weighing uncertain future outcomes carefully rather than defaulting to whichever option feels safest or most familiar right now",
        explanation: "this connects the underlying logic of both lessons: careful, honest evaluation of uncertain outcomes rather than default caution. A, C, and D contradict this connection."
      },
      {
        questionText: "Based on Days 40 and 41 together, how might a strong local innovation ecosystem make it easier for a disruptive startup to succeed?",
        options: [
          "It wouldn't — ecosystems and disruption are entirely unrelated concepts",
          "A dense ecosystem with specialized early-stage capital and experienced talent may be more willing to fund and support an unproven, \"good enough\" disruptive product than a region without that density",
          "Innovation ecosystems only support sustaining innovation, never disruptive innovation",
          "Disruptive startups always fail regardless of the ecosystem around them"
        ],
        correctAnswer: "A dense ecosystem with specialized early-stage capital and experienced talent may be more willing to fund and support an unproven, \"good enough\" disruptive product than a region without that density",
        explanation: "this connects Day 41's ecosystem argument to Day 40's disruption concept, since specialized risk-tolerant capital is exactly what an early disruptive bet needs. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A company begins building a new product internally that could eventually replace its own best-selling existing product, even while that existing product is still highly profitable. Based on Day 36, what is the most likely economic justification?",
        options: [
          "The company believes the new product's expected value, weighed across its real probability of success and larger potential payoff, exceeds continuing to rely solely on the existing product's shrinking long-term trajectory",
          "The company has no economic reasoning and is acting randomly",
          "Cannibalizing an existing profitable product is always an irrational mistake",
          "The decision reflects a legal requirement to diversify product lines"
        ],
        correctAnswer: "The company believes the new product's expected value, weighed across its real probability of success and larger potential payoff, exceeds continuing to rely solely on the existing product's shrinking long-term trajectory",
        explanation: "this is a direct application of Day 36's cannibalization argument. B, C, and D contradict this reasoning."
      },
      {
        questionText: "Two companies face the same emerging technological shift. Company A protects its current profitable model. Company B invests heavily in the new technology despite short-term uncertainty. Based on Day 36, which company is making the higher expected-value decision, assuming the new technology's potential payoff genuinely outweighs its risk?",
        options: [
          "Company A, since protecting current profits is always superior",
          "Company B, since it is weighing the new technology's larger potential payoff against its real probability of success",
          "Neither company's strategy relates to expected value",
          "Both companies are making identical decisions"
        ],
        correctAnswer: "Company B, since it is weighing the new technology's larger potential payoff against its real probability of success",
        explanation: "this mirrors Day 36's Netflix/Blockbuster contrast. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A team builds an internal tool to solve its own operational problem while developing an unrelated primary product. The primary product later fails, but the internal tool proves genuinely useful. Based on Day 37, what should this team consider?",
        options: [
          "Discarding both the failed product and the internal tool entirely",
          "Considering a pivot toward the internal tool, since it may represent real, independent value separate from the original product's failure",
          "Continuing to invest exclusively in the original failed product",
          "Assuming the internal tool has no value since the original product failed"
        ],
        correctAnswer: "Considering a pivot toward the internal tool, since it may represent real, independent value separate from the original product's failure",
        explanation: "this is a direct application of Day 37's pivot logic, mirroring Slack's origin. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A founder recognizes their original product is failing but keeps investing because of the time and money already spent. Based on Day 37, what trap does this best illustrate?",
        options: [
          "A successful pivot strategy",
          "The sunk-cost trap — defending a failing vision rather than recognizing real value elsewhere",
          "A disruptive innovation strategy",
          "A network effect"
        ],
        correctAnswer: "The sunk-cost trap — defending a failing vision rather than recognizing real value elsewhere",
        explanation: "this is a direct application of Day 37's warning against refusing to pivot. A, C, and D are unrelated concepts."
      },
      {
        questionText: "A company's leadership was fully aware of a competitor's new product and its early growth, yet still lost significant market share over the following years. Based on Day 38, what does this most likely indicate?",
        options: [
          "That awareness of a competitor automatically prevents future failure",
          "That the company likely misdiagnosed which specific customer preference the competitor's product represented, despite being aware of its existence",
          "That market awareness has no relationship to a company's success or failure",
          "That the competitor's product must have been technically superior in every respect"
        ],
        correctAnswer: "That the company likely misdiagnosed which specific customer preference the competitor's product represented, despite being aware of its existence",
        explanation: "this is a direct application of Day 38's diagnosis-error concept, mirroring BlackBerry. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A company concludes, after a major failure, that \"the market became unpredictable and nothing could have been done.\" Based on Day 38, what is the problem with this conclusion?",
        options: [
          "It is a specific, actionable lesson that will prevent future failures",
          "It is a vague conclusion that avoids identifying the actual, specific cause of the failure",
          "It is the most accurate possible conclusion for any business failure",
          "It has no relationship to how companies should learn from failure"
        ],
        correctAnswer: "It is a vague conclusion that avoids identifying the actual, specific cause of the failure",
        explanation: "this is a direct application of Day 38's warning about vague versus specific diagnosis. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A company tests a new internal process on a small team before rolling it out company-wide, allowing it to easily reverse the change if it doesn't work. Based on Day 39, what does this approach illustrate?",
        options: [
          "A one-way door decision requiring extensive deliberation",
          "A staged, reversible approach consistent with a two-way door decision",
          "A decision with no relationship to reversibility at all",
          "A permanent, irreversible commitment made without testing"
        ],
        correctAnswer: "A staged, reversible approach consistent with a two-way door decision",
        explanation: "this is a direct application of Day 39's staged-investment framework. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A company is deciding whether to sign a ten-year, non-cancellable contract committing significant capital to an unproven market. Based on Day 39, how should this decision be approached compared to a small, reversible internal pilot?",
        options: [
          "With identical speed and minimal deliberation",
          "With much more careful deliberation, since this is a costly, hard-to-reverse \"one-way door\" decision",
          "With less caution than the pilot program",
          "With no consideration of reversibility at all"
        ],
        correctAnswer: "With much more careful deliberation, since this is a costly, hard-to-reverse \"one-way door\" decision",
        explanation: "this is a direct application of Day 39's reversibility framework. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A new company enters a market with a product clearly inferior to the industry leader's on every dimension the leader's best customers value, but priced at a fraction of the cost and aimed at a much larger, price-sensitive segment. Based on Day 40, what pattern does this illustrate?",
        options: [
          "Sustaining innovation",
          "Disruptive innovation",
          "A network effect",
          "A first-mover advantage"
        ],
        correctAnswer: "Disruptive innovation",
        explanation: "this is a textbook application of Day 40's definition. A, C, and D are unrelated concepts."
      },
      {
        questionText: "An established company continues improving its premium product for its most loyal customers while ignoring a much larger, price-sensitive segment served by a cheaper competitor. Based on Day 40, what risk does this company face?",
        options: [
          "No risk at all, since serving your best customers is always correct",
          "The risk that the cheaper competitor's product improves over time and the overlooked segment grows large enough to threaten the company's overall position",
          "A risk that only applies to the smartphone industry",
          "A risk eliminated simply by lowering prices slightly"
        ],
        correctAnswer: "The risk that the cheaper competitor's product improves over time and the overlooked segment grows large enough to threaten the company's overall position",
        explanation: "this is a direct application of Day 40's disruption-from-below warning. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A region builds a well-funded research park and attracts a major venture capital office, but after five years has produced very few successful startups. Based on Day 41, what is the most likely explanation?",
        options: [
          "The region lacks any possible path to building an ecosystem",
          "The region may be missing the reinforcing loop and proximity-based effects that connect research, capital, and talent, rather than isolated ingredients",
          "Research parks and venture offices always guarantee success within five years",
          "Ecosystems cannot exist outside of California"
        ],
        correctAnswer: "The region may be missing the reinforcing loop and proximity-based effects that connect research, capital, and talent, rather than isolated ingredients",
        explanation: "this is a direct application of Day 41's core argument. A, C, and D contradict this reasoning."
      },
      {
        questionText: "Two regions both have strong local universities. Region A also has an established, specialized venture capital community and decades of successful company formation; Region B has neither. Based on Day 41, which region is more likely to function as a complete innovation ecosystem?",
        options: [
          "Region B, since fewer existing companies leaves more room for new ones",
          "Region A, since the interconnection between research, specialized capital, and a track record of success constitutes a complete ecosystem",
          "Neither region can be evaluated using these concepts",
          "Both regions are functionally identical"
        ],
        correctAnswer: "Region A, since the interconnection between research, specialized capital, and a track record of success constitutes a complete ecosystem",
        explanation: "this is a direct application of Day 41's central argument. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A company pivots away from a failed product toward an internal tool that solved a real problem, but then refuses to honestly diagnose why its original product actually failed, drawing only a vague lesson. Based on Days 37 and 38 together, what risk does this company still face?",
        options: [
          "None — pivoting alone guarantees the company will avoid all future mistakes",
          "The company may repeat the same underlying diagnosis error in a future decision, since a successful pivot doesn't automatically produce an accurate lesson about what went wrong",
          "Pivoting and learning from failure are entirely unrelated concepts with no bearing on each other",
          "A vague lesson is always just as useful as a specific one"
        ],
        correctAnswer: "The company may repeat the same underlying diagnosis error in a future decision, since a successful pivot doesn't automatically produce an accurate lesson about what went wrong",
        explanation: "this connects Day 37's pivot concept with Day 38's diagnosis-error warning, showing that one doesn't guarantee the other. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A founder is deciding whether to fully commit to a large, hard-to-reverse investment in a new, disruptive but currently \"worse\" product aimed at an overlooked segment. Based on Days 39 and 40 together, what would be the more prudent approach?",
        options: [
          "Commit fully and immediately, since disruptive strategies always require an irreversible, all-in bet",
          "Test the disruptive approach in a smaller, more reversible way first, given the genuine uncertainty about whether the overlooked segment is large enough, before making a larger, harder-to-reverse commitment",
          "Avoid the disruptive strategy entirely, since staged investment principles never apply to disruptive innovation",
          "Reversibility and disruptive innovation are entirely unrelated concepts"
        ],
        correctAnswer: "Test the disruptive approach in a smaller, more reversible way first, given the genuine uncertainty about whether the overlooked segment is large enough, before making a larger, harder-to-reverse commitment",
        explanation: "this combines Day 39's staged-investment logic with Day 40's disruption concept, since testing a disruptive bet in a reversible way reduces the cost of being wrong. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A founder in a dense innovation ecosystem is weighing whether to pursue a disruptive, currently \"worse\" product for an overlooked segment, using a staged, reversible approach, while remaining honest about testing the specific assumption behind the bet. Based on everything covered this week, what advantage does the ecosystem provide that a founder in an isolated region would lack?",
        options: [
          "None — ecosystems provide no advantage to founders pursuing disruptive, staged strategies",
          "Easier access to specialized capital willing to fund early-stage uncertainty, and a denser pool of experienced talent and mentors who have navigated similar pivots and failures before",
          "A guarantee that the disruptive product will succeed regardless of its actual quality",
          "Government-mandated protection from competing incumbents"
        ],
        correctAnswer: "Easier access to specialized capital willing to fund early-stage uncertainty, and a denser pool of experienced talent and mentors who have navigated similar pivots and failures before",
        explanation: "this combines Day 41's ecosystem concept with the week's broader themes of staged bets, honest diagnosis, and disruption, showing how ecosystem density supports exactly this kind of decision-making. A, C, and D are fabricated or contradicted claims."
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
