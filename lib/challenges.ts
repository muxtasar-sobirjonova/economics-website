export interface DailyChallenge {
  id: number;
  title: string;
  prompt: string;
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: 1, title: 'Waste Reduction', prompt: 'A local bakery throws away 20% of its bread every evening. If you were the owner, how would you reduce this waste while keeping customers happy?' },
  { id: 2, title: 'Pricing Strategy', prompt: 'You run a car wash. On rainy days, you get zero customers. How could you restructure your pricing or services to make money even when it rains?' },
  { id: 3, title: 'The Convenience Premium', prompt: 'People pay $4 for a bottle of water at the airport but only $0.50 at the grocery store. Identify one service in your town where people are paying a massive premium purely for convenience.' },
  { id: 4, title: 'Friction Hunting', prompt: 'Think about the last time you bought groceries. What was the most annoying part of the experience? How could a business solve that specific friction point?' },
  { id: 5, title: 'Opportunity Costs', prompt: 'You have a free weekend. You can either study to improve a high-paying skill or work a minimum-wage shift. Which choice has the higher opportunity cost and why?' },
  { id: 6, title: 'Bundling', prompt: 'A gym is losing members to a cheaper competitor. Instead of lowering prices, how could they bundle other services to make their current price feel like a bargain?' },
  { id: 7, title: 'Unused Assets', prompt: 'A restaurant is completely empty from 2 PM to 5 PM every day. How could they monetize that space during those three hours without serving food?' },
  { id: 8, title: 'Customer Acquisition', prompt: 'You just started a lawn care business, but you have zero budget for advertising. What is the most cost-effective way to get your first 5 paying customers?' },
  { id: 9, title: 'Perceived Value', prompt: 'Two identical t-shirts are sold in different stores. One costs $10, the other $50. Aside from the logo, what elements of the store experience justify the $40 difference?' },
  { id: 10, title: 'Subscription Models', prompt: 'Think of a product that people usually buy once every few years (like a mattress or a bicycle). How could you turn that into a monthly subscription service?' },
  { id: 11, title: 'The Lemons Problem', prompt: 'When buying a used laptop, buyers worry it might be broken, so they demand a lower price. How can a seller prove their laptop is high quality to get a premium price?' },
  { id: 12, title: 'Economies of Scale', prompt: 'Baking one cake at home takes 2 hours. A factory bakes 1,000 cakes in 2 hours. What specific advantages does the factory have that you don\'t?' },
  { id: 13, title: 'Switching Costs', prompt: 'Why is it so hard to get people to switch from Apple to Android, or vice versa? How could a new phone company overcome these high switching costs?' },
  { id: 14, title: 'Niche Markets', prompt: 'Instead of opening a generic coffee shop, you decide to serve only one very specific type of customer. Who is your target audience, and why is this a better strategy?' },
  { id: 15, title: 'Scarcity', prompt: 'A sneaker company purposely releases only 500 pairs of a new shoe, even though 10,000 people want them. Why would they choose to lose out on those 9,500 sales?' },
  { id: 16, title: 'Asymmetric Information', prompt: 'You are applying for a job, but the employer doesn\'t know your true work ethic. What "signals" can you send during the interview to prove your hidden value?' },
  { id: 17, title: 'Complementary Goods', prompt: 'Hot dogs and hot dog buns are complementary goods. If you invent a revolutionary new hot dog, what happens to the demand for buns, and how can you profit from both?' },
  { id: 18, title: 'Network Effects', prompt: 'A social network with only one user is useless. If you are launching a new community app, how do you convince the first 100 people to join when no one else is there?' },
  { id: 19, title: 'Sunk Cost Fallacy', prompt: 'You\'ve spent 6 months building an app, but nobody wants to use it. Do you spend another 6 months fixing it, or abandon it? Why is it hard to walk away?' },
  { id: 20, title: 'Loss Aversion', prompt: 'People hate losing $10 more than they enjoy winning $10. How can a software company use this psychological quirk to increase their free-trial conversion rate?' },
  { id: 21, title: 'Price Discrimination', prompt: 'Movie theaters charge seniors and students less for the exact same ticket. Why is this more profitable than charging everyone the exact same average price?' },
  { id: 22, title: 'The Razor and Blades Model', prompt: 'Printers are sold cheaply, but ink is incredibly expensive. What other industry could successfully adopt this strategy of practically giving away the core product?' },
  { id: 23, title: 'Time vs. Money', prompt: 'Some people take a 4-hour bus ride to save $50, while others pay $200 for a 1-hour flight. If you are starting a delivery business, which customer type should you target and why?' },
  { id: 24, title: 'Gamification', prompt: 'Duolingo turns learning a language into a game. How could you use points, streaks, or leaderboards to make a boring chore (like doing taxes or saving money) engaging?' },
  { id: 25, title: 'The MVP (Minimum Viable Product)', prompt: 'You want to build an app that connects dog walkers with pet owners. What is the absolute simplest, cheapest way to test this idea before writing any code?' },
  { id: 26, title: 'Paradox of Choice', prompt: 'A menu with 100 items often overwhelms customers, leading them to order nothing or regret their choice. How would you redesign a massive menu to increase sales?' },
  { id: 27, title: 'Freemium', prompt: 'Spotify offers a free tier with ads and a premium tier without ads. What is the biggest risk of offering a free version of a digital product?' },
  { id: 28, title: 'Arbitrage', prompt: 'Arbitrage is buying low in one market and selling high in another. Can you identify an item currently sold cheaply in physical stores that sells for a premium online?' },
  { id: 29, title: 'Outsourcing', prompt: 'You run a successful one-person design agency, but you are turning away clients because you lack time. What specific tasks should you outsource first, and what should you keep doing yourself?' },
  { id: 30, title: 'Inelastic Demand', prompt: 'People will buy insulin no matter how high the price goes. Name a non-medical product that has highly inelastic demand, and explain why consumers are trapped.' },
  { id: 31, title: 'Brand Loyalty', prompt: 'Why do people wait in line for hours for a specific brand of coffee when the shop next door sells similar coffee with zero wait? What invisible value are they buying?' },
  { id: 32, title: 'B2B vs B2C', prompt: 'Selling software to one massive corporation vs. selling it to 1,000 individuals. Which approach has a higher initial cost of acquisition, and which is more stable long-term?' },
  { id: 33, title: 'The Long Tail', prompt: 'A bookstore can only stock 5,000 physical books, but Amazon can stock millions. How does selling a huge variety of unpopular items rival the strategy of selling a few massive hits?' },
  { id: 34, title: 'Customer Lifetime Value (LTV)', prompt: 'It costs you $20 in marketing to acquire a new coffee shop customer. They buy a $5 coffee. Why might this still be a highly profitable business model?' },
  { id: 35, title: 'Pivot', prompt: 'Your new bakery makes amazing cupcakes, but nobody is buying them. However, everyone asks if you sell the custom frosting by the jar. Do you stick to cupcakes or pivot to frosting? Why?' },
  { id: 36, title: 'Blue Ocean Strategy', prompt: 'Instead of competing in a crowded market (a "red ocean"), how could a new airline create a "blue ocean" by offering something entirely different from standard flights?' },
  { id: 37, title: 'Moral Hazard', prompt: 'If people know their insurance covers 100% of theft, they might leave their doors unlocked. How do insurance companies design policies to make sure you still care about the risk?' },
  { id: 38, title: 'Painkillers vs. Vitamins', prompt: 'A "painkiller" solves an urgent problem; a "vitamin" is nice to have but not urgent. Look at the apps on your phone. Which ones are painkillers, and which are vitamins?' },
  { id: 39, title: 'Cross-selling', prompt: 'When you buy a burger, they ask, "Do you want fries with that?" If you sell websites to small businesses, what is the equivalent "fries" you should be cross-selling?' },
  { id: 40, title: 'The Founder\'s Trap', prompt: 'A founder insists on approving every single decision, causing the company to grow incredibly slowly. How can a founder successfully transition from "doing everything" to "managing managers"?' }
];
