import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 29;
  const track = Track.BEHAVIORAL_ECONOMICS;
  console.log(`Starting update for Day \${dayOrder} (\${track})...`);

  // 1. UPDATE OR CREATE LESSON
  let lesson = await prisma.lesson.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  const lessonData = {
    title: 'Why People Reject Unfair Deals (Fairness as an Economic Variable)',
    tag: track,
    timeEstimate: 5,
    track: track,
    dayOrder: dayOrder,
    conceptText: `Classical economic theory rests on the assumption that humans are purely self-interested profit maximizers—a theoretical species known as Homo economicus. Under this logic, a person should accept any offer that leaves them even one cent better off than before, regardless of how much the other party receives. But real human beings do not operate like balance sheets. When presented with a proposal that feels exploitative or disrespectful, people frequently choose to punish the unfair actor, even if it costs them personally to do so.

In behavioral economics, this phenomenon is captured by fairness as an economic variable and inequity aversion. The standard laboratory tool used to demonstrate this is the Ultimatum Game. In this experiment, Player A is given a sum of money (e.g., $100) and must offer a division to Player B. If Player B accepts, both keep the split. If Player B rejects, neither gets anything.

Standard economics predicts Player A should offer $1 and Player B should accept, because $1 is strictly better than $0. In practice, offers below 30% are routinely rejected. Player B chooses $0 over an unequal outcome, willingly sacrificing a financial gain to enforce a social norm of fairness.

Imagine you are a rail worker in France. Your employer proposes a minor pay adjustment that increases your annual income, but simultaneously announces executive bonuses that dwarf your raise while cutting pension protections.

A traditional economist would argue you should accept the extra money—after all, a small gain is better than no gain. Yet you and your colleagues vote to strike, forfeiting daily wages during the walkout. By going on strike, workers are playing a real-world Ultimatum Game: they choose immediate financial loss to reject a deal that violates their collective sense of fairness and respect.`,
    conceptSummary: `Classical economics predicts that rational agents accept any deal offering a net positive gain, regardless of how unfair it is. Behavioral economics shows that people possess strong inequity aversion—valuing fairness, respect, and relative parity. As demonstrated by the Ultimatum Game, individuals regularly forfeit immediate financial gain to punish unfair offers and enforce social norms of equitable distribution.`,
    conceptTakeaways: [
      "Homo Economicus vs. Real Humans: Classical models assume people only maximize personal gain, whereas real people factor fairness and respect into their choices.",
      "The Ultimatum Game: A classic behavioral experiment proving that people regularly reject non-zero financial offers if the distribution feels unjust.",
      "Inequity Aversion: The psychological preference for equitable outcomes and the willingness to incur costs to prevent or punish unfairness.",
      "Relative vs. Absolute: People judge their well-being not just by absolute income, but by how their compensation compares to others in their reference group.",
      "Sacrificing for Principles: Rejecting an unfair deal is a costly signaling mechanism designed to protect against long-term exploitation."
    ],
    articleTitle: 'Fairness, Strikes, and the Real Ultimatum Game',
    articleText: `**Why do classical economic models fail to predict when workers will go on strike?**
For over a century, standard microeconomic models treated labor supply as a straightforward trade-off between wages and leisure time. Economists assumed that as long as wages remained positive and above market clearing levels, workers would remain on the job. Yet strikes continuously disrupt major economies, often over issues that cost workers far more in lost wages during the strike than they could ever regain in immediate pay hikes. Classical models fail because they view compensation strictly as an isolated transaction, ignoring the deeply rooted human sensitivity to relative standing, distributive justice, and perceived respect.

**What does the Ultimatum Game reveal about human psychology and economic choices?**
When behavioral economists like Richard Thaler and Ernst Fehr brought psychological reality to economic games, they proved that social preferences are as real as financial incentives. The Ultimatum Game demonstrated that human beings possess strong inequity aversion—a preference for equal or fair distributions over asymmetric ones. Standard economics predicts an offer of $1 out of $100 should be accepted, but in practice, low offers are routinely rejected. Rejecting a raw deal is not an irrational lapse in judgment; it is an active mechanism designed to deter social exploitation.

**How does the human brain biologically process an unfair economic offer?**
The rejection of unfair deals is not just a philosophical choice; it is deeply biological. Brain imaging studies conducted during these experiments show that receiving an unfair offer activates the anterior insula. This is the exact region of the brain associated with physical disgust and anger. When people are treated inequitably, their brains react in much the same way they would to spoiled food or a physical threat, proving that our demand for fairness is hardwired into our neurological responses.

**How does the preference for fairness manifest in French labor disputes?**
France has a long and distinct history of highly visible organized labor movements, where strikes in transportation, energy, and public service frequently stall the economy. While outside observers often view these walkouts through the lens of political ideology, behavioral economists view them as large-scale demonstrations of fairness enforcement. When French transport workers reject government reform packages that cut benefits or extend working years, they are not simply arguing over net income. They are reacting to relative disparities—comparing their sacrifices to corporate profits or executive perks. Workers willingly sacrifice weeks of income on strike to reject what they perceive as an unfair distribution of economic burdens.

**Why do firms and governments often miscalculate the true cost of imposing "unilateral" terms?**
Employers operating on pure classical assumptions often underestimate the psychological cost of perceived unfairness. When a firm attempts to impose wage freezes or benefit cuts unilaterally, it creates a sense of procedural and outcome injustice. In response, employee morale plummets, absenteeism rises, and unionized workforces mobilize for industrial action. The financial cost of a two-week strike—or the chronic drop in workplace productivity—is almost always vastly higher than the cost of granting a fair wage distribution in the first place. Fairness is not an intangible sentiment; it is a concrete variable that dictates operational stability.

**How can policymakers and business leaders design compensation structures that respect behavioral fairness?**
To prevent costly stalemates, modern institutions are increasingly designing workplace agreements with behavioral insights in mind. Transparency in pay structures, clear profit-sharing mechanisms, and collaborative bargaining processes signal procedural fairness, making hard choices easier to accept. When workers feel heard and see that economic burdens are shared proportionally across executives and frontline staff, willingness to cooperate increases. Recognizing that people care about dignity and relative parity as much as absolute pay transforms labor relations from a zero-sum conflict into a stable economic partnership.`,
    articleSummary: `Labor strikes, such as those frequently seen in France, challenge classical labor market models because workers willingly forfeit income to protest perceived unfairness. Inequity aversion and social comparison explain why employees view unequal distributions as an insult, triggering emotional and collective resistance. Organizations and governments that ignore fairness as a real economic variable often pay a far higher price in strikes and lost productivity than they would by offering equitable terms.`,
    articleTakeaways: [
      "Standard economic models struggle to explain strikes because they treat labor strictly as a function of wages versus leisure hours.",
      "Unfair economic offers trigger neural responses associated with disgust, driving emotional and collective opposition.",
      "French labor strikes serve as a real-world example of the Ultimatum Game, where workers sacrifice short-term wages to reject unfair policy terms.",
      "Employers who ignore procedural and distributive fairness face high hidden costs through strikes, low morale, and reduced productivity.",
      "Transparent pay structures and shared sacrifices during hard times significantly reduce labor friction by satisfying human fairness expectations."
    ]
  };

  if (lesson) {
    lesson = await prisma.lesson.update({
      where: { id: lesson.id },
      data: lessonData
    });
    console.log(`Successfully updated Lesson for Day \${dayOrder}: \${lesson.title}`);
  } else {
    lesson = await prisma.lesson.create({
      data: lessonData
    });
    console.log(`Successfully created Lesson for Day \${dayOrder}: \${lesson.title}`);
  }

  // 2. UPDATE OR CREATE QUIZ
  let quiz = await prisma.quiz.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  if (!quiz) {
    console.log(`Quiz for Day \${dayOrder} not found! Creating...`);
    quiz = await prisma.quiz.create({
      data: {
        track: track,
        dayOrder: dayOrder,
        title: "Quiz",
        tag: track,
        timeEstimate: 5
      }
    });
  }

  if (quiz) {
    // Delete existing questions
    await prisma.quizQuestion.deleteMany({
      where: { quizId: quiz.id }
    });

    const questions = [
      {
        questionText: "What does classical economic theory (Homo economicus) predict a rational person will do in the Ultimatum Game when offered $1 out of $100?",
        options: [
          "Accept the $1 because $1 is strictly better than $0",
          "Reject the $1 to punish the person making the offer",
          "Demand that the game be reset and restarted",
          "Flip a coin to make an unpredictable decision"
        ],
        correctAnswer: "Accept the $1 because $1 is strictly better than $0",
        explanation: "- A) Correct — classical economics assumes individuals are pure profit maximizers who will accept any non-zero offer.\\n- B) Wrong — rejecting to punish describes behavioral inequity aversion, not classical Homo economicus.\\n- C) Wrong — demanding a restart is not the classical prediction.\\n- D) Wrong — random chance is not predicted by strict utility maximization."
      },
      {
        questionText: "Which term describes the human tendency to prefer balanced outcomes and reject highly unequal distributions?",
        options: [
          "Exponential discounting",
          "Loss aversion",
          "Inequity aversion",
          "Moral hazard"
        ],
        correctAnswer: "Inequity aversion",
        explanation: "- A) Wrong — exponential discounting relates to how people value time, not fairness.\\n- B) Wrong — loss aversion means preferring avoiding losses over acquiring equivalent gains, not addressing distribution fairness.\\n- C) Correct — inequity aversion describes the preference for fairness and the willingness to reject unjust outcomes.\\n- D) Wrong — moral hazard refers to taking increased risks because someone else bears the cost."
      },
      {
        questionText: "In behavioral economics, why is fairness considered a true \"economic variable\"?",
        options: [
          "Because government agencies set standard fairness prices for goods",
          "Because fairness can be bought and sold on international stock exchanges",
          "Because fairness only applies when calculating annual inflation statistics",
          "Because people's perceptions of fairness directly alter economic choices, market outcomes, and financial stability"
        ],
        correctAnswer: "Because people's perceptions of fairness directly alter economic choices, market outcomes, and financial stability",
        explanation: "- A) Wrong — fairness isn't a government-mandated price point.\\n- B) Wrong — fairness is not a financial commodity traded on exchanges.\\n- C) Wrong — it is not limited to inflation statistics.\\n- D) Correct — perceptions of fairness influence strikes, productivity, and real-world resource allocation."
      },
      {
        questionText: "Brain imaging studies show that receiving an extremely unfair financial offer activates which neural region?",
        options: [
          "The visual cortex, processing color changes",
          "The anterior insula, linked to disgust and emotional distress",
          "The motor cortex, controlling hand gestures",
          "The auditory cortex, processing sound pitch"
        ],
        correctAnswer: "The anterior insula, linked to disgust and emotional distress",
        explanation: "- A) Wrong — the visual cortex processes visual stimuli.\\n- B) Correct — the anterior insula activates during experiences of both physical disgust and moral or economic unfairness.\\n- C) Wrong — the motor cortex is for physical movement.\\n- D) Wrong — the auditory cortex processes sound."
      },
      {
        questionText: "(Scenario) A factory owner offers workers a 1% pay raise, while simultaneously taking a 50% executive bonus during a profitable year. The workers vote to go on strike, forfeiting two weeks of income. What behavioral concept explains the workers' decision?",
        options: [
          "The workers are acting as pure income maximizers under standard economic rules",
          "The workers are experiencing cognitive overload from complex math",
          "The workers are applying inequity aversion and accepting a short-term loss to reject an unfair deal",
          "The workers are taking advantage of cheap arbitrage opportunities"
        ],
        correctAnswer: "The workers are applying inequity aversion and accepting a short-term loss to reject an unfair deal",
        explanation: "- A) Wrong — income maximizers would accept the 1% raise since it's a net gain.\\n- B) Wrong — cognitive overload isn't driving this collective action; perceived injustice is.\\n- C) Correct — they are playing a real-world Ultimatum Game, punishing an unfair offer despite personal cost.\\n- D) Wrong — arbitrage involves risk-free profit, which a strike is not."
      },
      {
        questionText: "(Scenario) A restaurant splits all customer tips equally among kitchen staff and waitstaff. Productivity rises and staff turnover drops significantly. Why did this policy succeed?",
        options: [
          "Shared rewards aligned with workers' expectations of fairness and collective effort",
          "Kitchen staff were forced to work longer hours by law",
          "The policy reduced the restaurant's total revenue",
          "Waitstaff earned zero income under the new setup"
        ],
        correctAnswer: "Shared rewards aligned with workers' expectations of fairness and collective effort",
        explanation: "- A) Correct — equitable distribution aligns with human preferences for fairness, boosting morale and cooperation.\\n- B) Wrong — the scenario doesn't mention legal mandates for longer hours.\\n- C) Wrong — higher productivity and lower turnover usually boost or protect revenue.\\n- D) Wrong — waitstaff still received tips, just shared equitably, not zero income."
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
    console.log(`Quiz for Day \${dayOrder} failed to create or load!`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
