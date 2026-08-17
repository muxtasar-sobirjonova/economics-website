import { PrismaClient, Track } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const track = Track.BEHAVIORAL_ECONOMICS;
  const daysToUpdate = [9, 10, 11, 12];

  console.log("Updating Days 9, 10, 11, and 12 for Behavioral Economics...");

  await prisma.lesson.deleteMany({
    where: { track, dayOrder: { in: daysToUpdate } }
  });

  await prisma.quiz.deleteMany({
    where: { track, dayOrder: { in: daysToUpdate } }
  });

  // ================= DAY 9 =================
  const day9Data = {
    title: "Why We Judge People Too Quickly",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 9,
    track: track,
    conceptText: `A tall teenager walks into a gym for the first time. Before he touches a ball, people assume he plays basketball. He fits the picture in their heads of what a basketball player looks like, so their minds fill in the rest. He might have never played in his life.

This is the representativeness heuristic, another shortcut mapped by Daniel Kahneman and Amos Tversky. When we judge how likely something is, we compare it to a mental picture, a stereotype of what that kind of thing usually looks like. The closer the match, the more certain we feel. We ask "does this resemble the type?" instead of "what are the real chances?"

The shortcut feels reasonable and often helps. Patterns in the world are real, and matching to a type is faster than gathering evidence. But it has a dangerous flaw. It ignores base rates, the actual frequencies in the background, and it treats resemblance as proof. A person who looks like a type is judged to be that type, even when the numbers say otherwise.

The danger grows when we hand this shortcut to a machine. A computer trained on past examples will learn the pattern it is shown, including every bias hidden inside it. It will then apply that pattern to new cases with perfect confidence and no awareness that the pattern was flawed. One of the world's most advanced companies learned this the hard way, when it tried to let an algorithm decide who deserved a job.`,
    conceptSummary: `The representativeness heuristic, studied by Kahneman and Tversky, judges how likely something is by how closely it matches a mental stereotype of the type. The closer the resemblance, the more certain we feel. It is fast and often useful, but it ignores real base rates and treats resemblance as proof. Handed to a machine trained on biased data, the shortcut repeats the bias with total confidence.`,
    conceptTakeaways: [
      "The representativeness heuristic judges likelihood by how well something matches a mental stereotype, rather than by real base rates."
    ],
    articleTitle: "Amazon's Scrapped AI Hiring Tool",
    articleText: `Around 2014, inside Amazon, a team of engineers set out to build something many companies dreamed of. They wanted software that could read a stack of résumés and pick out the best people to hire automatically, the same way the website picks products to recommend.

**What was the hiring tool supposed to do?**
The team wanted an engine that could rate job seekers from one to five stars, just as shoppers rate products on Amazon. Feed it a hundred résumés, and it would hand back the top five to hire. It was meant to remove slow, expensive human judgment and find the best talent faster than any recruiter ever could. On paper, it looked like the future of hiring.

**How did the software learn what a good candidate looked like?**
It studied the résumés Amazon had received over the previous ten years and learned which ones matched people the company had actually hired. In other words, it built a mental picture of a successful Amazon employee from the past, then searched for new people who resembled that picture. This is the representativeness heuristic, rebuilt in computer code: judge the new by how well it matches the old.

**Why did that approach create a problem?**
Because most of those past résumés came from men, since the technology industry had long been dominated by men. The software learned that the "type" of a strong hire looked male. No one told it to prefer men. It simply matched new candidates against a pattern drawn from the past, and the pattern itself was already tilted. The machine treated a biased history as if it were a fair description of talent.

**How did the bias actually show up?**
By 2015, Amazon saw the tool was not rating candidates in a gender-neutral way for technical jobs. It downgraded résumés that contained the word "women's," as in "women's chess club captain." It marked down graduates of two all-women's colleges. It also favored forceful verbs like "executed" and "captured," which appeared more often on the résumés of male engineers. The bias was quiet, but it was everywhere.

**Could Amazon simply fix the bias?**
They tried. Engineers edited the program to ignore those specific words. But they could not be sure the machine would not find new, hidden ways to sort men above women. The bias was not one rule to delete; it lived inside the whole learned pattern. Around 2017, Amazon lost confidence in the tool and scrapped the project entirely.

**What is the real lesson of Amazon's failed tool?**
That judging by resemblance to a past type quietly carries the past's mistakes forward. The machine did exactly what the representativeness heuristic does inside a human mind: it treated "looks like our old hires" as "will be a good hire." When the old pattern was biased, the confident new judgments were biased too, and not one line of code had told it to discriminate.`,
    articleSummary: `Amazon built a tool to rate job candidates by matching them to its successful hires from the past ten years. Because those hires were mostly men, the software learned to favor men, downgrading résumés with the word "women's" and all-women's colleges. Amazon could not fully remove the bias and scrapped the tool around 2017. Judging by resemblance to a past type carried the past's bias forward.`,
    articleTakeaways: [
      "Amazon's hiring tool learned the \"type\" of a good employee from ten years of mostly male résumés.",
      "The tool downgraded résumés containing the word \"women's\" and graduates of two all-women's colleges, without being told to.",
      "Amazon could not guarantee the bias was gone, because it lived in the whole pattern, and scrapped the project around 2017.",
      "Matching new cases to a biased past pattern carries old mistakes forward with confident, unquestioned judgments."
    ]
  };

  await prisma.lesson.create({ data: day9Data });
  console.log("Created Lesson Day 9");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day9Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 9,
      track: track,
      questions: {
        create: [
          {
            questionText: "What is the representativeness heuristic?",
            options: [
              "Judging how likely something is by how well it matches a mental stereotype",
              "Calculating the exact odds of an outcome using detailed background data",
              "Choosing the option that most of the people around you have already chosen",
              "Preferring whatever choice takes the very least effort to reach a decision"
            ],
            correctAnswer: "Judging how likely something is by how well it matches a mental stereotype",
            explanation: "It skips real calculation and matches to a type instead.",
            order: 0
          },
          {
            questionText: "What did Amazon want its hiring tool to do?",
            options: [
              "Replace all of its human recruiters with a single new senior manager",
              "Lower the salaries it paid by hiring only much less experienced people",
              "Read many résumés and automatically rate the strongest candidates",
              "Advertise its open jobs to a far wider group of possible applicants"
            ],
            correctAnswer: "Read many résumés and automatically rate the strongest candidates",
            explanation: "It rated candidates; it was not meant to replace managers wholesale.",
            order: 1
          },
          {
            questionText: "How did the tool learn what a strong candidate looked like?",
            options: [
              "By asking current employees to describe their own ideal future coworker",
              "By studying ten years of past résumés tied to people Amazon had hired",
              "By testing each applicant with a long series of technical skill exams",
              "By copying the exact hiring rules used by other large technology firms"
            ],
            correctAnswer: "By studying ten years of past résumés tied to people Amazon had hired",
            explanation: "It learned from past résumés, not from employee surveys.",
            order: 2
          },
          {
            questionText: "Why did the tool end up biased against women?",
            options: [
              "The engineers who built it deliberately programmed it to prefer men",
              "The tool was tested only on the résumés that had been sent in by men",
              "Women had asked the company not to consider them for technical roles",
              "Most of the past résumés came from men, so the learned pattern favored men"
            ],
            correctAnswer: "Most of the past résumés came from men, so the learned pattern favored men",
            explanation: "No one wrote a rule to prefer men; the bias came from the data.",
            order: 3
          },
          {
            questionText: "How did the bias appear in the tool's judgments?",
            options: [
              "It downgraded résumés with the word \"women's\" and all-women's colleges",
              "It rejected every single résumé that came from anyone with a technical degree",
              "It gave the highest rating to whichever résumé it simply happened to read first",
              "It refused to rate any candidate who had less than ten full years of work"
            ],
            correctAnswer: "It downgraded résumés with the word \"women's\" and all-women's colleges",
            explanation: "It did not reject all technical degrees; it penalized female-linked words.",
            order: 4
          },
          {
            questionText: "Why couldn't Amazon simply fix the bias?",
            options: [
              "The company was legally forbidden from changing the software in any way",
              "The engineers who had built the tool had all left the company by then",
              "The bias lived in the whole pattern, so new hidden forms could appear",
              "Fixing the bias would have made the tool far too slow to be at all useful"
            ],
            correctAnswer: "The bias lived in the whole pattern, so new hidden forms could appear",
            explanation: "The problem was the pattern, not a shortage of engineers.",
            order: 5
          },
          {
            questionText: "What did Amazon finally do with the project?",
            options: [
              "It sold the hiring tool to another large company for a very high price",
              "It lost confidence in the tool and scrapped the project around 2017",
              "It kept on using the tool, but only for hiring non-technical workers",
              "It made the tool public so that anyone at all could download and use it"
            ],
            correctAnswer: "It lost confidence in the tool and scrapped the project around 2017",
            explanation: "Amazon scrapped it; it did not sell it.",
            order: 6
          },
          {
            questionText: "What does the tool show about judging by resemblance to a type?",
            options: [
              "It is always the fastest and the most accurate way to choose between people",
              "It removes human bias completely whenever a machine is the one judging",
              "It works perfectly well as long as the training data set is very large",
              "It can carry the mistakes of the past forward into brand-new decisions"
            ],
            correctAnswer: "It can carry the mistakes of the past forward into brand-new decisions",
            explanation: "The machine repeated human bias rather than removing it.",
            order: 7
          },
          {
            questionText: "How is the tool's behavior like the representativeness heuristic in a person?",
            options: [
              "It treated \"looks like our past hires\" as \"will be a good hire\"",
              "It counted the true base rates carefully before making any judgment",
              "It ignored all patterns and rated every candidate completely at random",
              "It asked each candidate to prove their real skills before rating them"
            ],
            correctAnswer: "It treated \"looks like our past hires\" as \"will be a good hire\"",
            explanation: "It ignored base rates; that is the flaw, not a strength.",
            order: 8
          },
          {
            questionText: "What is the broader warning from Amazon's experience?",
            options: [
              "Machines should never be used to help with any hiring decision at all, ever",
              "Companies should always hire the same kinds of people they have hired before",
              "A pattern learned from a biased past will produce biased, confident judgments",
              "Human recruiters make far more mistakes than any computer system ever does"
            ],
            correctAnswer: "A pattern learned from a biased past will produce biased, confident judgments",
            explanation: "The lesson is about biased data, not a total ban on tools.",
            order: 9
          }
        ]
      }
    }
  });

  // ================= DAY 10 =================
  const day10Data = {
    title: "Why the First Price Changes What We Pay",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 10,
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
    articleTitle: "Apple's iPhone Pricing Strategy",
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

  await prisma.lesson.create({ data: day10Data });
  console.log("Created Lesson Day 10");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day10Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 10,
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
            explanation: "Anchoring is about reference points, not always buying the priciest thing.",
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

  // ================= DAY 11 =================
  const day11Data = {
    title: "Why People Misunderstand Risk",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 11,
    track: track,
    conceptText: `You take a test for a rare disease. The test is described as highly accurate. The result comes back positive. How worried should you be? Most people, including many doctors, would say very worried, around 95 percent sure they are sick. The real answer is closer to 2 percent. The gap between those two numbers is one of the most important mistakes in human judgment.

This mistake is called base rate neglect. A base rate is the background frequency of something: how common a disease is in the whole population before any test is run. When we focus on a single piece of evidence, like a test result, we tend to forget the base rate completely. We judge the case in front of us and ignore the numbers behind it.

The reason this matters is mathematical. If a disease is very rare, then even a good test produces many false alarms, simply because there are so many healthy people to test. A small error rate applied to a huge healthy group can create more false positives than there are true cases. The positive result is real, but it is far more likely to be a mistake than a discovery.

This is not a trap only for the untrained. When researchers put this exact problem to doctors at one of the world's best medical schools, most of them got it badly wrong, and their answers reveal just how deep the blind spot goes.`,
    conceptSummary: `Base rate neglect is forgetting the background frequency of something when judging a single case. A base rate is how common an event is in the whole population. When a disease is rare, even an accurate test produces many false alarms, because a small error rate applied to a huge healthy group creates more false positives than true cases. A positive result can be more likely wrong than right.`,
    conceptTakeaways: [
      "Base rate neglect is ignoring how common something is in the population when judging a single case or test result.",
      "When a disease is rare, even an accurate test produces many false positives, because the healthy group is so large."
    ],
    articleTitle: "The 1978 Harvard study on false-positive test results",
    articleText: `You are a doctor at one of Harvard's teaching hospitals. A colleague stops you in the hallway with a quick question. A disease affects one in a thousand people. A test for it has a false-positive rate of five percent. A patient tests positive. What is the chance the patient actually has the disease? Take a moment. Most of the doctors asked this said 95 percent.

**Where does this question come from?**
From a real study. In 1978, researchers named Casscells, Schoenberger, and Graboys stopped 60 people at four Harvard Medical School teaching hospitals — students, junior doctors, and senior physicians — and asked them exactly this question. It was published in the New England Journal of Medicine. The goal was to see how well trained medical minds handle a simple problem about interpreting a test result.

**What answer did most of the doctors give?**
The most common answer was 95 percent. Nearly half of the 60 people said the patient was almost certainly sick. Only about 18 percent gave the correct answer. These were not careless people; they were doctors and students at a top medical school. The problem was not their knowledge of medicine. It was the way they handled the numbers hidden inside the question.

**So what is the correct answer, and why?**
The correct answer is about 2 percent. Picture 1,000 people. One of them truly has the disease and tests positive. Of the other 999, five percent — about 50 people — test positive by mistake. So around 51 people receive a positive result, but only 1 of them is actually sick. That means a positive result is correct only about 1 time in 51, which is roughly 2 percent.

**What did the doctors forget?**
They forgot the base rate. The disease affects only one in a thousand people, so it is rare before any test is run. That rarity is the whole story. When almost no one has the disease, the false positives from the huge healthy group swamp the single true case. The doctors focused on the test's accuracy and ignored how uncommon the disease actually was.

**Why is this mistake so easy to make?**
Because a five-percent error rate sounds small and reassuring, so the mind treats a positive result as almost certain proof. It feels obvious that a rare error means a reliable answer. But the size of the healthy group changes everything. The mind sees the vivid test result in front of it and never stops to ask how many healthy people were tested to produce it.

**Why does base rate neglect matter beyond one quiz question?**
Because the same error shapes real decisions. When later researchers repeated the study in 2014, most doctors still got it wrong. The mistake affects how we read medical screenings, security alarms, and any rare event flagged by a test. Whenever something rare is being detected, ignoring the base rate can turn a useful test into a source of needless fear.`,
    articleSummary: `In 1978, researchers asked 60 people at Harvard's teaching hospitals about a positive test for a rare disease. Most said the patient was 95 percent likely to be sick; the real answer is about 2 percent. They forgot the base rate: because the disease is rare, false positives from the huge healthy group swamp the one true case. A 2014 repeat found the same mistake.`,
    articleTakeaways: [
      "In the 1978 Harvard study, most doctors said a positive result meant 95 percent likely sick, when the true answer was about 2 percent.",
      "Picturing 1,000 people shows why: one true case is swamped by about 50 false positives, so a positive is right only about 1 time in 51.",
      "The same error affects medical screenings, alarms, and any test for a rare event, and a 2014 repeat found most doctors still got it wrong."
    ]
  };

  await prisma.lesson.create({ data: day11Data });
  console.log("Created Lesson Day 11");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day11Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 11,
      track: track,
      questions: {
        create: [
          {
            questionText: "What is a base rate?",
            options: [
              "The share of tests that give a wrong answer at the moment they are run",
              "The price a hospital charges each patient for running just a single test",
              "How common something is in the whole population before any test is run",
              "The speed at which a disease spreads from one person on to another"
            ],
            correctAnswer: "How common something is in the whole population before any test is run",
            explanation: "That describes an error rate, not a base rate.",
            order: 0
          },
          {
            questionText: "What is base rate neglect?",
            options: [
              "Ignoring how common something is when judging a single piece of evidence",
              "Refusing to trust any medical test because tests can sometimes be wrong",
              "Counting the base rate twice so that it affects the final answer too strongly",
              "Believing that a disease is far rarer than it truly is in the population"
            ],
            correctAnswer: "Ignoring how common something is when judging a single piece of evidence",
            explanation: "It is not a refusal to trust tests; it is ignoring background frequency.",
            order: 1
          },
          {
            questionText: "In the study, what did most of the doctors answer?",
            options: [
              "That the patient had almost no chance at all of actually being sick",
              "That the patient was about 95 percent likely to actually be sick",
              "That the test result gave no useful information about the patient at all",
              "That many more tests were needed before any answer was even possible"
            ],
            correctAnswer: "That the patient was about 95 percent likely to actually be sick",
            explanation: "They gave a very high chance, not a very low one.",
            order: 2
          },
          {
            questionText: "Why is the true chance of being sick so low after a positive result?",
            options: [
              "The test used in the study was of a very poor and unusual quality",
              "The doctors had made an error when they first designed the test itself",
              "The disease had already been cured in almost all of the population",
              "The disease is rare, so false positives outnumber the true cases"
            ],
            correctAnswer: "The disease is rare, so false positives outnumber the true cases",
            explanation: "The test was fine; the rarity of the disease drives the result.",
            order: 3
          },
          {
            questionText: "What did the doctors focus on instead of the base rate?",
            options: [
              "The age and full medical history of the specific patient being tested",
              "The total cost of running the test across the whole hospital system",
              "The test's accuracy, treating a positive result as almost certain proof",
              "The opinions of the other doctors who were standing nearby in the hallway"
            ],
            correctAnswer: "The test's accuracy, treating a positive result as almost certain proof",
            explanation: "They were told to assume no symptoms, so history was not it.",
            order: 4
          },
          {
            questionText: "Why does a small error rate cause so many false alarms here?",
            options: [
              "A small error rate applied to a huge healthy group makes many false positives",
              "A small error rate keeps growing larger every time the same test is repeated",
              "A small error rate actually means that the test is broken and unreliable",
              "A small error rate only ever matters when a disease is extremely common"
            ],
            correctAnswer: "A small error rate applied to a huge healthy group makes many false positives",
            explanation: "The error rate does not grow with repetition; the group size matters.",
            order: 5
          },
          {
            questionText: "Why does a five-percent error rate feel so reassuring?",
            options: [
              "Because five percent is the smallest error rate that any test can ever have",
              "Because a small-sounding error makes a positive feel like near-certain proof",
              "Because doctors are trained to ignore any error rate that is below ten percent",
              "Because five percent of a small group is always going to be a very tiny number"
            ],
            correctAnswer: "Because a small-sounding error makes a positive feel like near-certain proof",
            explanation: "Five percent is not the smallest possible error rate.",
            order: 6
          },
          {
            questionText: "What happened when researchers repeated the study years later?",
            options: [
              "Almost every doctor answered the question correctly on the second attempt",
              "The study could not be repeated because the original question had changed",
              "The doctors refused to take part in the repeated version of the study",
              "Most doctors still got the answer wrong, just as they had before"
            ],
            correctAnswer: "Most doctors still got the answer wrong, just as they had before",
            explanation: "Most still got it wrong, not right.",
            order: 7
          },
          {
            questionText: "Beyond medicine, where else does base rate neglect appear?",
            options: [
              "In security alarms and any other test that flags a genuinely rare event",
              "Only in questions that are written specifically for medical students",
              "In situations where an event happens to almost everybody in a group",
              "Only when a test has no false positives at all anywhere in its results"
            ],
            correctAnswer: "In security alarms and any other test that flags a genuinely rare event",
            explanation: "It appears far beyond medical-student questions.",
            order: 8
          },
          {
            questionText: "What is the key habit that helps avoid base rate neglect?",
            options: [
              "Trusting a positive test result as strong proof without any further question",
              "Focusing only on how accurate the test is said to be by its makers",
              "Asking how common the event actually is before trusting a single result",
              "Assuming that any rare disease has already disappeared from the population"
            ],
            correctAnswer: "Asking how common the event actually is before trusting a single result",
            explanation: "Trusting the result blindly is the mistake itself.",
            order: 9
          }
        ]
      }
    }
  });

  // ================= DAY 12 =================
  const day12Data = {
    title: "Why Successful People Sometimes Overestimate Themselves",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 12,
    track: track,
    conceptText: `Confidence builds companies. It convinces engineers to attempt the impossible, persuades investors to fund a dream, and pushes a team past problems that would stop calmer people. But the same confidence that drives great achievements can also blind a person to how uncertain the future really is.

This is overconfidence, one of the most studied biases in psychology. It is the gap between how sure we feel and how correct we actually are. Overconfident people do not just aim high; they consistently believe their plans will succeed faster and more smoothly than they do. Studies find that most people rate themselves as above-average drivers, and that experts often set deadlines they routinely miss. Feeling certain is not the same thing as being right.

Overconfidence is not simple foolishness. It often appears in brilliant, capable people, because past success feeds the feeling that the next prediction will also come true. The more a person has achieved, the more they may trust their own forecasts, even in areas where the future is genuinely hard to predict.

That makes overconfidence a double-edged trait, especially in business. The right amount launches bold ventures that timid people would never begin. Too much produces confident promises that reality cannot keep. No modern figure shows both sides more clearly than the leader of an electric car company, whose confidence built something real, and whose predictions kept arriving years late.`,
    conceptSummary: `Overconfidence is the gap between how sure we feel and how correct we are. It drives bold achievements but also produces confident predictions that reality cannot keep. Most people rate themselves as above average, and experts routinely miss their own deadlines. Overconfidence is not foolishness; it often grows in accomplished people, because past success feeds the belief that the next forecast will also come true.`,
    conceptTakeaways: [
      "Overconfidence is the gap between how certain a person feels and how often they are actually right.",
      "Overconfidence is not the same as dishonesty; people can sincerely believe predictions that later fail."
    ],
    articleTitle: "Elon Musk's self-driving predictions at Tesla",
    articleText: `"I consider autonomous driving to be a basically solved problem," Elon Musk said in 2016. He added that full self-driving was less than two years away. Nearly a decade later, it still had not arrived.

**Who is making these predictions, and why do they matter?**
Elon Musk leads Tesla, the company that helped push electric cars into the mainstream. His confidence is a real force. It attracted engineers, investors, and customers to a difficult mission, and Tesla built cars that millions of people now drive. When Musk predicts the future, markets and headlines listen closely, which is exactly why the accuracy of those predictions is worth examining carefully.

**How often did Musk predict full self-driving was near?**
Almost every year for a decade. In 2014 he said a Tesla would soon handle most driving on its own. In 2015 he said full autonomy was about two years away. In 2016 he called it "basically solved." He then repeated versions of "next year" or "within two years" in 2017, 2018, 2019, and 2020. The technology kept improving, but the finish line he promised kept moving further ahead.

**What specific promises can we check against reality?**
In 2016, Musk said a Tesla would drive itself from Los Angeles to New York by the end of 2017. It never happened. At Tesla's 2019 Autonomy Day event, he promised a million robotaxis on the road by 2020. None appeared. As of early 2026, Tesla's Full Self-Driving is still officially a system that requires a human to watch the road and be ready to take over at any moment.

**Does this mean Musk was simply lying?**
Not necessarily, and that is the important part. Overconfidence is not the same as dishonesty. Musk appears to have genuinely believed each deadline. He even admitted in 2021 that the problem was harder than he had expected, saying the difficulty was "obvious in retrospect." That is the signature of overconfidence: sincere certainty about a future that turns out to be far more difficult than it felt at the time.

**How can someone be so wrong so often and still be trusted?**
Because the same confidence also delivered real results. Tesla did build successful electric cars. SpaceX, another Musk company, did land and reuse rockets that many experts had doubted were possible. Each real success strengthens the belief that the next bold prediction will also come true. Success quietly feeds overconfidence, which is why capable, accomplished people are often the most prone to it.

**What is the lesson hidden in Musk's track record?**
That confidence and accuracy are two different things. One tracker of Musk's public predictions found that only about nine percent of them arrived on time. His self-driving forecasts, his worst category, were missed again and again. The confidence was not worthless; it helped build real machines that work. But treated as a reliable forecast, it overshot the truth by years, which is the exact danger of overconfidence.`,
    articleSummary: `Elon Musk's confidence helped build Tesla and push electric cars into the mainstream. But for a decade he predicted full self-driving was about a year away, promised a cross-country drive by 2017 and a million robotaxis by 2020, and missed each one. He was not lying; he sincerely believed it. His real successes fed the overconfidence, and one tracker found only about nine percent of his predictions arrived on time.`,
    articleTakeaways: [
      "For roughly a decade, Elon Musk repeatedly predicted full self-driving was about a year or two away, and each deadline moved.",
      "Concrete promises, like a cross-country self-driving trip by 2017 and a million robotaxis by 2020, did not happen.",
      "Real successes, such as Tesla's cars and reusable rockets, can feed overconfidence, so accomplished people are often the most prone to it."
    ]
  };

  await prisma.lesson.create({ data: day12Data });
  console.log("Created Lesson Day 12");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day12Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 12,
      track: track,
      questions: {
        create: [
          {
            questionText: "What is overconfidence, as the lesson describes it?",
            options: [
              "The refusal to ever make any prediction at all about an uncertain future",
              "The gap between how sure a person feels and how correct they truly are",
              "The habit of always expecting the very worst possible outcome to occur",
              "The belief that most other people are far more skilled than oneself is"
            ],
            correctAnswer: "The gap between how sure a person feels and how correct they truly are",
            explanation: "It is excessive certainty of success, not expecting the worst.",
            order: 0
          },
          {
            questionText: "Why does the lesson say confidence can be valuable?",
            options: [
              "Because confident people always turn out to be right about what they predict",
              "Because confidence removes all of the real risk from starting a new company",
              "Because confident predictions never really need to be checked against facts",
              "Because it can push a team to attempt difficult and worthwhile things"
            ],
            correctAnswer: "Because it can push a team to attempt difficult and worthwhile things",
            explanation: "Confidence does not make predictions correct, as the lesson shows.",
            order: 1
          },
          {
            questionText: "How often did Musk predict that full self-driving was nearly ready?",
            options: [
              "Almost every year for about a decade, with the deadline always moving",
              "Only once, at a single event, and then he never mentioned it again",
              "He avoided giving any timeline at all because the problem was so hard",
              "Only after the technology had already been fully finished and released"
            ],
            correctAnswer: "Almost every year for about a decade, with the deadline always moving",
            explanation: "He repeated the prediction many times, not just once.",
            order: 2
          },
          {
            questionText: "Which of these was a specific promise that did not come true?",
            options: [
              "That Tesla would stop making electric cars entirely by the year 2020",
              "That Tesla would never once attempt to build any self-driving software",
              "That a Tesla would drive itself from Los Angeles to New York by 2017",
              "That Tesla would sell its whole car business to another company by 2019"
            ],
            correctAnswer: "That a Tesla would drive itself from Los Angeles to New York by 2017",
            explanation: "No such sale was promised; the missed promise was self-driving.",
            order: 3
          },
          {
            questionText: "Why does the lesson say Musk was probably not simply lying?",
            options: [
              "Because every one of his predictions eventually did come true, on time",
              "Because he appeared to sincerely believe each deadline that he gave",
              "Because he never actually made any public predictions of his own at all",
              "Because the law required him to make optimistic statements in public"
            ],
            correctAnswer: "Because he appeared to sincerely believe each deadline that he gave",
            explanation: "His predictions did not come true on time, yet he was not lying.",
            order: 4
          },
          {
            questionText: "What did Musk admit in 2021 about self-driving?",
            options: [
              "That he had never really expected the technology to work in the first place",
              "That another company was going to finish the technology long before Tesla",
              "That he had made up his earlier predictions in order to raise the stock price",
              "That the problem had turned out to be harder than he had expected"
            ],
            correctAnswer: "That the problem had turned out to be harder than he had expected",
            explanation: "He described genuine surprise, not a made-up claim.",
            order: 5
          },
          {
            questionText: "Why are accomplished people often especially prone to overconfidence?",
            options: [
              "Each real success feeds the belief that the next forecast will also hold true",
              "Successful people are simply never wrong about anything they choose to predict",
              "People with real achievements tend to stop making predictions about the future",
              "Success makes people expect all of their future plans to fail very quickly"
            ],
            correctAnswer: "Each real success feeds the belief that the next forecast will also hold true",
            explanation: "Success feeds optimism about plans, not expectations of failure.",
            order: 6
          },
          {
            questionText: "How could Musk be wrong so often yet still be widely trusted?",
            options: [
              "Because nobody had ever kept any record at all of his past predictions",
              "Because his self-driving forecasts turned out to be his most accurate ones",
              "Because the same confidence also delivered real, working results elsewhere",
              "Because he quietly corrected each prediction before it ever went public"
            ],
            correctAnswer: "Because the same confidence also delivered real, working results elsewhere",
            explanation: "Self-driving was his worst category, not his most accurate.",
            order: 7
          },
          {
            questionText: "What did one tracker of Musk's public predictions find?",
            options: [
              "That nearly all of his predictions arrived exactly on time as promised",
              "That only a small share of his predictions arrived on their schedule",
              "That he had never once made a prediction that turned out to be wrong",
              "That his self-driving forecasts were the ones he almost always met"
            ],
            correctAnswer: "That only a small share of his predictions arrived on their schedule",
            explanation: "Only a small share arrived on time, not nearly all.",
            order: 8
          },
          {
            questionText: "What is the main lesson drawn from Musk's track record?",
            options: [
              "That bold predictions should always be trusted fully and without any doubt",
              "That confident people are usually correct about even the most difficult problems",
              "That real achievements guarantee that a person's future forecasts will be right",
              "That confidence and accuracy are two very different things"
            ],
            correctAnswer: "That confidence and accuracy are two very different things",
            explanation: "Confident people can still be wrong about hard problems.",
            order: 9
          }
        ]
      }
    }
  });

  console.log("Finished updating Days 9, 10, 11, and 12.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
