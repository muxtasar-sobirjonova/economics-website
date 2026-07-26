import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 20;
  const tag = "Week 4"; // Or whichever week, we'll leave it as is or default

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Give someone a coffee mug, then ask how much they'd need to be paid to give it up. Now ask someone who was never given the mug how much they'd pay to get one. Study after study finds the same gap: owners demand roughly twice what non-owners are willing to offer, for the exact same mug.</p>

<p>This is the <strong>endowment effect</strong>: the tendency to value something more highly for the sole reason that you already own it. Economists <strong>Richard Thaler</strong>, together with <strong>Daniel Kahneman</strong> and <strong>Jack Knetsch</strong>, demonstrated this formally in a series of experiments where randomly assigned "owners" and "buyers" evaluated identical objects — coffee mugs, pens, event tickets — and consistently disagreed on what the object was worth, purely based on which side of the transaction they'd been placed on.</p>

<p>Ownership isn't supposed to change an object's value in standard economic theory. A mug is worth what a mug is worth, whether you hold it or someone else does. But loss aversion complicates this: giving up something you own feels like a loss, while acquiring something you don't yet own feels like a gain, and losses are felt more intensely than gains of the same size.</p>

<p>That single asymmetry, playing out one used phone or one pair of sneakers at a time, is exactly what makes online resale marketplaces such reliable arenas for buyer-seller disagreement.</p>`;

  const conceptSummary = `The endowment effect is the tendency to value something more highly simply because you own it. Experiments by Thaler, Kahneman, and Knetsch found that randomly assigned "owners" demanded roughly twice what "buyers" were willing to pay for the identical object. This happens because giving up an owned item feels like a loss, while acquiring a new item feels like a gain — and losses are felt more intensely, even when the object itself hasn't changed.`;

  const conceptTakeaways = [
    "The endowment effect is the tendency to value an object more highly for the sole reason of owning it.",
    "Thaler, Kahneman, and Knetsch's mug experiments found owners demanded roughly twice what buyers were willing to pay for an identical object.",
    "Standard economic theory predicts ownership shouldn't affect an object's value — the endowment effect shows it does.",
    "The effect stems from loss aversion: giving up an owned item feels like a loss, which is felt more intensely than the equivalent gain of acquiring it.",
    "The endowment effect creates a predictable, persistent gap between what sellers ask and what buyers offer for the same object."
  ];

  const articleTitle = "Why People Overprice Used Products They Own on Resale Platforms (Turkey)";
  
  const articleText = `<p>On Sahibinden.com, Turkey's largest resale marketplace, sellers routinely list used phones and cars well above what buyers are willing to pay. <strong>So why don't sellers just check the market and price accordingly?</strong><br>
Because checking the market tells a seller what a stranger's identical phone is worth. It doesn't touch what their own phone feels worth to them, and that gap between a stranger's price and an owner's price is exactly what the endowment effect predicts.</p>

<p><strong>What exactly is Sahibinden.com, and how central is it to how Turks buy and sell used goods?</strong><br>
Sahibinden.com launched in the early 2000s and grew into Turkey's dominant classifieds platform, used for everything from used cars and phones to real estate and furniture, with millions of active listings at any given time. For many Turkish sellers, listing a used item on the platform is close to the default first step of selling almost anything of value.</p>

<p><strong>Why does a seller's own phone feel worth more to them than an identical phone would if they were shopping for one?</strong><br>
Because parting with a phone they already own registers, psychologically, as a loss — and loss aversion means that loss is felt more intensely than the equivalent gain a buyer would feel by acquiring the same phone. The seller isn't pricing the phone's objective market value. They're pricing their own reluctance to give it up.</p>

<p><strong>Why do buyers on these platforms consistently value the same listed item lower than the seller does?</strong><br>
Because the buyer has no ownership history with that specific phone. To them, it's simply one option among many similar listings, evaluated as a potential gain rather than an avoided loss. Two people can look at the identical device and arrive at genuinely different honest valuations, not because either is lying, but because they're standing on opposite sides of the endowment effect.</p>

<p><strong>Does more time spent owning an item make the endowment effect stronger or weaker?</strong><br>
Generally stronger. An item used for years, especially one tied to memories or personal history — a family car, a phone full of years of photos — tends to produce an even larger gap between what an owner will accept and what a buyer will offer, compared to a nearly-new item bought and resold within weeks. The longer an object has been "mine," the more its loss registers as a genuine loss rather than a minor inconvenience.</p>

<p><strong>What pricing strategy could resale platforms use to close the persistent gap between what sellers ask and what buyers offer?</strong><br>
Some platforms now show sellers real comparable sold prices, not just competing asking prices, at the moment they list an item — a small nudge meant to anchor the seller's expectation to actual completed transactions rather than their own attachment to the item. It doesn't eliminate the endowment effect, but showing hard, recent sale data gives sellers a competing reference point that at least partially counteracts the pull of ownership.</p>`;

  const articleSummary = `On Sahibinden.com, Turkey's dominant resale marketplace, sellers routinely price used items above what buyers will pay, reflecting the endowment effect: owning an item makes giving it up feel like a loss, which is felt more intensely than the equivalent gain a buyer feels by acquiring it. The gap tends to grow with how long an item was owned, and platforms have started showing real sold prices to nudge sellers toward more realistic expectations.`;

  const articleTakeaways = [
    "Sahibinden.com is Turkey's dominant resale marketplace, used widely for cars, phones, electronics, and real estate.",
    "Sellers on resale platforms consistently price owned items above what buyers are willing to pay, reflecting the endowment effect.",
    "The gap exists because parting with an owned item feels like a loss, while acquiring the same item feels like a gain — and losses are felt more intensely.",
    "The endowment effect tends to grow stronger the longer an item has been owned, especially for items tied to personal history.",
    "Showing sellers real, recent sold prices (not just competing listings) is one strategy platforms use to counteract inflated seller expectations."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Why We Value Things More After Owning Them",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
      }
    });
    console.log(`Updated lesson content for day \${dayOrder}`);
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
        questionText: "What is the endowment effect?",
        options: [
          "The tendency for owned objects to physically depreciate over time",
          "The tendency to value an object more highly for the sole reason that you own it",
          "A rule requiring resale platforms to set fixed prices",
          "The tendency for buyers to always outbid sellers"
        ],
        correctAnswer: "The tendency to value an object more highly for the sole reason that you own it",
        explanation: "The endowment effect predicts that ownership itself increases the perceived value of an item."
      },
      {
        questionText: "In the classic mug experiments by Thaler, Kahneman, and Knetsch, what was the key finding?",
        options: [
          "Owners and buyers valued identical mugs equally",
          "Randomly assigned owners demanded roughly twice what randomly assigned buyers were willing to pay for the identical mug",
          "Buyers always valued mugs more than owners did",
          "Mug ownership had no measurable effect on valuation"
        ],
        correctAnswer: "Randomly assigned owners demanded roughly twice what randomly assigned buyers were willing to pay for the identical mug",
        explanation: "The experiment showed that just randomly giving someone a mug instantly doubled its perceived value to them."
      },
      {
        questionText: "Why does loss aversion explain the endowment effect?",
        options: [
          "It doesn't — the two concepts are unrelated",
          "Giving up an owned item feels like a loss, and losses are felt more intensely than the equivalent gain of acquiring the same item",
          "Because owned items are always objectively worth more than unowned ones",
          "Because loss aversion only applies to money, not physical objects"
        ],
        correctAnswer: "Giving up an owned item feels like a loss, and losses are felt more intensely than the equivalent gain of acquiring the same item",
        explanation: "Because losing something hurts more than gaining something feels good, the \"loss\" of giving up the item requires a higher price to compensate."
      },
      {
        questionText: "Why might an item owned for many years produce a larger endowment effect gap than an item owned for only a few weeks?",
        options: [
          "Older items are always more valuable in absolute market terms",
          "Longer ownership, especially with personal history attached, tends to intensify how much giving up the item feels like a genuine loss",
          "The endowment effect only applies to items owned for over a year",
          "Newer items are always priced higher by sellers"
        ],
        correctAnswer: "Longer ownership, especially with personal history attached, tends to intensify how much giving up the item feels like a genuine loss",
        explanation: "Emotional attachment and prolonged psychological ownership make giving up the object feel like a larger loss."
      },
      {
        questionText: "You're advising a friend selling a used car who insists on pricing it $2,000 above what comparable listings suggest, based on \"how much it's worth to me.\" What's the most accurate explanation for their pricing, based on this lesson?",
        options: [
          "The friend has accurately identified a pricing error in the rest of the market",
          "The friend is likely experiencing the endowment effect — valuing the car more because they own it, not because of its actual market value",
          "The friend's car must have unique features that justify the higher price",
          "The friend is deliberately trying to scam potential buyers"
        ],
        correctAnswer: "The friend is likely experiencing the endowment effect — valuing the car more because they own it, not because of its actual market value",
        explanation: "Their personal valuation is inflated simply by the fact that it is their car."
      },
      {
        questionText: "You run a resale marketplace and want to reduce the average time it takes for listings to sell, which is being slowed by sellers overpricing based on attachment to their items. Based on the endowment effect, which feature would most directly address the root cause?",
        options: [
          "Charging sellers a listing fee to discourage overpricing",
          "Displaying real recent sold prices for comparable items at the moment of listing, giving sellers a competing, objective reference point",
          "Removing the ability for sellers to set their own prices entirely",
          "Hiding all price information from sellers until after the sale"
        ],
        correctAnswer: "Displaying real recent sold prices for comparable items at the moment of listing, giving sellers a competing, objective reference point",
        explanation: "Objective market data helps counteract the internal feeling that the owned object is \"special\" and must be priced higher."
      },
      {
        questionText: "A person buys a concert ticket for $100, then decides not to attend and tries to resell it. Based on the endowment effect, what is this seller likely to do compared to someone who never owned the ticket and is shopping for one?",
        options: [
          "Price the ticket below $100 to guarantee a quick sale",
          "Ask for a price at or above $100, even if comparable resale tickets are selling for less, because giving up the ticket now feels like a loss relative to their $100 reference point",
          "Give the ticket away for free, since they no longer want it",
          "Value the ticket identically to how a new buyer would value it"
        ],
        correctAnswer: "Ask for a price at or above $100, even if comparable resale tickets are selling for less, because giving up the ticket now feels like a loss relative to their $100 reference point",
        explanation: "Once owned, the ticket takes on extra psychological value, causing the seller to demand a higher price to part with it."
      },
      {
        questionText: "Two identical used laptops are listed for sale: one by someone who has owned it for three years, another by someone who bought it two weeks ago and is reselling it unused. Based on the endowment effect, whose asking price is more likely to be higher relative to the laptop's actual market value?",
        options: [
          "The two-week owner's price, since newer items always command a premium",
          "The three-year owner's price, since longer ownership tends to intensify the perceived loss of giving up the item",
          "Both sellers will price identically regardless of ownership duration",
          "Neither seller's price will be affected by ownership at all"
        ],
        correctAnswer: "The three-year owner's price, since longer ownership tends to intensify the perceived loss of giving up the item",
        explanation: "The psychological bond of ownership deepens over time, increasing the endowment effect."
      },
      {
        questionText: "A company offers customers a \"14-day free trial\" of a physical product, after which they must return it or be charged. Based on the endowment effect, what outcome should the company expect?",
        options: [
          "Customers will be equally likely to return the product regardless of trial length",
          "Many customers will keep the product, since two weeks of ownership is likely to make returning it feel like giving up something they now consider theirs",
          "Customers will always return trial products to avoid any charge",
          "The endowment effect has no relevance to free trial strategies"
        ],
        correctAnswer: "Many customers will keep the product, since two weeks of ownership is likely to make returning it feel like giving up something they now consider theirs",
        explanation: "Trials are effective precisely because they establish an endowment effect: returning the item now feels like a loss."
      },
      {
        questionText: "If a resale marketplace wants to test whether sellers' asking prices reflect genuine market value or the endowment effect, which experiment would most directly isolate the effect?",
        options: [
          "Comparing prices sellers ask for items they own against prices the same people would be willing to pay for an identical item they don't yet own",
          "Comparing prices across different product categories",
          "Comparing prices set by new sellers versus experienced sellers",
          "Comparing prices before and after a national holiday"
        ],
        correctAnswer: "Comparing prices sellers ask for items they own against prices the same people would be willing to pay for an identical item they don't yet own",
        explanation: "This directly measures the gap between willing-to-accept (WTA) and willing-to-pay (WTP) in the same population, which defines the endowment effect."
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
    console.log(`Updated quiz questions for day \${dayOrder}`);
  }
  console.log("Done.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
