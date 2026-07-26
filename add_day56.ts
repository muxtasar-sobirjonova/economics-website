import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 56;
  console.log(`Starting update for Day ${dayOrder} Final Quiz...`);

  // Quizzes
  const quiz = await prisma.quiz.findFirst({ where: { dayOrder } });
  
  if (quiz) {
    // Update quiz title to match Day 56 Review
    await prisma.quiz.update({
      where: { id: quiz.id },
      data: {
        title: "Final Quiz & Capstone Review",
        tag: "Week 8 Review"
      }
    });

    // Delete existing questions
    await prisma.quizQuestion.deleteMany({
      where: { quizId: quiz.id }
    });

    const questions = [
      {
        questionText: "What are \"institutions,\" per Day 50?",
        options: [
          "Universities and research centers exclusively",
          "The formal and informal rules governing economic activity, including property rights, regulation, and digital infrastructure",
          "A country's total population size",
          "A specific company's internal management structure"
        ],
        correctAnswer: "The formal and informal rules governing economic activity, including property rights, regulation, and digital infrastructure",
        explanation: "this is Day 50's exact definition. A, C, and D are fabricated or overly narrow claims."
      },
      {
        questionText: "What is a \"transaction cost,\" as used in Day 50?",
        options: [
          "The price a customer pays for a product",
          "The time, delay, and administrative effort required before a founder can even begin operating, paid before any product is sold",
          "A government tax applied only to international transactions",
          "The interest rate on a business loan"
        ],
        correctAnswer: "The time, delay, and administrative effort required before a founder can even begin operating, paid before any product is sold",
        explanation: "this is Day 50's exact framing. A, C, and D are fabricated claims."
      },
      {
        questionText: "What is \"compliance cost,\" per Day 51?",
        options: [
          "A government tax charged specifically for regulatory filings",
          "The hidden cost of regulatory friction, paid in staff time and delay rather than currency",
          "The interest rate charged on a business loan",
          "A fee charged by document management software companies"
        ],
        correctAnswer: "The hidden cost of regulatory friction, paid in staff time and delay rather than currency",
        explanation: "this is Day 51's exact definition. A, C, and D are fabricated claims."
      },
      {
        questionText: "According to Day 51, why does digitizing a mandatory bureaucratic process create real economic value?",
        options: [
          "Because it invents an entirely new product customers didn't need before",
          "Because it returns previously wasted time and effort back to an organization's actual core work, rather than inventing new demand",
          "Because digitization automatically eliminates all regulatory requirements",
          "Because compliance costs have no real economic effect on organizations"
        ],
        correctAnswer: "Because it returns previously wasted time and effort back to an organization's actual core work, rather than inventing new demand",
        explanation: "this is Day 51's direct explanation. A, C, and D are fabricated claims."
      },
      {
        questionText: "What is \"ecosystem density,\" per Day 52?",
        options: [
          "The total land area of a country's tech industry",
          "How concentrated experienced founders, operators, and investors are within a region relative to its size",
          "The number of laws regulating startups in a given country",
          "The total population of a country regardless of its economic activity"
        ],
        correctAnswer: "How concentrated experienced founders, operators, and investors are within a region relative to its size",
        explanation: "this is Day 52's exact definition. A, C, and D are fabricated claims."
      },
      {
        questionText: "According to Day 52, why do locally experienced investors matter more for early-stage founders than distant international investors?",
        options: [
          "Because local investors are always legally required to invest in local companies",
          "Because they understand the specific regulatory, market, and talent conditions of that region, making them more willing and better positioned to fund unproven local founders",
          "Because international investors are prohibited from funding foreign startups",
          "Because local investors always offer larger checks than international ones"
        ],
        correctAnswer: "Because they understand the specific regulatory, market, and talent conditions of that region, making them more willing and better positioned to fund unproven local founders",
        explanation: "this is Day 52's direct explanation. A, C, and D are fabricated claims."
      },
      {
        questionText: "What is \"supply chain density,\" per Day 53?",
        options: [
          "The total number of laws regulating a specific industry",
          "The concentration of component suppliers, assembly capacity, and skilled labor built up in a region over time, reinforcing itself as it grows",
          "A measure of how many countries a company exports to",
          "A government tax rate applied to manufacturing companies"
        ],
        correctAnswer: "The concentration of component suppliers, assembly capacity, and skilled labor built up in a region over time, reinforcing itself as it grows",
        explanation: "this is Day 53's exact definition. A, C, and D are fabricated claims."
      },
      {
        questionText: "Why does Day 53 argue that a zone offering only temporary tax incentives tends to lose its advantage once incentives expire?",
        options: [
          "Because temporary incentives are always illegal under international law",
          "Because nothing about operating there was ever truly necessary if the underlying supply chain density was never built",
          "Because all government incentives are permanent by law",
          "Because tax incentives have no relationship to where companies choose to locate"
        ],
        correctAnswer: "Because nothing about operating there was ever truly necessary if the underlying supply chain density was never built",
        explanation: "this is Day 53's direct explanation. A, C, and D are fabricated claims."
      },
      {
        questionText: "What is an \"anchor company,\" per Day 54?",
        options: [
          "A company that only operates within a single industry permanently",
          "A region's first major domestic success, whose main value lies in proving domestic conditions were viable and seeding confidence for the next generation",
          "A government-owned enterprise with no private investment",
          "A multinational corporation with no ties to the local region"
        ],
        correctAnswer: "A region's first major domestic success, whose main value lies in proving domestic conditions were viable and seeding confidence for the next generation",
        explanation: "this is Day 54's exact definition. A, C, and D are fabricated claims."
      },
      {
        questionText: "What three ingredients does Day 54 identify as mattering most at the regional ecosystem building stage?",
        options: [
          "Government subsidies, foreign aid, and international press coverage",
          "Local investment willing to fund unproven companies, sufficient digital infrastructure, and a large enough domestic market",
          "University research funding, patent law, and corporate tax rates",
          "Import tariffs, currency controls, and export quotas"
        ],
        correctAnswer: "Local investment willing to fund unproven companies, sufficient digital infrastructure, and a large enough domestic market",
        explanation: "this is Day 54's exact set of ingredients. A, C, and D are fabricated claims."
      },
      {
        questionText: "What does \"comparing ecosystems\" mean, per Day 55?",
        options: [
          "Evaluating which ecosystem produced the objectively better company regardless of context",
          "Evaluating what stage of development each ecosystem represents, and what kind of company that stage naturally tends to produce",
          "Ranking countries purely by total startup funding raised",
          "A government-administered scoring system for national economies"
        ],
        correctAnswer: "Evaluating what stage of development each ecosystem represents, and what kind of company that stage naturally tends to produce",
        explanation: "this is Day 55's exact definition. A, C, and D are fabricated claims."
      },
      {
        questionText: "Per Day 55, why do earlier-stage ecosystems tend to first produce companies solving local infrastructure gaps?",
        options: [
          "Because international expansion is illegal for companies in earlier-stage ecosystems",
          "Because the clearest, most immediately capturable value sits in solving large, obvious local gaps that haven't been addressed yet",
          "Because earlier-stage ecosystems have no domestic consumers at all",
          "Because founders in earlier-stage ecosystems lack the ability to build global products"
        ],
        correctAnswer: "Because the clearest, most immediately capturable value sits in solving large, obvious local gaps that haven't been addressed yet",
        explanation: "this is Day 55's direct explanation. A, C, and D are fabricated claims."
      },
      {
        questionText: "Based on Days 50 and 51 together, what is the key difference between \"institutions\" broadly and \"ease of doing business\" specifically?",
        options: [
          "There is no difference — the two terms describe identical concepts",
          "Institutions describe the broader legal and governance environment shaping economic activity, while ease of doing business narrows in specifically on the speed and simplicity of standard regulatory processes",
          "Ease of doing business only applies to digital companies",
          "Institutions only apply to countries with a monarchy"
        ],
        correctAnswer: "Institutions describe the broader legal and governance environment shaping economic activity, while ease of doing business narrows in specifically on the speed and simplicity of standard regulatory processes",
        explanation: "this connects the two lessons' distinct but related scopes. A, C, and D contradict or misstate this relationship."
      },
      {
        questionText: "Based on Days 52 and 54 together, how does \"ecosystem density\" (Day 52) differ from the earlier-stage \"regional ecosystem building\" process (Day 54)?",
        options: [
          "They are identical concepts describing the same stage of development",
          "Ecosystem density describes an already mature, dense concentration of experienced founders and capital, while regional ecosystem building describes the earlier-stage process before that density has formed",
          "Regional ecosystem building only applies to countries in Europe",
          "Ecosystem density has no relationship to a region's stage of development"
        ],
        correctAnswer: "Ecosystem density describes an already mature, dense concentration of experienced founders and capital, while regional ecosystem building describes the earlier-stage process before that density has formed",
        explanation: "this connects the two lessons' distinct stages within the same broader theme. A, C, and D contradict this relationship."
      },
      {
        questionText: "Based on Days 53 and 41 (from Week 6) together, how does a government-backed innovation zone differ from an organically-formed innovation ecosystem like Silicon Valley?",
        options: [
          "There is no difference between the two",
          "A government-backed zone is deliberately engineered by policy decisions, while an ecosystem like Silicon Valley formed organically through a reinforcing loop of research, talent, and capital without a single top-down design",
          "Government-backed zones can never produce lasting competitive advantages",
          "Organic ecosystems always outperform government-backed zones in every measurable way"
        ],
        correctAnswer: "A government-backed zone is deliberately engineered by policy decisions, while an ecosystem like Silicon Valley formed organically through a reinforcing loop of research, talent, and capital without a single top-down design",
        explanation: "this connects Day 53's deliberate-policy mechanism with the organically-formed ecosystem covered earlier in the track. A, C, and D contradict or overstate this relationship."
      },
      {
        questionText: "A country simplifies its business registration process from a six-week manual procedure to a same-day online one. Based on Day 50, what is the most likely effect on the country's entrepreneurship rate?",
        options: [
          "No effect, since registration speed has no bearing on whether businesses get started",
          "An increase, since some ideas that would have died in the slower bureaucratic process are now more likely to actually be attempted",
          "A decrease, since faster registration always leads to lower-quality businesses",
          "An effect that only applies to companies with over 100 employees"
        ],
        correctAnswer: "An increase, since some ideas that would have died in the slower bureaucratic process are now more likely to actually be attempted",
        explanation: "this is a direct application of Day 50's transaction-cost argument. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A founder abandons a promising business idea specifically because navigating required government paperwork felt too slow and uncertain, even though the underlying business model was sound. Based on Day 50, what does this illustrate?",
        options: [
          "A failure of the business idea itself",
          "A transaction-cost failure — a good idea prevented from being attempted by institutional friction rather than any flaw in the idea",
          "Evidence that entrepreneurship rates have no relationship to institutional quality",
          "A situation with no bearing on the concepts in this lesson"
        ],
        correctAnswer: "A transaction-cost failure — a good idea prevented from being attempted by institutional friction rather than any flaw in the idea",
        explanation: "this is a direct application of Day 50's core concept. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A company creates a platform that reduces the average time an organization spends on a mandatory compliance process from several days to a few minutes, without changing any underlying legal requirements. Based on Day 51, what has this company created?",
        options: [
          "A new legal requirement that didn't exist before",
          "Recovered economic value by removing friction from an already-mandatory process, redirecting that time toward organizations' core work",
          "A reduction in the total number of organizations required to comply",
          "A product with no measurable economic value"
        ],
        correctAnswer: "Recovered economic value by removing friction from an already-mandatory process, redirecting that time toward organizations' core work",
        explanation: "this is a direct application of Day 51's core argument. A, C, and D contradict this reasoning."
      },
      {
        questionText: "Two platforms both aim to digitize government compliance processes. Platform A tries to cover ten document types simultaneously from launch. Platform B focuses exclusively on the single highest-friction document type first. Based on Day 51, which approach is more likely to succeed initially?",
        options: [
          "Platform A, since broader coverage always produces faster adoption",
          "Platform B, since proving real value on the highest-friction process first is a more effective way to establish the platform before expanding",
          "Neither platform's approach has any bearing on its likelihood of success",
          "Both platforms are using functionally identical strategies"
        ],
        correctAnswer: "Platform B, since proving real value on the highest-friction process first is a more effective way to establish the platform before expanding",
        explanation: "this reflects Day 51's reasoning about focused proof-of-value. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A country experiences one major tech company's successful exit. Many of that company's early employees go on to found, advise, and invest in new local startups over the following decade. Based on Day 52, what effect would this have on the country's access to capital for new founders?",
        options: [
          "No effect, since one company's success has no bearing on future access to capital",
          "An increase, since the recycled experience and capital from that success directly seeds funding and mentorship for the next generation",
          "A decrease, since successful founders always leave the country immediately after an exit",
          "An effect limited exclusively to the original company's direct employees"
        ],
        correctAnswer: "An increase, since the recycled experience and capital from that success directly seeds funding and mentorship for the next generation",
        explanation: "this is a direct application of Day 52's capital-recycling argument. A, C, and D contradict this reasoning."
      },
      {
        questionText: "In Region A, most of a successful company's early employees stay locally engaged as investors and mentors. In Region B, most relocate abroad and disengage. Based on Day 52, which region is more likely to see its next generation of founders benefit from stronger access to capital?",
        options: [
          "Region B, since relocating abroad always increases access to capital for a home region",
          "Region A, since the earlier generation staying locally engaged allows their experience and capital to recycle into new local startups",
          "Neither region's outcome is affected by whether the earlier generation stays or leaves",
          "Both regions will see identical outcomes"
        ],
        correctAnswer: "Region A, since the earlier generation staying locally engaged allows their experience and capital to recycle into new local startups",
        explanation: "this mirrors Day 52's Skype-to-Bolt example. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A region designates a new manufacturing zone with generous tax breaks, but after the incentives expire, most companies relocate elsewhere. Based on Day 53, what does this outcome most likely indicate?",
        options: [
          "That the zone successfully built genuine, self-reinforcing supply chain density",
          "That the zone's advantage depended primarily on the temporary incentives rather than genuine, self-reinforcing supply chain density",
          "That government-backed zones can never provide any real economic value",
          "That this outcome has no relationship to the concepts in this lesson"
        ],
        correctAnswer: "That the zone's advantage depended primarily on the temporary incentives rather than genuine, self-reinforcing supply chain density",
        explanation: "this is a direct application of Day 53's distinction between incentives and genuine density. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A hardware company located in a region with an extremely dense concentration of component suppliers can test and revise a product design within days, while a competitor in a region with a thin manufacturing base takes weeks. Based on Day 53, what explains this difference?",
        options: [
          "Random chance with no underlying economic explanation",
          "Supply chain density — the concentration of nearby suppliers and assembly capacity — directly enables faster iteration cycles",
          "The company with the thin manufacturing base is using inferior technology",
          "Supply chain density has no relationship to product development speed"
        ],
        correctAnswer: "Supply chain density — the concentration of nearby suppliers and assembly capacity — directly enables faster iteration cycles",
        explanation: "this mirrors Day 53's DJI example directly. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A region's mobile penetration and digital payments adoption finally reach a level that makes a domestic e-commerce platform commercially viable for the first time. Based on Day 54, what does this represent?",
        options: [
          "An irrelevant technical detail with no bearing on regional ecosystem building",
          "One of the key ingredients — sufficient digital infrastructure — needed for a region's first major domestic success to become possible",
          "Evidence the region has already reached mature ecosystem density",
          "A factor that only matters for international businesses"
        ],
        correctAnswer: "One of the key ingredients — sufficient digital infrastructure — needed for a region's first major domestic success to become possible",
        explanation: "this is a direct application of Day 54's ingredient framework. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A region produces its first major domestic tech success. Based on this lesson, what is this company's broader significance beyond its own specific outcome?",
        options: [
          "None — an anchor company's success has no bearing on future founders in the region",
          "It proves domestic capital, market conditions, and infrastructure were viable, seeding confidence and a reference point for the next generation of local founders",
          "It guarantees every future company in the region will automatically succeed",
          "It has significance only for its own industry"
        ],
        correctAnswer: "It proves domestic capital, market conditions, and infrastructure were viable, seeding confidence and a reference point for the next generation of local founders",
        explanation: "this is a direct application of Day 54's anchor-company concept. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A mature ecosystem's flagship company targets global markets from inception, while an earlier-stage ecosystem's flagship company focuses on a domestic infrastructure gap. Based on Day 55, what does this difference most likely reflect?",
        options: [
          "A difference in founder talent between the two ecosystems",
          "A difference in each ecosystem's stage of development and the type of opportunity most immediately available at that stage",
          "A random, unexplainable variation with no underlying pattern",
          "Evidence that one ecosystem's founders are fundamentally more ambitious"
        ],
        correctAnswer: "A difference in each ecosystem's stage of development and the type of opportunity most immediately available at that stage",
        explanation: "this is a direct application of Day 55's central argument. A, C, and D contradict this reasoning."
      },
      {
        questionText: "Two analysts compare a mature ecosystem's globally-focused SaaS company and an earlier-stage ecosystem's domestic-infrastructure company using identical valuation-based criteria, concluding the mature ecosystem is simply \"better.\" Based on Day 55, what is the flaw in this comparison?",
        options: [
          "There is no flaw — valuation is always the correct basis for comparing ecosystems",
          "The comparison fails to account for each ecosystem's accumulated density and stage of development",
          "Valuation-based comparisons are illegal under international economic standards",
          "The flaw is that the mature ecosystem should have been judged as objectively worse instead"
        ],
        correctAnswer: "The comparison fails to account for each ecosystem's accumulated density and stage of development",
        explanation: "this is a direct application of Day 55's central warning. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A country simplifies business registration (Day 50) and digitizes a major compliance process (Day 51), but has no locally experienced investors willing to fund early-stage founders (Day 52). Based on all three lessons together, what would you expect?",
        options: [
          "Entrepreneurship attempts may rise due to lower institutional friction, but many promising founders may still struggle to secure early-stage funding without locally informed investors",
          "The country will automatically develop a mature ecosystem regardless of its access to capital",
          "Institutional improvements always fully substitute for a lack of local investment",
          "None of these three factors have any relationship to each other"
        ],
        correctAnswer: "Entrepreneurship attempts may rise due to lower institutional friction, but many promising founders may still struggle to secure early-stage funding without locally informed investors",
        explanation: "this combines Day 50 and 51's institutional arguments with Day 52's capital-access argument, showing institutions are necessary but not sufficient alone. B, C, and D contradict this reasoning."
      },
      {
        questionText: "A government designates a new innovation zone with generous incentives (Day 53), while a separate region relies on an anchor company's success to organically seed local investment and talent (Day 54). Based on both lessons together, what is the key difference in how lasting each approach's advantage is likely to be?",
        options: [
          "Both approaches are equally likely to produce lasting advantages regardless of how they were formed",
          "The zone's advantage depends on whether genuine supply chain density forms beyond the initial incentives, while the anchor company's advantage depends on whether its successful generation stays locally engaged — both requiring more than the initial trigger event alone",
          "Government-designated zones always outperform organically-formed ecosystems",
          "Anchor companies always outperform government-designated zones"
        ],
        correctAnswer: "The zone's advantage depends on whether genuine supply chain density forms beyond the initial incentives, while the anchor company's advantage depends on whether its successful generation stays locally engaged — both requiring more than the initial trigger event alone",
        explanation: "this connects Day 53's and Day 54's shared theme that an initial trigger (policy or success) isn't sufficient on its own without sustained follow-through. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A founder is evaluating two regions to build a startup: Region X has strong institutions and ease of doing business but is still earlier in its ecosystem development, with domestic infrastructure gaps still unsolved. Region Y has a mature, dense ecosystem with global-ambition norms already established. Based on everything covered this week, what should this founder conclude about which region fits which kind of company?",
        options: [
          "Region X is only suitable for domestic-infrastructure-focused companies, while Region Y is only suitable for globally-ambitious SaaS companies, with no other viable strategy in either region",
          "The founder should assess what kind of opportunity fits each region's actual stage of development — a domestic infrastructure gap in Region X, or a globally-ambitious product in Region Y — rather than assuming one universal strategy fits every region equally well",
          "Ecosystem stage has no bearing on which strategy is likely to succeed in a given region",
          "Only regions with mature ecosystems like Region Y can ever produce a successful company"
        ],
        correctAnswer: "The founder should assess what kind of opportunity fits each region's actual stage of development — a domestic infrastructure gap in Region X, or a globally-ambitious product in Region Y — rather than assuming one universal strategy fits every region equally well",
        explanation: "this is the capstone synthesis of the week's central argument: matching strategy to a region's actual institutional and ecosystem stage, rather than assuming one approach fits everywhere. A is too rigid — the lesson describes tendencies, not absolute rules. C and D both contradict the week's central argument about stage-appropriate strategy."
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
