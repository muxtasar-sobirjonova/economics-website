import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 31;
  const tag = "Week 5";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>At different points in its history, one car company has funded its growth with a government-backed loan, corporate bonds, and billions of dollars raised by selling its own stock directly to the public. It didn't pick one financing tool and stay loyal to it. It kept switching, deliberately, as its own situation changed.</p>

<p><strong>Debt financing</strong> means borrowing money that must be repaid, usually with interest, regardless of how the business performs. <strong>Equity financing</strong> means selling a share of ownership in exchange for capital, with no fixed repayment, but a permanent claim on the company's future value. Most explanations of this choice treat it as something a company decides once, based on its industry or size. Tesla's actual financing history shows something more useful: the same company can and should use both, at different moments, for different reasons.</p>

<p>The right tool depends on what's true about the company right now, not what's generally true about companies like it. Debt is attractive when interest rates are low and cash flow is predictable enough to service fixed repayments comfortably. Equity is attractive when a company's stock price is high, because selling shares at a high price raises more capital per share given up — meaning <em>less ownership diluted for the same amount of cash raised</em>.</p>

<p>This is why a mature company's financing decisions look less like a single strategic choice and more like continuous rebalancing. <u>A CFO isn't asking "are we a debt company or an equity company."</u> They're asking, every time capital is needed, which tool fits this specific moment — this stock price, this interest-rate environment, this cash flow situation — best. Getting that sequencing right, repeatedly, over years, is itself a form of financial skill separate from anything happening on the product side of the business.</p>`;

  const conceptSummary = `Debt must be repaid with interest regardless of performance; equity has no fixed repayment but gives up a permanent ownership claim. Rather than choosing one permanently, companies often use both at different moments — debt when rates are low and cash flow is predictable, equity when the stock price is high and dilution per dollar raised is lower. Skilled financing isn't a single choice; it's continuously matching the right tool to the current moment.`;

  const conceptTakeaways = [
    "Debt must be repaid with interest regardless of performance; equity carries no fixed repayment but dilutes ownership.",
    "A single company can and often does use both debt and equity at different points in its history.",
    "Debt tends to be more attractive when interest rates are low and cash flow is predictable.",
    "Equity tends to be more attractive when a company's stock price is high, minimizing dilution per dollar raised.",
    "Skilled financing means continuously matching the right tool to the current moment, not choosing once permanently."
  ];

  const articleTitle = "How a Car Company Nobody Believed Would Survive Kept Finding New Ways to Fund Itself";
  
  const articleText = `<p><strong>How does a company that lost money for over a decade convince anyone to lend it hundreds of millions of dollars?</strong></p>

<p>In 2010, Tesla received a $465 million loan from the U.S. Department of Energy's Advanced Technology Vehicle Manufacturing program, specifically intended to fund production of the Model S. At the time, Tesla had shipped very few vehicles and had no proven track record of mass-market manufacturing. This wasn't a conventional bank loan based on years of predictable revenue — it was a government program designed to accept exactly this kind of early-stage manufacturing risk.</p>

<p><strong>Why did Tesla repay that loan years ahead of schedule instead of holding onto cheap government capital as long as possible?</strong></p>

<p>Tesla repaid the loan in 2013, reportedly about nine years earlier than required. Beyond removing the oversight and reporting conditions attached to government financing, <em>early repayment signaled financial health to investors</em> and the public at a moment when the company badly needed credibility. By then, Tesla's rising stock price had also made equity a comparably attractive, and less encumbered, source of future capital.</p>

<p><strong>If debt worked well enough in 2010, why did Tesla later turn to selling its own stock instead, repeatedly?</strong></p>

<p>Because the conditions had changed. Selling new shares when a stock price is high raises more capital per share given up, meaning less ownership diluted for the same amount of cash. Tesla has repeatedly raised capital through equity offerings during periods when its stock price was elevated, using the proceeds to fund expansion of manufacturing capacity, rather than taking on additional fixed debt obligations at a time when the company's cash flow was still far from guaranteed.</p>

<p><strong>Why not just pick one method — debt or equity — and stick with it permanently?</strong></p>

<p>Because the trade-off itself isn't fixed. Interest rates rise and fall. Stock prices rise and fall. Cash flow shifts from years of heavy losses to periods of stronger generation. The tool that made sense in 2010, when the company had almost no revenue and needed patient, mission-aligned capital, wasn't the same tool that made sense years later, once the stock price reflected a much larger and more established company.</p>

<p><strong>If you were Tesla's CFO in a year when the stock price had just tripled while interest rates were also historically low, would you raise new capital through equity or through debt?</strong></p>

<p>Either could be defended. Equity avoids adding a fixed repayment obligation, at a moment when dilution costs relatively little given the high share price. Debt would be historically cheap to service, but adds a repayment obligation regardless of how the following years actually perform. <u>The right answer depends on how confident you are in future cash flow</u> holding up well enough to service new debt comfortably — a judgment call, not a formula.</p>

<p><strong>So was Tesla's real financing strategy about debt, or about equity, or about something else entirely?</strong></p>

<p>Neither, permanently. The real strategy was refusing to treat the debt-versus-equity question as settled once and done, and instead <u>continuously matching the financing tool</u> to the specific stock price, interest-rate environment, and cash position the company actually faced at each moment it needed new capital.</p>`;

  const articleSummary = `Tesla financed its early growth partly through a $465 million U.S. government loan in 2010, repaid years ahead of schedule by 2013, and later relied heavily on equity offerings during periods of high stock price to fund expansion. Rather than settling on one financing method, Tesla continuously shifted between debt and equity as interest rates, stock price, and cash flow conditions changed — treating financing as an ongoing decision, not a one-time choice.`;

  const articleTakeaways = [
    "Tesla received a $465 million U.S. Department of Energy loan in 2010 to fund Model S production, at a time when it had little proven manufacturing track record.",
    "The loan was repaid in 2013, reportedly about nine years ahead of schedule.",
    "Tesla later relied on equity offerings during periods of high stock price to fund expansion, minimizing dilution per dollar raised.",
    "The optimal financing tool changed as interest rates, stock price, and cash flow shifted over the company's history.",
    "Tesla's real financing strategy was continuous rebalancing between debt and equity, not a single permanent choice."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Debt vs. Equity Financing",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
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
        questionText: "What is \"debt financing,\" per this lesson?",
        options: [
          "Selling a share of ownership in exchange for capital",
          "Borrowing money that must be repaid, usually with interest, regardless of business performance",
          "A government grant that never needs repayment",
          "A type of ownership limited to public companies"
        ],
        correctAnswer: "Borrowing money that must be repaid, usually with interest, regardless of business performance",
        explanation: "this is the exact definition given. A describes equity, the contrasting concept. C and D are fabricated claims."
      },
      {
        questionText: "What is \"equity financing,\" per this lesson?",
        options: [
          "Borrowing money with a fixed repayment schedule",
          "Selling a share of ownership in exchange for capital, with no fixed repayment but a permanent claim on future value",
          "A type of loan requiring no interest",
          "A government-mandated funding requirement"
        ],
        correctAnswer: "Selling a share of ownership in exchange for capital, with no fixed repayment but a permanent claim on future value",
        explanation: "this is the exact definition given. A describes debt, the contrasting concept. C and D are fabricated claims."
      },
      {
        questionText: "According to this lesson, why is equity financing more attractive when a company's stock price is high?",
        options: [
          "Because high stock prices make debt illegal to issue",
          "Because selling shares at a high price raises more capital per share given up, meaning less ownership diluted for the same amount of cash",
          "Because equity always becomes free of cost once the stock price rises",
          "Because high stock prices eliminate the need for any future financing"
        ],
        correctAnswer: "Because selling shares at a high price raises more capital per share given up, meaning less ownership diluted for the same amount of cash",
        explanation: "this is the lesson's direct explanation. A, C, and D are fabricated claims."
      },
      {
        questionText: "Why does this lesson argue that a company's optimal financing choice can change over its own lifetime, rather than being fixed once?",
        options: [
          "Because interest rates, stock price, and cash flow conditions all shift over time, changing which tool fits best at any given moment",
          "Because companies are legally required to alternate financing methods every year",
          "Because debt and equity are functionally identical financial instruments",
          "Because financing decisions have no relationship to a company's actual circumstances"
        ],
        correctAnswer: "Because interest rates, stock price, and cash flow conditions all shift over time, changing which tool fits best at any given moment",
        explanation: "this is the lesson's central argument, illustrated by Tesla's history. B, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "You're Tesla's CFO in a year when the stock price has just tripled and interest rates are historically low. Based on this lesson, what is the central trade-off between raising capital through equity versus debt in this specific moment?",
        options: [
          "There is no real trade-off — one option is always objectively better regardless of circumstances",
          "Equity avoids a fixed repayment obligation at a moment when dilution costs relatively little given the high price, while debt would be cheap but adds a repayment obligation regardless of future performance",
          "Debt is illegal to issue when stock prices are high",
          "Equity financing is always free of any cost to the company"
        ],
        correctAnswer: "Equity avoids a fixed repayment obligation at a moment when dilution costs relatively little given the high price, while debt would be cheap but adds a repayment obligation regardless of future performance",
        explanation: "this reflects the lesson's exact framing of this decision. A, C, and D are fabricated or oversimplified claims."
      },
      {
        questionText: "You're an executive at an early-stage manufacturing company with little revenue and an unproven track record, considering a government-backed loan program designed for exactly this kind of risk. Based on this lesson, what does Tesla's 2010 experience suggest about pursuing this option?",
        options: [
          "Such loans are never available to unproven companies under any circumstances",
          "A government-backed program built for early-stage risk may accept a track record that a conventional bank loan would not, as illustrated by Tesla's 2010 DOE loan",
          "Government loans always carry higher costs than equivalent private debt",
          "Early-stage companies should never accept government financing under any circumstances"
        ],
        correctAnswer: "A government-backed program built for early-stage risk may accept a track record that a conventional bank loan would not, as illustrated by Tesla's 2010 DOE loan",
        explanation: "this directly reflects Tesla's actual documented experience in the lesson. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "A company's stock price has just fallen sharply, while interest rates in the broader economy remain low. Based on this lesson's logic, which financing option is likely more attractive at this specific moment?",
        options: [
          "Equity, since a low stock price always minimizes dilution",
          "Debt, since low interest rates make it cheap to service, while a low stock price would mean giving up more ownership per dollar raised through equity",
          "Neither option has any relative advantage in this scenario",
          "Equity, because raising capital through equity always ignores stock price"
        ],
        correctAnswer: "Debt, since low interest rates make it cheap to service, while a low stock price would mean giving up more ownership per dollar raised through equity",
        explanation: "this is a direct application of the lesson's core reasoning about matching financing tools to current conditions. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A company repays a loan years ahead of its required schedule, despite the loan carrying a historically low interest rate. Based on this lesson, what is a plausible reason for this decision beyond the interest cost alone?",
        options: [
          "Early repayment is always financially irrational regardless of circumstances",
          "Removing the oversight or conditions attached to the loan, and signaling financial health to investors, can be valuable even when the loan itself was cheap",
          "Loans can never be repaid before their scheduled maturity date",
          "Early repayment has no effect on a company's relationship with investors"
        ],
        correctAnswer: "Removing the oversight or conditions attached to the loan, and signaling financial health to investors, can be valuable even when the loan itself was cheap",
        explanation: "this mirrors Tesla's actual reasoning as described in the lesson. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "Two companies need the same amount of capital. Company A has highly predictable cash flow and access to historically low interest rates. Company B has an elevated stock price but uncertain near-term cash flow. Based on this lesson, which financing approach fits each company better?",
        options: [
          "Company A may lean toward debt given predictable cash flow and low rates; Company B may lean toward equity given its high stock price and cash flow uncertainty",
          "Both companies should use identical financing regardless of their circumstances",
          "Company A should use equity and Company B should use debt, reversing the lesson's logic",
          "Cash flow predictability and stock price have no bearing on financing choice"
        ],
        correctAnswer: "Company A may lean toward debt given predictable cash flow and low rates; Company B may lean toward equity given its high stock price and cash flow uncertainty",
        explanation: "this is a direct application of the lesson's central matching principle. B, C, and D all contradict this reasoning."
      },
      {
        questionText: "A mature company has used debt during one period of its history and equity during another, adjusting its choice as interest rates and its own stock price changed over time. Based on this lesson, what does this pattern best illustrate?",
        options: [
          "A confused or poorly planned financing strategy with no underlying logic",
          "A deliberate, ongoing rebalancing between financing tools based on which one fits the company's current circumstances",
          "A violation of standard corporate finance principles",
          "Evidence that debt and equity are functionally interchangeable at all times"
        ],
        correctAnswer: "A deliberate, ongoing rebalancing between financing tools based on which one fits the company's current circumstances",
        explanation: "this reflects Tesla's actual financing pattern as described in the lesson. A, C, and D all contradict this reasoning."
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
