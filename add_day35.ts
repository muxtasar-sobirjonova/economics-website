import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 35;
  console.log(`Starting update for Day ${dayOrder} Cumulative Quiz...`);

  // Quizzes
  const quiz = await prisma.quiz.findFirst({ where: { dayOrder } });
  
  if (quiz) {
    // Update quiz title
    await prisma.quiz.update({
      where: { id: quiz.id },
      data: {
        title: "Week 5 Review — Business Models & Financing",
        tag: "Week 5 Review"
      }
    });

    // Delete existing questions
    await prisma.quizQuestion.deleteMany({
      where: { quizId: quiz.id }
    });

    const questions = [
      {
        questionText: "What is the defining characteristic of a platform business model?",
        options: [
          "A company creates value by owning all assets used in the transaction",
          "A company creates value by facilitating exchange between two or more distinct groups",
          "A company only sells products manufactured internally",
          "A company avoids collecting transaction fees from users"
        ],
        correctAnswer: "A company creates value by facilitating exchange between two or more distinct groups",
        explanation: "A platform creates value by connecting different groups, such as Airbnb connecting hosts and travelers. A describes a traditional asset-heavy business model, while C and D contradict the concept."
      },
      {
        questionText: "How does Airbnb generate revenue according to the platform business model?",
        options: [
          "By purchasing hotels and renting rooms directly",
          "By charging a take rate on transactions it facilitates",
          "By manufacturing furniture for rental properties",
          "By collecting government subsidies for tourism development"
        ],
        correctAnswer: "By charging a take rate on transactions it facilitates",
        explanation: "Airbnb earns through fees collected from bookings. It does not own the underlying properties. A, C, and D describe unrelated business activities."
      },
      {
        questionText: "Two companies enter the accommodation market. Company A builds hotels whenever it wants to increase supply. Company B creates a platform where existing homeowners can list available spaces. Which company can likely scale supply faster?",
        options: [
          "Company A because physical ownership always creates faster growth",
          "Company B because it can add existing supply without constructing new assets",
          "Both companies will scale at exactly the same speed",
          "Company A because platforms cannot grow without owning inventory"
        ],
        correctAnswer: "Company B because it can add existing supply without constructing new assets",
        explanation: "Platforms scale faster because they connect existing resources rather than building every unit themselves."
      },
      {
        questionText: "What is the main challenge a platform business must solve?",
        options: [
          "Manufacturing enough physical products",
          "Maintaining balance between different sides of the marketplace",
          "Eliminating all competition permanently",
          "Avoiding all transaction fees"
        ],
        correctAnswer: "Maintaining balance between different sides of the marketplace",
        explanation: "Platforms depend on balancing supply and demand. Too many hosts without guests, or guests without hosts, damages the platform."
      },
      {
        questionText: "You are building a marketplace connecting freelance designers with companies. You have thousands of designers but almost no companies hiring them. What should you focus on?",
        options: [
          "Recruiting even more designers",
          "Increasing demand from companies to balance the marketplace",
          "Closing the platform because imbalance cannot be fixed",
          "Buying every designer's service yourself"
        ],
        correctAnswer: "Increasing demand from companies to balance the marketplace",
        explanation: "A platform's value depends on both sides participating. More supply alone does not solve a demand problem."
      },
      {
        questionText: "What is bootstrapping?",
        options: [
          "Raising billions of dollars from venture capital firms",
          "Growing a company using founder resources and business-generated revenue",
          "Borrowing money from banks only",
          "Selling a company immediately after creation"
        ],
        correctAnswer: "Growing a company using founder resources and business-generated revenue",
        explanation: "Bootstrapping means financing growth internally rather than relying on outside investors."
      },
      {
        questionText: "Why does bootstrapping often create financial discipline?",
        options: [
          "Founders can spend unlimited money without consequences",
          "Every expense must be justified because resources are limited",
          "Investors force founders to reduce spending",
          "Companies cannot hire employees while bootstrapping"
        ],
        correctAnswer: "Every expense must be justified because resources are limited",
        explanation: "Limited resources force entrepreneurs to carefully evaluate costs and prioritize activities that create value."
      },
      {
        questionText: "A startup has two choices:\n\nOption 1: Raise $50 million from investors and give up ownership.\nOption 2: Grow slowly using customer revenue and keep control.\n\nWhat trade-off does this represent?",
        options: [
          "Speed of growth versus ownership and control",
          "Technology versus marketing",
          "Manufacturing versus distribution",
          "Revenue versus customer satisfaction"
        ],
        correctAnswer: "Speed of growth versus ownership and control",
        explanation: "External funding can accelerate growth but reduces founder ownership and control."
      },
      {
        questionText: "What is debt financing?",
        options: [
          "Selling ownership shares in exchange for capital",
          "Borrowing money that must be repaid with interest",
          "Receiving free investment from customers",
          "Giving investors permanent ownership without repayment obligations"
        ],
        correctAnswer: "Borrowing money that must be repaid with interest",
        explanation: "Debt creates a repayment obligation regardless of business performance."
      },
      {
        questionText: "What is equity financing?",
        options: [
          "Borrowing money with mandatory repayment",
          "Selling ownership in a company in exchange for capital",
          "Receiving a government grant",
          "Reducing company expenses"
        ],
        correctAnswer: "Selling ownership in a company in exchange for capital",
        explanation: "Equity financing provides capital by giving investors an ownership claim on future value."
      },
      {
        questionText: "According to the lesson, why might a company choose debt financing?",
        options: [
          "Because debt gives investors permanent ownership of the company",
          "Because debt can be attractive when interest rates are low and cash flow is predictable",
          "Because debt eliminates all financial risk",
          "Because debt allows companies to avoid repayment forever"
        ],
        correctAnswer: "Because debt can be attractive when interest rates are low and cash flow is predictable",
        explanation: "Debt is useful when a company can comfortably handle fixed repayments. A describes equity, while C and D are false."
      },
      {
        questionText: "Why might a company choose equity financing when its stock price is high?",
        options: [
          "Because a higher stock price allows the company to raise more capital while giving up less ownership per dollar raised",
          "Because equity requires mandatory monthly repayments",
          "Because high stock prices remove all investor expectations",
          "Because equity financing does not affect ownership"
        ],
        correctAnswer: "Because a higher stock price allows the company to raise more capital while giving up less ownership per dollar raised",
        explanation: "When the stock price is high, fewer shares must be sold to raise the same amount of money, reducing dilution."
      },
      {
        questionText: "Tesla used different financing methods throughout its history. What does this demonstrate?",
        options: [
          "Companies should always use the same financing method forever",
          "Financing decisions should change depending on the company's current conditions",
          "Debt and equity are identical tools",
          "Successful companies never change their financing strategy"
        ],
        correctAnswer: "Financing decisions should change depending on the company's current conditions",
        explanation: "Tesla's strategy shows that financing is an ongoing decision based on interest rates, stock price, and cash flow."
      },
      {
        questionText: "You are the CFO of a company with predictable revenue and historically low interest rates. Which financing option might be attractive?",
        options: [
          "Debt financing because the company can better handle fixed repayments",
          "Equity financing because debt is always illegal",
          "Avoiding all financing forever",
          "Selling the entire company immediately"
        ],
        correctAnswer: "Debt financing because the company can better handle fixed repayments",
        explanation: "Predictable cash flow makes debt obligations easier to manage."
      },
      {
        questionText: "What makes venture capital different from traditional lending?",
        options: [
          "Venture capital expects every investment to succeed",
          "Venture capital accepts many failures because a few large successes can create huge returns",
          "Venture capital requires companies to repay money with interest",
          "Venture capital only invests in profitable companies"
        ],
        correctAnswer: "Venture capital accepts many failures because a few large successes can create huge returns",
        explanation: "VC follows a portfolio strategy where a few winners compensate for many unsuccessful investments."
      },
      {
        questionText: "Why do venture capital investors accept investing in companies with uncertain futures?",
        options: [
          "Because they believe some companies can create extremely large returns",
          "Because startups cannot fail",
          "Because investors are guaranteed government protection",
          "Because profitability is irrelevant forever"
        ],
        correctAnswer: "Because they believe some companies can create extremely large returns",
        explanation: "VC relies on asymmetric returns: limited losses but potentially enormous upside."
      },
      {
        questionText: "A venture capital firm invests in 20 startups. Fifteen fail, four return small profits, and one becomes a global technology giant worth hundreds of billions. Why can this strategy still work?",
        options: [
          "Because venture capital depends on a few extraordinary winners offsetting many failures",
          "Because failed startups always return money later",
          "Because investors ignore financial performance",
          "Because every startup eventually becomes successful"
        ],
        correctAnswer: "Because venture capital depends on a few extraordinary winners offsetting many failures",
        explanation: "This is the core portfolio logic behind venture capital."
      },
      {
        questionText: "What is the role of an angel investor?",
        options: [
          "A government agency that regulates startups",
          "An individual who invests personal money into early-stage companies",
          "A bank providing traditional business loans",
          "A customer purchasing products from startups"
        ],
        correctAnswer: "An individual who invests personal money into early-stage companies",
        explanation: "Angel investors use their own capital to support young companies, often before larger investors become interested."
      },
      {
        questionText: "Why are angel investors especially important for early-stage startups?",
        options: [
          "Startups often lack the history and predictable cash flow required for traditional financing",
          "Startups always have too much money already",
          "Banks are required to reject every new company",
          "Angel investors eliminate all startup risks"
        ],
        correctAnswer: "Startups often lack the history and predictable cash flow required for traditional financing",
        explanation: "Early startups often cannot access normal financing, so angel investors fill this funding gap."
      },
      {
        questionText: "An angel investor gives a startup money, introduces founders to experienced executives, and helps them find customers. What does this demonstrate?",
        options: [
          "Angel investors often provide expertise and networks in addition to capital",
          "Investors only provide money and never influence companies",
          "Startups do not need guidance after receiving funding",
          "Angel investors replace company founders"
        ],
        correctAnswer: "Angel investors often provide expertise and networks in addition to capital",
        explanation: "Many angel investors create value through mentorship, connections, and industry experience."
      },
      {
        questionText: "What did Andy Bechtolsheim's early investment in Google demonstrate about angel investing?",
        options: [
          "Angel investors only invest after companies become profitable",
          "Angel investors can provide critical early capital before a company has proven success",
          "Angel investors guarantee that startups will succeed",
          "Angel investors replace the need for founders"
        ],
        correctAnswer: "Angel investors can provide critical early capital before a company has proven success",
        explanation: "Google's early investment shows that angel investors often support companies at the highest-risk stage, before traditional investors are willing to participate."
      },
      {
        questionText: "You are an entrepreneur with a promising technology idea but no revenue yet. A bank rejects your loan application because you have no predictable cash flow. An experienced entrepreneur offers personal funding in exchange for equity. According to this lesson, what role is this person playing?",
        options: [
          "Debt lender",
          "Angel investor",
          "Government regulator",
          "Traditional customer"
        ],
        correctAnswer: "Angel investor",
        explanation: "Angel investors often provide early-stage capital when traditional financing is unavailable."
      },
      {
        questionText: "What does a company's valuation represent?",
        options: [
          "Only the amount of money currently stored in its bank account",
          "An estimate of the company's current and future economic value",
          "The total number of employees a company has",
          "The amount of debt a company owes"
        ],
        correctAnswer: "An estimate of the company's current and future economic value",
        explanation: "Valuation reflects investor expectations about future value, growth potential, and business fundamentals."
      },
      {
        questionText: "What is overvaluation?",
        options: [
          "When a company spends too little money on growth",
          "When a company's value becomes higher than what its realistic future performance can justify",
          "When a company has no investors",
          "When a company refuses to accept outside funding"
        ],
        correctAnswer: "When a company's value becomes higher than what its realistic future performance can justify",
        explanation: "Overvaluation occurs when expectations become disconnected from realistic economics."
      },
      {
        questionText: "Investors value a startup at $20 billion because they believe it will dominate a future market. However, the company has weak profitability and cannot support its costs. What does this situation demonstrate?",
        options: [
          "A possible gap between investor expectations and underlying business fundamentals",
          "That profitability never matters for businesses",
          "That all highly valued companies automatically succeed",
          "That valuation is only based on current cash in the bank"
        ],
        correctAnswer: "A possible gap between investor expectations and underlying business fundamentals",
        explanation: "A high valuation can reflect optimism, but sustainable companies still need strong economics."
      },
      {
        questionText: "Why did WeWork's valuation collapse become an important business lesson?",
        options: [
          "Because the company had no customers or business idea",
          "Because strong growth expectations were not supported enough by sustainable economics",
          "Because all platform businesses eventually fail",
          "Because startups should never receive investment"
        ],
        correctAnswer: "Because strong growth expectations were not supported enough by sustainable economics",
        explanation: "WeWork showed that a compelling vision and rapid expansion do not replace a sustainable business model."
      },
      {
        questionText: "You are an investor considering two companies:\n\nCompany A: Small but profitable with steady growth.\nCompany B: Rapidly expanding but losing large amounts of money.\n\nA venture capitalist chooses Company B. Why might this decision make sense under the VC model?",
        options: [
          "VC investors focus on companies with the potential for extraordinary future returns",
          "VC investors only care about companies losing money",
          "Profitable companies cannot receive investment",
          "Growth always guarantees success"
        ],
        correctAnswer: "VC investors focus on companies with the potential for extraordinary future returns",
        explanation: "Venture capital often prioritizes huge potential upside over current profitability."
      },
      {
        questionText: "A founder is deciding whether to accept venture capital funding. The funding would allow international expansion but would reduce the founder's ownership percentage. What trade-off is the founder facing?",
        options: [
          "Faster growth versus ownership and control",
          "Revenue versus customers",
          "Technology versus employees",
          "Production versus quality"
        ],
        correctAnswer: "Faster growth versus ownership and control",
        explanation: "Venture capital provides resources for growth but requires founders to give up equity."
      },
      {
        questionText: "A company uses debt financing when interest rates are low and cash flow is predictable. Later, when its stock price rises significantly, it raises money by selling shares. What principle does this demonstrate?",
        options: [
          "Companies should continuously match financing choices to current conditions",
          "Companies should never change financing methods",
          "Equity is always superior to debt",
          "Debt and equity decisions have no relationship with market conditions"
        ],
        correctAnswer: "Companies should continuously match financing choices to current conditions",
        explanation: "The Tesla example demonstrates that financing strategy should adapt over time."
      },
      {
        questionText: "A startup founder asks:\n\n\"Should I bootstrap, seek angel investment, raise venture capital, or use debt?\"\n\nBased on this chapter, what is the best answer?",
        options: [
          "There is one universally correct financing method for every company",
          "The best choice depends on the company's stage, growth goals, risk level, and current circumstances",
          "Venture capital is always the best option because more money creates success",
          "Bootstrapping is always superior because investors reduce freedom"
        ],
        correctAnswer: "The best choice depends on the company's stage, growth goals, risk level, and current circumstances",
        explanation: "The entire chapter shows that financing decisions depend on context: business model, growth opportunity, uncertainty, ownership goals, and financial conditions."
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
