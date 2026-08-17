import { PrismaClient, Track } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const track = Track.BEHAVIORAL_ECONOMICS;
  const daysToUpdate = [15, 16];

  console.log("Updating Days 15 and 16 for Behavioral Economics...");

  await prisma.lesson.deleteMany({
    where: { track, dayOrder: { in: daysToUpdate } }
  });

  await prisma.quiz.deleteMany({
    where: { track, dayOrder: { in: daysToUpdate } }
  });

  // ================= DAY 15 =================
  const day15Data = {
    title: "Why Losing Feels Worse Than Winning Feels Good",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 15,
    track: track,
    conceptText: `A company doesn't raise its prices. It doesn't cut any of the features customers are paying for. It simply stops giving away something that used to be free. Complaints flood in anyway, often louder than they would if prices had actually gone up.

This is loss aversion: the tendency to feel the pain of losing something more intensely than the pleasure of gaining something of equal value. Daniel Kahneman and Amos Tversky showed in the late 1970s that losses are typically felt about twice as strongly as equivalent gains. The dollar amount rarely explains the reaction. The direction of the change does.

Picture a small software company that has offered free phone support for five years. Costs rise, so it starts charging $10 a month for phone support while keeping the software price the same. A brand-new customer who never had free support wouldn't blink at a $10 add-on. But an existing customer, losing something they already considered theirs, reacts as if they'd been robbed, even though their total possible spending barely changed.

This is why removing a benefit rarely feels neutral. The moment something becomes "mine," losing it registers on a completely different emotional scale than never having received it at all. Businesses that ignore this distinction routinely underestimate backlash because they count dollars while customers count losses.

So what happens when an entire company removes something millions of people had come to expect for free, not quietly, but all at once, in public?`,
    conceptSummary: `Loss aversion means losing something feels far worse than gaining the same thing feels good, with losses felt roughly twice as strongly as equivalent gains. This is why removing a free benefit rarely feels neutral to the person losing it, even when the actual cost is small. Businesses that ignore this distinction consistently underestimate how strongly customers react when something they considered theirs quietly disappears.`,
    conceptTakeaways: [
      "Loss aversion: people feel the pain of a loss roughly twice as strongly as the pleasure of an equivalent gain (Kahneman & Tversky).",
      "A price of $0 becoming any price above $0 is processed as a loss, no matter how small the new price is.",
      "Removing a benefit is not economically the same as never offering it in the first place; the size of the reaction is driven by the loss, not by the final price."
    ],
    articleTitle: "Why did British Airways scrap free drinks on the same day its own cabin crew went on strike over pay?",
    articleText: `On 11 January 2017, two things happened to British Airways passengers at once. Cabin crew represented by the Unite union began a 48-hour strike over pay, a dispute involving roughly 2,900 "mixed fleet" crew hired since 2010. On that same date, BA ended free food and drinks on short-haul economy flights from Heathrow and Gatwick, a policy it would extend to London City and Stansted by that summer. British newspapers didn't miss the irony. One headline called the airline the "Fawlty Towers of the sky." A carrier that had spent decades marketing itself as "the world's favourite airline" was now charging economy passengers for a bottle of water while its own crew picketed outside over wages.

**What exactly changed for the passenger sitting in seat 14C?**
Nothing about the flight itself changed. Same plane, same seats, same crew. What changed was the till. Water cost £1.80, tea or coffee £2.30, a beer £4, a glass of wine £4.50, and a bacon roll £4.75. Cash was no longer accepted; passengers paid by card, contactless, or Avios loyalty points. Business-class travelers noticed nothing. They kept a free menu, which was upgraded further that spring. The change applied only to the economy cabin, on short-haul routes that made up the large majority of BA's schedule.

**Why would a full-service airline start acting like a budget carrier?**
CEO Alex Cruz, who had previously run the airline group's low-cost Spanish subsidiary, was executing a cost-cutting plan shaped by two pressures. Since 2014, BA had already refitted 95 short-haul aircraft with denser interiors, and earlier in 2016 it had collapsed its short-haul fares into three tiers, Basic, Plus, and Plus Flex, with Basic passengers charged separately for checked bags. Add the pound's fall after the UK's Brexit referendum in June 2016, which raised the cost of everything BA bought in dollars, from jet fuel to aircraft leases, and the math pointed toward Ryanair and easyJet, its two biggest short-haul rivals, both of which had never given away food in the first place.

**So why did BA's move generate far more outrage than easyJet ever gets for charging the same prices?**
This is where the reaction stops being about money and starts being about psychology. EasyJet customers never expected a free gin and tonic, so paying for wine costs them nothing they thought they already owned. BA customers, especially long-time flyers, had received that same drink for free for years. One BA passenger, reacting to a related cutback that same year on a different route, told the airline: "There was nothing wrong with the service I've been used to for over 30 years. It has gone downhill rapidly." Losing a benefit you consider yours produces a sharper, more personal reaction than never receiving it in the first place, even when the actual price difference is identical.

**Could you actually test whether it was the loss, not the price, that made people angry?**
British Airways ran the test without meaning to. Passengers used to years of free catering complained publicly, on social media, in national newspapers, and to BA's press office, over items costing as little as £1.50. Passengers on Ryanair and easyJet, paying the same or higher prices for the same snacks, rarely generate national headlines over a bag of crisps. The money barely moved. What moved was the reference point. BA passengers were measuring the new price against "free," not against "what a snack should cost," and any number above zero registered as a loss.

**What does BA's catering decision teach a business, or anyone comparing two outcomes?**
Removing a benefit is never economically identical to never offering it, even when the final price ends up the same. A business planning to cut a "free" perk should expect a reaction sized to the loss, not to the cost. BA's leadership underestimated exactly this and spent much of 2017 fielding stories about it. The same logic applies far beyond airplanes: a discount that quietly expires, a free trial that starts billing, a bonus that becomes expected and then disappears, all trigger loss aversion regardless of the actual money involved. The lesson isn't that companies should never remove free things. It's that what something is compared to can matter more than what it actually costs.`,
    articleSummary: `In January 2017, British Airways ended free food and drinks on short-haul economy flights, on the same day its own cabin crew struck over pay. Passengers reacted with outrage over prices as low as £1.50, far stronger than budget-airline customers show for identical charges. The difference wasn't the money. It was that BA passengers were losing something they had always received for free.`,
    articleTakeaways: [
      "On 11 January 2017, British Airways ended free food and drinks on short-haul economy flights from Heathrow and Gatwick, charging as little as £1.50 for a soft drink.",
      "Budget airlines like Ryanair and easyJet charge similar or higher prices for the same items without triggering comparable backlash, because their customers never had a 'free' reference point."
    ]
  };

  await prisma.lesson.create({ data: day15Data });
  console.log("Created Lesson Day 15");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day15Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 15,
      track: track,
      questions: {
        create: [
          {
            questionText: "According to loss aversion, how do people typically feel about losing something compared to gaining an equivalent amount?",
            options: [
              "Losses and gains feel roughly the same in intensity",
              "Losses feel roughly twice as intense as an equivalent gain",
              "Gains feel more intense than equivalent losses",
              "Neither losses nor gains produce a measurable emotional reaction"
            ],
            correctAnswer: "Losses feel roughly twice as intense as an equivalent gain",
            explanation: "Kahneman and Tversky found a clear asymmetry between losses and gains.",
            order: 0
          },
          {
            questionText: "Why did the price change on BA's short-haul flights generate a stronger reaction than the same prices charged by easyJet or Ryanair?",
            options: [
              "BA's prices were significantly higher than the budget airlines' prices",
              "BA passengers had a different reference point: they were used to getting these items for free",
              "Budget airline passengers are less likely to complain publicly",
              "BA operates only long-haul flights, so passengers were confused"
            ],
            correctAnswer: "BA passengers had a different reference point: they were used to getting these items for free",
            explanation: "The difference was the reference point, not the actual amount charged.",
            order: 1
          },
          {
            questionText: "What does the BA case demonstrate about removing a free benefit versus never offering it in the first place?",
            options: [
              "They produce identical customer reactions since the final price ends up the same",
              "Removing a benefit generates a reaction sized to the loss, not to the cost",
              "Removing a benefit is always cheaper for a business than never offering it",
              "Customers eventually stop noticing free benefits, so removing them has no effect"
            ],
            correctAnswer: "Removing a benefit generates a reaction sized to the loss, not to the cost",
            explanation: "The reaction depends on the psychological loss of the benefit.",
            order: 2
          },
          {
            questionText: "Based on the lesson, what is the danger for a business that treats a benefit change purely in dollar terms?",
            options: [
              "It risks charging customers too much money overall",
              "It risks underestimating the size of the backlash, since customers react to the loss rather than the number",
              "It risks government regulation of its pricing",
              "It risks losing market share to competitors that charge nothing at all"
            ],
            correctAnswer: "It risks underestimating the size of the backlash, since customers react to the loss rather than the number",
            explanation: "BA's actual charges were small, but the perceived loss was large.",
            order: 3
          },
          {
            questionText: "On 11 January 2017, which two airports were first affected by BA's new catering charges?",
            options: [
              "London City and Stansted",
              "Heathrow and Gatwick",
              "Manchester and Edinburgh",
              "All UK airports simultaneously"
            ],
            correctAnswer: "Heathrow and Gatwick",
            explanation: "London City and Stansted were added later.",
            order: 4
          },
          {
            questionText: "Which passengers were not affected by the January 2017 change?",
            options: [
              "Passengers connecting from long-haul flights",
              "Business-class passengers on short-haul flights",
              "Passengers flying on Basic economy fares",
              "Passengers using Avios points to pay"
            ],
            correctAnswer: "Business-class passengers on short-haul flights",
            explanation: "Business-class retained a free, upgraded menu.",
            order: 5
          },
          {
            questionText: "Which payment methods could economy passengers use to buy food or drinks after the change?",
            options: [
              "Cash only",
              "Card, contactless, or Avios points",
              "Cash or personal check only",
              "The items remained free, just limited in quantity"
            ],
            correctAnswer: "Card, contactless, or Avios points",
            explanation: "Cash was no longer accepted.",
            order: 6
          },
          {
            questionText: "You are a BA marketing executive in late 2016, trying to reduce backlash before the January 2017 catering change goes live. Based on the lesson's reasoning about loss aversion, which approach fits best?",
            options: [
              "Announce the change loudly right before it happens to maximize press attention",
              "Frame the change as part of lowering ticket fares overall, rather than presenting it as a pure loss",
              "Give business-class passengers extra free items to distract attention",
              "Say nothing and hope customers do not notice"
            ],
            correctAnswer: "Frame the change as part of lowering ticket fares overall, rather than presenting it as a pure loss",
            explanation: "Framing the change helps offset the perceived loss.",
            order: 7
          },
          {
            questionText: "You run a small software company that has offered free phone support for five years. Using the concept page's reasoning, what should you expect if you start charging $10 a month for phone support without changing anything else?",
            options: [
              "No reaction at all, since $10 is a small amount",
              "A stronger reaction from long-time customers than from brand-new customers who never had free support",
              "A stronger reaction from new customers than from long-time customers",
              "Equal reactions from all customers regardless of how long they've used the product"
            ],
            correctAnswer: "A stronger reaction from long-time customers than from brand-new customers who never had free support",
            explanation: "Existing customers feel the loss of something they considered theirs.",
            order: 8
          },
          {
            questionText: "What happened to British Airways' cabin crew on the same day the catering change took effect?",
            options: [
              "They received a pay raise",
              "About 2,900 'mixed fleet' crew members were striking over pay",
              "They went on strike demanding free catering for passengers",
              "They were offered discounted BA shares"
            ],
            correctAnswer: "About 2,900 'mixed fleet' crew members were striking over pay",
            explanation: "The strike created a stark contrast with the catering cutbacks.",
            order: 9
          }
        ]
      }
    }
  });

  // ================= DAY 16 =================
  const day16Data = {
    title: "Why We Judge Results Compared to a Starting Point",
    tag: "ECON",
    timeEstimate: 10,
    dayOrder: 16,
    track: track,
    conceptText: `Two employees open the same email on the same morning. Both have received a salary increase to 650,000 Norwegian kroner a year. One closes the message smiling. The other reads it twice and feels disappointed. The final number is identical, so why does it feel like success to one person and failure to the other?

This is the power of a reference point: the standard people use to decide whether an outcome feels good, bad, fair, or unfair. The first employee earned 570,000 kroner last year and expected only a small raise. For them, 650,000 looks like a major gain. The second employee expected 700,000 after learning what colleagues in similar roles earned. For them, the same 650,000 looks like a shortfall. The salary did not change between the two people. The comparison did.

Reference points can come from several places. A previous salary can become one. A colleague's income can become another. So can a promise from a manager, a number seen in a job advertisement, or the raise someone expected before a meeting. Daniel Kahneman and Amos Tversky placed this idea at the center of prospect theory: people do not judge outcomes only by their absolute size. They judge changes relative to a starting point.

That starting point changes economic behavior. Employees who feel underpaid may negotiate, reduce effort, search for another job, or leave. Employees who feel fairly rewarded may stay even when their absolute salary is lower than someone else's. For businesses, the important number is therefore not only what appears on a payslip. It is the number employees place beside it in their minds.

So what happens in a country where comparing incomes is not based on rumors around the lunch table, but on public tax records that millions of people can search?`,
    conceptSummary: `A reference point is the standard people use to judge whether an outcome feels positive or negative. It may come from a previous salary, an expectation, a colleague's income, or a market rate. Because people evaluate changes relative to these starting points, two identical outcomes can create completely different reactions. The result stays the same; the comparison changes its meaning.`,
    conceptTakeaways: [
      "Reference points: people judge outcomes against a starting point, not only by the final number.",
      "The same salary can feel like a gain when compared with last year's pay and like a loss when compared with a colleague's income."
    ],
    articleTitle: "Why did Norway make everyone's income easier to compare?",
    articleText: `For generations, Norway's tax lists have been public. The modern system is not a company spreadsheet showing each worker's exact salary; it is a government record of taxable income, net wealth, and tax. In 2001, these records became easily searchable online. Suddenly, finding another person's income no longer required visiting a public office or reading a local newspaper. It took a name and a few clicks.

The policy grew from a Norwegian belief that openness can support trust and accountability. Public records allow journalists and citizens to examine inequality, tax contributions, and suspicious gaps between visible lifestyles and declared income. But transparency also created a second use that had little to do with checking the tax system: comparison.

Norway later added privacy protections. The Norwegian Tax Administration now requires users to log in, and a person can see who searched for them. Yet the tax lists remain searchable. The country therefore offers something economists rarely receive: a real-world environment where income comparisons can be observed rather than imagined in a laboratory.

**What did Norwegians actually do with this information?**
Statistics Norway researchers Daniel Reck, Joel Slemrod, and Trine Vattø examined more than one million searches made in 2014 and 2015. If people mainly used the tax lists to investigate tax avoidance, searches should have focused on suspiciously wealthy strangers or businesses. Instead, many searches followed the shape of social networks: people looked up others near them in age, location, and personal connection.

In other words, the tax system had also become a comparison system. A neighbor could check another neighbor. A former classmate could look up someone from school. An employee could search for a manager, a colleague, or a person who had moved to a competing company. The record answered a simple question that people constantly ask but rarely say aloud: how am I doing compared with them?

**That question matters because income has two values.**
One is absolute: what the money can buy. The other is relative: what the number says about status, fairness, and progress. A raise can improve the first value while damaging the second. An employee may afford more than last year and still feel worse after discovering that everyone around them received even more.

**How can a raise feel like a loss when the employee is earning more?**
Consider Ingrid, a fictional employee at an Oslo technology firm. Her manager increases her annual pay from 600,000 to 630,000 kroner. Before speaking to anyone, Ingrid sees the change as a 30,000-kroner gain. Then she learns that a colleague with similar experience earns 670,000. The raise remains in her bank account, but her reference point moves from her old salary to her colleague's salary.

Now the same outcome is processed differently. Ingrid is no longer asking, 'Did I earn more than last year?' She is asking, 'Why am I earning less than someone doing similar work?' The first comparison produces satisfaction. The second produces disappointment. Nothing about the payslip changed. The meaning did.

This distinction explains why companies can spend more on salaries and still create frustration. A firm might give every employee a 5 percent raise and expect morale to improve. But if market salaries rose by 10 percent, or if some teams received much larger increases, the company has created new reference points. Employees evaluate the raise against those comparisons, not against zero.

**Did easier income comparison make Norwegians happier?**
Not equally. Economist Ricardo Perez-Truglia studied the 2001 shift that made Norwegian tax records easy to access online. His research found that greater transparency widened the happiness gap between higher- and lower-income people by 29 percent and the life-satisfaction gap by 21 percent. Higher-income people could confirm that they were doing well. Lower-income people received an uncomfortable new comparison.

The result does not mean transparency made every lower-income person unhappy or every higher-income person proud. It shows that information changes self-perception. Before online access, someone might compare their salary with their own past, a few close friends, or a rough guess about the national average. After access expanded, the comparison set became larger and more precise.

This is why social media can produce a similar effect even without publishing salaries. A student may feel satisfied with a holiday, phone, grade, or internship until seeing what everyone else appears to have. The outcome did not become worse. The reference point moved upward.

**Can salary transparency also make workplaces fairer?**
Yes, and this is where the economics becomes more complicated. Comparison can reduce satisfaction, but information can also reveal discrimination and strengthen negotiation. A 2026 Statistics Norway discussion paper by Cristiano Carvalho and Trine Vattø estimates that Norway's move to searchable online tax records reduced within-firm gender wage gaps by 2.2 percentage points, or 8.7 percent, with the change driven by rising female wages.

The study does not prove that publishing income automatically solves unequal pay everywhere. Norway's institutions, labor market, and culture matter. But it shows why employers and governments debate transparency so seriously. Information can create stress, envy, and status competition. It can also give underpaid workers evidence that something is wrong.

For an employee, the comparison may begin as an emotion: 'This feels unfair.' It can then become an economic action: asking for a raise, joining a union, changing jobs, or choosing a different career. When thousands of workers respond this way, reference points influence wage setting, staff turnover, recruitment costs, and the distribution of income across an economy.

**What should a company learn from Norway's great income comparison experiment?**
A salary never arrives alone. It arrives beside an expectation, a previous salary, a market rate, and the pay of other people. Companies that ignore those comparisons can offer objectively generous packages and still lose trust. Companies that explain salary bands, promotion rules, and performance criteria give employees a clearer and more defensible reference point.

This does not mean every salary must be identical or completely public. Different responsibilities, experience, performance, and labor-market conditions can justify different pay. The lesson is that unexplained differences are rarely judged as neutral. When employees cannot see the rule, they often create their own explanation - and that explanation may be unfairness.

Norway's tax lists show both sides of transparency. Comparison can make the same paycheck feel smaller without removing a single krone. It can also expose differences that employers would prefer to keep invisible. The number on the payslip matters. But the number placed beside it may matter even more.`,
    articleSummary: `Norway's searchable tax lists made income comparison unusually easy. Research based on more than one million searches suggests people often used the records socially, while other studies found that transparency widened well-being gaps but may also have reduced gender wage differences. The case shows why salaries affect motivation and negotiation through both purchasing power and the reference points employees use to judge fairness.`,
    articleTakeaways: [
      "Norway's tax lists publish taxable income, net wealth, and tax information; they are not exact employer salary lists.",
      "Research found that greater income transparency widened well-being differences between higher- and lower-income people.",
      "Transparency can create uncomfortable comparisons, but it can also strengthen wage negotiation and expose unfair pay differences."
    ]
  };

  await prisma.lesson.create({ data: day16Data });
  console.log("Created Lesson Day 16");

  await prisma.quiz.create({
    data: {
      title: "Quiz: " + day16Data.title,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder: 16,
      track: track,
      questions: {
        create: [
          {
            questionText: "What is a reference point in behavioral economics?",
            options: [
              "The final amount of money a person receives",
              "The standard used to judge whether an outcome feels good or bad",
              "The legal minimum salary set by a government",
              "The average cost of producing one more unit"
            ],
            correctAnswer: "The standard used to judge whether an outcome feels good or bad",
            explanation: "The final amount is the outcome being judged, while the reference point is what it is compared against.",
            order: 0
          },
          {
            questionText: "Why can two employees earning the same salary feel differently about it?",
            options: [
              "One salary must have been calculated incorrectly",
              "Employees always prefer secret compensation systems",
              "They may compare the salary with different expectations or alternatives",
              "Identical salaries always create identical satisfaction"
            ],
            correctAnswer: "They may compare the salary with different expectations or alternatives",
            explanation: "Different reactions do not require an accounting error; they can result from different comparisons.",
            order: 1
          },
          {
            questionText: "Which of the following can become a salary reference point?",
            options: [
              "A previous salary, a colleague's pay, or an expected raise",
              "Only the legal minimum wage in the country",
              "Only the employee's current monthly expenses",
              "A random number unrelated to work or income"
            ],
            correctAnswer: "A previous salary, a colleague's pay, or an expected raise",
            explanation: "Many standards can be used to judge pay, not just minimum wage or expenses.",
            order: 2
          },
          {
            questionText: "What is the main trade-off created by income transparency?",
            options: [
              "It lowers every salary while increasing every tax bill",
              "It can create painful comparisons while also exposing unfair pay",
              "It prevents workers from negotiating with employers",
              "It guarantees that every employee receives equal compensation"
            ],
            correctAnswer: "It can create painful comparisons while also exposing unfair pay",
            explanation: "Transparency reveals differences that might be painful or provide evidence of unfairness.",
            order: 3
          },
          {
            questionText: "Amir's salary rises from 500,000 to 550,000 kroner. He is pleased until he learns that colleagues in similar roles earn 600,000. What best explains the change?",
            options: [
              "His purchasing power immediately fell below last year's level",
              "His reference point shifted from his old salary to his colleagues' salaries",
              "His employer secretly cancelled the salary increase",
              "He stopped understanding the value of Norwegian currency"
            ],
            correctAnswer: "His reference point shifted from his old salary to his colleagues' salaries",
            explanation: "The raise remains; only Amir's comparison changes.",
            order: 4
          },
          {
            questionText: "A company gives everyone a 5 percent raise, but market salaries for the same jobs rise by 10 percent. Why might morale still fall?",
            options: [
              "Employees may compare their raise with the faster-rising market rate",
              "Employees are unable to recognize any increase in income",
              "A raise always reduces satisfaction regardless of its size",
              "Market salaries cannot influence employees inside a company"
            ],
            correctAnswer: "Employees may compare their raise with the faster-rising market rate",
            explanation: "Outside job offers and published pay ranges often become important reference points.",
            order: 5
          },
          {
            questionText: "You manage a company introducing salary bands. Which approach best uses the lesson from Norway?",
            options: [
              "Publish clear ranges and explain how experience and responsibility affect placement",
              "Give every employee a different number without explaining the criteria",
              "Ban employees from discussing compensation with one another",
              "Change salaries frequently so no reference point can form"
            ],
            correctAnswer: "Publish clear ranges and explain how experience and responsibility affect placement",
            explanation: "Unexplained differences encourage employees to create their own, often negative, interpretation.",
            order: 6
          },
          {
            questionText: "You are an employee who discovers a colleague earns more for similar work. What is the most economically informed first response?",
            options: [
              "Assume discrimination immediately and resign the same day",
              "Gather information about responsibilities, experience, and market rates before negotiating",
              "Ignore the difference because comparisons never matter",
              "Demand identical salaries without considering job differences"
            ],
            correctAnswer: "Gather information about responsibilities, experience, and market rates before negotiating",
            explanation: "The gap may be unfair, but more information is needed before deciding why it exists.",
            order: 7
          },
          {
            questionText: "A government is considering public income records. Which outcome should policymakers prepare for?",
            options: [
              "Transparency may support accountability while increasing status comparison",
              "Transparency will automatically make every citizen happier",
              "Public records will eliminate all wage differences within one year",
              "Citizens will use the information only to investigate tax fraud"
            ],
            correctAnswer: "Transparency may support accountability while increasing status comparison",
            explanation: "Norwegian evidence suggests well-being effects differ across income groups and encourages social comparison.",
            order: 8
          },
          {
            questionText: "Which question best helps someone identify the reference point shaping a reaction?",
            options: [
              "How much did the company spend producing this outcome?",
              "What am I comparing this result with?",
              "Did every person receive exactly the same outcome?",
              "Can this result be expressed in another currency?"
            ],
            correctAnswer: "What am I comparing this result with?",
            explanation: "A reference point is the specific standard used to judge the outcome.",
            order: 9
          }
        ]
      }
    }
  });

  console.log("Finished updating Days 15 and 16.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
