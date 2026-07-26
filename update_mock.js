const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'mockContent.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newMockContent = `
  8: {
    concept: {
      title: "The Concept of Scarcity in Business",
      text: "<b>Scarcity</b> is the fundamental economic problem of having seemingly unlimited human wants in a world of limited resources.<br/><br/>For an entrepreneur, scarcity is not just a theory; it is the reality of their daily existence. There is never enough time, never enough money, and never enough skilled talent to execute every good idea. <br/><br/>This limitation forces entrepreneurs to make strategic choices. If resources were infinite, anyone could build anything, and no business would ever fail. But because resources are scarce, a founder must decide what is most important to build first, who to hire, and how to allocate their limited budget.<br/><br/>Understanding scarcity helps founders prioritize ruthlessly and avoid the trap of trying to be everything to everyone.",
      chapter: 'CHAPTER 2',
      summary: 'Scarcity is the fundamental economic reality that resources are limited while desires are infinite. For entrepreneurs, this means dealing with limited time, money, and talent. This limitation forces strategic prioritization and decision-making, as trying to do everything with limited resources usually leads to failure.',
      takeaways: [
        'Scarcity is the driving force behind all economic decisions.',
        'Entrepreneurs constantly face scarce time, capital, and talent.',
        'Scarcity forces businesses to prioritize their most critical features and goals.',
        'If resources were infinite, business strategy would be unnecessary.',
        'Acknowledging scarcity helps founders focus rather than spreading themselves too thin.'
      ]
    },
    article: {
      title: 'Why Having "Unlimited Options" Kills Startups',
      summary: 'Startups often die not from starvation, but from indigestion. When a company tries to pursue too many opportunities at once, it fails to execute any of them well due to the fundamental law of scarcity.',
      text: "It is a common myth that the best position for a new business is to have unlimited options. We often praise the visionary founder who sees twenty different ways their product could change the world. They could build a feature for enterprise clients. They could launch a consumer app. They could expand into Europe. <br/><br/>But in reality, startups rarely die because they have no options. They die because they try to pursue all of them at once. This is a failure to respect the economic law of scarcity.<br/><br/>Every time a founder says 'yes' to a new feature, a new market, or a new marketing channel, they are drawing from a finite pool of resources. The engineering team only has so many hours in a week. The bank account only holds so much cash. The founder only has so much mental bandwidth.<br/><br/>When a startup ignores scarcity and tries to build everything, it ends up building a dozen mediocre features instead of one exceptional product. It spreads its marketing budget so thin that no single channel gains traction. The team burns out trying to context-switch between conflicting priorities.<br/><br/>The most successful companies in history started by embracing scarcity. Amazon didn't start by selling everything; it sold only books. Facebook didn't launch to the world; it launched only to Harvard students. By restricting their scope, these companies concentrated their scarce resources (time and capital) into a laser focus, allowing them to dominate a small area before expanding.<br/><br/>Scarcity is not the enemy of the entrepreneur. It is the constraint that breeds focus, creativity, and ultimate success. The next time you are faced with a list of ten great ideas for your business, remember: you don't have the resources to do them all. Choose the best one, and let the rest go.",
      chapter: 'CHAPTER 2',
      takeaways: [
        'Startups often fail from pursuing too many opportunities rather than too few.',
        'Saying "yes" to an idea draws resources away from existing projects.',
        'Spreading resources too thinly leads to mediocre execution across the board.',
        'Embracing scarcity forces focus and allows a company to dominate a specific niche.',
        'Great companies historically started with extreme focus before expanding.'
      ]
    }
  },
  9: {
    concept: {
      title: "Choosing What to Build: Trade-Offs",
      text: "Because resources are scarce, every decision involves a <b>trade-off</b>. A trade-off is sacrificing one benefit in order to gain another.<br/><br/>In product development, the most famous trade-off is the 'Iron Triangle': <i>Fast, Good, or Cheap. Pick two.</i> You can build a high-quality product quickly, but it will be expensive. You can build it cheaply and quickly, but it will be low quality. <br/><br/>Entrepreneurs must make trade-offs constantly. Should we spend our marketing budget on Facebook ads (high immediate traffic, low retention) or SEO (slow growth, high long-term retention)? Should we hire one senior engineer or two junior engineers?<br/><br/>Recognizing that every choice requires giving something up is the hallmark of mature business leadership. There are no perfect solutions, only trade-offs.",
      chapter: 'CHAPTER 2',
      summary: 'A trade-off involves sacrificing one benefit to gain another, a direct result of scarcity. The classic "Iron Triangle" (Fast, Good, Cheap) illustrates this. Entrepreneurs must constantly weigh alternatives—like choosing between marketing channels or hiring strategies—understanding that every decision requires giving something up.',
      takeaways: [
        'Every business decision involves a trade-off due to limited resources.',
        'The Iron Triangle dictates you can generally only have two: Fast, Good, or Cheap.',
        'There are rarely perfect solutions in business, only strategic trade-offs.',
        'Evaluating trade-offs requires comparing the expected value of different alternatives.',
        'Mature founders accept that they must give up good ideas to pursue great ones.'
      ]
    },
    article: {
      title: 'The Hidden Cost of "Yes"',
      summary: 'Every time a founder says yes to a feature, request, or project, they are implicitly saying no to something else. Understanding trade-offs is crucial to preventing feature creep and maintaining strategic alignment.',
      text: "There is a dangerous word in the entrepreneur's vocabulary. It sounds positive, agreeable, and growth-oriented. The word is 'Yes.'<br/><br/>When a major client asks for a custom feature, the sales team says yes. When an investor suggests a new market, the CEO says yes. When the design team proposes a UI overhaul, the product manager says yes.<br/><br/>The problem is that 'yes' is never free. Because of the economic reality of scarcity, every 'yes' carries a hidden 'no'. If your engineering team is spending the next four weeks building that custom feature for one client, they are NOT spending those four weeks improving the core product for your other thousand clients.<br/><br/>This is the essence of a trade-off. You cannot evaluate a decision purely on its own merits. You must evaluate it against what you are giving up to achieve it.<br/><br/>Companies that fail to understand trade-offs fall victim to 'feature creep.' They add button after button, setting after setting, trying to satisfy every request. The product becomes bloated, slow, and confusing. By refusing to make the hard trade-off of saying 'no' to some users, they degrade the experience for all users.<br/><br/>Steve Jobs famously said, 'People think focus means saying yes to the thing you've got to focus on. But that's not what it means at all. It means saying no to the hundred other good ideas that there are. You have to pick carefully.'<br/><br/>The next time you are tempted to say 'yes' to a new initiative, pause and ask yourself: 'What is the trade-off? What are we going to stop doing so we can start doing this?' If you can't answer that question, you aren't ready to say yes.",
      chapter: 'CHAPTER 2',
      takeaways: [
        'Every "yes" in business implicitly requires saying "no" to an alternative.',
        'Failing to make trade-offs leads to bloated products and "feature creep".',
        'Decisions must be evaluated against what is being sacrificed to achieve them.',
        'Focus requires saying no to many genuinely good ideas.',
        'Before starting a new initiative, a business must decide what it will stop doing.'
      ]
    }
  },
  10: {
    concept: {
      title: "Calculating Your Personal Opportunity Cost",
      text: "<b>Opportunity Cost</b> is the value of the next best alternative that you give up when making a choice.<br/><br/>For a founder, the biggest opportunity cost is usually their own salary. If you quit a job paying $100,000 a year to start a business, and your business makes $50,000 in profit its first year, you didn't 'make' $50,000. In economic terms, you lost $50,000, because your next best alternative (the job) would have yielded more.<br/><br/>Opportunity cost also applies to time. If you spend two hours formatting a spreadsheet, the opportunity cost is the two hours you could have spent calling potential clients.<br/><br/>By constantly evaluating the opportunity cost of their time and capital, entrepreneurs can ensure they are deploying their scarce resources to the highest-yielding activities.",
      chapter: 'CHAPTER 2',
      summary: 'Opportunity cost is the value of the next best alternative forgone when making a decision. For founders, quitting a high-paying job to start a company carries a massive opportunity cost. Time also has an opportunity cost; hours spent on low-value tasks are hours not spent on high-impact growth. Evaluating opportunity cost ensures resources are deployed efficiently.',
      takeaways: [
        'Opportunity cost is the value of the alternative you gave up.',
        'A founder\'s salary is often the largest hidden cost of a startup.',
        'Economic profit accounts for opportunity costs, unlike accounting profit.',
        'Time spent on low-value tasks carries the opportunity cost of lost strategic work.',
        'Rational decisions require comparing an option against its next best alternative.'
      ]
    },
    article: {
      title: 'Are You Paying Yourself $10 an Hour?',
      summary: 'Many founders trap themselves doing low-level administrative work to "save money," failing to realize the massive opportunity cost of their time.',
      text: "Imagine you hire a brilliant, highly-paid CEO to run your company. Her salary is $200,000 a year, which breaks down to roughly $100 an hour. On her first day, you walk into her office and find her assembling Ikea desks for the new employees and fixing the office printer.<br/><br/>You would be furious. You are paying her $100 an hour for strategic vision and leadership, and she is doing $15-an-hour handyman work.<br/><br/>Yet, this is exactly how most founders treat themselves.<br/><br/>When you start a business, cash is tight. The natural instinct is to 'save money' by doing everything yourself. You design the logo. You sweep the floors. You spend three hours troubleshooting a weird glitch in your email software.<br/><br/>You look at your bank account and think, 'Great, I just saved $150 by not hiring IT support.' But you didn't save money. You incurred a massive opportunity cost. <br/><br/>If your business is going to succeed, your time as the founder must be immensely valuable. Your job is to close major deals, set the product vision, and hire great people. If you spend three hours fixing email, you just spent three hours NOT doing the things that actually move the needle.<br/><br/>This is why understanding opportunity cost is a superpower. Once you assign a high dollar value to your own time, you realize that 'doing it yourself' is often the most expensive option available. If your time is worth $100 an hour, and you can hire someone to do a task for $20 an hour, doing it yourself is costing your business $80 an hour in lost potential.<br/><br/>The best entrepreneurs ruthlessly calculate their personal opportunity cost. They delegate, outsource, or simply ignore tasks that fall below their hourly value, freeing themselves to focus on the high-leverage work that actually builds the company.",
      chapter: 'CHAPTER 2',
      takeaways: [
        'Founders often waste time on low-value tasks to "save money".',
        'Doing a $15/hour task when your time is worth $100/hour is an economic loss.',
        'Opportunity cost helps founders realize that "doing it yourself" is often expensive.',
        'Delegation is an investment to buy back high-value time.',
        'Founders must focus strictly on high-leverage, needle-moving activities.'
      ]
    }
  },
  11: {
    concept: {
      title: "Capital Scarcity: Budgeting Limited Cash",
      text: "<b>Capital Scarcity</b> is the reality that a startup has a limited amount of money in the bank. This cash reserve determines the company's <b>Runway</b>—the amount of time the business can survive before it runs out of money and dies.<br/><br/>Runway is calculated by dividing total cash by the monthly 'burn rate' (how much money the company loses each month). If you have $100,000 and burn $10,000 a month, you have 10 months of runway.<br/><br/>Capital scarcity forces founders to budget strictly. Every dollar spent on a fancy office chair is a dollar that cannot be spent on acquiring a new customer. By keeping fixed costs extremely low (bootstrapping), founders can extend their runway, giving them more time to figure out the market and achieve profitability.",
      chapter: 'CHAPTER 2',
      summary: 'Capital scarcity refers to the limited cash available to a startup, which dictates its "runway" (survival time). Runway is calculated by dividing total cash by the monthly burn rate. To survive, founders must budget strictly, keep fixed costs low, and prioritize spending that directly drives revenue or extends the runway.',
      takeaways: [
        'Capital scarcity means startups operate with a strict limit on financial resources.',
        'Runway is the number of months a company can survive before going bankrupt.',
        'Runway = Total Cash / Monthly Burn Rate.',
        'Bootstrapping and keeping fixed costs low extends runway.',
        'Strict budgeting forces founders to prioritize revenue-generating activities.'
      ]
    },
    article: {
      title: 'The Danger of Too Much Money',
      summary: 'While capital scarcity is stressful, having too much funding too early can actually destroy a startup by removing the constraints that force discipline and creativity.',
      text: "It is the dream of almost every first-time founder: to raise a massive round of venture capital. They imagine that with millions of dollars in the bank, all their problems will disappear. They can finally hire the best team, rent the best office, and run huge marketing campaigns.<br/><br/>But veteran investors know a dark secret: having too much money early on is often fatal to a startup.<br/><br/>When a company is operating under severe capital scarcity, the founders are forced to be disciplined. They cannot afford to build a product nobody wants, so they talk to customers constantly. They cannot afford expensive ad campaigns, so they rely on hustle, word-of-mouth, and creative guerrilla marketing. They only hire absolutely essential personnel. Constraint breeds creativity, focus, and lean operations.<br/><br/>When a startup suddenly receives $5 million, those constraints vanish. The founders hire a massive engineering team and spend a year building a complex product in isolation, assuming it's what the market wants. They sign a five-year lease on a beautiful office in the city. They buy expensive software tools and launch massive, unoptimized ad campaigns.<br/><br/>Because they have so much runway, they lose their sense of urgency. Because they can afford to do everything, they lose their focus. <br/><br/>A year later, they realize the product they built isn't quite right. But now they have a massive 'burn rate'—an overhead of salaries and rent that drains the bank account rapidly. They try to pivot, but a company with 50 employees is much harder to steer than a company of 3. They run out of money and collapse.<br/><br/>Capital scarcity is painful, but it is also a protective mechanism. It prevents a business from scaling its mistakes. It forces the founders to prove their economic model works on a small scale before they pour fuel on the fire. If you are currently bootstrapping your business with limited funds, don't view it as a disadvantage. View it as the discipline you need to survive.",
      chapter: 'CHAPTER 2',
      takeaways: [
        'Excessive early funding can remove necessary constraints and discipline.',
        'Capital scarcity forces founders to be creative, lean, and customer-focused.',
        'Too much money often leads to bloated teams, expensive offices, and loss of urgency.',
        'High burn rates make it incredibly difficult for a startup to pivot if they make a mistake.',
        'Scarcity acts as a protective mechanism, forcing a business to prove its model before scaling.'
      ]
    }
  },
  12: {
    concept: {
      title: "Time Scarcity: The Entrepreneur's Only True Asset",
      text: "While money can be lost and earned back, <b>Time</b> is the only strictly capped, non-renewable resource an entrepreneur has. You cannot raise a 'Series B' of time.<br/><br/>Because time is absolutely scarce, how a founder allocates their hours is the most critical economic decision they make. The <b>Pareto Principle (80/20 Rule)</b> states that roughly 80% of outcomes come from 20% of efforts. A founder's job is to relentlessly identify that 20%—the high-leverage activities like sales, strategy, and hiring—and focus their time exclusively there.<br/><br/>To combat time scarcity, successful founders use delegation. Delegation is simply the act of trading capital (paying an employee or software) to buy back time.",
      chapter: 'CHAPTER 2',
      summary: 'Time is the entrepreneur\'s only truly scarce, non-renewable asset. While capital can be replenished, time cannot. Founders must apply the 80/20 rule to focus on the 20% of activities that drive 80% of results. Delegation is the economic act of trading money to buy back time, allowing the founder to focus on high-leverage strategic work.',
      takeaways: [
        'Time is strictly capped and non-renewable, unlike financial capital.',
        'The Pareto Principle (80/20 rule) shows that most results come from a small fraction of work.',
        'Founders must focus their scarce time on high-leverage, strategic activities.',
        'Delegation is the process of spending money to reclaim time.',
        'Protecting your calendar is the most important economic defense a founder has.'
      ]
    },
    article: {
      title: 'Buying Back Your Time',
      summary: 'As a business grows, the founder must transition from being a "maker" to being an "architect," systematically using capital to buy back their time from lower-value tasks.',
      text: "In the very early days of a startup, the founder does everything. They write the code, they answer the support emails, they design the logo, and they take out the trash. This makes economic sense at the time: capital is extremely scarce, but the founder's time is available.<br/><br/>But as the business gains traction, the economic equation flips. The business starts generating cash, but the founder's time is completely maxed out at 24 hours a day. The business can no longer grow, because the founder has become the primary bottleneck.<br/><br/>To break through this ceiling, the founder must learn a new skill: buying back their time.<br/><br/>This is a difficult psychological transition. The founder knows how to answer support emails perfectly. They enjoy writing code. When they look at hiring an assistant or a junior developer, they think, 'They won't do it as well as I can, and it costs money.'<br/><br/>But this ignores the fundamental law of time scarcity. You are not paying an employee just to do a task. You are paying them to free up your calendar.<br/><br/>If you spend 10 hours a week doing customer support, and you hire someone for $20 an hour to take that over, you are spending $200 a week. What do you get for that $200? You get 10 hours of focused, uninterrupted time to work on a strategic partnership that could double the company's revenue. <br/><br/>When viewed through the lens of opportunity cost, not hiring that person is costing you a fortune.<br/><br/>The evolution of a successful entrepreneur is a continuous process of auditing their calendar, identifying the lowest-value tasks they are currently doing, and trading capital to hand those tasks to someone else. They move from being the 'maker' of the product to being the 'architect' of the business system. And an architect cannot build a skyscraper if they insist on pouring every cubic yard of concrete themselves.",
      chapter: 'CHAPTER 2',
      takeaways: [
        'In early stages, founders trade time to save money; later, they must trade money to save time.',
        'A founder who refuses to delegate becomes the primary bottleneck to company growth.',
        'You do not just pay an employee for their work; you pay them to free up your calendar.',
        'Founders must continually audit their time to eliminate or delegate low-value tasks.',
        'Growth requires transitioning from a "maker" of the product to an "architect" of the business.'
      ]
    }
  },
  13: {
    concept: {
      title: "Sunk Costs vs. Future Costs",
      text: "A <b>Sunk Cost</b> is an expense that has already been incurred and cannot be recovered. Because it is gone forever, rational economic theory dictates that sunk costs should have absolutely zero influence on your future decisions.<br/><br/>However, humans suffer from the <b>Sunk Cost Fallacy</b>. If an entrepreneur spends $50,000 building a software feature, and upon launch realizes nobody wants it, the rational decision is to abandon the feature. But the psychological pain of 'wasting' $50,000 often causes the founder to pour more money into marketing the doomed feature in a desperate attempt to justify the initial expense.<br/><br/>Great entrepreneurs train themselves to ignore sunk costs. They evaluate every decision based purely on the *future* costs required and the *future* expected benefits.",
      chapter: 'CHAPTER 2',
      summary: 'Sunk costs are past, unrecoverable expenses. The "Sunk Cost Fallacy" occurs when individuals let these past losses influence future decisions, often throwing good money after bad to avoid admitting failure. Rational entrepreneurs ignore sunk costs entirely, basing decisions solely on marginal (future) costs and expected future benefits.',
      takeaways: [
        'A sunk cost is money or time that is already gone and cannot be recovered.',
        'Sunk costs should mathematically have zero weight in future decision-making.',
        'The Sunk Cost Fallacy causes people to continue failing projects to avoid admitting loss.',
        'Throwing good money after bad is a common startup killer.',
        'Rational decisions are based strictly on future costs versus future benefits.'
      ]
    },
    article: {
      title: 'Knowing When to Quit',
      summary: 'Quitting is often viewed as a weakness, but in economics, quitting a failing strategy quickly is a sign of rational intelligence and a defense against the Sunk Cost Fallacy.',
      text: "We are raised on a diet of motivational quotes about perseverance. 'Never give up.' 'Winners never quit and quitters never win.' 'Perseverance is the key to success.'<br/><br/>While resilience is vital for an entrepreneur, blind perseverance can be financially fatal. In the world of economics, knowing exactly when to quit is a superpower.<br/><br/>Imagine you buy a ticket to a movie for $15. Thirty minutes into the film, you realize it is the worst movie you have ever seen in your life. It is painfully boring. What do you do?<br/><br/>Many people will stay in the theater for another ninety minutes. If you ask them why, they will say, 'I already paid $15. I don't want to waste my money.'<br/><br/>This is the Sunk Cost Fallacy in action. The $15 is gone. You cannot get it back whether you stay or leave. Your only choice now is how to spend the *next* ninety minutes of your life. You can spend it suffering through a terrible movie, or you can leave and spend it doing something enjoyable. Staying in the theater doesn't recover your money; it just costs you your time as well.<br/><br/>Entrepreneurs make this mistake on a massive scale. They spend two years building a product. When they launch, the market reaction is flat. Nobody is buying. But because they have poured two years of their life and all their savings into the project, they refuse to pivot or shut it down. They spend another year and their remaining credit card limits trying to force the market to care.<br/><br/>They are staying in the terrible movie because they already bought the ticket.<br/><br/>The most rational founders view their past investments—whether of time, money, or emotional energy—as completely irrelevant to the current moment. They look at the reality of the board today. If the project's future prospects do not justify its future costs, they kill it immediately.<br/><br/>Quitting a failing strategy is not a weakness. It is the intelligent reallocation of scarce resources toward a better opportunity. The faster you can identify a sunk cost and walk away, the more resources you preserve for the idea that will actually succeed.",
      chapter: 'CHAPTER 2',
      takeaways: [
        'Blind perseverance can lead to massive financial and temporal losses.',
        'The Sunk Cost Fallacy tricks people into suffering further losses to justify past expenses.',
        'Past investments of time or money are irrelevant to present-day decision making.',
        'Quitting a failing strategy quickly preserves capital and time for better opportunities.',
        'Rational founders kill failing projects immediately based on future outlook, not past effort.'
      ]
    }
  }
`;

content = content.replace(/};\s*$/, newMockContent + '};\n');

fs.writeFileSync(filePath, content);
console.log('mockContent.ts updated successfully.');
