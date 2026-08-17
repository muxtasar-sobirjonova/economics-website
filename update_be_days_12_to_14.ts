import { PrismaClient, Track } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const track = Track.BEHAVIORAL_ECONOMICS;

  // Cleanup existing Days 12, 13, 14
  await prisma.lesson.deleteMany({
    where: { track, dayOrder: { in: [12, 13, 14] } }
  });
  await prisma.quiz.deleteMany({
    where: { track, dayOrder: { in: [12, 13, 14] } }
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
    articleTitle: "Overconfidence and Elon Musk",
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
            explanation: "No such sale or stopping cars was promised; the missed promise was self-driving.",
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

  // ================= DAY 13 =================
  const day13Data = {
    title: "Why We Believe Random Events Are Connected",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 13,
    track: track,
    conceptText: `A gambler watches a roulette ball land on red five times in a row. He feels sure that black is now "due," and bets heavily on it. But the wheel has no memory. Each spin is independent, and the five reds change nothing about the next spin. Still, the feeling that the pattern must break is almost impossible to ignore.

This is illusory correlation — seeing a connection between events that are in fact independent. The human mind is a pattern-finding machine. It evolved to spot links quickly, because missing a real pattern was often more costly than imagining a false one. So we find faces in clouds, meaning in coincidences, and streaks in pure randomness.

A run of the same outcome feels like proof of a hidden force. But randomness naturally produces streaks. Flip a coin many times and long runs of heads will appear, not because the coin is "hot," but because that is simply what chance looks like. Our minds resist this. A streak feels too orderly to be an accident, so we invent a cause to explain it.

Nowhere is this belief stronger than in sport, where fans and players are certain that a hot streak is real. For nearly thirty years, the most famous study on the subject said they were wrong. Then two researchers found a subtle error buried inside it, and the story of the "hot hand" became stranger than anyone expected.`,
    conceptSummary: `Illusory correlation is seeing a connection between events that are actually independent. The mind is built to find patterns, so it sees streaks in randomness, like a gambler sure that black is "due" after five reds. Randomness naturally produces runs, but a streak feels too orderly to be chance, so we invent a cause. This shapes beliefs in gambling, markets, and sport.`,
    conceptTakeaways: [
      "Illusory correlation is seeing a real connection between events that are actually independent, like streaks in random data.",
      "The mind evolved to find patterns quickly, so it sees causes behind runs that chance produces on its own."
    ],
    articleTitle: "The Basketball Hot Hand",
    articleText: `In 1985, three psychologists dropped a small bomb on the world of basketball. They had studied the shooting records of real teams, and they announced that one of the sport's most trusted beliefs — the hot hand — did not exist in the data at all.

**What exactly did the 1985 study claim?**
The psychologists, Thomas Gilovich, Robert Vallone, and Amos Tversky, studied the Philadelphia 76ers' shooting from the 1980–81 season, free throws from the Boston Celtics, and a controlled experiment with Cornell University players. In every case, making a shot did not raise the chance of making the next one. The streaks in the data looked exactly like the runs you get from simply flipping a coin.

**Why did that finding shock so many people?**
Because everyone "knew" the hot hand was real. Players felt it, coaches built strategy around it, and fans saw it every game. The study said all of them had been fooled by illusory correlation, seeing a pattern in what was really randomness. The legendary Celtics leader Red Auerbach dismissed the whole thing bluntly, saying of the researcher, "Who is this guy? So he makes a study. I couldn't care less."

**How did the study explain the powerful feeling of a hot streak?**
As a trick of the mind. Because randomness produces streaks anyway, a player will sometimes hit several shots in a row purely by chance. The mind then treats that ordinary run as evidence of a special "hot" state. The feeling is real and vivid, but according to the 1985 data, the underlying cause did not exist. The streak was simply what chance looks like when you watch it closely.

**So why is the hot hand back in the news?**
Because in 2018, two economists, Joshua Miller and Adam Sanjurjo, found a hidden flaw in how the original study counted streaks. It turns out that in any short, finite sequence, the simple way of measuring "shots right after a hit" is quietly biased downward. The method the 1985 researchers had used was tilting the answer against the hot hand all along, without anyone noticing.

**What happened when the flaw was corrected?**
When Miller and Sanjurjo fixed the bias and re-analyzed the very same data, evidence for a hot hand appeared. The effect was not enormous, but it was real, and it had been hidden by a subtle counting mistake for decades. The study that had proved the hot hand was an illusion turned out to contain an illusion of its own.

**What is the deeper lesson in this twist?**
That the mind's hunger for patterns cuts both ways. People saw a hot hand that the data seemed to deny, which looked like illusory correlation. But the experts who denied it made a quiet error too, and missed a pattern that was really there. Seeing connections that do not exist is a trap. So is being so certain a pattern is fake that you never think to check your own method.`,
    articleSummary: `In 1985, Gilovich, Vallone, and Tversky studied real shooting data and found the basketball hot hand did not exist; streaks looked like coin flips. Most people were sure it was real. Then in 2018, Miller and Sanjurjo found a subtle counting bias in the original method. Corrected, the same data showed the hot hand was real after all. Both believers and skeptics had been fooled.`,
    articleTakeaways: [
      "In 1985, Gilovich, Vallone, and Tversky found that a made basketball shot did not raise the chance of making the next.",
      "In 2018, Miller and Sanjurjo found a hidden counting bias in that study, and correcting it revealed a real hot-hand effect.",
      "Both seeing a pattern that is not there and wrongly denying a real one are failures of how the mind handles randomness."
    ]
  };

  await prisma.lesson.create({ data: day13Data });
  console.log("Created Lesson Day 13");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day13Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 13,
      track: track,
      questions: {
        create: [
          {
            questionText: "What is illusory correlation?",
            options: [
              "A real pattern that repeats reliably every single time that it is measured",
              "A method for calculating the true odds of two events happening together",
              "Seeing a connection between events that are actually independent of each other",
              "The habit of refusing to believe in any pattern at all, even a real one"
            ],
            correctAnswer: "Seeing a connection between events that are actually independent of each other",
            explanation: "It is seeing false patterns, not denying all patterns.",
            order: 0
          },
          {
            questionText: "Why does the human mind see patterns so readily?",
            options: [
              "It evolved to spot links, since missing a real pattern was often very costly",
              "It was trained in school to find the hidden patterns inside random numbers",
              "It can only work at all when every event is connected to every other event",
              "It naturally distrusts patterns and has to be forced to notice any of them"
            ],
            correctAnswer: "It evolved to spot links, since missing a real pattern was often very costly",
            explanation: "The tendency is evolved, not taught in school.",
            order: 1
          },
          {
            questionText: "What did the 1985 study conclude about the basketball hot hand?",
            options: [
              "That players became far more accurate right after making several shots",
              "That making a shot did not raise the chance of making the next one",
              "That only the very best players in the league ever had real hot streaks",
              "That coaches could reliably predict which player would score the next basket"
            ],
            correctAnswer: "That making a shot did not raise the chance of making the next one",
            explanation: "It found no boost after makes in the data.",
            order: 2
          },
          {
            questionText: "How did the 1985 study explain the strong feeling of a hot streak?",
            options: [
              "As real proof that a hidden physical force does exist in the sport",
              "As a deliberate trick that players used to fool the opposing team",
              "As the result of players simply trying much harder after a good shot",
              "As the mind mistaking an ordinary random run for a special state"
            ],
            correctAnswer: "As the mind mistaking an ordinary random run for a special state",
            explanation: "It attributed streaks to chance, not to extra effort.",
            order: 3
          },
          {
            questionText: "Why do random processes like coin flips produce streaks?",
            options: [
              "Because the coin remembers its last result and then tries to repeat it",
              "Because long runs of the same outcome are simply what chance looks like",
              "Because someone is usually interfering with the coin in secret each time",
              "Because streaks only appear when a person is expecting them to appear"
            ],
            correctAnswer: "Because long runs of the same outcome are simply what chance looks like",
            explanation: "A coin has no memory; streaks are not caused by memory.",
            order: 4
          },
          {
            questionText: "What did Miller and Sanjurjo discover in 2018?",
            options: [
              "A hidden counting bias buried in the original study's method",
              "That the 1985 researchers had simply invented their shooting data",
              "That the hot hand is far stronger for fans than it is for players",
              "That basketball streaks are actually caused by much better coaching"
            ],
            correctAnswer: "A hidden counting bias buried in the original study's method",
            explanation: "The data was real; the flaw was in the counting method.",
            order: 5
          },
          {
            questionText: "What happened when the counting bias was corrected?",
            options: [
              "The original conclusion became even stronger than it had been before",
              "The data turned out to be useless and had to be thrown away entirely",
              "Evidence for a real hot-hand effect appeared in the very same data",
              "The researchers found that the streaks were caused by the crowd"
            ],
            correctAnswer: "Evidence for a real hot-hand effect appeared in the very same data",
            explanation: "The correction reversed the conclusion, not strengthened it.",
            order: 6
          },
          {
            questionText: "Why is the twist in this story surprising?",
            options: [
              "Because the original researchers admitted that they had lied on purpose",
              "Because fans turned out to understand statistics better than the experts did",
              "Because the hot hand was finally proven to be completely impossible",
              "Because the study denying an illusion contained an illusion of its own"
            ],
            correctAnswer: "Because the study denying an illusion contained an illusion of its own",
            explanation: "There was no lie; it was a subtle honest error.",
            order: 7
          },
          {
            questionText: "What does the corrected result show about seeing patterns?",
            options: [
              "That every streak a fan notices is always a real and reliable pattern",
              "That wrongly denying a real pattern is also a mistake, not just imagining one",
              "That patterns in sport can never be studied with any real accuracy at all",
              "That the human mind is perfectly reliable whenever it judges randomness"
            ],
            correctAnswer: "That wrongly denying a real pattern is also a mistake, not just imagining one",
            explanation: "Not every streak is real; the point is both errors are possible.",
            order: 8
          },
          {
            questionText: "What is the double-edged lesson of the hot-hand story?",
            options: [
              "Seeing false patterns and denying real ones are both failures of judgment",
              "Statistics should always be trusted over the feelings of experienced players",
              "The first study done on any subject is always the one that gets it right",
              "Random events can be fully predicted once enough data has been collected"
            ],
            correctAnswer: "Seeing false patterns and denying real ones are both failures of judgment",
            explanation: "Even the statistical experts erred, so blind trust is not the lesson.",
            order: 9
          }
        ]
      }
    }
  });


  // ================= DAY 14 =================
  const day14Data = {
    title: "Chapter 2 Review",
    tag: "ECON",
    timeEstimate: 15,
    dayOrder: 14,
    track: track
  };

  await prisma.quiz.create({
    data: {
      title: "Chapter 2 Review Quiz",
      tag: "ECON",
      timeEstimate: 15,
      dayOrder: 14,
      track: track,
      questions: {
        create: [
          {
            questionText: "What does the availability heuristic use to judge how likely something is?",
            options: [
              "The exact official statistics gathered about the event over many years",
              "The advice of an expert who has studied the risk in careful detail",
              "The cost of avoiding the event compared with the cost of ignoring it",
              "How easily examples of the event come to a person's mind"
            ],
            correctAnswer: "How easily examples of the event come to a person's mind",
            explanation: "It skips statistics and relies on ease of recall instead.",
            order: 0
          },
          {
            questionText: "Why did many Americans drive instead of fly after September 11?",
            options: [
              "Airlines had raised ticket prices far beyond what most people could afford",
              "The government had ordered most passenger flights to stop for a whole year",
              "Vivid, repeated images made flying feel far more dangerous than it truly was",
              "New research had shown that driving was safer than flying at the time"
            ],
            correctAnswer: "Vivid, repeated images made flying feel far more dangerous than it truly was",
            explanation: "Price was not the cause; fear from vivid images was.",
            order: 1
          },
          {
            questionText: "Why is the switch from flying to driving after 9/11 a clear example of misjudged risk?",
            options: [
              "People correctly chose the safer option when they decided to drive instead",
              "People avoided a small risk and took on a much larger everyday one",
              "People stopped traveling entirely rather than face either kind of risk at all",
              "People trusted the statistics on driving more than their own strong fear"
            ],
            correctAnswer: "People avoided a small risk and took on a much larger everyday one",
            explanation: "Driving was the more dangerous option, not the safer one.",
            order: 2
          },
          {
            questionText: "What is the representativeness heuristic?",
            options: [
              "Judging likelihood by counting the true background frequency of an event",
              "Choosing whatever option the largest number of other people have chosen",
              "Preferring the option that can be reached with the very least mental effort",
              "Judging how likely something is by how well it matches a mental type"
            ],
            correctAnswer: "Judging how likely something is by how well it matches a mental type",
            explanation: "It is about resemblance to a type, not copying a crowd.",
            order: 3
          },
          {
            questionText: "Why did Amazon's hiring tool become biased against women?",
            options: [
              "The engineers deliberately wrote a rule telling the tool to prefer men",
              "Women had asked the company not to consider them for the technical roles",
              "It learned from past résumés that had come mostly from men",
              "It was tested only during a period when very few women had applied"
            ],
            correctAnswer: "It learned from past résumés that had come mostly from men",
            explanation: "No rule told it to prefer men; the data did.",
            order: 4
          },
          {
            questionText: "How did the bias in Amazon's tool actually appear?",
            options: [
              "It downgraded résumés containing the word \"women's\" and all-women's colleges",
              "It refused to rate any candidate at all who held a technical university degree",
              "It gave every single female candidate the exact same low rating automatically",
              "It rated candidates only by the total length of their work history in years"
            ],
            correctAnswer: "It downgraded résumés containing the word \"women's\" and all-women's colleges",
            explanation: "It penalized female-linked words, not all technical degrees.",
            order: 5
          },
          {
            questionText: "What is anchoring?",
            options: [
              "The habit of always choosing the cheapest item that happens to be available",
              "The rule that a fair price must reflect only what an item cost to make",
              "The tendency to trust a seller more than one's own careful personal judgment",
              "The pull of the first number we see on every judgment that follows it"
            ],
            correctAnswer: "The pull of the first number we see on every judgment that follows it",
            explanation: "Anchoring is about reference points, not choosing the cheapest.",
            order: 6
          },
          {
            questionText: "How does Apple use anchoring in its iPhone lineup?",
            options: [
              "It hides its most expensive model so that buyers never see the top price",
              "It shows its most expensive model first, so cheaper ones feel reasonable",
              "It sells only one single model so that buyers have nothing to compare it with",
              "It lowers every one of its prices whenever a customer asks for a better deal"
            ],
            correctAnswer: "It shows its most expensive model first, so cheaper ones feel reasonable",
            explanation: "It shows the top model rather than hiding it.",
            order: 7
          },
          {
            questionText: "Does an anchor need to be a fair number to influence us?",
            options: [
              "Yes, people simply ignore any number that seems unrealistic or far too high",
              "Yes, an anchor only ever works if the number shown is honest and accurate",
              "No, even a random and meaningless number can still shift our judgment",
              "No, but only untrained people are ever affected by a clearly false anchor"
            ],
            correctAnswer: "No, even a random and meaningless number can still shift our judgment",
            explanation: "A random number still works, so honesty is not required.",
            order: 8
          },
          {
            questionText: "What is base rate neglect?",
            options: [
              "Counting the background frequency of an event far too many separate times",
              "Believing that an event is much rarer than it actually is in real life",
              "Refusing to trust any test at all because tests are sometimes wrong",
              "Ignoring how common something is when judging a single result"
            ],
            correctAnswer: "Ignoring how common something is when judging a single result",
            explanation: "The error is ignoring the base rate, not overusing it.",
            order: 9
          },
          {
            questionText: "In the Harvard study, why was the true chance of illness so low after a positive test?",
            options: [
              "The disease was rare, so false positives outnumbered the true cases",
              "The test used in the study was of an unusually poor and low quality",
              "The disease had already been cured across most of the population",
              "The doctors had accidentally designed the test in the wrong way"
            ],
            correctAnswer: "The disease was rare, so false positives outnumbered the true cases",
            explanation: "The test was fine; rarity of the disease drove the result.",
            order: 10
          },
          {
            questionText: "What did most of the Harvard doctors focus on instead of the base rate?",
            options: [
              "The full medical history of the specific patient who was being tested",
              "The total cost of running the test across the whole hospital system",
              "The test's accuracy, treating a positive result as near-certain proof",
              "The opinions of the other doctors who were standing nearby at the time"
            ],
            correctAnswer: "The test's accuracy, treating a positive result as near-certain proof",
            explanation: "They were told to assume no symptoms, so history was not it.",
            order: 11
          },
          {
            questionText: "What is overconfidence, as the lesson describes it?",
            options: [
              "The refusal to make any prediction at all about an uncertain future",
              "The habit of always expecting the very worst possible result to occur",
              "The belief that everyone else around you is far more capable than you are",
              "The gap between how sure a person feels and how correct they truly are"
            ],
            correctAnswer: "The gap between how sure a person feels and how correct they truly are",
            explanation: "It is excess certainty of success, not expecting the worst.",
            order: 12
          },
          {
            questionText: "Why does the lesson say Musk's confidence was not simply dishonesty?",
            options: [
              "Because every prediction that he made came true exactly on time",
              "Because he appeared to sincerely believe each deadline that he set",
              "Because he never actually made any public predictions of his own at all",
              "Because a law required him to speak optimistically whenever he was in public"
            ],
            correctAnswer: "Because he appeared to sincerely believe each deadline that he set",
            explanation: "His predictions often failed, yet he was not lying.",
            order: 13
          },
          {
            questionText: "Why are accomplished people often especially prone to overconfidence?",
            options: [
              "Because successful people simply never make mistakes in their predictions",
              "Because people with real achievements stop forecasting the future entirely",
              "Because each real success feeds the belief that the next forecast will hold",
              "Because success makes people expect their plans to fail very quickly indeed"
            ],
            correctAnswer: "Because each real success feeds the belief that the next forecast will hold",
            explanation: "Success feeds optimism, not expectations of failure.",
            order: 14
          },
          {
            questionText: "What is illusory correlation?",
            options: [
              "A reliable pattern that repeats every single time it is carefully measured",
              "A method for finding the true odds of two events occurring together at once",
              "A refusal to believe in any pattern at all, even one that is clearly real",
              "Seeing a connection between events that are actually independent"
            ],
            correctAnswer: "Seeing a connection between events that are actually independent",
            explanation: "It is a false pattern, not a reliable one.",
            order: 15
          },
          {
            questionText: "What did the 1985 basketball study first conclude?",
            options: [
              "That a made shot did not raise the chance of making the next one",
              "That players grew far more accurate right after a run of several makes",
              "That only the league's very best players ever experienced hot streaks",
              "That coaches could reliably predict who would score the next basket"
            ],
            correctAnswer: "That a made shot did not raise the chance of making the next one",
            explanation: "It found no such boost after makes in the data.",
            order: 16
          },
          {
            questionText: "What did Miller and Sanjurjo find in 2018?",
            options: [
              "That the 1985 researchers had simply invented the shooting data they used",
              "That a hidden counting bias had tilted the original study's result",
              "That the hot hand was actually much stronger for fans than for players",
              "That basketball streaks were really produced by much better coaching"
            ],
            correctAnswer: "That a hidden counting bias had tilted the original study's result",
            explanation: "The data was real; the counting method was flawed.",
            order: 17
          },
          {
            questionText: "Why do random processes like coin flips produce streaks?",
            options: [
              "Because the coin remembers its last result and then tries to repeat it",
              "Because someone is usually secretly interfering with each of the outcomes",
              "Because long runs of one outcome are simply what chance looks like",
              "Because streaks only ever appear when a person expects to see them"
            ],
            correctAnswer: "Because long runs of one outcome are simply what chance looks like",
            explanation: "A coin has no memory; chance alone makes streaks.",
            order: 18
          },
          {
            questionText: "What do all of these mental shortcuts have in common?",
            options: [
              "They always produce the correct answer faster than careful thinking does",
              "They appear only in people who have had very little formal education",
              "They are used by machines but never by any ordinary human beings",
              "They are fast rules that usually help but can misfire in predictable ways"
            ],
            correctAnswer: "They are fast rules that usually help but can misfire in predictable ways",
            explanation: "They can misfire, so they are not always correct.",
            order: 19
          }
        ]
      }
    }
  });
  console.log("Created Quiz for Day 14 (Chapter 2 Review)");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
