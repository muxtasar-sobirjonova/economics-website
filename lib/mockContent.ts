export interface MockLessonContent {
  concept?: {
    title: string;
    text: string;
    chapter: string;
    summary: string;
    takeaways: string[];
  };
  article?: {
    title: string;
    summary: string;
    text: string;
    chapter: string;
    takeaways: string[];
  };
}

export const MOCK_CONTENT: Record<number, MockLessonContent> = {
  1: {
    concept: {
      title: 'What Is Entrepreneurship Economics?',
      text: `When a company succeeds, we tend to rewrite its history. We compress years of uncertainty into a neat, satisfying sentence: “The founder had a great idea.” It sounds logical, almost inevitable. And yet, it is mostly wrong.<br/><br/>Ideas are everywhere. At any given moment, thousands of people are thinking about the same problems and building similar products. They read the same trends, use similar technologies, and often compete for the same talent and capital. Still, only a small fraction manage to build something that actually works.<br/><br/>So the more interesting question is not where ideas come from, but why similar starting points lead to very different outcomes.<br/><br/>The difference appears in the decisions founders make when they cannot properly evaluate their options. A person deciding whether to build a product usually does not know if customers will care, whether the problem is large enough, or how competitors might respond. Even simple assumptions—like whether people will pay or how they will use the product—are often uncertain at the beginning.<br/><br/>These decisions matter because resources are limited. Time, money, and attention can only be used in one direction at a time. If you choose one path, you give up others. Some of those alternatives may later turn out to be better. This is what opportunity cost looks like in practice.<br/><br/>The problem becomes harder because information is weak. Early signals are often incomplete or misleading. Users may say they like something but behave differently. Early adopters are not the same as mainstream customers. Data comes slowly, and it is not always clear what it means.<br/><br/>Because of this, many early actions are not about executing a plan. They are about learning. Founders run small experiments—launching a basic version of a product, changing prices, or targeting a different group of users—to see what happens. These experiments provide information, but they also use up time and money. And even then, uncertainty does not fully disappear.<br/><br/>Netflix’s move from DVD rentals to streaming shows this clearly. The direction of the industry was visible, but the timing was not. Investing in streaming required large upfront costs, while demand was still uncertain. At the same time, the DVD business was still making money. Moving toward streaming meant slowly letting go of a working model without knowing if the new one would fully succeed.<br/><br/>Situations like this are hard to describe using simple models. Founders are not choosing from a fixed list of options. Their choices change the situation itself, and some options disappear once a decision is made. Even with more funding, this problem remains. More money gives more options, but it does not remove the need to choose between them.<br/><br/>Looking at entrepreneurship through economics helps make sense of this. Concepts like scarcity, incentives, competition, and information still apply, but they behave differently here. Markets are not fully formed, and key variables—like demand or pricing—are still changing.<br/><br/>Decisions cannot wait until everything becomes clear. Waiting is also a decision, and it often has a cost. Founders move forward with limited information, adjust when they are wrong, and commit resources without knowing the final outcome.<br/><br/>In this sense, entrepreneurship is less about generating ideas and more about making decisions under uncertainty. What matters most is not the idea itself, but how decisions are made—how resources are used, how quickly mistakes are noticed, and how new information is interpreted.`,
      chapter: 'CHAPTER 1',
      summary: 'Entrepreneurship economics explains how founders make decisions when the future is uncertain and resources are limited. It focuses on how entrepreneurs choose between different paths, use limited time and money, learn from experiments, and adjust when reality does not match expectations. The field shows that success depends not only on having a good idea, but also on making better decisions with incomplete information.',
      takeaways: [
        'Ideas matter less than decisions under uncertainty.',
        'Limited resources force entrepreneurs to make trade-offs.',
        'Opportunity cost means every choice has a hidden cost.',
        'Experiments help founders learn what works.',
        'Successful entrepreneurs adapt as new information appears.'
      ]
    },
    article: {
      title: 'What Is Entrepreneurship Economics?',
      summary: 'NVIDIA’s early choices show that entrepreneurship is less about having ideas and more about deciding where limited time and money should go when the future is unclear. Founders run small experiments—prototypes, demos, partnerships—to learn which uncertainties matter. Acting early carries risks, but waiting can forfeit partners, talent, and market position. Entrepreneurship economics studies these trade-offs: scarcity, opportunity cost, incentives, information, and how early commitments shape what becomes possible.',
      text: `<b>Does building a product with no customer demand ever make sense?</b><br/>In 1993 a tiny team in Santa Clara had a hard choice. NVIDIA could keep selling small improvements to existing video chips and stay alive, or it could spend its limited cash and engineer-hours on a very different chip design that almost no one seemed to want. The risk was obvious: if developers ignored the hardware or manufacturers refused to build it at scale, the company could burn through its runway and lose credibility. Yet the founders chose to push forward—designing chips for many calculations in parallel, writing drivers, and courting early developers—because they thought the investment would create useful capabilities and reveal real demand later. That choice shows the core economic trade-off: when time and money are scarce, a founder must decide which path will teach them most about the future rather than simply preserve the present. NVIDIA’s bet could have failed, but it also positioned the firm to exploit markets that did not yet exist.<br/><br/><b>If nobody knows the future, how do entrepreneurs decide what to build?</b><br/>When there is no clear signal from customers, founders make early moves that act like tests. NVIDIA didn’t treat its first products as final answers; each prototype, driver update, and demo was meant to show whether developers would change how they built software, whether games and applications would demand the extra performance, and whether manufacturers could make the chips cheaply enough. These were uncertain questions—no surveys or market reports could answer them fully. So NVIDIA focused its scarce resources on the experiments that would most change the company’s plans if they produced positive signals: small demos, developer outreach, and pilot production runs. The practical rule is simple and economic: spend limited time and money on the experiments that will reveal the biggest unknowns.<br/><br/><b>Why don't successful entrepreneurs wait until they have enough information?</b><br/>Waiting can feel safe, but it carries its own risk: the world moves while you stand still. For NVIDIA, delaying large investments until the market was “obviously” ready would have cost time needed to build manufacturing ties and developer relationships. Some answers only appear after you commit—how an ecosystem reacts at scale, whether software will adopt a new programming model, or whether other firms will match your moves. So the company accepted near-term costs—hiring, prototype runs, partner work—because acting early was the only way to learn certain truths and to secure scarce partnerships before rivals did. Economically, founders trade off the cost of acting too soon against the cost of acting too late; sometimes acting is the only path to knowing.<br/><br/><b>Can a good business idea still fail? ⭐</b><br/>Yes. Even sensible choices can lead to failure because many things lie beyond a founder’s control. NVIDIA’s chips were promising, but they needed developers, software tools, and industry partners to make the hardware useful. If those pieces had not appeared, the design would have been expensive and underutilized. Firms also fail from running out of cash, poor execution, or sudden external shocks. The point is practical: good reasoning improves the odds but does not guarantee success, since realized outcomes depend on many moving parts that must align after the initial decision is made. That reality shapes how entrepreneurs test assumptions and prepare fallback plans.<br/><br/><b>Why can two founders with the same idea achieve completely different results?</b><br/>Small early decisions change future possibilities. Two teams may start with the same chip design, but one spends months building developer tools and demos while the other chases immediate sales. The first team creates incentives for software creators to invest time in the platform; the second sells a few units but never solves the chicken-and-egg problem of software and users. Both teams see similar signals, yet they interpret them differently and decide where limited time and money should go. Those initial choices—who to hire, which partners to court, when to scale—compound over time and lead to very different outcomes even from similar starting points.<br/><br/><b>What exactly does entrepreneurship economics study?</b><br/>It studies how people decide where limited time and money should go when the future is unclear. The field asks which unknowns matter most, how small experiments produce useful information, and how early commitments change what becomes possible later. It brings classic ideas—scarcity, opportunity cost, incentives, competition, and information problems—into situations where markets and technologies are still forming. Watching NVIDIA’s decisions—facing uncertain demand in the 1990s, building developer ecosystems, launching CUDA in 2006, and then benefiting from the later AI boom—shows how choices about product, partners, and timing can create markets as much as they find them. Entrepreneurship is not mainly about having a clever idea; it’s about making disciplined choices under uncertainty.`,
      chapter: 'CHAPTER 1',
      takeaways: [
        'Decisions over ideas: Success depends more on how founders allocate limited time and money than on the mere originality of an idea.',
        'Learn by doing: Early products and demos are experiments to reveal critical unknowns (demand, developer behavior, manufacturing feasibility).',
        'Act vs. wait trade-off: Waiting reduces immediate risk but can lose partners, standards, and first-mover advantages; acting early can produce essential information.',
        'Complementary pieces matter: Hardware or a single idea often needs software, partners, or distribution to succeed—missing pieces can sink a good plan.',
        'Small choices compound: Early allocation decisions shape future possibilities; two teams with the same idea can diverge based on initial bets and interpretations of signals.'
      ]
    }
  },
  2: {
    concept: {
      title: 'Market Imperfections and the Role of the Entrepreneur',
      text: `<b>In a perfectly efficient market</b>, prices adjust instantly, information is shared equally, and no opportunity for profit sits unclaimed for long. If that world actually existed, entrepreneurs would have no reason to exist. Markets would already be optimal. Nobody would need to "start" anything, because everything worth doing would already be done.<br/><br/>But real markets are never perfect. Information is scattered unevenly. Resources sit in the wrong place. Needs go unmet because nobody has connected the dots yet. Economists call this <i>market disequilibrium</i> — a gap between what the market currently provides and what it could provide if resources were allocated better.<br/><br/>The entrepreneur is the person who notices that gap before anyone else does, and acts on it before it closes.<br/><br/>This is the core of Israel Kirzner's theory of <b>entrepreneurial alertness</b>: entrepreneurs don't necessarily invent new information, they notice opportunities that already existed but that everyone else overlooked. Joseph Schumpeter added a second layer — entrepreneurs don't just notice gaps, they actively destroy the old order to build a new one. He called this <b>creative destruction</b>: new combinations of resources, products, and business models that make the old ways obsolete.<br/><br/>Both views agree on one thing: entrepreneurs exist because markets are imperfect, and imperfection creates opportunity. If the world were efficient and static, there would be no space for a founder to matter. Entrepreneurship is not a personality trait. It is an economic response to disequilibrium — someone deciding to bear the uncertainty of closing a gap that everyone else either couldn't see or was too afraid to act on.`,
      chapter: 'CHAPTER 2',
      summary: 'Entrepreneurs exist purely because markets are imperfect. In a perfectly efficient market, resources are allocated perfectly and no unexploited opportunities exist. However, real-world markets are messy and inefficient, creating "disequilibrium"—a gap between what is provided and what could be provided. Entrepreneurs bridge this gap in two main ways: through "entrepreneurial alertness" (noticing existing but overlooked opportunities) and "creative destruction" (destroying outdated models by introducing new, superior ones). Fundamentally, entrepreneurship is not an innate personality trait but a rational economic response to market imperfections, driven by individuals willing to bear uncertainty to solve problems that others either ignored or feared to address.',
      takeaways: [
        'Perfect markets have no room for entrepreneurs; it is market inefficiency that creates business opportunities.',
        'Market disequilibrium occurs when there is a gap between what exists and what could be optimally provided.',
        'Entrepreneurial alertness is the ability to notice and act on overlooked opportunities that already exist in plain sight.',
        'Creative destruction occurs when entrepreneurs build new solutions that make old products and models obsolete.',
        'Entrepreneurship is an economic response to uncertainty, requiring founders to bear risk to close market gaps.'
      ]
    },
    article: {
      title: 'Why did nobody build Uber before 2009?',
      summary: 'Taxis existed. Smartphones existed. The idea was sitting in plain sight. Entrepreneurship is fundamentally about uncertainty, not intelligence. Seeing a gap is common; acting on it when failure is likely is rare. Profit exists specifically because someone was willing to act under conditions where the outcome could not be calculated in advance.',
      text: `Taxis have existed for over a century. Smartphones with GPS existed years before Uber launched. The technology was not the barrier. The idea — matching a nearby driver to a nearby rider through a live map — was sitting in plain sight the entire time. Thousands of people took taxis every day and complained about the wait. Thousands of drivers sat idle between fares. The gap between the two was enormous and completely visible. And yet, nobody closed it. Until two people did.<br/><br/>This is the uncomfortable truth about most breakthrough companies: the opportunity was rarely hidden. It was rarely secret. It was sitting in the open, ignored by almost everyone who walked past it.<br/><br/><b>What does Airbnb, Uber, and Amazon actually have in common?</b><br/><br/>Jeff Bezos did not invent bookselling. He noticed that the internet made it possible to hold more inventory in a warehouse than any physical bookstore ever could, and that shipping a book to a customer's door was cheaper than making the customer drive to a store. The insight was not new technology. It was a recombination of existing pieces — inventory, logistics, and a network — arranged in a way nobody had bothered to arrange them before.<br/><br/>Entrepreneurs are not smarter than everyone else in the room. They are not the only ones who see the gap. Most people who eventually feel regret about a missed idea will admit, if they are honest, that they saw it too. They just did not act on it. Somebody else did.<br/><br/>This is why entrepreneurship is fundamentally about uncertainty, not intelligence. Seeing a gap is common. Acting on it, when the outcome is unknown, when failure is the most likely result, when there is no guarantee anyone will pay for the fix — that is rare. Frank Knight, the economist who first separated risk from uncertainty, argued that profit exists specifically because someone was willing to act under conditions where the outcome could not be calculated in advance. If the outcome were predictable, there would be no reward for it. Anyone could do it. The profit belongs to the person who moved before the answer was known.<br/><br/>Now stop for a moment. Think about the last time you noticed something inefficient — a service that frustrated you, a gap between what people wanted and what existed, a problem you complained about instead of solving. You probably saw it. So did a hundred other people. The only difference between you and the founder who eventually fixed it is that they moved, and you didn't.<br/><br/>So why do entrepreneurs exist? Not because they have access to information nobody else has. Not because they are naturally more creative. They exist because markets are never finished being built, and someone has to be willing to act on an incomplete picture before it becomes an obvious one. Once the opportunity is obvious, it is no longer an opportunity. It is just the market catching up to what the entrepreneur already saw.<br/><br/>The question is no longer whether you can spot a gap. You already can. The real question is whether you will act on it while it is still uncertain — or wait until it is safe, and let somebody else become the reason the gap closed.`,
      chapter: 'CHAPTER 2',
      takeaways: [
        'Major innovations often come from combining existing technologies in new ways rather than inventing from scratch.',
        'Identifying an opportunity is common, but successfully acting on it under uncertain conditions is rare.',
        'Profit is the economic reward for an entrepreneur\'s willingness to act before an outcome can be guaranteed.',
        'Opportunities hide in plain sight where visible inefficiencies and unmet customer needs are ignored by the masses.',
        'Once a market gap becomes obvious to everyone, the opportunity for outsized entrepreneurial profit has usually vanished.'
      ]
    }
  },
  3: {
    concept: {
      title: 'Why Customers Buy',
      text: `Most businesses believe customers buy products. They don't. Customers buy progress. Every purchase is a response to a problem the customer is trying to solve, or a step forward they are trying to make in their life. The product is just the tool that gets them there.<br/><br/>This is the foundation of the <b>Jobs-to-be-Done theory</b>, developed by Clayton Christensen. The idea is simple but radical: people don't want a product for its own sake. They "hire" it to do a job. If the job disappears, the product loses its reason to exist, no matter how well-designed it is.<br/><br/>This reframes the entire question of demand. A company that asks "how do we build a better drill?" is asking the wrong question. The customer never wanted a drill. They wanted a hole. If someone invents a way to make a hole without a drill, the drill becomes irrelevant overnight, regardless of how much engineering went into it.<br/><br/>But there is a deeper layer economists often skip: the job itself is not always pre-existing. Sometimes customers do not know they have a job until a company convinces them they do. Demand is not always discovered. Sometimes it is manufactured. Understanding both sides — where real jobs already exist, and where a "job" can be created through perception — explains far more about buying behavior than looking at the product alone ever could.`,
      chapter: 'CHAPTER 3',
      summary: 'The "Jobs-to-be-Done" theory posits that customers do not buy products for their own sake; instead, they "hire" products to achieve specific goals or make progress in their lives. A customer does not want a drill; they want a hole in the wall. If the underlying job disappears, the product instantly loses its value. However, demand is not always purely reactive. While many jobs are pre-existing, companies can also manufacture demand by convincing customers they have a problem they previously ignored. Understanding this duality—solving existing problems versus creating awareness of new ones—is crucial for entrepreneurs trying to predict and influence buying behavior.',
      takeaways: [
        'Customers purchase progress and solutions, treating products merely as tools to get a specific "job" done.',
        'If a better way to accomplish a customer\'s job is invented, the old product becomes immediately irrelevant.',
        'Founders must focus on the underlying customer need ("the hole") rather than obsessing over the product ("the drill").',
        'Demand is not always discovered; it can be manufactured by teaching customers to recognize a new problem.',
        'A product\'s true value lies entirely in its ability to effectively execute the job the customer hired it for.'
      ]
    },
    article: {
      title: 'Listerine and the Invention of "Halitosis"',
      summary: 'Before halitosis had a name, nobody felt they had a problem. Listerine didn\'t cure a widespread disease—it named an ordinary human trait and reframed it as a hidden danger. Value is not only created by solving a problem better. It can be created by making a previously invisible problem visible, and unbearable to ignore.',
      text: `In 1879, Listerine was created as a surgical antiseptic. For the next 40 years, it was sold to hospitals to clean wounds and to dentists to sterilize equipment. It also worked, quietly, as a floor cleaner. Sales were modest. Nobody was rushing to buy a surgical disinfectant for their bathroom.<br/><br/>In the 1920s, the company's owners noticed something. Bad breath was common, but almost nobody thought of it as a problem worth solving. People simply accepted it as normal. There was no product on the market for it because there was no perceived job to hire a product for.<br/><br/>So Listerine's marketing team did something unusual. They took an obscure medical term — <i>halitosis</i> — and turned it into a household fear. Their advertisements did not describe a product. They described a private humiliation: a bridesmaid never asked to marry, a businessman passed over for promotion, a wife quietly avoided by her own husband, all because of breath odor nobody had told them about. The ads asked a simple, brutal question: how would you know if you had it? Friends won't tell you.<br/><br/>Sales exploded. Between 1921 and 1927, Listerine's revenue rose from about $115,000 to over $8 million. The chemical formula had not changed. What changed was that millions of people suddenly believed they had a job that needed doing — avoid silent social rejection — and Listerine was the only product positioned to do it.<br/><br/><b>Why did a 40-year-old antiseptic suddenly become a bathroom essential in the 1920s?</b><br/><br/>The product did not improve. The formula stayed the same. What changed was that a hidden, unnamed condition was given a name, a face, and a consequence. Before halitosis had a name, nobody felt they had a problem. Once it had a name, millions of people were terrified they were the last to know they had it. The job — "avoid being silently rejected by people who won't tell you why" — did not exist as a purchasing motive until Listerine's advertising created it.<br/><br/><b>What was "halitosis," and why hadn't anyone bought a cure for it before?</b><br/><br/>Bad breath had existed for all of human history. What had not existed was the idea that bad breath was a measurable, diagnosable, socially catastrophic condition that could end friendships and marriages. Listerine didn't cure a widespread disease. It named an ordinary, harmless human trait and reframed it as a hidden danger. Customers were not buying a solution to a problem they already had. They were buying protection from a fear a company had just taught them to feel.<br/><br/><b>What does this tell us about how customers actually decide to buy?</b><br/><br/>It tells us that awareness of a job often precedes the job itself. Customers do not always walk into a decision with a fully formed problem, searching for a solution. Sometimes a company defines the problem first, gives it urgency, and only then offers the fix. The purchase decision is not purely rational calculation of pre-existing need. It is shaped by whoever successfully convinces the customer that a risk they'd never considered is now real, and only one product stands between them and the consequences.<br/><br/><b>If the product didn't change, what actually did?</b><br/><br/>Perception did. Before the campaign, breath odor was private and unremarkable. After the campaign, it was framed as something everyone else could detect except you. That single shift — from "nobody notices" to "everybody notices, they just won't tell you" — is what converted a stagnant antiseptic into a category-defining consumer product. The economic lesson is that value is not only created by solving a problem better. It can be created by making a previously invisible problem visible, and unbearable to ignore.<br/><br/><b>Why do we still fall for this today, in industries that look nothing like mouthwash?</b><br/><br/>Because the mechanism never disappeared, it only changed costumes. Skincare brands manufacture urgency around pores nobody previously worried about. Insurance products are sold around risks framed as more likely than they statistically are. Software tools create anxiety around "productivity gaps" employees didn't know they had until a demo pointed them out. The pattern is identical: identify a private insecurity, give it a name, and position the product as the only visible way out.<br/><br/><b>So why do customers really buy?</b><br/><br/>Not always because they arrive with a clear, pre-existing job and shop for the best tool to complete it. Sometimes they buy because someone convinced them, credibly and urgently, that a job exists at all — and that ignoring it carries a cost they are no longer willing to risk. Stop for a moment and think about the last thing you bought that you didn't need six months ago. Was the problem always there, or did someone teach it to you first?`,
      chapter: 'CHAPTER 3',
      takeaways: [
        'Companies can manufacture consumer demand by making invisible problems highly visible and emotionally urgent.',
        'A product can remain unchanged while its sales explode simply by altering the customer\'s perception of risk.',
        'Naming a common human trait as a medical or social problem creates an immediate "job" for a product to solve.',
        'Customers often buy protection from socially constructed fears rather than solutions to purely practical problems.',
        'Value is created not just by improving a product, but by successfully shifting the customer\'s psychological context.'
      ]
    }
  },
  4: {
    concept: {
      title: 'How to Create and Capture Value',
      text: `Most people assume that if a product is useful, the business will succeed. That assumption is false. Every business operates on two separate economic functions: value creation and value capture.<br/><br/>Value creation is the production of utility for the customer: solving a problem, reducing cost, saving time, or improving an outcome. It is measured by how much the customer is willing to pay in total benefit.<br/><br/>Value capture is the portion of that created value that the firm converts into revenue through pricing, business model design, and market structure.<br/><br/>A business can create significant value while capturing little or none of it. In that case, customers gain surplus, but the firm cannot sustain operations. This is the core failure mode of many startups: high utility, weak monetization.<br/><br/>The difference between total value created and value captured is called consumer surplus. Sustainable firms design systems that convert part of that surplus into revenue without eliminating demand.<br/><br/>Strong entrepreneurs do not treat creation and capture as separate stages. They design them together from the start — ensuring that the mechanism that makes the product useful also makes the business economically viable.`,
      chapter: 'CHAPTER 4',
      summary: 'A business must perform two distinct economic functions to survive: value creation and value capture. Value creation involves producing utility for the customer—solving a problem or saving time. However, creating immense value does not guarantee success. Value capture is the firm\'s ability to convert a portion of that created value into actual revenue through smart pricing and business models. When a company creates high utility but fails to monetize, it collapses, leaving customers with the surplus. Successful entrepreneurs must design their products and their monetization strategies simultaneously, ensuring that the mechanism providing utility inherently drives sustainable revenue without destroying customer demand.',
      takeaways: [
        'Creating a highly useful product is not enough to guarantee a sustainable and profitable business.',
        'Value creation focuses on generating customer utility, while value capture focuses on generating company revenue.',
        'Failing to align value creation with value capture is a primary reason why popular startups go bankrupt.',
        'Consumer surplus occurs when customers receive immense value from a product without paying for it proportionally.',
        'Successful founders integrate their monetization strategy into the core design of their product from day one.'
      ]
    },
    article: {
      title: 'Why would a company sell its product at a loss?',
      summary: `Value creation and value capture are two different mechanisms. Businesses can create immense value for customers without capturing enough revenue to survive, like Napster. Conversely, companies like HP, Nespresso, and Microsoft use the 'razor-and-blades' model—selling a core product at a loss to generate long-term recurring revenue through complementary products. Customers accept this because the lower upfront cost and convenience feel like a good trade-off in the moment.`,
      text: `Walk into a store and pick up an HP printer. It costs $49. Take it home, set it up, print one page — and within three months you will have spent more on ink than you paid for the machine itself.<br/><br/>This was not always the case. When HP launched the DeskJet in 1988, it cost $1,000. By 1993 it was $365. By the 2000s it was $49. The printer kept getting cheaper. HP did not become more generous over 35 years. They made a calculated bet: make the printer so cheap that everyone buys one. Once it is sitting on your desk, in your home, you will need ink. And you will keep needing it. Every month. Every year. For as long as you own the machine. Most businesses are built around selling something for more than it costs to make. HP built a business around the opposite — lose a little now, earn forever after. The printer was never the product. The ink was.<br/><br/><b>What do HP, Nespresso, and your Xbox have in common that nobody tells you about?</b><br/><br/>HP is not the only one doing this. Walk into any kitchen in Europe. There is a Nespresso machine on the counter. It costs $150. A kilogram of Nespresso coffee costs $70. The same quality of coffee, bought as beans from the same regions, costs $25. You bought the machine from Nespresso because it costed less. Congratulations, you fell for another trick. The product was coffee.<br/><br/>Microsoft does it with Xbox. They sell the console at a loss. Every unit shipped in the first year costs Microsoft money. Executives approve this every single time. Because they are not selling a console. They are placing a device in your living room that will generate subscription fees, game purchases, and digital store revenue for the next six years. The machine is the bait. What comes after it is the business.<br/><br/>HP figured this out with printers. Nespresso figured it out with coffee. Microsoft figured it out with gaming. And right now, somewhere in a boardroom you will never see, another company is figuring out what product they can put in your home cheaply enough that you will spend the next decade paying for what goes inside it.<br/><br/>Now before keep reading, stop for a moment, and ask yourself: "How many times have I already been a victim of this business trick?"<br/><br/><b>What does this tell us about how value is really captured in business?</b><br/><br/>The answer is that customers and revenue are not always created at the same moment. HP did not make its money when you bought the printer. Nespresso did not make its money when you bought the machine. Microsoft did not make its money when you carried the Xbox out of the store. Those were merely the first transactions. The real profits came later, through the purchases that followed. In business, this is known as the razor-and-blades model: sell the base product cheaply — sometimes even at a loss — and earn profits from the complementary products customers must keep buying afterward. The razor is cheap. The blades are expensive. The printer is cheap. The ink is expensive. The console is cheap. The games and subscriptions generate the profit. This reveals one of the most important ideas in economics and business: creating value and capturing value are not the same thing. Creating value gets the customer through the door. Capturing value determines whether the business survives after they walk in. The companies that understand this best are not trying to maximize today's sale. They are designing a system that turns a single purchase into years of revenue.<br/><br/><b>If We Know the Trick, Why Do We Keep Falling for It?</b><br/><br/>The strange part is that nobody is being tricked. Most customers understand what is happening. They know the first purchase is only the beginning, and that the real costs often show up later. Yet they still choose it. Not because they miscalculate, but because the trade feels worth it in the moment. Lower upfront cost, immediate access, and convenience today often outweigh a more expensive but delayed alternative. Businesses design around this exact behavior. Instead of charging everything at once, they split value into a visible entry price and invisible long-term payments spread across time. What looks like a cheap product is actually a long-term payment system disguised as convenience. Now, stop! Have you stopped for a moment I told you above? If not, this is the time. Sit down and ask yourself: How many times have I already been a victim of this business trick?" But what's more important is will you make reckless decisions again even if you understand their trick?`,
      chapter: 'CHAPTER 4',
      takeaways: [
        'The razor-and-blades model sacrifices upfront profit on a core device to lock in long-term recurring revenue.',
        'Value creation and revenue generation do not have to happen at the exact same moment in a customer\'s journey.',
        'Selling a physical product at a loss is a strategic customer acquisition cost, disguised as a discount.',
        'Customers rationally accept long-term expensive ecosystems because they prioritize immediate convenience and lower entry costs.',
        'A sustainable business system turns a single, cheap initial transaction into years of highly profitable repeat purchases.'
      ]
    }
  },
  5: {
    concept: {
      title: 'Profit, Incentives, and Decision-Making',
      text: `<b>Incentives and Outcomes.</b><br/><br/>"Show me the incentive, and I'll show you the outcome."<br/><br/>In 1995, Charlie Munger stood in front of an audience at Harvard and said this. The idea is simple: the way people are paid shapes how they behave.<br/><br/><b>A Simple Incentive Problem.</b><br/>Imagine you and your friend are selling lemonade. You are paid $1 per hour. Your friend is paid per cup sold.<br/><br/>Who works harder?<br/>Of course your friend. You receive the same pay regardless of whether you sell 1 cup or 50. Your friend’s income increases with every additional cup sold. This is what economists call an incentive structure.<br/><br/>“An incentive structure refers to the set of rewards and costs associated with different actions. It determines how individuals allocate effort across alternatives.”<br/><br/>By the end of the afternoon, both of you sell 40 cups. She earns $40. You earn $4. The environment is identical, but effort levels differ. This difference does not come from personality. It comes from the structure of payoffs.<br/><br/>Now here's where it gets interesting. Before setting up the stand, both of you face a decision: Is today worth it?<br/><br/>You did not know:<br/>• how many customers will appear<br/>• whether competition will undercut prices<br/>• whether the day will be profitable<br/><br/>You must decide using incomplete information and still act.<br/><br/><b>Decision-Making Under Uncertainty.</b><br/>This is decision-making under uncertainty: choosing a course of action without knowing how outcomes will unfold. It involves evaluating available information while accounting for unknown future states.<br/><br/><b>Why Incentives Matter.</b><br/>Munger’s point is not limited to lemonade stands or wages. People respond to incentives. When payoffs change, behavior changes. Often, individuals do not consciously recognize this shift in themselves. Thus, incentive structures influence not only the level of effort once participation occurs, but also the initial participation decision itself. This relationship between incentives and behavior is a fundamental principle in microeconomic theory.`,
      chapter: 'CHAPTER 5',
      summary: 'An incentive structure dictates how individuals act by directly tying rewards to specific behaviors. As Charlie Munger noted, if you show the incentive, you can predict the outcome. When people are paid a flat rate regardless of output, they exert minimal necessary effort. Conversely, when income is tied directly to performance, effort increases dramatically. Crucially, incentives do not just shape behavior during a task; they determine whether an individual chooses to participate at all, especially when making decisions under uncertainty. Understanding this microeconomic principle is essential, as changing the payoff structure is the most effective way to organically change organizational or market behavior.',
      takeaways: [
        'People rationally alter their effort and behavior based on how their rewards and costs are structured.',
        'Performance-based pay generates significantly higher effort than flat hourly wages in identical environments.',
        'Incentives influence not only the quality of work but also the initial decision of whether to participate at all.',
        'Decision-making under uncertainty requires individuals to act without knowing if their efforts will be profitable.',
        'Changing an incentive structure is the most reliable way to shift long-term human behavior in business.'
      ]
    },
    article: {
      title: "McDonald's: Incentives, Profit, and Scale",
      summary: `To understand how businesses truly scale, we look at McDonald's. The burger made them famous, but their franchise model—a brilliant application of incentive structures—made them a global powerhouse. By aligning the financial interests of independent operators with the brand’s standards, Ray Kroc solved the problem of scale and quality control without micromanaging every store.`,
      text: `<b>P1 — Incentives: Why did Ray Kroc give up control of thousands of restaurants instead of running them himself?</b><br/><br/>Walk into any McDonald’s in the world. Order a burger in Uzbekistan, Tokyo, Toronto, Cairo- whereever you live. The result is largely the same across locations, even though each restaurant is run by different people in different countries.<br/><br/>“No single person could manage thousands of restaurants across more than 100 countries and still keep them consistent through direct supervision. Instead, Ray Kroc built a system where consistency did not depend on him being present in each location.”<br/><br/>In economics, we call it franchising. In franchising, independent owners run each restaurant under the same rules, and their income depends on how well those restaurants perform. As a result, following operational standards is not a matter of instruction or goodwill. It is tied to financial outcome.<br/><br/>Kroc did not scale McDonald’s by managing more restaurants. He scaled it by changing incentives so that each operator had a direct reason to maintain consistency.<br/><br/><b>P2 — Profit: Why would someone pay $1 million to open a McDonald's instead of starting their own burger shop?</b><br/><br/>Across the world, McDonald’s operates through roughly 40,000 independent franchise owners, and entry into that system often requires over a million dollars upfront, a payment made long before any restaurant begins operating or any revenue appears.<br/><br/>At first glance, the decision does not make sense. When the same money could be used to open an independent restaurant, build a brand from scratch, design a menu, and keep full control over every decision without paying anything to a corporation.<br/><br/>Yet the franchise system continues to attract thousands of business owners. Of course, it is not because everyone is obsessed with McDonald's unhealthy foods.<br/><br/>What explains it is the structure of what they are actually buying. A McDonald’s location begins inside a network where demand patterns already exist, where supply chains are already connected, and where operational decisions are guided by systems refined across thousands of prior restaurants.<br/><br/><b>P3 — Scale: Why does every new McDonald's make the next one easier to open?</b><br/><br/>Imagine opening the first McDonald's in a city. Nobody knows which location will perform best, how many employees are needed during lunch hours, which menu items will sell the most, or how customer traffic changes throughout the day. Every decision contains uncertainty.<br/><br/>Now imagine opening the thousandth.<br/>At that point, many of those questions have already been answered thousands of times. The company has seen restaurants succeed near highways, fail on certain street corners, thrive in some neighborhoods, and struggle in others. It has observed how customers respond to pricing, how long service can take before satisfaction falls, and how demand changes across different regions and markets.<br/><br/>Each restaurant adds another set of observations to the system. Over time, those observations accumulate into procedures, training manuals, site-selection models, supply-chain networks, and operating standards that can be reused again and again.<br/><br/>As a result, growth does more than increase the number of restaurants. It increases the amount of knowledge inside the system. Every new location benefits from lessons paid for by the thousands that came before it, making the next decision slightly easier, slightly safer, and slightly more predictable than the last.<br/><br/><b>P4 — Decision-Making: What actually made McDonald's successful: burgers, profits, or decisions?</b><br/><br/>The answer is all three, but not in the way most people think.<br/>The burger attracted customers while profit revealed which restaurants and practices worked. But behind both was a series of decisions: the decision to franchise, to standardize operations, and to use information gathered from thousands of locations to improve the next one.<br/><br/>Viewed separately, incentives, profits, and scale seem like different ideas. In reality, they are part of the same process. Incentives influence decisions. Decisions create outcomes. Profits reveal which outcomes are worth repeating.<br/><br/>The burger made McDonald's famous. But the economics behind the burger made McDonald's scalable.`,
      chapter: 'CHAPTER 5',
      takeaways: [
        'Franchising resolves the barrier of scaling by aligning the financial success of local operators with brand standards.',
        'Entrepreneurs buy franchises to drastically reduce business uncertainty by purchasing proven systems and existing demand.',
        'True business scale occurs when every new iteration of the business adds collective knowledge to the entire system.',
        'Delegating control through economic incentives is far more effective than attempting to micromanage a growing organization.',
        'Profits act as an economic signal, revealing exactly which operational decisions and market experiments are worth repeating.'
      ]
    }
  },
  6: {
    concept: {
      title: "Why Some Businesses Scale While Others Don't",
      text: `Most people think a business fails because of a bad product. Wrong. Some of the most useful businesses you have ever seen — ones that genuinely helped people — quietly disappeared. And some mediocre businesses grew into giants. The difference was rarely the idea. It was the system behind the idea.<br/><br/>Before we get into that, let us be clear about what "scaling" even means. A business scales when it can grow revenue without growing problems at the same speed. Not just getting bigger — getting smarter as it grows. More customers, but not more chaos. More revenue, but not more stress. That is the goal. And most businesses never reach it.`,
      chapter: 'CHAPTER 6',
      summary: 'A business does not fail simply because of a bad product; it fails because of a broken underlying system. Scaling is widely misunderstood as just getting bigger. True scaling means growing revenue without proportionately increasing chaos, overhead, and stress. If a business merely grows in size without systemic intelligence, it collapses under its own weight. Exceptional businesses that successfully scale are built on repeatable, documented systems rather than relying on the founder\'s constant intervention. Ultimately, creating a scalable company requires shifting focus from simply delivering a good product to architecting a structure capable of delivering it consistently at any volume.',
      takeaways: [
        'Scaling is defined as the ability to exponentially grow revenue without simultaneously growing internal chaos and stress.',
        'Businesses usually fail due to systemic operational breakdowns, not necessarily because they possess a bad product idea.',
        'A company that grows without upgrading its foundational systems will eventually collapse under its increased complexity.',
        'Founders must transition from managing daily crises to designing structures that function perfectly without them.',
        'True scale is achieved by making success repeatable, documented, and entirely independent of a single individual\'s effort.'
      ]
    },
    article: {
      title: 'Why Working Harder Is Not the Answer',
      summary: 'Growth does not fail at the idea level. It fails at the system level. Working harder in your business makes you the bottleneck, but working on your business by building systems allows it to scale without chaos.',
      text: `Here is something uncomfortable: most founders who do not scale are working extremely hard. Long hours. Constant decisions. Involved in every department. Exhausted.<br/><br/>The problem is not effort. The problem is what they are spending that effort on.<br/><br/>There is a critical difference between working in your business and working on your business. Working in it means you are doing the tasks — handling customers, solving problems, putting out fires. Working on it means you are building the systems that handle customers, solve problems, and prevent fires even when you are not there.<br/><br/>When you work only inside the business, you become the bottleneck. Growth stops because you cannot do more. The business does not scale — it just gets heavier.<br/><br/>The businesses that scale are the ones where the founder stepped back and asked: "How do I build this so it works without me doing everything?"<br/><br/><b>The Real Enemy: Inconsistency</b><br/><br/>Here is something nobody tells you at the start: you cannot scale chaos.<br/><br/>Imagine a restaurant that makes incredible food on Tuesday but a completely different experience on Saturday. Or a software company where one customer gets fast support and another waits a week. Or a team where no one is sure who is responsible for what.<br/><br/>That is inconsistency. And it is the silent killer of scaling businesses.<br/><br/>When a business runs on guesswork — where success depends on who showed up that day or what mood the manager was in — it cannot grow. Because growth means more customers, more team members, more complexity. And if your current system already produces inconsistent results with a small team, it will produce worse results with a large one.<br/><br/>The businesses that scale replace guesswork with structure. They document how things are done. They define what success looks like for every role. They create processes that do not depend on one person's knowledge or one person's memory. Repeatability is the foundation of scale.<br/><br/><b>The Hidden Multiplier: When Your Team Starts Thinking Like Owners</b><br/><br/>Here is where things get interesting.<br/><br/>When a founder builds clear systems — and actually teaches their team how those systems connect — something unexpected happens. Team members stop just executing tasks. They start seeing opportunities.<br/><br/>Think about it this way. If you understand how marketing feeds into sales, and how sales affects operations, you can spot a problem before it becomes a crisis. You can recognize a new opportunity because you can see where it would fit. You are no longer just completing your job. You are thinking about the whole picture.<br/><br/>This is the hidden multiplier of systems clarity. You build one good process. A team member learns it. Then they bring you the next opportunity — one you never would have found on your own. And another. And another.<br/><br/>That is leverage. Not just more people doing more work. People who think, who connect dots, who act like owners even though they are employees.<br/><br/>And as a bonus? This is also how you find your future leaders. Not by giving someone a title and hoping they rise to it. But by watching who, among your team, starts seeing the full picture first.<br/><br/><b>Discipline Is Not a Personality Trait — It Is a System</b><br/><br/>There is a quote by Jim Collins, author of Good to Great, that cuts through a lot of noise: "Greatness is not a function of circumstance. Greatness is largely a matter of choice and discipline."<br/><br/>When most people hear "discipline," they imagine waking up early, grinding harder, sacrificing more. But in business, discipline means something more specific. It means choosing, deliberately, what you are going to focus on — and then protecting that focus from everything that tries to pull it away.<br/><br/>Businesses that scale share one habit: they make strategy non-negotiable. Not a meeting you hold when things are slow. Not a retreat you take once a year. A practice — weekly, monthly, consistently — where the team reviews what they are building toward and whether what they are doing today moves them there.<br/><br/>They also communicate their vision obsessively. Did you know employees need to hear the same message seven times before it is fully understood? The companies that scale do not say the plan once and assume it landed. They repeat it. They put it on the wall. They talk about it in every team meeting. Because a vision nobody remembers is not a vision at all — it is a hope.<br/><br/><b>The Growth Test</b><br/><br/>So here is a useful test to apply to any business, including one you might build someday.<br/><br/>Ask these questions:<br/><ul><li>Can every person on the team tell you what success looks like today? If the answer is unclear, the business is running on assumption. That works when it is small. It breaks when it grows.</li><li>Are processes documented, or does success depend on one person knowing the right thing? If a key employee left tomorrow, would the system survive? If not, you do not have a system. You have a dependency.</li><li>Do you understand how your departments connect — not just how each one performs on its own? A great marketing team and a great sales team can still produce a broken business if the handoff between them is a mess.</li><li>Is your strategy a habit, or an event? If you only think about direction when something goes wrong, you are reactive. Reactive businesses do not scale. They survive.</li></ul><br/><br/><b>The Real Reason Businesses Do Not Scale</b><br/><br/>Growth does not fail at the idea level. It fails at the system level.<br/><br/>The businesses that scale are not always the ones with the best product, the most funding, or the smartest founder. They are the ones where the product is good enough and the systems are strong enough to deliver it consistently, at volume, without falling apart.<br/><br/>The ones that do not scale usually make the same set of mistakes: they grow before they are stable, they confuse being busy with making progress, and they never build anything that works without the founder in the middle of it.<br/><br/>The good news? None of this is permanent. Systems can be built. Discipline can be practiced. Clarity can be created. The businesses that figured this out did not start with it — they chose to build it.<br/><br/>That choice, more than anything else, is what separates the ones that scale from the ones that stay stuck.<br/><br/>Stop here for a moment. Think about a business you admire — one that seems to be everywhere, growing fast, hard to stop. Ask yourself: what is the system underneath it? Because behind every business that looks like overnight success, there is a set of deliberately built pieces that nobody sees. That is the real story.`,
      chapter: 'CHAPTER 6',
      takeaways: [
        'Working "in" the business limits growth because the founder becomes the bottleneck; working "on" it builds scalability.',
        'Inconsistency is the silent killer of growth; businesses must replace daily guesswork with predictable, documented structure.',
        'Clear systems empower employees to think holistically like owners, multiplying their value and identifying new opportunities.',
        'Discipline in scaling is not about working more hours, but about protecting strategic focus from daily distractions.',
        'A successful business pairs a "good enough" product with an exceptionally strong system capable of delivering it reliably.'
      ]
    }
  }
};

export const DEV_MOCK_CONTENT: Record<number, MockLessonContent> = {
  1: {
    concept: {
      title: "Growth Isn't Always Development",
      text: `China's GDP grew roughly tenfold over a single generation. In some of its industrial cities, the air also got bad enough that you couldn't see the sun by noon. Both of those things are true at the same time, and that's exactly the tension this lesson is about.<br/><br/><b>Economic growth</b> means an increase in a country's total output — more goods, more services, a bigger GDP than last year. <b>Economic development</b> means something broader: are people actually living longer, healthier, better-educated lives, with cleaner air and real choices about how to spend their time? Growth is necessary for development. It just isn't the same thing, and it isn't sufficient on its own.<br/><br/>Here's the mechanism worth understanding: growth expands the total pie. It doesn't automatically decide who gets a bigger slice, and it doesn't automatically clean up whatever mess got made baking it. A country can post extraordinary growth numbers for thirty years straight while specific, very real parts of daily life — the water quality in a specific province, the gap between a coastal factory town and an inland farming village — get worse, not better.<br/><br/>This is where economist Amartya Sen's idea of <b>development as freedom</b> is worth naming directly: he argued real development means expanding people's actual freedom to live lives they have reason to value, not just growing the number attached to national income. A country can hit a genuinely impressive growth number and still be falling short on that fuller definition.<br/><br/>So when a headline says a country's economy "grew," the honest next question is always: grew for whom, and at what cost to the parts of life a GDP chart was never built to measure?`,
      chapter: 'CHAPTER 1',
      summary: 'Economic growth is a rise in total output — a bigger GDP. Economic development is broader: longer, healthier, more equal, more genuinely free lives. Growth expands the total pie but doesn\'t decide who gets more of it, or clean up the damage caused along the way. Amartya Sen\'s "development as freedom" reframes the goal directly: real development means expanding people\'s actual freedom to live well, not just growing a national income figure.',
      takeaways: [
        'Economic growth means rising total output; economic development means broader improvements in health, education, equality, and freedom.',
        'Growth is necessary for development, but it isn\'t the same thing, and it isn\'t sufficient on its own.',
        'A country can grow rapidly while specific dimensions of life — pollution, inequality, rural access to services — get worse.',
        'Amartya Sen\'s "development as freedom" reframes the real goal as expanding people\'s actual freedom to live well.',
        'The honest question behind any growth headline is: growth for whom, and at what cost?'
      ]
    },
    article: {
      title: "China's Economic Miracle: Growth vs. Quality of Life 🇨🇳",
      summary: "China's economy grew roughly tenfold after 1978's market reforms, lifting hundreds of millions out of poverty at an almost unprecedented pace. But the growth was uneven — coastal regions surged ahead of rural ones, inequality rose, and industrial pollution became a serious public health cost that GDP never counted. The story shows exactly why growth and development aren't the same thing, even when the growth is historically real.",
      text: `<b>How does a country's economy grow roughly tenfold in a single generation?</b><br/><br/>Starting with Deng Xiaoping's market reforms in 1978, China opened to foreign trade and investment, built special economic zones designed to attract manufacturing, and sustained average annual GDP growth reportedly in the range of 9–10% for three decades — a pace almost without historical precedent for a country this large. Hundreds of millions of people moved out of extreme poverty over that period, by most widely cited estimates.<br/><br/><b>So did everyone's life improve at the same pace as the growth numbers?</b><br/><br/>Not evenly, no. Coastal, export-oriented provinces boomed. Inland and rural regions lagged well behind. China's Gini coefficient — the standard measure of income inequality — rose substantially over the reform era, meaning the gap between richer and poorer households widened even as average income climbed.<br/><br/><b>What did the growth-first strategy cost that never shows up on a GDP chart?</b><br/><br/>Air and water pollution, for one — some Chinese industrial cities experienced smog levels bad enough to be a genuine public health hazard, a cost that hit residents directly but that a growth statistic has no way of subtracting out. None of that pollution makes GDP go down. If anything, cleaning it up later adds to GDP. The chart simply wasn't built to notice the damage in the first place.<br/><br/><b>If growth was this fast, why do development economists still hesitate to call it an unqualified success?</b><br/><br/>Because GDP measures total output, not whether that output improved health, environmental quality, or equality of opportunity for the typical citizen. By several non-income measures — pollution exposure, the rural-urban gap, working conditions in the factories driving the export boom — progress looked far more uneven than the growth chart alone suggests.<br/><br/><b>If you were a policymaker overseeing this growth, and had to choose between continuing to maximize GDP growth or redirecting real investment toward environmental cleanup and rural healthcare, what would guide your decision?</b><br/><br/>Continuing to maximize growth keeps average income and government revenue climbing, but risks locking in environmental and inequality costs that get more expensive to reverse the longer they're ignored. Redirecting investment slows the headline growth number, but may actually improve the lived quality of life growth was supposed to deliver in the first place. China's own government has, in recent years, explicitly shifted its official language toward "high-quality growth" — a sign that even the people who presided over the miracle came to see the distinction this lesson is built around.<br/><br/><b>So was China's transformation really about growth — or about the much harder, unfinished question of development?</b><br/><br/>The growth was real, and historically enormous. Whether it has fully translated into development — broadly shared, sustainable improvement in how people actually live — is the separate, harder question. It's still being answered today.`,
      chapter: 'CHAPTER 1',
      takeaways: [
        'China\'s GDP grew at roughly 9–10% annually for three decades following the 1978 reforms.',
        'Hundreds of millions of people moved out of extreme poverty over this period, by widely cited estimates.',
        'Growth was uneven — coastal provinces surged ahead while inland and rural regions lagged, and inequality rose.',
        'Severe air and water pollution in industrial regions was a real cost to residents that GDP statistics never captured.',
        'China\'s government has since shifted its rhetoric toward "high-quality growth," acknowledging the growth-development gap directly.'
      ]
    }
  },
  2: {
    concept: {
      title: "Can Money Measure a Country's Success?",
      text: `Singapore's GDP per capita is higher than the United States'. It's also a country smaller than New York City, where a huge share of the reported economic activity comes from multinational companies booking global profits there for tax reasons. Both facts are true, and the second one should make you a little suspicious of the first.<br/><br/><b>GDP</b> measures the total value of goods and services produced <i>within a country's borders</i>, regardless of who actually owns that production. <b>GNI</b> — Gross National Income — measures the income earned by a country's own residents and companies, wherever in the world it was actually earned. For most countries, these two numbers are close enough that the difference barely matters. For a handful of small, extremely open economies — financial and corporate hubs like Singapore — the gap can be huge.<br/><br/>Here's the mechanism: a multinational company can legally book profits in Singapore because of its favorable tax and business environment, even if very little of the actual work happened there and none of that profit ever reaches an ordinary Singaporean resident's paycheck. That profit still counts toward Singapore's GDP. It often doesn't show up nearly as strongly in GNI, which is built to track income actually flowing to residents.<br/><br/>This is why comparing countries by raw GDP per capita alone can quietly mislead you, especially for small trade or finance-heavy economies. The number isn't fake. It's just answering a narrower question — "how much economic activity happened inside these borders" — than the one most people assume it's answering, which is closer to "how well off is the typical person living here."`,
      chapter: 'CHAPTER 1',
      summary: 'GDP measures output produced within a country\'s borders; GNI measures income actually earned by that country\'s residents, wherever it comes from. For small, open economies like Singapore, multinational companies can book large profits locally for tax reasons, inflating GDP without that money reaching ordinary residents. This is why a high GDP per capita always deserves a follow-up question: whose income is this actually measuring?',
      takeaways: [
        'GDP measures output produced within a country\'s borders, regardless of who owns that production.',
        'GNI measures income earned by a country\'s own residents and companies, wherever it was actually earned.',
        'Small, open economies with major corporate or financial hubs can show GDP figures inflated by profits that never reach residents.',
        'A high GDP per capita isn\'t false — it\'s answering a narrower question than "how well off is the typical resident."',
        'Comparing countries by raw GDP per capita alone can quietly mislead, especially for trade or finance-heavy economies.'
      ]
    },
    article: {
      title: "Singapore: Why a High GDP Doesn't Tell the Whole Story 🇸🇬",
      summary: "Singapore's GDP per capita rivals or exceeds the United States', but a meaningful share of that output comes from multinational companies booking profits there for tax and business reasons, not necessarily income reaching ordinary residents. GNI, which tracks income actually earned by residents, tells a more precise story. Singapore's own government tracks additional resident-focused measures for exactly this reason — a sign that even a headline GDP success story needs a closer look.",
      text: `<b>How can a city-state smaller than New York City report a higher GDP per capita than the United States?</b><br/><br/>Since independence in 1965, under Lee Kuan Yew's government, Singapore deliberately built itself into a global trade, finance, and corporate hub — attracting an enormous concentration of multinational business activity relative to its tiny physical size and population.<br/><br/><b>Does all of that reported economic output actually belong to Singaporean residents?</b><br/><br/>Not entirely. A meaningful share of the GDP measured within Singapore's borders reflects profits and activity booked there by multinational companies with regional or global headquarters in the city-state, not necessarily income earned by, or distributed to, Singaporean residents themselves. This is precisely the gap GNI is built to correct for, by focusing on income to residents rather than output within borders.<br/><br/><b>If GDP can be this misleading, why do international rankings still lean on it so heavily?</b><br/><br/>Practicality, mostly. GDP is easier to measure consistently across countries, has decades of standardized historical data behind it, and does still track something real — the scale of economic activity happening within a country's borders. The problem isn't that GDP is useless. It's that it answers a narrower question than the one people usually assume it answers.<br/><br/><b>What does Singapore's own experience suggest about correcting for this gap?</b><br/><br/>Singapore's own government tracks measures beyond headline GDP — resident income data, housing affordability, other domestic welfare indicators — precisely because its own policymakers recognize GDP alone doesn't answer the living-standards question for actual citizens. If the country that benefits most from a high GDP number still feels the need to look past it, that's a fairly strong signal.<br/><br/><b>If you were a journalist comparing "the richest countries in the world" using only GDP per capita, and Singapore ranked near the very top, would you report that ranking at face value — or dig into what's actually behind the number?</b><br/><br/>Reporting it at face value is faster, and it's how these rankings usually circulate in headlines. But it risks implying the typical resident's living standard matches the figure exactly. Digging into GNI and resident-focused measures takes more effort, but tells a far more accurate story about what life is actually like for the people living there.<br/><br/><b>So is Singapore's GDP number lying — or just answering a different question than the one most people assume it's answering?</b><br/><br/>The number isn't false. It's measuring the scale of economic activity happening within Singapore's borders, not necessarily the income or living standards of its residents specifically — exactly the distinction GNI and other development measures exist to make clearer.`,
      chapter: 'CHAPTER 1',
      takeaways: [
        'Singapore built itself into a global trade and finance hub after independence in 1965.',
        'A meaningful share of its GDP reflects multinational corporate activity, not necessarily income reaching residents directly.',
        'GNI corrects for this by tracking income earned by residents, wherever it comes from.',
        'GDP remains widely used because it\'s easier to measure and compare consistently across countries.',
        'Singapore\'s own government tracks additional resident-focused welfare measures beyond headline GDP.'
      ]
    }
  },
  3: {
    concept: {
      title: "A Better Way to Measure Progress",
      text: `For most of the years the United Nations has published its main measure of national wellbeing, one country keeps landing at or near the very top: Norway. But the index wasn't built to flatter rich countries. It was built to embarrass them.<br/><br/>The <b>Human Development Index (HDI)</b> combines three things into a single score between 0 and 1: life expectancy, education (how many years of schooling people actually get), and income per person. It was developed by economist Mahbub ul Haq, working with Amartya Sen, for the United Nations Development Programme, first published in 1990.<br/><br/>Here's why it exists at all. Haq and Sen had noticed something uncomfortable: countries with similar income levels could produce wildly different real outcomes for their people. Some low-income countries had impressive life expectancy and education because of deliberate public investment. Some wealthier countries underperformed on those same measures relative to what their income could have bought. GDP alone couldn't tell that story. HDI forces income to share the stage with health and education, so a country can't simply buy its way to a high score without actually investing in its people.<br/><br/>This connects directly to Sen's broader <b>capability approach</b>: real development means expanding people's genuine freedom to live the kind of life they have reason to value — not just growing a national income figure. HDI is that philosophy turned into something you can actually calculate and compare across 190-plus countries.<br/><br/>It has real limits too, and this unit's whole theme has been that every measure does. HDI is a national average — it says nothing about how unequally that average is distributed inside a country, and nothing about environmental sustainability or political freedom. It corrects one blind spot in GDP. It doesn't correct all of them.`,
      chapter: 'CHAPTER 1',
      summary: 'The Human Development Index combines life expectancy, education, and income into a single 0–1 score, built in 1990 by Mahbub ul Haq and Amartya Sen because similar-income countries can produce very different real outcomes. It operationalizes Sen\'s idea that development means expanding people\'s genuine freedom to live well, not just growing income. HDI corrects GDP\'s biggest blind spot but has its own — it\'s a national average that says nothing about internal inequality.',
      takeaways: [
        'HDI combines life expectancy, education, and income per person into a single 0–1 score.',
        'It was created in 1990 by Mahbub ul Haq and Amartya Sen for the UN Development Programme.',
        'It exists because similar-income countries can produce very different health and education outcomes.',
        'It reflects Sen\'s "capability approach" — development as expanding people\'s real freedom to live well, not just income growth.',
        'HDI is a national average, so it says nothing about inequality, environmental sustainability, or political freedom within a country.'
      ]
    },
    article: {
      title: "Norway's World-Leading Human Development 🇳🇴",
      summary: "Norway has ranked at or near the top of the Human Development Index for years, combining oil-fueled high income with strong life expectancy and education outcomes. What separates it from other resource-rich countries is deliberate public investment — directing oil revenue into a sovereign wealth fund and sustained healthcare and education spending, rather than letting income alone stand in for development. HDI exists precisely to catch the difference between the two.",
      text: `<b>Why does one small, cold, oil-producing country keep topping the UN's main ranking of national wellbeing?</b><br/><br/>Norway has ranked at or near the top of the HDI for many years running. It combines high income — partly from North Sea oil wealth, managed through its sovereign wealth fund — with very high life expectancy and near-universal access to extensive education.<br/><br/><b>If oil wealth explains the income part, what explains the health and education part?</b><br/><br/>Oil revenue alone doesn't guarantee an HDI-topping result. Plenty of oil-wealthy countries don't rank nearly as high. Norway specifically directed its oil revenue into a sovereign wealth fund and sustained public investment in healthcare and education, rather than letting rising income alone stand in for development. That's the exact mechanism HDI is designed to reveal — income that actually gets converted into longer, healthier, better-educated lives, instead of income that just sits there as a number.<br/><br/><b>Why was an index like this even necessary if GDP already existed?</b><br/><br/>Because Haq and Sen had seen countries with similar income levels produce very different real living standards, and they wanted a measure that couldn't be gamed by income alone. A country with high income but weak public health and education investment shouldn't automatically outscore a country with lower income but strong outcomes in both.<br/><br/><b>Does a top HDI ranking mean life in Norway is equally good for absolutely everyone?</b><br/><br/>No, and this is worth being honest about. HDI is a national average, so it can mask internal inequality — though Norway's income inequality is also comparatively low by global standards, which helps. It also doesn't measure environmental sustainability or political freedom directly. A top HDI ranking answers a specific, narrower question: is income being converted into health and education for the typical person. It isn't a claim that a country is perfect.<br/><br/><b>If you were comparing two countries with identical GDP per capita — one investing heavily in public health and education, the other spending similarly heavily on, say, military infrastructure — would you expect their HDI scores to be the same?</b><br/><br/>No. This is exactly the scenario HDI is built to distinguish. Identical income doesn't guarantee identical HDI, since the education and life-expectancy components depend on how that income actually gets used, not just how much of it exists in the first place.<br/><br/><b>So does Norway's HDI ranking prove it has "solved" development?</b><br/><br/>It proves Norway has converted its income into unusually strong health and education outcomes, which is genuinely rare and worth understanding closely. But HDI was never designed to certify perfection — only to check whether income and wellbeing are actually moving together, rather than income moving up while wellbeing stays flat.`,
      chapter: 'CHAPTER 1',
      takeaways: [
        'Norway has ranked at or near the top of the HDI for many consecutive years.',
        'Its high income comes partly from North Sea oil, managed through a sovereign wealth fund.',
        'Not every oil-wealthy country achieves Norway\'s HDI ranking — sustained public investment in health and education is what separates it.',
        'HDI exists because similar-income countries can produce very different real health and education outcomes.',
        'A top HDI ranking doesn\'t mean a country has solved every dimension of development, including internal inequality.'
      ]
    }
  },
  4: {
    concept: {
      title: "What Does It Mean to Be Poor?",
      text: "Placeholder text.",
      chapter: 'CHAPTER 1',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Absolute vs Relative Poverty",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 1',
      takeaways: ['Placeholder takeaway']
    }
  },
  5: {
    concept: {
      title: "How the Modern World Became Rich",
      text: "Placeholder text.",
      chapter: 'CHAPTER 1',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Historical Growth Since 1800",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 1',
      takeaways: ['Placeholder takeaway']
    }
  },
  6: {
    concept: {
      title: "How Countries Move from Poverty to Prosperity",
      text: "Placeholder text.",
      chapter: 'CHAPTER 1',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Development Stages",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 1',
      takeaways: ['Placeholder takeaway']
    }
  },
  8: {
    concept: {
      title: "How Economies Grow Over Time",
      text: "Placeholder text.",
      chapter: 'CHAPTER 2',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "The Solow Growth Model",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 2',
      takeaways: ['Placeholder takeaway']
    }
  },
  9: {
    concept: {
      title: "Why More Investment Isn't Always Enough",
      text: "Placeholder text.",
      chapter: 'CHAPTER 2',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Capital Accumulation & Diminishing Returns",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 2',
      takeaways: ['Placeholder takeaway']
    }
  },
  10: {
    concept: {
      title: "Can Poor Countries Catch Up?",
      text: "Placeholder text.",
      chapter: 'CHAPTER 2',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Convergence Hypothesis",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 2',
      takeaways: ['Placeholder takeaway']
    }
  },
  11: {
    concept: {
      title: "Why Some Countries Never Catch Up",
      text: "Placeholder text.",
      chapter: 'CHAPTER 2',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Why Convergence Sometimes Fails",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 2',
      takeaways: ['Placeholder takeaway']
    }
  },
  12: {
    concept: {
      title: "Why Innovation Creates Long-Term Growth",
      text: "Placeholder text.",
      chapter: 'CHAPTER 2',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Endogenous Growth & Innovation",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 2',
      takeaways: ['Placeholder takeaway']
    }
  },
  13: {
    concept: {
      title: "The Hidden Engine of Economic Growth",
      text: "Placeholder text.",
      chapter: 'CHAPTER 2',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Total Factor Productivity",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 2',
      takeaways: ['Placeholder takeaway']
    }
  },
  15: {
    concept: {
      title: "How Unequal Is Too Unequal?",
      text: "Placeholder text.",
      chapter: 'CHAPTER 3',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "The Gini Coefficient",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 3',
      takeaways: ['Placeholder takeaway']
    }
  },
  16: {
    concept: {
      title: "Why Some People Stay Poor for Generations",
      text: "Placeholder text.",
      chapter: 'CHAPTER 3',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Poverty Traps",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 3',
      takeaways: ['Placeholder takeaway']
    }
  },
  17: {
    concept: {
      title: "Can Growth Make Inequality Worse?",
      text: "Placeholder text.",
      chapter: 'CHAPTER 3',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "The Inequality–Growth Debate",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 3',
      takeaways: ['Placeholder takeaway']
    }
  },
  18: {
    concept: {
      title: "Can Cash Really Reduce Poverty?",
      text: "Placeholder text.",
      chapter: 'CHAPTER 3',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Conditional Cash Transfers",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 3',
      takeaways: ['Placeholder takeaway']
    }
  },
  19: {
    concept: {
      title: "Why Where You Live Matters",
      text: "Placeholder text.",
      chapter: 'CHAPTER 3',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Urban–Rural Poverty Gaps",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 3',
      takeaways: ['Placeholder takeaway']
    }
  },
  20: {
    concept: {
      title: "Looking Beyond Income to Measure Poverty",
      text: "Placeholder text.",
      chapter: 'CHAPTER 3',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Multidimensional Poverty Measurement",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 3',
      takeaways: ['Placeholder takeaway']
    }
  },
  22: {
    concept: {
      title: "Why Education Is a Country's Greatest Investment",
      text: "Placeholder text.",
      chapter: 'CHAPTER 4',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Education as Economic Investment",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 4',
      takeaways: ['Placeholder takeaway']
    }
  },
  23: {
    concept: {
      title: "How Better Health Builds Stronger Economies",
      text: "Placeholder text.",
      chapter: 'CHAPTER 4',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Health & Productivity",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 4',
      takeaways: ['Placeholder takeaway']
    }
  },
  24: {
    concept: {
      title: "Why Population Changes Matter",
      text: "Placeholder text.",
      chapter: 'CHAPTER 4',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Demographic Transition",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 4',
      takeaways: ['Placeholder takeaway']
    }
  },
  25: {
    concept: {
      title: "When a Young Population Becomes an Economic Advantage",
      text: "Placeholder text.",
      chapter: 'CHAPTER 4',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Demographic Dividend",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 4',
      takeaways: ['Placeholder takeaway']
    }
  },
  26: {
    concept: {
      title: "Why Talented People Leave Their Home Countries",
      text: "Placeholder text.",
      chapter: 'CHAPTER 4',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Human Capital Flight — 'Brain Drain'",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 4',
      takeaways: ['Placeholder takeaway']
    }
  },
  27: {
    concept: {
      title: "Why Skills Can Matter More Than a University Degree",
      text: "Placeholder text.",
      chapter: 'CHAPTER 4',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Vocational & Skills Training",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 4',
      takeaways: ['Placeholder takeaway']
    }
  },
  29: {
    concept: {
      title: "Why Ownership Creates Opportunity",
      text: "Placeholder text.",
      chapter: 'CHAPTER 5',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Property Rights",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 5',
      takeaways: ['Placeholder takeaway']
    }
  },
  30: {
    concept: {
      title: "Why Trust and Rules Build Wealth",
      text: "Placeholder text.",
      chapter: 'CHAPTER 5',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Rule of Law & Growth",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 5',
      takeaways: ['Placeholder takeaway']
    }
  },
  31: {
    concept: {
      title: "How Corruption Slows Economic Progress",
      text: "Placeholder text.",
      chapter: 'CHAPTER 5',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Corruption's Economic Costs",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 5',
      takeaways: ['Placeholder takeaway']
    }
  },
  32: {
    concept: {
      title: "Can Institutions Matter More Than Geography?",
      text: "Placeholder text.",
      chapter: 'CHAPTER 5',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Institutions vs. Geography Debate",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 5',
      takeaways: ['Placeholder takeaway']
    }
  },
  33: {
    concept: {
      title: "How Countries Transform Their Governments",
      text: "Placeholder text.",
      chapter: 'CHAPTER 5',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Governance Reform",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 5',
      takeaways: ['Placeholder takeaway']
    }
  },
  34: {
    concept: {
      title: "Why Stable Money Matters for Growth",
      text: "Placeholder text.",
      chapter: 'CHAPTER 5',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Central Bank Independence",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 5',
      takeaways: ['Placeholder takeaway']
    }
  },
  36: {
    concept: {
      title: "How Countries Find Their Place in the World Economy",
      text: "Placeholder text.",
      chapter: 'CHAPTER 6',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Comparative Advantage in Development",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 6',
      takeaways: ['Placeholder takeaway']
    }
  },
  37: {
    concept: {
      title: "How Exports Can Transform an Economy",
      text: "Placeholder text.",
      chapter: 'CHAPTER 6',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Export-Led Growth",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 6',
      takeaways: ['Placeholder takeaway']
    }
  },
  38: {
    concept: {
      title: "Why Foreign Companies Invest in Some Countries",
      text: "Placeholder text.",
      chapter: 'CHAPTER 6',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "FDI in Development",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 6',
      takeaways: ['Placeholder takeaway']
    }
  },
  39: {
    concept: {
      title: "Why Natural Resources Can Be a Blessing or a Curse",
      text: "Placeholder text.",
      chapter: 'CHAPTER 6',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "The Resource Curse",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 6',
      takeaways: ['Placeholder takeaway']
    }
  },
  40: {
    concept: {
      title: "Should Countries Open Their Economies?",
      text: "Placeholder text.",
      chapter: 'CHAPTER 6',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Trade Liberalization Debates",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 6',
      takeaways: ['Placeholder takeaway']
    }
  },
  41: {
    concept: {
      title: "How Countries Grow Together Through Trade",
      text: "Placeholder text.",
      chapter: 'CHAPTER 6',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Regional Trade Blocs",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 6',
      takeaways: ['Placeholder takeaway']
    }
  },
  43: {
    concept: {
      title: "From Fishing Village to Technology Hub",
      text: "Placeholder text.",
      chapter: 'CHAPTER 7',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Agriculture-to-Industry Transition",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 7',
      takeaways: ['Placeholder takeaway']
    }
  },
  44: {
    concept: {
      title: "Why Cities Become Engines of Growth",
      text: "Placeholder text.",
      chapter: 'CHAPTER 7',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Urbanization & Growth",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 7',
      takeaways: ['Placeholder takeaway']
    }
  },
  45: {
    concept: {
      title: "The Economy You Don't Always See",
      text: "Placeholder text.",
      chapter: 'CHAPTER 7',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "The Informal Economy",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 7',
      takeaways: ['Placeholder takeaway']
    }
  },
  46: {
    concept: {
      title: "Why Some Workers Are Left Behind",
      text: "Placeholder text.",
      chapter: 'CHAPTER 7',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Labor Market Dualism",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 7',
      takeaways: ['Placeholder takeaway']
    }
  },
  47: {
    concept: {
      title: "How Manufacturing Creates Prosperity",
      text: "Placeholder text.",
      chapter: 'CHAPTER 7',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Manufacturing-Led Development",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 7',
      takeaways: ['Placeholder takeaway']
    }
  },
  48: {
    concept: {
      title: "How Services Drive Modern Economies",
      text: "Placeholder text.",
      chapter: 'CHAPTER 7',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Services-Led Development",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 7',
      takeaways: ['Placeholder takeaway']
    }
  },
  50: {
    concept: {
      title: "Can Foreign Aid Really Change Countries?",
      text: "Placeholder text.",
      chapter: 'CHAPTER 8',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Foreign Aid Effectiveness Debate",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 8',
      takeaways: ['Placeholder takeaway']
    }
  },
  51: {
    concept: {
      title: "How People Abroad Support Their Home Economies",
      text: "Placeholder text.",
      chapter: 'CHAPTER 8',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Remittances as Development Finance",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 8',
      takeaways: ['Placeholder takeaway']
    }
  },
  52: {
    concept: {
      title: "Can Small Loans Change People's Lives?",
      text: "Placeholder text.",
      chapter: 'CHAPTER 8',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Microfinance",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 8',
      takeaways: ['Placeholder takeaway']
    }
  },
  53: {
    concept: {
      title: "How Mobile Money Brings Banking to Everyone",
      text: "Placeholder text.",
      chapter: 'CHAPTER 8',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Financial Inclusion",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 8',
      takeaways: ['Placeholder takeaway']
    }
  },
  54: {
    concept: {
      title: "Why Countries Fall Into Debt Crises",
      text: "Placeholder text.",
      chapter: 'CHAPTER 8',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Sovereign Debt & Development",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 8',
      takeaways: ['Placeholder takeaway']
    }
  },
  55: {
    concept: {
      title: "How Uzbekistan Is Building Its Future",
      text: "Placeholder text.",
      chapter: 'CHAPTER 8',
      summary: 'Placeholder summary.',
      takeaways: ['Placeholder takeaway 1']
    },
    article: {
      title: "Uzbekistan's Development Path",
      summary: "Placeholder article summary.",
      text: "Placeholder article text.",
      chapter: 'CHAPTER 8',
      takeaways: ['Placeholder takeaway']
    }
  }
};

