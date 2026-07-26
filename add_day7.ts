import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 7;
  const track = "BEHAVIORAL_ECONOMICS";
  console.log(`Starting update for Day \${dayOrder} (\${track})...`);

  // 1. UPDATE LESSON
  const lesson = await prisma.lesson.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  if (lesson) {
    const updatedLesson = await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: 'Chapter 1 Review Quiz: Fundamentals of Behavioral Economics',
        conceptText: 'This review quiz contains 30 challenging, scenario-based questions covering the concepts from Days 1 through 6.',
        conceptSummary: 'Review quiz for Week 1.',
        conceptTakeaways: ['Review Week 1 concepts.', 'Test your knowledge.'],
        articleTitle: 'Week 1 Review',
        articleText: 'Good luck with the review quiz!',
        articleSummary: 'Review quiz.',
        articleTakeaways: ['Review quiz.'],
      }
    });
    console.log(`Successfully updated Lesson for Day \${dayOrder}: \${updatedLesson.title}`);
  } else {
    console.log(`Lesson for Day \${dayOrder} not found!`);
  }

  // 2. UPDATE QUIZ
  const quiz = await prisma.quiz.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  if (quiz) {
    // Delete existing questions
    await prisma.quizQuestion.deleteMany({
      where: { quizId: quiz.id }
    });

    const questions = [
      {
        questionText: "A consumer spends exactly three hours researching the absolute best microwave on the market, assigning numerical values to durability, price, and wattage. According to Classical Economics (Rational Choice Theory), what fundamental assumption is this consumer fulfilling?",
        options: [
          "The assumption of perfect foresight",
          "The assumption of bounded rationality",
          "The assumption of utility maximization",
          "The assumption of diminishing marginal utility"
        ],
        correctAnswer: "The assumption of utility maximization",
        explanation: "Rational Choice Theory assumes humans act as \"Homo Economicus,\" carefully weighing costs and benefits to maximize total utility or satisfaction."
      },
      {
        questionText: "A city offers a $500 rebate for buying an electric bike. Classical economics predicts a massive surge in purchases, but only a few people apply because the paperwork is incredibly confusing. Why did the classical model fail to predict this outcome?",
        options: [
          "It assumed the financial benefit would automatically override the cognitive and friction costs of the process.",
          "It failed to account for the availability heuristic.",
          "It assumed people prefer gasoline over electricity regardless of cost.",
          "It predicted that people would wait for a $1000 rebate instead."
        ],
        correctAnswer: "It assumed the financial benefit would automatically override the cognitive and friction costs of the process.",
        explanation: "Classical models often ignore \"friction\" (cognitive load, time, hassle), assuming that if the pure financial math is positive, humans will flawlessly execute the action."
      },
      {
        questionText: "Under the strictest interpretation of Rational Choice Theory, how should an individual react if they lose a $50 concert ticket on the way to the venue, assuming they have plenty of money in their bank account?",
        options: [
          "They should go home, because the concert is now mentally coded as costing $100.",
          "They should buy another ticket if the utility of the concert is still greater than the cost of the new ticket, ignoring the sunk cost.",
          "They should buy another ticket only if the band is their absolute favorite.",
          "They should refuse to buy a new ticket to avoid the endowment effect."
        ],
        correctAnswer: "They should buy another ticket if the utility of the concert is still greater than the cost of the new ticket, ignoring the sunk cost.",
        explanation: "A perfectly rational actor ignores sunk costs (the lost ticket) and evaluates the current choice independently: does the concert provide more than $50 worth of utility right now?"
      },
      {
        questionText: "A core pillar of Rational Choice Theory is that human preferences are \"transitive.\" If a consumer strictly prefers apples to bananas, and bananas to cherries, what must be true for their behavior to be considered rational?",
        options: [
          "They must prefer cherries to apples due to diminishing returns.",
          "They must strictly prefer apples to cherries.",
          "They must value all three fruits equally over time.",
          "They must only buy apples when bananas are unavailable."
        ],
        correctAnswer: "They must strictly prefer apples to cherries.",
        explanation: "Transitivity means that if A > B and B > C, then A > C. Behavioral economics often finds real human choices violate this clean logical assumption depending on context."
      },
      {
        questionText: "Which of the following scenarios describes a person acting perfectly in line with \"Homo Economicus\"?",
        options: [
          "A person who leaves a 20% tip at a restaurant they will never visit again while traveling alone.",
          "A person who refuses to sell a stock because they don't want to admit they made a bad investment.",
          "A person who defected in a one-time Prisoner's Dilemma game to maximize their own personal payout regardless of the other player.",
          "A person who donates anonymously to a charity out of a deep sense of empathy."
        ],
        correctAnswer: "A person who defected in a one-time Prisoner's Dilemma game to maximize their own personal payout regardless of the other player.",
        explanation: "Homo Economicus is entirely self-interested and calculating. Defecting in a one-shot Prisoner's Dilemma is the mathematically optimal choice to maximize personal utility, disregarding social norms or empathy."
      },
      {
        questionText: "A hiring manager has 500 resumes to review. Instead of scoring all 500 to find the mathematically perfect candidate, she reviews them one by one and hires the first person who has 5 years of experience and a relevant degree. What concept by Herbert Simon does this illustrate?",
        options: [
          "The Representativeness Heuristic",
          "Satisficing",
          "System 2 Thinking",
          "Risk Aversion"
        ],
        correctAnswer: "Satisficing",
        explanation: "Satisficing (satisfy + suffice) means searching through available alternatives until an acceptability threshold is met, rather than exhausting time and resources to find the absolute \"best\" option."
      },
      {
        questionText: "Why does \"Bounded Rationality\" argue that humans fail to act like Homo Economicus?",
        options: [
          "Because humans are inherently emotional and illogical creatures who ignore data.",
          "Because human cognitive capacity, available information, and time are strictly limited, making perfect calculation impossible.",
          "Because humans prefer to make decisions based entirely on social proof and herd behavior.",
          "Because markets do not provide enough choices for true optimization to occur."
        ],
        correctAnswer: "Because human cognitive capacity, available information, and time are strictly limited, making perfect calculation impossible.",
        explanation: "Bounded Rationality doesn't say we are irrational; it says our rationality is constrained by the limits of our brains, the time we have, and the information we can realistically process."
      },
      {
        questionText: "An online shopper wants to buy a television. They apply filters for \"4K,\" \"Under $500,\" and \"4 Stars & Up.\" They buy the first TV that appears on the list. Which of the following is true according to behavioral economics?",
        options: [
          "The shopper acted irrationally and will likely regret their purchase.",
          "The shopper maximized their utility perfectly.",
          "The shopper optimized for decision-making efficiency rather than product perfection.",
          "The shopper was heavily influenced by the endowment effect."
        ],
        correctAnswer: "The shopper optimized for decision-making efficiency rather than product perfection.",
        explanation: "By applying filters and picking the first acceptable result, the shopper conserved cognitive energy. This is a highly efficient, boundedly rational approach to a low-stakes decision."
      },
      {
        questionText: "In a world of \"Bounded Rationality,\" how should a grocery store design its cereal aisle to maximize sales of a specific brand?",
        options: [
          "Provide a detailed, 5-page nutritional breakdown of every cereal for shoppers to read.",
          "Place the target cereal at eye-level, making it the easiest acceptable option to grab without searching.",
          "Hide the cereal on the bottom shelf to create artificial scarcity.",
          "Only sell one type of cereal in the entire store."
        ],
        correctAnswer: "Place the target cereal at eye-level, making it the easiest acceptable option to grab without searching.",
        explanation: "Since shoppers satisfice rather than maximize, making a product visually salient and easy to grab ensures it crosses their \"acceptability threshold\" before they even look at alternatives."
      },
      {
        questionText: "How does Bounded Rationality challenge the classical economic view of complex contracts (like mortgages)?",
        options: [
          "It assumes consumers will always hire lawyers to maximize their understanding.",
          "It highlights that consumers cannot possibly read and calculate the long-term impact of 50 pages of fine print, leading them to rely on trust or default options instead.",
          "It proves that all contracts are fundamentally fair in a free market.",
          "It suggests consumers will only sign contracts if the immediate cash payout is positive."
        ],
        correctAnswer: "It highlights that consumers cannot possibly read and calculate the long-term impact of 50 pages of fine print, leading them to rely on trust or default options instead.",
        explanation: "Classical economics assumes a consumer fully processes a contract. Bounded rationality accepts that cognitive limits prevent this, explaining why fine print is often ignored."
      },
      {
        questionText: "A driver suddenly slams on the brakes when a dog runs into the street, reacting before they even consciously register what the animal is. Which cognitive system is entirely responsible for this action?",
        options: [
          "System 2",
          "The Rational Maximizer",
          "System 1",
          "The Satisficer"
        ],
        correctAnswer: "System 1",
        explanation: "System 1 operates automatically, quickly, and intuitively, with little or no effort and no sense of voluntary control."
      },
      {
        questionText: "You are asked to solve the math problem 17 x 24. You feel a sense of mental strain, your pupils dilate, and you must concentrate actively to find the answer. What is happening in your brain?",
        options: [
          "System 1 is rapidly accessing heuristics.",
          "System 2 has been engaged to handle a complex, effortful computation.",
          "You are experiencing the availability heuristic.",
          "System 1 is overriding System 2."
        ],
        correctAnswer: "System 2 has been engaged to handle a complex, effortful computation.",
        explanation: "System 2 allocates attention to the effortful mental activities that demand it, including complex computations. It requires conscious focus and energy."
      },
      {
        questionText: "A skilled chess grandmaster glances at a board and instantly knows the best move without actively calculating. A beginner playing the same board spends 10 minutes sweating over their next move. What explains this difference?",
        options: [
          "The grandmaster is using System 1, while the beginner is forced to use System 2.",
          "The grandmaster is using System 2, while the beginner is using System 1.",
          "Both are using System 1, but the grandmaster's System 1 is slower.",
          "The beginner is satisficing, while the grandmaster is maximizing."
        ],
        correctAnswer: "The grandmaster is using System 1, while the beginner is forced to use System 2.",
        explanation: "Through extensive practice, tasks that once required effortful System 2 thinking can become automatic, intuitive System 1 responses."
      },
      {
        questionText: "Why do humans default to using System 1 for the vast majority of daily decisions, even when it might lead to minor errors?",
        options: [
          "Because System 1 is statistically more accurate than System 2 in every scenario.",
          "Because System 2 is completely turned off during the day.",
          "Because the brain is a metabolic machine; System 2 is highly energy-intensive, so defaulting to System 1 conserves cognitive calories.",
          "Because System 1 is the only system capable of reading written language."
        ],
        correctAnswer: "Because the brain is a metabolic machine; System 2 is highly energy-intensive, so defaulting to System 1 conserves cognitive calories.",
        explanation: "System 2 requires significant mental effort and biological energy. The brain is an energy-saving device, so it relies on the low-effort System 1 to navigate daily life efficiently."
      },
      {
        questionText: "You read the phrase \"Moses took two of every animal on the Ark.\" Most people don't immediately notice the error (it was Noah, not Moses). Why does this \"Moses Illusion\" work?",
        options: [
          "System 2 is working too hard on the grammar to notice the names.",
          "System 1 relies on associative memory; \"Moses\" and \"Ark\" belong to the same biblical context, so it signals \"cognitive ease\" and bypasses System 2 verification.",
          "System 1 cannot process proper nouns.",
          "People lack the information required to maximize utility."
        ],
        correctAnswer: "System 1 relies on associative memory; \"Moses\" and \"Ark\" belong to the same biblical context, so it signals \"cognitive ease\" and bypasses System 2 verification.",
        explanation: "System 1 checks for broad coherence. Since Moses fits the biblical schema, System 1 accepts the statement effortlessly without alerting System 2 to check the factual details."
      },
      {
        questionText: "In the 1970s, Kahneman and Tversky began documenting \"anomalies\" in economic behavior. In this context, what is an \"anomaly\"?",
        options: [
          "A behavior that is completely random and cannot be predicted.",
          "A behavior that systematically violates the predictions of Classical Rational Choice Theory.",
          "A market crash caused by government intervention.",
          "A decision that results in a financial profit against the odds."
        ],
        correctAnswer: "A behavior that systematically violates the predictions of Classical Rational Choice Theory.",
        explanation: "An anomaly in economics is an empirical observation that contradicts the accepted model. Behavioral economics was built on cataloging how humans systematically deviate from Homo Economicus."
      },
      {
        questionText: "Classical economics assumes that money is \"fungible\"—that a dollar is exactly equal to any other dollar. Which of the following behaviors breaks this rule, paving the way for behavioral theories?",
        options: [
          "A person using a $100 bill to buy groceries.",
          "A person refusing to spend $1,000 from their \"vacation savings\" to fix their car, choosing instead to put the car repair on a high-interest credit card.",
          "A person investing $500 in the stock market and $500 in bonds.",
          "A person comparing the price of two identical pairs of shoes at different stores."
        ],
        correctAnswer: "A person refusing to spend $1,000 from their \"vacation savings\" to fix their car, choosing instead to put the car repair on a high-interest credit card.",
        explanation: "If money were purely fungible, the person would use the cash they have rather than take on high-interest debt. \"Mental accounting\" breaks the classical rule of fungibility."
      },
      {
        questionText: "Why did classical economists initially resist incorporating psychology into their economic models?",
        options: [
          "They believed human behavior was too unpredictable and that assuming strict rationality was the only mathematically elegant way to model markets at scale.",
          "They believed psychology was a pseudoscience with no data.",
          "They thought humans were actually less rational than psychologists claimed.",
          "They had already perfectly predicted every market crash in history."
        ],
        correctAnswer: "They believed human behavior was too unpredictable and that assuming strict rationality was the only mathematically elegant way to model markets at scale.",
        explanation: "Classical models rely on neat, mathematical equations. Injecting human emotion and cognitive errors makes the math messy and complex, leading economists to defend the simple \"rational\" model for decades."
      },
      {
        questionText: "Prospect Theory, which helped launch Behavioral Economics, fundamentally altered how we view human decision-making by proving that:",
        options: [
          "People always calculate the mathematical expected value of a gamble.",
          "People make decisions based on absolute wealth, not changes in wealth.",
          "People evaluate outcomes relative to a reference point, and treat gains differently than equivalent losses.",
          "People are entirely incapable of making financial decisions without computers."
        ],
        correctAnswer: "People evaluate outcomes relative to a reference point, and treat gains differently than equivalent losses.",
        explanation: "Unlike Expected Utility Theory (which looks at absolute wealth), Prospect Theory proved that people care about *changes* from a baseline (reference point) and that losses hurt more than gains feel good."
      },
      {
        questionText: "Which observation best summarizes the ultimate compromise between Classical and Behavioral Economics today?",
        options: [
          "Classical economics has been entirely abandoned in favor of psychology.",
          "Classical economics accurately describes how people *should* act to maximize wealth, while behavioral economics describes how they *actually* act.",
          "Behavioral economics only applies to poor people, while classical applies to the wealthy.",
          "Classical economics is only used for government policy, while behavioral is used for marketing."
        ],
        correctAnswer: "Classical economics accurately describes how people *should* act to maximize wealth, while behavioral economics describes how they *actually* act.",
        explanation: "Classical models remain highly useful as a baseline for rational optimization. Behavioral economics supplements this by providing a descriptive map of reality when humans deviate from that baseline."
      },
      {
        questionText: "Dan Ariely's famous phrase asserts that humans are \"Predictably Irrational.\" What is the most important word in that phrase for the field of behavioral economics?",
        options: [
          "Irrational, because it means markets are fundamentally broken.",
          "Predictably, because it implies cognitive biases are systematic, measurable, and can therefore be modeled and anticipated.",
          "Humans, because animals do not exhibit these traits.",
          "Predictably, because it means humans eventually learn to act like Homo Economicus."
        ],
        correctAnswer: "Predictably, because it implies cognitive biases are systematic, measurable, and can therefore be modeled and anticipated.",
        explanation: "If humans were randomly irrational, economics couldn't exist. Because our biases trigger in the exact same way under the exact same conditions, economists can build predictable models around them."
      },
      {
        questionText: "A cognitive bias is best defined as:",
        options: [
          "A temporary lapse in judgment caused by lack of sleep.",
          "A systematic error in thinking that occurs when people are processing and interpreting information.",
          "A conscious decision to sabotage one's own financial goals.",
          "An inability to perform basic arithmetic."
        ],
        correctAnswer: "A systematic error in thinking that occurs when people are processing and interpreting information.",
        explanation: "Biases are not random mistakes or signs of low intelligence; they are structural, systematic shortcuts (heuristics gone wrong) wired into human cognition."
      },
      {
        questionText: "Why do cognitive biases exist in the human brain from an evolutionary perspective?",
        options: [
          "They are defects caused by modern technology.",
          "They evolved as highly efficient mental shortcuts (heuristics) that kept early humans alive in environments where speed of decision was more critical than statistical accuracy.",
          "They were developed to prevent humans from accumulating too much wealth.",
          "They are exclusively a byproduct of reading written language."
        ],
        correctAnswer: "They evolved as highly efficient mental shortcuts (heuristics) that kept early humans alive in environments where speed of decision was more critical than statistical accuracy.",
        explanation: "Jumping to conclusions (like assuming a rustling bush is a predator) is a survival heuristic. In modern financial markets, this exact same evolutionary \"fast thinking\" becomes a cognitive bias."
      },
      {
        questionText: "A manager refuses to cancel a failing project because \"we have already spent two years and three million dollars on it.\" What specific cognitive trap is the manager falling into?",
        options: [
          "The Endowment Effect",
          "The Availability Heuristic",
          "The Sunk Cost Fallacy",
          "Bounded Rationality"
        ],
        correctAnswer: "The Sunk Cost Fallacy",
        explanation: "The manager is letting unrecoverable past costs dictate a future decision, violating rational choice which dictates only future costs and benefits should matter."
      },
      {
        questionText: "A doctor reads a study showing a new drug has a 5% failure rate and decides not to use it. The next day, a different rep tells the doctor the drug has a 95% success rate, and the doctor immediately orders it. What cognitive bias caused this shift?",
        options: [
          "The Framing Effect",
          "The Representativeness Heuristic",
          "The Sunk Cost Fallacy",
          "Present Bias"
        ],
        correctAnswer: "The Framing Effect",
        explanation: "The information is mathematically identical, but the way it is framed (loss vs. gain / failure vs. success) completely alters the human emotional and decision-making response."
      },
      {
        questionText: "The \"Rationality-Behavior Gap\" refers to:",
        options: [
          "The difference between how smart someone thinks they are and their actual IQ.",
          "The distance between what a perfectly logical economic model predicts a person will do, and what that person actually does in real life.",
          "The time it takes System 1 to hand control over to System 2.",
          "The gap in income between trained economists and the general public."
        ],
        correctAnswer: "The distance between what a perfectly logical economic model predicts a person will do, and what that person actually does in real life.",
        explanation: "This gap is the core study area of behavioral economics—measuring how and why real-world human behavior diverges from theoretical economic predictions."
      },
      {
        questionText: "In a perfectly rational economic model, a gym membership is purchased because the expected health utility outweighs the monetary cost. Why does the \"Rationality-Behavior Gap\" explain why gyms make most of their money?",
        options: [
          "Because gyms are monopolies.",
          "Because people rationally calculate that not going to the gym saves gas money.",
          "Because people buy memberships based on the 'ideal self' (intention), but fail to attend due to present bias and lack of willpower (behavior).",
          "Because people use the availability heuristic to assume they are already fit."
        ],
        correctAnswer: "Because people buy memberships based on the 'ideal self' (intention), but fail to attend due to present bias and lack of willpower (behavior).",
        explanation: "The gap exists between the rational plan (I will work out 5 days a week) and the behavioral reality (I want to sit on the couch today), which gyms monetize via unused memberships."
      },
      {
        questionText: "If an economist assumes that people will save perfectly for retirement because the compound interest math is undeniable, what element of the Rationality-Behavior Gap are they ignoring?",
        options: [
          "Perfect information access.",
          "Self-control problems and the human tendency to heavily discount future rewards in favor of immediate gratification.",
          "The fact that compound interest is a myth.",
          "The assumption of transitive preferences."
        ],
        correctAnswer: "Self-control problems and the human tendency to heavily discount future rewards in favor of immediate gratification.",
        explanation: "Rational models assume perfect self-control and forward-planning. Real humans struggle to deny their present self a reward for the sake of a future self decades away."
      },
      {
        questionText: "A tech company wants to reduce energy consumption in an office building. A classical economist suggests charging employees a small fine for leaving lights on. A behavioral economist suggests programming the lights to turn off automatically at 6 PM unless an employee presses a button to keep them on. Why is the behavioral solution likely more effective?",
        options: [
          "It eliminates the Rationality-Behavior gap by removing the decision-making burden entirely and leveraging the power of \"defaults.\"",
          "Fines are illegal in classical economics.",
          "It forces System 2 thinking onto the employees.",
          "It punishes people more severely than a fine."
        ],
        correctAnswer: "It eliminates the Rationality-Behavior gap by removing the decision-making burden entirely and leveraging the power of \"defaults.\"",
        explanation: "Instead of relying on humans to remember to act rationally (turn off the lights), it changes the choice architecture. People are lazy and will stick to the default option."
      },
      {
        questionText: "Ultimately, understanding the Rationality-Behavior Gap teaches us that to change human behavior effectively, we should:",
        options: [
          "Simply provide more data, spreadsheets, and facts until people understand the math.",
          "Assume people are hopelessly irrational and cannot be helped.",
          "Design systems, nudges, and environments that account for human laziness, emotion, and cognitive limits, rather than fighting them.",
          "Punish people financially every time they make a cognitive error."
        ],
        correctAnswer: "Design systems, nudges, and environments that account for human laziness, emotion, and cognitive limits, rather than fighting them.",
        explanation: "You cannot educate away human nature. Behavioral economics suggests changing the environment (choice architecture) to make the best choice the easiest choice for a boundedly rational brain."
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
    console.log(`Successfully updated \${questions.length} Quiz Questions for Day \${dayOrder}`);
  } else {
    console.log(`Quiz for Day \${dayOrder} not found!`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
