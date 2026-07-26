import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 34;
  const tag = "Week 5";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>A company’s valuation is a prediction about the future.</p>

<p>It represents what investors believe a business will become, not simply what it is today. A startup with little revenue can receive a massive valuation if investors believe it has the potential to dominate a future market. This ability to price future possibilities is what allows innovative companies to raise enormous amounts of capital before becoming profitable.</p>

<p>A company <strong>valuation</strong> estimates the total worth of a business based on factors such as revenue, growth potential, market size, competitive advantages, and investor expectations. In private markets, valuation is often determined during funding rounds when investors exchange capital for ownership.</p>

<p>However, expectations can become disconnected from reality.</p>

<p><strong>Overvaluation</strong> occurs when a company's market value becomes higher than what its actual performance and future prospects can reasonably justify. This often happens during periods of excitement when investors compete to invest in companies they believe will become the next major industry leader.</p>

<p>High valuations can create powerful advantages. A highly valued company can attract talent, raise more money, gain public attention, and expand quickly. But they also create pressure. <em>Investors who paid a high price expect extraordinary growth</em>, and failing to meet those expectations can cause a dramatic decline in value.</p>

<p>The economics behind valuation are based on expectations about future cash flows. Investors are not only asking, "How much money does this company make today?" They are asking, "How much economic value could this company create in the future?"</p>

<p>The challenge is that predicting the future is uncertain.</p>

<p>A company can have a famous brand, billions in funding, rapid expansion, and strong investor excitement, yet still fail to create a sustainable business. The lesson of valuation is not that high valuations are bad. Many successful companies were once considered expensive because investors correctly predicted their future growth. The lesson is that <u>price and value are not always the same thing</u>.</p>

<p>A company becomes dangerous when the <strong>story becomes larger than the underlying economics</strong>.</p>`;

  const conceptSummary = `Valuation estimates what a company is worth based on current performance and future expectations. High-growth companies often receive large valuations because investors believe they can create significant future value. However, overvaluation occurs when expectations become disconnected from realistic business performance. Successful investing requires understanding the difference between a company's potential story and the economic fundamentals that support its value.`;

  const conceptTakeaways = [
    "Valuation represents expectations about a company's future value.",
    "Investors consider growth potential, market size, and competitive advantages.",
    "Overvaluation happens when expectations exceed realistic business performance.",
    "High valuations create opportunities but also increase pressure to deliver results.",
    "A compelling story does not replace strong economic fundamentals."
  ];

  const articleTitle = "The Startup That Was Once Worth $47 Billion";
  
  const articleText = `<p><strong>How can a company become one of the most valuable startups in the world — and then lose almost all of that value in just a few years?</strong></p>

<p>In 2019, WeWork was valued at approximately $47 billion by private investors. The company had transformed the traditional office market by turning flexible workspace into a global business. Instead of companies signing long-term office leases, WeWork allowed individuals and businesses to rent flexible workspace in modern shared offices.</p>

<p>Investors believed WeWork could become a revolutionary platform for the future of work. But the company's valuation depended on a very ambitious assumption: <em>that rapid growth would eventually lead to a highly profitable business</em>.</p>

<p><strong>Why were investors willing to value WeWork so highly?</strong></p>

<p>Because valuation is based on expectations, not only current profits. Investors saw rapid expansion, strong brand recognition, growing demand for flexible offices, and a large global market opportunity. They believed these factors could eventually create a dominant company.</p>

<p><strong>So what went wrong?</strong></p>

<p>The underlying economics became harder to justify. WeWork leased expensive office buildings through long-term contracts and then rented smaller spaces to customers through shorter agreements. This created a mismatch: <u>the company had significant fixed costs but depended on uncertain customer demand</u>. Growing quickly increased revenue, but it also increased financial obligations.</p>

<p><strong>Why is rapid growth sometimes dangerous?</strong></p>

<p>Because growth can hide problems. A company can increase sales while still losing money on each transaction. If investors focus only on expansion numbers and ignore profitability, <em>the valuation can rise far beyond</em> what the business model can support.</p>

<p><strong>Did WeWork fail because the idea itself was useless?</strong></p>

<p>No. Flexible workspace solved a real problem, and many customers valued the service. The issue was not whether the idea had value. The issue was whether the company's costs, growth strategy, and valuation expectations matched the economic reality.</p>

<p><strong>What does WeWork teach entrepreneurs and investors about valuation?</strong></p>

<p>A high valuation is not the same as a successful company. The strongest businesses combine a valuable product, sustainable economics, and realistic expectations about the future. <u>A company can have a powerful vision</u> and still require a business model capable of supporting that vision.</p>`;

  const articleSummary = `WeWork's rise and decline demonstrates the risks of overvaluation. Investors valued the company at $47 billion based on expectations of rapid growth and future dominance in flexible workspaces. However, questions about profitability, costs, and business sustainability caused its valuation to collapse. The case shows that successful companies require more than a compelling vision—they need economic fundamentals strong enough to support investor expectations.`;

  const articleTakeaways = [
    "WeWork reached a $47 billion valuation based on future growth expectations.",
    "Valuation reflects investor beliefs about future value, not only current profits.",
    "Rapid growth can hide weaknesses in a business model.",
    "A strong idea does not guarantee sustainable economics.",
    "Investors must separate exciting stories from realistic business fundamentals."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Valuation & Overvaluation Risk",
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
        questionText: "What does a company's \"valuation\" represent, as defined in this lesson?",
        options: [
          "The exact cash balance the company has in its bank account today",
          "A prediction about the future, representing what investors believe the business will become, rather than simply what it is today",
          "The total value of all office furniture owned by the company",
          "A tax liability calculated by the government"
        ],
        correctAnswer: "A prediction about the future, representing what investors believe the business will become, rather than simply what it is today",
        explanation: "this is the exact definition given in the concept section."
      },
      {
        questionText: "What is \"overvaluation,\" according to this lesson?",
        options: [
          "When a company's stock price falls below its book value",
          "When a company's market value becomes higher than what its actual performance and future prospects can reasonably justify",
          "A legal process for liquidating corporate assets",
          "When a company charges too much for its products"
        ],
        correctAnswer: "When a company's market value becomes higher than what its actual performance and future prospects can reasonably justify",
        explanation: "overvaluation is a disconnect between market price/valuation and the actual economic performance and realistic future prospects."
      },
      {
        questionText: "How can a high valuation create powerful advantages for a startup?",
        options: [
          "It automatically makes the company immune to competition",
          "It can help attract top talent, raise more money, gain public attention, and expand quickly",
          "It eliminates the need for a working product or service",
          "It legally prevents the company from ever losing money"
        ],
        correctAnswer: "It can help attract top talent, raise more money, gain public attention, and expand quickly",
        explanation: "high valuation gives founders leverage to hire better, raise larger sums with less dilution, and command public credibility."
      },
      {
        questionText: "According to the article, why did private investors value WeWork at $47 billion in 2019?",
        options: [
          "Because the company had already achieved massive, stable profits",
          "Because valuation is based on future expectations, and investors believed WeWork's rapid expansion and flexible office model would lead to global dominance",
          "Because WeWork owned all of its office buildings outright",
          "Because WeWork had no competitors in the workspace market"
        ],
        correctAnswer: "Because valuation is based on future expectations, and investors believed WeWork's rapid expansion and flexible office model would lead to global dominance",
        explanation: "investors priced in high expectations of rapid expansion and future market dominance, betting profit would follow."
      },
      {
        questionText: "You're a founder who has just received an extremely high valuation offer for your next funding round. Based on this lesson, what hidden risk should you keep in mind?",
        options: [
          "There is no risk; a higher valuation is always purely beneficial",
          "High valuations create extreme pressure to achieve extraordinary growth, and failing to meet those expectations can cause a dramatic collapse in value",
          "Investors will legally force you to spend all the money within one month",
          "A high valuation will make it impossible to hire new employees"
        ],
        correctAnswer: "High valuations create extreme pressure to achieve extraordinary growth, and failing to meet those expectations can cause a dramatic collapse in value",
        explanation: "valuation sets a benchmark of expectations; failing to hit the metrics implied by that valuation leads to down rounds or collapse."
      },
      {
        questionText: "You're an investor during a period of market excitement. You're considering investing in a hot startup that has rapid growth numbers and a highly compelling story, but unclear unit economics. What lesson does WeWork's collapse offer you?",
        options: [
          "Avoid all startups that have exciting stories",
          "Ensure that the company's costs, growth strategy, and valuation match economic reality, separating a compelling vision from sustainable business fundamentals",
          "Growth numbers are the only factor that should ever determine valuation",
          "Renting office space is illegal for startups"
        ],
        correctAnswer: "Ensure that the company's costs, growth strategy, and valuation match economic reality, separating a compelling vision from sustainable business fundamentals",
        explanation: "WeWork shows that brand narrative cannot replace solid economic fundamentals or bridge structural cost mismatches."
      },
      {
        questionText: "A software company with $1 million in revenue is valued at $100 million by investors who believe it will capture a massive new AI market. What is this valuation primarily based on?",
        options: [
          "Current financial metrics and cash flow",
          "Future expectations and predicted growth potential rather than current performance",
          "The value of the company's physical assets",
          "Government-backed price controls"
        ],
        correctAnswer: "Future expectations and predicted growth potential rather than current performance",
        explanation: "in early-stage/innovative sectors, valuation is primarily a prediction about what the business could capture, not what it does today."
      },
      {
        questionText: "WeWork leased expensive office buildings through long-term contracts and rented small spaces to customers through short-term contracts. Based on the article, what was the structural risk of this setup?",
        options: [
          "The company had zero fixed costs",
          "It created a mismatch: significant fixed costs combined with uncertain, short-term customer demand",
          "Customers were legally required to rent spaces forever",
          "Long-term leases are cheaper than short-term ones"
        ],
        correctAnswer: "It created a mismatch: significant fixed costs combined with uncertain, short-term customer demand",
        explanation: "this mismatch meant WeWork's liabilities were highly fixed and long-term, while its revenue was volatile and short-term."
      },
      {
        questionText: "An investor asserts: \"If a company has a famous brand, billions in funding, and rapid expansion, it is guaranteed to be a successful, sustainable business.\" Based on this lesson, is this statement correct?",
        options: [
          "Yes, those factors guarantee permanent profitability",
          "No, a company can have all of those things and still fail if its underlying business model cannot support its costs and growth strategy",
          "Yes, because private market valuations are never wrong",
          "No, because famous brands are illegal for high-growth startups"
        ],
        correctAnswer: "No, a company can have all of those things and still fail if its underlying business model cannot support its costs and growth strategy",
        explanation: "WeWork had all of these characteristics but still failed to survive due to underlying structural flaws."
      },
      {
        questionText: "According to this lesson, what is the key difference between price and value?",
        options: [
          "Price is what you pay; value is what the company is actually worth based on its underlying economics and cash-generating fundamentals",
          "There is no difference; price and value are always identical",
          "Price is determined by customers; value is determined only by the government",
          "Value is a short-term number; price is a long-term number"
        ],
        correctAnswer: "Price is what you pay; value is what the company is actually worth based on its underlying economics and cash-generating fundamentals",
        explanation: "price (valuation) can float on expectations, while value is eventually grounded in the actual economics of the business."
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
