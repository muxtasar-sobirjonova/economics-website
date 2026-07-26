import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 14;
  const track = "DEVELOPMENT_ECONOMICS";
  const quizTitle = "CHAPTER 2 REVIEW QUIZ: Growth Theory and Cross-Country Development";

  console.log(`Starting update for Day \${dayOrder} (\${track})...`);

  // 1. UPDATE OR CREATE LESSON (for a review quiz day, we can create an empty/placeholder lesson so the UI shows it, or just a quiz. The schema allows just a Quiz, but typically we have both or just a quiz. The schema requires a lesson for a day? No, lesson and quiz are separate. But it's good practice to have a Lesson row if the frontend expects it, wait, some days only have a quiz. Let's look at schema.prisma. Quiz has its own unique track_dayOrder. Let's create a placeholder lesson with the quiz title just in case.)
  let lesson = await prisma.lesson.findUnique({
    where: { track_dayOrder: { track, dayOrder } }
  });
  
  if (!lesson) {
    lesson = await prisma.lesson.create({
      data: {
        track,
        dayOrder,
        title: quizTitle,
        tag: track,
        timeEstimate: 10,
        conceptText: "This is a review quiz day.",
        articleText: "Please complete the review quiz.",
      }
    });
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
        title: quizTitle,
        tag: track,
        timeEstimate: 15
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
        questionText: "China's incremental capital-output ratio rose from 2.84 in 2008 to 9.44 in 2023. If GDP needs to grow by the same amount next year as it did in 2008, what does the ratio change imply about the investment required to achieve it?",
        options: [
          "Roughly the same amount of investment as in 2008",
          "Roughly three times as much investment as in 2008",
          "Roughly a third as much investment as in 2008",
          "No investment is required at all under the new ratio"
        ],
        correctAnswer: "Roughly three times as much investment as in 2008",
        explanation: "- a) Wrong — a ratio more than tripling means the investment required for the same growth has also roughly tripled, not stayed flat.\\n- c) Wrong — this reverses the direction of the change; a rising ratio means more investment is needed, not less.\\n- d) Wrong — a capital-output ratio, however high, still implies some investment is needed to produce growth, not zero."
      },
      {
        questionText: "Japan's investment rate fell from a peak of 35% of GDP in 1970 to 27% by 1985, while GDP growth also slowed considerably over the same period. What does this combination most directly suggest about the marginal productivity of capital in Japan during those years?",
        options: [
          "Marginal productivity of capital was rising, which is why investment fell",
          "Marginal productivity of capital had likely declined, reducing the incentive to sustain the earlier investment rate",
          "Marginal productivity of capital has no relationship to investment rates",
          "The falling investment rate caused labor force growth to accelerate"
        ],
        correctAnswer: "Marginal productivity of capital had likely declined, reducing the incentive to sustain the earlier investment rate",
        explanation: "- a) Wrong — rising marginal productivity would typically encourage more investment, not a pullback, which is the opposite of what occurred.\\n- c) Wrong — investment rates and the returns available on capital are directly linked in standard growth accounting.\\n- d) Wrong — labor force growth is described as slowing over this period, not accelerating, and isn't caused by the investment rate."
      },
      {
        questionText: "South Korea's real GDP grew roughly 25-fold between 1960 and 1996, yet its per-capita income remained about 30% below the OECD average even in 1996. What does this combination best illustrate?",
        options: [
          "Korea's total GDP growth and its progress in closing a per-capita income gap are the same measurement",
          "Rapid aggregate GDP growth from a very low starting base does not by itself mean full convergence with richer economies has been completed",
          "Korea's population must have shrunk dramatically over this period",
          "A 25-fold increase in GDP is inconsistent with any remaining income gap"
        ],
        correctAnswer: "Rapid aggregate GDP growth from a very low starting base does not by itself mean full convergence with richer economies has been completed",
        explanation: "- a) Wrong — aggregate GDP growth and per-capita income relative to other countries are distinct measures, as the remaining 30% gap shows.\\n- c) Wrong — a shrinking population isn't required to explain a remaining per-capita gap alongside strong aggregate growth; a low starting base explains it.\\n- d) Wrong — very large percentage growth from a very low base can still leave an economy well behind others in absolute or relative per-capita terms."
      },
      {
        questionText: "Argentina's per-capita income fell from surpassing France's in 1913 to roughly 60% of France's by 1975. Which of the following would most plausibly account for this kind of sustained relative decline over six decades?",
        options: [
          "A single catastrophic year of negative growth in Argentina",
          "A persistent gap between Argentina's average annual growth rate and France's, compounding over many decades",
          "France's economy staying completely flat for the entire period",
          "An accounting error that has since been fully corrected"
        ],
        correctAnswer: "A persistent gap between Argentina's average annual growth rate and France's, compounding over many decades",
        explanation: "- a) Wrong — a single bad year cannot by itself explain a relative decline sustained across six decades; compounding gaps are required.\\n- c) Wrong — France's own income grew substantially over this period, based on the broader comparative growth figures involved, not staying flat.\\n- d) Wrong — the decline is treated as a real, well-documented economic outcome, not a data artifact."
      },
      {
        questionText: "If TSMC's accumulated manufacturing know-how doesn't deplete with use, what would you expect to happen to its marginal cost of serving an additional customer, compared to a manufacturer whose output depends mainly on adding more physical capital?",
        options: [
          "TSMC's marginal cost of serving another customer would tend to rise faster than a capital-constrained manufacturer's",
          "TSMC's marginal cost of serving another customer could stay relatively low or even fall, since existing know-how is reusable rather than a scarce, consumable input",
          "Both types of firms would face identical marginal costs at every level of output",
          "Marginal cost is unrelated to whether a firm's core asset is physical capital or accumulated knowledge"
        ],
        correctAnswer: "TSMC's marginal cost of serving another customer could stay relatively low or even fall, since existing know-how is reusable rather than a scarce, consumable input",
        explanation: "- a) Wrong — this describes the pattern expected from a capital-constrained producer facing scarcity, not a knowledge-based one like TSMC.\\n- c) Wrong — the whole distinction between reusable knowledge and finite physical capital implies different marginal-cost behavior, not identical costs.\\n- d) Wrong — the nature of the underlying asset (reusable knowledge versus finite capital) is precisely what should affect marginal cost behavior."
      },
      {
        questionText: "Growth-accounting research attributed almost all of Singapore's growth between 1966 and 1990 to rising capital and labor inputs, implying limited productivity growth. Based strictly on that finding, what would you have expected to happen to Singapore's growth once labor-force participation and investment rates stopped rising further — and how does Singapore's actual later performance complicate that expectation?",
        options: [
          "Growth should have stalled sharply, and it did exactly as predicted with no further income gains",
          "Growth should have stalled sharply, yet Singapore's income per person continued rising to among the highest in the world, suggesting the original accounting understated the economy's capacity for continued gains",
          "The accounting predicted continued explosive growth, and that is exactly what happened",
          "The accounting made no prediction whatsoever about future growth"
        ],
        correctAnswer: "Growth should have stalled sharply, yet Singapore's income per person continued rising to among the highest in the world, suggesting the original accounting understated the economy's capacity for continued gains",
        explanation: "- a) Wrong — Singapore's income continued rising substantially rather than stalling as the input-driven framing would predict.\\n- c) Wrong — the input-driven accounting implied a coming slowdown once inputs stopped growing, not continued explosive growth on the same terms.\\n- d) Wrong — the accounting carried a clear implicit prediction about diminishing growth once input expansion leveled off."
      },
      {
        questionText: "Two economies post identical GDP growth rates over a decade. Economy X shows a rising capital-output ratio over that period; Economy Y shows a falling capital-output ratio. Which economy is displaying the more efficient growth pattern, and why?",
        options: [
          "Economy X, because a rising ratio always signals stronger fundamentals",
          "Economy Y, because it is achieving the same growth with comparatively less new investment required per unit of output",
          "Both are equally efficient, since their growth rates are identical",
          "Efficiency cannot be assessed without knowing each country's population size"
        ],
        correctAnswer: "Economy Y, because it is achieving the same growth with comparatively less new investment required per unit of output",
        explanation: "- a) Wrong — a rising capital-output ratio signals that more investment is needed for the same growth, the opposite of stronger efficiency.\\n- c) Wrong — identical growth rates can mask very different levels of investment efficiency, which the capital-output ratio is specifically designed to reveal.\\n- d) Wrong — the capital-output ratio itself already accounts for the investment-to-growth relationship without requiring population data."
      },
      {
        questionText: "South Korea's exports rose from roughly 33 million dollars in 1960 to over 540 billion dollars by 2019, alongside a shift from import-substitution toward export-oriented industrial policy. Based on this pattern, what would you most expect from a similarly poor country today that instead pursued heavy import substitution and limited exposure to export markets?",
        options: [
          "An identical outcome to Korea's, since export orientation has no real bearing on growth",
          "A greater likelihood of shielding inefficient domestic industries from competitive pressure, potentially slowing the productivity gains export competition tends to force",
          "Automatically faster growth, since import substitution avoids foreign competition entirely",
          "No difference at all, since capital accumulation alone determines growth regardless of trade policy"
        ],
        correctAnswer: "A greater likelihood of shielding inefficient domestic industries from competitive pressure, potentially slowing the productivity gains export competition tends to force",
        explanation: "- a) Wrong — the lesson's contrast directly ties Korea's export orientation to its productivity and growth outcomes, implying trade policy does matter.\\n- c) Wrong — shielding domestic industry from competition is generally associated with slower, not faster, productivity growth in this context.\\n- d) Wrong — capital accumulation alone was insufficient to explain Korea's growth; export exposure is presented as a meaningfully contributing factor."
      },
      {
        questionText: "China's real estate and infrastructure sector made up about 31.7% of GDP in 2021, a larger share than the property sector reached in Spain or Ireland just before their respective economies were disrupted around 2008. Independent of any specific prediction about China, what general economic risk does this kind of comparison highlight?",
        options: [
          "No risk at all, since a larger construction sector always indicates a healthier economy",
          "A concentration of economic activity in construction and real estate can leave an economy more exposed if demand for that construction slows or reverses",
          "The comparison proves that a financial crisis in China is guaranteed to occur",
          "Property sector size has no historical relationship to financial stability anywhere"
        ],
        correctAnswer: "A concentration of economic activity in construction and real estate can leave an economy more exposed if demand for that construction slows or reverses",
        explanation: "- a) Wrong — a very large construction share is presented as a comparative warning sign, not an automatic indicator of health.\\n- c) Wrong — the comparison illustrates a general structural risk, not a guaranteed specific outcome for any one country.\\n- d) Wrong — the comparison explicitly rests on a historical relationship between oversized property sectors and prior financial disruptions elsewhere."
      },
      {
        questionText: "Japan's labor force growth fell from about 1.8% annually to roughly a third of that rate by the mid-1980s, while investment as a share of GDP also declined over the same period. Based on standard growth accounting, what would you expect for Japan's long-run growth trajectory from these two trends alone, independent of any separate financial crisis?",
        options: [
          "A trajectory of accelerating growth, since fewer inputs always improve efficiency",
          "A trajectory of gradually slowing growth, since both major input sources of output were expanding more slowly than before",
          "No change in the growth trajectory at all, since inputs don't affect long-run growth",
          "An trajectory that depends entirely on currency exchange rates, unrelated to capital or labor trends"
        ],
        correctAnswer: "A trajectory of gradually slowing growth, since both major input sources of output were expanding more slowly than before",
        explanation: "- a) Wrong — slower input growth would be expected to slow output growth, not accelerate it, all else equal.\\n- c) Wrong — standard growth accounting directly ties capital and labor growth rates to output growth.\\n- d) Wrong — exchange rates are a separate factor not central to this capital-and-labor-based reasoning."
      },
      {
        questionText: "TSMC's initial capital came roughly 48% from Taiwan's government, 28% from the Dutch firm Philips, and the remainder from private Taiwanese investors. What does this financing structure most plausibly suggest about the risk profile of founding a capital-intensive, unproven foundry business in 1987?",
        options: [
          "The venture was considered low-risk enough that private markets alone fully financed it",
          "The heavy reliance on government and strategic corporate backing suggests private capital markets alone viewed the venture as too risky or unproven to fully finance independently",
          "The financing structure indicates the business had no real capital requirements",
          "Government involvement in financing always indicates a company will fail"
        ],
        correctAnswer: "The heavy reliance on government and strategic corporate backing suggests private capital markets alone viewed the venture as too risky or unproven to fully finance independently",
        explanation: "- a) Wrong — the described funding structure shows private markets did not supply the majority of capital alone, contradicting a \"low-risk, fully private\" characterization.\\n- c) Wrong — the scale of financing described, spread across a government fund, a foreign firm, and private investors, implies substantial capital requirements.\\n- d) Wrong — the case shows the company ultimately succeeded, contradicting a blanket claim that government-backed financing always indicates failure."
      },
      {
        questionText: "Why might a poor country with abundant labor but very little existing capital see a higher return on building a new factory than a rich country building an identical factory?",
        options: [
          "Because the poor country's factory would face less competition from already-existing capital, allowing it to add relatively more to total output",
          "Because factories in poor countries are always built with cheaper, lower-quality materials",
          "Because rich countries are legally prohibited from building new factories",
          "Because labor abundance has no bearing on the returns to new capital"
        ],
        correctAnswer: "Because the poor country's factory would face less competition from already-existing capital, allowing it to add relatively more to total output",
        explanation: "- b) Wrong — material quality isn't the mechanism driving differing returns to capital in this reasoning; capital scarcity relative to existing capital stock is.\\n- c) Wrong — no such legal prohibition is part of standard economic reasoning about returns to capital in rich countries.\\n- d) Wrong — abundant labor paired with scarce capital is central to why new capital tends to generate larger returns in that setting."
      },
      {
        questionText: "Argentina defaulted on sovereign debt in 1982, 2001, 2014, and 2020. Based on standard economic reasoning about sovereign risk, what effect would you expect this repeated pattern to have on the interest rates foreign lenders demand on future Argentine debt, relative to a country with no default history?",
        options: [
          "Lower interest rates, since repeated defaults build lender trust over time",
          "Higher interest rates, since repeated defaults raise the perceived risk of future non-repayment",
          "No effect at all, since past default history is irrelevant to lenders",
          "Interest rates would only be affected by currency exchange rates, not default history"
        ],
        correctAnswer: "Higher interest rates, since repeated defaults raise the perceived risk of future non-repayment",
        explanation: "- a) Wrong — repeated defaults typically damage, rather than build, lender trust and confidence in future repayment.\\n- c) Wrong — sovereign default history is a standard, direct input into how lenders price risk on future debt.\\n- d) Wrong — default history itself is a distinct and significant factor in risk pricing, separate from exchange rate considerations."
      },
      {
        questionText: "Suppose a country has high investment, high labor-force growth, and essentially zero measured total factor productivity growth, all at the same time. What does this combination suggest about the sustainability of that country's growth once investment and labor-force growth eventually slow?",
        options: [
          "Growth would likely continue accelerating indefinitely regardless of input growth",
          "Growth would be at greater risk of slowing significantly, since none of the current growth is coming from a source — productivity — that could continue independent of further input growth",
          "Zero productivity growth guarantees the country's economy will shrink immediately",
          "Total factor productivity has no bearing on how sustainable growth is over time"
        ],
        correctAnswer: "Growth would be at greater risk of slowing significantly, since none of the current growth is coming from a source — productivity — that could continue independent of further input growth",
        explanation: "- a) Wrong — with zero productivity growth, output growth is fully tied to input growth, so slowing inputs should be expected to slow output too.\\n- c) Wrong — zero productivity growth alongside strong input growth can still coincide with strong current output growth, not immediate shrinkage.\\n- d) Wrong — the scenario is specifically constructed to show why productivity growth matters for the durability of an economy's growth once input growth fades."
      },
      {
        questionText: "From a strictly economic standpoint, why would competing in export markets tend to reveal a firm's productivity problems faster than selling only in a protected domestic market would?",
        options: [
          "Export markets have no competitors, unlike domestic markets",
          "Export markets force firms to compete directly against efficient producers from other countries, exposing inefficiencies that protected domestic markets can otherwise hide",
          "Export markets are smaller than domestic markets, reducing competitive pressure",
          "Currency exchange rates eliminate any competitive pressure in export markets"
        ],
        correctAnswer: "Export markets force firms to compete directly against efficient producers from other countries, exposing inefficiencies that protected domestic markets can otherwise hide",
        explanation: "- a) Wrong — export markets typically involve more, not fewer, competing producers than a protected domestic market.\\n- c) Wrong — export markets are generally larger, not smaller, than a single country's domestic market, and size isn't the mechanism at play regardless.\\n- d) Wrong — exchange rates are a factor in export competitiveness but don't eliminate competitive pressure altogether."
      },
      {
        questionText: "If a country's incremental capital-output ratio keeps rising while its investment share of GDP holds steady at around 45-47%, what would you expect to happen to its GDP growth rate over time, holding all else constant?",
        options: [
          "GDP growth rate would rise, since investment share remained constant",
          "GDP growth rate would tend to fall, since the same investment share now produces proportionally less additional output",
          "GDP growth rate would be entirely unaffected by changes in the capital-output ratio",
          "GDP growth rate would immediately become negative"
        ],
        correctAnswer: "GDP growth rate would tend to fall, since the same investment share now produces proportionally less additional output",
        explanation: "- a) Wrong — a constant investment share combined with a worsening (rising) capital-output ratio implies less growth per unit invested, not more.\\n- c) Wrong — the capital-output ratio directly links investment levels to the growth rate they can produce.\\n- d) Wrong — a rising ratio implies slower growth relative to before, not necessarily negative growth."
      },
      {
        questionText: "A widely cited 1994 growth-accounting critique predicted Singapore's economy would eventually stall in a manner resembling the Soviet Union's, based on its heavy reliance on input growth. Three years later, Singapore's income per person had overtaken the United States' by some measures. What does this outcome most directly suggest about relying purely on a backward-looking growth-accounting exercise to forecast a country's future growth?",
        options: [
          "Backward-looking accounting always perfectly predicts future growth with no exceptions",
          "A historical accounting exercise can accurately describe past growth composition without necessarily predicting how a country's policies and productivity will evolve afterward",
          "The 1994 prediction was later proven completely correct in every respect",
          "Growth-accounting exercises have no value whatsoever for understanding an economy"
        ],
        correctAnswer: "A historical accounting exercise can accurately describe past growth composition without necessarily predicting how a country's policies and productivity will evolve afterward",
        explanation: "- a) Wrong — the described outcome directly contradicts the idea that such forecasts always hold perfectly.\\n- c) Wrong — the actual outcome (continued strong income growth) contradicts the stall the 1994 prediction anticipated.\\n- d) Wrong — the accounting exercise is treated as a genuinely informative description of the historical growth composition, just not a reliable forecast of the future on its own."
      },
      {
        questionText: "If a manufacturer's production process improves each time it serves a more demanding customer, and that improvement then benefits every other customer at no additional cost, what does this imply about returns to scale in that kind of knowledge-based production, compared to a purely physical-capital-based process?",
        options: [
          "Returns to scale would tend to be less favorable than in a purely capital-based process",
          "Returns to scale could be more favorable, since the same improvement in know-how serves an expanding customer base without needing to be recreated for each one",
          "Returns to scale are identical in both cases by definition",
          "Returns to scale are undefined for any production process involving know-how"
        ],
        correctAnswer: "Returns to scale could be more favorable, since the same improvement in know-how serves an expanding customer base without needing to be recreated for each one",
        explanation: "- a) Wrong — this reverses the expected effect; knowledge that spreads without being recreated tends to support more, not less, favorable returns to scale.\\n- c) Wrong — a physical-capital-based process typically requires proportional new capital for each additional unit of output, unlike reusable know-how.\\n- d) Wrong — returns to scale are a standard, well-defined concept applicable to knowledge-based production as much as capital-based production."
      },
      {
        questionText: "Japan's real GNP grew close to 10% annually from 1955 to 1973 while investment reached 30-35% of GNP. If investment had instead been capped at roughly 15% of GNP throughout this period, with labor force growth unchanged, what would you most expect regarding the size of Japan's economy by 1973?",
        options: [
          "Japan's economy would likely have been substantially larger than it actually was",
          "Japan's economy would likely have been meaningfully smaller than it actually was, since a major driver of its rapid capital accumulation would have been sharply reduced",
          "Japan's economy would have been exactly the same size, since labor force growth alone determines output",
          "Investment levels have no bearing on the total size of an economy over an 18-year period"
        ],
        correctAnswer: "Japan's economy would likely have been meaningfully smaller than it actually was, since a major driver of its rapid capital accumulation would have been sharply reduced",
        explanation: "- a) Wrong — halving the investment rate would remove a major source of the rapid capital accumulation that drove growth, making a larger economy an unlikely outcome.\\n- c) Wrong — the reasoning throughout treats both capital and labor as meaningful contributors to output, not labor alone.\\n- d) Wrong — investment levels are directly tied to capital accumulation, a central driver of output growth over this kind of timeframe."
      },
      {
        questionText: "Consider two contrasting cases: one country sustained rapid convergence toward rich-country income levels across several decades despite a severe financial crisis along the way; another country, despite starting far wealthier, spent a century sliding backward through repeated currency collapses and defaults. What is the more defensible explanation for these different outcomes: the severity of each country's worst crisis, or the consistency of each country's institutions and policy over time?",
        options: [
          "The severity of the single worst crisis alone fully explains both outcomes",
          "The consistency of institutions and policy over time is the more defensible explanation, since one country recovered and resumed growth after its crisis while the other's instability was recurring rather than a single event",
          "Neither institutions nor crisis severity have any bearing on long-run growth outcomes",
          "Both countries experienced identical institutional stability, making crisis severity the only variable that differed"
        ],
        correctAnswer: "The consistency of institutions and policy over time is the more defensible explanation, since one country recovered and resumed growth after its crisis while the other's instability was recurring rather than a single event",
        explanation: "- a) Wrong — the country that recovered faced a severe crisis too, undermining the idea that crisis severity alone determined the outcome.\\n- c) Wrong — both institutional consistency and crisis events are shown to meaningfully shape each country's growth trajectory.\\n- d) Wrong — the two countries are described as having very different patterns of institutional and policy stability, not identical ones."
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
