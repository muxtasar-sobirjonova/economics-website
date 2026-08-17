import { PrismaClient, Track } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const track = Track.BEHAVIORAL_ECONOMICS;
  const dayOrder = 10;
  const title = "Why the First Price Changes What We Pay";

  // Check if Day 10 already exists to avoid duplication, though it shouldn't
  await prisma.lesson.deleteMany({
    where: { track, dayOrder }
  });
  await prisma.quiz.deleteMany({
    where: { track, dayOrder }
  });

  const lessonData = {
    title,
    tag: "ECON",
    timeEstimate: 10,
    dayOrder,
    track: track,
    conceptText: `A jacket hangs on a rack marked 500,000 so'm, crossed out, now 300,000. It feels like a deal. The same jacket, priced at 300,000 from the start, feels ordinary, maybe even a little expensive. Nothing about the jacket changed. Only the first number did.

This is anchoring. The first piece of information we see, especially a number, becomes a reference point that quietly shapes every judgment that follows. Once an anchor is set, we adjust away from it, but almost never far enough. The starting number pulls the final answer toward itself, even when the anchor is random or completely irrelevant.

Kahneman and Tversky showed how strong this pull is. In one study, people spun a wheel that landed on a random number, then guessed an unrelated fact. Those who saw a high number gave higher guesses; those who saw a low number gave lower ones. A number with no meaning still moved their answers. The anchor did not need to be true to work. It only needed to come first.

Sellers understand this better than buyers do. A high price shown first can make everything after it feel reasonable, and a company that controls the first number controls the reference point inside your head. No firm has used this more skillfully than the one that sells the world's most famous phone, and its pricing was never really about the phone alone.`,
    conceptSummary: `Anchoring is the pull of the first number we see. It becomes a reference point, and every later judgment adjusts from it without moving far enough. Kahneman and Tversky showed that even a random number shifts people's estimates. Sellers use this by showing a high price first, so whatever follows feels reasonable. The anchor does not need to be true; it only needs to come first.`,
    conceptTakeaways: [
      "Anchoring is when the first number we see becomes a reference point that pulls every later judgment toward it.",
      "Kahneman and Tversky showed that even a random, meaningless number can shift people's estimates."
    ],
    articleTitle: "Anchoring and Apple's iPhone Pricing",
    articleText: `In January 2007, Steve Jobs spent several minutes convincing his audience that the new iPhone should cost a fortune. He listed everything it could do and said such devices "would normally cost hundreds of dollars." He asked how much more than $499 it should be. Then he revealed the price: $499. A phone that would have seemed expensive suddenly felt like a gift.

**Why did Jobs spend so long talking about price before revealing it?**
He was setting an anchor. By stressing everything the iPhone could do and hinting the price would be high, he made the audience expect a big number. When $499 finally appeared, it landed below that expectation and felt like a bargain. The very same $499, shown cold with no build-up, would have shocked people. The build-up had moved the reference point in every listener's mind.

**How did Apple use anchoring across its whole iPhone lineup?**
Apple learned to show its most expensive model first. When the priciest iPhone sits at the top, every cheaper model beneath it looks reasonable by comparison. A phone that costs around $799 feels modest next to one near $1,199, even though $799 is a great deal of money on its own. The top price acts as the anchor, and everything below it feels like relief.

**What happened when Apple crossed the $1,000 line?**
In 2017, the iPhone X became the first iPhone to start at $999. Many people expected buyers to reject a four-figure phone. Instead, the high price quickly became the new normal. Once $999 existed and sold well, prices that had once seemed shocking felt ordinary. The anchor for what a "premium phone" should cost had been reset upward, for Apple and for the whole industry.

**Why does a high anchor make an expensive product feel affordable?**
Because people judge prices by comparison, not in absolute terms. Standing alone, $799 is a lot of money. Sitting beside $1,199, it feels like the sensible middle choice. The mind does not ask "is this cheap?" It asks "is this cheaper than the number I just saw?" A carefully placed high anchor turns a costly product into the reasonable option in the middle.

**Does the anchor have to be a fair or honest number to work?**
No. Kahneman and Tversky's wheel study showed that even a random number shifts people's guesses. A price anchor works the same way. The most expensive model does not even need to sell well to do its job. Its real purpose is to sit at the top of the page and make everything beneath it look like a smart, sensible decision.

**What is the deeper lesson of Apple's pricing?**
That whoever sets the first number often controls the final judgment. Apple rarely competes on being the cheapest. It competes on controlling the reference point in the buyer's mind. The phone's real price never changes on the walk from the top of the lineup to the bottom. What changes is the anchor you compare it against, and that quiet comparison is doing the real selling.`,
    articleSummary: `Apple has long used anchoring to sell iPhones. In 2007, Jobs primed his audience to expect a high price, then revealed $499, making it feel cheap. Apple shows its most expensive model first, so cheaper ones seem reasonable, and the iPhone X's $999 price in 2017 reset what a premium phone should cost. Whoever sets the first number often controls the final judgment.`,
    articleTakeaways: [
      "Apple shows its most expensive iPhone first, so cheaper models feel reasonable by comparison.",
      "The iPhone X started at $999 in 2017, resetting upward what buyers saw as a normal premium phone price.",
      "A high anchor works because people judge prices by comparison, not in absolute terms, so the anchor does the selling."
    ]
  };

  await prisma.lesson.create({ data: lessonData });
  console.log("Created Lesson Day 10");

  const quizTitle = "Quiz: " + title;
  await prisma.quiz.create({
    data: {
      title: quizTitle,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder,
      track: track,
      questions: {
        create: [
          {
            questionText: "What is anchoring?",
            options: [
              "The habit of always buying the most expensive item that is on offer",
              "The pull of the first number we see on every judgment that follows it",
              "The rule that a fair price must be based only on what an item cost to make",
              "The tendency to trust a seller more than one trusts one's own set budget"
            ],
            correctAnswer: "The pull of the first number we see on every judgment that follows it",
            explanation: "It is about how numbers pull judgment, not about always buying the priciest thing.",
            order: 0
          },
          {
            questionText: "Why did Steve Jobs build up expectations before revealing the iPhone's price?",
            options: [
              "He wanted to delay the announcement until the very end of the whole event",
              "He was required by a law to explain the features before stating any price",
              "He hoped that people would forget the price by the time it finally appeared",
              "He was setting a high anchor so the real price would feel like a bargain"
            ],
            correctAnswer: "He was setting a high anchor so the real price would feel like a bargain",
            explanation: "The delay had a purpose: to set an anchor, not just to wait.",
            order: 1
          },
          {
            questionText: "How does showing the most expensive model first help a seller?",
            options: [
              "It makes the cheaper models below it look reasonable by comparison",
              "It hides the cheaper models so that buyers never even notice they exist",
              "It forces buyers to purchase the most expensive item shown on the page",
              "It proves that the cheaper models must be of a much lower quality"
            ],
            correctAnswer: "It makes the cheaper models below it look reasonable by comparison",
            explanation: "The cheaper models are still shown; they just look better by contrast.",
            order: 2
          },
          {
            questionText: "What happened when the iPhone X crossed the $1,000 line in 2017?",
            options: [
              "Buyers rejected it, forcing Apple to lower the price within a few weeks",
              "Apple stopped selling all of its cheaper iPhone models later that same year",
              "The high price soon became the new normal for a premium phone",
              "Other phone makers were banned from ever charging similar high prices"
            ],
            correctAnswer: "The high price soon became the new normal for a premium phone",
            explanation: "Buyers accepted it; the price stuck rather than being cut.",
            order: 3
          },
          {
            questionText: "Why does a high anchor make an expensive product feel affordable?",
            options: [
              "People judge a price by comparison with other prices, not by its size alone",
              "People always ignore the very highest price that they are shown on a page",
              "People assume the cheapest option on offer must be the best possible value",
              "People add up every price on the page before they make any choice at all"
            ],
            correctAnswer: "People judge a price by comparison with other prices, not by its size alone",
            explanation: "People do not ignore the high price; they compare against it.",
            order: 4
          },
          {
            questionText: "Does an anchor have to be a fair or realistic number to affect us?",
            options: [
              "Yes, an anchor only works when the number shown is honest and accurate",
              "Yes, people ignore any number that seems far too high to be believable",
              "No, but only specially trained experts are affected by unrealistic anchors",
              "No, even a random and meaningless number can still shift our judgment"
            ],
            correctAnswer: "No, even a random and meaningless number can still shift our judgment",
            explanation: "The wheel study showed random numbers work, so honesty is not required.",
            order: 5
          },
          {
            questionText: "What did Kahneman and Tversky's wheel study demonstrate?",
            options: [
              "That people always guess the exact middle number between two given limits",
              "That a random spun number changed people's later and unrelated guesses",
              "That people refuse to answer any question after seeing a random number",
              "That experts are completely immune to the pull of any random anchor"
            ],
            correctAnswer: "That a random spun number changed people's later and unrelated guesses",
            explanation: "People adjusted from the anchor, not toward a fixed middle.",
            order: 6
          },
          {
            questionText: "Why does Apple rarely need to compete on being the cheapest?",
            options: [
              "Its phones cost far less to make than any rival phone on the market",
              "It gives large discounts to every single customer who asks for a lower price",
              "It competes by controlling the reference point inside the buyer's mind",
              "It sells only to buyers who never once look at the price of anything"
            ],
            correctAnswer: "It competes by controlling the reference point inside the buyer's mind",
            explanation: "Its edge is anchoring, not low manufacturing cost.",
            order: 7
          },
          {
            questionText: "On the walk from the top of the lineup to the bottom, what actually changes?",
            options: [
              "The anchor you compare a phone to, not the real price of the phone itself",
              "The real quality of each phone, which drops steadily along with the price",
              "The manufacturing cost of the phone, which the buyer is able to see clearly",
              "The amount of money the buyer truly has available in total to spend"
            ],
            correctAnswer: "The anchor you compare a phone to, not the real price of the phone itself",
            explanation: "Quality is not what the lesson says changes; the anchor is.",
            order: 8
          },
          {
            questionText: "Which everyday example best shows anchoring at work?",
            options: [
              "Choosing a restaurant because a trusted friend recommended it very warmly",
              "A \"was 500,000, now 300,000\" tag making a price feel like a genuine deal",
              "Buying more of a product simply because it is sold in a very large pack",
              "Picking a product because its brand name is one you already know well"
            ],
            correctAnswer: "A \"was 500,000, now 300,000\" tag making a price feel like a genuine deal",
            explanation: "A friend's recommendation is social proof, not anchoring.",
            order: 9
          }
        ]
      }
    }
  });

  console.log("Created Quiz for Day 10.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
