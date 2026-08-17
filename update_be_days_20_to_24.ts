import { PrismaClient, Track } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const track = Track.BEHAVIORAL_ECONOMICS;
  const daysToUpdate = [20, 21, 22, 23, 24];

  console.log("Updating Days 20 through 24 for Behavioral Economics...");

  await prisma.lesson.deleteMany({
    where: { track, dayOrder: { in: daysToUpdate } }
  });

  await prisma.quiz.deleteMany({
    where: { track, dayOrder: { in: daysToUpdate } }
  });

  // ================= DAY 20 =================
  const day20Data = {
    title: "Why We Value Things More After Owning Them",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 20,
    track: track,
    conceptText: `A student owns a coffee mug worth about $6. Asked to sell it, the student wants $10. Another student who does not own the mug is asked how much they would pay and offers $4. The same object receives two values because one person must give it up and the other person may acquire it.

This is the endowment effect: ownership can increase the value people place on an object. Selling is not experienced as the reverse of buying. The owner imagines losing the item, while the buyer imagines gaining it. Because losses often weigh more heavily than gains, the seller’s minimum price can exceed the buyer’s maximum price.

Ownership also changes attention. Sellers focus on the object’s useful features, memories, original price, and care. Buyers focus on defects, substitutes, and market prices. Each side feels reasonable because each side is evaluating a different psychological bundle.

The effect is not unlimited. Professional traders, repeated market experience, close substitutes, and clear price information can reduce it. Some researchers also debate how much experimental procedures contribute to measured gaps. The practical lesson is therefore not “owners are always irrational.” It is that ownership can become a hidden input in valuation.

That hidden input is easy to see on resale platforms, where a used phone can remain unsold for months because its owner sees a personal asset while buyers see one listing among hundreds.`,
    conceptSummary: `The endowment effect is the tendency to value an object more after owning it. Owners experience selling as a loss and attend to personal benefits and memories, while buyers compare alternatives and risks. This can create a gap between willingness to accept and willingness to pay, even when ownership was assigned only moments earlier.`,
    conceptTakeaways: [
      "Ownership can increase perceived value even without changing the object.",
      "Sellers often judge a sale as a loss; buyers judge a purchase as a possible gain.",
      "Original prices and private memories can distort current market valuations."
    ],
    articleTitle: "Used-Goods Markets and the Endowment Effect",
    articleText: `**Why do Turkish sellers and buyers disagree so sharply about the same used item?**
Imagine a seller in Istanbul listing a three-year-old phone. It cost 18,000 lira new, has never been dropped, and contains photographs from important family moments. The seller asks 14,000 lira. Buyers compare it with newer models, battery wear, repair risk, and dozens of similar listings. To them, 10,000 lira may already feel generous. No one changed the phone; ownership changed the viewpoint.

**Why does the original price become so powerful?**
Owners often anchor on what they paid. Depreciation then feels like a personal loss rather than a normal market process. A seller may think, “I paid 18,000, so accepting 9,000 means losing half.” The buyer asks a different question: “What else can I buy for 9,000 today?” The market cares about current alternatives, but the owner’s reference point remains the past purchase.

**How do memories enter an economic price?**
A jacket may represent a graduation; a game console may remind someone of friends; a car may symbolize independence. Those meanings are real to the owner, but they are not automatically transferable. A buyer receives the object, not the seller’s memories. Resale disagreements often arise when a seller adds private emotional value to a public asking price.

**What did the classic mug experiments show?**
Daniel Kahneman, Jack Knetsch, and Richard Thaler randomly gave consumption goods such as mugs to some participants and then created markets. Owners generally demanded more to give up the goods than non-owners were willing to pay to acquire them, and fewer trades occurred than standard theory predicted. The experiments made ownership the main difference, showing how quickly a valuation gap can appear.

**Why does bargaining not always solve the problem?**
Bargaining begins from different reference points. Every price reduction can feel like another loss to the seller, while every high counteroffer can feel like overpayment to the buyer. Online platforms add another difficulty: asking prices are visible, but completed-sale prices may be less obvious. Sellers can therefore anchor on other optimistic sellers rather than on the prices at which goods actually change hands.

**How can someone value an owned item more accurately?**
Use completed sales for comparable items, subtract repair and replacement risk, and ask: “If I did not own this, how much would I pay today?” A cooling-off period between deciding to sell and setting the price can reduce emotion. Independent valuation helps for expensive assets. None of these methods removes sentimental value; they separate the value of keeping the item from the market value another person is likely to pay.`,
    articleSummary: `Used-goods markets in Turkey illustrate how ownership, original purchase prices, memories, and optimistic asking prices can make sellers overvalue items relative to buyers. Classic mug experiments found similar gaps under controlled conditions. Comparing completed sales and imagining the item from a non-owner’s perspective can improve pricing.`,
    articleTakeaways: [
      "Classic mug experiments found willingness to accept above willingness to pay.",
      "Completed-sale data and an “If I did not own it” test can reduce the bias."
    ]
  };

  await prisma.lesson.create({ data: day20Data });
  console.log("Created Lesson Day 20");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day20Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 20,
      track: track,
      questions: {
        create: [
          {
            questionText: "What is the endowment effect?",
            options: [
              "The tendency to value an item more because one owns it",
              "The rule that used goods always rise in price",
              "The belief that buyers know less than sellers",
              "A tax on inherited property"
            ],
            correctAnswer: "The tendency to value an item more because one owns it",
            explanation: "Ownership itself can increase perceived value.",
            order: 0
          },
          {
            questionText: "Why can a seller’s minimum price exceed a buyer’s maximum price?",
            options: [
              "The object becomes physically better when owned",
              "Giving it up feels like a loss while acquiring it is a gain",
              "Buyers are legally forbidden to offer more",
              "Market prices never change"
            ],
            correctAnswer: "Giving it up feels like a loss while acquiring it is a gain",
            explanation: "Sellers experience the transaction as a loss, and losses loom larger than gains.",
            order: 1
          },
          {
            questionText: "Which question helps reduce the endowment effect?",
            options: [
              "What did I pay years ago?",
              "How much would I pay if I did not own this today?",
              "How many memories do I have?",
              "How high are other unsold listings?"
            ],
            correctAnswer: "How much would I pay if I did not own this today?",
            explanation: "This reframes the perspective to match a buyer's view.",
            order: 2
          },
          {
            questionText: "What did the classic mug studies vary?",
            options: [
              "The weather",
              "Whether participants owned the consumption good",
              "The national tax rate",
              "The mug’s material during trading"
            ],
            correctAnswer: "Whether participants owned the consumption good",
            explanation: "Ownership was the key randomly assigned variable.",
            order: 3
          },
          {
            questionText: "Why is an original purchase price a weak guide to resale value?",
            options: [
              "It may not reflect current alternatives, condition, or depreciation",
              "It is always lower than market value",
              "Buyers are required to ignore it",
              "It has no numerical meaning"
            ],
            correctAnswer: "It may not reflect current alternatives, condition, or depreciation",
            explanation: "Markets care about current substitutes, not past sunk costs.",
            order: 4
          },
          {
            questionText: "A seller includes the emotional value of graduation memories in a jacket’s price. What is the problem?",
            options: [
              "Memories are illegal in contracts",
              "The buyer does not automatically receive the seller’s private meaning",
              "Clothing has no resale market",
              "Emotional value is always zero"
            ],
            correctAnswer: "The buyer does not automatically receive the seller’s private meaning",
            explanation: "Emotional value is real to the owner, but it is not transferred in the sale.",
            order: 5
          },
          {
            questionText: "Which market evidence is most useful for setting a realistic price?",
            options: [
              "The highest asking price",
              "Completed sales of similar items",
              "The seller’s favorite memory",
              "The item’s original advertisement only"
            ],
            correctAnswer: "Completed sales of similar items",
            explanation: "Completed sales show the price at which buyers actually agree to buy.",
            order: 6
          },
          {
            questionText: "You manage a resale platform. Which feature could reduce valuation disputes?",
            options: [
              "Hide all sold prices",
              "Show recent completed-sale ranges for comparable goods",
              "Automatically copy the highest listing price",
              "Prevent buyers from making offers"
            ],
            correctAnswer: "Show recent completed-sale ranges for comparable goods",
            explanation: "It grounds seller expectations in market reality.",
            order: 7
          },
          {
            questionText: "Does the endowment effect mean every owner is irrational?",
            options: [
              "Yes, ownership always destroys judgment",
              "No, the effect is a tendency and can be reduced by experience and information",
              "Yes, but only online",
              "No, because ownership never changes value"
            ],
            correctAnswer: "No, the effect is a tendency and can be reduced by experience and information",
            explanation: "Market experience and good data can mitigate the bias.",
            order: 8
          },
          {
            questionText: "What best summarizes the seller-buyer disagreement?",
            options: [
              "They always see different physical products",
              "They value different psychological bundles around the same object",
              "The seller controls market demand",
              "The buyer decides the original cost"
            ],
            correctAnswer: "They value different psychological bundles around the same object",
            explanation: "Sellers focus on lost benefits; buyers focus on costs and substitutes.",
            order: 9
          }
        ]
      }
    }
  });

  // ================= DAY 21 =================
  const day21Data = {
    title: "Chapter Quiz - How We Think About Gains and Losses",
    tag: "ECON",
    timeEstimate: 15,
    dayOrder: 21,
    track: track
  };

  await prisma.lesson.create({ data: day21Data });
  console.log("Created Lesson Day 21");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day21Data.title,
      tag: "ECON",
      timeEstimate: 15,
      dayOrder: 21,
      track: track,
      questions: {
        create: [
          {
            questionText: "A free airline snack becomes a paid item. Existing passengers react more strongly than new passengers. Which concept best explains this?",
            options: [
              "Loss aversion",
              "Present bias",
              "Hyperbolic discounting",
              "Commitment devices"
            ],
            correctAnswer: "Loss aversion",
            explanation: "Existing passengers perceive the change as a loss of something they owned.",
            order: 0
          },
          {
            questionText: "Why did British Airways face stronger backlash than budget airlines charging similar snack prices?",
            options: [
              "BA passengers used “free” as their reference point",
              "BA snacks had no prices",
              "Budget passengers were legally unable to complain",
              "BA operated no short-haul flights"
            ],
            correctAnswer: "BA passengers used “free” as their reference point",
            explanation: "Budget airline passengers never expected free snacks, so they didn't experience a loss.",
            order: 1
          },
          {
            questionText: "Which pricing change is least likely to trigger loss aversion?",
            options: [
              "Remove an included feature overnight",
              "Keep the existing plan and add an optional premium tier",
              "Cancel a familiar discount without warning",
              "Charge for support that was free for years"
            ],
            correctAnswer: "Keep the existing plan and add an optional premium tier",
            explanation: "Adding an optional tier does not take anything away from the user's current plan.",
            order: 2
          },
          {
            questionText: "What is the core business lesson from loss aversion?",
            options: [
              "Judge backlash only by the dollar amount",
              "Expect removed benefits to feel larger than their cost suggests",
              "Never change any product",
              "Customers ignore reference points"
            ],
            correctAnswer: "Expect removed benefits to feel larger than their cost suggests",
            explanation: "The psychological reaction scales with the feeling of loss, not just the absolute price.",
            order: 3
          },
          {
            questionText: "Two employees receive the same salary but react differently. What is the most likely reason?",
            options: [
              "They compare it with different reference points",
              "Money has different legal values for each employee",
              "One salary is imaginary",
              "Reference points apply only to prices"
            ],
            correctAnswer: "They compare it with different reference points",
            explanation: "A reference point determines whether the salary feels like a gain or a disappointment.",
            order: 4
          },
          {
            questionText: "What did Norway’s searchable tax records make easier?",
            options: [
              "Income comparison among people in social networks",
              "Elimination of every wage difference",
              "Automatic salary increases",
              "Private tax evasion"
            ],
            correctAnswer: "Income comparison among people in social networks",
            explanation: "It allowed people to easily find out what their peers were earning.",
            order: 5
          },
          {
            questionText: "An employee gets a 5 percent raise while market salaries rise 10 percent. Why can morale fall?",
            options: [
              "The market rate becomes a higher reference point",
              "Any raise feels like a loss",
              "The employee forgets arithmetic",
              "Market wages cannot affect internal workers"
            ],
            correctAnswer: "The market rate becomes a higher reference point",
            explanation: "The 5% raise looks like a loss compared to the 10% market benchmark.",
            order: 6
          },
          {
            questionText: "What is a responsible response to pay transparency?",
            options: [
              "Explain salary bands and role differences clearly",
              "Hide all criteria",
              "Change salaries randomly",
              "Ban every discussion"
            ],
            correctAnswer: "Explain salary bands and role differences clearly",
            explanation: "Providing clear context helps prevent negative assumptions when comparisons are made.",
            order: 7
          },
          {
            questionText: "A €100 gain from €0 feels larger than the same gain from €10,000. Which concept applies?",
            options: [
              "Diminishing sensitivity",
              "Endowment effect",
              "Present bias",
              "Default enrollment"
            ],
            correctAnswer: "Diminishing sensitivity",
            explanation: "Equal changes feel smaller as they occur farther from a reference point.",
            order: 8
          },
          {
            questionText: "Which separate concept helps explain why a tiny lottery chance feels vivid?",
            options: [
              "Probability weighting",
              "Comparative advantage",
              "Sunk cost",
              "Market clearing"
            ],
            correctAnswer: "Probability weighting",
            explanation: "People tend to overweight very small probabilities of large rewards.",
            order: 9
          },
          {
            questionText: "What does Spain’s 70 percent prize allocation imply?",
            options: [
              "Expected monetary return is below the amount spent",
              "A 70 percent chance of the first prize",
              "Every ticket returns 70 percent",
              "The lottery cannot pay operating costs"
            ],
            correctAnswer: "Expected monetary return is below the amount spent",
            explanation: "Only 70% of ticket sales are paid back in prizes, leading to a negative expected return.",
            order: 10
          },
          {
            questionText: "Why can sharing an El Gordo ticket have value beyond expected return?",
            options: [
              "It creates social participation and reduces fear of missing out",
              "It guarantees a win",
              "It removes opportunity cost",
              "It changes the random number"
            ],
            correctAnswer: "It creates social participation and reduces fear of missing out",
            explanation: "Lotteries can provide community bonding and entertainment value.",
            order: 11
          },
          {
            questionText: "“90 percent survive” and “10 percent die” illustrate what?",
            options: [
              "Framing effects",
              "Endowment effect",
              "Compounding",
              "Commitment saving"
            ],
            correctAnswer: "Framing effects",
            explanation: "The same information evokes different reactions depending on how it's presented.",
            order: 12
          },
          {
            questionText: "In Austria’s organ-donation system, what does the opt-out default do?",
            options: [
              "Leaves donation possible unless an objection exists",
              "Makes donation compulsory without exception",
              "Requires everyone to opt in",
              "Allows employers to decide"
            ],
            correctAnswer: "Leaves donation possible unless an objection exists",
            explanation: "Inaction keeps a person in the donor pool, though they can freely object.",
            order: 13
          },
          {
            questionText: "Why should an opt-out law not receive all credit for transplant outcomes?",
            options: [
              "Medical capacity, coordination, records, and trust also matter",
              "Defaults never affect behavior",
              "Organs require no medical process",
              "The law applies only to money"
            ],
            correctAnswer: "Medical capacity, coordination, records, and trust also matter",
            explanation: "A default rule requires robust infrastructure to actually result in successful donations.",
            order: 14
          },
          {
            questionText: "Which default is most ethical?",
            options: [
              "Transparent, easy to reverse, and evidence-based",
              "Hidden and costly to change",
              "Impossible to learn about",
              "Selected only for institutional profit"
            ],
            correctAnswer: "Transparent, easy to reverse, and evidence-based",
            explanation: "Ethical choice architecture preserves autonomy and operates in the user's interest.",
            order: 15
          },
          {
            questionText: "Which pattern is risk-attitude reversal?",
            options: [
              "Certain gains but gambling to avoid losses",
              "Gambling with every gain and every loss",
              "Avoiding all gains",
              "Choosing by alphabetical order"
            ],
            correctAnswer: "Certain gains but gambling to avoid losses",
            explanation: "People tend to avoid risk with gains, but embrace risk to escape losses.",
            order: 16
          },
          {
            questionText: "What is chasing losses?",
            options: [
              "Taking greater risk to recover a previous loss",
              "Stopping at a planned limit",
              "Diversifying investments",
              "Repaying debt steadily"
            ],
            correctAnswer: "Taking greater risk to recover a previous loss",
            explanation: "It involves escalating risk to try and get back to an original reference point.",
            order: 17
          },
          {
            questionText: "Which question can interrupt a break-even trap?",
            options: [
              "What is best from my current position?",
              "How can I restore the past at any cost?",
              "How can I hide the loss?",
              "How can I double every stake?"
            ],
            correctAnswer: "What is best from my current position?",
            explanation: "It shifts the reference point from an unrecoverable past state to current reality.",
            order: 18
          },
          {
            questionText: "Which institutional tool reduces impulsive risk after losses?",
            options: [
              "Cooling-off periods and pre-set limits",
              "Unlimited instant credit",
              "Hidden repayment totals",
              "Automatic stake increases"
            ],
            correctAnswer: "Cooling-off periods and pre-set limits",
            explanation: "These interventions create friction, disrupting the urge to chase losses.",
            order: 19
          },
          {
            questionText: "A used phone owner asks far more than buyers offer because it feels personally valuable. Which concept fits?",
            options: [
              "Endowment effect",
              "Base-rate neglect",
              "Present bias",
              "Social proof"
            ],
            correctAnswer: "Endowment effect",
            explanation: "Ownership causes the seller to overvalue the item compared to a non-owner.",
            order: 20
          },
          {
            questionText: "Why can original purchase price distort a resale decision?",
            options: [
              "It anchors the seller even when current alternatives and depreciation differ",
              "It legally sets the resale price",
              "It always equals current value",
              "Buyers cannot discover it"
            ],
            correctAnswer: "It anchors the seller even when current alternatives and depreciation differ",
            explanation: "The seller treats the old price as a baseline, failing to accept market depreciation.",
            order: 21
          },
          {
            questionText: "What evidence is best for setting a resale price?",
            options: [
              "Completed sales of comparable items",
              "The highest unsold listing",
              "The owner’s memories",
              "The original box color"
            ],
            correctAnswer: "Completed sales of comparable items",
            explanation: "Completed sales indicate the actual clearing price in the market.",
            order: 22
          },
          {
            questionText: "What did classic mug experiments find?",
            options: [
              "Owners often demanded more than non-owners would pay",
              "Every mug traded immediately",
              "Ownership lowered all values",
              "Only professional sellers showed a gap"
            ],
            correctAnswer: "Owners often demanded more than non-owners would pay",
            explanation: "The experiments demonstrated a gap between willingness to accept and willingness to pay.",
            order: 23
          }
        ]
      }
    }
  });

  // ================= DAY 22 =================
  const day22Data = {
    title: "Why We Choose Today Over Tomorrow",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 22,
    track: track,
    conceptText: `Would you rather receive $50 today or $55 next month? Many people choose $50 today. Now choose between $50 in twelve months and $55 in thirteen months. The waiting difference is still one month, yet more people are willing to wait for $55 when both options are far away.

Present bias is the tendency to give unusually strong weight to immediate costs and benefits. The future matters, but “right now” receives a special bonus in the mind. Hunger today, rent today, and an emergency today can dominate higher costs that arrive next week or next month.

This bias is not simple impatience. A consistently impatient person might apply the same discount to every one-month delay. Present-biased preferences can reverse as time passes. Someone plans to reject an expensive loan tomorrow, then accepts it when the cash becomes immediately available.

Short-term credit can be economically useful when it bridges a predictable income gap or protects a household from a more serious consequence. The danger appears when speed, stress, and opaque fees prevent the borrower from comparing total repayment with alternatives.

In the Philippines, many households borrow for daily expenses and emergencies. Digital credit makes funds available quickly, which can solve an immediate problem while also making present bias more powerful.`,
    conceptSummary: `Present bias gives immediate outcomes extra psychological weight. A person may prefer a smaller reward today but a larger reward when both choices are in the future. Urgency and stress strengthen the effect, which can make quick credit attractive even when borrowers understand that repayment will be costly.`,
    conceptTakeaways: [
      "Present bias gives “now” more weight than an equally long delay in the future.",
      "Urgent needs can make a costly loan understandable without making it harmless.",
      "Digital speed reduces friction but can also reduce reflection."
    ],
    articleTitle: "Digital Lending and Present Bias in the Philippines",
    articleText: `**Why can a costly loan feel like the best option at 8 p.m.?**
Imagine a worker in Manila whose child needs medicine tonight. Salary arrives in five days. A phone app offers ₱5,000 immediately and displays repayment later. The future fee is real, but the medicine is needed now. Present bias does not mean the parent is careless. It means an urgent current benefit can dominate a delayed cost, especially under stress and limited alternatives.

**What do Philippine borrowing patterns show?**
The Bangko Sentral ng Pilipinas reported in its 2021 Financial Inclusion Survey that loans were primarily used for day-to-day expenses: 50 percent of outstanding loans and 46 percent of previous loans. Emergencies were another important reason. These purposes place borrowers in exactly the conditions where present bias is strongest: the current need is vivid, while repayment is separated by time.

**How does digital lending change the decision?**
A branch loan once required travel, documents, and waiting. Digital credit can place an offer beside an urgent problem in minutes. Reduced friction is valuable when credit is appropriate, but it also removes time for reflection. A large “Get cash now” button and a small repayment schedule divide attention unevenly between today and tomorrow.

**Why can borrowers understand the cost and still accept it?**
Knowledge does not remove timing pressure. A borrower may correctly know that repeated fees are expensive but still judge tonight’s need as more important. The decision can also be rational under severe constraints if the alternative is losing work, electricity, housing, or medical care. Behavioral economics should not blame the borrower; it should examine the set of options and the way costs are presented.

**When does short-term credit become dangerous?**
Warning signs include refinancing one loan with another, borrowing for routine expenses every pay cycle, unclear total repayment, and no realistic source of repayment. The immediate relief then becomes part of a repeating system. Each loan solves today by making a future day harder, and when that day arrives, present bias may encourage another quick solution.

**How can lenders and policymakers design better choices?**
Show the full peso repayment as prominently as the amount received, standardize contract terms, test affordability, provide a short review screen, and offer restructuring before rollovers. Emergency savings, wage advances with transparent costs, and social support can widen the option set. The goal is not to remove fast credit from people who need it. It is to ensure that speed does not hide tomorrow’s burden.`,
    articleSummary: `Philippine survey data show that many loans fund day-to-day expenses and emergencies. Digital lending can meet those needs quickly, but its speed may focus attention on immediate cash rather than total repayment. Clear disclosures, affordability checks, review pauses, restructuring, and better emergency alternatives can preserve access while reducing repeated debt cycles.`,
    articleTakeaways: [
      "In the BSP survey, day-to-day expenses were the main purpose of many loans.",
      "Total repayment, affordability, and alternatives should be visible before borrowing."
    ]
  };

  await prisma.lesson.create({ data: day22Data });
  console.log("Created Lesson Day 22");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day22Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 22,
      track: track,
      questions: {
        create: [
          {
            questionText: "What distinguishes present bias from consistent impatience?",
            options: [
              "Immediate outcomes receive a special extra weight",
              "Every future month is valued exactly the same",
              "People never care about tomorrow",
              "Only rewards, not costs, are affected"
            ],
            correctAnswer: "Immediate outcomes receive a special extra weight",
            explanation: "Present bias creates a strong preference for immediate payoffs that reverses as outcomes move into the future.",
            order: 0
          },
          {
            questionText: "Which choice reversal suggests present bias?",
            options: [
              "$50 today over $55 next month, but $55 in 13 months over $50 in 12 months",
              "$55 today over $50 today",
              "$50 in 12 months over $55 in 13 months in every case",
              "Refusing all money"
            ],
            correctAnswer: "$50 today over $55 next month, but $55 in 13 months over $50 in 12 months",
            explanation: "When delayed, the individual values the larger sum, but in the present, urgency takes over.",
            order: 1
          },
          {
            questionText: "What was the most common purpose of outstanding loans in the cited BSP survey?",
            options: [
              "Luxury travel",
              "Day-to-day expenses",
              "Stock-market speculation",
              "Buying foreign currency"
            ],
            correctAnswer: "Day-to-day expenses",
            explanation: "The survey emphasized basic spending needs.",
            order: 2
          },
          {
            questionText: "Why can digital credit strengthen present bias?",
            options: [
              "It makes future repayment disappear legally",
              "It delivers immediate funds with little time or friction",
              "It guarantees lower costs than every alternative",
              "It prevents urgent borrowing"
            ],
            correctAnswer: "It delivers immediate funds with little time or friction",
            explanation: "The speed of digital access makes the immediate relief overwhelmingly attractive.",
            order: 3
          },
          {
            questionText: "Which statement treats borrowers most accurately?",
            options: [
              "Anyone accepting expensive credit is ignorant",
              "Urgent constraints can make a costly choice understandable",
              "All short-term loans are rational",
              "Present bias means income does not matter"
            ],
            correctAnswer: "Urgent constraints can make a costly choice understandable",
            explanation: "Borrowers may understand terms but face immediate crises that dominate the decision.",
            order: 4
          },
          {
            questionText: "What is a warning sign of a debt cycle?",
            options: [
              "A one-time bridge with a clear repayment source",
              "Repeatedly taking a new loan to repay the previous one",
              "Comparing several offers",
              "Reading the full contract"
            ],
            correctAnswer: "Repeatedly taking a new loan to repay the previous one",
            explanation: "Rollovers solve today's problem by escalating tomorrow's burden.",
            order: 5
          },
          {
            questionText: "Which disclosure best counters present bias?",
            options: [
              "“Cash now!” in large text and fees hidden later",
              "Total peso repayment shown as prominently as the amount received",
              "Only the monthly interest rate",
              "No repayment date"
            ],
            correctAnswer: "Total peso repayment shown as prominently as the amount received",
            explanation: "Clear presentation of the future cost helps balance out the lure of the present gain.",
            order: 6
          },
          {
            questionText: "You design a lending app. Which screen is most responsible?",
            options: [
              "One-click borrowing with no review",
              "A summary showing amount received, total repayment, due date, and alternatives",
              "A countdown that pressures the user",
              "Automatic rollover selected by default"
            ],
            correctAnswer: "A summary showing amount received, total repayment, due date, and alternatives",
            explanation: "This forces a pause and highlights future costs, counteracting impulsive friction-free borrowing.",
            order: 7
          },
          {
            questionText: "When can short-term credit be economically useful?",
            options: [
              "Never",
              "When it bridges a predictable gap, and repayment is affordable",
              "Whenever an app approves it",
              "Only when no cost is disclosed"
            ],
            correctAnswer: "When it bridges a predictable gap, and repayment is affordable",
            explanation: "Credit has legitimate uses for liquidity smoothing.",
            order: 8
          },
          {
            questionText: "What is the central policy goal in the article?",
            options: [
              "Ban every fast loan",
              "Preserve useful access while making future costs hard to ignore",
              "Make borrowing slower in every case",
              "Replace all credit with lotteries"
            ],
            correctAnswer: "Preserve useful access while making future costs hard to ignore",
            explanation: "The goal is to maintain access to necessary credit without letting present bias obscure the future debt.",
            order: 9
          }
        ]
      }
    }
  });

  // ================= DAY 23 =================
  const day23Data = {
    title: "Why Saving for the Future is So Difficult",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 23,
    track: track,
    conceptText: `On Sunday night, you promise to save part of Friday’s salary. On Friday afternoon, the salary arrives, and a new phone, dinner, and delivery app all become immediate. Saving moves to next month. The future plan was sincere; the present decision is also sincere. They belong to different moments.

Hyperbolic discounting describes how people’s valuation of future rewards falls steeply for near-term delays and more gently for distant delays. The pattern produces preference reversals. From far away, saving next month looks easy. When next month becomes today, spending now becomes unusually attractive.

A person using constant exponential discounting would value every additional month according to the same rate. A hyperbolic discounter behaves as if the first delay hurts much more than later delays. That is why “start tomorrow” can remain appealing for years.

Retirement creates the perfect challenge. The reward is decades away, while the sacrifice appears in the next paycheck. Compounding rewards early action, but the psychological structure rewards delay. Workplace plans, automatic payroll deductions, and scheduled contribution increases are attempts to close that gap.

The United States shows how strongly saving behavior depends not only on intention, but also on access to a plan and the design of the moment when a paycheck arrives.`,
    conceptSummary: `Hyperbolic discounting makes near-term delays feel much more costly than distant delays and can reverse preferences as the future approaches. A person may plan to save next month but prefer immediate spending when the paycheck arrives. Repeated postponement can turn a small delay into years of lost compounding.`,
    conceptTakeaways: [
      "Hyperbolic discounting creates preference reversals as future choices become immediate.",
      "“I will start next month” can repeat indefinitely.",
      "Automatic deductions and future contribution increases use design instead of willpower alone."
    ],
    articleTitle: "Americans and Retirement Saving Delays",
    articleText: `**Why do Americans worry about retirement and still delay saving?**
Retirement is important but rarely urgent today. A worker in their twenties may face rent, transport, debt, childcare, or education costs immediately, while retirement is forty years away. Each individual delay seems small: skipping one month will not determine an entire future. The problem is that the same decision returns every month.

**What do current survey figures show?**
The Employee Benefit Research Institute’s 2025 Retirement Confidence Survey reported that 69 percent of workers said they or a spouse had saved any money for retirement, while 64 percent were currently saving. Those are majorities, but they also leave millions without current savings. The distance between concern and action remains economically important.

**Why does access to a retirement plan matter so much?**
The same EBRI fact sheet reported a dramatic gap between workers with and without any retirement plan. A payroll plan converts saving from a repeated active decision into a routine process. Without one, a worker must open an account, select investments, decide an amount, and transfer money while resisting every immediate use for the cash.

**How expensive is waiting?**
Consider a purely illustrative example with $100 saved monthly and a constant 6 percent annual return. Starting forty years before retirement produces roughly twice as much as starting thirty years before retirement, even though contributions rise by only one-third. The exact return is never guaranteed, but the arithmetic of compounding is clear: early dollars have more time to earn returns on previous returns.

**Why are good intentions not enough?**
A worker can honestly intend to save after the next raise. When the raise arrives, lifestyle spending expands, and the new income becomes the new normal. Hyperbolic discounting repeatedly moves the starting date forward. Financial education helps people understand the problem, but an understanding that must be acted on every payday still competes with immediate rewards.

**What designs make future saving easier?**
Automatic enrollment, payroll deductions, default contribution rates, and automatic escalation after future raises reduce the number of moments requiring self-control. Emergency savings also matter because a retirement account is less likely to be raided when a separate buffer exists. The best design does not demand heroic discipline every Friday. It makes the long-term plan the path that happens unless the worker chooses otherwise.`,
    articleSummary: `In the 2025 EBRI survey, 69 percent of American workers or spouses had saved for retirement, and 64 percent were currently saving. Access to a workplace plan strongly supports action because payroll deductions reduce repeated decisions. Automatic enrollment, contribution escalation, and emergency savings can turn distant intentions into current behavior.`,
    articleTakeaways: [
      "In 2025, 69 percent of surveyed workers or spouses had saved anything for retirement.",
      "Workplace access matters because it reduces setup and repeated decision costs."
    ]
  };

  await prisma.lesson.create({ data: day23Data });
  console.log("Created Lesson Day 23");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day23Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 23,
      track: track,
      questions: {
        create: [
          {
            questionText: "What is hyperbolic discounting?",
            options: [
              "A pattern in which near-term delays are discounted especially steeply",
              "A method for calculating corporate taxes",
              "The belief that all future money is worthless",
              "A guarantee that saving returns are high"
            ],
            correctAnswer: "A pattern in which near-term delays are discounted especially steeply",
            explanation: "It explains why immediate delays feel much more painful than future delays.",
            order: 0
          },
          {
            questionText: "What is a preference reversal?",
            options: [
              "Choosing the same option at every date",
              "Planning to wait when choices are distant but choosing immediacy when the time arrives",
              "Changing currency before retirement",
              "Receiving a higher wage"
            ],
            correctAnswer: "Planning to wait when choices are distant but choosing immediacy when the time arrives",
            explanation: "Preferences shift as the payoff comes closer.",
            order: 1
          },
          {
            questionText: "What share of workers in the 2025 EBRI survey were currently saving for retirement?",
            options: [
              "14 percent",
              "40 percent",
              "64 percent",
              "89 percent"
            ],
            correctAnswer: "64 percent",
            explanation: "The EBRI survey reported 64 percent were currently saving.",
            order: 2
          },
          {
            questionText: "Why does a payroll plan increase the chance of saving?",
            options: [
              "It removes every financial constraint",
              "It reduces setup and repeated active decisions",
              "It guarantees investment profits",
              "It makes retirement immediate"
            ],
            correctAnswer: "It reduces setup and repeated active decisions",
            explanation: "It shifts saving from an active choice requiring willpower to a passive routine.",
            order: 3
          },
          {
            questionText: "What is the main financial cost of starting ten years later?",
            options: [
              "Early dollars lose years of compounding",
              "The bank deletes all later contributions",
              "Tax rates always double",
              "The worker cannot retire legally"
            ],
            correctAnswer: "Early dollars lose years of compounding",
            explanation: "Compounding relies on time, and early savings earn the most interest on interest.",
            order: 4
          },
          {
            questionText: "Why can a raise fail to start saving?",
            options: [
              "Raises are never paid",
              "Immediate lifestyle spending can absorb the new income",
              "Higher income always reduces planning",
              "Retirement accounts reject raised salaries"
            ],
            correctAnswer: "Immediate lifestyle spending can absorb the new income",
            explanation: "Hyperbolic discounting can cause immediate spending desires to overwhelm saving plans.",
            order: 5
          },
          {
            questionText: "Which tool directly addresses repeated postponement?",
            options: [
              "Automatic payroll deductions",
              "A poster saying “be disciplined”",
              "A larger menu of hundreds of funds",
              "A hidden account fee"
            ],
            correctAnswer: "Automatic payroll deductions",
            explanation: "Automation removes the need for recurring discipline.",
            order: 6
          },
          {
            questionText: "You manage employee benefits. Which program best uses hyperbolic discounting?",
            options: [
              "Ask workers to remember a manual transfer every month",
              "Enroll workers and schedule contribution increases after future raises, with opt-out",
              "Require a new form every payday",
              "Delay all information until retirement"
            ],
            correctAnswer: "Enroll workers and schedule contribution increases after future raises, with opt-out",
            explanation: "Scheduling increases in the future bypasses present bias, as the cost is delayed.",
            order: 7
          },
          {
            questionText: "Why can emergency savings support retirement saving?",
            options: [
              "It guarantees high returns",
              "It provides a separate buffer so retirement funds are less likely to be withdrawn",
              "It removes every expense",
              "It replaces all insurance"
            ],
            correctAnswer: "It provides a separate buffer so retirement funds are less likely to be withdrawn",
            explanation: "A buffer prevents urgent needs from destroying long-term compounding.",
            order: 8
          },
          {
            questionText: "What is the best summary of the lesson?",
            options: [
              "People do not care about retirement",
              "Saving failures can reflect time-inconsistent choices and system design, not only knowledge",
              "Only high-income people discount the future",
              "Compounding makes delay beneficial"
            ],
            correctAnswer: "Saving failures can reflect time-inconsistent choices and system design, not only knowledge",
            explanation: "Good intentions are undermined by psychology, meaning system design is crucial.",
            order: 9
          }
        ]
      }
    }
  });

  // ================= DAY 24 =================
  const day24Data = {
    title: "Why We Delay Important Decisions",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 24,
    track: track,
    conceptText: `A tax return may take three hours in March or three stressful hours on the final night in July. The task is almost the same, yet many people choose the second version and add anxiety, error risk, and possible penalties.

Procrastination is the costly delay of an intended action. It is not always laziness. Tasks can be confusing, unpleasant, uncertain, or emotionally threatening. Starting creates an immediate cost, while the benefit of completion arrives later. Present bias therefore favors “not now.”

Procrastination becomes an economic problem when delay changes outcomes. A late application can lose a scholarship. A delayed bill can add fees. A late tax return can create penalties or postpone a refund. Even when no money is charged, last-minute work consumes attention and increases the probability of mistakes.

Deadlines can help by turning a distant consequence into an immediate one. But one final deadline often concentrates action at the end. Intermediate deadlines, pre-filled information, reminders, and smaller first steps reduce the cost of beginning.

Germany’s electronic tax system makes filing easier than paper forms once were. Yet easier tools do not remove the psychology that makes an unpleasant task repeatedly lose to a pleasant one.`,
    conceptSummary: `Procrastination is the costly delay of an intended task. Immediate effort, uncertainty, or discomfort can outweigh delayed benefits, even when waiting increases stress and financial risk. Deadlines help, but smaller steps, reminders, pre-filled information, and intermediate deadlines are often more effective than one final date.`,
    conceptTakeaways: [
      "Procrastination is an economic behavior when delay changes costs or outcomes.",
      "Immediate task discomfort can outweigh a larger delayed benefit.",
      "A 15-minute start and intermediate deadlines can outperform a vague plan to “finish later.”"
    ],
    articleTitle: "Tax Refunds and Procrastination in Germany",
    articleText: `**Why wait when a tax refund may be available?**
The refund is delayed and uncertain; the paperwork is immediate and certain. A taxpayer must gather records, interpret categories, and confront the possibility of an error. Watching a video or cleaning the kitchen provides an immediate reward. Procrastination follows the timing of these feelings, not the final financial value.

**What does the German filing system look like?**
Germany allows electronic submission through ELSTER, the official online tax office. Its pre-filled tax-return service can provide data already reported to the tax administration, such as wage and insurance information, for review and transfer into the return. For taxpayers required to file the 2025 return without professional representation, the general deadline was 31 July 2026.

**Can waiting mean delaying your own money?**
Yes. Recent figures cited from Germany’s statistical office showed that 13.2 million taxpayers received refunds for the 2022 tax year, averaging €1,240. Not everyone receives a refund, but many voluntary filers do. For those people, procrastination effectively leaves money with the government for longer and delays when it can be saved, invested, or spent.

**What other costs appear near the deadline?**
Rushed filers may overlook deductible expenses, enter numbers incorrectly, or fail to obtain missing documents. People who are required to file can face late-filing consequences. Employers and tax advisers also experience concentrated demand. The private decision to wait can therefore create system-wide queues and workload spikes.

**Why does better software not solve everything?**
Pre-filled data lowers the amount of work, but a taxpayer must still open the system, authenticate, check the records, and make judgments. The largest psychological barrier is often the first ten minutes. When the entire task is imagined as one large unpleasant block, the option to start tomorrow remains attractive.

**How can procrastination be reduced?**
Separate preparation from submission. Create a document folder in January, schedule a 15-minute start, use a checklist, and set a personal deadline weeks before the legal one. Administrations can send timely reminders, preserve work across sessions, pre-fill reliable data, and explain the next single action. The objective is to make starting small enough that “now” can defeat “later.”`,
    articleSummary: `Germany’s ELSTER system supports electronic and pre-filled tax returns, yet taxpayers can still delay because starting feels unpleasant. For the 2022 tax year, 13.2 million taxpayers received refunds averaging €1,240. Late action can postpone refunds, increase errors, and create deadline congestion. Small starts and early personal deadlines reduce these costs.`,
    articleTakeaways: [
      "Germany offers electronic and pre-filled tax-return tools through ELSTER.",
      "Millions of German taxpayers receive refunds, so delay can postpone their own money."
    ]
  };

  await prisma.lesson.create({ data: day24Data });
  console.log("Created Lesson Day 24");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day24Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 24,
      track: track,
      questions: {
        create: [
          {
            questionText: "When is procrastination an economic problem?",
            options: [
              "Only when a person feels guilty",
              "When delay changes money, risk, quality, or opportunity",
              "Only when a government sets a deadline",
              "Whenever a task takes more than an hour"
            ],
            correctAnswer: "When delay changes money, risk, quality, or opportunity",
            explanation: "Delay is economically meaningful when it impacts tangible outcomes.",
            order: 0
          },
          {
            questionText: "Why is starting a tax return easy to postpone?",
            options: [
              "The effort is immediate while the benefit is delayed",
              "Refunds are always illegal",
              "Forms disappear if opened early",
              "Taxes have no deadlines"
            ],
            correctAnswer: "The effort is immediate while the benefit is delayed",
            explanation: "Present bias makes the immediate friction of starting outweigh the future reward of finishing.",
            order: 1
          },
          {
            questionText: "What is ELSTER?",
            options: [
              "Germany’s official online tax office",
              "A lottery platform",
              "A pension fund",
              "A gym chain"
            ],
            correctAnswer: "Germany’s official online tax office",
            explanation: "ELSTER provides electronic tax services.",
            order: 2
          },
          {
            questionText: "What does the pre-filled return service do?",
            options: [
              "Guarantees no tax is owed",
              "Provides certain reported data for review and transfer",
              "Files automatically without taxpayer responsibility",
              "Removes every possible deduction"
            ],
            correctAnswer: "Provides certain reported data for review and transfer",
            explanation: "It reduces friction but still requires taxpayer action and review.",
            order: 3
          },
          {
            questionText: "What was the general deadline for a self-filed required 2025 German return in the article?",
            options: [
              "31 January 2026",
              "30 April 2026",
              "31 July 2026",
              "31 December 2027"
            ],
            correctAnswer: "31 July 2026",
            explanation: "The article specifies 31 July 2026.",
            order: 4
          },
          {
            questionText: "Why can filing late delay a personal benefit?",
            options: [
              "It can postpone a possible refund",
              "It raises every wage",
              "It automatically cancels taxes",
              "It increases lottery odds"
            ],
            correctAnswer: "It can postpone a possible refund",
            explanation: "Procrastination leaves money with the government rather than the taxpayer.",
            order: 5
          },
          {
            questionText: "Which action best reduces the starting barrier?",
            options: [
              "Wait for motivation",
              "Schedule a 15-minute first step",
              "Imagine the whole task at once",
              "Hide the deadline"
            ],
            correctAnswer: "Schedule a 15-minute first step",
            explanation: "A small start overcomes the initial friction that causes procrastination.",
            order: 6
          },
          {
            questionText: "You run a tax agency. Which design is most useful?",
            options: [
              "One reminder after the deadline",
              "Pre-filled data, saved progress, and staged reminders",
              "A form that deletes unfinished work",
              "More complicated authentication at every page"
            ],
            correctAnswer: "Pre-filled data, saved progress, and staged reminders",
            explanation: "These interventions reduce friction and lower the immediate cost of starting.",
            order: 7
          },
          {
            questionText: "Why can one final deadline create congestion?",
            options: [
              "People spread work evenly by definition",
              "Many people postpone until the same last period",
              "Deadlines eliminate procrastination",
              "Tax offices close months early"
            ],
            correctAnswer: "Many people postpone until the same last period",
            explanation: "A single distant deadline encourages procrastination, bunching activity at the end.",
            order: 8
          },
          {
            questionText: "What is the best personal strategy from the lesson?",
            options: [
              "Create a folder early, start small, and set an earlier personal deadline",
              "Ignore documents until the legal deadline",
              "Assume a refund without filing",
              "Submit random estimates quickly"
            ],
            correctAnswer: "Create a folder early, start small, and set an earlier personal deadline",
            explanation: "This creates intermediate deadlines and lowers the friction of starting.",
            order: 9
          }
        ]
      }
    }
  });

  console.log("Finished updating Days 20 through 24.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
