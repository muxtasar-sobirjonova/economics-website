import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 19;
  const tag = "Week 4"; // Or whichever week, we'll leave it as is or default

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Offer someone a guaranteed $500, or a coin flip for $1,000, and most people take the sure $500 — even though both options are worth the same on average. Now offer the same person a guaranteed loss of $500, or a coin flip where they either lose $1,000 or lose nothing. Suddenly, most people gamble, choosing the coin flip over the certain loss — even though, again, both options carry the same expected value.</p>

<p>This reversal is the core of <strong>risk-attitude reversal</strong>, a finding from Kahneman and Tversky's prospect theory: people are generally risk-averse when facing gains, preferring a smaller certain win over a larger uncertain one, but risk-seeking when facing losses, preferring a larger uncertain loss over a smaller certain one.</p>

<p>The pattern makes sense once you remember that losses are felt more intensely than equivalent gains. A certain loss is a guaranteed hit to that heightened pain. A gamble, even a bad one, offers a chance — however small — of avoiding the loss altogether, and that chance feels worth chasing even when the math says it shouldn't be.</p>

<p>This exact reversal explains a pattern researchers and regulators have watched play out for years in South Korea, where gambling behavior and consumer debt decisions reveal two very different risk appetites in the same population — sometimes in the same person.</p>`;

  const conceptSummary = `Risk-attitude reversal describes how people become risk-averse when facing gains (preferring a certain smaller win) but risk-seeking when facing losses (preferring a risky chance over a certain loss), even when the expected values are identical. This asymmetry, from Kahneman and Tversky's prospect theory, exists because a certain loss guarantees the intensified pain of losing, while a gamble offers a chance — however small — of escaping that pain entirely.`;

  const conceptTakeaways = [
    "Risk-attitude reversal means people tend to avoid risk when facing gains but seek risk when facing losses.",
    "Given a choice between a certain $500 gain and a 50% chance at $1,000, most people choose the certain gain.",
    "Given a choice between a certain $500 loss and a 50% chance of losing $1,000, most people choose the gamble instead.",
    "Both pairs of options carry identical expected value, yet people's risk preference flips depending on the gain/loss framing.",
    "This reversal exists partly because a certain loss guarantees the intensified pain that loss aversion predicts, while a gamble offers a chance of avoiding it."
  ];

  const articleTitle = "Why Gambling and Consumer Debt Reveal Different Risk Choices (South Korea)";
  
  const articleText = `<p>Kangwon Land is the only casino in South Korea where Korean citizens are legally allowed to gamble — and it's surrounded by pawn shops, not hotels. <strong>What does that say about the risk behavior happening inside?</strong><br>
It tells you that the people walking in aren't chasing modest, cautious wins. Kangwon Land, opened in the early 2000s in Gangwon Province, became notorious for a specific pattern: gamblers who've already lost significant money returning again and again, chasing bigger and riskier bets rather than cutting their losses. The pawn shops nearby exist because so many visitors arrive needing quick cash for one more attempt to recover what they already lost.</p>

<p><strong>Why does Korean law ban citizens from every other casino in the country, but allow them into this one specific location?</strong><br>
South Korea permits foreign-only casinos throughout the country to attract international tourism, while restricting citizens to a single facility, Kangwon Land, originally built partly to revitalize a struggling former coal-mining region. The restriction reflects government concern over gambling's effect on domestic households — a concern the casino's own surrounding economy of pawnshops and short-term lenders has done little to ease.</p>

<p><strong>Why do gamblers who are already deep in debt often place bigger, riskier bets rather than walking away?</strong><br>
Because walking away means accepting a certain, painful loss right now. A bigger, riskier bet offers a chance — even a poor one — of erasing that loss entirely. This is risk-attitude reversal in its starkest form: when people are already behind, the safe, "rational" choice (accept the loss and stop) feels worse in the moment than a long-shot gamble that might undo the damage completely.</p>

<p><strong>How does the same population that gambles recklessly to escape losses often behave far more cautiously when it comes to everyday savings and investment gains?</strong><br>
South Korean households have also shown a strong preference for safe savings instruments over risky investments when their finances are in a stable, gain-oriented position — a preference researchers have linked to the country's historically high household savings rates. The same person who might chase a reckless bet to escape a casino loss can behave with textbook caution when protecting money they've already secured. The risk appetite isn't a personality trait. It flips based on whether the frame is a gain or a loss.</p>

<p><strong>Is this contradiction a sign of irrational Korean gamblers, or a predictable pattern found everywhere prospect theory has been tested?</strong><br>
The latter. Kahneman and Tversky's original experiments, run on ordinary people making small hypothetical bets, produced the identical reversal decades before Kangwon Land existed. What looks like a uniquely Korean gambling crisis is really a vivid, high-stakes illustration of a universal pattern: risk-seeking in the domain of losses, risk-averse in the domain of gains.</p>

<p><strong>What would have to change about a losing gambler's situation to make them choose the safer, certain option instead of the riskier bet?</strong><br>
The loss would need to stop feeling like an open wound and start feeling like a closed, accepted fact — which is precisely why financial counselors working with problem gamblers often focus on getting a person to formally acknowledge and "bank" a loss as final, removing the psychological chance of reversal that keeps drawing them back to the table for one more bet.</p>`;

  const articleSummary = `South Korea restricts citizens to a single domestic casino, Kangwon Land, notorious for gamblers chasing bigger bets to escape existing losses, surrounded by pawn shops rather than hotels. The same population shows strong caution and high savings rates when protecting money they already have. This isn't a contradiction — it's risk-attitude reversal, the same pattern Kahneman and Tversky documented in ordinary hypothetical bets, playing out at real financial stakes.`;

  const articleTakeaways = [
    "Kangwon Land is the only casino South Korean citizens can legally enter, and it is known for gamblers chasing losses with increasingly risky bets.",
    "The area around the casino is dense with pawn shops, reflecting gamblers seeking quick cash to keep betting after losses.",
    "South Korean households have simultaneously shown strong preferences for safe savings over risky investment when their finances are stable.",
    "This contrast reflects risk-attitude reversal: risk-seeking to escape losses, risk-averse to protect gains — not a national personality trait.",
    "Financial counselors often help problem gamblers by getting them to formally \"accept\" a loss as final, removing the psychological pull toward one more risky bet."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Why We Take Different Risks With Gains and Losses",
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
        questionText: "What is risk-attitude reversal?",
        options: [
          "The tendency to always prefer risk over certainty",
          "The tendency to be risk-averse for gains but risk-seeking for losses, even when expected values are identical",
          "A rule stating all financial decisions must be equally risky",
          "The tendency for risk preferences to never change regardless of framing"
        ],
        correctAnswer: "The tendency to be risk-averse for gains but risk-seeking for losses, even when expected values are identical",
        explanation: "Risk-attitude reversal describes how humans switch from playing it safe when they are ahead, to gambling when they are behind."
      },
      {
        questionText: "Why might a person facing a certain loss choose a risky gamble instead, even if the gamble has a worse expected value?",
        options: [
          "Because gambles always have better expected value than certain outcomes",
          "Because a certain loss guarantees the intensified pain loss aversion predicts, while the gamble offers a chance, however small, of avoiding that pain entirely",
          "Because people facing losses become more rational, not less",
          "Because certain losses are illegal in most contexts"
        ],
        correctAnswer: "Because a certain loss guarantees the intensified pain loss aversion predicts, while the gamble offers a chance, however small, of avoiding that pain entirely",
        explanation: "The desire to escape the immediate, intense pain of a certain loss drives people toward risky options."
      },
      {
        questionText: "Based on the Kangwon Land case, why is a gambler's decision to place a bigger bet after already losing money not simply \"irrational\"?",
        options: [
          "Because it isn't a real pattern and doesn't actually occur",
          "Because it reflects a well-documented, predictable reversal in risk attitude when someone is in the \"loss\" domain rather than the \"gain\" domain",
          "Because casinos guarantee gamblers will eventually win back their losses",
          "Because gamblers at Kangwon Land have better odds than gamblers elsewhere"
        ],
        correctAnswer: "Because it reflects a well-documented, predictable reversal in risk attitude when someone is in the \"loss\" domain rather than the \"gain\" domain",
        explanation: "Chasing losses is a manifestation of prospect theory in the real world: people become risk-seeking precisely when they are in the loss domain."
      },
      {
        questionText: "Why might the same population show risk-seeking behavior in a casino but risk-averse behavior in everyday savings decisions?",
        options: [
          "Because these are two entirely separate, unrelated personality traits",
          "Because risk preference depends on whether a person is in a gain frame or a loss frame, not on a fixed personal disposition",
          "Because casinos are illegal for savings decisions",
          "Because savings accounts always offer higher returns than casinos"
        ],
        correctAnswer: "Because risk preference depends on whether a person is in a gain frame or a loss frame, not on a fixed personal disposition",
        explanation: "Risk tolerance is not static; it changes dramatically depending on whether people feel they are securing gains or fighting off losses."
      },
      {
        questionText: "A financial counselor is working with a client who lost $2,000 gambling and wants to bet $2,000 more to \"win it all back\" in one large risky wager. Based on risk-attitude reversal, what is the most effective first step to shift the client's decision-making?",
        options: [
          "Encourage the client to place an even larger bet to resolve the situation faster",
          "Help the client formally accept the $2,000 loss as final, removing the psychological \"open loss\" that's driving the reversal toward risk-seeking behavior",
          "Explain that gambling odds are always fair, so the bet is reasonable",
          "Avoid discussing the loss at all and change the subject"
        ],
        correctAnswer: "Help the client formally accept the $2,000 loss as final, removing the psychological \"open loss\" that's driving the reversal toward risk-seeking behavior",
        explanation: "By mentally \"closing\" the loss account, the person is no longer in a loss frame chasing a recovery, which can help reset their risk preferences."
      },
      {
        questionText: "An investor holds a stock that has already dropped 30% from its purchase price. Based on risk-attitude reversal, which behavior is this investor statistically more likely to exhibit compared to an investor sitting on a 30% gain?",
        options: [
          "Selling immediately to lock in a small, certain loss",
          "Holding on or even adding to the position, hoping for a risky recovery, rather than accepting the certain loss by selling",
          "Behaving identically to an investor with a 30% gain",
          "Reporting no emotional reaction to the loss at all"
        ],
        correctAnswer: "Holding on or even adding to the position, hoping for a risky recovery, rather than accepting the certain loss by selling",
        explanation: "This is known as the disposition effect—investors hate realizing losses, so they riskily hold onto losing stocks, but they quickly sell winning stocks to lock in gains."
      },
      {
        questionText: "A company offers laid-off employees two severance options: (a) a guaranteed $10,000 payout, or (b) a 50% chance at $22,000 and a 50% chance at $0. Based on the reflection effect in prospect theory, how would employees framing this as a \"loss\" of their job likely respond, compared to an equivalent scenario framed purely as a bonus opportunity?",
        options: [
          "They are more likely to gamble on option (b) in the loss-framed scenario than they would be in an equivalent gain-framed scenario",
          "Employees will always choose the guaranteed option regardless of framing",
          "Framing has no effect on severance decisions",
          "Employees will always choose the riskier option regardless of framing"
        ],
        correctAnswer: "They are more likely to gamble on option (b) in the loss-framed scenario than they would be in an equivalent gain-framed scenario",
        explanation: "When framing situations as a loss, people demonstrate risk-seeking behavior that they would avoid in gain scenarios."
      },
      {
        questionText: "Why might South Korea's restriction of legal gambling to a single domestic casino fail to fully prevent the risk-seeking behavior described in this lesson?",
        options: [
          "Because the restriction eliminates all forms of risk-seeking behavior entirely",
          "Because risk-attitude reversal is driven by psychological framing (gain vs. loss), not by the availability of casinos alone, so the underlying behavior can persist wherever a loss-framed decision exists",
          "Because the restriction has increased gambling nationwide",
          "Because Kangwon Land has better odds than illegal alternatives"
        ],
        correctAnswer: "Because risk-attitude reversal is driven by psychological framing (gain vs. loss), not by the availability of casinos alone, so the underlying behavior can persist wherever a loss-framed decision exists",
        explanation: "The psychological bias of chasing losses occurs across many domains (finance, real estate, everyday life), not just inside casinos."
      },
      {
        questionText: "A gambler wins $500 early in a session and is then offered a choice: walk away with the guaranteed $500, or risk it on a bet that could turn it into $1,000 or $0. Based on the reflection effect, what is this gambler most likely to do, compared to how they'd behave if they'd already lost $500 and faced an equivalent bet to recover it?",
        options: [
          "Take the same risk-seeking approach in both situations",
          "Be more likely to take the certain $500 in the gain frame, but more likely to gamble in the equivalent loss frame",
          "Always gamble regardless of whether they're up or down",
          "Always walk away regardless of whether they're up or down"
        ],
        correctAnswer: "Be more likely to take the certain $500 in the gain frame, but more likely to gamble in the equivalent loss frame",
        explanation: "The gambler will lock in the certain win (risk aversion in gains) but chase the loss if they were down (risk seeking in losses)."
      },
      {
        questionText: "Based on risk-attitude reversal, which policy is most likely to reduce reckless \"chasing losses\" behavior among problem gamblers?",
        options: [
          "Allowing unlimited bet sizes so gamblers can recover losses faster",
          "Implementing mandatory loss limits or cooling-off periods that force a loss to be \"closed\" rather than left open for continued risky chasing",
          "Removing all information about gambling odds from casinos",
          "Encouraging gamblers to increase bets after every loss"
        ],
        correctAnswer: "Implementing mandatory loss limits or cooling-off periods that force a loss to be \"closed\" rather than left open for continued risky chasing",
        explanation: "By forcefully pausing the action, cooling-off periods break the immediate spiral of loss-chasing before it escalates further."
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
