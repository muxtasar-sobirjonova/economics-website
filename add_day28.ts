import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 28;
  const track = "BEHAVIORAL_ECONOMICS";
  console.log(`Starting update for Day \${dayOrder} (\${track}) Quizzes...`);

  // UPDATE QUIZ
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
        questionText: "What is 'present bias,' as described in the lesson on procrastination?",
        options: [
          "Overvaluing future rewards compared to present effort",
          "Overvaluing present effort compared to future rewards or costs",
          "A legal requirement to file taxes early",
          "A rule that only applies to self-employed workers"
        ],
        correctAnswer: "Overvaluing present effort compared to future rewards or costs",
        explanation: "Present bias means overvaluing today (present effort) compared to tomorrow (future rewards or costs). It's a psychological pattern, not a legal rule."
      },
      {
        questionText: "Why did Germany's Verspätungszuschlag penalty apply only in certain filing situations, not all?",
        options: [
          "It applied whenever a person filed a return at all, refund or not",
          "It applied specifically when a taxpayer owed money and missed the mandatory deadline",
          "It applied only to people using ELSTER",
          "It applied only to self-employed workers who filed early"
        ],
        correctAnswer: "It applied specifically when a taxpayer owed money and missed the mandatory deadline",
        explanation: "Refund-seekers filing late faced no such penalty. The penalty was tied to owing money and missing a deadline."
      },
      {
        questionText: "According to the lesson, what did Ulysses' order to be bound to the mast demonstrate about commitment devices?",
        options: [
          "A commitment device requires trusting your future self more, not less",
          "A commitment device is built by a person who does not trust the version of themselves that will face temptation later",
          "Commitment devices only work if enforced by a government or outside authority",
          "Commitment devices are only useful for financial decisions"
        ],
        correctAnswer: "A commitment device is built by a person who does not trust the version of themselves that will face temptation later",
        explanation: "Commitment devices exist because a person trusts their future self less, relying on restrictions they place on themselves in advance."
      },
      {
        questionText: "What did Dupas and Robinson find distinctive about the Bumala savings accounts' effect on the female vendors who used them?",
        options: [
          "They earned high interest, which motivated heavy use",
          "They paid no interest and charged withdrawal fees, yet were still used heavily and linked to more saving and investment",
          "They were mandatory for all market vendors",
          "They had no measurable effect on either gender"
        ],
        correctAnswer: "They paid no interest and charged withdrawal fees, yet were still used heavily and linked to more saving and investment",
        explanation: "The accounts paid zero interest and charged fees, making them a 'bad deal' on paper, yet participation was high and effective because it provided protective friction."
      },
      {
        questionText: "What economic idea did economist Thomas Schelling describe as 'the strategy of self-command'?",
        options: [
          "Treating yourself as a single, always-rational decision maker",
          "Treating yourself as a negotiation between a present self and a future self who may not agree",
          "A government policy for public pension enforcement",
          "A pricing strategy used by health clubs"
        ],
        correctAnswer: "Treating yourself as a negotiation between a present self and a future self who may not agree",
        explanation: "Schelling's concept describes treating yourself as two selves negotiating across time, not as one consistent actor."
      },
      {
        questionText: "What is 'status quo bias,' as used in the lesson on default enrollment?",
        options: [
          "The tendency to always choose the newest available option",
          "The tendency to keep whatever option requires no action, regardless of whether it's the best one",
          "A rule requiring governments to update pension law every year",
          "The tendency of young workers to avoid saving entirely"
        ],
        correctAnswer: "The tendency to keep whatever option requires no action, regardless of whether it's the best one",
        explanation: "Status quo bias is the psychological tendency to stick with the current or default setting because taking action requires effort."
      },
      {
        questionText: "What is the key difference between how the 'nudge' concept was applied in the UK pension reform, compared to Amazon's 1-Click ordering?",
        options: [
          "One used defaults to encourage saving, the other used a similar mechanism to encourage spending",
          "One was mandatory by law, the other was entirely optional with no default at all",
          "Nudge theory only applies to government policy, never to private business",
          "Amazon's 1-Click was designed to discourage impulsive purchases"
        ],
        correctAnswer: "One used defaults to encourage saving, the other used a similar mechanism to encourage spending",
        explanation: "Both removed friction via defaults. The UK used it to increase savings, while Amazon used it to increase spending."
      },
      {
        questionText: "What did Robert Strotz's concept of 'time inconsistency' describe?",
        options: [
          "A preference that is rational when stated but contradicts what the same person prefers once the future arrives",
          "A legal inconsistency between two countries' pension laws",
          "The tendency for prices to change unpredictably over time",
          "A pattern found only in gym membership contracts"
        ],
        correctAnswer: "A preference that is rational when stated but contradicts what the same person prefers once the future arrives",
        explanation: "Time inconsistency occurs when plans made today contradict actual preferences when the moment of action arrives."
      },
      {
        questionText: "In the gym membership study by DellaVigna and Malmendier, why did flat-fee members pay more per visit than the pay-per-visit price at the same clubs?",
        options: [
          "The flat-fee contract included extra perks not available to pay-per-visit users",
          "Their actual attendance was lower than what would have made the flat fee the cheaper option",
          "The gyms overcharged flat-fee members by mistake",
          "Pay-per-visit passes were only available to new members"
        ],
        correctAnswer: "Their actual attendance was lower than what would have made the flat fee the cheaper option",
        explanation: "Members' low attendance meant the total flat fee divided by visits resulted in a much higher per-visit cost than the $10 pay-per-visit pass."
      },
      {
        questionText: "Why were monthly (flexible) gym contract holders more likely to remain enrolled beyond a year than annual contract holders?",
        options: [
          "Monthly contracts were cheaper overall",
          "Annual contracts had a fixed renewal date forcing a decision, while monthly contracts never created that forcing moment",
          "Monthly members were legally required to stay longer",
          "Annual members received a discount for early cancellation"
        ],
        correctAnswer: "Annual contracts had a fixed renewal date forcing a decision, while monthly contracts never created that forcing moment",
        explanation: "The lack of a forced renewal date in monthly contracts meant members delayed cancelling, allowing them to stay enrolled longer through sheer inertia."
      },
      {
        questionText: "What links the German tax refund window and the UK pension default, according to the lessons?",
        options: [
          "Both show how the design of a rule shapes behavior more than persuasion alone",
          "Both involve the same government agency",
          "Both were introduced in the same year",
          "Both apply only to self-employed workers"
        ],
        correctAnswer: "Both show how the design of a rule shapes behavior more than persuasion alone",
        explanation: "Both are examples of how choice architecture and structural design dictate behavior far more effectively than mere education or good intentions."
      },
      {
        questionText: "Which pairing correctly matches the economist with the concept credited to them in these lessons?",
        options: [
          "Richard Thaler — time inconsistency",
          "Thomas Schelling — self-command / commitment devices",
          "Robert Strotz — the 'nudge' concept",
          "David Laibson — the razor-and-blades pricing model"
        ],
        correctAnswer: "Thomas Schelling — self-command / commitment devices",
        explanation: "Schelling coined 'the strategy of self-command.' Thaler is nudges, Strotz is time inconsistency, and Laibson refined discounting math."
      },
      {
        questionText: "What does 'forgoing savings' mean in the context of the gym membership study?",
        options: [
          "Gym members earned less interest on their bank savings account",
          "Members paid more overall than a cheaper available option would have cost them, given how often they actually attended",
          "Members were forced to save money instead of spending it",
          "Gyms reduced their advertised prices over time"
        ],
        correctAnswer: "Members paid more overall than a cheaper available option would have cost them, given how often they actually attended",
        explanation: "Forgone savings refers to the money a member lost by choosing the expensive flat fee instead of the cheaper pay-as-you-go option."
      },
      {
        questionText: "Why does the lesson describe a 'well-designed default' as expanding, rather than guaranteeing, who benefits from a policy?",
        options: [
          "Because some people, especially lower earners, may still have good reasons to opt out",
          "Because defaults are illegal in most countries",
          "Because defaults always produce a 100% participation rate",
          "Because a default removes all decision-making power from every citizen"
        ],
        correctAnswer: "Because some people, especially lower earners, may still have good reasons to opt out",
        explanation: "A default leaves the exit door open because some individuals genuinely benefit from opting out, ensuring flexibility remains while increasing general participation."
      },
      {
        questionText: "Across all four lessons, what common thread connects procrastination, commitment devices, default enrollment, and time-inconsistent preferences?",
        options: [
          "They all describe purely irrational behavior with no underlying logic",
          "They all show that the design of a choice environment shapes behavior as much as, or more than, individual willpower alone",
          "They all apply exclusively to financial decisions",
          "They all were discovered by the same single economist"
        ],
        correctAnswer: "They all show that the design of a choice environment shapes behavior as much as, or more than, individual willpower alone",
        explanation: "The core theme of behavioral economics is that environment, friction, and choice design dictate behavior far more powerfully than pure motivation or willpower."
      },
      {
        questionText: "You run a startup subscription box service and notice most customers who sign up during a 'cancel anytime' trial rarely cancel, even after they stop using the product. Based on the lesson on time-inconsistent preferences, what's the most likely explanation?",
        options: [
          "Customers are legally bound to continue",
          "Without a forced renewal date, there's never an urgent moment that triggers cancellation",
          "The product is objectively excellent for everyone",
          "Customers do not know how to cancel"
        ],
        correctAnswer: "Without a forced renewal date, there's never an urgent moment that triggers cancellation",
        explanation: "A 'cancel anytime' model removes a forcing moment, allowing inertia and procrastination to delay the decision indefinitely."
      },
      {
        questionText: "A government wants to increase enrollment in a national retirement savings program without banning any citizen's choice. Based on the UK case, what's the most effective single design change to consider first?",
        options: [
          "Increase advertising spend explaining the benefits of saving",
          "Switch new employees to automatic enrollment with an opt-out option",
          "Require a written essay explaining why someone wants to save",
          "Add a small one-time cash bonus for opting in"
        ],
        correctAnswer: "Switch new employees to automatic enrollment with an opt-out option",
        explanation: "Auto-enrollment (changing the default) is proven to drastically increase participation without removing freedom."
      },
      {
        questionText: "A tax authority wants to reduce the flood of last-minute filings without adding new penalties. Based on the German ELSTER example, what should it recognize first?",
        options: [
          "That making filing more digitally convenient will automatically eliminate the last-minute rush",
          "That people with no cost for waiting have little reason to file early, regardless of how convenient the process becomes",
          "That most last-minute filers are technically incompetent",
          "That deadlines have no effect on filing behavior at all"
        ],
        correctAnswer: "That people with no cost for waiting have little reason to file early, regardless of how convenient the process becomes",
        explanation: "Without a cost to delaying, people will still wait until the deadline due to present bias, no matter how convenient the platform is."
      },
      {
        questionText: "An entrepreneur running a Kenyan micro-savings app wants to design a product for women vendors who want to protect income from being borrowed by relatives. Based on the Bumala study, what feature would most directly address this need?",
        options: [
          "A high-interest, freely withdrawable account",
          "A savings option with a real cost or delay attached to withdrawal, even without extra interest",
          "A shared family account visible to all relatives",
          "An account that requires no deposits at all"
        ],
        correctAnswer: "A savings option with a real cost or delay attached to withdrawal, even without extra interest",
        explanation: "Protective friction (like a withdrawal fee or delay) serves as a commitment device that shields savings from social pressure."
      },
      {
        questionText: "A startup founder wants to make a lasting public commitment to reinvest profits into the company rather than take large personal payouts, to resist future investor pressure. Based on the lesson on commitment devices, what would make this commitment strongest?",
        options: [
          "Making the commitment privately, told to no one",
          "Making the commitment publicly, in a way that would cost real reputation if broken",
          "Reviewing the decision fresh every quarter with no prior statement",
          "Avoiding any specific numbers or terms"
        ],
        correctAnswer: "Making the commitment publicly, in a way that would cost real reputation if broken",
        explanation: "A public commitment creates a severe reputational cost for breaking it, serving as a powerful, binding commitment device."
      },
      {
        questionText: "A gym owner in Australia notices high churn among annual members but wants to keep revenue steady without misleading customers. What insight from the lesson best explains why annual members still eventually leave despite paying more upfront?",
        options: [
          "Annual contracts remove any incentive to attend, since the commitment already feels satisfied",
          "A locked-in contract still ends at a renewal date, which becomes the moment members reassess and often leave",
          "Annual members always attend more than monthly members",
          "Gym owners intentionally sabotage annual plans"
        ],
        correctAnswer: "A locked-in contract still ends at a renewal date, which becomes the moment members reassess and often leave",
        explanation: "An annual contract eventually presents a forced renewal date, prompting members to finally realize they aren't attending and cancel."
      },
      {
        questionText: "A financial advisor wants to help a self-employed client avoid one specific real cost described in the German tax lesson. Which action addresses that cost most directly?",
        options: [
          "Filing before the mandatory deadline (or its extended equivalent) to avoid the monthly late-filing surcharge",
          "Switching to the four-year voluntary filing window",
          "Requesting a refund from the tax office in advance",
          "Avoiding the ELSTER portal entirely"
        ],
        correctAnswer: "Filing before the mandatory deadline (or its extended equivalent) to avoid the monthly late-filing surcharge",
        explanation: "The late-filing surcharge applies when missing the mandatory deadline while owing money, making timely filing crucial."
      },
      {
        questionText: "An e-commerce founder wants to increase completed purchases without changing price or product. Based on the Amazon 1-Click example, what's the most directly supported strategy?",
        options: [
          "Add more required steps to confirm serious buyer intent",
          "Remove as many decision points as possible between wanting the product and completing the purchase",
          "Require customers to opt in to a mailing list before checkout",
          "Increase the minimum order size required for checkout"
        ],
        correctAnswer: "Remove as many decision points as possible between wanting the product and completing the purchase",
        explanation: "Like defaults, 1-Click works by removing decision points and reducing friction, making the desired action the path of least resistance."
      },
      {
        questionText: "A wellness startup wants to design a program that actually gets time-inconsistent clients to exercise, rather than just sell memberships. Based on the lesson, what design choice most directly addresses the March-versus-January gap?",
        options: [
          "Require full annual payment with no possibility of a refund",
          "Build in a recurring, unavoidable check-in or forced decision point, rather than relying on initial sign-up motivation alone",
          "Offer the cheapest possible monthly price with unlimited flexibility",
          "Rely entirely on member willpower after the first month"
        ],
        correctAnswer: "Build in a recurring, unavoidable check-in or forced decision point, rather than relying on initial sign-up motivation alone",
        explanation: "Relying on initial motivation fails because of time inconsistency. Forcing a check-in addresses the drop in motivation practically."
      },
      {
        questionText: "A policymaker studying both the UK pension case and the German tax case wants to design a rule that increases early action without banning late action. What common design principle applies?",
        options: [
          "Add a criminal penalty for any delay, no matter how small",
          "Adjust the default or cost structure so that waiting is no longer the easiest, most costless option",
          "Eliminate all deadlines entirely",
          "Require in-person meetings before any transaction"
        ],
        correctAnswer: "Adjust the default or cost structure so that waiting is no longer the easiest, most costless option",
        explanation: "Adding friction to delays (like surcharges) or making the desired action the default steers behavior without outright bans."
      },
      {
        questionText: "A microfinance NGO wants to replicate the Bumala results in a new country. Based on the lesson, which detail is most important to check first?",
        options: [
          "Whether the national currency is the same as Kenya's",
          "Whether the target group faces a similar problem of protecting savings from social or family claims",
          "Whether the accounts will pay high interest",
          "Whether the same researchers are involved as before"
        ],
        correctAnswer: "Whether the target group faces a similar problem of protecting savings from social or family claims",
        explanation: "Commitment devices only work if they solve a problem people actually have, such as social pressure to share cash."
      },
      {
        questionText: "An HR manager wants to increase enrollment in a company retirement plan among new hires without forcing anyone to participate. What is the most directly supported action from the lessons?",
        options: [
          "Make participation the automatic default, with a clear and simple opt-out process",
          "Require a mandatory in-person financial literacy class before hiring",
          "Only offer the plan to employees who ask about it directly",
          "Increase the penalty for employees who choose not to participate"
        ],
        correctAnswer: "Make participation the automatic default, with a clear and simple opt-out process",
        explanation: "Changing the default to auto-enrollment significantly increases participation due to status quo bias, while keeping it optional."
      },
      {
        questionText: "An entrepreneur is deciding between a flexible month-to-month pricing plan and a fixed annual plan for a productivity app, and wants customers who actually use the product to stick around — not just customers who forget to cancel. What tension should they be aware of, based on the lesson?",
        options: [
          "Flexible plans always produce more loyal, satisfied customers",
          "A flexible plan can retain inactive customers longer simply because it never forces a renewal decision, which isn't the same as retaining genuinely satisfied users",
          "Annual plans always guarantee higher customer satisfaction",
          "Pricing structure has no effect on how long customers stay subscribed"
        ],
        correctAnswer: "A flexible plan can retain inactive customers longer simply because it never forces a renewal decision, which isn't the same as retaining genuinely satisfied users",
        explanation: "Flexible plans without forcing moments can retain users purely through inertia and procrastination, not genuine satisfaction or usage."
      },
      {
        questionText: "A financial coach wants to help a client who 'always plans to start saving next month.' Based on the lessons on procrastination and time-inconsistent preferences, what is the most directly supported advice?",
        options: [
          "Wait until the client feels fully motivated before suggesting any structural change",
          "Suggest a structural change now, such as an automatic transfer or locked account, rather than relying on future motivation",
          "Tell the client that willpower alone reliably solves this problem over time",
          "Recommend delaying any decision until the following tax year"
        ],
        correctAnswer: "Suggest a structural change now, such as an automatic transfer or locked account, rather than relying on future motivation",
        explanation: "Waiting for motivation is a trap. Structural changes implemented today (commitment devices) bypass future failures of willpower."
      },
      {
        questionText: "A small business owner wants to reduce the number of clients who sign long contracts but quietly stop engaging without officially cancelling. Drawing on both the gym and default-enrollment lessons, what combined insight applies?",
        options: [
          "People rarely change behavior based on how a choice or contract is structured",
          "Removing forced decision points can increase passive non-cancellation, just as removing an opt-in requirement can increase passive enrollment — the same inertia works in both directions",
          "Only annual contracts can ever retain customers",
          "Only monthly contracts can ever retain customers"
        ],
        correctAnswer: "Removing forced decision points can increase passive non-cancellation, just as removing an opt-in requirement can increase passive enrollment — the same inertia works in both directions",
        explanation: "Inertia affects both entering and leaving agreements. Without forced decision points, people default to doing nothing."
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
