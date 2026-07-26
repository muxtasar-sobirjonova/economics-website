import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 33;
  const tag = "Week 5";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Before a startup has customers, revenue, or a proven business model, it often faces its hardest challenge: convincing someone that the idea is worth believing in.</p>

<p>An <strong>angel investor</strong> is an individual who provides early-stage capital to startups in exchange for ownership equity. Unlike venture capital firms, which usually invest through professionally managed funds, angel investors typically invest their own personal money and often <em>support companies at the earliest stages when the risk is highest</em>.</p>

<p>Angel investing exists because many promising companies are too young to receive traditional financing. Banks usually avoid startups because they lack predictable cash flows and collateral. Venture capital firms often wait until companies show stronger evidence of growth. Angel investors fill this gap by providing the <u>first external capital that helps founders</u> turn an idea into a functioning business.</p>

<p>The economics of angel investing are built around uncertainty and asymmetric returns. An angel investor may invest in dozens of early-stage companies knowing that many will fail. However, <u>one successful investment can produce returns large enough</u> to compensate for many losses. Early investments in companies like Google, Amazon, and Uber created enormous value because investors entered before the companies became global giants.</p>

<p>However, angel investing is not only about money.</p>

<p>Many angel investors contribute experience, industry knowledge, connections, and mentorship. At the earliest stage of a company, founders often need guidance as much as they need capital. An experienced investor can help introduce customers, recruit employees, avoid mistakes, and prepare the company for future growth.</p>

<p>The trade-off is ownership. When founders accept angel investment, they exchange a portion of their company for resources that can increase the chance of success. The decision is not simply about receiving money — it is about deciding whether the value created by the investor's support is <em>worth giving up part of the company</em>.</p>

<p>Angel investing represents one of the earliest moments where an outside person decides: <strong>"I believe this idea can become something much bigger."</strong></p>`;

  const conceptSummary = `Angel investing provides early-stage startups with capital from individual investors in exchange for equity ownership. Angel investors often support companies before they are attractive to banks or venture capital firms. Beyond money, they provide expertise, networks, and mentorship. Founders gain resources to grow but give up a portion of ownership in exchange for support during the most uncertain stage of building a company.`;

  const conceptTakeaways = [
    "Angel investors provide early-stage funding using their own personal capital.",
    "They often invest before startups have proven business models.",
    "Angel investing involves high risk but potentially enormous returns.",
    "Many angels contribute mentorship and connections alongside money.",
    "Founders trade ownership for resources that can increase their chances of success."
  ];

  const articleTitle = "The $100,000 Check That Helped Create a Global Technology Giant";
  
  const articleText = `<p><strong>What if you could invest $100,000 in a company before most people had ever heard its name?</strong></p>

<p>In 1998, Google was not the global technology company it is today. It was a research project created by two Stanford students who believed they had developed a better way to organize information on the internet. The company had an interesting idea, but it needed resources to grow beyond a university project. That is where angel investing entered the story.</p>

<p>Andy Bechtolsheim, a co-founder of Sun Microsystems, saw potential in the young company and wrote Google a $100,000 check before the company had fully incorporated. This early investment gave the founders the confidence and resources to continue developing their search technology.</p>

<p><strong>Why would someone invest in a company that had not yet proven it could become successful?</strong></p>

<p>Because angel investors are not investing only in current performance. <em>They are investing in potential</em>. At the earliest stages, there may be little financial data to analyze. Instead, investors evaluate the founders, the market opportunity, the technology, and whether the idea could eventually solve a large problem.</p>

<p><strong>Why don't startups simply use bank loans instead of selling ownership?</strong></p>

<p>Because early startups usually cannot meet traditional lending requirements. <u>A bank expects repayment regardless</u> of whether the company succeeds. A startup, however, may spend years developing before generating significant revenue. Angel investors accept this uncertainty because they receive ownership and participate in the potential upside.</p>

<p><strong>What makes angel investing different from simply giving money to a startup?</strong></p>

<p>The best angel investors provide more than capital. They often introduce founders to potential employees, customers, partners, and future investors. Their experience can help a young company <u>avoid mistakes that could slow growth or cause failure</u>.</p>

<p><strong>Did Google's angel investment guarantee its success?</strong></p>

<p>No. The investment provided opportunity, not certainty. Google still had to build superior technology, attract users, compete against existing search engines, and create a sustainable business model through advertising.</p>

<p><strong>Why are angel investors willing to accept the possibility of losing their money?</strong></p>

<p>Because early investments have a unique risk-return profile. An angel investor might lose money on many startups, but a company that becomes a global leader can generate <em>returns thousands of times larger than the original investment</em>.</p>

<p>The first check is rarely the biggest. But sometimes it is the check that allows everything else to happen.</p>`;

  const articleSummary = `Andy Bechtolsheim's early investment in Google demonstrates the role of angel investors in helping young companies move from ideas to real businesses. Angel investors provide capital, expertise, and networks when traditional financing is unavailable. Although many early-stage investments fail, successful companies can generate extraordinary returns, making angel investing a key part of the entrepreneurial finance ecosystem.`;

  const articleTakeaways = [
    "Google received one of its earliest investments from angel investor Andy Bechtolsheim.",
    "Angel investors often support startups before traditional investors will.",
    "Early-stage investing depends heavily on evaluating potential, not current success.",
    "Angel investors provide expertise and networks alongside capital.",
    "A few successful investments can create returns that outweigh many failures."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Angel Investing",
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
        questionText: "What is an \"angel investor,\" as defined in this lesson?",
        options: [
          "A government official who allocates startup grants",
          "An individual who provides early-stage capital to startups in exchange for ownership equity, usually using their own personal money",
          "A professional fund manager who only invests in publicly traded stocks",
          "A bank officer who reviews commercial loan applications"
        ],
        correctAnswer: "An individual who provides early-stage capital to startups in exchange for ownership equity, usually using their own personal money",
        explanation: "this is the exact definition given. Angels invest their own money, unlike VCs who manage funds from limited partners."
      },
      {
        questionText: "Why do angel investors fill a critical gap in the entrepreneurial finance ecosystem?",
        options: [
          "Because startups are legally barred from receiving bank loans or venture capital",
          "Because banks usually avoid early startups due to a lack of predictable cash flow/collateral, and VC firms often wait for stronger growth evidence",
          "Because angel investors charge lower tax rates than other funding sources",
          "Because banks are not allowed to lend money to tech companies"
        ],
        correctAnswer: "Because banks usually avoid early startups due to a lack of predictable cash flow/collateral, and VC firms often wait for stronger growth evidence",
        explanation: "banks and VCs have criteria that early-stage (pre-revenue) startups cannot meet, which is why angel capital is essential."
      },
      {
        questionText: "What does the lesson suggest is a key non-financial benefit of angel investing for founders?",
        options: [
          "Guaranteed protection from all forms of market competition",
          "Personal, interest-free credit cards",
          "Experience, industry knowledge, connections, and mentorship",
          "Immunity from corporate tax audits"
        ],
        correctAnswer: "Experience, industry knowledge, connections, and mentorship",
        explanation: "good angel investors bring strategic value: introductions, advice, and guidance based on their own careers."
      },
      {
        questionText: "What is the primary trade-off founders face when accepting angel investment?",
        options: [
          "They must immediately hire the investor as CEO",
          "They give up a portion of their company's ownership in exchange for capital and support",
          "They are legally prohibited from ever selling the company",
          "They must pay back the money with double interest within one year"
        ],
        correctAnswer: "They give up a portion of their company's ownership in exchange for capital and support",
        explanation: "raising angel capital means selling equity, which dilutes the founders' ownership of the company."
      },
      {
        questionText: "You're a founder with a revolutionary tech idea but no revenue, no customers, and no assets to offer as collateral. Based on this lesson, which financing source is most appropriate to target first?",
        options: [
          "A commercial bank, because bank loans are easy to get for unproven ideas",
          "An angel investor, because they typically support companies at the earliest stages when risk is highest and traditional financing is unavailable",
          "A public stock offering (IPO), since public markets require no proof of concept",
          "Venture capital firms specializing in late-stage buyouts"
        ],
        correctAnswer: "An angel investor, because they typically support companies at the earliest stages when risk is highest and traditional financing is unavailable",
        explanation: "angel investors are specifically positioned to evaluate and fund high-risk, early-stage ideas before product-market fit."
      },
      {
        questionText: "You're an experienced executive who has retired from the tech industry and wants to invest your own savings into promising early-stage startups while offering your advice and industry connections. What role describes you?",
        options: [
          "Venture capital general partner",
          "Angel investor",
          "Commercial bank loan officer",
          "Institutional pension fund manager"
        ],
        correctAnswer: "Angel investor",
        explanation: "this is the definition of an angel: investing personal capital and offering strategic, hands-on value to early founders."
      },
      {
        questionText: "In 1998, Andy Bechtolsheim wrote a $100,000 check to Google's founders before the company was even fully incorporated. Based on the article, what does this illustrate?",
        options: [
          "A typical venture capital Series A round",
          "A classic angel investment based on potential, market opportunity, and founder capability rather than extensive financial history",
          "A low-risk government subsidy",
          "A standard commercial bank bridge loan"
        ],
        correctAnswer: "A classic angel investment based on potential, market opportunity, and founder capability rather than extensive financial history",
        explanation: "this represents the high-conviction, early-stage nature of angel capital before standard financial metrics exist."
      },
      {
        questionText: "An angel investor spreads their personal capital across 20 early-stage startups. Fifteen of the companies shut down, four break even, and one goes on to become a multi-billion-dollar enterprise. Based on this lesson, how does the investor view this portfolio outcome?",
        options: [
          "As a massive failure, since 75% of the investments lost money",
          "As a highly successful outcome, since a single breakout success can generate returns that far outweigh all other losses combined",
          "As a typical bank lending profile",
          "As a violation of financial regulations"
        ],
        correctAnswer: "As a highly successful outcome, since a single breakout success can generate returns that far outweigh all other losses combined",
        explanation: "this power-law distribution is the core economic engine of early-stage startup investing."
      },
      {
        questionText: "A startup chooses to raise capital from an experienced angel investor rather than a passive individual who only writes checks and offers no advice. Based on the lesson, what is the value of this decision?",
        options: [
          "The active investor will guarantee the startup makes a profit from day one",
          "The founder gains mentorship, industry connections, and customer introductions in addition to the cash, which helps navigate the highly uncertain early stage",
          "The passive investor is legally required to charge higher interest rates",
          "There is no difference; money is the only factor in early-stage success"
        ],
        correctAnswer: "The founder gains mentorship, industry connections, and customer introductions in addition to the cash, which helps navigate the highly uncertain early stage",
        explanation: "active angel investors offer valuable 'smart money'—advice, recruiting help, and client intros that increase execution speed."
      },
      {
        questionText: "A bank expects repayment regardless of how a company performs, while an angel investor accepts the possibility of losing their capital in exchange for ownership. According to the article, why are startups built this way?",
        options: [
          "Because startups are legally barred from paying back debt",
          "Because early-stage startups usually spend years developing before generating stable cash flow, making fixed debt service mathematically unfeasible",
          "Because angel investors are charity organizations",
          "Because banks are legally required to own equity in startups"
        ],
        correctAnswer: "Because early-stage startups usually spend years developing before generating stable cash flow, making fixed debt service mathematically unfeasible",
        explanation: "debt requires regular principal/interest payments, which pre-revenue startups cannot support without running out of cash immediately."
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
