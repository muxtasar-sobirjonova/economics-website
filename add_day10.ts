import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 10;
  const tag = "Week 2";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Walk into an Apple keynote and the first number you hear is always the biggest one. $1,199 for the iPhone Pro Max. Only after that price lands does Apple mention the $899 model — and suddenly it sounds almost reasonable.</p>

<p>This is anchoring: the first number you encounter becomes the reference point against which every later number gets judged. Psychologist Daniel Kahneman demonstrated this with a simple experiment — people who saw a high random number before estimating a quantity guessed higher than people who saw a low one, even though the number had nothing to do with the question. Price tags work the same way. Once $1,199 sits in your head, $899 doesn't feel like a lot of money. It feels like a discount, even though nobody discounted anything.</p>

<p>Imagine you walk into a car dealership and the salesperson shows you a $75,000 model first. By the time you reach the $45,000 trim, your brain has already recalibrated what "expensive" means. You're not evaluating the car anymore — you're evaluating the gap between two numbers a salesperson chose to show you in a specific order.</p>

<p>Companies exploit this by controlling the sequence in which you see prices, not just the prices themselves. The first number sets a mental ceiling, and every choice after it gets measured against that ceiling instead of its own actual value.</p>

<p>So why does Apple sequence its lineup this exact way every year, and does the strategy actually change how much people spend — or just how they feel about spending it?</p>`;

  const conceptSummary = `Anchoring means the first price or number you see becomes the mental reference point for everything that follows. Apple leads with its most expensive iPhone so the base model feels like a bargain by comparison. The anchor doesn't change the object's actual value — it changes how the brain judges that value against an artificial starting point.`;

  const conceptTakeaways = [
    "Anchoring is when an initial number shapes how people judge every number that follows, even if the first number is irrelevant to the decision.",
    "Apple deliberately reveals its highest-priced model first so lower-priced options feel more affordable by comparison.",
    "The anchor changes perception of value, not the actual value of the product itself.",
    "Anchoring works even when people know the number is arbitrary — Kahneman's experiments showed random numbers still shifted people's estimates.",
    "Businesses can control anchors by managing the order in which prices or options are presented, not just the prices themselves."
  ];

  const articleTitle = "Apple's iPhone Pricing Strategy";
  
  const articleText = `<p><strong>"Why does a $1,199 phone make an $899 phone feel cheap?"</strong></p>

<p>September 2023, Apple Park. Tim Cook walks through the new iPhone 15 lineup in a fixed order that never changes: Pro Max first, then Pro, then Plus, then the base model. The Pro Max lands at $1,199. By the time Cook reaches the $899 iPhone 15 Plus, something has already shifted in the room.</p>

<p>Why does Apple always reveal the most expensive iPhone first? Because the first price sets the frame for every price that follows it. If Apple opened with the $799 base model, that number would become the anchor, and $1,199 would look outrageous by comparison. By starting at the top, Apple makes $899 look like a discount before anyone has even compared features.</p>

<p>What happens inside your brain the moment you hear $1,199? Your mind doesn't calculate value from scratch. It measures distance from the last number it saw. This is a brain shortcut that trades accuracy for speed. Once $1,199 registers, $899 gets coded as "$300 less" rather than judged as its own independent price tag with its own merits.</p>

<p>Why does the $899 Plus suddenly feel like the smart choice? Because it now sits in the middle of a range Apple built on purpose. The Pro Max plays the role of the expensive anchor, the base model plays the role of the "cheap" option nobody wants to admit they picked, and the Plus becomes the compromise that feels rational. Behavioral economists call this the decoy effect, and it depends entirely on anchoring to work.</p>

<p>Does anchoring actually change what people buy, or just how they feel about it? Both. Across multiple iPhone generations, Apple's Pro and Pro Max tiers — the higher-anchored models — have captured a growing share of total sales, even as base-model prices stayed roughly flat. The anchor doesn't just change feelings; it pulls purchases upward toward the tier that now feels "reasonable" by comparison to something pricier.</p>

<p>Why doesn't Apple just lower all its prices instead of playing with order? Because lower prices would cost Apple margin on every single unit sold, while reordering the reveal costs nothing and produces almost the same psychological effect. Anchoring is a nearly free lever. Apple doesn't need to discount the Plus — it only needs the Pro Max to exist and to be announced first.</p>

<p>What happens when the anchor disappears — do buyers still overpay? Research replicating Kahneman and Tversky's original anchoring experiments has found the effect fades but doesn't vanish once the anchor is removed from view. A buyer who saw the Pro Max price first will often still rate the Plus as better value days later, even without the $1,199 tag in front of them anymore. The number leaves the room. The impression it created stays behind.</p>

<p>Apple didn't invent anchoring. It just figured out that the order of a keynote could do the work a discount usually does.</p>`;

  const articleSummary = `Apple always announces its most expensive iPhone first, and that opening price becomes the reference point for every model announced afterward. The $1,199 Pro Max makes the $899 Plus look reasonable, even though nothing about the Plus changed. Anchoring shows that the order prices arrive in can shift buying behavior as much as the prices themselves.`;

  const articleTakeaways = [
    "Apple deliberately announces its highest-priced iPhone first, using it as an anchor for every price that follows.",
    "The decoy effect works because a strong anchor makes a middle-tier option look like the rational compromise.",
    "Real sales data shows anchoring can shift actual purchases upward, not just perceptions of value.",
    "Reordering a price reveal costs a company nothing, unlike an actual discount — making anchoring a nearly free pricing tool.",
    "Anchoring effects persist even after the anchor is removed from view, shaping judgments made well after the fact."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Why the First Price Changes What We Pay",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
        tag 
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
        questionText: "What is anchoring?",
        options: [
          "The tendency to judge something by the first number you see",
          "The habit of always choosing the cheapest option",
          "A rule that makes prices go down",
          "A way to calculate exact value"
        ],
        correctAnswer: "The tendency to judge something by the first number you see",
        explanation: "Anchoring is when the first number you encounter becomes the reference point for later judgments."
      },
      {
        questionText: "Why can the first price you see matter so much?",
        options: [
          "Because it becomes a reference point in your mind",
          "Because it is always the correct price",
          "Because later prices disappear",
          "Because people stop thinking after one number"
        ],
        correctAnswer: "Because it becomes a reference point in your mind",
        explanation: "The first price sets a mental reference point that influences how you perceive all subsequent prices."
      },
      {
        questionText: "Which situation best shows anchoring in everyday life?",
        options: [
          "Comparing two brands after reading reviews",
          "Feeling that a second price is “not so bad” after seeing a much higher one first",
          "Buying something only because it is available",
          "Ignoring all price tags completely"
        ],
        correctAnswer: "Feeling that a second price is “not so bad” after seeing a much higher one first",
        explanation: "This is a classic example of anchoring, where a high initial anchor makes a lower price seem more reasonable."
      },
      {
        questionText: "What is one practical effect of anchoring when shopping?",
        options: [
          "It can make a middle-priced option seem like a smart choice",
          "It removes the need to compare products",
          "It makes all products look identical",
          "It always pushes people to buy the most expensive item"
        ],
        correctAnswer: "It can make a middle-priced option seem like a smart choice",
        explanation: "A high anchor can make middle-tier options look like a rational compromise."
      },
      {
        questionText: "Why do businesses sometimes show a high-priced option first?",
        options: [
          "To make later prices feel more manageable",
          "To confuse customers completely",
          "To hide the cheaper products",
          "To reduce product quality"
        ],
        correctAnswer: "To make later prices feel more manageable",
        explanation: "Showing a high price first creates an anchor that makes subsequent lower prices feel like a discount."
      },
      {
        questionText: "What should a smart buyer do when they notice anchoring?",
        options: [
          "Compare options independently before deciding",
          "Trust the first number automatically",
          "Ignore all lower prices",
          "Buy the middle option every time"
        ],
        correctAnswer: "Compare options independently before deciding",
        explanation: "Being aware of anchoring allows you to evaluate options based on their actual value, rather than just their comparison to the anchor."
      },
      {
        questionText: "Which of these is a good warning sign of anchoring?",
        options: [
          "A price suddenly feels cheap only because it follows a much higher one",
          "A product has clear features listed",
          "The seller gives neutral information",
          "The buyer takes time to compare"
        ],
        correctAnswer: "A price suddenly feels cheap only because it follows a much higher one",
        explanation: "If a price only seems good in comparison to an artificially high first price, it's a sign that anchoring is at play."
      },
      {
        questionText: "Why is anchoring powerful in everyday decisions?",
        options: [
          "People often use quick comparisons instead of full analysis",
          "Prices never change",
          "Consumers always know the real value in advance",
          "Stores are required to show anchors"
        ],
        correctAnswer: "People often use quick comparisons instead of full analysis",
        explanation: "Our brains use shortcuts (heuristics) like anchoring to make quick judgments without needing to do a full analysis."
      },
      {
        questionText: "What is the main lesson of anchoring for consumers?",
        options: [
          "The first number can shape your judgment more than you realize",
          "The most expensive item is always the best value",
          "Price does not matter at all",
          "Only discounts influence decisions"
        ],
        correctAnswer: "The first number can shape your judgment more than you realize",
        explanation: "The core takeaway is that initial information, even if arbitrary, has a strong subconscious effect on later decisions."
      },
      {
        questionText: "How can anchoring affect your spending?",
        options: [
          "It can make you accept a price you might otherwise reject",
          "It prevents all impulse buying",
          "It guarantees savings",
          "It removes emotional influence"
        ],
        correctAnswer: "It can make you accept a price you might otherwise reject",
        explanation: "By making a price seem reasonable in comparison to a higher anchor, it can lead you to spend more than you originally intended."
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
