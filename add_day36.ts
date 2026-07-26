import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 36;
  const tag = "Week 6";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>In 2007, Netflix's DVD-by-mail business was profitable, growing, and genuinely loved by its customers. That same year, the company began deliberately building the thing most likely to make that business obsolete.</p>

<p><strong>Expected value</strong> means multiplying the probability of each possible outcome by the value of that outcome, then summing across every possibility, to compare choices on more than just their current, certain payoff. A rational decision-maker doesn't just ask "which option is safest right now" — they ask "which option produces the highest value across all the ways the future could actually unfold."</p>

<p>This matters because a company's most profitable current business and its highest expected-value future path aren't always the same thing. DVD-by-mail had a high, near-certain value: an established, predictable, profitable model with years of operating history behind it. Streaming, in 2007, had genuinely uncertain value — unclear whether bandwidth, licensing costs, or consumer habits would cooperate. But if it worked, the payoff would dwarf anything the DVD business could ever produce, because it removed physical shipping entirely and <em>could scale globally in a way mail-order never could</em>.</p>

<p>This is where <strong>cannibalization</strong> becomes a rational strategy rather than a mistake: <u>deliberately building a product that competes with</u>, and may eventually replace, your own most profitable existing business — because the expected value of the new path, weighted honestly across its real chance of failure, exceeds the expected value of protecting the old one indefinitely as it slowly loses relevance.</p>

<p>The founders who get this right aren't comparing "safe thing versus risky thing" and picking safe by default. They're doing the harder math: <u>multiplying probability by payoff for every path available</u>, including the one that means competing against their own current success.</p>`;

  const conceptSummary = `Expected value means weighing the probability and payoff of every possible outcome, not just comparing a certain current option to a risky one. A profitable existing business and the highest expected-value future path aren't always the same thing. Cannibalization — building a product that competes with your own success — becomes rational when the new path's expected value, weighted honestly for its real chance of failure, exceeds protecting the old business indefinitely.`;

  const conceptTakeaways = [
    "Expected value means multiplying probability by payoff across every possible outcome, not just comparing certainty to risk.",
    "A company's most profitable current business isn't always its highest expected-value future path.",
    "Cannibalization — competing against your own profitable business — can be the economically rational choice.",
    "A lower-probability but much larger payoff can have a higher expected value than a safe, modest, certain one.",
    "Sound founder decisions weigh real probabilities and payoffs honestly, rather than defaulting to whichever option feels safest today."
  ];

  const articleTitle = "Why Netflix Spent Years Trying to Kill Its Own Profitable DVD Business";
  
  const articleText = `<p><strong>Why would a profitable, growing company deliberately build a product designed to replace its own core business?</strong></p>

<p>In 2007, Netflix launched a streaming option — "Watch Instantly" — as an add-on to its existing DVD-by-mail subscriptions, at a time when DVD rentals were still the overwhelming majority of the company's revenue and profit. Nothing about the DVD business was failing yet. The decision to invest heavily in streaming wasn't a reaction to declining sales — it was a bet made while the old model was still working.</p>

<p><strong>What made this a genuine expected-value calculation rather than simply chasing a trend?</strong></p>

<p>The DVD business had high near-term certainty but a shrinking long-run trajectory, as internet speeds and digital distribution were clearly approaching. Streaming had much lower near-term certainty — unproven bandwidth, unresolved licensing costs, unclear consumer habits — but a vastly larger potential payoff if it worked, since it eliminated shipping and could scale to any market with an internet connection. <em>Weighing a modest, near-certain payoff against a much larger, less certain one</em> is exactly the calculation expected value is built for.</p>

<p><strong>How is this different from a company like Blockbuster, which stuck with its most profitable existing model?</strong></p>

<p>Blockbuster largely protected its current, certain, physical-rental profits and treated early digital distribution as a threat to be managed rather than a higher-expected-value bet worth pursuing directly. <u>The company filed for bankruptcy in 2010</u>, only a few years into this divergence, while Netflix's earlier bet on the higher-expected-value path had already begun paying off.</p>

<p><strong>If streaming was this strong a bet, why didn't Netflix abandon DVDs immediately?</strong></p>

<p>It didn't need to. Netflix ran both businesses concurrently for years, using DVD profits to help fund the buildout of streaming infrastructure, licensing deals, and consumer adoption while the newer business matured. This wasn't hesitation — it was <u>managing the transition deliberately</u>, rather than betting the entire company on an unproven path all at once.</p>

<p><strong>If you ran Netflix's DVD division in 2007, watching your own company invest millions into a product built to make your division obsolete, would you have pushed back — or understood the math behind it?</strong></p>

<p>Pushing back defends a real, currently profitable business that your team built and depends on. Understanding the math means accepting that maximizing the company's overall expected value can require actively working against a specific division's short-term interest — an uncomfortable position for anyone whose job is tied to that division's continued success.</p>

<p><strong>So was Netflix's real bet about streaming technology — or about which side of an expected-value calculation to stand on?</strong></p>

<p>The technology mattered, but the deeper decision was purely economic: choosing the path with the higher expected value across time, even though it meant deliberately competing against the company's own most profitable existing business.</p>`;

  const articleSummary = `Netflix launched streaming in 2007 while its DVD-by-mail business was still profitable and growing, deliberately investing in a product that could eventually replace its own core revenue source. The decision reflected an expected-value calculation: a lower-certainty but much larger potential payoff, weighed against a smaller but safer, shrinking one. Running both businesses concurrently allowed a managed transition, in contrast to Blockbuster, which protected its existing model and filed for bankruptcy in 2010.`;

  const articleTakeaways = [
    "Netflix launched streaming in 2007 while DVD-by-mail was still the large majority of its profitable revenue.",
    "The decision reflected a deliberate expected-value trade-off between a safe, near-certain business and a much larger, less certain opportunity.",
    "Blockbuster largely protected its existing profitable model instead, and filed for bankruptcy in 2010.",
    "Netflix ran DVD and streaming concurrently for years, funding the transition rather than betting everything at once.",
    "The core decision was economic, not technological — choosing the higher expected-value path even at the cost of the company's own existing success."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Expected Value in Founder Decisions",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
        tag // Sync the tag to Week 6
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
        questionText: "What is \"expected value,\" as defined in this lesson?",
        options: [
          "The current market price of a company's stock",
          "The sum of each possible outcome's probability multiplied by its value, used to compare choices beyond just their certain current payoff",
          "A guaranteed future profit figure",
          "The total revenue a company earned in its most recent fiscal year"
        ],
        correctAnswer: "The sum of each possible outcome's probability multiplied by its value, used to compare choices beyond just their certain current payoff",
        explanation: "this is the exact definition given. A, C, and D are fabricated or unrelated claims."
      },
      {
        questionText: "According to this lesson, why can a company's most profitable current business not be its highest expected-value future path?",
        options: [
          "Because current profitability always guarantees the highest expected future value",
          "Because a business with a shrinking long-run trajectory can have lower expected value than an uncertain but much larger emerging opportunity",
          "Because expected value only applies to unprofitable businesses",
          "Because profitable businesses are always immune to future decline"
        ],
        correctAnswer: "Because a business with a shrinking long-run trajectory can have lower expected value than an uncertain but much larger emerging opportunity",
        explanation: "this is the lesson's direct explanation, illustrated by Netflix's DVD business. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "What is \"cannibalization,\" as used in this lesson?",
        options: [
          "A company illegally copying a competitor's product",
          "Deliberately building a product that competes with, and may replace, your own existing profitable business, because its expected value is higher",
          "A government policy limiting a company's market share",
          "A pricing strategy used only by unprofitable companies"
        ],
        correctAnswer: "Deliberately building a product that competes with, and may replace, your own existing profitable business, because its expected value is higher",
        explanation: "this is the exact definition given. A, C, and D are fabricated, unrelated claims."
      },
      {
        questionText: "Why does this lesson argue that Blockbuster's strategy differed meaningfully from Netflix's, despite both companies facing the same industry shift?",
        options: [
          "Blockbuster invested more heavily in streaming technology than Netflix did",
          "Blockbuster largely protected its current, certain profits rather than pursuing the higher expected-value uncertain path, while Netflix deliberately built toward it",
          "Blockbuster and Netflix pursued functionally identical strategies",
          "Blockbuster's decline had no relationship to its strategic choices"
        ],
        correctAnswer: "Blockbuster largely protected its current, certain profits rather than pursuing the higher expected-value uncertain path, while Netflix deliberately built toward it",
        explanation: "this is the lesson's direct contrast. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "You run Netflix's DVD division in 2007, watching your own company invest heavily in a streaming product built to eventually replace your division. Based on this lesson, what does understanding \"the math\" behind this decision actually require?",
        options: [
          "Believing your division will remain the company's top priority indefinitely",
          "Accepting that maximizing the company's overall expected value can require actively working against your own division's short-term interest",
          "Refusing to acknowledge any economic reasoning behind the decision",
          "Assuming the decision has no real financial logic behind it"
        ],
        correctAnswer: "Accepting that maximizing the company's overall expected value can require actively working against your own division's short-term interest",
        explanation: "this reflects the lesson's central point about expected-value-driven, company-wide decision-making. A, C, and D all contradict or ignore this reasoning."
      },
      {
        questionText: "You're a founder whose current, profitable product line has a shrinking long-term trajectory, while a new, uncertain opportunity has a much larger potential payoff if successful. Based on this lesson, what should guide your decision?",
        options: [
          "Always default to protecting the current profitable product regardless of its long-term trajectory",
          "Compare the expected value of both paths — weighing probability and payoff honestly — rather than assuming the safer current option is automatically the better one",
          "Ignore probability entirely and choose whichever option has the largest potential payoff",
          "Avoid any decision that could reduce your current product's revenue under any circumstances"
        ],
        correctAnswer: "Compare the expected value of both paths — weighing probability and payoff honestly — rather than assuming the safer current option is automatically the better one",
        explanation: "this is a direct application of the lesson's central expected-value framework. A, C, and D all misapply or ignore that framework."
      },
      {
        questionText: "A company has two options: Option A offers a modest, highly certain profit. Option B offers a much larger potential profit but with meaningfully lower certainty of success. Based on this lesson, how should a founder evaluate these two options?",
        options: [
          "Always choose Option A, since certainty should override any other consideration",
          "Calculate and compare the expected value of each option — probability multiplied by payoff — rather than defaulting to the safer-seeming choice",
          "Always choose Option B, since larger potential payoffs are always the better choice regardless of probability",
          "Flip a coin, since expected value cannot meaningfully guide this kind of decision"
        ],
        correctAnswer: "Calculate and compare the expected value of each option — probability multiplied by payoff — rather than defaulting to the safer-seeming choice",
        explanation: "this is a direct application of the lesson's core expected-value framework. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A software company begins building a new product internally that could eventually replace its own best-selling existing product, even while that existing product is still highly profitable. Based on this lesson, what is the most likely economic justification for this decision?",
        options: [
          "The company believes the new product's expected value, weighed across its real probability of success and larger potential payoff, exceeds continuing to rely solely on the existing product's shrinking long-term trajectory",
          "The company has no economic reasoning and is acting randomly",
          "Cannibalizing an existing profitable product is always an irrational mistake",
          "The decision reflects a legal requirement to diversify product lines"
        ],
        correctAnswer: "The company believes the new product's expected value, weighed across its real probability of success and larger potential payoff, exceeds continuing to rely solely on the existing product's shrinking long-term trajectory",
        explanation: "this is a direct application of the lesson's central cannibalization argument. B, C, and D all contradict or ignore this reasoning."
      },
      {
        questionText: "Two companies face the same emerging technological shift. Company A protects its current profitable model and treats the new technology as a minor threat to be managed. Company B invests heavily in the new technology despite short-term uncertainty. Based on this lesson, which company is making the higher expected-value decision, assuming the new technology's potential payoff genuinely outweighs its risk?",
        options: [
          "Company A, since protecting current profits is always the economically superior choice",
          "Company B, since it is weighing the new technology's larger potential payoff against its real probability of success, rather than defaulting to the safer current path",
          "Neither company's strategy has any relationship to expected value",
          "Both companies are making economically identical decisions"
        ],
        correctAnswer: "Company B, since it is weighing the new technology's larger potential payoff against its real probability of success, rather than defaulting to the safer current path",
        explanation: "this directly mirrors the lesson's contrast between Netflix and Blockbuster. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A company runs its old, profitable product line alongside a new, uncertain one for several years, using profits from the old line to help fund the new one's development. Based on this lesson, what does this approach best illustrate?",
        options: [
          "A confused strategy with no clear economic logic",
          "A managed transition that allows a company to pursue a higher expected-value path without abandoning its current business all at once",
          "A violation of standard business practice with no real-world precedent",
          "Evidence that the company has no confidence in either business line"
        ],
        correctAnswer: "A managed transition that allows a company to pursue a higher expected-value path without abandoning its current business all at once",
        explanation: "this directly mirrors Netflix's actual approach as described in the lesson. A, C, and D all contradict this reasoning."
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
