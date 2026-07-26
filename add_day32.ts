import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 32;
  const tag = "Week 5";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>A venture capital firm does not invest because a company is already safe. It invests because the company might become something enormous.</p>

<p>A <strong>venture capital (VC) model</strong> provides funding to early-stage companies with high growth potential in exchange for ownership equity. Unlike traditional lenders, venture capitalists do not expect every investment to succeed. They understand that startups operate under extreme uncertainty, where many companies will fail, but a <em>small number of extraordinary winners can generate returns large enough to compensate for the losses</em>.</p>

<p>This creates a unique investment strategy: the goal is not to find businesses with guaranteed success, but to identify companies with the potential to completely transform markets. A venture capitalist may invest in ten companies knowing that several may fail, because one company growing from a small startup into a global leader can return more than the entire portfolio cost.</p>

<p>The economics behind venture capital depend on <strong>asymmetric returns</strong>. The downside of an investment is limited because the investor can only lose the amount invested. However, <u>the upside can be enormous</u> if the company achieves rapid growth. This is why venture capital focuses heavily on industries where successful companies can scale quickly, such as technology, software, biotechnology, and platforms.</p>

<p>For entrepreneurs, venture capital provides access to capital that would be impossible to generate through normal business revenue. This allows startups to hire talent, develop products, enter new markets, and grow faster than competitors. However, this funding comes with a trade-off: <u>founders give up ownership, accept investor involvement, and face pressure to achieve significant growth</u>.</p>

<p>Venture capital is therefore not simply money for startups. It is a system designed to finance uncertain ideas with the possibility of creating extraordinary value.</p>`;

  const conceptSummary = `Venture capital funds high-growth startups by investing money in exchange for ownership equity. Because startups are uncertain, many investments fail, but a few exceptional companies can create enormous returns. VC investors accept risk because the potential upside is unlimited. Entrepreneurs gain resources to scale quickly but sacrifice some ownership and control in exchange for investor capital.`;

  const conceptTakeaways = [
    "Venture capital invests in startups with high growth potential and uncertainty.",
    "VC investors expect many investments to fail while a few create exceptional returns.",
    "The model depends on asymmetric outcomes: limited losses and potentially unlimited gains.",
    "Startups use VC funding to scale faster than they could through revenue alone.",
    "Entrepreneurs trade ownership and control for access to growth capital."
  ];

  const articleTitle = "The Fund That Invested Billions Before the Future Was Proven";
  
  const articleText = `<p><strong>How can an investor justify putting billions of dollars into companies that may not become profitable for years?</strong></p>

<p>Traditional investing often focuses on companies that already have proven revenue, stable customers, and predictable performance. Venture capital works differently. Instead of investing in what already exists, venture capitalists invest in what could exist if a company succeeds.</p>

<p>SoftBank's Vision Fund became one of the most famous examples of this approach. Created in 2017, the fund raised tens of billions of dollars to invest in technology companies around the world. Rather than making small investments, SoftBank often provided enormous amounts of capital to companies it believed could become global leaders.</p>

<p><strong>Why would investors choose companies with uncertain futures instead of safer businesses?</strong></p>

<p>Because venture capital is built around the idea that extraordinary companies create extraordinary returns. A company that grows from a small startup into a global platform can become worth hundreds of billions of dollars. A traditional investment might provide steady returns, but a successful startup investment can completely change an investor's portfolio.</p>

<p><strong>Why don't venture capitalists simply invest only in companies that are already successful?</strong></p>

<p>Because <em>by the time a company has already proven itself, much of the growth opportunity may have disappeared</em>. VC investors attempt to identify companies before they become dominant. They invest when the outcome is uncertain because uncertainty is also where the greatest potential value exists.</p>

<p><strong>Why do venture-backed companies often focus on growth instead of immediate profitability?</strong></p>

<p>Because venture capital assumes that <u>capturing a large market can be more valuable</u> than earning small profits early. A startup may spend heavily on hiring, marketing, and expansion because becoming the leading company in a market can create advantages that are difficult for competitors to overcome.</p>

<p><strong>Does receiving billions in funding guarantee that a company will succeed?</strong></p>

<p>No. Capital can accelerate a strong business, but it cannot replace customer demand or fix a weak strategy. Large investments create opportunities, but they also create pressure to achieve results that justify the company's valuation.</p>

<p>So what is the real logic behind venture capital? It is not about finding companies that cannot fail. It is about <u>building a portfolio where a small number of massive winners</u> can outweigh many unsuccessful investments. The venture capital model accepts failure as part of the process because the potential impact of one successful company can be extraordinary.</p>`;

  const articleSummary = `SoftBank's Vision Fund demonstrates how venture capital invests in ambitious companies before their success is guaranteed. By providing enormous amounts of capital, venture investors help startups grow rapidly while accepting that some investments may fail. The model works because a few companies that achieve massive success can generate returns large enough to compensate for many unsuccessful investments.`;

  const articleTakeaways = [
    "Venture capital invests in potential future leaders rather than only proven companies.",
    "SoftBank's Vision Fund represented the scale and ambition of modern VC investing.",
    "VC investors accept failure because a few winners can create extraordinary returns.",
    "Funding helps companies grow faster but does not guarantee success.",
    "Venture capital is a portfolio strategy built around uncertainty and asymmetric outcomes."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Venture Capital Model",
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
        questionText: "What is the core objective of the \"venture capital\" model, according to this lesson?",
        options: [
          "Providing low-interest loans to mature, safe companies",
          "Providing funding to early-stage companies with high growth potential in exchange for ownership equity",
          "Advising governments on fiscal policies",
          "Operating traditional retail banks"
        ],
        correctAnswer: "Providing funding to early-stage companies with high growth potential in exchange for ownership equity",
        explanation: "this is the exact definition given in the concept section."
      },
      {
        questionText: "Why do venture capitalists accept that many of their investments will fail?",
        options: [
          "Because they are legally required to lose a percentage of their capital",
          "Because a small number of extraordinary winners can generate returns large enough to compensate for the losses",
          "Because they do not care about financial returns",
          "Because early-stage failures are tax-exempt"
        ],
        correctAnswer: "Because a small number of extraordinary winners can generate returns large enough to compensate for the losses",
        explanation: "VC is a portfolio play where a single breakout success can pay for all other failures in the fund."
      },
      {
        questionText: "What does the term \"asymmetric returns\" mean in the context of venture capital?",
        options: [
          "The investor's losses are potentially unlimited, while their gains are capped",
          "The investor can only lose the amount they invest, while the potential upside is enormous if the company achieves rapid growth",
          "Returns are always equal across all companies in the portfolio",
          "Profits are distributed unevenly among the founders only"
        ],
        correctAnswer: "The investor can only lose the amount they invest, while the potential upside is enormous if the company achieves rapid growth",
        explanation: "asymmetry means the floor is capped (lose 1x) while the ceiling is practically uncapped (can make 10x, 100x+)."
      },
      {
        questionText: "Why do venture-backed startups often focus heavily on rapid growth rather than immediate profitability?",
        options: [
          "Because immediate profitability is illegal for early-stage companies",
          "Because becoming the leading company in a market can create advantages that make it very difficult for competitors to copy or catch up",
          "Because venture capitalists do not allow companies to earn profits",
          "Because growth is easier to achieve than profitability in all markets"
        ],
        correctAnswer: "Because becoming the leading company in a market can create advantages that make it very difficult for competitors to copy or catch up",
        explanation: "capturing the market early creates network density, barriers to entry, and scaling advantages that solidify dominance."
      },
      {
        questionText: "You're an entrepreneur who wants to maintain absolute control over all strategic decisions and keep 100% of your company's ownership. Based on this lesson, how should you view venture capital?",
        options: [
          "You should raise VC funding immediately because investors never influence decisions",
          "Venture capital is probably the wrong choice, because VC funding requires trading ownership and strategic control for growth capital",
          "VC funding is the only way to retain strategic control",
          "Venture capitalists will force you to take 100% ownership"
        ],
        correctAnswer: "Venture capital is probably the wrong choice, because VC funding requires trading ownership and strategic control for growth capital",
        explanation: "this directly reflects the tradeoffs of VC: founders give up equity and accept board/investor involvement."
      },
      {
        questionText: "You're a general partner at a venture capital firm evaluating a startup. The founder has built a stable, low-risk business that will likely grow slowly and reach small, steady profits. Based on this lesson, why might you reject this investment?",
        options: [
          "Because the startup is too risky for a VC portfolio",
          "Because the venture capital model requires high-growth potential and asymmetric upside to justify the portfolio's other losses, which a slow-growing business cannot offer",
          "Because venture capitalists are legally barred from investing in profitable companies",
          "Because the founder is refusing to take the money"
        ],
        correctAnswer: "Because the venture capital model requires high-growth potential and asymmetric upside to justify the portfolio's other losses, which a slow-growing business cannot offer",
        explanation: "VC requires massive scale potential; a stable but slow-growing business is not built for the VC return profile."
      },
      {
        questionText: "An investor puts $1 million into each of 10 early-stage software startups. Eight of the startups fail completely. One breaks even. The tenth startup becomes a global leader and is valued at $200 million. Based on this lesson, what does this outcome illustrate?",
        options: [
          "A failed investment strategy, because 80% of the companies went bankrupt",
          "The classic venture capital portfolio model, where a single massive winner outweighs many unsuccessful investments",
          "A violation of the asymmetric returns principle",
          "Proof that software is a bad industry for venture capital"
        ],
        correctAnswer: "The classic venture capital portfolio model, where a single massive winner outweighs many unsuccessful investments",
        explanation: "this is the classic power-law dynamic in venture capital portfolios."
      },
      {
        questionText: "SoftBank's Vision Fund is famous for providing enormous amounts of capital to technology startups. Based on the article, what is the underlying logic of this strategy?",
        options: [
          "Enormous funding guarantees that a company will succeed regardless of strategy",
          "Investing billions into potential future leaders before the future is proven can help them capture markets and generate extraordinary returns",
          "SoftBank only invests in companies that have already achieved permanent profitability",
          "Technology companies have zero risk of failure"
        ],
        correctAnswer: "Investing billions into potential future leaders before the future is proven can help them capture markets and generate extraordinary returns",
        explanation: "capital acceleration attempts to buy market leadership early, betting that dominance will capture extraordinary long-term value."
      },
      {
        questionText: "A startup raises a massive round of venture capital to fund aggressive hiring and marketing. Based on the lesson, what is the most direct trade-off of this decision?",
        options: [
          "The startup will have no competition in the future",
          "The founders gain resources to scale faster but dilute their ownership and face intense pressure to justify their high valuation",
          "The startup's variable costs will immediately become fixed costs",
          "The startup is guaranteed to reach profitability faster"
        ],
        correctAnswer: "The founders gain resources to scale faster but dilute their ownership and face intense pressure to justify their high valuation",
        explanation: "funding acts as an accelerant but introduces equity dilution and pressure to hit aggressive milestones."
      },
      {
        questionText: "Traditional investing focuses on proven revenue and predictable performance. Venture capital focuses on potential and uncertainty. According to this lesson, why does this difference exist?",
        options: [
          "Because traditional investors are legally barred from buying stock",
          "Because by the time a company has proven its business model, much of the high-growth opportunity has already disappeared",
          "Because uncertainty guarantees that a company will never fail",
          "Because venture capital only works in the automotive industry"
        ],
        correctAnswer: "Because by the time a company has proven its business model, much of the high-growth opportunity has already disappeared",
        explanation: "the greatest valuation increases happen during the transition from uncertain startup to proven market leader."
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
