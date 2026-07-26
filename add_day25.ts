import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 25;
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
        title: 'How We Use Rules to Control Ourselves',
        conceptText: `A woman in a market town called Bumala pays her bank to make her own money harder to reach. She earns no interest on it. Every time she withdraws, a fee is taken out. And still, she keeps coming back, year after year. She has not misunderstood the deal. She has simply met her tomorrow self, and she does not trust him with cash.

Classical economics assumes that more choice is always better — give a person more freedom, and they will use it wisely. Homer disagreed three thousand years earlier. Ulysses wanted to hear the Sirens sing and still survive the voyage, so he ordered his own crew to chain him to the mast and plug their ears with wax, knowing that the man who would beg to be released once the singing started was not a man whose orders deserved obedience. He gave the command before temptation arrived, because he trusted only the version of himself who hadn't yet heard the song.

*A locked door keeps two things out: thieves, and yourself.*

That is a commitment device — a rule a person builds today specifically to bind the choices of a weaker, more tempted self tomorrow. Economist Thomas Schelling called this "the strategy of self-command": recognizing that you are not one continuous, rational actor, but a negotiation between the version of you making the plan and the version who will later be tempted to break it. The article ahead follows that same bet into a small Kenyan trading town, where a bank offering nothing but restriction somehow made its customers richer.`,
        conceptSummary: `A commitment device is a rule someone builds today to control a weaker version of themselves tomorrow — like Ulysses ordering his crew to chain him to the mast before the Sirens sang, trusting only the self who hadn't yet heard the song. Economist Thomas Schelling called this self-command: treating yourself not as one steady, rational actor, but as two selves negotiating across time.`,
        conceptTakeaways: [
          "A commitment device is a rule you build today to bind a weaker version of yourself tomorrow — a form of self-command, not a punishment.",
          "Ulysses ordering his crew to bind him to the mast before the Sirens sang is one of the oldest recorded commitment devices in Western storytelling.",
          "Economist Thomas Schelling called this 'the strategy of self-command'—negotiating between your planning self and your tempted self."
        ],
        articleTitle: 'The Lock That Pays for Itself',
        articleText: `Bumala is not a large town. A dirt road runs past a produce market where women sell maize, tomatoes, and secondhand clothes from mats spread across the ground, while bicycle-taxi drivers wait under a tree for their next fare. In 2005, two young economists, Pascaline Dupas and Jonathan Robinson, arrived and offered the market women something strange: a savings account that paid zero interest and charged a fee every single time they touched their own money.

By any textbook measure, it was a bad deal. A rational customer should have declined and kept the cash at home, free of charge, earning exactly the same nothing. Instead, hundreds of women said yes — and then kept using the account for years.

*A locked door keeps two things out: thieves, and yourself.*

The researchers had counted more than 800 female vendors working the stalls around Bumala. A random share of them were offered the account; the rest were not. What followed became one of the most cited studies in development economics. The women who got access to the account didn't just park money there out of curiosity. They saved more overall, invested more in their stalls and stock, and spent more on their households — all while earning nothing extra for the privilege. Dupas and Robinson's explanation was almost embarrassingly simple: cash that sits visibly in a woman's hand is cash a husband, a relative, or a neighbor can ask to borrow, and it is hard to refuse family. Cash locked behind a fee and a walk to the bank is easier to protect, even from the person holding it.

Bicycle-taxi drivers, almost all of them men, were offered the identical account. They barely touched it. Their savings didn't move. Same lock, same fee, same town — and no effect at all. The tool wasn't universally useful. It was useful specifically for the people who most needed protection from claims on their own cash, including, at times, claims from themselves.

Twenty years later, the same country turned this accidental discovery into a product. M-Shwari, a mobile banking service built on Kenya's M-Pesa network, now offers a Lock Savings account: choose an amount, choose a period of one to six months, and the funds become untouchable until maturity — except that this version pays up to 7% annual interest instead of nothing, and breaking the lock early costs a 48-hour wait rather than a fee. The market learned what the economists had already proven in Bumala: people will happily pay, in cash or in patience, for a wall between themselves and their own hands.

*The lock was never the obstacle. The lock was the offer.*

Warren Buffett built a version of the same lock at a very different scale. In 2006 he committed publicly to give away more than 99% of his fortune, mostly through annual, irreversible transfers of Berkshire Hathaway stock to charitable foundations — a promise made loudly and repeatedly enough that breaking it would cost him something no bank fee ever could: his word, in public, forever. He wasn't trusting a future version of himself, decades on and surrounded by advisors and heirs, to make the same call quietly and unwatched. So the version of him holding the pen made the promise out loud, where reversing it would be its own kind of bankruptcy.

None of this describes people behaving foolishly. It describes people behaving with unusual self-knowledge — accurately predicting that their future self, standing in a market with cash in hand and a relative asking for a loan, would fold. Building the fee, the delay, or the public pledge in advance isn't a failure of willpower. It's willpower's last clever move, made while it still holds the upper hand. The market woman in Bumala wasn't paying the bank to hold her money. She was paying it to hold her ground.`,
        articleSummary: `In Bumala, Kenya, women given a savings account with no interest and real withdrawal fees still saved and invested more, because the friction protected their cash from relatives' claims. Men offered the same account barely used it. Kenya's modern M-Shwari Lock Savings account and Warren Buffett's irreversible giving pledge repeat the same trick: restriction, chosen in advance, as a tool rather than a flaw.`,
        articleTakeaways: [
          "In Dupas and Robinson's Kenya study, women given a zero-interest savings account with real withdrawal fees still saved and invested more — the friction protected the money, not the interest.",
          "The same account had almost no effect on bicycle-taxi drivers, showing a commitment device only works when it solves a real problem someone actually faces.",
          "Modern products like M-Shwari's Lock Savings account and public pledges like Warren Buffett's giving commitment both turn the same idea — restricting your own future choice — into a deliberate, valuable tool."
        ],
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
        questionText: "What is a commitment device, most precisely?",
        options: [
          "A financial product that pays higher interest for larger deposits",
          "A rule a person sets up in advance to restrict their own future choices",
          "A government law that restricts what citizens can buy",
          "A bank fee charged for early withdrawal"
        ],
        correctAnswer: "A rule a person sets up in advance to restrict their own future choices",
        explanation: "A commitment device is specifically a mechanism for controlling a future self. A fee is only one possible example, and government laws are externally imposed, not self-imposed."
      },
      {
        questionText: "In the story of Ulysses and the Sirens, why did he order his crew to tie him to the mast before he could hear the song?",
        options: [
          "He wanted to test his crew's loyalty",
          "He didn't trust the version of himself who would be listening to the song to give reliable orders",
          "He was following a religious ritual required before sea voyages",
          "He wanted to prove he was stronger than the Sirens"
        ],
        correctAnswer: "He didn't trust the version of himself who would be listening to the song to give reliable orders",
        explanation: "Ulysses survives by removing his own power to choose freely once temptation arrives, relying on the decision made by his rational self beforehand."
      },
      {
        questionText: "According to Dupas and Robinson's study, what was unusual about the savings account offered to market women in Bumala?",
        options: [
          "It offered an unusually high interest rate to attract customers",
          "It paid no interest and charged withdrawal fees, yet women still used it heavily",
          "It was only available to women who already had business loans",
          "It required no fees and offered free, unlimited withdrawals"
        ],
        correctAnswer: "It paid no interest and charged withdrawal fees, yet women still used it heavily",
        explanation: "The account paid zero interest and charged fees, making it a bad deal by standard textbook metrics, yet hundreds of women used it to successfully save."
      },
      {
        questionText: "Why did bicycle-taxi drivers barely use the same savings account that transformed many women's saving habits?",
        options: [
          "They were not allowed to open accounts at the bank",
          "They didn't face the same pressure to protect cash from being claimed by others, so the restriction didn't solve a problem they strongly had",
          "The account charged them higher fees than it charged women",
          "They preferred investing in mobile phone credit instead of saving"
        ],
        correctAnswer: "They didn't face the same pressure to protect cash from being claimed by others, so the restriction didn't solve a problem they strongly had",
        explanation: "A commitment device only works when it solves a specific temptation or pressure. The male taxi drivers did not face the same structural claims on their cash."
      },
      {
        questionText: "What does M-Shwari's Lock Savings account share in common with the zero-interest Bumala accounts, despite paying real interest?",
        options: [
          "Both refuse any withdrawal before maturity under all circumstances",
          "Both are only available to registered business owners",
          "Both use a form of restricted access to protect savers from their own future spending",
          "Both were designed by the same research team"
        ],
        correctAnswer: "Both use a form of restricted access to protect savers from their own future spending",
        explanation: "Both products provide a 'lock' — restricting access either through fees or a time delay — to help people protect their money from impulse or outside requests."
      },
      {
        questionText: "A friend receives their salary and immediately moves most of it into an account that penalizes early withdrawal, even though it pays no extra interest. What's the most likely reason for this, based on the lesson?",
        options: [
          "They made a mathematical error about interest rates",
          "They are protecting their future self from spending or lending away money they intend to save",
          "The bank forced them to choose this account type",
          "They don't understand how bank accounts work"
        ],
        correctAnswer: "They are protecting their future self from spending or lending away money they intend to save",
        explanation: "This behavior is deliberate and rational. They recognize their own future unreliability and use the penalty as a commitment device to ensure they follow their plan."
      },
      {
        questionText: "A tax advisor recommends signing an irreversible pledge to donate a fixed share of profits every year, starting now, instead of 'deciding each year depending on how business goes.' What's the clearest economic reason to make it irreversible immediately?",
        options: [
          "Irreversible pledges are legally required for charitable giving",
          "A flexible, year-by-year decision leaves room for a future self to quietly back out once it becomes inconvenient",
          "Irreversible pledges always produce larger tax savings",
          "Flexibility has no effect on whether people follow through on a commitment"
        ],
        correctAnswer: "A flexible, year-by-year decision leaves room for a future self to quietly back out once it becomes inconvenient",
        explanation: "Flexibility erodes follow-through over time. An irreversible pledge (like Buffett's) binds the future self from changing their mind when the choice gets hard."
      },
      {
        questionText: "Which of the following is the clearest real-world example of a commitment device?",
        options: [
          "A store offers a discount for buying in bulk",
          "A person freezes their credit card in a block of ice so they can't use it on impulse",
          "A government raises interest rates to control inflation",
          "A company raises prices during a period of high demand"
        ],
        correctAnswer: "A person freezes their credit card in a block of ice so they can't use it on impulse",
        explanation: "Freezing the credit card is a self-imposed restriction to curb future impulse spending, exactly fitting the definition of a commitment device."
      },
      {
        questionText: "If a commitment device works because it's costly or difficult to reverse, which of the following would make one WEAKER, not stronger?",
        options: [
          "Adding a public promise that others will notice if it's broken",
          "Making the restriction easy to cancel at any time, with no cost or delay",
          "Attaching a real financial penalty for backing out early",
          "Tying the lock period to a specific, meaningful future goal"
        ],
        correctAnswer: "Making the restriction easy to cancel at any time, with no cost or delay",
        explanation: "If a restriction is easy and costless to cancel, it provides no real barrier against temptation, rendering the commitment device ineffective."
      },
      {
        questionText: "The lesson argues that 'restriction' can sometimes leave a person better off than 'freedom' would. What's the strongest reason this can be true, based on the Bumala results?",
        options: [
          "Restriction is always better than freedom for financial decisions",
          "People sometimes make worse choices under full freedom because of pressures or temptations a restriction can block in advance",
          "Freedom has no measurable effect on savings behavior",
          "Restriction guarantees higher investment returns than an unrestricted account"
        ],
        correctAnswer: "People sometimes make worse choices under full freedom because of pressures or temptations a restriction can block in advance",
        explanation: "Full freedom leaves individuals exposed to present bias and external pressures (like family asking for money). Restriction can preemptively block those threats."
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
