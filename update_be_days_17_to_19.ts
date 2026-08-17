import { PrismaClient, Track } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const track = Track.BEHAVIORAL_ECONOMICS;
  const daysToUpdate = [17, 18, 19];

  console.log("Updating Days 17, 18, and 19 for Behavioral Economics...");

  await prisma.lesson.deleteMany({
    where: { track, dayOrder: { in: daysToUpdate } }
  });

  await prisma.quiz.deleteMany({
    where: { track, dayOrder: { in: daysToUpdate } }
  });

  // ================= DAY 17 =================
  const day17Data = {
    title: "Why Small Changes Feel Different Depending on the Situation",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 17,
    track: track,
    conceptText: `Imagine two bank notifications. The first says your balance has risen from €0 to €100. The second says it has risen from €10,000 to €10,100. Both changes are exactly €100, but the first usually feels much more important. The number is the same; the psychological distance is not.

This is diminishing sensitivity: as we move farther from a reference point, equal changes tend to feel smaller. The first few euros after zero can change what you are able to do. An additional €100 on top of a large amount may barely change your plans. In prospect theory, this appears as a value curve that becomes flatter as gains or losses grow.

The same pattern works with losses. A price increase from €5 to €10 feels dramatic because it doubles the price. An increase from €1,005 to €1,010 is also €5, yet it often receives much less attention. People respond to the size of a change relative to where they started, not only to its absolute amount.

Diminishing sensitivity is not the same as overestimating a tiny probability. Lotteries also use another behavioral pattern called probability weighting: a very small chance of a life-changing prize can feel more vivid than its mathematical probability deserves. The two effects work together. A €20 ticket feels small beside a €400,000 top prize, while the emotional difference between €400,000 and €400,020 is almost invisible.

That combination helps explain why one December lottery in Spain is treated less like an ordinary gamble and more like a national event.`,
    conceptSummary: `Diminishing sensitivity means equal changes feel smaller as they occur farther from a reference point. A €100 gain from zero feels larger than the same €100 added to €10,000. Lotteries add probability weighting: a tiny chance of a huge reward can receive more attention than its mathematical probability justifies. These are related but distinct behavioral effects.`,
    conceptTakeaways: [
      "Equal changes do not always feel equally important; the starting point matters.",
      "The value curve in prospect theory becomes flatter farther from the reference point.",
      "Diminishing sensitivity concerns the size of changes; probability weighting concerns how people treat small probabilities."
    ],
    articleTitle: "El Gordo: Spain's Christmas Lottery",
    articleText: `Why does Spain seem to pause on 22 December? That is the date of the Sorteo Extraordinario de Navidad, commonly called El Gordo. Families, offices, cafés, sports clubs, and groups of friends follow the long televised draw. The official lottery sells a €20 share called a décimo, and the first prize pays €400,000 per décimo. The event is old, public, and social, so buying a ticket is often described as joining a shared national ritual rather than making a private investment decision.

**Why does a €20 ticket feel so small beside the advertised prize?**
The comparison changes the meaning of the price. Twenty euros on its own may feel like a meal, several bus trips, or part of a utility bill. Put it next to €400,000, however, and it looks tiny. Diminishing sensitivity makes the visual and emotional gap between 0 and 20 feel less important once the mind is focused hundreds of thousands of euros away. The ticket price has not fallen, but its psychological scale has.

**Why do so many people share tickets instead of buying alone?**
A décimo can be divided informally among relatives, co-workers, and friends. Sharing reduces the immediate cost while preserving a connection to the huge prize. It also creates a powerful social fear: if everyone in the office buys a share and you refuse, you may imagine returning after Christmas as the only person who missed out. The decision therefore includes belonging, regret, and conversation, not just expected monetary value.

**Does the large number of prizes make the lottery a good investment?**
No lottery can return more money to players than it collects while also paying operating costs and public revenue. Spain’s official lottery states that 70 percent of the issue is allocated to prizes, which means the average euro spent is worth less than one euro in expected winnings. Yet expected value is not the only product being sold. Buyers may also be paying for anticipation, tradition, group participation, and a story about what they would do if their number appeared.

**What does diminishing sensitivity add to the explanation?**
It shows why absolute differences can be psychologically misleading. A person may carefully compare whether a coffee costs €2.50 or €3.50, then pay little attention to a €20 lottery purchase because the mind is occupied by a six-figure reward. The first euro of a gain matters more than the hundred-thousandth euro, but advertisements can reverse attention by making the distant total dominate the frame.

**What should an economist conclude from El Gordo?**
The millions of purchases do not prove that Spanish consumers cannot calculate. They show that people buy bundles of value: a financial chance, a social custom, entertainment, and protection against future regret. Good analysis separates those motives. It also asks whether the buyer understands the odds and can afford the ticket. Diminishing sensitivity explains the scale effect; probability weighting explains why a tiny chance can remain emotionally powerful.`,
    articleSummary: `Spain’s Christmas lottery sells €20 décimos with a €400,000 first prize per décimo and allocates 70 percent of the issue to prizes. People often share tickets with families and colleagues, turning the purchase into a social ritual. The price feels small beside the enormous prize, while tradition, anticipation, and fear of missing out add value beyond the expected financial return.`,
    articleTakeaways: [
      "El Gordo sells €20 décimos and offers a €400,000 first prize per décimo.",
      "Lottery purchases may provide social and entertainment value even when expected monetary value is negative."
    ]
  };

  await prisma.lesson.create({ data: day17Data });
  console.log("Created Lesson Day 17");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day17Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 17,
      track: track,
      questions: {
        create: [
          {
            questionText: "What is diminishing sensitivity?",
            options: [
              "The tendency for equal changes to feel smaller farther from a reference point",
              "The belief that every lottery ticket has the same expected profit",
              "The rule that prices must fall as income rises",
              "The tendency to forget all large numbers"
            ],
            correctAnswer: "The tendency for equal changes to feel smaller farther from a reference point",
            explanation: "Diminishing sensitivity is a psychological pattern describing how changes are perceived.",
            order: 0
          },
          {
            questionText: "Which comparison best demonstrates diminishing sensitivity?",
            options: [
              "€100 to €200 feels the same as €10,000 to €10,100",
              "A €100 gain feels larger when moving from €0 to €100 than from €10,000 to €10,100",
              "Every €100 gain feels larger than every €200 gain",
              "Only losses show diminishing sensitivity"
            ],
            correctAnswer: "A €100 gain feels larger when moving from €0 to €100 than from €10,000 to €10,100",
            explanation: "The psychological distance makes the €100 near zero feel more impactful.",
            order: 1
          },
          {
            questionText: "What is the price of one El Gordo décimo in the lesson?",
            options: [
              "€2",
              "€10",
              "€20",
              "€200"
            ],
            correctAnswer: "€20",
            explanation: "The official décimo share is €20.",
            order: 2
          },
          {
            questionText: "What is the first prize per décimo described in the article?",
            options: [
              "€40,000",
              "€100,000",
              "€200,000",
              "€400,000"
            ],
            correctAnswer: "€400,000",
            explanation: "The first prize pays €400,000 per €20 décimo.",
            order: 3
          },
          {
            questionText: "Why can €20 seem unusually small when El Gordo is advertised?",
            options: [
              "The ticket becomes legally free",
              "The mind compares it with a very large possible prize",
              "Inflation stops during December",
              "The lottery guarantees a refund"
            ],
            correctAnswer: "The mind compares it with a very large possible prize",
            explanation: "The contrast with €400,000 makes €20 seem small.",
            order: 4
          },
          {
            questionText: "Which concept is distinct from diminishing sensitivity but also helps explain lottery demand?",
            options: [
              "Comparative advantage",
              "Probability weighting",
              "Perfect competition",
              "Price ceilings"
            ],
            correctAnswer: "Probability weighting",
            explanation: "Probability weighting is treating tiny odds as more significant than they are mathematically.",
            order: 5
          },
          {
            questionText: "Why might co-workers divide a ticket among themselves?",
            options: [
              "Sharing lowers each person’s cost and creates group participation",
              "It mathematically guarantees the first prize",
              "Spanish law forbids individual ownership",
              "The official lottery doubles shared tickets"
            ],
            correctAnswer: "Sharing lowers each person’s cost and creates group participation",
            explanation: "Sharing is social and distributes cost, while creating a shared bond.",
            order: 6
          },
          {
            questionText: "The lottery allocates 70 percent of the issue to prizes. What follows?",
            options: [
              "The average euro spent returns more than one euro",
              "The expected monetary return is below the amount spent",
              "Every buyer has a 70 percent chance of winning",
              "Seventy percent of buyers receive the first prize"
            ],
            correctAnswer: "The expected monetary return is below the amount spent",
            explanation: "Since only 70% goes to prizes, on average buyers get back less than they put in.",
            order: 7
          },
          {
            questionText: "You are designing a financial advertisement. Which practice would be most misleading?",
            options: [
              "Showing both total cost and expected benefit clearly",
              "Comparing a small fee only with a huge possible reward while hiding probabilities",
              "Explaining that outcomes are uncertain",
              "Giving customers time to compare options"
            ],
            correctAnswer: "Comparing a small fee only with a huge possible reward while hiding probabilities",
            explanation: "This leverages diminishing sensitivity and probability weighting to deceive.",
            order: 8
          },
          {
            questionText: "What is the best overall lesson from El Gordo?",
            options: [
              "Everyone who buys a lottery ticket is irrational",
              "Only expected monetary value matters",
              "Financial choices can combine money, emotion, tradition, and social value",
              "Large prizes remove all economic trade-offs"
            ],
            correctAnswer: "Financial choices can combine money, emotion, tradition, and social value",
            explanation: "People buy a bundle of experiences, not just financial expected value.",
            order: 9
          }
        ]
      }
    }
  });

  // ================= DAY 18 =================
  const day18Data = {
    title: "How the Same Choice Can Feel Completely Different",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 18,
    track: track,
    conceptText: `A doctor says a treatment has a 90 percent survival rate. Another doctor describes the same treatment as having a 10 percent mortality rate. The statistics are identical, yet the first statement usually sounds safer. Nothing about the medical outcome changed. Only the frame did.

A framing effect occurs when people respond differently to equivalent information because it is presented in different ways. A choice can be described as a gain or a loss, a success rate or a failure rate, a discount or a surcharge. The wording directs attention toward one part of the same reality.

Defaults are a particularly powerful form of framing. An opt-in system says, “You are not included unless you actively join.” An opt-out system says, “You are included unless you actively leave.” Both preserve a formal choice, but they create different starting points. Doing nothing produces opposite outcomes.

Defaults work for several reasons. People postpone decisions, accept the current setting, assume the default has been recommended, or avoid the small effort of changing it. The effect is not proof that people do not care. It shows that the architecture around a decision influences whether intentions become actions.

Austria’s organ-donation system provides a serious real-world example. Under Austrian law, the starting point is presumed donation unless a person has objected. But the legal default is only one part of a medical system that also depends on hospitals, trained coordinators, clear records, and trust.`,
    conceptSummary: `Framing effects occur when equivalent information produces different reactions because it is presented differently. Defaults are a strong form of framing because they determine what happens when a person does nothing. Opt-in and opt-out systems can preserve formal freedom while producing very different participation rates through inertia, implied recommendations, and procrastination.`,
    conceptTakeaways: [
      "Equivalent facts can feel different when described as gains, losses, successes, or failures.",
      "A default determines the outcome produced by inaction."
    ],
    articleTitle: "Austria's Organ-Donation Default",
    articleText: `**What exactly is Austria’s organ-donation default?**
Austria follows what its official health portal calls the objection solution. A person may become a posthumous organ donor if the medical requirements are met and no objection was recorded or otherwise clearly expressed during life. Hospitals must check the national objection register before an organ removal. The rule changes the legal starting point: silence does not mean “not a donor”; it leaves donation possible.

**How is this different from an opt-in system?**
In an opt-in system, a person normally has to register agreement before donation can proceed. Failure to complete the form leaves the person outside the donor pool. In Austria’s opt-out system, the same failure to act leaves the person inside the possible donor pool. The ethical subject is identical, and the person still has a choice, but the consequence of inaction is reversed.

**Why can a default influence such an important decision?**
Most people do not wake up planning to complete administrative forms about their death. The decision is emotionally difficult, easy to postpone, and rarely urgent in daily life. A default converts postponement into an outcome. It may also signal what public institutions treat as normal. For some people, changing the setting feels like actively rejecting a social benefit, while leaving it alone feels passive.

**Does an opt-out law automatically produce more transplants?**
No. A default can influence participation, but organs become available only when strict medical conditions are met, death is properly determined, hospital teams identify a potential donor, records are checked, and transplant coordination works quickly. International comparisons are also affected by intensive-care capacity, public trust, family practice, and healthcare organization. Treating the law as the only cause would confuse a behavioral nudge with the entire system.

**What protects individual choice in Austria?**
A person can object, including by entering the objection register. Official guidance notes that other clearly documented expressions of refusal are also respected, while registration provides the strongest legal certainty because hospitals are required to check it. This matters ethically: a default is more defensible when people know it exists, can change it without unreasonable difficulty, and can trust that their decision will be followed.

**What is the wider economic lesson?**
Governments, schools, banks, and apps constantly choose defaults, even when they claim to be neutral. A form must either tick or untick a box; a pension plan must either enroll or not enroll a worker; a subscription must either renew or stop. The responsible question is not whether choice architecture exists. It is whether the chosen frame is transparent, easy to reverse, evidence-based, and aligned with the interests of the person making the choice.`,
    articleSummary: `Austria uses an opt-out organ-donation system: donation may proceed when medical requirements are satisfied, and no objection has been made. Hospitals must check the objection register. The default can turn inaction into possible participation, but it does not work alone. Medical capacity, coordination, records, public trust, and accessible ways to object remain essential.`,
    articleTakeaways: [
      "Austria uses an objection solution rather than requiring people to opt in.",
      "Hospitals must check the objection register before organ removal.",
      "Ethical defaults should be transparent, easy to change, and supported by a functioning system."
    ]
  };

  await prisma.lesson.create({ data: day18Data });
  console.log("Created Lesson Day 18");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day18Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 18,
      track: track,
      questions: {
        create: [
          {
            questionText: "Which pair is mathematically equivalent but differently framed?",
            options: [
              "90 percent survival and 10 percent mortality",
              "90 percent survival and 20 percent mortality",
              "A €10 discount and a €20 surcharge",
              "One donor and ten recipients"
            ],
            correctAnswer: "90 percent survival and 10 percent mortality",
            explanation: "Both represent the exact same outcomes, simply framed around success vs. failure.",
            order: 0
          },
          {
            questionText: "What is a framing effect?",
            options: [
              "A reaction that changes when equivalent information is presented differently",
              "A law requiring every citizen to choose the same option",
              "A calculation error caused only by low education",
              "A guarantee that defaults always improve welfare"
            ],
            correctAnswer: "A reaction that changes when equivalent information is presented differently",
            explanation: "The way information is framed shifts attention without changing the underlying facts.",
            order: 1
          },
          {
            questionText: "Under Austria’s objection solution, what does inaction generally do?",
            options: [
              "It automatically records a refusal",
              "It leaves donation possible if legal and medical requirements are met",
              "It guarantees that organs will be removed",
              "It transfers the decision to an employer"
            ],
            correctAnswer: "It leaves donation possible if legal and medical requirements are met",
            explanation: "Inaction means no objection is recorded, so donation remains possible.",
            order: 2
          },
          {
            questionText: "What must Austrian hospitals check before organ removal?",
            options: [
              "A shopping history",
              "The objection register",
              "A pension account",
              "A lottery number"
            ],
            correctAnswer: "The objection register",
            explanation: "Hospitals check the register to verify if the person recorded an objection.",
            order: 3
          },
          {
            questionText: "Why can defaults be powerful?",
            options: [
              "They make every option financially equal",
              "People often accept current settings or postpone action",
              "They remove all ethical questions",
              "They eliminate the need for information"
            ],
            correctAnswer: "People often accept current settings or postpone action",
            explanation: "Defaults harness inertia and procrastination.",
            order: 4
          },
          {
            questionText: "Which statement about opt-out laws is most accurate?",
            options: [
              "They alone determine transplant rates",
              "They can influence participation but require medical infrastructure and trust",
              "They make objection impossible",
              "They are identical to compulsory donation"
            ],
            correctAnswer: "They can influence participation but require medical infrastructure and trust",
            explanation: "A default needs a functioning system and trust to be effective and ethical.",
            order: 5
          },
          {
            questionText: "You design a school meal plan. Which is a default?",
            options: [
              "Students hear a lecture about nutrition",
              "Students receive the standard meal unless they select another option",
              "The cafeteria publishes all prices",
              "A teacher asks students what they ate yesterday"
            ],
            correctAnswer: "Students receive the standard meal unless they select another option",
            explanation: "The default is what happens when no action is taken.",
            order: 6
          },
          {
            questionText: "Which feature makes a default more ethically defensible?",
            options: [
              "Hiding it in small print",
              "Making it costly to change",
              "Explaining it clearly and allowing easy reversal",
              "Preventing people from learning alternatives"
            ],
            correctAnswer: "Explaining it clearly and allowing easy reversal",
            explanation: "A good choice architecture preserves autonomy and transparency.",
            order: 7
          },
          {
            questionText: "Why is “opt-out equals automatic success” a weak conclusion?",
            options: [
              "Because all defaults fail",
              "Because outcomes also depend on institutions, capacity, and implementation",
              "Because organ donation has no medical requirements",
              "Because people never follow defaults"
            ],
            correctAnswer: "Because outcomes also depend on institutions, capacity, and implementation",
            explanation: "The default alone is not enough to guarantee success; the supporting system matters.",
            order: 8
          },
          {
            questionText: "What question should a choice architect ask first?",
            options: [
              "How can we make the default impossible to change?",
              "What outcome will happen when people do nothing, and is that transparent?",
              "How can we remove every option except one?",
              "How can we avoid explaining the policy?"
            ],
            correctAnswer: "What outcome will happen when people do nothing, and is that transparent?",
            explanation: "A responsible choice architect considers the consequence of inaction and ensures transparency.",
            order: 9
          }
        ]
      }
    }
  });

  // ================= DAY 19 =================
  const day19Data = {
    title: "Why We Take Different Risks with Gains and Losses",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 19,
    track: track,
    conceptText: `Choose between two gains. Option A gives you $500 for certain. Option B gives you a 50 percent chance of $1,000 and a 50 percent chance of nothing. Many people choose the certain $500, even though both options have the same expected monetary value.

Now reverse the signs. Option A makes you lose $500 for certain. Option B gives you a 50 percent chance of losing $1,000 and a 50 percent chance of losing nothing. Many people now choose the gamble. They reject risk when protecting a gain but accept risk when trying to escape a loss.

Prospect theory calls this risk-attitude reversal. In the gain domain, people are often risk-averse: a smaller certain benefit feels safer than a gamble. In the loss domain, they may become risk-seeking: a chance of avoiding the loss feels attractive, even when the gamble could make the loss larger.

This does not mean everyone always behaves this way. Stakes, wealth, experience, probabilities, and emotions matter. The pattern is a tendency, not a law. It becomes dangerous when a person treats “getting back to zero” as the only acceptable outcome and keeps taking risks to avoid admitting a loss.

South Korea’s combination of widespread consumer credit and visible gambling markets provides a useful setting for understanding how a reference point can turn a cautious person into a risk-taker.`,
    conceptSummary: `Risk-attitude reversal means people often prefer certainty when choosing among gains but become more willing to gamble when choosing among losses. A chance to avoid a sure loss can feel attractive even when it creates a worse possible outcome. The pattern is especially dangerous when “breaking even” becomes a rigid reference point.`,
    conceptTakeaways: [
      "People are often risk-averse with gains and risk-seeking with losses.",
      "The desire to return to a reference point can cause loss chasing."
    ],
    articleTitle: "Household Debt and Loss Chasing in South Korea",
    articleText: `**How can people who hate losses take enormous risks?**
Loss aversion and risk-seeking are not opposites. A person can hate a loss so strongly that they become willing to gamble to erase it. Imagine owing 1 million won by Friday. A guaranteed repayment plan feels like accepting defeat. A risky bet offers a little possibility of returning to zero immediately. The pain of the sure loss can make the gamble feel emotionally preferable, even if it increases expected harm.

**Why does household debt matter in South Korea?**
Bank of Korea data showed total household credit of 1,952.8 trillion won at the end of June 2025, including 1,832.6 trillion won in household loans. That number does not mean borrowers are gamblers, and most credit supports ordinary housing and consumption. It does show that many households make decisions while already below a personal reference point: they owe money and want to restore their balance sheets.

**What happens when “breaking even” becomes the goal?**
Suppose a person has lost 200,000 won. Walking away fixes the loss at 200,000. Continuing creates a chance of recovery but also a chance of losing more. The reference point remains the original balance, so stopping feels like converting a temporary setback into a permanent failure. This is the logic behind chasing losses. Each new decision is judged against the old starting point rather than the person’s current resources.

**How can consumer debt produce a similar pattern?**
A borrower facing overdue payments may reject a modest restructuring plan because it confirms several months of repayment. A new high-cost loan promises immediate relief and postpones the visible loss. The new loan can feel like rescue today even when it raises future obligations. Present bias contributes, but risk-attitude reversal adds something specific: the borrower may accept a more uncertain and potentially worse outcome to avoid a sure short-term loss.

**What separates calculated risk from loss-driven risk?**
A calculated risk begins with current facts, affordable limits, and a plan for the bad outcome. Loss-driven risk begins with the sentence, “I must get back what I lost.” Warning signs include increasing the stake after a loss, borrowing to continue, hiding the decision, and treating a low-probability escape as if it were a plan. The issue is not that all risk is irrational. Businesses and households need risk. The issue is whether the decision is evaluated from today’s position or from an unreachable past balance.

**What can institutions do?**
Lenders can display total repayment clearly, offer restructuring before repeated refinancing, and test whether borrowers can absorb the downside. Gambling services can use deposit limits, cooling-off periods, self-exclusion tools, and prominent loss information. Regulators can monitor designs that make continued play or borrowing frictionless. These measures do not eliminate choice. They create a pause between the pain of a loss and the next risky action.`,
    articleSummary: `South Korea’s large household-credit market illustrates how many decisions occur in the loss domain. Debt does not imply gambling, but borrowers and gamblers can share a psychological trap: accepting greater risk to avoid recognizing a current loss. Clear limits, restructuring, cooling-off periods, and decisions based on today’s position can reduce escalation.`,
    articleTakeaways: [
      "South Korean household credit reached 1,952.8 trillion won at the end of June 2025.",
      "Debt and gambling are not the same, but both can place decisions in a perceived loss domain.",
      "A pause, an affordable downside limit, and evaluation from today’s position improve risk decisions."
    ]
  };

  await prisma.lesson.create({ data: day19Data });
  console.log("Created Lesson Day 19");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day19Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 19,
      track: track,
      questions: {
        create: [
          {
            questionText: "Which choice pattern is typical in prospect theory?",
            options: [
              "Gambling with gains and choosing certainty with losses",
              "Choosing certainty with gains and gambling to avoid losses",
              "Always choosing the highest expected value",
              "Avoiding every form of risk"
            ],
            correctAnswer: "Choosing certainty with gains and gambling to avoid losses",
            explanation: "People tend to be risk-averse with gains but risk-seeking when trying to escape losses.",
            order: 0
          },
          {
            questionText: "Why might a sure loss make a gamble attractive?",
            options: [
              "The gamble guarantees profit",
              "It offers a chance to avoid recognizing the loss",
              "Losses become mathematically positive",
              "The probability of winning automatically rises after a loss"
            ],
            correctAnswer: "It offers a chance to avoid recognizing the loss",
            explanation: "A gamble offers a psychological hope of returning to 'zero' without admitting defeat.",
            order: 1
          },
          {
            questionText: "What was South Korea’s total household credit at the end of June 2025 in the article?",
            options: [
              "195.28 trillion won",
              "952.8 trillion won",
              "1,952.8 trillion won",
              "19,528 trillion won"
            ],
            correctAnswer: "1,952.8 trillion won",
            explanation: "The article specifies 1,952.8 trillion won.",
            order: 2
          },
          {
            questionText: "Which statement avoids a harmful stereotype?",
            options: [
              "Every borrower is a gambler",
              "Most debt is created by irrational people",
              "Debt and gambling can share a bias without being the same behavior",
              "Anyone with a loan is risk-seeking"
            ],
            correctAnswer: "Debt and gambling can share a bias without being the same behavior",
            explanation: "Borrowing has normal economic purposes but can place people in similar psychological loss domains.",
            order: 3
          },
          {
            questionText: "What does “chasing losses” mean?",
            options: [
              "Stopping after reaching a limit",
              "Increasing risk in an attempt to recover previous losses",
              "Diversifying a long-term portfolio",
              "Paying a debt according to a fixed plan"
            ],
            correctAnswer: "Increasing risk in an attempt to recover previous losses",
            explanation: "It involves taking on more risk just to return to the original reference point.",
            order: 4
          },
          {
            questionText: "Which is a sign of calculated risk?",
            options: [
              "No plan for the bad outcome",
              "Borrowing secretly to increase the stake",
              "An affordable downside limit set before acting",
              "A belief that breaking even is guaranteed"
            ],
            correctAnswer: "An affordable downside limit set before acting",
            explanation: "A calculated risk involves understanding and accepting the potential downside.",
            order: 5
          },
          {
            questionText: "A borrower rejects a manageable repayment plan and takes a costly new loan hoping for immediate rescue. Which concept fits best?",
            options: [
              "Risk-attitude reversal in the loss domain",
              "Comparative advantage",
              "Supply elasticity",
              "Public goods"
            ],
            correctAnswer: "Risk-attitude reversal in the loss domain",
            explanation: "The borrower is taking a riskier path to avoid accepting the sure loss of the payment plan.",
            order: 6
          },
          {
            questionText: "Which tool can reduce impulsive escalation after a loss?",
            options: [
              "A cooling-off period",
              "Instant unlimited credit",
              "Hidden total costs",
              "Removing account statements"
            ],
            correctAnswer: "A cooling-off period",
            explanation: "A pause interrupts the emotional drive to immediately chase the loss.",
            order: 7
          },
          {
            questionText: "You advise a gambling platform. Which design is most responsible?",
            options: [
              "Raise deposit limits after every loss",
              "Offer self-exclusion and pre-set deposit limits",
              "Describe losses as temporary wins",
              "Make account closure intentionally difficult"
            ],
            correctAnswer: "Offer self-exclusion and pre-set deposit limits",
            explanation: "These tools help users commit to a limit before they are in the heat of chasing a loss.",
            order: 8
          },
          {
            questionText: "What question helps someone escape a “break-even” trap?",
            options: [
              "How much did I once have?",
              "What is the best choice from my current position?",
              "How can I double the next stake?",
              "How can I hide the loss?"
            ],
            correctAnswer: "What is the best choice from my current position?",
            explanation: "Evaluating from the current position removes the unrealistic past reference point.",
            order: 9
          }
        ]
      }
    }
  });

  console.log("Finished updating Days 17, 18, and 19.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
