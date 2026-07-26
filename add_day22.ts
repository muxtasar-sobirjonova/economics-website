import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 22;
  const track = "BEHAVIORAL_ECONOMICS";
  console.log(`Starting update for Day \${dayOrder} (\${track})...`);

  const lesson = await prisma.lesson.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  if (!lesson) {
    console.log(`Lesson for Day \${dayOrder} not found!`);
    return;
  }

  const updatedLesson = await prisma.lesson.update({
    where: { id: lesson.id },
    data: {
      title: 'Why We Choose Today Over Tomorrow',
      conceptText: `Present bias is a behavioral economics concept that describes a systematic overweighting of immediate outcomes relative to future outcomes. In other words, when people make decisions, “now” often receives more psychological value than “later,” even when later is economically better. This is not ordinary impatience. It is time inconsistency: the plan made today can collapse when the decision becomes immediate.

Behavioral economics uses present bias to explain why people deviate from their own long-term interests. A person may intend to save, avoid debt, or wait for a better option, but the moment of choice brings emotional pressure that changes the calculation. The result is predictable. Immediate relief, immediate pleasure, or immediate convenience often defeats delayed benefit. That is why present bias matters in borrowing, savings, health behavior, and procrastination. It is a model of how human decisions actually unfold under urgency, not a moral judgment.

The key economic point is that timing changes value. A small reward today can dominate a larger reward later. A future cost can also look strangely light until it becomes current. This asymmetry helps explain why the same person may reject an option in theory but accept it in practice when cash is needed, deadlines are near, or self-control is under strain. Present bias is one reason behavioral economics exists: standard rational-choice models are too clean to capture how people really trade off time, pressure, and consequences.`,
      conceptSummary: `Present bias means people give excessive weight to immediate outcomes and too little weight to future outcomes. It creates time-inconsistent choices, where intentions and actions do not match across time.`,
      conceptTakeaways: [
        "Present bias is about unequal valuation of now versus later.",
        "It creates time inconsistency between plans and actions.",
        "Immediate rewards and immediate relief carry extra force.",
        "Stress and urgency make the bias stronger.",
        "Behavioral economics uses it to explain real decision patterns."
      ],
      articleTitle: 'Why People Use Tala Even When They Know the Cost',
      articleText: `**Question 1: What economic problem does Tala solve?**
Tala solves a liquidity timing problem. Its Philippines platform offers personal loans through a mobile app, with loan access marketed up to PHP 25,000. Economically, that matters because many households face spending needs that arrive before income does. Rent, transport, medicine, and emergency bills do not wait for payday. Tala shortens the distance between need and cash, which is why its product has value even when the borrowing cost is high.

**Question 2: Why does present bias make Tala attractive?**
Present bias makes the immediate benefit of cash feel more important than the later burden of repayment. Behavioral economics treats this as a time-inconsistent preference: people often care more about what happens now than what happens later, even when they know the later cost is substantial. In a loan decision, the present benefit is concrete and vivid, while the repayment cost is delayed and abstract. That difference is not cosmetic. It changes choice.

**Question 3: Why do borrowers accept a costly loan instead of waiting?**
Because waiting itself can be costly. If a borrower is facing a utility cutoff, a missed rent payment, or a household emergency, delay can produce a larger loss than the loan’s fee. Tala’s appeal lies in compressing time: it converts an urgent shortage into immediate purchasing power. That is why the decision can be economically understandable even when the loan is expensive. Borrowers are often comparing a known fee against an uncertain but potentially larger short-term loss.

**Question 4: How does the design of digital credit affect behavior?**
Digital lending reduces friction on the front end and pushes consequences into the future. The application is simple, the access is fast, and the decision arrives quickly. Behavioral economics predicts that this design amplifies present-biased choice because the gain is immediate while the cost is postponed. The borrower experiences the benefit at the exact moment of distress, while repayment remains distant enough to be mentally discounted. That is not a side effect. It is the mechanism.

**Question 5: What does Tala’s scale tell us about borrower behavior?**
Tala says it has served millions of customers, which indicates that the demand for instant credit is broad rather than exceptional. That scale matters because it shows a structural pattern, not isolated personal weakness. Many households operate with weak savings, irregular income, and limited access to formal banks. In that environment, fast credit fills a gap that the traditional financial system leaves open. Present bias helps explain why the same product continues to attract borrowers even after its cost is known.

**Question 6: What is the economic lesson for policy and research?**
The lesson is that borrowing behavior cannot be understood by interest rate alone. Time, urgency, and choice architecture also matter. Present bias means people may sincerely plan to avoid expensive credit and still take it when the situation becomes immediate. That is why policy should reduce liquidity shocks, improve transparency, and offer safer short-term alternatives rather than relying only on warnings. The problem is not only debt. The problem is the timing of pressure and the way the market monetizes it.

### Comprehension Questions
- **Why is Tala attractive to borrowers?** Because it provides fast access to cash when money is needed immediately. (Speed is valuable when the need is urgent.)
- **What is present bias?** It is the tendency to value immediate outcomes more than future outcomes. (Later consequences are often discounted too heavily.)
- **Why can a borrower choose an expensive loan rationally?** Because the cost of waiting may be worse than the loan fee. (Borrowers often compare the loan with a bigger emergency.)
- **How does digital design affect the decision?** It makes borrowing easy now and repayment psychologically distant. (Low friction increases the pull of immediate action.)
- **What does Tala’s scale suggest?** That demand for instant credit is widespread. (Large usage signals a structural financial need.)
- **What should policy focus on?** Reducing liquidity shocks and offering safer short-term options. (The goal is to reduce future harm, not just warn borrowers.)
- **Why is present bias important in behavioral economics?** It explains why people’s choices change when time and urgency change. (Standard models often miss this time inconsistency.)
- **Why does repayment feel weaker than the loan benefit?** Because repayment happens later and is less emotionally vivid. (Future costs are easier to underweight.)
- **What kind of households are especially exposed to this pattern?** Households with weak savings and irregular income. (They face more timing mismatches and more pressure.)
- **What is the central economic tension in this case?** The borrower chooses between immediate relief and future repayment burden. (Present bias shifts the balance toward the immediate side.)

### Hard Logical Questions
1. If a borrower knows the interest rate is high but still borrows, what does that tell you about the relationship between knowledge and choice? (Consider why information alone may not overcome urgency.)
2. Why can a loan be attractive even when it worsens total welfare over time? (Think about the cost of not solving the immediate problem.)
3. If the repayment date were moved closer, would the loan become more or less attractive? (Consider how proximity changes the emotional weight of cost.)
4. Why does a fast approval process matter more under present bias than under standard rational choice? (Think about the role of friction and delay.)
5. How can the same borrower reject the loan in the morning and accept it at night? (Consider time inconsistency and changing emotional pressure.)
6. What happens when a household has no emergency savings? (Ask how the lack of a backup option affects borrowing demand.)
7. Why might a low-cost loan with slow approval lose to a higher-cost instant loan? (Compare timing benefits with price differences.)
8. What does the popularity of Tala suggest about the financial system around it? (Think about gaps in formal credit access.)
9. How does present bias help explain repeated borrowing? (Each new shock resets attention to the present.)
10. What would a better product need to preserve while reducing harm? (Balance speed, access, and protection from excessive future cost.)`,
      articleSummary: `Tala works because it provides immediate liquidity in situations where timing matters more than abstract cost. Present bias helps explain why borrowers choose fast cash now even when they know repayment will be expensive later.`,
      articleTakeaways: [
        "Tala addresses a timing mismatch between income and urgent spending.",
        "Present bias increases the value of immediate relief.",
        "Borrowers often compare the loan with a worse immediate loss.",
        "Digital design strengthens short-term choice by reducing friction.",
        "Better policy must reduce pressure, not only criticize borrowing."
      ],
    }
  });

  console.log(`Successfully updated Day \${dayOrder}: \${updatedLesson.title}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
