import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 30;
  const tag = "Week 5";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Imagine being offered millions of dollars to grow your business faster. Most founders would sign immediately. Some don't.</p>

<p><strong>Bootstrapping</strong> is the practice of building and growing a business primarily with the founder's own savings and the company's own profits, rather than relying on outside investors. Every new employee, marketing campaign, product improvement, or office expansion must be financed by money the business has already earned.</p>

<p>That constraint changes almost every decision a founder makes.</p>

<p>A venture-backed startup can afford to chase growth long before it becomes profitable because investors supply fresh capital. A bootstrapped company doesn't have that luxury. <em>Every dollar spent is a dollar the business already fought to earn</em>. Waste becomes expensive immediately, forcing founders to prioritize profitable customers, efficient operations, and products people are willing to pay for today — not years into the future.</p>

<p>Ironically, having less money often creates better discipline. Founders learn to ask harder questions before every expense:</p>
<ul>
  <li>Will this actually increase revenue?</li>
  <li>Can we delay this purchase?</li>
  <li>Is there a cheaper solution?</li>
  <li><u>Can existing customers fund the next stage of growth?</u></li>
</ul>

<p>Bootstrapping isn't simply "starting without investors." Many companies begin that way. A truly bootstrapped business deliberately continues financing growth internally even after becoming successful enough to attract outside capital.</p>

<p>The trade-off is clear: growth is usually slower because resources are limited. But <u>founders retain ownership, control over decisions, and freedom from investor expectations</u>. Instead of maximizing growth, they're maximizing sustainability.</p>

<p>Sometimes, the fastest-growing company wins. Sometimes, the company that survives the longest does.</p>`;

  const conceptSummary = `Bootstrapping is building and growing a business using the founder's own money and the company's profits instead of outside investment. Limited resources force entrepreneurs to spend carefully, prioritize profitability, and make disciplined decisions. Although growth is often slower, founders retain ownership and control while creating a business funded by customers rather than investors.`;

  const conceptTakeaways = [
    "Bootstrapping means financing growth with personal funds and business profits.",
    "Every expense must be justified because capital is limited.",
    "Bootstrapped companies usually prioritize profitability earlier.",
    "Founders keep more ownership and decision-making power.",
    "The main trade-off is slower growth in exchange for greater independence."
  ];

  const articleTitle = "The Billion-Dollar Company That Never Took Venture Capital";
  
  const articleText = `<p><strong>If nearly every successful startup raises millions from investors, why would one company deliberately refuse the money?</strong></p>

<p>When Mailchimp launched in 2001, venture capital was already becoming the default path for ambitious technology companies. Founders were expected to raise funding, hire aggressively, grow as quickly as possible, and worry about profits later. Mailchimp chose the opposite strategy.</p>

<p>The company funded itself through revenue from paying customers. Every feature it built, every employee it hired, and every expansion it made came from money the business had already earned — not from investors writing larger checks.</p>

<p><strong>Wouldn't outside investment have helped Mailchimp grow much faster?</strong></p>

<p>Probably. But faster growth wasn't the founders' only objective. Accepting investment would also have meant giving up ownership, sharing control, and answering to investors whose priorities might differ from their own. <em>Remaining bootstrapped allowed the founders to decide exactly how quickly to grow</em>, which customers to serve, and where to spend every dollar.</p>

<p><strong>How does limited funding actually change the way a company behaves?</strong></p>

<p>It forces discipline. Instead of asking, "What can we build with another $50 million?" Bootstrapped founders ask: <u>"What can we build with the money we've already earned?"</u> That difference changes hiring decisions, marketing budgets, product development, and expansion plans. Growth becomes a result of customer demand rather than investor funding.</p>

<p><strong>Does bootstrapping mean avoiding risk entirely?</strong></p>

<p>Not at all. Mailchimp still invested in new products, hired employees, and expanded internationally. The difference was that each decision had to be supported by a business already generating real cash rather than by future promises.</p>

<p><strong>Then why do so many startups still choose venture capital instead?</strong></p>

<p>Because the right financing depends on the business. Some markets reward speed so heavily that growing slowly means losing entirely. Others allow companies to grow steadily while remaining profitable. Bootstrapping isn't better than venture capital. It's a different answer to the same question: <em>"Who should pay for your company's growth — investors or customers?"</em></p>`;

  const articleSummary = `Mailchimp became one of the world's most successful email marketing companies without raising venture capital. Instead, it financed growth using revenue from paying customers, allowing the founders to retain ownership and control. Bootstrapping required disciplined spending and slower expansion but created a profitable, independent business built on customer demand rather than investor funding.`;

  const articleTakeaways = [
    "Mailchimp grew primarily through customer revenue rather than outside investment.",
    "Bootstrapping allowed the founders to retain ownership and strategic control.",
    "Limited capital encouraged careful spending and operational discipline.",
    "Growth was driven by profitability instead of continual fundraising.",
    "Bootstrapping demonstrates that successful companies can scale without venture capital."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Bootstrapping",
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
        questionText: "What is \"bootstrapping,\" as defined in this lesson?",
        options: [
          "Building a business by raising maximum venture capital first",
          "Building and growing a business primarily with the founder's own savings and the company's own profits, rather than relying on outside investors",
          "A government program that provides grants to tech startups",
          "A legal process for filing corporate tax returns"
        ],
        correctAnswer: "Building and growing a business primarily with the founder's own savings and the company's own profits, rather than relying on outside investors",
        explanation: "this is the exact definition given in the concept section."
      },
      {
        questionText: "Why does this lesson state that having less money often creates better discipline?",
        options: [
          "Because it forces founders to prioritize profitable customers, efficient operations, and justify every expense",
          "Because outside capital is illegal for early-stage companies",
          "Because bootstrapped founders are not allowed to hire employees",
          "Because customers prefer businesses with less capital"
        ],
        correctAnswer: "Because it forces founders to prioritize profitable customers, efficient operations, and justify every expense",
        explanation: "having less money forces harder questions before spending and eliminates waste immediately."
      },
      {
        questionText: "According to this lesson, what is the main trade-off of a bootstrapped business model?",
        options: [
          "Giving up strategic control in exchange for fast growth",
          "Slower growth due to limited resources, in exchange for retaining ownership and strategic independence",
          "Being legally barred from ever taking outside investment in the future",
          "Higher employee turnover rates"
        ],
        correctAnswer: "Slower growth due to limited resources, in exchange for retaining ownership and strategic independence",
        explanation: "this is the exact trade-off: slower growth but complete ownership, control, and focus on sustainability."
      },
      {
        questionText: "How did Mailchimp finance its early features and hiring, according to the article?",
        options: [
          "Through a series of large venture capital rounds",
          "By using revenue generated from paying customers",
          "Through a government-backed small business loan",
          "By relying entirely on credit card debt"
        ],
        correctAnswer: "By using revenue generated from paying customers",
        explanation: "Mailchimp chose to fund every feature and hire directly from the revenue generated by paying customers."
      },
      {
        questionText: "You're a bootstrapped founder who has just reached profitability. A venture capital firm offers you $10 million to accelerate growth. Based on this lesson, what is the most important trade-off to consider?",
        options: [
          "There is no trade-off; taking outside money has zero strategic cost",
          "The acceleration of growth versus the loss of absolute ownership, strategic control, and customer-first independence",
          "Whether the investment will legally force you to change your company's name",
          "That venture capital is always the only way to build a sustainable business"
        ],
        correctAnswer: "The acceleration of growth versus the loss of absolute ownership, strategic control, and customer-first independence",
        explanation: "accepting capital introduces strategic control tradeoffs, investor expectations, and targets that differ from a bootstrapped path."
      },
      {
        questionText: "You're a founder in a highly competitive market where speed to market is the primary driver of survival. Based on the lesson, what financing path should you weigh most carefully?",
        options: [
          "Bootstrapping, because it is always superior to venture capital in every market",
          "Venture capital, since the market rewards speed so heavily that growing slowly through bootstrapping could mean losing entirely",
          "Crowdfunding, since it has no relationship to speed or control",
          "Debt financing, because it is legally required for fast-growing companies"
        ],
        correctAnswer: "Venture capital, since the market rewards speed so heavily that growing slowly through bootstrapping could mean losing entirely",
        explanation: "as the article notes, some markets reward speed so heavily that growing slowly means losing entirely, making venture capital a better fit."
      },
      {
        questionText: "A founder starts a tech company and uses their own savings to build the first product. Once they get paying customers, they use those profits to hire their first developer. What financing strategy does this illustrate?",
        options: [
          "Venture capital financing",
          "Bootstrapping",
          "Debt financing",
          "Public listing (IPO)"
        ],
        correctAnswer: "Bootstrapping",
        explanation: "this is the classic pattern of bootstrapping: using personal savings and customer revenues to fund the next stage of growth."
      },
      {
        questionText: "A company decides to continue financing its growth internally even after it has become highly successful and has received multiple investment offers. Based on this lesson, what is this company primarily trying to preserve?",
        options: [
          "High levels of waste in its operations",
          "Its independence, ownership, and control over strategic decisions",
          "A rapid path to public listing (IPO)",
          "A guarantee of permanent profitability"
        ],
        correctAnswer: "Its independence, ownership, and control over strategic decisions",
        explanation: "remaining bootstrapped despite attractive offers allows the founders to preserve absolute ownership and decision-making power."
      },
      {
        questionText: "Startup X raises $20 million from venture capital before generating any revenue. Startup Y relies entirely on paying customer revenue from day one. Based on this lesson, how will their spending decisions likely differ?",
        options: [
          "Startup X will be more disciplined because investors watch every dollar",
          "Startup Y will likely be more disciplined and cost-conscious because every dollar spent is a dollar the business already had to earn",
          "Both startups will make identical spending decisions",
          "Startup X is legally required to spend money slower than Startup Y"
        ],
        correctAnswer: "Startup Y will likely be more disciplined and cost-conscious because every dollar spent is a dollar the business already had to earn",
        explanation: "when capital is internally generated from paying customers, there is a natural pressure to prioritize cost-efficiency and eliminate waste immediately."
      },
      {
        questionText: "An email marketing company chooses to grow at a steady, profitable pace funded by customers rather than chase rapid, investor-backed scale. Based on the article about Mailchimp, what does this strategy demonstrate?",
        options: [
          "That technology companies cannot survive without venture capital",
          "That successful, large-scale companies can be built and sustained through bootstrapping",
          "That customer demand has no relationship to company growth",
          "That bootstrapped companies are legally barred from expanding internationally"
        ],
        correctAnswer: "That successful, large-scale companies can be built and sustained through bootstrapping",
        explanation: "Mailchimp's success proves that it is entirely possible to scale a billion-dollar tech company without ever taking venture capital."
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
