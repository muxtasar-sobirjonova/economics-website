import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 12;
  const tag = "Week 2";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>In 2016, Elon Musk promised that Tesla's Autopilot would allow a car to drive coast-to-coast, hands-free, by the end of that year. It didn't happen — not that year, not for several years after. Musk wasn't lying. He was exhibiting overconfidence: the tendency for people, especially high-achieving ones, to systematically overestimate their own abilities, the accuracy of their predictions, and their control over uncertain outcomes.</p>

<p>Overconfidence isn't the same as arrogance. Psychologists distinguish it from ordinary bragging because it operates below conscious awareness — the person genuinely believes the optimistic timeline, having built a track record on defying skeptics before. Economist Daniel Kahneman called overconfidence "the most significant of the cognitive biases" precisely because it drives real decisions, not just talk.</p>

<p>Imagine you've beaten the odds twice already — once building an online payments company, once building rockets that were supposed to be impossible for a private firm. Every year that critics doubted you and you proved them wrong recalibrates your internal sense of what's achievable. By the third or fourth bet, the gap between your estimate and reality has grown, but your confidence in your own judgment has grown even faster.</p>

<p>That gap is where innovation and danger start to blur — and Tesla's own history offers a case study most entrepreneurs never get to run in front of the public.</p>`;

  const conceptSummary = `Overconfidence is the tendency to overestimate one's own abilities, predictions, or control over uncertain outcomes. It's especially common among people who've beaten the odds before, since past success recalibrates what they believe is achievable. Elon Musk's repeated missed deadlines at Tesla show how a track record of proving skeptics wrong can widen the gap between prediction and reality.`;

  const conceptTakeaways = [
    "Overconfidence is the systematic overestimation of one's own abilities, predictions, or control over outcomes.",
    "Overconfidence differs from arrogance because it operates below conscious awareness — the person genuinely believes the optimistic claim.",
    "Past success can recalibrate a person's sense of what's achievable, widening the gap between prediction and reality over time.",
    "Daniel Kahneman identified overconfidence as one of the most consequential cognitive biases because it drives real decisions, not just statements.",
    "Overconfidence can fuel bold innovation and reckless risk-taking at the same time — the trait doesn't separate cleanly into 'good' or 'bad'."
  ];

  const articleTitle = "Elon Musk, Tesla, and the Psychology of Extreme Confidence";
  
  const articleText = `<p><strong>"When does confidence help innovation, and when does it become dangerous?"</strong></p>

<p>Imagine you're an early Tesla investor in 2017. How do you tell the difference between founder confidence and founder delusion? You can't, not in the moment. That's what makes overconfidence dangerous — it looks identical to conviction until the deadline passes. Tesla investors in 2017 had already watched Elon Musk found an online payments company that became PayPal, then a rocket company that reused boosters when NASA had written off the idea. Betting against Musk had lost people money before. So when he made his next promise, most investors had no reliable way to separate justified confidence from an inflated one.</p>

<p>What did Musk actually promise about Autopilot in 2016, and how far off was reality? In October 2016, Musk said a Tesla would drive itself coast-to-coast, from Los Angeles to New York, with no driver intervention, by the end of 2017. That demonstration never happened. Full autonomous driving — the capability Musk described — still hadn't fully arrived nearly a decade later, even as Tesla kept shipping "Full Self-Driving" software updates under that same promised name.</p>

<p>Why did Musk tweet "funding secured" in August 2018, and what did it cost him? On August 7, 2018, Musk tweeted that he had "funding secured" to take Tesla private at $420 a share. The funding wasn't secured. The U.S. Securities and Exchange Commission sued him for securities fraud, and Musk settled by paying a $20 million fine, stepping down as Tesla's chairman for at least three years, and agreeing to have certain public statements about the company reviewed. Overconfidence here wasn't just an optimistic forecast — it moved markets and triggered a federal investigation.</p>

<p>If you'd shorted Tesla stock based on Musk's track record of missed deadlines, would you have been right? For years, you would have been wrong about the stock even while being right about the deadlines. Tesla missed Model 3 production targets badly during 2017 and 2018 — Musk called it "production hell" — yet the company survived and its stock eventually multiplied many times over. Overconfidence produced broken promises and a company that kept its doors open through sheer willingness to attempt what more cautious competitors wouldn't.</p>

<p>How did the same overconfidence that caused "production hell" also help Tesla survive it? Musk reportedly slept at the factory during the Model 3 crunch, pushing production goals that most manufacturing engineers considered unrealistic on the original timeline. The unrealistic goal caused real damage — burned cash, missed quarters, exhausted staff — but it also compressed years of ramp-up into months once the line finally worked. The same bias that set an impossible date also refused to accept the slower, safer alternative competitors were choosing.</p>

<p>When you're the one making the prediction, how do you know if you're Musk in 2016 or Musk in 2020? You mostly don't, until the deadline arrives. The honest answer is that overconfidence isn't a switch entrepreneurs can turn off selectively for the good bets and on for the bold ones — it's the same trait producing both the Autopilot promise that never landed and the Model 3 line that eventually did. The only real safeguard is separating the prediction from the claim: bold timelines are survivable; false statements about secured money are not.</p>`;

  const articleSummary = `Elon Musk's history at Tesla shows overconfidence cutting both ways. His 2016 promise of coast-to-coast self-driving never materialized, and his 2018 "funding secured" tweet triggered an SEC fraud settlement. But the same unrealistic drive that caused Model 3 "production hell" also pushed Tesla through it. Confidence fuels ambition and risk simultaneously — the difference is whether the claim is a bold prediction or a false statement of fact.`;

  const articleTakeaways = [
    "In 2016, Musk promised fully autonomous coast-to-coast driving by 2017 — a target still unmet nearly a decade later.",
    "Musk's August 2018 'funding secured' tweet led to an SEC lawsuit, a $20 million fine, and his removal as Tesla's chairman for three years.",
    "Tesla's Model 3 'production hell' (2017-2018) shows overconfidence causing real financial and operational damage.",
    "The same overconfidence that caused missed deadlines also drove Tesla through production crises that more cautious competitors might not have attempted.",
    "The line between productive confidence and dangerous overconfidence often comes down to whether a claim is a bold prediction or a false statement of present fact."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Why Successful People Sometimes Overestimate Themselves",
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
        questionText: "A founder gives a timeline that seems much faster than what similar projects usually take. What is the most sensible reaction?",
        options: [
          "Accept it as guaranteed",
          "Treat it as a claim that deserves a closer look",
          "Assume it is always false",
          "Ignore the timeline completely"
        ],
        correctAnswer: "Treat it as a claim that deserves a closer look",
        explanation: "Timelines given by highly confident people often suffer from overconfidence; treating it as an assumption to investigate is the safest approach."
      },
      {
        questionText: "Why can confident people sometimes make poor predictions even when they seem experienced?",
        options: [
          "Experience always prevents mistakes",
          "Past wins can make future judgment too optimistic",
          "Confidence has no effect on decisions",
          "Prediction skill and confidence are identical"
        ],
        correctAnswer: "Past wins can make future judgment too optimistic",
        explanation: "Success can recalibrate a person's sense of what is achievable, leading to overconfidence in future predictions."
      },
      {
        questionText: "What is the main risk of trusting a bold claim too quickly?",
        options: [
          "The claim may sound convincing even if the outcome is uncertain",
          "The claim will always be rejected",
          "Bold claims never affect people",
          "Uncertain outcomes are easy to predict"
        ],
        correctAnswer: "The claim may sound convincing even if the outcome is uncertain",
        explanation: "Overconfidence looks like conviction, making it easy to believe a prediction that may be completely detached from reality."
      },
      {
        questionText: "A leader has a history of proving skeptics wrong. What problem can this create later?",
        options: [
          "They may become unable to take action",
          "They may start expecting success more often than reality supports",
          "They will always become more accurate",
          "They will stop making decisions"
        ],
        correctAnswer: "They may start expecting success more often than reality supports",
        explanation: "Repeated success feeds overconfidence, increasing the gap between their predictions and what is actually possible."
      },
      {
        questionText: "Which is a better way to evaluate a big promise?",
        options: [
          "Focus only on how strongly it is stated",
          "Compare it with past performance and the size of the challenge",
          "Judge it by the speaker’s popularity",
          "Accept it if the speaker sounds certain"
        ],
        correctAnswer: "Compare it with past performance and the size of the challenge",
        explanation: "Evaluating a promise objectively requires looking beyond the speaker's confidence to their track record and the realistic constraints of the challenge."
      },
      {
        questionText: "A company announces an ambitious target that would require unusual speed and resources. What should an outsider ask first?",
        options: [
          "Whether the target sounds inspiring",
          "What assumptions the target depends on",
          "Whether the team uses social media",
          "Whether the company has a famous founder"
        ],
        correctAnswer: "What assumptions the target depends on",
        explanation: "Bold claims are often built on overly optimistic assumptions (overconfidence). Unpacking those assumptions reveals how realistic the target is."
      },
      {
        questionText: "Why can overconfidence be useful in some situations?",
        options: [
          "It can push people to attempt hard goals they might otherwise avoid",
          "It removes all uncertainty",
          "It guarantees success",
          "It makes planning unnecessary"
        ],
        correctAnswer: "It can push people to attempt hard goals they might otherwise avoid",
        explanation: "Overconfidence isn't inherently bad; the same unrealistic drive that causes missed deadlines can also push teams to achieve things cautious competitors wouldn't try."
      },
      {
        questionText: "Why can the same trait become risky?",
        options: [
          "It always leads to legal trouble",
          "It can cause people to underestimate obstacles and overpromise",
          "It prevents innovation",
          "It only affects inexperienced people"
        ],
        correctAnswer: "It can cause people to underestimate obstacles and overpromise",
        explanation: "While overconfidence fuels ambition, it also causes leaders to ignore risks, leading to costly delays and failures."
      },
      {
        questionText: "What is a sign that confidence may be moving into overconfidence?",
        options: [
          "The plan assumes everything will go right",
          "The person considers possible delays and setbacks",
          "The team asks questions",
          "The project has a deadline"
        ],
        correctAnswer: "The plan assumes everything will go right",
        explanation: "Overconfidence typically involves underestimating risks and believing you have more control over uncertain outcomes than you actually do."
      },
      {
        questionText: "What is the safest way to respond to a very bold forecast?",
        options: [
          "Believe it fully if the speaker is successful",
          "Treat it as one possibility, not a certainty",
          "Reject all bold goals",
          "Assume the past will repeat exactly"
        ],
        correctAnswer: "Treat it as one possibility, not a certainty",
        explanation: "Recognizing the influence of overconfidence means understanding that bold forecasts are predictions, not guarantees, even from successful people."
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
