import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 14;
  console.log(`Starting update for Day \${dayOrder}...`);

  const quiz = await prisma.quiz.findFirst({ where: { dayOrder } });
  
  if (quiz) {
    // Delete existing questions
    await prisma.quizQuestion.deleteMany({
      where: { quizId: quiz.id }
    });

    const questions = [
      {
        questionText: "After seeing three consecutive news reports about house fires, a homeowner purchases an expensive premium fire insurance policy, even though the statistical rate of house fires in their neighborhood is near zero. What cognitive shortcut is driving this purchase?",
        options: [
          "The Representativeness Heuristic",
          "The Availability Heuristic",
          "Base Rate Neglect",
          "Anchoring"
        ],
        correctAnswer: "The Availability Heuristic",
        explanation: "The homeowner judges the probability of a fire by how easily examples of fires come to mind. Because the news made fires highly salient and easy to recall, the brain assumes they are highly probable."
      },
      {
        questionText: "A manager is doing annual performance reviews. Employee A did exceptional work for 11 months, but made a visible mistake last week. Employee B was mediocre all year, but saved a big account yesterday. If the manager gives Employee B a better review, what heuristic are they falling victim to?",
        options: [
          "The Sunk Cost Fallacy",
          "The Availability Heuristic (Recency Bias)",
          "Overconfidence Bias",
          "The Endowment Effect"
        ],
        correctAnswer: "The Availability Heuristic (Recency Bias)",
        explanation: "The manager relies on the most recent (and therefore most mentally \"available\") memories to evaluate performance, rather than weighing the entire year's data equally."
      },
      {
        questionText: "Why do people consistently overestimate the number of deaths caused by shark attacks, while underestimating deaths caused by asthma?",
        options: [
          "Because shark attacks are mathematically more common in coastal areas.",
          "Because asthma is a relatively new disease.",
          "Because shark attacks generate vivid, memorable media coverage that easily comes to mind, while asthma deaths do not.",
          "Because people use System 2 thinking when evaluating animal attacks."
        ],
        correctAnswer: "Because shark attacks generate vivid, memorable media coverage that easily comes to mind, while asthma deaths do not.",
        explanation: "The availability heuristic causes us to equate \"vivid and memorable\" with \"frequent and probable.\" Shark attacks make the news; asthma attacks do not."
      },
      {
        questionText: "A CEO surveys their executive team about the success rate of past product launches. The team overwhelmingly remembers the massive successes and completely forgets the quiet failures. How does this shared availability heuristic threaten the company's future?",
        options: [
          "It causes the company to become overly risk-averse.",
          "It anchors the team to low price points.",
          "It creates institutional overconfidence, as the mental \"sample\" of past events is heavily skewed toward success.",
          "It forces the team to rely exclusively on base rates."
        ],
        correctAnswer: "It creates institutional overconfidence, as the mental \"sample\" of past events is heavily skewed toward success.",
        explanation: "When only successes easily come to mind, leaders misjudge the baseline probability of failure, leading to excessively risky strategic bets."
      },
      {
        questionText: "How could a public health campaign effectively use the availability heuristic to encourage people to wear seatbelts?",
        options: [
          "Publish a spreadsheet showing the percentage decrease in mortality over 50 years.",
          "Tell a single, emotionally gripping, highly memorable story of a relatable family whose lives were saved by a seatbelt.",
          "Explain the physics of a car crash using System 2 math.",
          "Emphasize the monetary cost of a traffic ticket."
        ],
        correctAnswer: "Tell a single, emotionally gripping, highly memorable story of a relatable family whose lives were saved by a seatbelt.",
        explanation: "A vivid, emotional story is much easier for the brain to recall than raw statistics. Making the story \"available\" in memory increases the perceived importance of the action."
      },
      {
        questionText: "A venture capitalist meets a startup founder who wears a black turtleneck, speaks intensely about \"changing the world,\" and dropped out of Stanford. The VC immediately invests, assuming the founder is the next Steve Jobs. What heuristic is driving this decision?",
        options: [
          "Anchoring",
          "The Availability Heuristic",
          "The Representativeness Heuristic",
          "Illusory Correlation"
        ],
        correctAnswer: "The Representativeness Heuristic",
        explanation: "The VC is judging the founder's probability of success based on how closely they resemble the stereotype (the representative pattern) of a successful tech founder, ignoring actual business metrics."
      },
      {
        questionText: "In the classic \"Linda Problem,\" participants are told Linda is outspoken and protested nuclear weapons in college. Most people guess she is a \"feminist bank teller\" rather than just a \"bank teller.\" Why is this a mathematical error?",
        options: [
          "Because there are more feminists than bank tellers.",
          "Because a subset (feminist bank teller) can never be more probable than the larger set it belongs to (bank teller).",
          "Because Linda's past behavior is completely irrelevant to her future.",
          "Because the availability heuristic makes feminists easier to recall."
        ],
        correctAnswer: "Because a subset (feminist bank teller) can never be more probable than the larger set it belongs to (bank teller).",
        explanation: "Every feminist bank teller is a bank teller. Adding details makes a description more representative of the story, but strictly less mathematically probable."
      },
      {
        questionText: "An AI hiring algorithm is trained on 10 years of a company's historical resumes. The algorithm quickly begins downgrading resumes from candidates who went to women's colleges. What behavioral concept has the algorithm automated?",
        options: [
          "The Representativeness Heuristic",
          "Anchoring",
          "Bounded Rationality",
          "The Hot Hand Fallacy"
        ],
        correctAnswer: "The Representativeness Heuristic",
        explanation: "The algorithm learned the pattern of past hires (mostly men) and scored new resumes based entirely on how closely they resembled that historical pattern, mistaking resemblance for qualification."
      },
      {
        questionText: "A patient goes to a doctor with a rare combination of symptoms. The doctor immediately diagnoses the patient with a common cold, ignoring the specific rare symptoms because \"99% of people who come in coughing just have a cold.\" What is the doctor actually doing right?",
        options: [
          "The doctor is falling victim to the representativeness heuristic.",
          "The doctor is relying heavily on base rates rather than resemblance to a rare disease.",
          "The doctor is exhibiting the endowment effect.",
          "The doctor is using anchoring to set a diagnosis."
        ],
        correctAnswer: "The doctor is relying heavily on base rates rather than resemblance to a rare disease.",
        explanation: "Unlike the representativeness heuristic (which jumps to the best \"story\" match), the doctor is correctly relying on the statistical base rate (colds are vastly more common than rare diseases)."
      },
      {
        questionText: "You flip a fair coin six times. Which sequence is mathematically more likely to occur: H-H-H-H-H-H or H-T-T-H-T-H?",
        options: [
          "H-H-H-H-H-H is more likely.",
          "H-T-T-H-T-H is more likely.",
          "Both sequences are exactly equally likely.",
          "It depends on the availability heuristic."
        ],
        correctAnswer: "Both sequences are exactly equally likely.",
        explanation: "Every specific sequence of six coin flips has the exact same probability (1/64). However, the representativeness heuristic makes H-T-T-H-T-H *feel* more likely because it \"looks\" more random."
      },
      {
        questionText: "A real estate agent lists a house for $1.2 million, even though comparable homes in the neighborhood sell for $800,000. When a buyer negotiates the price down to $1 million, they feel they got a great deal. What psychological mechanism did the agent use?",
        options: [
          "The Representativeness Heuristic",
          "The Availability Heuristic",
          "Base Rate Neglect",
          "Anchoring"
        ],
        correctAnswer: "Anchoring",
        explanation: "The initial high price ($1.2M) set an artificial mental anchor. The buyer evaluated the final price ($1M) against the anchor, making it feel like a win, rather than against the actual market value."
      },
      {
        questionText: "During a salary negotiation, why is it generally advantageous to be the person who makes the first offer?",
        options: [
          "Because it establishes a powerful mental anchor that pulls all subsequent counter-offers toward it.",
          "Because it activates the representativeness heuristic in the employer's mind.",
          "Because it forces the employer to use System 2 thinking.",
          "It is actually a disadvantage, because it reveals your bottom line."
        ],
        correctAnswer: "Because it establishes a powerful mental anchor that pulls all subsequent counter-offers toward it.",
        explanation: "The first number introduced into a negotiation acts as a gravitational pull. Even if the other party knows the number is extreme, their counter-offers will unconsciously adjust from that starting point."
      },
      {
        questionText: "A charity sends out a donation letter. Which set of suggested donation check-boxes will likely result in the highest average gift from donors who choose to give?",
        options: [
          "$5, $10, $25, Other",
          "$50, $100, $250, Other",
          "A blank line with no suggested numbers.",
          "$1, $5, $10, Other"
        ],
        correctAnswer: "$50, $100, $250, Other",
        explanation: "Higher suggested numbers establish a higher mental anchor. Donors adjusting downward from $250 will still likely settle on a higher number than those adjusting upward from $5."
      },
      {
        questionText: "In an experiment, participants spin a wheel of fortune that lands on either 10 or 65. They are then asked to estimate the percentage of African nations in the UN. Why do the people who spun 65 consistently guess higher percentages than those who spun 10?",
        options: [
          "Because the wheel activates the availability heuristic.",
          "Because humans naturally struggle with geography.",
          "Because even completely random, unrelated numbers can act as powerful anchors in the brain when forming an estimate.",
          "Because of illusory correlation between the wheel and the UN."
        ],
        correctAnswer: "Because even completely random, unrelated numbers can act as powerful anchors in the brain when forming an estimate.",
        explanation: "Kahneman and Tversky proved that anchoring is so powerful it works even when the subject knows the initial number is entirely arbitrary and unrelated to the question at hand."
      },
      {
        questionText: "A retailer displays a standard $50 toaster next to a luxury $250 toaster. The retailer doesn't expect to sell many $250 toasters. Why display it?",
        options: [
          "To trigger the representativeness heuristic.",
          "To act as a price anchor, making the $50 toaster look incredibly affordable by comparison.",
          "To rely on base rate neglect.",
          "To avoid the sunk cost fallacy."
        ],
        correctAnswer: "To act as a price anchor, making the $50 toaster look incredibly affordable by comparison.",
        explanation: "The $250 item establishes a high price anchor in the customer's mind. Against that backdrop, spending $50 feels like a sensible, frugal decision rather than an absolute cost."
      },
      {
        questionText: "A patient takes a screening test for a rare disease (which affects 1 in 10,000 people). The test is 99% accurate. The patient tests positive. Why is it mathematically highly unlikely that the patient actually has the disease?",
        options: [
          "Because the 1% false positive rate applied to 9,999 healthy people creates vastly more false alarms than there are actual sick people.",
          "Because medical tests are rarely 99% accurate.",
          "Because the representativeness heuristic prevents the disease from spreading.",
          "Because the availability heuristic makes the disease seem scarier than it is."
        ],
        correctAnswer: "Because the 1% false positive rate applied to 9,999 healthy people creates vastly more false alarms than there are actual sick people.",
        explanation: "This is Base Rate Neglect. The brain focuses on the 99% accuracy, ignoring the base rate (1 in 10,000). The pool of healthy people is so massive that the 1% error rate swamps the true positives."
      },
      {
        questionText: "An investor hears a startup uses artificial intelligence and assumes it has a 90% chance of reaching a billion-dollar valuation, ignoring the fact that 95% of all startups fail. What cognitive error is the investor making?",
        options: [
          "Anchoring",
          "Illusory Correlation",
          "Base Rate Neglect",
          "The Endowment Effect"
        ],
        correctAnswer: "Base Rate Neglect",
        explanation: "The investor is focusing entirely on specific, \"sexy\" details about the individual company (AI) while completely ignoring the underlying statistical baseline (startups fail)."
      },
      {
        questionText: "Why does the human brain struggle so heavily to incorporate base rates into daily decision making?",
        options: [
          "Because base rates require System 1 thinking, which is too fast.",
          "Because base rates are usually abstract, statistical facts, whereas specific stories and descriptions are vivid and easily processed by System 1.",
          "Because humans inherently mistrust statisticians.",
          "Because base rates constantly change every day."
        ],
        correctAnswer: "Because base rates are usually abstract, statistical facts, whereas specific stories and descriptions are vivid and easily processed by System 1.",
        explanation: "System 1 handles narratives, stereotypes, and vivid imagery effortlessly. It struggles to process abstract, dry statistics (base rates), requiring effortful System 2 intervention."
      },
      {
        questionText: "You read a study claiming that \"Most Fortune 500 CEOs wake up before 5:00 AM,\" leading you to set your alarm for 4:30 AM to guarantee success. What critical base rate are you neglecting?",
        options: [
          "The number of hours they sleep.",
          "The fact that millions of unsuccessful people also wake up before 5:00 AM (the baseline population).",
          "The representativeness heuristic of a morning routine.",
          "The anchor of a 5:00 AM alarm."
        ],
        correctAnswer: "The fact that millions of unsuccessful people also wake up before 5:00 AM (the baseline population).",
        explanation: "Looking only at successful people who wake up early ignores the massive base rate of early risers in the general population who are not CEOs, rendering the correlation meaningless."
      },
      {
        questionText: "Which statement best defines the cure for Base Rate Neglect?",
        options: [
          "Always assume the worst-case scenario.",
          "Before evaluating the specific details of a single case, always ask: \"What is the general statistical probability of this happening to anyone?\"",
          "Trust your first instinct, as it relies on evolutionary survival heuristics.",
          "Never use numbers when evaluating a scenario."
        ],
        correctAnswer: "Before evaluating the specific details of a single case, always ask: \"What is the general statistical probability of this happening to anyone?\"",
        explanation: "Overcoming base rate neglect requires manually forcing System 2 to acknowledge the baseline statistical reality before getting distracted by the vivid details of the specific case."
      },
      {
        questionText: "A student studies for one hour and predicts they will score a 95% on a difficult exam, but they actually score a 60%. What psychological phenomenon are they exhibiting?",
        options: [
          "Anchoring",
          "The Dunning-Kruger Effect (a specific form of overconfidence)",
          "Base Rate Neglect",
          "Illusory Correlation"
        ],
        correctAnswer: "The Dunning-Kruger Effect (a specific form of overconfidence)",
        explanation: "Overconfidence (and specifically Dunning-Kruger) occurs when individuals with limited knowledge in a domain lack the expertise necessary to accurately assess their own incompetence."
      },
      {
        questionText: "Why are highly successful entrepreneurs (like Elon Musk) particularly prone to severe overconfidence when setting project timelines?",
        options: [
          "Because they deliberately lie to shareholders.",
          "Because past success, especially against the odds, recalibrates their brain to view low-probability events as highly manageable, leading to unrealistic optimism.",
          "Because they use System 2 thinking exclusively.",
          "Because they rely entirely on base rates."
        ],
        correctAnswer: "Because past success, especially against the odds, recalibrates their brain to view low-probability events as highly manageable, leading to unrealistic optimism.",
        explanation: "Surviving massive risks in the past teaches the brain that standard rules and base rates don't apply to them, fueling a powerful planning fallacy and overconfidence in future tasks."
      },
      {
        questionText: "In a famous study, 93% of American drivers rated themselves as \"better than average.\" Why is this mathematically impossible and a perfect example of overconfidence?",
        options: [
          "Because American cars are fundamentally unsafe.",
          "Because by definition, roughly 50% of the population must be below the median average.",
          "Because driving is governed by the representativeness heuristic.",
          "Because people ignore the availability heuristic."
        ],
        correctAnswer: "Because by definition, roughly 50% of the population must be below the median average.",
        explanation: "It is statistically impossible for 93% of a population to be in the top 50%. The study beautifully illustrates the pervasive human tendency toward illusory superiority."
      },
      {
        questionText: "A project manager uses the \"Planning Fallacy\" to estimate a software build will take 3 months. It takes 9 months. What is the core mechanism of the Planning Fallacy?",
        options: [
          "Estimating based on a perfect, uninterrupted \"best-case scenario\" while ignoring the base rate of delays in similar past projects.",
          "Using anchoring to set the timeline.",
          "Relying on illusory correlation between coders and time.",
          "Assuming the team is highly incompetent."
        ],
        correctAnswer: "Estimating based on a perfect, uninterrupted \"best-case scenario\" while ignoring the base rate of delays in similar past projects.",
        explanation: "The planning fallacy (driven by overconfidence) occurs when we focus narrowly on our idealized plan, completely neglecting the historical base rate of how long similar projects actually take."
      },
      {
        questionText: "Which of the following is the most effective behavioral strategy for a team to combat overconfidence before launching a major product?",
        options: [
          "A hype rally to boost morale.",
          "A \"pre-mortem\" exercise, where the team assumes the product has already failed spectacularly and must list the reasons why.",
          "Firing the most pessimistic team member.",
          "Anchoring the launch date to a major holiday."
        ],
        correctAnswer: "A \"pre-mortem\" exercise, where the team assumes the product has already failed spectacularly and must list the reasons why.",
        explanation: "A pre-mortem forcibly breaks overconfidence by requiring the team to shift their perspective from \"how will this succeed\" to \"why did this fail,\" bringing hidden risks into plain view."
      },
      {
        questionText: "A basketball fan insists that a player who has made three shots in a row has a \"hot hand\" and is mathematically more likely to make the fourth shot. Statistical analysis of thousands of games shows the player's shooting percentage stays exactly the same. What is the fan experiencing?",
        options: [
          "Anchoring",
          "The Availability Heuristic",
          "Illusory Correlation",
          "Bounded Rationality"
        ],
        correctAnswer: "Illusory Correlation",
        explanation: "Illusory correlation is the human brain's tendency to perceive a meaningful pattern or relationship between random events (like a streak of coin flips or basketball shots) where none actually exists."
      },
      {
        questionText: "Why did the human brain evolve to find illusory correlations in random data?",
        options: [
          "To help us perform better in financial markets.",
          "Because recognizing patterns (like associating dark clouds with rain, or a certain rustle with a predator) was a massive survival advantage, even if it generated false positives.",
          "Because early humans lacked System 2 thinking.",
          "To combat the availability heuristic."
        ],
        correctAnswer: "Because recognizing patterns (like associating dark clouds with rain, or a certain rustle with a predator) was a massive survival advantage, even if it generated false positives.",
        explanation: "We are a pattern-seeking species. Evolution favored brains that connected dots quickly to survive. In the modern world, this highly active pattern-recognition software often connects dots that are purely random."
      },
      {
        questionText: "An investor notices that the stock market has gone up every time it rains in New York on a Tuesday. They begin trading heavily based on the weather forecast. What describes this behavior?",
        options: [
          "Base rate neglect.",
          "Trading on an illusory correlation.",
          "The Endowment Effect.",
          "The Planning Fallacy."
        ],
        correctAnswer: "Trading on an illusory correlation.",
        explanation: "The investor is linking two completely independent variables (weather and the stock market) simply because they accidentally aligned a few times in the past."
      },
      {
        questionText: "A student uses a specific \"lucky pen\" for a major exam and gets an A. They refuse to take any future exams without that pen. How does behavioral economics explain this superstition?",
        options: [
          "The student is rationally maximizing their utility.",
          "The student formed an illusory correlation between the pen and the grade, mistaking random coincidence for causation.",
          "The student is anchored to the price of the pen.",
          "The student is satisficing their study habits."
        ],
        correctAnswer: "The student formed an illusory correlation between the pen and the grade, mistaking random coincidence for causation.",
        explanation: "Superstitions are classic illusory correlations. The brain connects an action (using the pen) with a positive outcome (the A) and assumes a causal link that does not exist."
      },
      {
        questionText: "How can large datasets and algorithms help businesses overcome the human tendency toward illusory correlation?",
        options: [
          "By generating even more false positives.",
          "By systematically testing whether observed patterns are statistically significant or just random noise, rather than relying on a manager's \"gut feeling.\"",
          "By anchoring prices higher.",
          "By automatically assuming all historical data is perfectly representative of the future."
        ],
        correctAnswer: "By systematically testing whether observed patterns are statistically significant or just random noise, rather than relying on a manager's \"gut feeling.\"",
        explanation: "Humans see patterns everywhere. Data science forces System 2 mathematical rigor onto those patterns to determine if the correlation is real or an illusion."
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
    console.log(`Updated 30 quiz questions for day \${dayOrder}`);
  } else {
    console.log(`No quiz found for Day \${dayOrder}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
