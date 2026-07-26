import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 29;
  const tag = "Week 5";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Airbnb has never owned a single hotel room. It has never poured a foundation, hung a door, or made a bed. And yet, by some measures, it commands more available lodging inventory worldwide than any hotel chain in history — a chain with, quite literally, zero buildings of its own.</p>

<p>A <strong>platform business model</strong> creates value primarily by facilitating exchange between two or more distinct groups — in this case, people with a spare room and people who need one — rather than by producing or owning the product itself. This is a fundamentally different kind of company than a hotel chain, which must build, buy, staff, and maintain every single room in its inventory before it can ever be sold.</p>

<p>The economics work through a <strong>take rate</strong>: a percentage fee collected on each transaction the platform facilitates, without the platform ever holding the underlying asset. Because the platform isn't building anything physical to add supply, it can scale far faster than a company that has to construct or acquire each new unit — its job is simply to convince existing property owners to list, and existing travelers to book, and to keep both sides showing up in the right proportions.</p>

<p>That last part is the real craft. A platform with plenty of hosts but too few guests leaves listings empty and hosts frustrated; a platform with plenty of guests but too few hosts leaves demand unmet and travelers disappointed. <em>Either imbalance breaks the very thing</em> that makes the platform valuable in the first place. The winning platforms aren't the ones that own the most — they're the ones that stay the <u>most trusted, most liquid meeting point</u> between two sides that would otherwise struggle to find each other at any real scale.</p>`;

  const conceptSummary = `A platform business model creates value by facilitating exchange between two distinct groups, rather than by owning or producing the product itself. It earns through a take rate on each transaction, and can scale supply far faster than a company that must build or buy every unit. The core challenge is balance — too many of one side and too few of the other breaks the value the platform depends on.`;

  const conceptTakeaways = [
    "A platform business model facilitates exchange between two or more groups rather than owning or producing the product itself.",
    "Revenue typically comes from a take rate — a fee on each transaction the platform facilitates.",
    "Platforms can scale supply much faster than companies that must build or acquire every unit directly.",
    "Success depends on balancing both sides of the market — too much of one relative to the other breaks the platform's value.",
    "The winning platform isn't the biggest owner — it's the most trusted, most liquid connector between two sides."
  ];

  const articleTitle = "The Company Bigger Than Every Hotel Chain That Owns Not a Single Room";
  
  const articleText = `<p><strong>How does a company end up controlling more lodging inventory than any hotel chain in history, without owning a single building?</strong></p>

<p>Airbnb, founded in San Francisco, connects people with spare space — a room, an apartment, an entire house — to travelers looking for a place to stay. Every listing on the platform belongs to someone else. Airbnb never buys the property, never renovates it, and never carries it on a balance sheet as an owned asset. Its entire "inventory" is simply access to millions of individually owned spaces that already existed before the platform ever touched them.</p>

<p><strong>What is Airbnb actually getting paid for, if it never owns the property or bears the cost of maintaining it?</strong></p>

<p>A take rate: a percentage fee charged on each booking, collected from hosts, guests, or both, depending on the market. The company is paid for making the match and processing the transaction — for building enough trust and infrastructure that a stranger will hand over money to stay in another stranger's home, and enough logistics that both sides can find each other in the first place.</p>

<p><strong>Why can a platform business scale its available supply so much faster than a company that has to build or buy every unit itself?</strong></p>

<p>Adding a new listing costs Airbnb almost nothing — no construction, no purchase, no renovation. It only has to convince an existing property owner to list a space that already exists. A hotel chain adding a thousand new rooms has to physically build or acquire a thousand new rooms first. A platform adding a thousand new listings just <em>needs a thousand more people willing to click \"list your space.\"</em></p>

<p><strong>What happens to a platform if one side of the market — hosts or guests — doesn't show up in the right numbers?</strong></p>

<p>The entire value proposition breaks down. Too many listings with too few travelers means empty rooms and frustrated hosts who eventually stop bothering to list. Too many travelers with too few listings means unmet demand and a bad experience that sends guests elsewhere. Airbnb's actual operating challenge, day to day, isn't building anything physical — it's <u>constantly managing the balance</u> between how much space is on offer and how many people want to book it.</p>

<p><strong>If you ran a hotel chain watching Airbnb's available inventory surpass yours despite owning zero of it, would you try to compete by building rooms faster — or by becoming a platform yourself?</strong></p>

<p>Building faster means competing on the exact dimension a platform has structurally escaped — physical construction and ownership costs a platform never has to carry. Becoming a platform yourself means abandoning the asset-heavy model that built your existing brand and trying to win at a game whose rules favor whoever built the trust and liquidity layer first, which by this point is no longer an open contest.</p>

<p><strong>So is Airbnb really in the hospitality business — or the business of connecting two sides of a market that couldn't easily find each other alone?</strong></p>

<p>It looks like hospitality from the guest's side of the transaction. What it actually built is the connective tissue — trust, discovery, and payment — between millions of individual property owners and millions of individual travelers, a layer that didn't meaningfully exist at this scale before the platform did.</p>`;

  const articleSummary = `Airbnb owns no lodging inventory itself, yet connects millions of individually owned spaces to travelers worldwide, earning a take rate on each booking rather than revenue from owned assets. Because it doesn't have to build or buy any physical inventory, it can scale supply far faster than a traditional hotel chain. Its core operating challenge is balance — keeping enough hosts and enough guests showing up in the right proportion to each other.`;

  const articleTakeaways = [
    "Airbnb owns no lodging inventory — every listing belongs to an individual host.",
    "It earns revenue through a take rate charged on each booking, not from owning physical assets.",
    "Adding new supply costs Airbnb far less than a hotel chain building or acquiring new rooms.",
    "The company's core operating challenge is balancing host supply against guest demand.",
    "Its real product is the trust and matching layer between hosts and guests, not the physical space itself."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Platform Business Models",
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
        questionText: "What is a \"platform business model,\" as defined in this lesson?",
        options: [
          "A business that creates value primarily by facilitating exchange between two or more distinct groups, rather than by owning or producing the product itself",
          "A business that only sells products it manufactures directly",
          "A government-regulated marketplace structure",
          "A pricing strategy used exclusively by hotel chains"
        ],
        correctAnswer: "A business that creates value primarily by facilitating exchange between two or more distinct groups, rather than by owning or producing the product itself",
        explanation: "this is the exact definition given. B describes a traditional, non-platform business model. C and D are fabricated, unrelated claims."
      },
      {
        questionText: "What is a \"take rate,\" per this lesson?",
        options: [
          "The total cost of building a physical asset",
          "A percentage fee collected on each transaction a platform facilitates, without the platform owning the underlying asset",
          "A government tax applied to online marketplaces",
          "The interest rate charged on a company's business loan"
        ],
        correctAnswer: "A percentage fee collected on each transaction a platform facilitates, without the platform owning the underlying asset",
        explanation: "this is the exact definition given. A, C, and D are fabricated or unrelated claims."
      },
      {
        questionText: "Why can a platform business scale its available supply faster than a company that must build or acquire every unit itself, according to this lesson?",
        options: [
          "Because platforms are legally exempt from construction regulations",
          "Customer experience is always identical across both models",
          "Because adding a new listing costs the platform very little — it only needs to convince an existing owner to list an asset that already exists",
          "Because supply and scaling speed are unrelated to a business's underlying model"
        ],
        correctAnswer: "Because adding a new listing costs the platform very little — it only needs to convince an existing owner to list an asset that already exists",
        explanation: "this is the lesson's direct explanation. A, B, and D are fabricated or unsupported claims."
      },
      {
        questionText: "According to this lesson, what is the core operating challenge for a platform business?",
        options: [
          "Manufacturing enough physical inventory to meet demand",
          "Balancing both sides of the market — too much of one side relative to the other breaks the platform's value",
          "Setting government-mandated prices for every transaction",
          "Avoiding all forms of competition permanently"
        ],
        correctAnswer: "Balancing both sides of the market — too much of one side relative to the other breaks the platform's value",
        explanation: "this is the lesson's central point. A misapplies a traditional-business challenge to a platform. C and D are fabricated claims."
      },
      {
        questionText: "You run a traditional hotel chain and notice a platform business has surpassed your available room inventory despite owning none of it. Based on this lesson, what is the central trade-off in deciding whether to compete by building faster or by becoming a platform yourself?",
        options: [
          "There is no trade-off — building physical rooms always wins regardless of platform dynamics",
          "Building faster means competing on the exact cost structure a platform has escaped, while becoming a platform means trying to win a trust-and-liquidity race that may already be decided",
          "Both options are legally identical and produce the same outcome",
          "Platforms are always required to eventually purchase physical assets anyway"
        ],
        correctAnswer: "Building faster means competing on the exact cost structure a platform has escaped, while becoming a platform means trying to win a trust-and-liquidity race that may already be decided",
        explanation: "this reflects the lesson's actual framing of this strategic dilemma. A, C, and D are fabricated or unsupported claims."
      },
      {
        questionText: "You're building a new platform connecting service providers with customers, and you currently have far more providers signed up than customers booking services. Based on this lesson, what should you prioritize first?",
        options: [
          "Signing up even more service providers, regardless of the current demand imbalance",
          "Addressing the demand side of the market, since an imbalance in either direction breaks the platform's core value proposition",
          "Shutting down the platform entirely, since imbalance can never be corrected",
          "Ignoring the imbalance, since it has no effect on platform value"
        ],
        correctAnswer: "Addressing the demand side of the market, since an imbalance in either direction breaks the platform's core value proposition",
        explanation: "this is a direct application of the lesson's core point about balancing both sides. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A ride-hailing platform has a large number of registered drivers but very few riders requesting trips in a specific city. Based on this lesson, what is the most likely consequence?",
        options: [
          "Drivers will remain highly satisfied regardless of low rider demand",
          "Idle drivers may become frustrated and leave the platform, weakening the very supply that makes the platform valuable to future riders",
          "This imbalance has no effect on the platform's long-term viability",
          "The platform should immediately purchase its own vehicle fleet to solve the imbalance"
        ],
        correctAnswer: "Idle drivers may become frustrated and leave the platform, weakening the very supply that makes the platform valuable to future riders",
        explanation: "this is a direct application of the lesson's core balance principle. A, C, and D contradict or misapply this reasoning."
      },
      {
        questionText: "A company deciding between opening physical retail stores or building an online marketplace connecting independent sellers to customers is weighing scaling speed. Based on this lesson, which approach is likely to scale supply faster, and why?",
        options: [
          "Physical retail stores, since owning inventory always scales faster",
          "The online marketplace, since adding new sellers costs far less than building or acquiring physical retail locations",
          "Neither approach has any meaningful difference in scaling speed",
          "Physical retail stores, because government regulations favor owned inventory"
        ],
        correctAnswer: "The online marketplace, since adding new sellers costs far less than building or acquiring physical retail locations",
        explanation: "this is a direct application of the lesson's core argument about platforms scaling faster than asset-heavy models. A, C, and D contradict this reasoning."
      },
      {
        questionText: "A platform business earns its revenue entirely through a small percentage fee on each transaction, without ever owning the products being exchanged. Based on this lesson, what economic term describes this revenue mechanism?",
        options: [
          "Cost-plus pricing",
          "A take rate",
          "A fixed cost",
          "A sunk cost"
        ],
        correctAnswer: "A take rate",
        explanation: "this is a direct application of the lesson's definition. A, C, and D are unrelated financial concepts from other lessons."
      },
      {
        questionText: "Two companies enter the same market. Company A builds and owns every unit of its product before selling it. Company B builds a platform connecting independent owners of similar products to customers, without owning any of it. Based on this lesson, which company is likely to scale its available supply more quickly, and why?",
        options: [
          "Company A, since owning assets always allows faster scaling",
          "Company B, since it only needs to convince existing owners to participate rather than building or acquiring new supply itself",
          "Neither company can scale supply under any circumstances",
          "Both companies scale at an identical rate regardless of their business model"
        ],
        correctAnswer: "Company B, since it only needs to convince existing owners to participate rather than building or acquiring new supply itself",
        explanation: "this is a direct application of the lesson's central argument about platform scaling speed. A, C, and D all contradict this reasoning."
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
